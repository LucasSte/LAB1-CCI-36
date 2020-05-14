import * as THREE from "./three.js/build/three.module.js";

class DominoController
{
    num = 0;
    down;
    stage = 0;
    angleRate = 500;
    eAngleSum = 0;

    ePoint = new THREE.Vector3(4.5, 0,0);
    tPoint = new THREE.Vector3(-0.5, 0, 0);
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
            //TODO: Terminar o efeito domino. Ler o comentario no fim do arquivo.
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
        return beta - alpha;
    }

    getBehindLetterAngleAfterBottomTouch(beta)
    {
        let a = Math.sqrt(26 - 10*Math.cos(Math.PI/2 - beta));
        return Math.asin(Math.sin(Math.PI / 2 - beta) / a);
    }

}

export default DominoController;

/*
A partir do momento em que uma letra bate na outra, o calculo do angulo da anterior muda.
A minha sugestao é que, depois que o E bater no T, começar a rotacionar o T
usando quaternion, como eu fiz.
O angulo do E será funcao do angulo do T (ver foto no Whatsapp).
Para isso, eu deixei a funcao getBehindLetterAngle pronta.
Nota que depois de um tempo, a ponta de baixo do T vai determinar o angulo (segunda foto do Whatsap).
Nesse caso, a funcao eh getBehindLetterAngleAfterBottomTouch.



 */