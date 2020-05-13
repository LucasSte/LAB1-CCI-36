import * as THREE from "./three.js/build/three.module.js";

THREE.Group.prototype.rotateAroundWorldAxis = function () {

    var q = new THREE.Quaternion();

    return function rotateAroundWorldAxis(point, axis, angle) {
        q.setFromAxisAngle(axis, angle);

        this.applyQuaternion(q);

        this.position.sub(point);
        this.position.applyQuaternion(q);
        this.position.add(point);

        return this;
    }
}
