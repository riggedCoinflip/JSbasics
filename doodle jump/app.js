//improve cam movement

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const doodler = document.createElement('div');
    const gridHeight = document.querySelector('.grid').clientHeight;
    let doodlerLeftSpace;
    let doodlerBottomSpace;
    let isGameOver = false;
    let platforms = [];
    let upTimerId;
    let downTimerId;
    let movePlatformsTimerId;
    let controlTimerId;
    let doodlerYAcceletation = 0;
    let isJumping = false;
    let tickTime = 25;
    const allKeys = ['ArrowLeft', 'ArrowRight'];
    let keysDown = [];
    let score = 10;
    let jumpSpeed = 20;
    let heightNextPlatform = 0;

    class Platform {
        constructor(bottom) {
            this.visual = document.createElement('div');
            this.visual.classList.add('platform');

            const gridWidth = document.querySelector('.grid').clientWidth;
            //const platformWidth = document.querySelector('.platform').clientWidth; //@notes1
            const platformWidth = 85;
            this.left = Math.random() * (gridWidth - platformWidth);
            this.visual.style.left = this.left + 'px';

            this.bottom = bottom;
            this.visual.style.bottom = this.bottom + 'px';
        }
    }

    function createPlatforms() {
        while (heightNextPlatform < gridHeight) {
            let newPlatform = new Platform(heightNextPlatform);
            grid.appendChild(newPlatform.visual);
            platforms.push(newPlatform);
            console.log(platforms);
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
        const toReturn =
            Math.floor(((jumpSpeed * jumpSpeed + 1) / 2) * factor) - 10;
        //console.log(`x: ${x} min:${min} max:${max} factor:${factor} toReturn:${toReturn}`);
        return toReturn > 15 ? toReturn : 15;
    }

    function movePlatforms() {
        if (doodlerBottomSpace > (jumpSpeed * jumpSpeed + 1) / 2 + 30) {
            let changeBy;
            if (doodlerBottomSpace > 450) {
                changeBy = 15;
            } else {
                changeBy = 4;
            }
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

    function createDoodler() {
        grid.appendChild(doodler);
        doodler.classList.add('doodler');
        doodlerLeftSpace = platforms[0].left;
        doodler.style.left = doodlerLeftSpace + 'px';
        doodlerBottomSpace = platforms[0].bottom + 20;
        doodler.style.bottom = doodlerBottomSpace + 'px';
    }

    function jump() {
        clearInterval(downTimerId);
        doodlerYAcceletation = jumpSpeed;
        isJumping = true;
        upTimerId = setInterval(function () {
            doodlerBottomSpace += doodlerYAcceletation;
            doodler.style.bottom = doodlerBottomSpace + 'px';
            doodlerYAcceletation -= 1;
            if (doodlerYAcceletation <= 0) {
                fall();
            }
        }, tickTime);
    }

    function fall() {
        clearInterval(upTimerId);
        isJumping = false;
        downTimerId = setInterval(function () {
            doodlerBottomSpace += doodlerYAcceletation;
            doodlerYAcceletation -= 1;
            if (doodlerBottomSpace <= 0) {
                doodler.style.bottom = '0px';
                gameOver();
            } else {
                doodler.style.bottom = doodlerBottomSpace + 'px';
                platforms.forEach((platform) => {
                    if (
                        //@notes1
                        doodlerBottomSpace >=
                            platform.bottom + 15 + doodlerYAcceletation &&
                        doodlerBottomSpace <= platform.bottom + 15 &&
                        doodlerLeftSpace + 60 >= platform.left &&
                        doodlerLeftSpace <= platform.left + 85
                    ) {
                        //removePlatform(platform); //makes platforms disappear after 1 jump
                        //console.log('landed!');
                        //console.log(doodler, platform);
                        jump();
                    }
                });
            }
        }, tickTime);
    }

    function onKeyDown(e) {
        if (allKeys.includes(e.key) && !keysDown.includes(e.key)) {
            keysDown.unshift(e.key);
        }
    }

    function onKeyUp(e) {
        if (allKeys.includes(e.key)) {
            i = keysDown.indexOf(e.key);
            if (i > -1) {
                keysDown.splice(i, 1);
            }
        }
    }

    function control() {
        if (keysDown.length > 0) {
            if (keysDown[0] === 'ArrowLeft') {
                moveLeft();
            }
            if (keysDown[0] === 'ArrowRight') {
                moveRight();
            }
        }
    }

    function moveLeft() {
        if (doodlerLeftSpace >= 0) {
            doodlerLeftSpace -= 10;
            doodler.style.left = doodlerLeftSpace + 'px';
        }
    }

    function moveRight() {
        if (doodlerLeftSpace <= 400 - 60) {
            doodlerLeftSpace += 10;
            doodler.style.left = doodlerLeftSpace + 'px';
        }
    }

    function start() {
        if (!isGameOver) {
            console.log(`FPS: ${1000 / tickTime}`);
            createPlatforms();
            createDoodler();
            document.addEventListener('keydown', onKeyDown);
            document.addEventListener('keyup', onKeyUp);
            movePlatformsTimerId = setInterval(movePlatforms, tickTime);
            controlTimerId = setInterval(control, tickTime);
            setTimeout(() => {
                fall();
            }, tickTime * 6 + 300);
        }
    }

    function gameOver() {
        isGameOver = true;
        console.log('Game Over!');
        grid.innerHTML = score;
        clearInterval(movePlatformsTimerId);
        clearInterval(controlTimerId);
        clearInterval(upTimerId);
        clearInterval(downTimerId);
    }

    //attach to button
    start();
});
