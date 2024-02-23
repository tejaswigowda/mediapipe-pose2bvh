# Realtime Web-based Monocular Camera Feed to Biovision Hierarchy (BVH) format

This is a simple tool to convert the output of the MediaPipe Pose model to a BVH file. The BVH file can be used to animate a 3D character in Blender or any other 3D software that supports the BVH format. It also generates blendshapes for the face. The blendshapes can be used to animate a 3D character's face in Blender or any other 3D software that supports blendshapes.

## Key Features
1. Converts the output of the MediaPipe Pose model to a BVH file.
2. Generates blendshapes for the face.
3. Hand tracking.
4. Plug and play into any 3D software that supports BVH and blendshapes.
5. No installation required. Just open the HTML file in the browser.

## Demo

[![Demo](./demo.gif)](https://tejaswigowda.github.io/mediapipe-pose2bvh/)



## Dependencies
A modern web browser that supports the WebAssembly. Tested on Chrome and Firefox.

For development:
- Node.js [https://nodejs.org/]
- http-server [https://www.npmjs.com/package/http-server]
    ```
    npm install --global http-server
    ```



## Usage
    
```bash
git clone https://github.com/tejaswigowda/mediapipe-pose2bvh.git
cd mediapipe-pose2bvh
http-server docs
```

Open the browser and go to `http://localhost:8080/` and upload the JSON file generated by the MediaPipe Pose model. The BVH file and the blendshapes will be generated and downloaded.



## Statement of need

The MediaPipe Pose model outputs the 3D coordinates of 33 keypoints on the human body. The keypoints include the 25 keypoints of the body, 21 keypoints of the left hand, 21 keypoints of the right hand, and 468 keypoints of the face. The 3D coordinates of these keypoints can be used to animate a 3D character in Blender or any other 3D software that supports the BVH format. The 3D coordinates of the face keypoints can be used to generate blendshapes for the face. The blendshapes can be used to animate a 3D character's face in Blender or any other 3D software that supports blendshapes.


## Extending the software

All code is in the `/docs` folder. 

![File Structure](./imgs/files.png){ width=20% }

`index.html` is the main file. The main js code is in `script.js`. The `three.min.js` library is used for 3D rendering. All results are stored in:

1. `holisticResults` [https://github.com/tejaswigowda/mediapipe-pose2bvh/blob/c60e43773ddb2e8070ad7d274e6b1bf338ab5747/docs/script.js#L87]
2. `faceResults` [https://github.com/tejaswigowda/mediapipe-pose2bvh/blob/f73e1611e246814512042e3c5801241dceb3eb2a/docs/script.js#L59].

## License

This software is released under the GNU General Public License version 3 (GPLv3). The complete license is provided as [LICENSE](LICENSE) file.