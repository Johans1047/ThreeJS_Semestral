import { useLoader } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

export default function TreeA() {
    const model = useLoader(FBXLoader, "/models/TreeA.fbx");
    return (
        // eslint-disable-next-line react/no-unknown-property
        <primitive object={model} />
    );
}