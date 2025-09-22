const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const keys = {};
document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

const gravity = 0.5;
let currentLevel = 0;

// Load images
const images = {};
['background1', 'background2', 'background3', 'john', 'villain', 'orb'].forEach(name => {
    images[name] = new Image();
    images[name].src = `assets/${name}.png.png`;
});

// Levels
const levels = [
    {
        background: 'background1',
        platforms: [
            {x:0, y:400, width:800, height:50},
            {x:150, y:300, width:100, height:20},
            {x:350, y:250, width:120, height:20}
        ],
        villains: [
            {x:500, y:370, width:40, height:40},
            {x:200, y:270, width:40, height:40}
        ],
        orbs: [
            {x:160, y:260, width:20, height:20},
            {x:360, y:210, width:20, height:20}
        ]
    },
    {
        background: 'background2',
        platforms: [
            {x:0, y:400, width:800, height:50},
            {x:100, y:320, width:100, height:20},
            {x:300, y:280, width:150, height:20}
        ],
        villains: [
            {x:400, y:370, width:50, height:50},
            {x:320, y:250, width:40, height:40}
        ],
        orbs: [
            {x:110, y:280, width:20, height:20},
            {x:350, y:240, width:20, height:20}
        ]
    },
    {
        background: 'background3',
        platforms: [
            {x:0, y:400, width:800, height:50},
            {x:200, y:300, width:100, height:20},
            {x:400, y:250, width:150, height:20}
        ],
        villains: [
            {x:450, y:370, width:50, height:50},
            {x:220, y:270, width:40, height:40}
        ],
        orbs: [
            {x:210, y:260, width:20, height:20},
            {x:420, y:210, width:20, height:20}
        ]
    }
];

// Player
const player = {
    x:50, y:350, width:40, height:40, vy:0, onGround:false, collectedOrbs:0
};

function rectsCollide(a,b){
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function update(){
    // Movement
    if(keys['ArrowLeft']) player.x -= 5;
    if(keys['ArrowRight']) player.x += 5;
    if(keys['ArrowUp'] && player.onGround) player.vy = -10;

    player.vy += gravity;
    player.y += player.vy;

    player.onGround = false;

    // Platform collision
    levels[currentLevel].platforms.forEach(p => {
        if(rectsCollide(player, p) && player.vy >=0){
            player.y = p.y - player.height;
            player.vy = 0;
            player.onGround = true;
        }
    });

    // Villain collision
    levels[currentLevel].villains.forEach(v => {
        if(rectsCollide(player, v)){
            alert("You died! Restarting level...");
            restartLevel();
        }
    });

    // Orbs collection
    levels[currentLevel].orbs.forEach((o,i)=>{
        if(rectsCollide(player,o)){
            player.collectedOrbs++;
            levels[currentLevel].orbs.splice(i,1);
        }
    });

    // Level end
    if(player.x + player.width > canvas.width){
        currentLevel++;
        if(currentLevel >= levels.length){
            alert(`Game completed! Total orbs: ${player.collectedOrbs}`);
            currentLevel = 0;
        }
        restartLevel();
    }
}

function restartLevel(){
    const lvl = levels[currentLevel];
    player.x = 50;
    player.y = 350;
    player.vy = 0;
    player.onGround = false;
    // Reset orbs
    lvl.orbs.forEach(o => o.collected=false);
}

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const lvl = levels[currentLevel];
    ctx.drawImage(images[lvl.background],0,0,canvas.width,canvas.height);

    // Draw platforms
    ctx.fillStyle = '#654321';
    lvl.platforms.forEach(p => ctx.fillRect(p.x,p.y,p.width,p.height));

    // Draw orbs
    lvl.orbs.forEach(o => ctx.drawImage(images['orb'], o.x, o.y, o.width, o.height));

    // Draw villains
    lvl.villains.forEach(v => ctx.drawImage(images['villain'], v.x, v.y, v.width, v.height));

    // Draw player
    ctx.drawImage(images['john'], player.x, player.y, player.width, player.height);
}

function gameLoop(){
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game after images load
window.onload = ()=>{
    gameLoop();
};
