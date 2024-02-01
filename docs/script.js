// get webcam feed and display it in the video element

// get the video element
const video = document.getElementById('video');
video.addEventListener('play', predictEverything);

function predictEverything() {
    /*try {
        predictFace();
    } catch (error) {
        predictFace();
    }
    try {
        predictHands();
    } catch (error) {
        predictHands();
    }
    try {
        predictPose();
    } catch (error) {
        predictPose();
    }*/
    predictFace();
    predictHands();
    predictPose();
}

// get the webcam feed

navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(stream => {
    video.srcObject = stream;
    video.play();
}).catch(err => {
    console.error(err);
});




import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";

import {
    FilesetResolver,
    DrawingUtils,
    FaceLandmarker,
    HandLandmarker,
    PoseLandmarker,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";


async function createFaceLandmarker() {
    var filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
    );

    faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
            delegate: "GPU"
        },
        outputFaceBlendshapes: true,
        outputFaceGeometry: true,
        outputFacialTransformationMatrices: true,
        outputFaceBlendshapes: true,
        outputFaceGeometry: true,
        outputFacialTransformationMatrices: true,
        runningMode: "VIDEO",
        numFaces: 1
    });
}

createFaceLandmarker();
var lastVideoTime = -1;

async function predictFace() {
    let results;
    const video = document.getElementById("video");
    let startTimeMs = performance.now();
    if (lastVideoTime !== video.currentTime) {
        lastVideoTime = video.currentTime;
        try{
        results = faceLandmarker.detectForVideo(video, startTimeMs);
        }
        catch (error){
            predictFace();
        }
    }
    if (results) {
        // console.log("Face:");
        console.log(results);
        faceResults = results;
        document.getElementById("faceResults").innerText = JSON.stringify(results, null, 2);

    }
    window.requestAnimationFrame(predictFace);
}


async function createHandLandmarker() {
    var filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
    );

    handLandmarker = await HandLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: "GPU"
        },
        runningMode: "VIDEO",
        numHands: 2
    });
}

createHandLandmarker();

var lastVideoTime1 = -1;

async function predictHands() {
    let results;
    const video = document.getElementById("video");
    let startTimeMs = performance.now();
    if (lastVideoTime1 !== video.currentTime) {
        lastVideoTime1 = video.currentTime;
        try{
            results = handLandmarker.detectForVideo(video, startTimeMs);
        }
        catch (error){
            predictHands();
        }
    }
    if (results) {
        // console.log("Hands:");
        console.log(results);
        handResults = results;
        document.getElementById("handResults").innerText = JSON.stringify(results, null, 2);

    }
    window.requestAnimationFrame(predictHands);
}


async function createPoseLandmarker() {
    var filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
    );

    poseLandmarker = await PoseLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
            delegate: "GPU"
        },
        runningMode: "VIDEO",
        smoothLandmarks: true
    });
}

createPoseLandmarker();

var lastVideoTime2 = -1;

async function predictPose() {
    let results;
    const video = document.getElementById("video");
    let startTimeMs = performance.now();
    if (lastVideoTime2 !== video.currentTime) {
        lastVideoTime2 = video.currentTime;
        try{
            results = poseLandmarker.detectForVideo(video, startTimeMs);
        }
        catch (error){
            predictPose();
        }
    }
    if (results) {
        // console.log("Pose:");
        console.log(results);
        poseResults = results;
        document.getElementById("poseResults").innerText = JSON.stringify(results, null, 2);
    }
    window.requestAnimationFrame(predictPose);
}

