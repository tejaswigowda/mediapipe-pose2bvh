// run http server with service worker

// register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
            console.log('Service worker registered.', reg);
        });
}




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
    FaceLandmarker,
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
        modelComplexity: 1,
        outputFaceBlendshapes: true,
        outputFaceGeometry: true,
        output_facial_transformation_matrixes: true,
        outputFacialTransformationMatrixes: true,
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
        try {
            results = faceLandmarker.detectForVideo(video, startTimeMs);
        }
        catch (error) {
            predictFace();
        }
    }
    if (results) {
        // console.log("Face:");
        // console.log(results);
        faceResults = results;
        document.getElementById("faceResults").innerText = JSON.stringify(results, null, 2);

    }
    window.requestAnimationFrame(predictFace);
}



import "https://cdn.jsdelivr.net/npm/@mediapipe/holistic@latest/holistic.js";
import "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js";

const holistic = new Holistic({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@latest/${file}`;
    },
});

holistic.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: true,
    smoothSegmentation: true,
    refineFaceLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
    output_face_landmarks: true,
    output_face_blendshapes: true,
    outputFaceBlendshapes: true,
    outputFaceGeometry: true,
    output_facial_transformation_matrixes: true,
    outputFacialTransformationMatrixes: true
});
holistic.onResults(onResults2);

function onResults2(results) {
    console.log("Holistic:");
    console.log(results);
    holisticResults = results;
}


const camera = new Camera(document.getElementById("video"), {
    onFrame: async () => {
        await holistic.send({ image: document.getElementById("video") });
    },
    width: document.getElementById("video").width,
    height: document.getElementById("video").height
});
camera.start();