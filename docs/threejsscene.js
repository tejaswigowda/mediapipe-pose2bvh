let index_to_name = {};

let name_to_index = {
    nose: 0,
    left_eye_inner: 1,
    left_eye: 2,
    left_eye_outer: 3,
    right_eye_inner: 4,
    right_eye: 5,
    right_eye_outer: 6,
    left_ear: 7,
    right_ear: 8,
    mouth_left: 9,
    mouth_right: 10,
    left_shoulder: 11,
    right_shoulder: 12,
    left_elbow: 13,
    right_elbow: 14,
    left_wrist: 15,
    right_wrist: 16,
    left_pinky: 17,
    right_pinky: 18,
    left_index: 19,
    right_index: 20,
    left_thumb: 21,
    right_thumb: 22,
    left_hip: 23,
    right_hip: 24,
    left_knee: 25,
    right_knee: 26,
    left_ankle: 27,
    right_ankle: 28,
    left_heel: 29,
    right_heel: 30,
    left_foot_index: 31,
    right_foot_index: 32,
};

for (const [key, value] of Object.entries(name_to_index)) {
    index_to_name[value] = key;
}



let index_to_name_hands = {};
for (const [key, value] of Object.entries(name_to_index)) {
    index_to_name[value] = key;
}

let name_to_index_hands = {
    wrist: 0,
    thumb_finger_mcp: 1, // thumb_cmc
    thumb_finger_pip: 2, // thumb_mcp
    thumb_finger_dip: 3, // thumb_ip
    thumb_finger_tip: 4, // thumb_tip
    index_finger_mcp: 5,
    index_finger_pip: 6,
    index_finger_dip: 7,
    index_finger_tip: 8,
    middle_finger_mcp: 9,
    middle_finger_pip: 10,
    middle_finger_dip: 11,
    middle_finger_tip: 12,
    ring_finger_mcp: 13,
    ring_finger_pip: 14,
    ring_finger_dip: 15,
    ring_finger_tip: 16,
    pinky_finger_mcp: 17, // pinky_mcp
    pinky_finger_pip: 18, // pinky_mcp
    pinky_finger_dip: 19, // pinky_mcp
    pinky_finger_tip: 20, // pinky_mcp
};
for (const [key, value] of Object.entries(name_to_index_hands)) {
    index_to_name_hands[value] = key;
}

function computeR(A, B) {
    // get unit vectors
    const uA = A.clone().normalize();
    const uB = B.clone().normalize();

    // get products
    const idot = uA.dot(uB);
    const cross_AB = new THREE.Vector3().crossVectors(uA, uB);
    const cdot = cross_AB.length();

    // get new unit vectors
    const u = uA.clone();
    const v = new THREE.Vector3()
        .subVectors(uB, uA.clone().multiplyScalar(idot))
        .normalize();
    const w = cross_AB.clone().normalize();

    // get change of basis matrix
    const C = new THREE.Matrix4().makeBasis(u, v, w).transpose();

    // get rotation matrix in new basis
    const R_uvw = new THREE.Matrix4().set(
        idot,
        -cdot,
        0,
        0,
        cdot,
        idot,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1
    );

    // full rotation matrix
    //const R = new Matrix4().multiplyMatrices(new Matrix4().multiplyMatrices(C, R_uvw), C.clone().transpose());
    const R = new THREE.Matrix4().multiplyMatrices(
        C.clone().transpose(),
        new THREE.Matrix4().multiplyMatrices(R_uvw, C)
    );
    return R;
}


function SetRbyCalculatingJoints(
    joint_mp,
    joint_mp_child,
    joint_model,
    joint_model_child,
    R_chain
) {
    const v = new THREE.Vector3()
        .subVectors(joint_mp_child, joint_mp)
        .normalize();

    const R = computeR(
        joint_model_child.position.clone().normalize(),
        v.applyMatrix4(R_chain.clone().transpose())
    );
    if (joint_model.name != "mixamorigHead") {
        joint_model.quaternion.setFromRotationMatrix(R);
    }

    R_chain.multiply(R);
}

function update3dpose(camera, dist_from_cam, offset, poseLandmarks) {
    // if the camera is orthogonal, set scale to 1
    const ip_lt = new THREE.Vector3(-1, 1, -1).unproject(camera);
    const ip_rb = new THREE.Vector3(1, -1, -1).unproject(camera);
    const ip_diff = new THREE.Vector3().subVectors(ip_rb, ip_lt);
    const x_scale = Math.abs(ip_diff.x);

    function ProjScale(p_ms, cam_pos, src_d, dst_d) {
        let vec_cam2p = new THREE.Vector3().subVectors(p_ms, cam_pos);
        return new THREE.Vector3().addVectors(
            cam_pos,
            vec_cam2p.multiplyScalar(dst_d / src_d)
        );
    }

    let pose3dDict = {};
    for (const [key, value] of Object.entries(poseLandmarks)) {
        let p_3d = new THREE.Vector3(
            (value.x - 0.5) * 2.0,
            -(value.y - 0.5) * 2.0,
            0
        ).unproject(camera);
        p_3d.z = -value.z * x_scale - camera.near + camera.position.z;
        p_3d = ProjScale(p_3d, camera.position, camera.near, dist_from_cam);
        pose3dDict[key] = p_3d.add(offset);
    }

    return pose3dDict;
}




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
    // container.style.transform = "scale(0.5)";
    // container.style.transformOrigin = "100% 0%";

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

   //scene.add(circle);


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
                    //child1.scale.set(0, 0, 0);
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



        });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

//
function mapHandLandmarks(landmarks, h, pose_left_wrist, pose_right_wrist) {
    if (h == "left") {
        let hand_landmarks_dict = {};
        landmarks.forEach((landmark, i) => {
            hand_landmarks_dict[index_to_name_hands[i]] = landmark;
        });
        let hand_3d_landmarks = update3dpose(
            camera,
            1.5,
            new THREE.Vector3(1, 0, -1.5),
            hand_landmarks_dict
        );
        let i = 0;
        const jointWrist = hand_3d_landmarks["wrist"];
        const jointIndex_mcp = hand_3d_landmarks["index_finger_mcp"];
        const jointMiddle_mcp = hand_3d_landmarks["middle_finger_mcp"];
        const jointPinky_mcp = hand_3d_landmarks["pinky_finger_mcp"];

        const boneHand = model.getObjectByName("mixamorigLeftHand");
        const boneIndex1 = model.getObjectByName("mixamorigLeftHandIndex1");
        const boneMiddle1 = model.getObjectByName("mixamorigLeftHandMiddle1");
        const bonePinky1 = model.getObjectByName("mixamorigLeftHandPinky1");

        const v_middle = new THREE.Vector3().subVectors(
            jointMiddle_mcp,
            jointWrist
        );

        const v_hand_v = v_middle.clone().normalize();
        const v_hand_index2pinky = new THREE.Vector3()
            .subVectors(jointPinky_mcp, jointIndex_mcp)
            .normalize();
        const v_hand_w = new THREE.Vector3().crossVectors(
            v_hand_index2pinky,
            v_hand_v
        );
        const v_hand_u = new THREE.Vector3().crossVectors(v_hand_v, v_hand_w);
        const R_MPhand = new THREE.Matrix4().makeBasis(
            v_hand_u,
            v_hand_v,
            v_hand_w
        );

        const v_bonehand_v = boneMiddle1.clone().position.normalize();
        const v_bonehand_index2pinky = new THREE.Vector3()
            .subVectors(bonePinky1.position, boneIndex1.position)
            .normalize();
        const v_bonehand_w = new THREE.Vector3().crossVectors(
            v_bonehand_index2pinky,
            v_bonehand_v
        );
        const v_bonehand_u = new THREE.Vector3().crossVectors(
            v_bonehand_v,
            v_bonehand_w
        );
        const R_Modelhand = new THREE.Matrix4().makeBasis(
            v_bonehand_u,
            v_bonehand_v,
            v_bonehand_w
        );

        const R_BonetoMP = R_MPhand.clone().multiply(
            R_Modelhand.clone().transpose()
        );
        const R_toTpose = R_chain_leftupper.clone().transpose();
        const R_wrist = R_BonetoMP.clone().premultiply(R_toTpose);
        boneHand.quaternion.setFromRotationMatrix(R_wrist);

        R_chain_leftupper.multiply(
            new THREE.Matrix4().extractRotation(boneHand.matrix)
        );
        let R_chain_index = new THREE.Matrix4().identity();
        let R_chain_middle = new THREE.Matrix4().identity();
        let R_chain_ring = new THREE.Matrix4().identity();
        let R_chain_pinky = new THREE.Matrix4().identity();
        let R_chain_thumb = new THREE.Matrix4().identity();

        let R_list = [
            R_chain_index,
            R_chain_middle,
            R_chain_ring,
            R_chain_pinky,
            R_chain_thumb,
        ];

        for (i = 0; i < 5; i++) {
            R_list[i].multiply(R_chain_leftupper);
        }

        for (i = 0; i < 15; i++) {
            let bone_list = [
                "index",
                "middle",
                "ring",
                "pinky",
                "thumb",
                "Index",
                "Middle",
                "Ring",
                "Pinky",
                "Thumb",
            ];
            let bone_point_list = ["mcp", "pip", "dip", "tip"];
            let remainder = i % 3;
            let quotient = parseInt(i / 3);
            let finger = bone_list[quotient];
            let finger_point = finger + "_finger_" + bone_point_list[remainder];
            let next_point = finger + "_finger_" + bone_point_list[remainder + 1];
            let Bone =
                "mixamorigLeftHand" + bone_list[quotient + 5] + (remainder + 1);
            let next_Bone =
                "mixamorigLeftHand" + bone_list[quotient + 5] + (remainder + 2);
            let R = R_list[quotient];
            SetRbyCalculatingJoints(
                hand_3d_landmarks[finger_point],
                hand_3d_landmarks[next_point],
                model.getObjectByName(Bone),
                model.getObjectByName(next_Bone),
                R
            );
        }

    }
    else {
        let hand_landmarks_dict = {};
        landmarks.forEach((landmark, i) => {
            hand_landmarks_dict[index_to_name_hands[i]] = landmark;
        });
        let hand_3d_landmarks = update3dpose(
            camera,
            1.5,
            new THREE.Vector3(1, 0, -1.5),
            hand_landmarks_dict
        );
        let i = 0;

        const jointWrist = hand_3d_landmarks["wrist"];
        const jointIndex_mcp = hand_3d_landmarks["index_finger_mcp"];
        const jointMiddle_mcp = hand_3d_landmarks["middle_finger_mcp"];
        const jointPinky_mcp = hand_3d_landmarks["pinky_finger_mcp"];

        const boneHand = model.getObjectByName("mixamorigRightHand");
        const boneIndex1 = model.getObjectByName("mixamorigRightHandIndex1");
        const boneMiddle1 = model.getObjectByName("mixamorigRightHandMiddle1");
        const bonePinky1 = model.getObjectByName("mixamorigRightHandPinky1");

        const v_middle = new THREE.Vector3().subVectors(
            jointMiddle_mcp,
            jointWrist
        );

        const v_hand_v = v_middle.clone().normalize();
        const v_hand_index2pinky = new THREE.Vector3()
            .subVectors(jointPinky_mcp, jointIndex_mcp)
            .normalize();
        const v_hand_w = new THREE.Vector3().crossVectors(
            v_hand_index2pinky,
            v_hand_v
        );
        const v_hand_u = new THREE.Vector3().crossVectors(v_hand_v, v_hand_w);
        const R_MPhand = new THREE.Matrix4().makeBasis(
            v_hand_u,
            v_hand_v,
            v_hand_w
        );

        const v_bonehand_v = boneMiddle1.clone().position.normalize();
        const v_bonehand_index2pinky = new THREE.Vector3()
            .subVectors(bonePinky1.position, boneIndex1.position)
            .normalize();
        const v_bonehand_w = new THREE.Vector3().crossVectors(
            v_bonehand_index2pinky,
            v_bonehand_v
        );
        const v_bonehand_u = new THREE.Vector3().crossVectors(
            v_bonehand_v,
            v_bonehand_w
        );
        const R_Modelhand = new THREE.Matrix4().makeBasis(
            v_bonehand_u,
            v_bonehand_v,
            v_bonehand_w
        );

        const R_BonetoMP = R_MPhand.clone().multiply(
            R_Modelhand.clone().transpose()
        );
        const R_toTpose = R_chain_rightupper.clone().transpose();
        const R_wrist = R_BonetoMP.clone().premultiply(R_toTpose);
        boneHand.quaternion.setFromRotationMatrix(R_wrist);

        R_chain_rightupper.multiply(
            new THREE.Matrix4().extractRotation(boneHand.matrix)
        );
        let R_chain_index = new THREE.Matrix4().identity();
        let R_chain_middle = new THREE.Matrix4().identity();
        let R_chain_ring = new THREE.Matrix4().identity();
        let R_chain_pinky = new THREE.Matrix4().identity();
        let R_chain_thumb = new THREE.Matrix4().identity();

        let R_list = [
            R_chain_index,
            R_chain_middle,
            R_chain_ring,
            R_chain_pinky,
            R_chain_thumb,
        ];

        for (i = 0; i < 5; i++) {
            R_list[i].multiply(R_chain_rightupper);
        }

        for (i = 0; i < 15; i++) {
            let bone_list = [
                "index",
                "middle",
                "ring",
                "pinky",
                "thumb",
                "Index",
                "Middle",
                "Ring",
                "Pinky",
                "Thumb",
            ];
            let bone_point_list = ["mcp", "pip", "dip", "tip"];
            let remainder = i % 3;
            let quotient = parseInt(i / 3);
            let finger = bone_list[quotient];
            let finger_point = finger + "_finger_" + bone_point_list[remainder];
            let next_point = finger + "_finger_" + bone_point_list[remainder + 1];
            let Bone =
                "mixamorigRightHand" + bone_list[quotient + 5] + (remainder + 1);
            let next_Bone =
                "mixamorigRightHand" + bone_list[quotient + 5] + (remainder + 2);
            let R = R_list[quotient];
            SetRbyCalculatingJoints(
                hand_3d_landmarks[finger_point],
                hand_3d_landmarks[next_point],
                model.getObjectByName(Bone),
                model.getObjectByName(next_Bone),
                R
            );
        }
    }
}


function animate() {
    requestAnimationFrame(animate);

    let R_chain_rightupper, R_chain_leftupper;




    if (model) {
        var head = model.getObjectByName("mixamorigHead");
        if (head && facemesh) {
            head.getWorldPosition(facemesh.position);
            head.getWorldQuaternion(facemesh.quaternion);
        }
    }

    if (holisticResults) {

        let R_chain_rightupper, R_chain_leftupper;
        let pose_left_wrist, pose_right_wrist;
        let results = holisticResults;

        if (results.poseLandmarks) {
            // pose
            let pose_landmarks_dict = {};
            let newJoints3D = {};
            results.poseLandmarks.forEach((landmark, i) => {
                pose_landmarks_dict[index_to_name[i]] = landmark;
            });

            let pos_3d_landmarks = update3dpose(
                camera,
                1.5,
                new THREE.Vector3(1, 0, -1.5),
                pose_landmarks_dict
            );

            let i = 0;

            pose_left_wrist = pos_3d_landmarks["left_wrist"];
            pose_right_wrist = pos_3d_landmarks["right_wrist"];
            // add landmarks for spine
            const center_hips = new THREE.Vector3()
                .addVectors(pos_3d_landmarks["left_hip"], pos_3d_landmarks["right_hip"])
                .multiplyScalar(0.5);
            const center_shoulders = new THREE.Vector3()
                .addVectors(
                    pos_3d_landmarks["left_shoulder"],
                    pos_3d_landmarks["right_shoulder"]
                )
                .multiplyScalar(0.5);
            const center_ear = new THREE.Vector3()
                .addVectors(pos_3d_landmarks["left_ear"], pos_3d_landmarks["right_ear"])
                .multiplyScalar(0.5);

            const dir_spine = new THREE.Vector3().subVectors(
                center_shoulders,
                center_hips
            );
            const length_spine = dir_spine.length();
            dir_spine.normalize();

            const dir_shoulders = new THREE.Vector3().subVectors(
                pos_3d_landmarks["right_shoulder"],
                pos_3d_landmarks["left_shoulder"]
            );

            newJoints3D["hips"] = new THREE.Vector3().addVectors(
                center_hips,
                dir_spine.clone().multiplyScalar(length_spine / 9.0)
            );
            newJoints3D["spine0"] = new THREE.Vector3().addVectors(
                center_hips,
                dir_spine.clone().multiplyScalar((length_spine / 9.0) * 3)
            );
            newJoints3D["spine1"] = new THREE.Vector3().addVectors(
                center_hips,
                dir_spine.clone().multiplyScalar((length_spine / 9.0) * 5)
            );
            newJoints3D["spine2"] = new THREE.Vector3().addVectors(
                center_hips,
                dir_spine.clone().multiplyScalar((length_spine / 9.0) * 7)
            );
            const neck = new THREE.Vector3().addVectors(
                center_shoulders,
                dir_spine.clone().multiplyScalar(length_spine / 9.0)
            );
            newJoints3D["neck"] = neck;
            newJoints3D["shoulder_left"] = new THREE.Vector3().addVectors(
                pos_3d_landmarks["left_shoulder"],
                dir_shoulders.clone().multiplyScalar(1 / 3.0)
            );
            newJoints3D["shoulder_right"] = new THREE.Vector3().addVectors(
                pos_3d_landmarks["left_shoulder"],
                dir_shoulders.clone().multiplyScalar(2 / 3.0)
            );
            const dir_head = new THREE.Vector3().subVectors(center_ear, neck);
            newJoints3D["head"] = new THREE.Vector3().addVectors(
                neck,
                dir_head.clone().multiplyScalar(0.5)
            );
            const dir_right_foot = new THREE.Vector3().subVectors(
                pos_3d_landmarks["right_foot_index"],
                pos_3d_landmarks["right_heel"]
            );
            newJoints3D["right_toebase"] = new THREE.Vector3().addVectors(
                pos_3d_landmarks["right_heel"],
                dir_right_foot.clone().multiplyScalar(0.6)
            );
            const dir_left_foot = new THREE.Vector3().subVectors(
                pos_3d_landmarks["left_foot_index"],
                pos_3d_landmarks["left_heel"]
            );
            newJoints3D["left_toebase"] = new THREE.Vector3().addVectors(
                pos_3d_landmarks["left_heel"],
                dir_left_foot.clone().multiplyScalar(0.6)
            );

            i = 0;


            // hip
            const jointHips = newJoints3D["hips"];
            const jointLeftUpLeg = pos_3d_landmarks["left_hip"];
            const jointRightUpLeg = pos_3d_landmarks["right_hip"];
            const jointSpine0 = newJoints3D["spine0"];

            const boneHips = model.getObjectByName("mixamorigHips");
            const boneLeftUpLeg = model.getObjectByName("mixamorigLeftUpLeg");
            const boneRightUpLeg = model.getObjectByName("mixamorigRightUpLeg");
            const boneSpine0 = model.getObjectByName("mixamorigSpine");

            const v_HiptoLeft = new THREE.Vector3()
                .subVectors(jointLeftUpLeg, jointHips)
                .normalize();
            const v_HiptoRight = new THREE.Vector3()
                .subVectors(jointRightUpLeg, jointHips)
                .normalize();
            const v_HiptoSpine0 = new THREE.Vector3()
                .subVectors(jointSpine0, jointHips)
                .normalize();

            const R_HiptoLeft = computeR(
                boneLeftUpLeg.position.clone().normalize(),
                v_HiptoLeft
            );
            const Q_HiptoLeft = new THREE.Quaternion().setFromRotationMatrix(
                R_HiptoLeft
            );
            const R_HiptoRight = computeR(
                boneRightUpLeg.position.clone().normalize(),
                v_HiptoRight
            );
            const Q_HiptoRight = new THREE.Quaternion().setFromRotationMatrix(
                R_HiptoRight
            );
            const R_HiptoSpine0 = computeR(
                boneSpine0.position.clone().normalize(),
                v_HiptoSpine0
            );
            const Q_HiptoSpine0 = new THREE.Quaternion().setFromRotationMatrix(
                R_HiptoSpine0
            );
            const Q_Hips = new THREE.Quaternion()
                .copy(Q_HiptoSpine0)
                .slerp(Q_HiptoLeft.clone().slerp(Q_HiptoRight, 0.5), 1 / 3);

            boneHips.quaternion.copy(Q_Hips);
            const R_Hips = new THREE.Matrix4().extractRotation(boneHips.matrix);

            // neck
            let R_chain_neck = new THREE.Matrix4().identity();
            R_chain_neck.multiply(R_Hips);
            const jointNeck = newJoints3D["neck"];
            const jointHead = newJoints3D["head"];
            const boneNeck = model.getObjectByName("mixamorigNeck");
            const boneHead = model.getObjectByName("mixamorigHead");
            SetRbyCalculatingJoints(
                jointNeck,
                jointHead,
                boneNeck,
                boneHead,
                R_chain_neck
            );
            const jointLeftEye = pos_3d_landmarks["left_eye"];
            const jointRightEye = pos_3d_landmarks["right_eye"];
            const boneLeftEye = model.getObjectByName("mixamorigLeftEye");
            const boneRightEye = model.getObjectByName("mixamorigRightEye");
            const v_LeftEye = new THREE.Vector3()
                .subVectors(jointLeftEye, jointHead)
                .normalize();
            const v_RightEye = new THREE.Vector3()
                .subVectors(jointRightEye, jointHead)
                .normalize();
            const R_HeadtoLeftEye = computeR(
                boneLeftEye.position.clone().normalize(),
                v_LeftEye.clone().applyMatrix4(R_chain_neck.clone().transpose())
            );
            const R_HeadtoRightEye = computeR(
                boneRightEye.position.clone().normalize(),
                v_RightEye.clone().applyMatrix4(R_chain_neck.clone().transpose())
            );
            const Q_HeadtoLeftEye = new THREE.Quaternion().setFromRotationMatrix(
                R_HeadtoLeftEye
            );
            const Q_HeadtoRightEye = new THREE.Quaternion().setFromRotationMatrix(
                R_HeadtoRightEye
            );
            const Q_Head = new THREE.Quaternion()
                .copy(Q_HeadtoLeftEye)
                .slerp(Q_HeadtoRightEye, 0.5);
            boneHead.quaternion.copy(Q_Head);

            // Left shoulder-elbow-wrist
            R_chain_leftupper = new THREE.Matrix4().identity();
            R_chain_leftupper.multiply(R_Hips);
            const jointLeftShoulder_inside = newJoints3D["shoulder_left"];
            const jointLeftShoulder = pos_3d_landmarks["left_shoulder"];
            const jointLeftElbow = pos_3d_landmarks["left_elbow"];
            const jointLeftWrist = pos_3d_landmarks["left_wrist"];

            const boneLeftShoulder = model.getObjectByName("mixamorigLeftShoulder");
            const boneLeftArm = model.getObjectByName("mixamorigLeftArm");
            const boneLeftForeArm = model.getObjectByName("mixamorigLeftForeArm");
            const boneLeftHand = model.getObjectByName("mixamorigLeftHand");

            SetRbyCalculatingJoints(
                jointLeftShoulder_inside,
                jointLeftShoulder,
                boneLeftShoulder,
                boneLeftArm,
                R_chain_leftupper
            );
            SetRbyCalculatingJoints(
                jointLeftShoulder,
                jointLeftElbow,
                boneLeftArm,
                boneLeftForeArm,
                R_chain_leftupper
            );
            SetRbyCalculatingJoints(
                jointLeftElbow,
                jointLeftWrist,
                boneLeftForeArm,
                boneLeftHand,
                R_chain_leftupper
            );

            // Right shoulder-elbow-wrist
            R_chain_rightupper = new THREE.Matrix4().identity();
            R_chain_rightupper.multiply(R_Hips);
            const jointRightShoulder_inside = newJoints3D["shoulder_left"];
            const jointRightShoulder = pos_3d_landmarks["right_shoulder"];
            const jointRightElbow = pos_3d_landmarks["right_elbow"];
            const jointRightWrist = pos_3d_landmarks["right_wrist"];

            const boneRightShoulder = model.getObjectByName("mixamorigRightShoulder");
            const boneRightArm = model.getObjectByName("mixamorigRightArm");
            const boneRightForeArm = model.getObjectByName("mixamorigRightForeArm");
            const boneRightHand = model.getObjectByName("mixamorigRightHand");

            SetRbyCalculatingJoints(
                jointRightShoulder_inside,
                jointRightShoulder,
                boneRightShoulder,
                boneRightArm,
                R_chain_rightupper,
                true
            );
            SetRbyCalculatingJoints(
                jointRightShoulder,
                jointRightElbow,
                boneRightArm,
                boneRightForeArm,
                R_chain_rightupper
            );
            SetRbyCalculatingJoints(
                jointRightElbow,
                jointRightWrist,
                boneRightForeArm,
                boneRightHand,
                R_chain_rightupper
            );

            // left upleg-leg-foot
            let R_chain_leftlower = new THREE.Matrix4().identity();
            R_chain_leftlower.multiply(R_Hips);
            const jointLeftKnee = pos_3d_landmarks["left_knee"];
            const jointLeftAnkle = pos_3d_landmarks["left_ankle"];
            const jointLeftToeBase = newJoints3D["left_toebase"];
            const jointLeftFoot = pos_3d_landmarks["left_foot_index"];

            const boneLeftLeg = model.getObjectByName("mixamorigLeftLeg");
            const boneLeftFoot = model.getObjectByName("mixamorigLeftFoot");
            const boneLeftToeBase = model.getObjectByName("mixamorigLeftToeBase");
            const boneLeftToe_End = model.getObjectByName("mixamorigLeftToe_End");
            SetRbyCalculatingJoints(
                jointLeftUpLeg,
                jointLeftKnee,
                boneLeftUpLeg,
                boneLeftLeg,
                R_chain_leftlower
            );
            SetRbyCalculatingJoints(
                jointLeftKnee,
                jointLeftAnkle,
                boneLeftLeg,
                boneLeftFoot,
                R_chain_leftlower
            );
            SetRbyCalculatingJoints(
                jointLeftAnkle,
                jointLeftToeBase,
                boneLeftFoot,
                boneLeftToeBase,
                R_chain_leftlower
            );
            SetRbyCalculatingJoints(
                jointLeftToeBase,
                jointLeftFoot,
                boneLeftToeBase,
                boneLeftToe_End,
                R_chain_leftlower
            );
            // Right upleg-leg-foot
            let R_chain_rightlower = new THREE.Matrix4().identity();
            R_chain_rightlower.multiply(R_Hips);

            const jointRightKnee = pos_3d_landmarks["right_knee"];
            const jointRightAnkle = pos_3d_landmarks["right_ankle"];
            const jointRightToeBase = newJoints3D["right_toebase"];
            const jointRightFoot = pos_3d_landmarks["right_foot_index"];

            const boneRightLeg = model.getObjectByName("mixamorigRightLeg");
            const boneRightFoot = model.getObjectByName("mixamorigRightFoot");
            const boneRightToeBase = model.getObjectByName("mixamorigRightToeBase");
            const boneRightToe_End = model.getObjectByName("mixamorigRightToe_End");

            SetRbyCalculatingJoints(
                jointRightUpLeg,
                jointRightKnee,
                boneRightUpLeg,
                boneRightLeg,
                R_chain_rightlower
            );
            SetRbyCalculatingJoints(
                jointRightKnee,
                jointRightAnkle,
                boneRightLeg,
                boneRightFoot,
                R_chain_rightlower
            );
            SetRbyCalculatingJoints(
                jointRightAnkle,
                jointRightToeBase,
                boneRightFoot,
                boneRightToeBase,
                R_chain_rightlower
            );
            SetRbyCalculatingJoints(
                jointRightToeBase,
                jointRightFoot,
                boneRightToeBase,
                boneRightToe_End,
                R_chain_rightlower
            );
        }
        if (results.leftHandLandmarks) {
            let hand_landmarks_dict = {};
            results.leftHandLandmarks.forEach((landmark, i) => {
                hand_landmarks_dict[index_to_name_hands[i]] = landmark;
            });
            let hand_3d_landmarks = update3dpose(
                camera,
                1.5,
                new THREE.Vector3(1, 0, -1.5),
                hand_landmarks_dict
            );
            let i = 0;
            const gap_X = pose_left_wrist.x - hand_3d_landmarks["wrist"].x;
            const gap_Y = pose_left_wrist.y - hand_3d_landmarks["wrist"].y;
            const gap_Z = pose_left_wrist.z - hand_3d_landmarks["wrist"].z;

            const jointWrist = hand_3d_landmarks["wrist"];
            const jointIndex_mcp = hand_3d_landmarks["index_finger_mcp"];
            const jointMiddle_mcp = hand_3d_landmarks["middle_finger_mcp"];
            const jointPinky_mcp = hand_3d_landmarks["pinky_finger_mcp"];

            const boneHand = model.getObjectByName("mixamorigLeftHand");
            const boneIndex1 = model.getObjectByName("mixamorigLeftHandIndex1");
            const boneMiddle1 = model.getObjectByName("mixamorigLeftHandMiddle1");
            const bonePinky1 = model.getObjectByName("mixamorigLeftHandPinky1");

            const v_middle = new THREE.Vector3().subVectors(
                jointMiddle_mcp,
                jointWrist
            );

            const v_hand_v = v_middle.clone().normalize();
            const v_hand_index2pinky = new THREE.Vector3()
                .subVectors(jointPinky_mcp, jointIndex_mcp)
                .normalize();
            const v_hand_w = new THREE.Vector3().crossVectors(
                v_hand_index2pinky,
                v_hand_v
            );
            const v_hand_u = new THREE.Vector3().crossVectors(v_hand_v, v_hand_w);
            const R_MPhand = new THREE.Matrix4().makeBasis(
                v_hand_u,
                v_hand_v,
                v_hand_w
            );

            const v_bonehand_v = boneMiddle1.clone().position.normalize();
            const v_bonehand_index2pinky = new THREE.Vector3()
                .subVectors(bonePinky1.position, boneIndex1.position)
                .normalize();
            const v_bonehand_w = new THREE.Vector3().crossVectors(
                v_bonehand_index2pinky,
                v_bonehand_v
            );
            const v_bonehand_u = new THREE.Vector3().crossVectors(
                v_bonehand_v,
                v_bonehand_w
            );
            const R_Modelhand = new THREE.Matrix4().makeBasis(
                v_bonehand_u,
                v_bonehand_v,
                v_bonehand_w
            );

            const R_BonetoMP = R_MPhand.clone().multiply(
                R_Modelhand.clone().transpose()
            );
            const R_toTpose = R_chain_leftupper.clone().transpose();
            const R_wrist = R_BonetoMP.clone().premultiply(R_toTpose);
            boneHand.quaternion.setFromRotationMatrix(R_wrist);

            R_chain_leftupper.multiply(
                new THREE.Matrix4().extractRotation(boneHand.matrix)
            );
            let R_chain_index = new THREE.Matrix4().identity();
            let R_chain_middle = new THREE.Matrix4().identity();
            let R_chain_ring = new THREE.Matrix4().identity();
            let R_chain_pinky = new THREE.Matrix4().identity();
            let R_chain_thumb = new THREE.Matrix4().identity();

            let R_list = [
                R_chain_index,
                R_chain_middle,
                R_chain_ring,
                R_chain_pinky,
                R_chain_thumb,
            ];

            for (i = 0; i < 5; i++) {
                R_list[i].multiply(R_chain_leftupper);
            }

            for (i = 0; i < 15; i++) {
                let bone_list = [
                    "index",
                    "middle",
                    "ring",
                    "pinky",
                    "thumb",
                    "Index",
                    "Middle",
                    "Ring",
                    "Pinky",
                    "Thumb",
                ];
                let bone_point_list = ["mcp", "pip", "dip", "tip"];
                let remainder = i % 3;
                let quotient = parseInt(i / 3);
                let finger = bone_list[quotient];
                let finger_point = finger + "_finger_" + bone_point_list[remainder];
                let next_point = finger + "_finger_" + bone_point_list[remainder + 1];
                let Bone =
                    "mixamorigLeftHand" + bone_list[quotient + 5] + (remainder + 1);
                let next_Bone =
                    "mixamorigLeftHand" + bone_list[quotient + 5] + (remainder + 2);
                let R = R_list[quotient];
                SetRbyCalculatingJoints(
                    hand_3d_landmarks[finger_point],
                    hand_3d_landmarks[next_point],
                    model.getObjectByName(Bone),
                    model.getObjectByName(next_Bone),
                    R
                );
            }
        }
        if (results.rightHandLandmarks) {
            let hand_landmarks_dict = {};
            results.rightHandLandmarks.forEach((landmark, i) => {
                hand_landmarks_dict[index_to_name_hands[i]] = landmark;
            });
            let hand_3d_landmarks = update3dpose(
                camera,
                1.5,
                new THREE.Vector3(1, 0, -1.5),
                hand_landmarks_dict
            );
            let i = 0;
            const gap_X = pose_right_wrist.x - hand_3d_landmarks["wrist"].x;
            const gap_Y = pose_right_wrist.y - hand_3d_landmarks["wrist"].y;
            const gap_Z = pose_right_wrist.z - hand_3d_landmarks["wrist"].z;

            const jointWrist = hand_3d_landmarks["wrist"];
            const jointIndex_mcp = hand_3d_landmarks["index_finger_mcp"];
            const jointMiddle_mcp = hand_3d_landmarks["middle_finger_mcp"];
            const jointPinky_mcp = hand_3d_landmarks["pinky_finger_mcp"];

            const boneHand = model.getObjectByName("mixamorigRightHand");
            const boneIndex1 = model.getObjectByName("mixamorigRightHandIndex1");
            const boneMiddle1 = model.getObjectByName("mixamorigRightHandMiddle1");
            const bonePinky1 = model.getObjectByName("mixamorigRightHandPinky1");

            const v_middle = new THREE.Vector3().subVectors(
                jointMiddle_mcp,
                jointWrist
            );

            const v_hand_v = v_middle.clone().normalize();
            const v_hand_index2pinky = new THREE.Vector3()
                .subVectors(jointPinky_mcp, jointIndex_mcp)
                .normalize();
            const v_hand_w = new THREE.Vector3().crossVectors(
                v_hand_index2pinky,
                v_hand_v
            );
            const v_hand_u = new THREE.Vector3().crossVectors(v_hand_v, v_hand_w);
            const R_MPhand = new THREE.Matrix4().makeBasis(
                v_hand_u,
                v_hand_v,
                v_hand_w
            );

            const v_bonehand_v = boneMiddle1.clone().position.normalize();
            const v_bonehand_index2pinky = new THREE.Vector3()
                .subVectors(bonePinky1.position, boneIndex1.position)
                .normalize();
            const v_bonehand_w = new THREE.Vector3().crossVectors(
                v_bonehand_index2pinky,
                v_bonehand_v
            );
            const v_bonehand_u = new THREE.Vector3().crossVectors(
                v_bonehand_v,
                v_bonehand_w
            );
            const R_Modelhand = new THREE.Matrix4().makeBasis(
                v_bonehand_u,
                v_bonehand_v,
                v_bonehand_w
            );

            const R_BonetoMP = R_MPhand.clone().multiply(
                R_Modelhand.clone().transpose()
            );
            const R_toTpose = R_chain_rightupper.clone().transpose();
            const R_wrist = R_BonetoMP.clone().premultiply(R_toTpose);
            boneHand.quaternion.setFromRotationMatrix(R_wrist);

            R_chain_rightupper.multiply(
                new THREE.Matrix4().extractRotation(boneHand.matrix)
            );
            let R_chain_index = new THREE.Matrix4().identity();
            let R_chain_middle = new THREE.Matrix4().identity();
            let R_chain_ring = new THREE.Matrix4().identity();
            let R_chain_pinky = new THREE.Matrix4().identity();
            let R_chain_thumb = new THREE.Matrix4().identity();

            let R_list = [
                R_chain_index,
                R_chain_middle,
                R_chain_ring,
                R_chain_pinky,
                R_chain_thumb,
            ];

            for (i = 0; i < 5; i++) {
                R_list[i].multiply(R_chain_rightupper);
            }

            for (i = 0; i < 15; i++) {
                let bone_list = [
                    "index",
                    "middle",
                    "ring",
                    "pinky",
                    "thumb",
                    "Index",
                    "Middle",
                    "Ring",
                    "Pinky",
                    "Thumb",
                ];
                let bone_point_list = ["mcp", "pip", "dip", "tip"];
                let remainder = i % 3;
                let quotient = parseInt(i / 3);
                let finger = bone_list[quotient];
                let finger_point = finger + "_finger_" + bone_point_list[remainder];
                let next_point = finger + "_finger_" + bone_point_list[remainder + 1];
                let Bone =
                    "mixamorigRightHand" + bone_list[quotient + 5] + (remainder + 1);
                let next_Bone =
                    "mixamorigRightHand" + bone_list[quotient + 5] + (remainder + 2);
                let R = R_list[quotient];
                SetRbyCalculatingJoints(
                    hand_3d_landmarks[finger_point],
                    hand_3d_landmarks[next_point],
                    model.getObjectByName(Bone),
                    model.getObjectByName(next_Bone),
                    R
                );
            }
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
        head.getWorldPosition(facemesh.position);
        head.getWorldQuaternion(facemesh.quaternion);
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