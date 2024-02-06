import * as glMatrix from 'https://cdn.jsdelivr.net/npm/gl-matrix@2.8.1/dist/gl-matrix-min.js';

/**
 * Calculates the magnitude (length) of a 3D vector.
 * @param {Array} v - The vector as an array [x, y, z].
 * @returns {number} The magnitude of the vector.
 */
function vecLength(v) {
    return Math.sqrt(v.reduce((acc, val) => acc + val * val, 0));
}

/**
 * Normalizes a 3D vector to unit length.
 * @param {Array} v - The vector as an array [x, y, z].
 * @returns {Array} The normalized vector.
 */
function normalize(v) {
    const norm = vecLength(v);
    return norm === 0 ? v : v.map((val) => val / norm);
}


/**
 * Calculates a look-at rotation matrix for orienting an object towards a target.
 * @param {Array} eye - The observing point as an array [x, y, z].
 * @param {Array} target - The target point as an array [x, y, z].
 * @returns {Array} A 3x3 rotation matrix as an array of arrays.
 */
function lookAt(eye, target) {
    const axisZ = normalize(subtractVectors(eye, target));
    let axisX = crossProduct([0, 0, 1], axisZ);
    if (vecLength(axisX) === 0) {
        axisX = [1, 0, 0];
    } else {
        axisX = normalize(axisX);
    }

    const axisY = normalize(crossProduct(axisZ, axisX));

    // Constructing the rotation matrix
    const rotMatrix = [
        axisX, // First row
        axisY, // Second row
        axisZ  // Third row
    ];

    return rotMatrix.map(row => [...row, 0]).concat([[0, 0, 0, 1]]); // Convert to 4x4 by adding homogeneous coordinates
}

/**
 * Subtracts two vectors.
 * @param {Array} v1 - First vector [x, y, z].
 * @param {Array} v2 - Second vector [x, y, z].
 * @returns {Array} The result of the subtraction.
 */
function subtractVectors(v1, v2) {
    return v1.map((val, index) => val - v2[index]);
}

/**
 * Calculates the cross product of two vectors.
 * @param {Array} v1 - First vector [x, y, z].
 * @param {Array} v2 - Second vector [x, y, z].
 * @returns {Array} The cross product as a vector [x, y, z].
 */
function crossProduct(v1, v2) {
    return [
        v1[1] * v2[2] - v1[2] * v2[1],
        v1[2] * v2[0] - v1[0] * v2[2],
        v1[0] * v2[1] - v1[1] * v2[0]
    ];
}

function generateQuaternion(p1, p2) {
    // Calculate the rotation matrix using the lookAt function
    const orient = lookAt([p1.x, p1.y, p1.z], [p2.x, p2.y, p2.z]);
    // Extract the rotation vectors from the matrix
    const vec1 = orient[0].slice(0, 3); // First column of the rotation matrix
    const vec2 = orient[1].slice(0, 3); // Second column, not used directly for quaternion
    const vec3 = orient[2].slice(0, 3); // Third column of the rotation matrix

    // Calculate the trace of the matrix
    const trace = vec1[0] + vec2[1] + vec3[2];

    let q;
    if (trace > 0) {
        const S = Math.sqrt(trace + 1.0) * 2;
        q = [
            0.25 * S,
            (vec3[1] - vec2[2]) / S,
            (vec1[2] - vec3[0]) / S,
            (vec2[0] - vec1[1]) / S,
        ];
    } else if ((vec1[0] > vec2[1]) & (vec1[0] > vec3[2])) {
        const S = Math.sqrt(1.0 + vec1[0] - vec2[1] - vec3[2]) * 2;
        q = [
            (vec3[1] - vec2[2]) / S,
            0.25 * S,
            (vec1[1] + vec2[0]) / S,
            (vec1[2] + vec3[0]) / S,
        ];
    } else if (vec2[1] > vec3[2]) {
        const S = Math.sqrt(1.0 + vec2[1] - vec1[0] - vec3[2]) * 2;
        q = [
            (vec1[2] - vec3[0]) / S,
            (vec1[1] + vec2[0]) / S,
            0.25 * S,
            (vec2[2] + vec3[1]) / S,
        ];
    } else {
        const S = Math.sqrt(1.0 + vec3[2] - vec1[0] - vec2[1]) * 2;
        q = [
            (vec2[0] - vec1[1]) / S,
            (vec1[2] + vec3[0]) / S,
            (vec2[2] + vec3[1]) / S,
            0.25 * S,
        ];
    }

    // Convert quaternion to polar form to get the angle
    const angle = 2 * Math.acos(q[0]);
    const realAngle = (angle * 180) / Math.PI;

    // Apply any filtering or adjustments as needed
    // const realAngleFiltered = yourFilterFunction(realAngle);
    return { quaternion: q, angle: realAngle };
}

export { generateQuaternion };