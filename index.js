import * as THREE from "./three.js/build/three.module.js";
import {OrbitControls} from "./three.js/examples/jsm/controls/OrbitControls.js";


let scene = new THREE.Scene();
scene.color = new THREE.Color(89, 73, 40);
scene.fog = new THREE.Fog(0x594928, 0.1, 80);
let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x594928, 1);
document.body.appendChild(renderer.domElement);

let planeGeometry = new THREE.PlaneBufferGeometry(800, 800, 8, 8);
let material = new THREE.MeshBasicMaterial({color: 0xfee896, side : THREE.DoubleSide});
let plane = new THREE.Mesh(planeGeometry, material);
plane.rotateX(- Math.PI / 2);

scene.add(plane);

let horizontalBar = new THREE.BoxGeometry(4, 1, 1);
let verticalBar = new THREE.BoxGeometry(1, 2, 1);
let materialSte = new THREE.MeshLambertMaterial({color: 0xff0000});


let S1 = new THREE.Mesh(horizontalBar, materialSte);
S1.position.set(0, 0.5, 0);

let S2 = new THREE.Mesh(verticalBar, materialSte);
S2.position.set(1.5, 2, 0);

let S3 = new THREE.Mesh(horizontalBar, materialSte);
S3.position.set(0, 3.5, 0);

let S4 = new THREE.Mesh(verticalBar, materialSte);
S4.position.set(-1.5, 5, 0);

let S5 = new THREE.Mesh(horizontalBar, materialSte);
S5.position.set(0, 6.5, 0);

var SGroup = new THREE.Group();
SGroup.add(S1);
SGroup.add(S2);
SGroup.add(S3);
SGroup.add(S4);
SGroup.add(S5);
SGroup.position.x = -5;

let tBarGeometry = new THREE.BoxGeometry(1, 6, 1);
let T1 = new THREE.Mesh(tBarGeometry, materialSte);
T1.position.set(0, 3, 0);

let T2 = new THREE.Mesh(horizontalBar, materialSte);
T2.position.set(0, 6.5, 0);

var TGroup = new THREE.Group();
TGroup.add(T2);
TGroup.add(T1);

let E1 = new THREE.Mesh(horizontalBar, materialSte);
E1.position.set(0, 0.5, 0);

let E2 = new THREE.Mesh(verticalBar, materialSte);
E2.position.set(-1.5, 2, 0);

let E3 = new THREE.Mesh(horizontalBar, materialSte);
E3.position.set(0, 3.5, 0);

let E4 = new THREE.Mesh(verticalBar, materialSte);
E4.position.set(-1.5, 5, 0);

let E5 = new THREE.Mesh(horizontalBar, materialSte);
E5.position.set(0, 6.5, 0);

let EGroup = new THREE.Group();
EGroup.add(E1);
EGroup.add(E2);
EGroup.add(E3);
EGroup.add(E4);
EGroup.add(E5);
EGroup.position.x = 5;

var STEGroup = new THREE.Group();
STEGroup.add(SGroup);
STEGroup.add(TGroup);
STEGroup.add(EGroup);

let baseOneGeometry = new THREE.BoxGeometry(18, 1, 3);
let baseTwoGeometry = new THREE.BoxGeometry(20, 1, 5);
let baseMaterial = new THREE.MeshLambertMaterial({color: 0x6d6d6d});

let baseOne = new THREE.Mesh(baseOneGeometry, baseMaterial);
let baseTwo = new THREE.Mesh(baseTwoGeometry, baseMaterial);
baseOne.position.y = 1.5;
baseTwo.position.y = 0.5;

var baseGroup = new THREE.Group();
baseGroup.add(baseOne);
baseGroup.add(baseTwo);

STEGroup.position.y = 2;

var steAndBase = new THREE.Group();
steAndBase.add(baseGroup);
steAndBase.add(STEGroup);

scene.add(steAndBase);


let light = new THREE.PointLight(0xffffff);
light.position.set(0, 20, 10);
scene.add(light);

var lightAngle = 0;

camera.position.y = 10;
let controls = new OrbitControls(camera, renderer.domElement);

let animate = function () {

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

animate();