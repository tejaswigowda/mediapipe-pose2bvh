// var numFrames = 200; // Replace numFrames with the number of frames in your animation
// var frameTime = 1/30; 
const radToDeg = 180 / Math.PI;

function quaternionToEulerDegrees(q) {
    const euler = new THREE.Euler().setFromQuaternion(q, "XYZ");
    // const euler1 = new THREE.Euler().setFromQuaternion(q, "XYZ");
    // console.log([euler1.x * radToDeg, euler1.y * radToDeg, euler1.z * radToDeg]);
    // console.log([euler.x * radToDeg, euler.y * radToDeg, euler.z * radToDeg]);
    return [euler.x * radToDeg, euler.y * radToDeg, euler.z * radToDeg];
}

function updateMotionData(doret) {
    var time = performance.now()


    const jointInfo = [];
    const rootJoint = model.getObjectByName("mixamorigHips");
    if (rootJoint) {
        // console.log("Root joint found!", rootJoint);
        traverseHierarchy(rootJoint, jointInfo, 0);

        if (!doret || recording) {
            recordedMotionData.push(jointInfo);
        }
    } else {
        console.error("Root joint not found!");
    }
    var time2 = performance.now()
    lastUpdateFrameTime = time2 - time;
    // console.log(time2, time, lastUpdateFrameTime);
    if(doret){
        return jointInfo;
    }
    else{
        return;
    }
}


function traverseHierarchy(joint, jointInfo, level = 0) {
    const jointNames = [
        "Hips",
        "LeftUpLeg",
        "RightUpLeg",
        "Spine",
        "Spine1",
        "Spine2",
        "Neck",
        "Head",
        "LeftShoulder",
        "LeftArm",
        "LeftForeArm",
        "LeftHand",
        "RightShoulder",
        "RightArm",
        "RightForeArm",
        "RightHand",
        "LeftLeg",
        "LeftFoot",
        "LeftToeBase",
        "RightLeg",
        "RightFoot",
        "RightToeBase",
        // lefthand fingers
        "LeftHandThumb1",
        "LeftHandThumb2",
        "LeftHandThumb3",
        "LeftHandThumb4",
        "LeftHandIndex1",
        "LeftHandIndex2",
        "LeftHandIndex3",
        "LeftHandIndex4",
        "LeftHandMiddle1",
        "LeftHandMiddle2",
        "LeftHandMiddle3",
        "LeftHandMiddle4",
        "LeftHandRing1",
        "LeftHandRing2",
        "LeftHandRing3",
        "LeftHandRing4",
        "LeftHandPinky1",
        "LeftHandPinky2",
        "LeftHandPinky3",
        "LeftHandPinky4",
        // righthand fingers
        "RightHandThumb1",
        "RightHandThumb2",
        "RightHandThumb3",
        "RightHandThumb4",
        "RightHandIndex1",
        "RightHandIndex2",
        "RightHandIndex3",
        "RightHandIndex4",
        "RightHandMiddle1",
        "RightHandMiddle2",
        "RightHandMiddle3",
        "RightHandMiddle4",
        "RightHandRing1",
        "RightHandRing2",
        "RightHandRing3",
        "RightHandRing4",
        "RightHandPinky1",
        "RightHandPinky2",
        "RightHandPinky3",
        "RightHandPinky4",
        // leftfoot fingers
    ];


    const name = joint.name.replace("mixamorig", "");
   

    const jointExists = jointInfo.some((existingJoint) => existingJoint.name === name);

    if (jointNames.includes(name) && !jointExists) {
        
        
        var position = joint.position;
        position  = position.toArray();
        if (name === "Hips") {
            position[1] -= 100;
        }
        const rotation = quaternionToEulerDegrees(joint.quaternion);

        jointInfo.push({
            name: name,
            position: position,
            rotation: rotation,
            level: level,
        });
    }

    joint.children.forEach((child) => {
        if (child.type === "Bone") {
            if (!jointExists){
            traverseHierarchy(child, jointInfo, level + 1);
            }
            else{
                traverseHierarchy(child, jointInfo, level);
            }
        }
    });
}


// const jointInfo = [];
// const rootJoint = model.getObjectByName("mixamorigHips");
// traverseHierarchy(rootJoint, jointInfo);
function generateBVH(jointInfo, motionData) {
   // console.log(jointInfo);
    let bvhContent = "HIERARCHY\n";

    jointInfo.forEach((joint, index) => {
        const indentation = "  ".repeat(joint.level);
        bvhContent += `${indentation}${joint.level === 0 ? "ROOT" : "JOINT"} ${joint.name}\n`;
        bvhContent += `${indentation}{\n`;
        bvhContent += `${indentation}  OFFSET ${joint.position.join(" ")}\n`;

        if (joint.name === "Hips") {
            bvhContent += `${indentation}  CHANNELS 6 Xposition Yposition Zposition Xrotation Yrotation Zrotation\n`;
        } else {
            bvhContent += `${indentation}  CHANNELS 3 Xrotation Yrotation Zrotation\n`;
        }

        if (index === jointInfo.length - 1 || jointInfo[index + 1].level <= joint.level) {
            bvhContent += `${indentation}  End Site\n`;
            bvhContent += `${indentation}  {\n`;
            bvhContent += `${indentation}    OFFSET 0 0 0\n`;
            bvhContent += `${indentation}  }\n`;
            // for (let i = joint.level; i > 0; i--) {
            //     bvhContent += `${"  ".repeat(i - 1)}}\n`; // Close braces for all the parent joints
            // }
        }

        if (index < jointInfo.length - 1) {
            const nextJoint = jointInfo[index + 1];
            if (nextJoint.level <= joint.level) {
                for (let i = 0; i < joint.level - nextJoint.level + 1; i++) {
                    bvhContent += `${"  ".repeat(joint.level - i)}}\n`; 
                }
            }
        }
        if (index === jointInfo.length - 1) {
            for (let i = joint.level; i >= 0; i--) {
                bvhContent += `${"  ".repeat(i)}}\n`; 
            }
        }
    });

    // Add the MOTION section with the appropriate number of frames and frame time
    numFramesrecorded = motionData.length;
    frameTime = 1/bvhRecorderFrequency;
    // console.log(numFramesrecorded);
    bvhContent += "MOTION\n";
    bvhContent += `Frames: ${numFramesrecorded}\n`;
    bvhContent += `Frame Time: ${frameTime}\n`;

    motionData.forEach(frame => {
        frame.forEach(joint => {
            if (joint.name === "Hips") {
                bvhContent += `${joint.position.join(" ")} ${joint.rotation.join(" ")} `;
            } else {
                bvhContent += `${joint.rotation.join(" ")} `;
            }
        });
        bvhContent += "\n";
    });

    return bvhContent;
}
