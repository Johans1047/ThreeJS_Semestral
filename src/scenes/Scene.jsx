import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei"

import TreeA from "../models/TreeA";

export default function Scene() {
    return (
        <Canvas style={{background: "#172554"}}>
            <OrbitControls/>
            {/*eslint-disable-next-line react/no-unknown-property*/}
            <ambientLight intensity={0.25}/>

            {/*eslint-disable-next-line react/no-unknown-property*/}
            <directionalLight position={[5, 5, 5]} intensity={1} />

            <TreeA/>
        </Canvas>
    );
}