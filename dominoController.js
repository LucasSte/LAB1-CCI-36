import * as THREE from "./three.js/build/three.module.js";

class DominoController
{
    num = 0;
    down;
    stage = 0;
    angleRate = 500;
    eAngleSum = 0;
    tAngleSum = 0;
    sAngleSum = 0;

    ePoint = new THREE.Vector3(4.5, 0,0);
    tPoint = new THREE.Vector3(-0.5, 0, 0);
    sPoint = new THREE.Vector3(-5.5, 0, 0);
    eAxis = new THREE.Vector3(0,0,1);
    q = new THREE.Quaternion();

    constructor() {
    }

    adjustPositions(word)
    {
        word.steAndBase.rotation.y = 0;
        word.EGroup.rotation.y = Math.PI / 2;
        word.SGroup.rotation.y = Math.PI / 2;
        word.TGroup.rotation.y = Math.PI / 2;
        this.stage = 1;
        this.num = 0;
    }

    nextBallPos(x)
    {
    return 17/2 - 30/289*Math.pow(x - 13/2, 2);
    }

    animate(word, sphere)
    {
        if(this.stage === 1)
        {
            sphere.position.x = 15 - this.num*0.3;
            sphere.position.y = this.nextBallPos(sphere.position.x);
            if(sphere.position.x <= 6.5)
            {
                this.stage = 2;
                this.num = 0;
            }
            this.num += 1;
        }
        else if(this.stage === 2)
        {
            if(sphere.position.x <= 15)
            {
                sphere.position.x = 6.5 + this.num*0.2;
                sphere.position.y = this.nextBallPos(sphere.position.x);
                this.num += 1;
            }
            if(this.eAngleSum <= 0.608)
            {
                this.angleRate -= 10;
                this.eAngleSum += Math.PI / this.angleRate;
                this.performLetterRotationWithQ(word.EGroup, this.eAxis, this.ePoint, Math.PI / this.angleRate);
            }
            else
            {
                this.angleRate = 500;
                this.stage = 3;
            }
        }
        else if(this.stage === 3)
        {
            if(this.tAngleSum <= 0.608)
            {
                this.angleRate -= 10;
                this.tAngleSum += Math.PI / this.angleRate;
                this.performLetterRotationWithQ(word.TGroup, this.eAxis, this.tPoint, Math.PI / this.angleRate);
                let eAngle = this.getBehindLetterAngle(Math.PI/2 - this.tAngleSum);
                let eRotation = eAngle - this.eAngleSum;
                this.performLetterRotationWithQ(word.EGroup, this.eAxis, this.ePoint, eRotation);
                this.eAngleSum = eAngle;
            }
            else
            {
                this.angleRate = 500;
                this.stage = 4;
            }
        }
        else if(this.stage === 4)
        {
            if(this.tAngleSum - this.eAngleSum < 0.0001)
            {
                this.angleRate -= 10;
                this.sAngleSum += Math.PI / this.angleRate;
                this.performLetterRotationWithQ(word.SGroup, this.eAxis, this.sPoint, Math.PI / this.angleRate);
                let tAngle = this.getBehindLetterAngle(Math.PI / 2 - this.sAngleSum);
                let tRotation = tAngle - this.tAngleSum;
                this.performLetterRotationWithQ(word.TGroup, this.eAxis, this.tPoint, tRotation);
                this.tAngleSum = tAngle;
                let eAngle = this.getBehindLetterAngle(Math.PI/2 - this.tAngleSum);
                let eRotation = eAngle - this.eAngleSum;
                this.performLetterRotationWithQ(word.EGroup, this.eAxis, this.ePoint, eRotation);
                this.eAngleSum = eAngle;
            }
            else
            {
                this.angleRate += 90;
                this.stage = 5;
            }
        }
        else if(this.stage === 5)
        {
            if(this.sAngleSum - Math.PI / 2 < 0.001)
            {
                this.angleRate -= 10;
                this.sAngleSum += Math.PI / this.angleRate;
                this.performLetterRotationWithQ(word.SGroup, this.eAxis, this.sPoint, Math.PI / this.angleRate);
                let tAngle = this.getBehindLetterAngleAfterBottomTouch(Math.PI / 2 - this.sAngleSum);
                let tRotation = tAngle - this.tAngleSum;
                this.performLetterRotationWithQ(word.TGroup, this.eAxis, this.tPoint, tRotation);
                this.tAngleSum = tAngle;
                let eAngle = this.getBehindLetterAngleAfterBottomTouch(Math.PI/2 - this.tAngleSum);
                let eRotation = eAngle - this.eAngleSum;
                this.performLetterRotationWithQ(word.EGroup, this.eAxis, this.ePoint, eRotation);
                this.eAngleSum = eAngle;
            }
        }
    }

    performLetterRotationWithQ(letter, axis, point, angle)
    {
        this.q.setFromAxisAngle(axis, angle);
        letter.applyQuaternion(this.q);
        letter.position.sub(point);
        letter.position.applyQuaternion(this.q);
        letter.position.add(point);
    }

    getBehindLetterAngle(beta)
    {
        let alpha = Math.asin((5 - 1 / Math.sin(beta))*Math.sin(Math.PI - beta) / 7 );
        return Math.PI /2 - beta + alpha;
    }

    getBehindLetterAngleAfterBottomTouch(beta)
    {
        let a = Math.sqrt(26 - 10*Math.cos(Math.PI/2 - beta));
        return Math.PI /2 - Math.asin(Math.sin(Math.PI / 2 - beta) / a);
    }

    reset(word)
    {
        this.performLetterRotationWithQ(word.EGroup, this.eAxis, this.ePoint, -this.eAngleSum);
        this.performLetterRotationWithQ(word.TGroup, this.eAxis, this.tPoint, -this.tAngleSum);
        this.performLetterRotationWithQ(word.SGroup, this.eAxis, this.sPoint, -this.sAngleSum);
    }

}

export default DominoController;
