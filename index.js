import * as THREE from "./three.js/build/three.module.js";
import {OrbitControls} from "./three.js/examples/jsm/controls/OrbitControls.js";
import STEWord from "./STEWord.js";
import DominoController from "./dominoController.js";

let scene = new THREE.Scene();
scene.color = new THREE.Color(89, 73, 40);
scene.fog = new THREE.Fog(0x594928, 0.1, 80);
let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

let renderer = new THREE.WebGLRenderer({canvas: document.getElementById("canv")});
renderer.setClearColor(0x594928, 1);
document.body.appendChild(renderer.domElement);

let planeGeometry = new THREE.PlaneBufferGeometry(800, 800, 8, 8);
let material = new THREE.MeshBasicMaterial({color: 0xfee896, side : THREE.DoubleSide});
let plane = new THREE.Mesh(planeGeometry, material);
plane.rotateX(- Math.PI / 2);

scene.add(plane);

let word = new STEWord();
word.buildGroups();

scene.add(word.steAndBase);
scene.add(word.baseTwo);

let light = new THREE.PointLight(0xffffff);
light.position.set(0, 20, 10);
scene.add(light);

camera.position.y = 10;
camera.position.x = 5;
let controls = new OrbitControls(camera, renderer.domElement);

let sphereGeometry = new THREE.SphereGeometry(1);
let sphereMaterial = new THREE.MeshBasicMaterial({color: 0x6d6d6d});
let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

sphere.position.set(15, 1, 0);

scene.add(sphere);

var baseRotation;
var basic;
var fixed;
var domino;
var resetBasic = true;
var resetFixed = true;
var resetDomino = true;
var dController = new DominoController();
let animate = function () {
    domino = document.getElementById("domino").checked
    fixed = document.getElementById("fixed").checked
    basic = document.getElementById("basic").checked

    baseRotation = parseFloat(document.getElementById("vBase").value)*0.2*Math.PI/180;
    if(fixed)
    {
        if(resetFixed)
        {
            word.resetPosition(scene);
            resetFixed = false;
            resetBasic = true;
            resetDomino = true;
        }
        word.SGroup.rotateY(-baseRotation);
        word.EGroup.rotateY(-baseRotation);
        word.TGroup.rotateY(-baseRotation);
        word.steAndBase.rotateY(baseRotation);
    }
    else if(basic)
    {
        if(resetBasic)
        {

            word.resetPosition(scene);
            resetBasic = false;
            resetFixed = true;
            resetDomino = false;
        }
        word.EGroup.rotateY(parseFloat(document.getElementById("vE").value)*0.2*Math.PI/180);
        word.SGroup.rotateY(parseFloat(document.getElementById("vS").value)*0.2*Math.PI/180);
        word.TGroup.rotateY(parseFloat(document.getElementById("vT").value)*0.2*Math.PI/180);
        word.steAndBase.rotateY(baseRotation);
        resetFixed = true;
    }
    else if(domino)
    {
        if(resetDomino)
        {
            word.resetPosition(scene);
            dController.adjustPositions(word);
            resetDomino = false;
            resetFixed = true;
            resetBasic = true;
        }
        dController.animate(word, sphere);

    }

    //TODO: Terminar efeito domino (ver comentarios no arquivo dominocontroller.js)
    //TODO: Pensar em outra transformacao (2D ou 3D) a partir dos slides do forster (pode fazer as letras se desmontarem depois de cairem, mas acho muito suga)
    //TODO: Justificar posicionamento da camera (usei  orbit controls, que permite mexer com o mouse)
    //TODO: Deixar o codigo funcionando no pc do Forster (sugestao: WebPack)

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

animate();