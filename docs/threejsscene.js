
const blendshapesMap = {
    // '_neutral': '',
    'browDownLeft': 'browDown_L',
    'browDownRight': 'browDown_R',
    'browInnerUp': 'browInnerUp',
    'browOuterUpLeft': 'browOuterUp_L',
    'browOuterUpRight': 'browOuterUp_R',
    'cheekPuff': 'cheekPuff',
    'cheekSquintLeft': 'cheekSquint_L',
    'cheekSquintRight': 'cheekSquint_R',
    'eyeBlinkLeft': 'eyeBlink_L',
    'eyeBlinkRight': 'eyeBlink_R',
    'eyeLookDownLeft': 'eyeLookDown_L',
    'eyeLookDownRight': 'eyeLookDown_R',
    'eyeLookInLeft': 'eyeLookIn_L',
    'eyeLookInRight': 'eyeLookIn_R',
    'eyeLookOutLeft': 'eyeLookOut_L',
    'eyeLookOutRight': 'eyeLookOut_R',
    'eyeLookUpLeft': 'eyeLookUp_L',
    'eyeLookUpRight': 'eyeLookUp_R',
    'eyeSquintLeft': 'eyeSquint_L',
    'eyeSquintRight': 'eyeSquint_R',
    'eyeWideLeft': 'eyeWide_L',
    'eyeWideRight': 'eyeWide_R',
    'jawForward': 'jawForward',
    'jawLeft': 'jawLeft',
    'jawOpen': 'jawOpen',
    'jawRight': 'jawRight',
    'mouthClose': 'mouthClose',
    'mouthDimpleLeft': 'mouthDimple_L',
    'mouthDimpleRight': 'mouthDimple_R',
    'mouthFrownLeft': 'mouthFrown_L',
    'mouthFrownRight': 'mouthFrown_R',
    'mouthFunnel': 'mouthFunnel',
    'mouthLeft': 'mouthLeft',
    'mouthLowerDownLeft': 'mouthLowerDown_L',
    'mouthLowerDownRight': 'mouthLowerDown_R',
    'mouthPressLeft': 'mouthPress_L',
    'mouthPressRight': 'mouthPress_R',
    'mouthPucker': 'mouthPucker',
    'mouthRight': 'mouthRight',
    'mouthRollLower': 'mouthRollLower',
    'mouthRollUpper': 'mouthRollUpper',
    'mouthShrugLower': 'mouthShrugLower',
    'mouthShrugUpper': 'mouthShrugUpper',
    'mouthSmileLeft': 'mouthSmile_L',
    'mouthSmileRight': 'mouthSmile_R',
    'mouthStretchLeft': 'mouthStretch_L',
    'mouthStretchRight': 'mouthStretch_R',
    'mouthUpperUpLeft': 'mouthUpperUp_L',
    'mouthUpperUpRight': 'mouthUpperUp_R',
    'noseSneerLeft': 'noseSneer_L',
    'noseSneerRight': 'noseSneer_R',
    // '': 'tongueOut'
};


function mapHandLandmarks(landmarks, hand) {
    var x = calculateAngle(landmarks[0][6], landmarks[0][7], landmarks[0][8]);
    var index3 = model.getObjectByName("mixamorig" + hand + "HandIndex3");
    index3.rotation.set(0, 0, x * Math.PI/180, "XYZ");
    
    x = calculateAngle(landmarks[0][5], landmarks[0][6], landmarks[0][7]);
    var index2 = model.getObjectByName("mixamorig" + hand + "HandIndex2");
    index2.rotation.set(0, 0, x * Math.PI/180, "XYZ");

    x = calculateAngle(landmarks[0][0], landmarks[0][5], landmarks[0][6]);
    var index1 = model.getObjectByName("mixamorig" + hand + "HandIndex1");
    index1.rotation.set(0, 0, x * Math.PI/180, "XYZ");

    x = calculateAngle(landmarks[0][10], landmarks[0][11], landmarks[0][12]);
    var middle3 = model.getObjectByName("mixamorig" + hand + "HandMiddle3");
    middle3.rotation.set(0, 0, x * Math.PI/180, "XYZ");

    x = calculateAngle(landmarks[0][9], landmarks[0][10], landmarks[0][11]);
    var middle2 = model.getObjectByName("mixamorig" + hand + "HandMiddle2");
    middle2.rotation.set(0, 0, x * Math.PI/180, "XYZ");

    x = calculateAngle(landmarks[0][0], landmarks[0][9], landmarks[0][10]);
    var middle1 = model.getObjectByName("mixamorig" + hand + "HandMiddle1");
    middle1.rotation.set(0, 0, x * Math.PI/180, "XYZ");

    x = calculateAngle(landmarks[0][14], landmarks[0][15], landmarks[0][16]);
    var ring3 = model.getObjectByName("mixamorig" + hand + "HandRing3");
    ring3.rotation.set(0, 0, x * Math.PI/180, "XYZ");

    x = calculateAngle(landmarks[0][13], landmarks[0][14], landmarks[0][15]);
    var ring2 = model.getObjectByName("mixamorig" + hand + "HandRing2");
    ring2.rotation.set(0, 0, x * Math.PI/180, "XYZ");

    x = calculateAngle(landmarks[0][0], landmarks[0][13], landmarks[0][14]);
    var ring1 = model.getObjectByName("mixamorig" + hand + "HandRing1");
    ring1.rotation.set(0, 0, x * Math.PI/180, "XYZ");

    x = calculateAngle(landmarks[0][18], landmarks[0][19], landmarks[0][20]);
    var pinky3 = model.getObjectByName("mixamorig" + hand + "HandPinky3");
    pinky3.rotation.set(0, 0, x * Math.PI/180, "XYZ");

    x = calculateAngle(landmarks[0][17], landmarks[0][18], landmarks[0][19]);
    var pinky2 = model.getObjectByName("mixamorig" + hand + "HandPinky2");
    pinky2.rotation.set(0, 0, x * Math.PI/180, "XYZ");

    x = calculateAngle(landmarks[0][0], landmarks[0][17], landmarks[0][18]);
    var pinky1 = model.getObjectByName("mixamorig" + hand + "HandPinky1");
    pinky1.rotation.set(0, 0, x * Math.PI/180, "XYZ");

    x = calculateAngle(landmarks[0][2], landmarks[0][3], landmarks[0][4]);
    var thumb3 = model.getObjectByName("mixamorig" + hand + "HandThumb3");
    thumb3.rotation.set(0, 0, x * Math.PI/180, "XYZ");

    x = calculateAngle(landmarks[0][1], landmarks[0][2], landmarks[0][3]);
    var thumb2 = model.getObjectByName("mixamorig" + hand + "HandThumb2");
    thumb2.rotation.set(0, 0, x * Math.PI/180, "XYZ");

    x = calculateAngle(landmarks[0][5], landmarks[0][0], landmarks[0][1]);
    var thumb1 = model.getObjectByName("mixamorig" + hand + "HandThumb1");
    thumb1.rotation.set(0,  -x * Math.PI/180, 0, "XYZ");





}
function calculateAngle(landmarkA, landmarkB, landmarkC) {
    const vectorAB = { x: landmarkB.x - landmarkA.x, y: landmarkB.y - landmarkA.y, z: landmarkB.z - landmarkA.z };
    const vectorBC = { x: landmarkC.x - landmarkB.x, y: landmarkC.y - landmarkB.y, z: landmarkC.z - landmarkB.z };
  
    const dotProduct = vectorAB.x * vectorBC.x + vectorAB.y * vectorBC.y + vectorAB.z * vectorBC.z;
    const magnitudeAB = Math.sqrt(vectorAB.x**2 + vectorAB.y**2 + vectorAB.z**2);
    const magnitudeBC = Math.sqrt(vectorBC.x**2 + vectorBC.y**2 + vectorBC.z**2);
  
    const angle = Math.acos(dotProduct / (magnitudeAB * magnitudeBC));
    return angle * (180 / Math.PI); // Convert from radians to degrees
  }



import * as THREE from "https://cdn.jsdelivr.net/gh/mesquite-mocap/mesquite.cc@latest/build/three.module.js";
import Stats from "https://cdn.jsdelivr.net/gh/mesquite-mocap/mesquite.cc@latest/build/stats.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/gh/mesquite-mocap/mesquite.cc@latest/build/OrbitControls.js";
// import { GLTFLoader } from "./build/GLTFLoader.js";
// import { KTX2Loader } from "./build/KTX2Loader.js";
// import { MeshoptDecoder } from "./build/meshopt_decoder.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/gh/mesquite-mocap/mesquite.cc/build/GLTFLoader.js";
import { KTX2Loader } from "https://cdn.jsdelivr.net/gh/mesquite-mocap/mesquite.cc/build/KTX2Loader.js";
import { MeshoptDecoder } from "https://cdn.jsdelivr.net/gh/mesquite-mocap/mesquite.cc@latest/build/meshopt_decoder.module.js";
import { FBXLoader } from "https://cdn.jsdelivr.net/gh/mesquite-mocap/mesquite.cc@latest/build/FBXLoader.js";
//import { FBXLoader } from "./build/FBXLoader.js";
import { BVHLoader } from "https://cdn.jsdelivr.net/gh/mesquite-mocap/mesquite.cc@latest/build/BVHLoader.js";
// import {BVHLoader} from "./build/BVHLoader.js"


const clock_bvh = new THREE.Clock();
const clock = new THREE.Clock();

let mixer;



init();
animate();


$('.tabs').tabs();
// select the first tab
$('#deviceMapListB').click();
$('#ext').fadeOut(0);



// const worker = new Worker('webworker.js');

// worker.addEventListener('message', (event) => {
//     handleWSMessage(event.data);
// });

// // Connect to the WebSocket using the worker
// worker.postMessage({ type: 'connect' });

function init() {
    // init modal
   // var elems = document.querySelectorAll('.modal');
   // var instances = M.Modal.init(elems, {});
   // manageModal = instances[0];


    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "0px";
    container.style.right = "0px";
    container.style.zIndex = "1000";
    container.style.transform = "scale(0.5)";
    container.style.transformOrigin = "100% 0%";

    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        2000
    );
    camera.position.set(0, 100, 600);

    scene = new THREE.Scene();
    // scene.background = new THREE.Color(0xa0a0a0);
    scene.background = new THREE.Color(0x111111);
    // add transparent background

    // scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    hemiLight.position.set(0, 200, 0);
    scene.add(hemiLight);







    // const dirLight = new THREE.DirectionalLight(0xffffff);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(0, 200, 100);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 180;
    dirLight.shadow.camera.bottom = -100;
    dirLight.shadow.camera.left = -120;
    dirLight.shadow.camera.right = 120;
    scene.add(dirLight);

    const mesh = new THREE.Mesh(

        new THREE.PlaneGeometry(4000, 4000),
        new THREE.MeshStandardMaterial({ color: 0x000000, depthWrite: false })
    );

    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add(mesh);


    const grid = new THREE.GridHelper(4000, 80, 0x444444, 0x444444);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;

    const axesHelper = new THREE.AxesHelper(10);
    scene.add(axesHelper);
    scene.add(grid);

    const circleGeometry = new THREE.CircleGeometry(28, 32);
    // orange border, transparent inside

    const circleMaterial = new THREE.MeshBasicMaterial({ color: 0xff6600, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
    const circle = new THREE.Mesh(circleGeometry, circleMaterial);
    circle.rotation.x = - Math.PI / 2;
    circle.position.y = -.5;
    circle.position.z = 5;

    scene.add(circle);


    // model
    const loader = new FBXLoader();
    //	loader.load( 'models/fbx/Ch14_nonPBR.fbx', function ( object ) {
    loader.load("./" + fbxfile, function (object) {
        model = object;
        model.children[1].material.color.set(0x999999);
        model.children[2].material.color.set(0x222222);

        mixer = new THREE.AnimationMixer(object);
        // console.log(mixer);
        object.traverse(function (child) {
            // console.log(child);
            if(child.name === "mixamorigHead"){
                child.traverse(function (child1) {
                   child1.scale.set(.9, .85, .67);
                });
                
            }
            if (child.isMesh) {
                //child.castShadow = true;
                //child.receiveShadow = true;

            }
            //console.log(child.name);
        });

        scene.add(object);

        var lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
        var lineGeometry = new THREE.BufferGeometry();

        lineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(line_tracker), 3));
        trackingLine = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(trackingLine);
    });

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    // renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // default face 

    const ktx2Loader = new KTX2Loader()
        .setTranscoderPath('build/basis/')
        .detectSupport(renderer);



    new GLTFLoader()
        .setKTX2Loader(ktx2Loader)
        .setMeshoptDecoder(MeshoptDecoder)
        //.load('./facecap.glb', (gltf) => {
        .load('./scene.glb', (gltf) => {
            facemesh = gltf.scene.children[0];
            facemesh.castShadow = false;
            facemesh.receiveShadow = false;
            scene.add(facemesh);


            facemesh.scale.set(10, 9.5, 7.7);
            //facemesh.scale.set(120, 120, 92);


            facemesh.rotation.set(0, 0, 0);

            facemesh.material = new THREE.MeshStandardMaterial({ color: 0xffffff, depthWrite: false });
            facemesh.material.metalness = 1;
            facemesh.material.roughness = 5;

            const controls = new OrbitControls(camera, renderer.domElement);
            controls.target.set(0, 100, 0);
            controls.enableZoom = true;

            controls.update();

            window.addEventListener("resize", onWindowResize, false);
/*
            document.getElementById("splashScreen").style.opacity = "0";
            setTimeout(function () {
                document.getElementById("splashScreen").style.display = "none";
            }, 3000);
            */
        });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

//

function animate() {
    requestAnimationFrame(animate);



    if (model) {
        var head = model.getObjectByName("mixamorigHead");
        if (head && facemesh) {
            head.getWorldPosition(facemesh.position);
            head.getWorldQuaternion(facemesh.quaternion);
        }
    }

    
    if (faceResults && faceResults.faceBlendshapes && faceResults.faceBlendshapes.length > 0) {

        const face = scene.getObjectByName('mesh_2');
        // console.log(faceResults.faceBlendshapes[0].categories);

        const faceBlendshapes = faceResults.faceBlendshapes[0].categories;

        for (const blendshape of faceBlendshapes) {

            const categoryName = blendshape.categoryName;
            const score = blendshape.score;

            const index = face.morphTargetDictionary[blendshapesMap[categoryName]];

            if (index !== undefined) {

                face.morphTargetInfluences[index] = score;

            }

        }

    }


    if (handResults && handResults.multiHandLandmarks && handResults.multiHandLandmarks.length > 0) {
    }

    if(poseResults && poseResults.poseLandmarks && poseResults.poseLandmarks.length > 0){
    }
    
    






    

    renderer.render(scene, camera);

    // stats.update();
}
function init_bvh() {
    // camera_bvh = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
    // camera_bvh.position.set( 0, 200, 300 );

    scene_bvh = new THREE.Scene();

    //  setTimeout("dothistoInit()",0)
}

function animate_bvh() {
    requestAnimationFrame(animate_bvh);

    const delta = clock_bvh.getDelta();


    if (mixer_bvh) {
        mixer_bvh.update(delta);
        // console.log(mixer_bvh.time);
        if (mixer_bvh.time >= animationDuration) {
            animation.paused = true;
            animation.time = animationDuration;
        }
    }

    scene_bvh.traverse(function (child) {
        if (child.type === "Bone") {
            if (child.name === "LeftArm") {
                var q = child.quaternion;
                var bn = model.getObjectByName("mixamorigLeftArm");
                bn.quaternion.set(q.x, q.y, q.z, q.w);
            } else if (child.name === "LeftForeArm") {
                var q = child.quaternion;
                var bn = model.getObjectByName("mixamorigLeftForeArm");
                bn.quaternion.set(q.x, q.y, q.z, q.w);
            } else if (child.name === "LeftHand") {
                var q = child.quaternion;
                var bn = model.getObjectByName("mixamorigLeftHand");
                bn.quaternion.set(q.x, q.y, q.z, q.w);
            } else if (child.name === "LeftUpLeg") {
                var q = child.quaternion;
                var bn = model.getObjectByName("mixamorigLeftUpLeg");
                bn.quaternion.set(q.x, q.y, q.z, q.w);
            } else if (child.name === "LeftLeg") {
                var q = child.quaternion;
                var bn = model.getObjectByName("mixamorigLeftLeg");
                bn.quaternion.set(q.x, q.y, q.z, q.w);
            } else if (child.name === "LeftFoot") {
                var q = child.quaternion;
                var bn = model.getObjectByName("mixamorigLeftFoot");
                bn.quaternion.set(q.x, q.y, q.z, q.w);
            } else if (child.name === "LeftShoulder") {
                var q = child.quaternion;
                var bn = model.getObjectByName("mixamorigLeftShoulder");
                bn.quaternion.set(q.x, q.y, q.z, q.w);
            } else if (child.name === "LeftToeBase") {
                var q = child.quaternion;
                var bn = model.getObjectByName("mixamorigLeftToeBase");
                bn.quaternion.set(q.x, q.y, q.z, q.w);
            } else if (child.name === "RightForeArm") {
                var q = child.quaternion;
                var bn = model.getObjectByName("mixamorigRightForeArm");
                bn.quaternion.set(q.x, q.y, q.z, q.w);
            } else if (child.name === "RightArm") {
                var q = child.quaternion;
                var bn = model.getObjectByName("mixamorigRightArm");
                bn.quaternion.set(q.x, q.y, q.z, q.w);
            } else if (child.name === "RightHand") {
                var q = child.quaternion;
                var bn = model.getObjectByName("mixamorigRightHand");
                bn.quaternion.set(q.x, q.y, q.z, q.w);
            } else if (child.name === "RightUpLeg") {
                var q = child.quaternion;
                var bn = model.getObjectByName("mixamorigRightUpLeg");
                bn.quaternion.set(q.x, q.y, q.z, q.w);
            } else if (child.name === "RightLeg") {
                var q = child.quaternion;
                var bn = model.getObjectByName("mixamorigRightLeg");
                bn.quaternion.set(q.x, q.y, q.z, q.w);
            } else if (child.name === "RightFoot") {
                var q = child.quaternion;
                var bn = model.getObjectByName("mixamorigRightFoot");
                bn.quaternion.set(q.x, q.y, q.z, q.w);
            } else if (child.name === "RightShoulder") {
                var q = child.quaternion;
                var bn = model.getObjectByName("mixamorigRightShoulder");
                bn.quaternion.set(q.x, q.y, q.z, q.w);
            } else if (child.name === "RightToeBase") {
                var q = child.quaternion;
                var bn = model.getObjectByName("mixamorigRightToeBase");
                bn.quaternion.set(q.x, q.y, q.z, q.w);
            } else if (child.name === "Hips") {
                var q = child.quaternion;
                var bn = model.getObjectByName("mixamorigHips");
                bn.quaternion.set(q.x, q.y, q.z, q.w);
            } else if (child.name === "Head") {
                var q = child.quaternion;
                var bn = model.getObjectByName("mixamorigHead");
                bn.quaternion.set(q.x, q.y, q.z, q.w);
            } else if (child.name === "Neck") {
                var q = child.quaternion;
                var bn = model.getObjectByName("mixamorigNeck");
                bn.quaternion.set(q.x, q.y, q.z, q.w);
            } else if (child.name === "Spine") {
                var q = child.quaternion;
                var bn = model.getObjectByName("mixamorigSpine");
                bn.quaternion.set(q.x, q.y, q.z, q.w);
            } else {
                // console.log(child);
            }
            renderer.render(scene, camera);

            // stats.update();
        }
    });
}

function dothistoInit() {
    rightArm = model.getObjectByName("mixamorigRightArm");
    rightArm.quaternion.set(0, 0, 0, 1);
}

/*
document.getElementById("bvhFileInput").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const bvhData = e.target.result;
        loadAndPlayBVH(bvhData);
    };
    reader.readAsText(file);
});
*/

function loadAndPlayBVH(bvhData) {
    // console.log(bvhData);
    init_bvh();
    animate_bvh();
    const loader_bvh = new BVHLoader();
    // console.log(loader_bvh.parse);

    const result = loader_bvh.parse(bvhData);
    animationDuration = result.clip.duration;
    // console.log(animationDuration);

    skeletonHelper_bvh = new THREE.SkeletonHelper(result.skeleton.bones[0]);
    skeletonHelper_bvh.skeleton = result.skeleton;

    const boneContainer = new THREE.Group();
    boneContainer.add(result.skeleton.bones[0]);

    // scene.add(skeletonHelper_bvh);
    // scene.add(boneContainer);
    scene_bvh.add(skeletonHelper_bvh);
    scene_bvh.add(boneContainer);

    mixer_bvh = new THREE.AnimationMixer(skeletonHelper_bvh);
    animation = mixer_bvh.clipAction(result.clip);
    animation.setEffectiveWeight(1.0);
    // console.log(animation);
    animation.play();
}