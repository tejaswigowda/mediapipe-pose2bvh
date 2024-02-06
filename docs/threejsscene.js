import {generateQuaternion} from './poseToQuat.js';

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

function calculateAngle(landmarkA, landmarkB, landmarkC) {
    const vectorAB = { x: landmarkB.x - landmarkA.x, y: landmarkB.y - landmarkA.y, z: landmarkB.z - landmarkA.z };
    const vectorBC = { x: landmarkC.x - landmarkB.x, y: landmarkC.y - landmarkB.y, z: landmarkC.z - landmarkB.z };

    const dotProduct = vectorAB.x * vectorBC.x + vectorAB.y * vectorBC.y + vectorAB.z * vectorBC.z;
    const magnitudeAB = Math.sqrt(vectorAB.x ** 2 + vectorAB.y ** 2 + vectorAB.z ** 2);
    const magnitudeBC = Math.sqrt(vectorBC.x ** 2 + vectorBC.y ** 2 + vectorBC.z ** 2);

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
// import {vec3} from "https://cdnjs.cloudflare.com/ajax/libs/gl-matrix/3.4.2/gl-matrix-min.js";

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
            if (child.name === "mixamorigHead") {
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

            // add cylinder for each bone

            var bones = Object.keys(boneCylinders);
            for (var i = 0; i < bones.length; i++) {
                boneCylinders[bones[i]] = new THREE.Mesh(
                    new THREE.CylinderGeometry(1, 1, 1, 32),
                    new THREE.MeshBasicMaterial({ color: 0xffff00 })
                );
                boneCylinders[bones[i]].visible = true;
                scene.add(boneCylinders[bones[i]]);
            }


        });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

//
function mapHandLandmarks(landmarks, h) {

    var hand = h[0].categoryName;
    console.log(handResults, landmarks, hand);
    // map hand landmarks to model
    var handLandmarks = landmarks;
    var handLandmarksMap = {
        "wrist": 0,
        "thumb1": 1,
        "thumb2": 2,
        "thumb3": 3,
        "thumb4": 4,
        "index1": 5,
        "index2": 6,
        "index3": 7,
        "index4": 8,
        "middle1": 9,
        "middle2": 10,
        "middle3": 11,
        "middle4": 12,
        "ring1": 13,
        "ring2": 14,
        "ring3": 15,
        "ring4": 16,
        "pinky1": 17,
        "pinky2": 18,
        "pinky3": 19,
        "pinky4": 20
    };

    var handLandmarksMapRight = {
        "wrist": 0,
        "thumb1": 1,
        "thumb2": 2,
        "thumb3": 3,
        "thumb4": 4,
        "index1": 5,
        "index2": 6,
        "index3": 7,
        "index4": 8,
        "middle1": 9,
        "middle2": 10,
        "middle3": 11,
        "middle4": 12,
        "ring1": 13,
        "ring2": 14,
        "ring3": 15,
        "ring4": 16,
        "pinky1": 17,
        "pinky2": 18,
        "pinky3": 19,
        "pinky4": 20
    };

    var handLandmarksMapLeft = {
        "wrist": 0,
        "thumb1": 1,
        "thumb2": 2,
        "thumb3": 3,
        "thumb4": 4,
        "index1": 5,
        "index2": 6,
        "index3": 7,
        "index4": 8,
        "middle1": 9,
        "middle2": 10,
        "middle3": 11,
        "middle4": 12,
        "ring1": 13,
        "ring2": 14,
        "ring3": 15,
        "ring4": 16,
        "pinky1": 17,
        "pinky2": 18,
        "pinky3": 19,
        "pinky4": 20
    };

    var handLandmarksMap = hand === "Right" ? handLandmarksMapRight : handLandmarksMapLeft;

    /*
    // map wrist rotation 
    var wrist = model.getObjectByName("mixamorig" + hand + "Hand");
    var wristQuaternion = new THREE.Quaternion();
    var wristRotation = handLandmarks[handLandmarksMap["wrist"]];
    var wristRotationMatrix = new THREE.Matrix4();
    wristRotationMatrix.lookAt(new THREE.Vector3(), new THREE.Vector3(wristRotation.x, wristRotation.y, wristRotation.z), new THREE.Vector3(0, 1, 0));
    wristQuaternion.setFromRotationMatrix(wristRotationMatrix);
    wrist.quaternion.set(wristQuaternion.x, wristQuaternion.y, wristQuaternion.z, wristQuaternion.w);

    // map finger rotations
    var fingers = ["thumb", "index", "middle", "ring", "pinky"];

    */

}


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
        const faceBlendshapes = faceResults.faceBlendshapes[0].categories;
        for (const blendshape of faceBlendshapes) {
            const categoryName = blendshape.categoryName;
            const score = blendshape.score;
            const index = face.morphTargetDictionary[blendshapesMap[categoryName]];

            if (index !== undefined) {
                face.morphTargetInfluences[index] = score;
            }
        }
        // map face orientaion to head

        var faceOrientation = faceResults.facialTransformationMatrixes[0];
        var faceOrientationMatrix = new THREE.Matrix4();
        faceOrientationMatrix.fromArray(faceOrientation.data);
        var faceOrientationQuaternion = new THREE.Quaternion();
        faceOrientationMatrix.decompose(new THREE.Vector3(), faceOrientationQuaternion, new THREE.Vector3());
        //console.log(faceOrientationMatrix, faceOrientationQuaternion);
        var head = model.getObjectByName("mixamorigHead");
        head.quaternion.set(faceOrientationQuaternion.x, faceOrientationQuaternion.y, faceOrientationQuaternion.z, faceOrientationQuaternion.w);
    }


    if (handResults && handResults.landmarks && handResults.landmarks.length > 0) {
        var landmarks = handResults.landmarks[0];
        try {
            mapHandLandmarks(landmarks, handResults.handednesses[0]);
        }
        catch (error) {
            console.log(error);
        }

        if (handResults.landmarks.length > 1) {
            landmarks = handResults.landmarks[1];
            try {
                mapHandLandmarks(landmarks, landmarks.handednesses[1]);
            }
            catch (error) {
                console.log(error);
            }
        }
    }


    if (poseResults && poseResults.worldLandmarks && poseResults.worldLandmarks.length > 0) {
        // position bones

        var landmarks = poseResults.worldLandmarks[0];

        // let {quaternion,angle} = generateQuaternion(landmarks[11], landmarks[12]);
        // console.log(quaternion, angle);
        // var chest = model.getObjectByName("mixamorigSpine");
        // chest.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
      

        // Creating THREE.js vectors for the relevant landmarks
        var leftShoulder = new THREE.Vector3(landmarks[11].x, landmarks[11].y, landmarks[11].z);
        var rightShoulder = new THREE.Vector3(landmarks[12].x, landmarks[12].y, landmarks[12].z);
        var rightElbow = new THREE.Vector3(landmarks[14].x, landmarks[14].y, landmarks[14].z);
        var leftElbow = new THREE.Vector3(landmarks[13].x, landmarks[13].y, landmarks[13].z);
        var rightWrist = new THREE.Vector3(landmarks[16].x, landmarks[16].y, landmarks[16].z);
        var leftWrist = new THREE.Vector3(landmarks[15].x, landmarks[15].y, landmarks[15].z);
        var spine = model.getObjectByName("mixamorigSpine");
        var spQ = spine.quaternion; // Spine quaternion

        var leftUpperArm = model.getObjectByName("mixamorigLeftArm");
        // get the quaternion of the right upper arm from pose and spine quaternion
        var q = new THREE.Quaternion();
        q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(landmarks[13].x - landmarks[11].x, landmarks[13].y - landmarks[11].y, landmarks[13].z - landmarks[11].z).normalize());
        q.multiply(new THREE.Quaternion(0, 0, 0, 1));
        leftUpperArm.quaternion.set(q.w, q.x, -q.z, -q.y);
        
        var rightUpperArm = model.getObjectByName("mixamorigRightArm");
        // get the quaternion of the right upper arm from pose and spine quaternion
        var q = new THREE.Quaternion();
        q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(landmarks[14].x - landmarks[12].x, landmarks[14].y - landmarks[12].y, landmarks[14].z - landmarks[12].z).normalize());
        q.multiply(new THREE.Quaternion(0, 0, 0, 1));
        rightUpperArm.quaternion.set(q.w, -q.x, -q.z, -q.y);

        
/*
        var leftLowerArm = model.getObjectByName("mixamorigLeftForeArm");
        // get the quaternion of the left lower arm from pose and left upper arm quaternion
        q = new THREE.Quaternion();
        q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(landmarks[15].x - landmarks[13].x, landmarks[15].y - landmarks[13].y, landmarks[15].z - landmarks[13].z).normalize());
        q.multiply(leftUpperArm.quaternion);
        leftLowerArm.quaternion.set(q.x, q.y, q.z, q.w);

        var rightLowerArm = model.getObjectByName("mixamorigRightForeArm");
        // get the quaternion of the right lower arm from pose and right upper arm quaternion
        q = new THREE.Quaternion();
        q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(landmarks[16].x - landmarks[14].x, landmarks[16].y - landmarks[14].y, landmarks[16].z - landmarks[14].z).normalize());
        q.multiply(rightUpperArm.quaternion);
        rightLowerArm.quaternion.set(q.x, q.y, q.z, q.w);


        var leftUpperLeg = model.getObjectByName("mixamorigLeftUpLeg");
        // get the quaternion of the left upper leg from pose and spine quaternion
        q = new THREE.Quaternion();
        q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(landmarks[23].x - landmarks[11].x, landmarks[23].y - landmarks[11].y, landmarks[23].z - landmarks[11].z).normalize());
        q.multiply(spQ);
        leftUpperLeg.quaternion.set(q.x, q.y, q.z, q.w);

        var rightUpperLeg = model.getObjectByName("mixamorigRightUpLeg");
        // get the quaternion of the right upper leg from pose and spine quaternion
        q = new THREE.Quaternion();
        q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(landmarks[24].x - landmarks[12].x, landmarks[24].y - landmarks[12].y, landmarks[24].z - landmarks[12].z).normalize());
        q.multiply(spQ);
        rightUpperLeg.quaternion.set(q.x, q.y, q.z, q.w);

        var leftLowerLeg = model.getObjectByName("mixamorigLeftLeg");
        // get the quaternion of the left lower leg from pose and left upper leg quaternion
        q = new THREE.Quaternion();
        q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(landmarks[25].x - landmarks[23].x, landmarks[25].y - landmarks[23].y, landmarks[25].z - landmarks[23].z).normalize());
        q.multiply(leftUpperLeg.quaternion);
        leftLowerLeg.quaternion.set(q.x, q.y, q.z, q.w);

        var rightLowerLeg = model.getObjectByName("mixamorigRightLeg");
        // get the quaternion of the right lower leg from pose and right upper leg quaternion
        q = new THREE.Quaternion();
        q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(landmarks[26].x - landmarks[24].x, landmarks[26].y - landmarks[24].y, landmarks[26].z - landmarks[24].z).normalize());
        q.multiply(rightUpperLeg.quaternion);
        rightLowerLeg.quaternion.set(q.x, q.y, q.z, q.w);

        var leftFoot = model.getObjectByName("mixamorigLeftFoot");
        // get the quaternion of the left foot from pose and left lower leg quaternion
        q = new THREE.Quaternion();
        q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(landmarks[27].x - landmarks[25].x, landmarks[27].y - landmarks[25].y, landmarks[27].z - landmarks[25].z).normalize());
        q.multiply(leftLowerLeg.quaternion);
        leftFoot.quaternion.set(q.x, q.y, q.z, q.w);

        var rightFoot = model.getObjectByName("mixamorigRightFoot");
        // get the quaternion of the right foot from pose and right lower leg quaternion
        q = new THREE.Quaternion();
        q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(landmarks[28].x - landmarks[26].x, landmarks[28].y - landmarks[26].y, landmarks[28].z - landmarks[26].z).normalize());
        q.multiply(rightLowerLeg.quaternion);
        rightFoot.quaternion.set(q.x, q.y, q.z, q.w);
        */




        // var qx = new THREE.Quaternion();
        // qx.setFromUnitVectors(new THREE.Vector3(1, 0, 0), new THREE.Vector3(landmarks[13].x - landmarks[11].x, landmarks[13].y - landmarks[11].y, landmarks[13].z - landmarks[11].z).normalize());
        // // q.multiply(spQ);
        // var qy = new THREE.Quaternion();
        // qy.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(landmarks[13].x - landmarks[11].x, landmarks[13].y - landmarks[11].y, landmarks[13].z - landmarks[11].z).normalize());
        // // q.multiply(spQ);
        // var qz = new THREE.Quaternion();
        // qz.setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(landmarks[13].x - landmarks[11].x, landmarks[13].y - landmarks[11].y, landmarks[13].z - landmarks[11].z).normalize());

        // var q = new THREE.Quaternion();
        // q.multiply(qx);
        // q.multiply(qy);
        // q.multiply(qz);
        // leftUpperArm.quaternion.set(q.x, q.y, q.z, q.w);

        // var rightUpperArm = model.getObjectByName("mixamorigRightArm");
        // // get the quaternion of the right upper arm from pose and spine quaternion
        // q = new THREE.Quaternion();
        // q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(landmarks[14].x - landmarks[12].x, landmarks[14].y - landmarks[12].y, landmarks[14].z - landmarks[12].z).normalize());
        // q.multiply(spQ);
        // rightUpperArm.quaternion.set(q.x, q.y, q.z, q.w);
        

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