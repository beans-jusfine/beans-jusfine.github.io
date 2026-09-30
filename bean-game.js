(function () {
    const canvas = document.getElementById('bean-game');
    const startBtn = document.getElementById('bean-game-start');
    if (!canvas || !canvas.getContext) return;

    const ctx = canvas.getContext('2d');
    const W = 480;
    const H = 320;
    const HIGH_KEY = 'beansGameHighScore';
    const MAX_LIVES = 3;
    const CAN_W = 52;
    const CAN_H = 38;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const t = function (key) { return window.beansSettings.t(key); };

    let state = 'idle';
    let score = 0;
    let lives = MAX_LIVES;
    let best = 0;
    let items = [];
    let popups = [];
    let spawnTimer = 0;
    let flash = 0;
    let lastTime = 0;
    let rafId = 0;
    let colors = { text: '#ffffff', glow: '#f79d74' };
    let fontFamily = 'sans-serif';
    const keys = { left: false, right: false };
    const player = { x: W / 2, targetX: W / 2 };

    try {
        best = parseInt(localStorage.getItem(HIGH_KEY), 10) || 0;
    } catch (e) {
        best = 0;
    }

    function readTheme() {
        const cs = getComputedStyle(document.body);
        colors.text = cs.getPropertyValue('--text-color').trim() || '#ffffff';
        colors.glow = cs.getPropertyValue('--accent-glow').trim() || '#f79d74';
        fontFamily = getComputedStyle(canvas).fontFamily || 'sans-serif';
    }

    function roundedRect(x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
    }

    function drawText(str, x, y, size, color, align, maxWidth) {
        const limit = maxWidth || W - 24;
        let s = size;
        ctx.font = '600 ' + s + 'px ' + fontFamily;
        while (ctx.measureText(str).width > limit && s > 8) {
            s -= 1;
            ctx.font = '600 ' + s + 'px ' + fontFamily;
        }
        ctx.fillStyle = color;
        ctx.textAlign = align || 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(str, x, y);
    }

    function drawEmoji(emoji, x, y, size, rotation, glow) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation || 0);
        ctx.font = size + 'px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        if (glow) {
            ctx.shadowColor = glow;
            ctx.shadowBlur = 14;
        }
        ctx.fillText(emoji, 0, 0);
        ctx.restore();
    }

    function drawCan() {
        const left = player.x - CAN_W / 2;
        const top = H - CAN_H - 6;
        ctx.fillStyle = '#c4c8cf';
        roundedRect(left, top, CAN_W, CAN_H, 6);
        ctx.fill();
        ctx.fillStyle = '#a34b25';
        ctx.fillRect(left, top + 11, CAN_W, CAN_H - 22);
        ctx.fillStyle = '#f5d9b8';
        ctx.beginPath();
        ctx.ellipse(player.x, top + CAN_H / 2, 9, 5.5, -0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#e6e9ee';
        roundedRect(left, top, CAN_W, 6, 3);
        ctx.fill();
    }

    function drawHud() {
        drawText(t('gameScore') + ': ' + score, 12, 16, 13, colors.text, 'left', 140);
        drawText(t('gameBest') + ': ' + best, W / 2, 16, 13, colors.text, 'center', 140);
        let hearts = '';
        for (let i = 0; i < MAX_LIVES; i++) hearts += i < lives ? '♥' : '♡';
        drawText(hearts, W - 12, 16, 16, colors.glow, 'right', 100);
    }

    function drawOverlay(lines) {
        const light = document.body.classList.contains('light-mode');
        ctx.fillStyle = light ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 0, W, H);
        lines.forEach(function (line) {
            drawText(line.text, W / 2, line.y, line.size, line.color || colors.text, 'center');
        });
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        items.forEach(function (item) {
            if (item.type === 'golden') drawEmoji('🫘', item.x, item.y, 34, item.rot, '#ffd700');
            else if (item.type === 'pepper') drawEmoji('🌶️', item.x, item.y, 28, item.rot);
            else drawEmoji('🫘', item.x, item.y, 28, item.rot);
        });

        drawCan();

        popups.forEach(function (p) {
            ctx.globalAlpha = Math.max(p.life / 0.8, 0);
            drawText(p.text, p.x, p.y, 14, p.color, 'center', 80);
            ctx.globalAlpha = 1;
        });

        if (flash > 0) {
            ctx.fillStyle = 'rgba(220, 40, 40, ' + (flash * 1.2) + ')';
            ctx.fillRect(0, 0, W, H);
        }

        if (state === 'playing') {
            drawHud();
        } else if (state === 'idle') {
            drawOverlay([
                { text: t('titleGame'), y: H / 2 - 34, size: 30, color: colors.glow },
                { text: t('gameBest') + ': ' + best, y: H / 2 + 6, size: 15 },
                { text: '▶ ' + t('gameStart'), y: H / 2 + 44, size: 18 }
            ]);
        } else if (state === 'over') {
            drawOverlay([
                { text: t('gameOver'), y: H / 2 - 46, size: 30, color: colors.glow },
                { text: t('gameScore') + ': ' + score, y: H / 2 - 6, size: 18 },
                { text: t('gameBest') + ': ' + best, y: H / 2 + 20, size: 15 },
                { text: '↻ ' + t('gamePlayAgain'), y: H / 2 + 54, size: 16 }
            ]);
        }
    }

    function spawn() {
        const roll = Math.random();
        const pepperChance = Math.min(0.18 + score * 0.004, 0.36);
        let type = 'bean';
        if (roll < 0.06) type = 'golden';
        else if (roll < 0.06 + pepperChance) type = 'pepper';
        items.push({
            type: type,
            x: 18 + Math.random() * (W - 36),
            y: -20,
            vy: Math.min(95 + score * 2.4, 250) * (0.85 + Math.random() * 0.3),
            rot: Math.random() * 6,
            vr: (Math.random() - 0.5) * 3
        });
    }

    function addPopup(x, y, text, color) {
        popups.push({ x: x, y: y, text: text, color: color, life: 0.8 });
    }

    function loseLife(x, y) {
        lives -= 1;
        flash = 0.25;
        addPopup(x, y, '♥ -1', '#ff6b6b');
        if (lives <= 0) endGame();
    }

    function update(dt) {
        const dir = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
        if (dir) player.targetX += dir * 430 * dt;
        player.targetX = Math.min(Math.max(player.targetX, CAN_W / 2), W - CAN_W / 2);
        player.x += (player.targetX - player.x) * Math.min(1, 20 * dt);

        spawnTimer -= dt;
        if (spawnTimer <= 0) {
            spawn();
            spawnTimer = Math.max(0.32, 0.95 - score * 0.012);
        }

        const canTop = H - CAN_H - 6;
        for (let i = items.length - 1; i >= 0; i--) {
            const item = items[i];
            item.y += item.vy * dt;
            item.rot += item.vr * dt;

            const inReach = Math.abs(item.x - player.x) < CAN_W / 2 + 8;
            if (inReach && item.y + 12 >= canTop && item.y < H) {
                items.splice(i, 1);
                if (item.type === 'pepper') {
                    loseLife(item.x, canTop - 10);
                } else {
                    const points = item.type === 'golden' ? 5 : 1;
                    score += points;
                    addPopup(item.x, canTop - 12, '+' + points, colors.glow);
                }
                if (state !== 'playing') return;
            } else if (item.y - 14 > H) {
                items.splice(i, 1);
                if (item.type !== 'pepper') {
                    loseLife(item.x, H - 30);
                    if (state !== 'playing') return;
                }
            }
        }

        for (let j = popups.length - 1; j >= 0; j--) {
            popups[j].life -= dt;
            popups[j].y -= 28 * dt;
            if (popups[j].life <= 0) popups.splice(j, 1);
        }
        if (flash > 0) flash = Math.max(0, flash - dt);
    }

    function loop(now) {
        if (state !== 'playing') return;
        const dt = Math.min((now - lastTime) / 1000, 0.05);
        lastTime = now;
        update(dt);
        draw();
        if (state === 'playing') rafId = requestAnimationFrame(loop);
    }

    function setButton(key, visible) {
        if (!startBtn) return;
        startBtn.dataset.i18n = key;
        startBtn.textContent = t(key);
        startBtn.style.visibility = visible ? 'visible' : 'hidden';
    }

    function startGame() {
        if (state === 'playing') return;
        readTheme();
        state = 'playing';
        score = 0;
        lives = MAX_LIVES;
        items = [];
        popups = [];
        flash = 0;
        spawnTimer = 0.4;
        player.x = player.targetX = W / 2;
        canvas.classList.add('playing');
        canvas.style.touchAction = 'none';
        setButton('gameStart', false);
        canvas.focus({ preventScroll: true });
        lastTime = performance.now();
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(loop);
    }

    function endGame() {
        state = 'over';
        cancelAnimationFrame(rafId);
        canvas.classList.remove('playing');
        canvas.style.touchAction = 'pan-y';
        keys.left = keys.right = false;
        if (score > best) {
            best = score;
            try {
                localStorage.setItem(HIGH_KEY, String(best));
            } catch (e) {}
        }
        setButton('gamePlayAgain', true);
        draw();
    }

    function pointerToX(e) {
        const rect = canvas.getBoundingClientRect();
        return (e.clientX - rect.left) * (W / rect.width);
    }

    canvas.style.touchAction = 'pan-y';

    canvas.addEventListener('pointermove', function (e) {
        if (state === 'playing') player.targetX = pointerToX(e);
    });

    canvas.addEventListener('pointerdown', function (e) {
        if (state === 'playing') player.targetX = pointerToX(e);
        else startGame();
    });

    window.addEventListener('keydown', function (e) {
        const k = e.key;
        if (state === 'playing') {
            if (k === 'ArrowLeft' || k === 'a' || k === 'A') {
                keys.left = true;
                e.preventDefault();
            } else if (k === 'ArrowRight' || k === 'd' || k === 'D') {
                keys.right = true;
                e.preventDefault();
            }
        } else if ((k === 'Enter' || k === ' ') && document.activeElement === canvas) {
            e.preventDefault();
            startGame();
        }
    });

    window.addEventListener('keyup', function (e) {
        const k = e.key;
        if (k === 'ArrowLeft' || k === 'a' || k === 'A') keys.left = false;
        if (k === 'ArrowRight' || k === 'd' || k === 'D') keys.right = false;
    });

    if (startBtn) startBtn.addEventListener('click', startGame);

    readTheme();
    setButton('gameStart', true);
    draw();
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () {
            if (state !== 'playing') {
                readTheme();
                draw();
            }
        });
    }
})();
