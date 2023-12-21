import './App.css'
import {Environment, OrbitControls, Plane, SpotLight, useTexture} from "@react-three/drei";
import {Canvas} from "@react-three/fiber";
import {useControls} from "leva";
import {
    EffectComposer,
    Bloom,
    ChromaticAberration,
} from "@react-three/postprocessing";
import {BlendFunction} from "postprocessing";
import {Spider} from "./components/Porsche_spider";

import * as THREE from 'three';

function Terrain() {

    const terrainTextures = useTexture({
        map: "textures/terrain_albedo.jpg",
        aoMap: "textures/terrain_ao.jpg",
        roughnessMap: "textures/terrain_roughness.jpg",
        normalMap: "textures/terrain_normal.jpg",
        displacementMap: "textures/terrain_displacement.jpg",
    });

// Set repeat for each texture
    terrainTextures.map.repeat.set(2, 2);
    terrainTextures.map.wrapS = terrainTextures.map.wrapT = THREE.RepeatWrapping;

    terrainTextures.aoMap.repeat.set(2, 2);
    terrainTextures.aoMap.wrapS = terrainTextures.aoMap.wrapT = THREE.RepeatWrapping;

    terrainTextures.roughnessMap.repeat.set(2, 2);
    terrainTextures.roughnessMap.wrapS = terrainTextures.roughnessMap.wrapT = THREE.RepeatWrapping;

    terrainTextures.normalMap.repeat.set(2, 2);
    terrainTextures.normalMap.wrapS = terrainTextures.normalMap.wrapT = THREE.RepeatWrapping;

    terrainTextures.displacementMap.repeat.set(2, 2);
    terrainTextures.displacementMap.wrapS = terrainTextures.displacementMap.wrapT = THREE.RepeatWrapping;

    const {displacementScale} = useControls({
        displacementScale: {
            value: 0.05,
            min: 0,
            max: 1,
        },
    });

    const {planeScale} = useControls({
        planeScale: {
            value: 45,
            min: 5,
            max: 80,
        },
    });

    return (
        <group>
            <Plane args={[planeScale, planeScale, 500, 500]} rotation-x={-Math.PI / 2} receiveShadow>
                <meshStandardMaterial
                    {...terrainTextures}
                    displacementScale={displacementScale}
                    envMapIntensity={0}
                    normalScale={[0.15, 0.15]}
                    dithering={true}
                    color={[0.015, 0.015, 0.015]}
                    blur={[1000, 400]} // Blur ground reflections (width, heigt), 0 skips blur
                    mixBlur={30} // How much blur mixes with surface roughness (default = 1)
                    mixStrength={80} // Strength of the reflections
                    mixContrast={1} // Contrast of the reflections
                    resolution={1024} // Off-buffer resolution, lower=faster, higher=better quality, slower
                    mirror={0} // Mirror environment, 0 = texture colors, 1 = pick up env colors
                    depthScale={0.01} // Scale the depth factor (0 = no depth, default = 0)
                    minDepthThreshold={0.9} // Lower edge for the depthTexture interpolation (default = 0)
                    maxDepthThreshold={1} // Upper edge for the depthTexture interpolation (default = 0)
                    depthToBlurRatioBias={0.25} // Adds a bias factor to the depthTexture before calculating the blur amount [blurFactor = blurTexture * (depthTexture + bias)]. It accepts values between 0 and 1, default is 0.25. An amount > 0 of bias makes sure that the blurTexture is not too sharp because of the multiplication with the depthTexture
                    debug={0}
                    reflectorOffset={0.2} // Offsets the virtual camera that projects the reflection. Useful when the reflective surface is some distance from the object's origin (default = 0)
                />
            </Plane>
        </group>
    )
}

function ThreeContent() {

    const {lightMagenta} = useControls({
        lightMagenta: {
            value: 400,
            min: 0,
            max: 800,
        }
    })

    const {lightCyan} = useControls({
        lightCyan: {
            value: 500,
            min: 0,
            max: 1100,
        }
    })

    return (
        <>
            <pointLight
                color={[1, 0.25, 0.7]}
                intensity={lightMagenta
                }
                angle={0.6}
                penumbra={0.5}
                position={[8, 5, 0]}
                castShadow
                shadow-bias={-0.0001}
            />
            <pointLight
                color={[0.14, 0.5, 1]}
                intensity={lightCyan}
                angle={1}
                penumbra={0.5}
                position={[-5, 5, 0]}
                castShadow
                shadow-bias={-0.0001}
            />
            <SpotLight
                rotation={250}
                color={"#b3c6e5"}
                intensity={800}
                angle={8}
                penumbra={0.5}
                position={[1.6, 1.5, 5]}
                castShadow
                shadow-bias={-0.0001}
            />
            <SpotLight
                rotation={250}
                color={"#b3c6e5"}
                intensity={800}
                angle={8}
                penumbra={0.5}
                position={[-1.4, 1.5, 5]}
                castShadow
                shadow-bias={-0.0001}
            />
            <OrbitControls/>
            <Terrain castShadow/>
            <Spider scale={2.3} castShadow/>
            <color attach="background" args={['#000']}/>
            <Environment
                background={false}
                preset="dawn"
            />

            <EffectComposer>
                {/*<DepthOfField focusDistance={0.0035} focalLength={0.01} bokehScale={1} height={800} />*/}
                <Bloom
                    blendFunction={BlendFunction.ADD}
                    intensity={.05} // The bloom intensity.
                    width={300} // render width
                    height={300} // render height
                    kernelSize={1} // blur kernel size
                    luminanceThreshold={0.15} // luminance threshold. Raise this value to mask out darker elements in the scene.
                    luminanceSmoothing={0.025} // smoothness of the luminance threshold. Range is [0, 1]
                />
                <ChromaticAberration
                    blendFunction={BlendFunction.NORMAL} // blend mode
                    offset={[0.0005, 0.0012]} // color offset
                />
            </EffectComposer>
        </>
    )
}

function ThreeScene() {
    return (
        <Canvas camera={{position: [0, 10, 5]}} shadowMap>
            <ThreeContent/>
        </Canvas>
    )
}

function App() {

    return (
        <div>
            <ThreeScene/>
        </div>
    )
}

export default App
