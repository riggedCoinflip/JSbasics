// blau links-rechts
//grau  hoch-runter
//braun 0hp

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const gridHeight = document.querySelector('.grid').clientHeight;

    const allKeys = ['ArrowLeft', 'ArrowRight', 'p', 'P'];
    let keysDown = [];

    let doodler;
    let doodlerLeftSpace;
    let doodlerBottomSpace;
    let doodlerXSpeed = 0;
    let doodlerYSpeed;
    let jumpSpeed = 20;
    let gravity = 1;
    let isMovingRight = true;

    let platforms = [];
    let heightNextPlatform = 0;
    let score = 0;

    let isGameOver = false;
    let isPaused = false;
    let tickTimerId;
    let tickTime = 25;

    class Platform {
        constructor(bottom, type = 'green', hp = 1) {
            this.visual = document.createElement('div');
            this.visual.classList.add('platform');

            const gridWidth = document.querySelector('.grid').clientWidth;
            //const platformWidth = document.querySelector('.platform').clientWidth; //@notes1
            const platformWidth = 85;
            this.left = Math.random() * (gridWidth - platformWidth);
            this.visual.style.left = this.left + 'px';

            this.bottom = bottom;
            this.visual.style.bottom = this.bottom + 'px';

            if (type === 'green') {
                this.destructible = false;
                this.hp = -1;
                this.visual.style.backgroundColor = 'green';
            } else if (type === 'destructible') {
                this.destructible = true;
                this.hp = hp >= 1 ? hp : 1;
            }

            this.adjustColor();
        }

        landed() {
            if (this.destructible) {
                this.hp -= 1;
                if (this.hp <= 0) {
                    removePlatform(this);
                } else {
                    this.adjustColor();
                }
            }
        }

        adjustColor() {
            if (this.hp >= 1) {
                let tempColor = 1;
                for (let i = this.hp - 1; i >= 1; i--) {
                    tempColor -= 1 / 2 ** i;
                }
                let color = Math.floor(255 * tempColor);
                //console.log(color);
                this.visual.style.backgroundColor = `rgb(${color}, ${color}, ${color})`;
            }
        }
    }

    function createPlatforms() {
        while (heightNextPlatform < gridHeight) {
            let newPlatform = new Platform(
                heightNextPlatform,
                ...platformType()
            );
            grid.appendChild(newPlatform.visual);
            platforms.push(newPlatform);
            //console.log(platforms);
            heightNextPlatform += platformGap();
        }
    }

    function platformGap() {
        const x = score / 500;
        const min = (Math.exp(1) * x) / (Math.exp(1) * x + 5);
        let max =
            (Math.exp(1) * (2 * x + 1)) / (Math.exp(1) * (2 * x + 1) + 5) + 0.1; //max is always higher than min for x > 0. Plot it
        max = max > 1 ? 1 : max; //limits maximum to 1
        const factor = Math.random() * (max - min) + min;
        let toReturn = Math.floor(((jumpSpeed * jumpSpeed + 1) / 2) * factor);
        toReturn = toReturn > 15 ? toReturn : 15;
        return toReturn;
    }

    function platformType() {
        let threshold = score / 10000;
        threshold = threshold > 1 ? 1 : threshold;
        if (Math.random() > threshold) {
            return ['green'];
        } else {
            return ['destructible', Math.floor(5 - score / 2000)];
        }
    }

    function createDoodler() {
        doodler = document.createElement('div');
        grid.appendChild(doodler);
        doodler.classList.add('doodler');
        doodlerLeftSpace = platforms[0].left;
        doodler.style.left = doodlerLeftSpace + 'px';
        doodlerBottomSpace = platforms[0].bottom - 100;
        doodler.style.bottom = doodlerBottomSpace + 'px';
        doodlerYSpeed = 15;
    }

    function advanceTick() {
        movementX();
        movementY();
        movePlatforms();
    }

    function movementX() {
        let foundKey = false;
        if (keysDown.length > 0) {
            for (const key of keysDown) {
                if (key === 'ArrowLeft') {
                    moveLeft();
                    foundKey = true;
                    break;
                } else if (key === 'ArrowRight') {
                    moveRight();
                    foundKey = true;
                    break;
                }
            }
        }
        if (!foundKey) {
            moveNeutral();
        }
        doodler.style.left = doodlerLeftSpace + 'px';
    }

    function moveLeft() {
        if (isMovingRight) {
            isMovingRight = false;
            doodler.style.backgroundImage =
                'url(assets/doodler_centered_mirrored101x80.png)';
        }
        if (Math.sign(doodlerXSpeed) === 1) {
            doodlerXSpeed -= 4;
        } else {
            doodlerXSpeed -= 2;
        }
        doodlerXSpeed = doodlerXSpeed < -10 ? -10 : doodlerXSpeed;
        doodlerLeftSpace += doodlerXSpeed;
        checkBoundaries();
    }

    function moveRight() {
        if (!isMovingRight) {
            isMovingRight = true;
            doodler.style.backgroundImage =
                'url(assets/doodler_centered101x80.png)';
        }
        if (Math.sign(doodlerXSpeed) === -1) {
            doodlerXSpeed += 4;
        } else {
            doodlerXSpeed += 2;
        }
        doodlerXSpeed = doodlerXSpeed > 10 ? 10 : doodlerXSpeed;
        doodlerLeftSpace += doodlerXSpeed;
        checkBoundaries();
    }

    function moveNeutral() {
        doodlerXSpeed = Math.floor(doodlerXSpeed - Math.sign(doodlerXSpeed));
        doodlerXSpeed = Math.floor(doodlerXSpeed - Math.sign(doodlerXSpeed));
        doodlerLeftSpace += doodlerXSpeed;
        checkBoundaries();
    }

    function checkBoundaries() {
        if (doodlerLeftSpace < -60) {
            doodlerLeftSpace += 400;
        } else if (doodlerLeftSpace > 340) {
            doodlerLeftSpace -= 400;
        }
    }

    /**
     * IMPORTANT: The current method of logging which keys are held down has a fault:
     * If you hold down a button (lets say: 'p'), while holding it down press Shift,
     * then up the button, it will try to remove the Upper version of that key ('P').
     * @param {*} e Pressed Key
     */
    function onKeyDown(e) {
        //console.log(`Key pressed: ${e.key}`);
        if (allKeys.includes(e.key) && !keysDown.includes(e.key)) {
            keysDown.unshift(e.key);
            if (['p', 'P'].includes(e.key)) {
                clearInterval(tickTimerId);
                if (isPaused) {
                    //unpause
                    tickTimerId = setInterval(advanceTick, tickTime);
                }
                isPaused = !isPaused;
                console.log(`Game is now ${isPaused ? 'paused' : 'unpaused'}`);
            }
        }
        //console.log(`Currently held down keys: ${keysDown}`);
    }

    function onKeyUp(e) {
        if (allKeys.includes(e.key)) {
            i = keysDown.indexOf(e.key);
            if (i > -1) {
                keysDown.splice(i, 1);
            }
        }
        //console.log(`Currently held down keys: ${keysDown}`);
    }

    function movementY() {
        doodlerBottomSpace += doodlerYSpeed;
        doodlerYSpeed -= gravity;
        if (doodlerYSpeed < 0) {
            checkCollision();
            checkGameOver();
        }
        doodler.style.bottom = doodlerBottomSpace + 'px';
    }

    function movePlatforms() {
        if (doodlerBottomSpace > 250) {
            const changeBy = doodlerBottomSpace - 250;
            score += changeBy;
            heightNextPlatform -= changeBy;
            doodlerBottomSpace -= changeBy;
            doodler.style.bottom = doodlerBottomSpace + 'px';
            createPlatforms();
            platforms.forEach((platform) => {
                if (platform.bottom < 0) {
                    removePlatform(platform);
                } else {
                    platform.bottom -= changeBy;
                    platform.visual.style.bottom = platform.bottom + 'px';
                }
            });
        }
    }

    function removePlatform(platform) {
        const i = platforms.indexOf(platform);
        if (i !== -1) {
            platforms[i].visual.classList.remove('platform');
            platforms.splice(i, 1);
        } else {
            console.log(
                `Can't remove Platform because it does not exist: ${platform}`
            );
        }
    }

    function checkGameOver() {
        if (doodlerBottomSpace <= 0) {
            doodlerBottomSpace = 0;
            doodler.style.bottom = '0px';
            gameOver();
        }
    }

    function checkCollision() {
        const doodlerCoords = doodlerHitbox();
        for (let i = platforms.length - 1; i >= 0; i--) {
            const platform = platforms[i];
            const collidesX1 = doodlerCoords[0][0] + 52 >= platform.left;
            const collidesX2 = doodlerCoords[0][0] + 3 <= platform.left + 85; //+3 cause position of leftmost leg
            const collidesY1 =
                doodlerCoords[1][0] >= platform.bottom + 15 + doodlerYSpeed; //Y speed is negative
            const collidesY2 = doodlerCoords[1][0] <= platform.bottom + 15;
            if (collidesX1 && collidesX2 && collidesY1 && collidesY2) {
                doodlerBottomSpace = platform.bottom + 15;
                platform.landed();
                //removePlatform(platform); //makes platforms disappear after 1 jump
                doodlerYSpeed = jumpSpeed;
                break;
            }
        }
    }

    function doodlerHitbox() {
        if (document.querySelector('.doodler') !== null) {
            const x1 = doodlerLeftSpace + 21;
            const x2 = x1 + document.querySelector('.doodler').clientWidth - 21;
            const y1 = doodlerBottomSpace;
            const y2 = y1 + document.querySelector('.doodler').clientHeight;
            return [
                [x1, x2],
                [y1, y2],
            ];
        } else {
            console.warn(
                'could not return coordinates because doodler doesnt exist'
            );
        }
    }

    function start() {
        if (!isGameOver) {
            console.log(`FPS: ${1000 / tickTime}`);
            createPlatforms();
            createDoodler();

            document.addEventListener('keydown', onKeyDown);
            document.addEventListener('keyup', onKeyUp);

            tickTimerId = setInterval(advanceTick, tickTime);
        }
    }

    function gameOver() {
        isGameOver = true;
        console.log('Game Over!');
        grid.innerHTML = score;

        clearInterval(tickTimerId);
    }

    //TODO attach to button
    start();
});
