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
    piecesAngleSum = 0;
    explosionRate = 20;
    gravity = 60*0.09/289;
    velocityY = 60*0.09*28/289;

    ePoint = new THREE.Vector3(4.5, 0,0);
    tPoint = new THREE.Vector3(-0.5, 0, 0);
    sPoint = new THREE.Vector3(-5.5, 0, 0);
    eAxis = new THREE.Vector3(0,0,1);
    q = new THREE.Quaternion();

    constructor() {
    }

    adjustPositions(word)
    {
        word.EGroup.rotation.y = Math.PI / 2;
        word.SGroup.rotation.y = Math.PI / 2;
        word.TGroup.rotation.y = Math.PI / 2;
        this.stage = 1;
        this.num = 0;
        this.angleRate = 500;
        this.eAngleSum = 0;
        this.tAngleSum = 0;
        this.sAngleSum = 0;
        this.piecesAngleSum = 0;
        this.velocityY = 60*0.09*28/289;
    }

    nextBallPosY(posX)
    {
        console.log(posX);
        return 17/2 - 30/289*Math.pow(posX - 13/2, 2);
    }

    animate(word, sphere)
    {
        switch (this.stage) {
            case 1:
                sphere.position.x -= 0.3;
                // sphere.position.y = this.nextBallPosY(sphere.position.x);
                sphere.position.y += this.velocityY;
                this.velocityY -= this.gravity;
                if(sphere.position.x <= 6.5)
                    this.stage = 2;
                break;
            case 2:
                if(sphere.position.y >= 1)
                {
                    sphere.position.x += 0.2;
                    // sphere.position.y = this.nextBallPosY(sphere.position.x);
                    sphere.position.y += this.velocityY;
                    this.velocityY -= this.gravity;
                }
                //When one letter is touching another (like this |\), 0.608 is the angle (in radians) between \ and the vertical.
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
                break;
            case 3:
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
                break;
            case 4:
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
                break;
            case 5:
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

                    this.explodeWord(word, Math.PI/this.explosionRate)
                    this.piecesAngleSum += Math.PI/this.explosionRate;
                }
                else
                {
                    this.angleRate = 500;
                    this.stage = 6;
                    this.velocityY = 0;
                }
                break;
            case 6:
                if(this.tAngleSum - Math.PI / 2 < 0.001)
                {
                    this.angleRate -= 10;
                    this.tAngleSum += Math.PI / this.angleRate;
                    this.performLetterRotationWithQ(word.TGroup, this.eAxis, this.tPoint, Math.PI / this.angleRate);
                    this.eAngleSum += Math.PI / this.angleRate;
                    this.performLetterRotationWithQ(word.EGroup, this.eAxis, this.ePoint, Math.PI / this.angleRate);
                }
                if(word.SGroup.position.y + 1.5 > 0.1)
                {
                    word.SGroup.position.y += this.velocityY;
                    word.TGroup.position.y += this.velocityY;
                    word.EGroup.position.y += this.velocityY;
                    this.velocityY -=this.gravity
                }
                if(this.piecesAngleSum < Math.PI)
                {
                    this.explodeWord(word, Math.PI/this.explosionRate)
                    this.piecesAngleSum += Math.PI/this.explosionRate;
                }
                break;
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
        word.resetLettersPieces();
        word.resetLettersGroups();
    }

    explodeLetterPiece(piece, seed, angle)
    {
        seed = seed*10;
        piece.position.x += this.pseudoRandom(seed, 0.26, 0.3);
        piece.position.y += this.pseudoRandom(seed+5, 0.1, 0.2);

        piece.rotateX(angle);

        let axisZ = new THREE.Vector3(0, 0, 1);
        piece.rotateOnWorldAxis(axisZ, angle*this.pseudoRandom(seed, 0, 1));

    }

    explodeWord(word, angle)
    {
        this.explodeLetterPiece(word.S1, 1, angle);
        this.explodeLetterPiece(word.S2, 2, angle);
        this.explodeLetterPiece(word.S3, 3, angle);
        this.explodeLetterPiece(word.S4, 4, angle);
        this.explodeLetterPiece(word.S5, 6, angle);

        this.explodeLetterPiece(word.T1, 10, angle);
        this.explodeLetterPiece(word.T2, 12, angle);

        this.explodeLetterPiece(word.E1, 5, angle);
        this.explodeLetterPiece(word.E2, 8, angle);
        this.explodeLetterPiece(word.E3, 7, angle);
        this.explodeLetterPiece(word.E4, 9, angle);
        this.explodeLetterPiece(word.E5, -1, angle);
    }

    pseudoRandom(seed, lower, upper) // JS doesn't have pseudo-number with seeds natively. The code below is enough to our proposes
    {
        let x = Math.sin(seed*10000 + 0.5) * (seed + 23);
        let sign = Math.sign(x);
        x = x - Math.floor(x); // 0 <= x <= 1
        return ((upper-lower)*x + lower)*sign; // lower <= abs(x) <= upper
    }

}

export default DominoController;
