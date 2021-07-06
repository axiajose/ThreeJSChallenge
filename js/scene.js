import { GLTFLoader } from '/build/GLTFLoader.js';

var globe;
let text;
const loader = new GLTFLoader();
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight);
camera.position.z = 5;
const light = new THREE.PointLight(0xffffff, 3, 1000);
light.position.set(0, 0, 10);
scene.add(light);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
const div = document.createElement("div");

function modelLoader(url) {
    return new Promise((resolve, reject) => {
        loader.load(url, data => resolve(data), null, reject);
    });
}

async function main() {
    const gltfData = await modelLoader("/models/sinclair-globe.gltf"),

        model = gltfData.scene;
    scene.add(model);
    gltfData.scene.traverse(function(child) {
        if (child.name == "Earth") {
            globe = child;
        } else if (child.name == "Text") {
            text = child;
        }
    });
    document.body.removeChild(document.querySelector(".loader"));
    document.body.appendChild(div);
    div.appendChild(renderer.domElement);
    animate();
}

main().catch(error => {
    console.error(error);
});

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

const animate = function() {
    requestAnimationFrame(animate);
    onWindowResize();
    text.rotation.z += -0.002;
    globe.rotation.y += -0.003;
    renderer.render(scene, camera);
}