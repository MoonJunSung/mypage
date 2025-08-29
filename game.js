"use strict";

// ====== Canvas Setup ======
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ====== Game Constants ======
const GAME_WIDTH = canvas.width;
const GAME_HEIGHT = canvas.height;

const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 24;
const PLAYER_SPEED = 320; // px per second
const PLAYER_MAX_HEALTH = 3;
const SHOOT_COOLDOWN_SEC = 0.18;

const BULLET_WIDTH = 4;
const BULLET_HEIGHT = 12;
const BULLET_SPEED = 600;

const ENEMY_WIDTH = 36;
const ENEMY_HEIGHT = 24;
const ENEMY_MIN_SPEED = 80;
const ENEMY_MAX_SPEED = 180;
const ENEMY_SPAWN_MIN_SEC = 0.4;
const ENEMY_SPAWN_MAX_SEC = 0.9;
const ENEMY_SHOOT_MIN_SEC = 1.2;
const ENEMY_SHOOT_MAX_SEC = 2.6;
const ENEMY_BULLET_SPEED = 200;

// Boss bullet hell tuning
const BOSS_BULLET_SPEED_BASE = 190;
const BOSS_PATTERN_DURATION = 8; // seconds per pattern
const BOSS_SPIRAL_RATE = 2.6; // radians per second
const BOSS_RING_COUNT = 18;
const BOSS_FAN_COUNT = 9;
const BOSS_FAN_SPREAD_RAD = Math.PI / 2.6; // ~69 degrees

// ====== Background Stars (Parallax) ======
const STAR_LAYERS = [
  { count: 60, speed: 30, size: 1, color: "#ffffff", alpha: 0.35 },
  { count: 40, speed: 60, size: 2, color: "#b3e5fc", alpha: 0.6 },
  { count: 20, speed: 110, size: 3, color: "#81d4fa", alpha: 0.9 },
];

/** @type {{x:number,y:number,size:number,speed:number,color:string,alpha:number}[][]} */
const starLayers = [];

// dynamic background controls
let starSpeedMultiplier = 1;
let starDensityMultiplier = 1;
const STAR_SPEED_MIN = 0.25;
const STAR_SPEED_MAX = 3;
const STAR_DENSITY_MIN = 0.5;
const STAR_DENSITY_MAX = 3;

function initStars() {
  starLayers.length = 0;
  for (let i = 0; i < STAR_LAYERS.length; i += 1) {
    const layer = STAR_LAYERS[i];
    const stars = [];
    const targetCount = Math.max(1, Math.round(layer.count * starDensityMultiplier));
    for (let s = 0; s < targetCount; s += 1) {
      stars.push({
        x: Math.random() * GAME_WIDTH,
        y: Math.random() * GAME_HEIGHT,
        size: layer.size,
        speed: layer.speed,
        color: layer.color,
        alpha: layer.alpha,
      });
    }
    starLayers.push(stars);
  }
}

function updateStars(dt) {
  for (let i = 0; i < starLayers.length; i += 1) {
    const stars = starLayers[i];
    for (let j = 0; j < stars.length; j += 1) {
      const star = stars[j];
      star.y += star.speed * starSpeedMultiplier * dt;
      if (star.y - star.size > GAME_HEIGHT) {
        star.y -= GAME_HEIGHT + star.size;
        star.x = Math.random() * GAME_WIDTH;
      }
    }
  }
}

function renderStars() {
  for (let i = 0; i < starLayers.length; i += 1) {
    const stars = starLayers[i];
    for (let j = 0; j < stars.length; j += 1) {
      const star = stars[j];
      ctx.globalAlpha = star.alpha;
      ctx.fillStyle = star.color;
      ctx.fillRect(star.x, star.y, star.size, star.size);
    }
  }
  ctx.globalAlpha = 1;
}

function adjustStarSpeed(delta) {
  starSpeedMultiplier = clamp(starSpeedMultiplier + delta, STAR_SPEED_MIN, STAR_SPEED_MAX);
}

function adjustStarDensity(delta) {
  starDensityMultiplier = clamp(starDensityMultiplier + delta, STAR_DENSITY_MIN, STAR_DENSITY_MAX);
  initStars();
}

// ====== Utilities ======
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function rectsIntersect(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

// Difficulty and balancing helpers
function getDifficultyScale() {
  return 1 + (difficultyLevel - 1) * 0.10; // 완화
}
function getSpawnScale() {
  return Math.max(0.5, 1.0 - (difficultyLevel - 1) * 0.08); // 완화
}

// Player hitbox (smaller than sprite for fair dodging)
function getPlayerHitbox() {
  const hbSize = 12; // 12x12 hitbox
  const cx = player.x + player.w / 2;
  const cy = player.y + player.h / 2;
  return { x: cx - hbSize / 2, y: cy - hbSize / 2, w: hbSize, h: hbSize };
}

// ====== Input ======
const keys = new Set();
window.addEventListener("keydown", (e) => {
  if (e.repeat) return;
  keys.add(e.code);

  // Background tuning keys (always active)
  if (e.code === "BracketRight") adjustStarSpeed(0.25); // ] speed up
  if (e.code === "BracketLeft") adjustStarSpeed(-0.25); // [ slow down
  if (e.code === "Equal") adjustStarDensity(0.25); // = density up
  if (e.code === "Minus") adjustStarDensity(-0.25); // - density down

  if (gamePhase !== "playing" && (e.code === "Enter" || e.code === "Space")) {
    startGame();
  }
});
window.addEventListener("keyup", (e) => {
  keys.delete(e.code);
});

// ====== Game State ======
let gamePhase = "menu"; // "menu" | "playing" | "gameover"
let lastTimestamp = 0;
let score = 0;
let stageNumber = 1;
let stageTime = 0; // seconds in current stage
let difficultyLevel = 1; // grows each stage

const player = {
  x: (GAME_WIDTH - PLAYER_WIDTH) / 2,
  y: GAME_HEIGHT - PLAYER_HEIGHT - 20,
  w: PLAYER_WIDTH,
  h: PLAYER_HEIGHT,
  speed: PLAYER_SPEED,
  health: PLAYER_MAX_HEALTH,
  shootCooldown: 0,
};

/** @type {{x:number,y:number,w:number,h:number,vy:number}[]} */
const bullets = [];

/** @type {{x:number,y:number,w:number,h:number,vy:number}[]} */
const enemies = [];

let enemySpawnTimer = getRandomFloat(ENEMY_SPAWN_MIN_SEC, ENEMY_SPAWN_MAX_SEC);

// ====== Game Control ======
function startGame() {
  gamePhase = "playing";
  score = 0;
  player.x = (GAME_WIDTH - PLAYER_WIDTH) / 2;
  player.y = GAME_HEIGHT - PLAYER_HEIGHT - 20;
  player.health = PLAYER_MAX_HEALTH;
  player.shootCooldown = 0;
  bullets.length = 0;
  enemies.length = 0;
  enemySpawnTimer = getRandomFloat(ENEMY_SPAWN_MIN_SEC, ENEMY_SPAWN_MAX_SEC);
  stageNumber = 1;
  stageTime = 0;
  difficultyLevel = 1;
  particles.length = 0;
  powerups.length = 0;
  enemyBullets.length = 0;
  boss = null;
  player.invulnTimer = 0;
  player.rapidTimer = 0;
  player.spreadTimer = 0;
  player.shieldTimer = 0;
}

function gameOver() {
  gamePhase = "gameover";
}

// ====== Update ======
function update(dt) {
  if (gamePhase !== "playing") return;

  // timers
  stageTime += dt;
  if (player.invulnTimer > 0) player.invulnTimer -= dt;
  if (player.rapidTimer > 0) player.rapidTimer -= dt;
  if (player.spreadTimer > 0) player.spreadTimer -= dt;
  if (player.shieldTimer > 0) player.shieldTimer -= dt;

  // Player movement
  const movingLeft = keys.has("ArrowLeft") || keys.has("KeyA");
  const movingRight = keys.has("ArrowRight") || keys.has("KeyD");
  const movingUp = keys.has("ArrowUp") || keys.has("KeyW");
  const movingDown = keys.has("ArrowDown") || keys.has("KeyS");

  let dx = 0;
  let dy = 0;
  if (movingLeft) dx -= 1;
  if (movingRight) dx += 1;
  if (movingUp) dy -= 1;
  if (movingDown) dy += 1;

  // normalize diagonal
  if (dx !== 0 && dy !== 0) {
    const inv = 1 / Math.sqrt(2);
    dx *= inv;
    dy *= inv;
  }

  player.x = clamp(player.x + dx * player.speed * dt, 0, GAME_WIDTH - player.w);
  player.y = clamp(player.y + dy * player.speed * dt, 0, GAME_HEIGHT - player.h);

  // Shooting
  player.shootCooldown -= dt;
  const wantShoot = keys.has("Space");
  const shootCooldown = player.rapidTimer > 0 ? SHOOT_COOLDOWN_SEC * 0.5 : SHOOT_COOLDOWN_SEC;
  if (wantShoot && player.shootCooldown <= 0) {
    const centerX = player.x + player.w / 2;
    const spread = player.spreadTimer > 0;
    if (spread) {
      spawnPlayerBullet(centerX - 10 - BULLET_WIDTH / 2, player.y - BULLET_HEIGHT,  -120, -BULLET_SPEED * 0.95);
      spawnPlayerBullet(centerX - BULLET_WIDTH / 2,        player.y - BULLET_HEIGHT,     0, -BULLET_SPEED);
      spawnPlayerBullet(centerX + 10 - BULLET_WIDTH / 2, player.y - BULLET_HEIGHT,   120, -BULLET_SPEED * 0.95);
    } else {
      spawnPlayerBullet(centerX - BULLET_WIDTH / 2, player.y - BULLET_HEIGHT, 0, -BULLET_SPEED);
    }
    player.shootCooldown = shootCooldown;
    playShoot();
  }

  // Bullets update
  for (let i = bullets.length - 1; i >= 0; i -= 1) {
    const b = bullets[i];
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    if (b.y + b.h < 0) {
      bullets.splice(i, 1);
    }
  }

  // Enemy spawn
  // Stage progression: spawn boss after 30s, otherwise spawn regular enemies faster with difficulty
  if (!boss) {
    enemySpawnTimer -= dt;
    if (enemySpawnTimer <= 0) {
      const x = getRandomFloat(0, GAME_WIDTH - ENEMY_WIDTH);
      const speedScale = getDifficultyScale();
      const vy = getRandomFloat(ENEMY_MIN_SPEED, ENEMY_MAX_SPEED) * speedScale;
      enemies.push({ x, y: -ENEMY_HEIGHT, w: ENEMY_WIDTH, h: ENEMY_HEIGHT, vy, shootTimer: getEnemyShootCooldown() });
      const spawnScale = getSpawnScale();
      const minS = ENEMY_SPAWN_MIN_SEC * spawnScale;
      const maxS = ENEMY_SPAWN_MAX_SEC * spawnScale;
      enemySpawnTimer = getRandomFloat(minS, maxS);
    }
    if (stageTime >= 30) {
      spawnBoss();
    }
  }

  // Enemies update
  for (let i = enemies.length - 1; i >= 0; i -= 1) {
    const e = enemies[i];
    e.y += e.vy * dt;
    if (e.y > GAME_HEIGHT) {
      enemies.splice(i, 1);
      continue;
    }

    // enemy shooting (aim at player)
    if (e.shootTimer !== undefined) {
      e.shootTimer -= dt;
      if (e.shootTimer <= 0 && e.y > -e.h && e.y < GAME_HEIGHT) {
        const ex = e.x + e.w / 2;
        const ey = e.y + e.h;
        const px = player.x + player.w / 2;
        const py = player.y + player.h / 2;
        const dx = px - ex;
        const dy = py - ey;
        const len = Math.hypot(dx, dy) || 1;
        const vx = (dx / len) * ENEMY_BULLET_SPEED;
        const vy = (dy / len) * ENEMY_BULLET_SPEED;
        enemyBullets.push({ x: ex - 2, y: ey, w: 4, h: 10, vx, vy });
        e.shootTimer = getEnemyShootCooldown();
        playEnemyShoot();
      }
    }
  }

  // Collisions: bullets vs enemies
  for (let i = enemies.length - 1; i >= 0; i -= 1) {
    const e = enemies[i];
    let hit = false;
    for (let j = bullets.length - 1; j >= 0; j -= 1) {
      const b = bullets[j];
      if (rectsIntersect(e, b)) {
        bullets.splice(j, 1);
        hit = true;
        score += 10;
        emitExplosion(e.x + e.w / 2, e.y + e.h / 2, "#ef476f");
        maybeDropPowerup(e.x + e.w / 2, e.y + e.h / 2);
        break;
      }
    }
    if (hit) {
      enemies.splice(i, 1);
      playExplosion();
    }
  }

  // Collisions: enemies vs player
  for (let i = enemies.length - 1; i >= 0; i -= 1) {
    const e = enemies[i];
    if (rectsIntersect(e, getPlayerHitbox())) {
      enemies.splice(i, 1);
      damagePlayer();
      if (player.health <= 0) {
        gameOver();
        break;
      }
    }
  }

  // Boss update
  if (boss) {
    updateBoss(dt);
  }

  // Enemy bullets update
  for (let i = enemyBullets.length - 1; i >= 0; i -= 1) {
    const b = enemyBullets[i];
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    if (b.y > GAME_HEIGHT + 20 || b.x < -20 || b.x > GAME_WIDTH + 20) {
      enemyBullets.splice(i, 1);
      continue;
    }
    if (rectsIntersect(b, getPlayerHitbox())) {
      enemyBullets.splice(i, 1);
      damagePlayer();
      if (gamePhase !== "playing") break;
    }
  }

  // Powerups update
  for (let i = powerups.length - 1; i >= 0; i -= 1) {
    const p = powerups[i];
    p.y += p.vy * dt;
    if (p.y > GAME_HEIGHT + 16) {
      powerups.splice(i, 1);
      continue;
    }
    if (rectsIntersect(p, player)) {
      applyPowerup(p.type);
      powerups.splice(i, 1);
      playPowerup();
    }
  }

  // Particles update
  for (let i = particles.length - 1; i >= 0; i -= 1) {
    const p = particles[i];
    p.vy += 600 * dt * 0.0; // optional gravity
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= dt;
    if (p.life <= 0) particles.splice(i, 1);
  }
}

// ====== Render ======
function renderBackground() {
  // solid background
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  // parallax stars
  renderStars();

  // subtle horizon glow overlay
  const gradient = ctx.createLinearGradient(0, GAME_HEIGHT * 0.6, 0, GAME_HEIGHT);
  gradient.addColorStop(0, "rgba(60,60,80,0.0)");
  gradient.addColorStop(1, "rgba(60,60,80,0.35)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
}

function renderPlayer() {
  // ship body
  ctx.save();
  ctx.translate(player.x + player.w / 2, player.y + player.h / 2);
  ctx.fillStyle = player.shieldTimer > 0 ? "#98fb98" : "#5ee1ff";
  ctx.beginPath();
  ctx.moveTo(0, -player.h / 2);
  ctx.lineTo(player.w / 2, player.h / 2);
  ctx.lineTo(-player.w / 2, player.h / 2);
  ctx.closePath();
  ctx.fill();
  if (player.invulnTimer > 0) {
    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2); // show small hitbox ring
    ctx.stroke();
  }
  ctx.restore();
}

function renderBullets() {
  // player bullets (yellow)
  ctx.fillStyle = "#ffd166";
  for (let i = 0; i < bullets.length; i += 1) {
    const b = bullets[i];
    ctx.fillRect(b.x, b.y, b.w, b.h);
  }

  // enemy bullets, color by source intensity
  for (let i = 0; i < enemyBullets.length; i += 1) {
    const b = enemyBullets[i];
    // faster bullets appear brighter
    const speed = Math.hypot(b.vx, b.vy);
    const t = Math.min(1, Math.max(0.3, (speed - 150) / 200));
    const r = Math.floor(180 + 75 * t);
    const g = Math.floor(40 + 20 * t);
    const bl = Math.floor(60 + 20 * t);
    ctx.fillStyle = `rgb(${r},${g},${bl})`;
    ctx.fillRect(b.x, b.y, b.w, b.h);
  }
}

function renderEnemies() {
  ctx.fillStyle = "#ef476f";
  for (let i = 0; i < enemies.length; i += 1) {
    const e = enemies[i];
    ctx.fillRect(e.x, e.y, e.w, e.h);
  }
  // boss
  if (boss) {
    ctx.fillStyle = "#8e44ad";
    ctx.fillRect(boss.x, boss.y, boss.w, boss.h);
  }
}

function renderUI() {
  ctx.fillStyle = "#e6e6e6";
  ctx.font = "16px system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(`Score: ${score}`, 12, 10);
  ctx.fillText(`HP: ${player.health}`, 12, 30);
  ctx.fillText(`Stage: ${stageNumber}`, 12, 50);
  ctx.fillText(`BG x${starSpeedMultiplier.toFixed(2)} dens x${starDensityMultiplier.toFixed(2)}`, 12, 70);
  ctx.fillText(`[ ]:속도  -/=:밀도`, 12, 90);

  if (gamePhase === "menu") {
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    ctx.fillStyle = "#c7f9ff";
    ctx.font = "bold 28px system-ui, -apple-system, Segoe UI, Roboto, Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("2D 슈팅 게임", GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40);
    ctx.font = "16px system-ui, -apple-system, Segoe UI, Roboto, Arial";
    ctx.fillStyle = "#e6e6e6";
    ctx.fillText("이동: ← → ↑ ↓  또는  WASD", GAME_WIDTH / 2, GAME_HEIGHT / 2 + 8);
    ctx.fillText("발사: Space", GAME_WIDTH / 2, GAME_HEIGHT / 2 + 32);
    ctx.fillText("시작: Enter 또는 Space", GAME_WIDTH / 2, GAME_HEIGHT / 2 + 56);
  }

  if (gamePhase === "gameover") {
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    ctx.fillStyle = "#ffcad4";
    ctx.font = "bold 28px system-ui, -apple-system, Segoe UI, Roboto, Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Game Over", GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40);
    ctx.fillStyle = "#e6e6e6";
    ctx.font = "16px system-ui, -apple-system, Segoe UI, Roboto, Arial";
    ctx.fillText(`최종 점수: ${score}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 0);
    ctx.fillText("다시 시작: Enter 또는 Space", GAME_WIDTH / 2, GAME_HEIGHT / 2 + 32);
  }

  // boss hp bar
  if (boss) {
    const pad = 20;
    const barW = GAME_WIDTH - pad * 2;
    const barH = 10;
    const ratio = boss.hp / boss.maxHp;
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.fillRect(pad, pad, barW, barH);
    ctx.fillStyle = "#c084fc";
    ctx.fillRect(pad, pad, barW * ratio, barH);
  }
}

function render() {
  renderBackground();
  renderPlayer();
  renderBullets();
  renderEnemies();
  renderPowerups();
  renderParticles();
  renderUI();
}

// ====== Main Loop ======
function loop(timestamp) {
  const dt = Math.min((timestamp - lastTimestamp) / 1000 || 0, 0.033);
  lastTimestamp = timestamp;
  updateStars(dt);
  update(dt);
  render();
  requestAnimationFrame(loop);
}

initStars();
requestAnimationFrame(loop);

// ====== Bullets helpers ======
function spawnPlayerBullet(x, y, vx, vy) {
  bullets.push({ x, y, w: BULLET_WIDTH, h: BULLET_HEIGHT, vx, vy });
}

function getEnemyShootCooldown() {
  const scale = Math.max(0.5, 1 - (difficultyLevel - 1) * 0.1);
  return getRandomFloat(ENEMY_SHOOT_MIN_SEC * scale, ENEMY_SHOOT_MAX_SEC * scale);
}

// ====== Boss ======
let boss = null;
function spawnBoss() {
  if (boss) return;
  const width = 160;
  const height = 40;
  boss = {
    x: (GAME_WIDTH - width) / 2,
    y: 40,
    w: width,
    h: height,
    vx: 160,
    hp: 200 + (difficultyLevel - 1) * 80,
    maxHp: 200 + (difficultyLevel - 1) * 80,
    shootTimer: 0,
    pattern: 0, // 0 spiral, 1 ring, 2 fan, 3 wave
    patternTime: 0,
    spiralAngle: 0,
  };
  stageTime = 0;
}

/** @type {{x:number,y:number,w:number,h:number,vx:number,vy:number}[]} */
const enemyBullets = [];

function updateBoss(dt) {
  if (!boss) return;
  boss.x += boss.vx * dt;
  if (boss.x <= 0) {
    boss.x = 0;
    boss.vx = Math.abs(boss.vx);
  } else if (boss.x + boss.w >= GAME_WIDTH) {
    boss.x = GAME_WIDTH - boss.w;
    boss.vx = -Math.abs(boss.vx);
  }

  // pattern cycle
  boss.patternTime += dt;
  if (boss.patternTime >= BOSS_PATTERN_DURATION) {
    boss.patternTime = 0;
    boss.pattern = (boss.pattern + 1) % 4;
  }

  // shooting per pattern
  boss.shootTimer -= dt;
  const cx = boss.x + boss.w / 2;
  const cy = boss.y + boss.h;
  const speed = BOSS_BULLET_SPEED_BASE + (difficultyLevel - 1) * 15; // 완화
  switch (boss.pattern) {
    case 0: // spiral
      if (boss.shootTimer <= 0) {
        // Telegraph circle
        particles.push({ x: cx, y: cy, vx: 0, vy: 0, life: 0.15, color: "rgba(255,255,255,0.7)", size: 5 });
        const a1 = boss.spiralAngle;
        const a2 = a1 + Math.PI;
        const v1x = Math.cos(a1) * speed;
        const v1y = Math.sin(a1) * speed;
        const v2x = Math.cos(a2) * speed;
        const v2y = Math.sin(a2) * speed;
        enemyBullets.push({ x: cx, y: cy, w: 4, h: 10, vx: v1x, vy: v1y });
        enemyBullets.push({ x: cx, y: cy, w: 4, h: 10, vx: v2x, vy: v2y });
        boss.shootTimer = 0.06;
        boss.spiralAngle += BOSS_SPIRAL_RATE * dt * 6; // accelerate spin
        playEnemyShoot();
      }
      break;
    case 1: // ring burst
      if (boss.shootTimer <= 0) {
        particles.push({ x: cx, y: cy, vx: 0, vy: 0, life: 0.2, color: "rgba(192,132,252,0.8)", size: 7 });
        for (let i = 0; i < BOSS_RING_COUNT; i += 1) {
          const a = (Math.PI * 2 * i) / BOSS_RING_COUNT;
          const vx = Math.cos(a) * speed;
          const vy = Math.sin(a) * speed;
          enemyBullets.push({ x: cx, y: cy, w: 4, h: 10, vx, vy });
        }
        boss.shootTimer = 1.2;
        playEnemyShoot();
      }
      break;
    case 2: // fan spread downward
      if (boss.shootTimer <= 0) {
        particles.push({ x: cx, y: cy, vx: 0, vy: 0, life: 0.18, color: "rgba(255,209,102,0.9)", size: 6 });
        const start = Math.PI / 2 - BOSS_FAN_SPREAD_RAD / 2;
        const step = BOSS_FAN_SPREAD_RAD / (BOSS_FAN_COUNT - 1);
        for (let i = 0; i < BOSS_FAN_COUNT; i += 1) {
          const a = start + i * step;
          const vx = Math.cos(a) * speed;
          const vy = Math.sin(a) * speed;
          enemyBullets.push({ x: cx, y: cy, w: 4, h: 10, vx, vy });
        }
        boss.shootTimer = 0.7;
        playEnemyShoot();
      }
      break;
    case 3: // aimed wave (sine offset)
      if (boss.shootTimer <= 0) {
        particles.push({ x: cx, y: cy, vx: 0, vy: 0, life: 0.18, color: "rgba(134,239,172,0.9)", size: 6 });
        const px = player.x + player.w / 2;
        const py = player.y + player.h / 2;
        const dx = px - cx;
        const dy = py - cy;
        const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len;
        const uy = dy / len;
        // orthogonal axis for wave
        const ox = -uy;
        const oy = ux;
        for (let i = -2; i <= 2; i += 1) {
          const offset = i * 20;
          const vx = (ux * speed) + (ox * offset);
          const vy = (uy * speed) + (oy * offset);
          const scale = 1 / Math.sqrt(vx * vx + vy * vy);
          enemyBullets.push({ x: cx, y: cy, w: 4, h: 10, vx: vx * scale * speed, vy: vy * scale * speed });
        }
        boss.shootTimer = 0.5;
        playEnemyShoot();
      }
      break;
  }

  // player bullets vs boss
  for (let i = bullets.length - 1; i >= 0; i -= 1) {
    const b = bullets[i];
    if (rectsIntersect(boss, b)) {
      bullets.splice(i, 1);
      boss.hp -= 10;
      emitSparks(b.x + b.w / 2, b.y);
      if (boss.hp <= 0) {
        emitExplosion(boss.x + boss.w / 2, boss.y + boss.h / 2, "#c084fc");
        playExplosion();
        score += 500;
        boss = null;
        // next stage
        stageNumber += 1;
        difficultyLevel += 1;
        stageTime = 0;
      }
      break;
    }
  }
}

function damagePlayer() {
  if (player.shieldTimer > 0) {
    player.shieldTimer = 0; // consume shield
    emitExplosion(player.x + player.w / 2, player.y + player.h / 2, "#98fb98");
    playExplosion();
    return;
  }
  if (player.invulnTimer > 0) return;
  player.health = Math.max(0, player.health - 1);
  // if dead, trigger game over immediately
  if (player.health <= 0) {
    emitExplosion(player.x + player.w / 2, player.y + player.h / 2, "#5ee1ff");
    playHit();
    gameOver();
    return;
  }
  player.invulnTimer = 1.2; // brief invulnerability
  emitExplosion(player.x + player.w / 2, player.y + player.h / 2, "#5ee1ff");
  playHit();
}

// ====== Powerups ======
/** @type {{x:number,y:number,w:number,h:number,vy:number,type:string}[]} */
const powerups = [];
function maybeDropPowerup(x, y) {
  if (Math.random() < 0.15) {
    const types = ["rapid", "spread", "shield", "heal"];
    const type = types[Math.floor(Math.random() * types.length)];
    powerups.push({ x: x - 8, y: y - 8, w: 16, h: 16, vy: 90, type });
  }
}

function applyPowerup(type) {
  switch (type) {
    case "rapid":
      player.rapidTimer = Math.max(player.rapidTimer, 8);
      break;
    case "spread":
      player.spreadTimer = Math.max(player.spreadTimer, 10);
      break;
    case "shield":
      player.shieldTimer = Math.max(player.shieldTimer, 8);
      break;
    case "heal":
      player.health = Math.min(PLAYER_MAX_HEALTH, player.health + 1);
      break;
  }
}

function renderPowerups() {
  for (let i = 0; i < powerups.length; i += 1) {
    const p = powerups[i];
    switch (p.type) {
      case "rapid": ctx.fillStyle = "#ffd166"; break;
      case "spread": ctx.fillStyle = "#06d6a0"; break;
      case "shield": ctx.fillStyle = "#98fb98"; break;
      case "heal": ctx.fillStyle = "#ff6b6b"; break;
      default: ctx.fillStyle = "#fff";
    }
    ctx.fillRect(p.x, p.y, p.w, p.h);
  }
}

// ====== Particles ======
/** @type {{x:number,y:number,vx:number,vy:number,life:number,color:string,size:number}[]} */
const particles = [];
function emitExplosion(x, y, color) {
  for (let i = 0; i < 18; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 60 + Math.random() * 220;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.6 + Math.random() * 0.4,
      color: color || "#fff",
      size: 2 + Math.random() * 2,
    });
  }
}
function emitSparks(x, y) {
  for (let i = 0; i < 6; i += 1) {
    const angle = Math.random() * Math.PI - Math.PI / 2; // upwards-ish
    const speed = 80 + Math.random() * 160;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.25 + Math.random() * 0.2,
      color: "#ffd166",
      size: 2,
    });
  }
}
function renderParticles() {
  for (let i = 0; i < particles.length; i += 1) {
    const p = particles[i];
    ctx.globalAlpha = Math.max(0, p.life / 0.8);
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);
  }
  ctx.globalAlpha = 1;
}

// ====== Simple Audio (WebAudio) ======
let audioCtx = null;
function ensureAudio() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      audioCtx = null;
    }
  }
}
function beep(freq, dur, type, gain) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = type || "sine";
  osc.frequency.value = freq;
  g.gain.value = gain ?? 0.03;
  osc.connect(g);
  g.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + dur);
}
function playShoot() { ensureAudio(); beep(900, 0.05, "square", 0.06); }
function playEnemyShoot() { ensureAudio(); beep(300, 0.06, "sawtooth", 0.05); }
function playExplosion() { ensureAudio(); beep(80, 0.2, "triangle", 0.08); }
function playHit() { ensureAudio(); beep(200, 0.08, "square", 0.06); }
function playPowerup() { ensureAudio(); beep(1200, 0.07, "sine", 0.05); }


