import * as THREE from "./three.js/build/three.module.js";
import {OrbitControls} from "./three.js/examples/jsm/controls/OrbitControls.js";
import STEWord from "./STEWord.js";
//import rotateAroundAxis from "./axisRotate.js";

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

var lightAngle = 0;

camera.position.y = 10;
camera.position.x = 5;
let controls = new OrbitControls(camera, renderer.domElement);
var fixate;
var baseRotation;

//Teste
//word.EGroup.rotateY(-Math.PI /2);

let sphereGeometry = new THREE.SphereGeometry(1);
let sphereMaterial = new THREE.MeshBasicMaterial({color: 0x6d6d6d});
let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

sphere.position.set(15, 1, 0);

scene.add(sphere);

function nextPos(x)
{
    return 17/2 - 30/289*Math.pow(x - 13/2, 2);
}

var num = 0;
var down;
var stage = 0;
var angleSum = 500;
var sum = 0;

let ePoint = new THREE.Vector3(4.5, 0,0);
let tPoint = new THREE.Vector3(-0.5, 0, 0);
var eAxis = new THREE.Vector3(0,0,1);
var q = new THREE.Quaternion();
let animate = function () {
    num = num + 1;
    fixate = document.getElementById("fixate").checked;
    down = document.getElementById("down").checked;
    baseRotation = parseFloat(document.getElementById("vBase").value)*0.2*Math.PI/180;
    if(fixate && !down)
    {
        word.SGroup.rotateY(-baseRotation);
        word.EGroup.rotateY(-baseRotation);
        word.TGroup.rotateY(-baseRotation);
        word.steAndBase.rotateY(baseRotation);
    }
    else if(!down && !fixate)
    {
        word.EGroup.rotateY(parseFloat(document.getElementById("vE").value)*0.2*Math.PI/180);
        word.SGroup.rotateY(parseFloat(document.getElementById("vS").value)*0.2*Math.PI/180);
        word.TGroup.rotateY(parseFloat(document.getElementById("vT").value)*0.2*Math.PI/180);
        word.steAndBase.rotateY(baseRotation);
    }
    else if(down && !fixate)
    {
        if(stage === 0)
        {
            word.steAndBase.rotation.y = 0;
            word.EGroup.rotation.y = Math.PI / 2;
            word.SGroup.rotation.y = Math.PI / 2;
            word.TGroup.rotation.y = Math.PI / 2;
            stage = 1;
            num = 0;
        }
        else if(stage === 1)
        {
            sphere.position.x = 15 - num*0.3;
            sphere.position.y = nextPos(sphere.position.x);
            if(sphere.position.x <= 6.5)
            {
                stage = 2;
                num = 0;
            }
        }
        else if (stage === 2)
        {
            if(sphere.position.x <= 15)
            {
                sphere.position.x = 6.5 + num*0.2;
                sphere.position.y = nextPos(sphere.position.x);
            }
            if(sum <= 0.608)
            {
                angleSum -= 10;
                q.setFromAxisAngle(eAxis, Math.PI/angleSum);
                sum += Math.PI /angleSum;
                word.EGroup.applyQuaternion(q);
                word.EGroup.position.sub(ePoint);
                word.EGroup.position.applyQuaternion(q);
                word.EGroup.position.add(ePoint);
            }
            else
            {
                q.setFromAxisAngle(eAxis, Math.PI / angleSum);
                sum += Math.PI /angleSum;
                word.EGroup.applyQuaternion(q);
                word.EGroup.position.sub(ePoint);
                word.EGroup.position.applyQuaternion(q);
                word.EGroup.position.add(ePoint);

                word.TGroup.applyQuaternion(q);
                word.TGroup.position.sub(tPoint);
                word.TGroup.position.applyQuaternion(q);
                word.TGroup.position.add(tPoint);
            }
            //sphere.position.set(4.5, 2, 0);

        }


    }
    //sphere.position.x = 15 - num*0.01;
    //sphere.position.y = nextPos(sphere.position.x);

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

animate();