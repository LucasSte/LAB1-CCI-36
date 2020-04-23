import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let cubeGeometry = new THREE.BoxGeometry(1,1,1);
let cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

let coneGeometry = new THREE.ConeGeometry(0.5, 1, 4);
let coneMaterial = new THREE.MeshLambertMaterial({color: 0x00ff00});
let cone = new THREE.Mesh(coneGeometry, coneMaterial);

let sphereGeometry = new THREE.SphereGeometry(0.5, 8, 8);
let sphereMaterial = new THREE.MeshLambertMaterial({color: 0x0000ff});
let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

cube.position.x = -2;
cube.position.z = -5;
cone.position.x = -5;
sphere.position.z = -5;
sphere.position.x = 2;
cube.position.z = -5;

scene.add(cube);
scene.add(cone);
scene.add(sphere);

let light = new THREE.PointLight(0xffffff);
light.position.z = 0;
light.position.y = 10;
light.position.z = 0;
scene.add(light);

var lightAngle = 0;

camera.position.z = 10;
let controls = new OrbitControls(camera, renderer.domElement);

let animate = function () {
    lightAngle +=5;

    if(lightAngle > 360)
    {
        lightAngle = 0;
    }
    light.position.x = 5*Math.cos(lightAngle * Math.PI/180);
    light.position.z = 5*Math.sin(lightAngle * Math.PI / 180);
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

animate();