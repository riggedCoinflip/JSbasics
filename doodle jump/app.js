document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const doodler = document.createElement('div');
    let doodlerLeftSpace;
    let doodlerBottomSpace = 100;
    let isGameOver = false;
    let platforms = [];
    let upTimerId;
    let downTimerId;
    let movePlatformsTimerId;
    let controlTimerId;
    let doodlerYAcceletation = 20;
    let isJumping = false;
    let tickTime = 20;
    const allKeys = ['ArrowLeft', 'ArrowRight'];
    let keysDown = [];
    let score = 0;

    class Platform {
        constructor(newPlatformBottom) {
            this.visual = document.createElement('div');

            const visual = this.visual;
            visual.classList.add('platform');

            const gridWidth = document.querySelector('.grid').clientWidth;
            //const platformWidth = document.querySelector('.platform').clientWidth; //@notes1
            const platformWidth = 85;
            this.left = Math.random() * (gridWidth - platformWidth);
            visual.style.left = this.left + 'px';

            this.bottom = newPlatformBottom;
            visual.style.bottom = this.bottom + 'px';
        }
    }

    function createPlatforms() {
        let platformCount = 5;
        const gridHeight = document.querySelector('.grid').clientHeight;
        let platformGap = gridHeight / platformCount;
        for (let i = 0; i < platformCount; i++) {
            let newPlatformBottom = 100 + i * platformGap;
            let newPlatform = new Platform(newPlatformBottom);
            grid.appendChild(newPlatform.visual);
            platforms.push(newPlatform);
        }
        console.log(platforms);
    }

    function movePlatforms() {
        if (doodlerBottomSpace > 235) {
            platforms.forEach((platform) => {
                platform.bottom -= 4;
                let visual = platform.visual;
                visual.style.bottom = platform.bottom + 'px';

                if (platform.bottom < 10) {
                    score += 1;
                    let firstPlatform = platforms[0].visual;
                    firstPlatform.classList.remove('platform');
                    platforms.shift();
                    let newPlatform = new Platform(600);
                    grid.appendChild(newPlatform.visual);
                    platforms.push(newPlatform);
                }
            });
        }
    }

    function createDoodler() {
        grid.appendChild(doodler);
        doodler.classList.add('doodler');
        doodlerLeftSpace = platforms[0].left;
        doodler.style.left = doodlerLeftSpace + 'px';
        doodler.style.bottom = doodlerBottomSpace + 'px';
    }

    function jump() {
        clearInterval(downTimerId);
        isJumping = true;
        upTimerId = setInterval(function () {
            doodlerBottomSpace += doodlerYAcceletation -= 1;
            doodler.style.bottom = doodlerBottomSpace + 'px';
            if (doodlerYAcceletation <= 0) {
                fall();
            }
        }, tickTime);
    }

    function fall() {
        clearInterval(upTimerId);
        isJumping = false;
        downTimerId = setInterval(function () {
            doodlerBottomSpace += doodlerYAcceletation -= 1;
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
                        //console.log('landed!');
                        //console.log(doodler, platform);
                        doodlerYAcceletation = 20;
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
            jump();
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
