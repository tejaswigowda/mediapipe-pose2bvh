---
title: 'Realtime Web-based Monocular Camera Feed to Biovision Hierarchy (BVH) Format'
tags:
  - JavaScript
  - three.js
  - mediapipe
  - pose
  - hand tracking
  - 3D
  - animation
authors:
  - name: 'Tejaswi Gowda'
    orcid: 0000-0002-0896-6526
    affiliation: "1"
   
affiliations:
 - name: "Arizona State University, Tempe, AZ, USA"
   index: 1
date: 22 February 2024
bibliography: paper.bib

---

# Summary

This is a simple tool to convert the output of the MediaPipe Pose model to a BVH file. The BVH file can be used to animate a 3D character in Blender or any other 3D software that supports the BVH format. It also generates blendshapes for the face. The blendshapes can be used to animate a 3D character's face in Blender or any other 3D software that supports blendshapes. BVH is supported by many animation software including Blender, Maya, and 3ds Max. The software can be used to animate a 3D character in real-time, animate a 3D character in virtual reality or in a game. The software can also be used to analyze the kinematics of the human body, diagnose and treat musculoskeletal disorders, analyze the movements of athletes, detect and prevent crimes, and control robots using body movements, among other applications. Since the code is written in JavaScript, it can be easily extended to support other pose estimation models and animation formats. 

# Statement of need

The MediaPipe Pose model outputs the 3D coordinates of 33 keypoints on the human body[@mediapipe]. The keypoints include the 25 keypoints of the body, 21 keypoints of the left hand, 21 keypoints of the right hand[@mediapipehand], and 468 keypoints of the face[@mediapipeface]. The 3D coordinates of these keypoints cannot directly be mapped to a 3D model, which needs data in the Bio-Vision Hierarchy (BVH)[@bvh] format. This tool generates BVH outout whuch be used to animate a 3D character in Blender or any other 3D software. The 3D coordinates of the face keypoints can be used to generate blendshapes for the face. The blendshapes can be used to animate a 3D character's face in Blender or any other 3D software that supports blendshapes. Many commercial tools exist to generate BVH from pre-recorded videos. However, there are no tools that can generate BVH in real-time from a monocular camera feed. This software fills that gap. The software is released under the GNU General Public License version 3 (GPLv3)[@gnugpl].

# Key Features

1. Converts the output of the MediaPipe Pose model to a BVH file.
2. Generates blendshapes for the face.
3. Hand tracking.
4. Plug and play into any 3D software that supports BVH and blendshapes.
5. No installation required. Just open the HTML file in the browser.
6. Real-time time recording of the BVH file and the blendshapes.
7. Inexpensive. No need for expensive motion capture systems.
8. Other fbx models can be used. The software currently uses `ybot.fbx` as the 3D character. The software currently uses `scene.glb` as the face model. Both can be edited using the three.js editor[@threejseditor].

# Dependencies

A modern web browser that supports the WebAssembly (WebRTC support needed for streaming). Tested on Chrome and Firefox. Also works on mobile Chrome, albeit at a lower frame rarte. For development, you will need Node.js[@nodejs] and http-server[@httpserver].


# Usage

```bash
git clone https://github.com/tejaswigowda/mediapipe-pose2bvh.git
cd mediapipe-pose2bvh
http-server
```

Open the browser and go to `http://localhost:8080/`[http://localhost:8080/] and enable the camera. The 3D character will start animating based on your body movements. The 3D character's face will also animate based on your facial expressions. To record use ![Start Record](./start.png). To stop recording use ![Stop Record](./stop.png). The BVH file and the blendshapes will be generated and downloaded.



# Architecture

The software is written in JavaScript and uses the three.js[@threejs] library for 3D rendering. The software uses the MediaPipe Pose model to get the 3D coordinates of the keypoints. The 3D coordinates are then used to generate the BVH file and the blendshapes. The BVH file and the blendshapes are then downloaded. There are 3 independent threads running in the software. Two threads are used to get the 3D coordinates of the keypoints (pose + facemesh) and the third thread is used to render the 3D character.

![Different concurrent threads and their interaction ~\label{fig:arch}](./docs/imgs/arch.png){ width=100% }

As shown in the Figure~\autoref{fig:arch}, the third thread is used to render the 3D character. The 3D character is rendered using the three.js library. The 3D coordinates of the keypoints are used to animate the 3D character. The BVH file and the blendshapes are generated using the 3D coordinates of the keypoints. The BVH file and the blendshapes are then downloaded.

Biovision Hierarchy (BVH) is a file format used to store motion capture data. The format was developed by Biovision, a defunct motion capture services company, to provide interoperability between different motion capture systems. The format is now widely used in the animation industry. The BVH file generated by the software can be used to animate a 3D character in Blender[@blender] or any other 3D software that supports the BVH format. The blendshapes generated by the software can be used to animate a 3D character's face in Blender or any other 3D software that supports blendshapes. Many commercial tools like MotionBuilder[@motionbuilder], Maya[@maya], and 3ds Max[@3dsmax] support the BVH format. All modern game engines and XR platforms such as Unity and Unreal engine also natively support BVH. The BVH format specifies the rotation of each bone in the skeleton starting from the root bone. BVH supports both translation and rotation of the bones. This tool only estimates the rotations and not movement of the human body. Mediapipe Iris model can be used to estimate the distance from the camera. The distance can be used to scale the 3D character based on the distance from the camera. The software currently estimates distance from the camera. In the future, support for estimating distance using the iris model[@mediapipeiris] will be added.


# Web Demo

[![Demo](./docs/imgs/demo.png)](https://tejaswigowda.github.io/mediapipe-pose2bvh/)

To access the web-demo go to [https://tejaswigowda.github.io/mediapipe-pose2bvh/](https://tejaswigowda.github.io/mediapipe-pose2bvh/) and enable the camera. The 3D character will start animating based on your body movements. The 3D character's face will also animate based on your facial expressions.

The software generates BVH frames at 20 frames per second, when running on a M1 MacBook Pro 64GB RAM. The software generates blendshapes at 20 frames per second, when running on a M1 MacBook Pro 64GB RAM. Frame rate may vary based on the hardware and the browser used. The software has been tested on Chrome and Firefox.

# Applications

- Animation: The BVH file generated by the software can be used to animate a 3D character in Blender or any other 3D software that supports the BVH format. The BVH generated has been tested with Blender and works well. The blendshapes generated by the software can be used to animate a 3D character's face in Blender or any other 3D software that supports blendshapes.

- Kinematic Analysis: Full bone movement can be used to analyze the kinematics of the human body. This can be used to diagnose and treat musculoskeletal disorders.

- Extended Reality: Full body, finger and face tracking can be used to animate a 3D character in virtual reality. This will allow the user to interact with the 3D character in real-time. The web-based nature lends itself to be used in multi-user virtual reality environments.

- Gaming: Body pose generated can be used to animate a 3D character in a game. This will allow the user to control the 3D character using their body movements. The data generated works well with the Unity game engine.

- Telemedicine: The 3D bone movement generated can be used to analyze the movements of the human body. This can be used to diagnose and treat musculoskeletal disorders. Since the software is web-based, it can be used for telemedicine as the camera feed can be transmitted over the internet.

- Sports: The 3D bone movement generated can be used to analyze the movements of the human body. This can be used to analyze the movements of athletes and improve their performance.

- Security: The 3D bone movement generated can be used to analyze the movements of the human body. This can be used to detect and prevent crimes. Face tracking can be used to identify individuals, and other bio-metric data can be used to identify individuals.

- Robotics: The 3D bone movement generated can be used to analyze the movements of the human body. This can be used to control robots using body movements. 

# Limitations and Future Work

The software currently supports only the MediaPipe Pose model. In the future, support for other pose estimation models[@openpose] will be added. The software currently supports only the BVH format. In the future, support for other animation formats will be added. The software currently supports only the blendshapes for the face. In the future, support for blendshapes for the body will be added. The software currently estimates distance from the camera. In the future, support for estimating distance using the iris model will be added. Fusing multiple camera feeds to estimate 3D coordinates of the keypoints will be added. Smoothing the 3D coordinates of the keypoints will be added.

# Acknowledgements

Thanks to the MediaPipe team for developing the pose estimation model. Thanks to the three.js team for developing the 3D rendering library. Thanks to Assegid Kidane, Siva Munaganuru, Varun Mullangi and the rest of the AME team for testing the software.

# References

<div id="refs"></div>
