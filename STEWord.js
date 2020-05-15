import * as THREE from "./three.js/build/three.module.js";

class STEWord
{
    horizontalBar = new THREE.BoxGeometry(4, 1, 1);
    verticalBar = new THREE.BoxGeometry(1, 2, 1);
    materialSte = new THREE.MeshLambertMaterial({color: 0xff0000});

    S1 = new THREE.Mesh(this.horizontalBar, this.materialSte);
    S2 = new THREE.Mesh(this.verticalBar, this.materialSte);
    S3 = new THREE.Mesh(this.horizontalBar, this.materialSte);
    S4 = new THREE.Mesh(this.verticalBar, this.materialSte);
    S5 = new THREE.Mesh(this.horizontalBar, this.materialSte);

    tBarGeometry = new THREE.BoxGeometry(1, 6, 1);
    T1 = new THREE.Mesh(this.tBarGeometry, this.materialSte);
    T2 = new THREE.Mesh(this.horizontalBar, this.materialSte);

    E1 = new THREE.Mesh(this.horizontalBar, this.materialSte);
    E2 = new THREE.Mesh(this.verticalBar, this.materialSte);
    E3 = new THREE.Mesh(this.horizontalBar, this.materialSte);
    E4 = new THREE.Mesh(this.verticalBar, this.materialSte);
    E5 = new THREE.Mesh(this.horizontalBar, this.materialSte);

    baseOneGeometry = new THREE.BoxGeometry(18, 1, 3);
    baseTwoGeometry = new THREE.BoxGeometry(20, 1, 5);
    baseMaterial = new THREE.MeshLambertMaterial({color: 0x6d6d6d});

    baseOne = new THREE.Mesh(this.baseOneGeometry, this.baseMaterial);
    baseTwo = new THREE.Mesh(this.baseTwoGeometry, this.baseMaterial);

    SGroup = new THREE.Group();
    TGroup = new THREE.Group();
    EGroup = new THREE.Group();
    STEGroup = new THREE.Group();
    //baseGroup = new THREE.Group();
    steAndBase = new THREE.Group();

    constructor() {
        this.S1.position.set(0, 0.5, 0);
        this.S2.position.set(1.5, 2, 0);
        this.S3.position.set(0, 3.5, 0);
        this.S4.position.set(-1.5, 5, 0);
        this.S5.position.set(0, 6.5, 0);

        this.T1.position.set(0, 3, 0);
        this.T2.position.set(0, 6.5, 0);

        this.E1.position.set(0, 0.5, 0);
        this.E2.position.set(-1.5, 2, 0);
        this.E3.position.set(0, 3.5, 0);
        this.E4.position.set(-1.5, 5, 0);
        this.E5.position.set(0, 6.5, 0);

        this.baseOne.position.y = 1.5;
        this.baseTwo.position.y = 0.5;
    }

     buildGroups() {
        this.SGroup.add(this.S1);
        this.SGroup.add(this.S2);
        this.SGroup.add(this.S3);
        this.SGroup.add(this.S4);
        this.SGroup.add(this.S5);
        this.SGroup.position.x = -5;

        this.TGroup.add(this.T1);
        this.TGroup.add(this.T2);

        this.EGroup.add(this.E1);
        this.EGroup.add(this.E2);
        this.EGroup.add(this.E3);
        this.EGroup.add(this.E4);
        this.EGroup.add(this.E5);
        this.EGroup.position.x = 5;

        this.STEGroup.add(this.SGroup);
        this.STEGroup.add(this.TGroup);
        this.STEGroup.add(this.EGroup);
        this.STEGroup.position.y = 2;

        //this.baseGroup.add(this.baseOne);
        //this.baseGroup.add(this.baseTwo);

        this.steAndBase.add(this.STEGroup);
        this.steAndBase.add(this.baseOne);
    }

    resetPosition(scene) {
        document.getElementById("vE").value = 0;
        document.getElementById("vS").value = 0;
        document.getElementById("vT").value = 0;
        document.getElementById("vBase").value = 0;
        this.EGroup.rotation.y = 0;
        this.SGroup.rotation.y = 0;
        this.TGroup.rotation.y = 0;
        this.steAndBase.rotation.y = 0;
        scene.updateMatrixWorld();
        var vec = new THREE.Vector3();
        this.EGroup.getWorldPosition(vec);
        if(vec.x < 0)
        {
           this.steAndBase.rotateY(Math.PI);
        }
        scene.updateMatrixWorld();
        this.E2.getWorldPosition(vec);
        if(vec.x > 4)
        {
            this.EGroup.rotateY(Math.PI);
        }
        scene.updateMatrixWorld();
        this.S2.getWorldPosition(vec);
        if(vec.x < -4)
        {
            this.SGroup.rotateY(Math.PI);
        }
    }
}

export default STEWord;