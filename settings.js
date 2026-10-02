/* beans ツ — shared settings engine
   Loaded on every page. Reads saved preferences from localStorage and
   applies them via body classes / CSS custom properties so index.html,
   devices.html, and settings.html all stay in sync. */

(function () {
    const STORAGE_KEY = 'beansSettings';

    const DEFAULTS = {
        darkMode: true,
        showFigcaptions: true,
        smallPagebar: false,
        boldFont: false,
        font: 'plus-jakarta',
        language: 'en',
        pagebarPosition: 'top',
        wallpaper: 'default',
        accentColor: 'orange',
        blurEffect: true,
        wallpaperBlur: true,
        reducedAnimation: false,
        lowEndMode: false,
        experimentalFeatures: false
    };

    const TRANSLATIONS = {
        en: {
            navHome: `🏠 Home`,
            navDevices: `Devices`,
            navSettings: `Settings`,
            navBeansStuff: `🫘 Beans Stuff`,
            titleDiscord: `Discord`,
            titleSocials: `Socials`,
            titlePhones: `Phones`,
            titleTablets: `Tablets`,
            titleLaptops: `Laptops`,
            titleOther: `Other Stuff`,
            titleVisual: `Visual Settings`,
            titlePerformance: `Performance Settings`,
            titleExperimental: `Experimental Settings`,
            titleProjects: `Projects`,
            quote: `"i am just a can of beans, what did you think I was?"`,
            setDarkMode: `Dark Mode`,
            setFigcaptions: `Show Figcaptions`,
            setSmallPagebar: `Small Pagebar`,
            setBoldFont: `Bold Font`,
            setFont: `Font`,
            setLanguage: `Language`,
            setPagebarPos: `Pagebar Position`,
            setWallpaper: `Wallpaper`,
            setAccent: `Accent Color`,
            setBlur: `Blur Effect`,
            setWallpaperBlur: `Wallpaper Blur`,
            setReducedAnim: `Reduced Animation`,
            setLowEnd: `Low-End Mode`,
            setExperimental: `Experimental Features`,
            posTop: `Top`,
            posBottom: `Bottom`,
            wpDefault: `Default`,
            wpClouds: `Clouds`,
            wpDark: `Dark Solid`,
            wpBeans: `Beans`,
            wpBlackBeans: `Black Beans`,
            wpBlue: `Blue Wallpaper`,
            accOrange: `Bean Orange`,
            accBlue: `Blue`,
            accPurple: `Purple`,
            accBlack: `Black`,
            nodeStatus: `Status`,
            nodeActivity: `Playing / Watching`,
            nodeSpotify: `Listening to Spotify`,
            by: `by`,
            statusOnline: `ONLINE`,
            statusIdle: `IDLE`,
            statusDnd: `DO NOT DISTURB`,
            statusOffline: `OFFLINE`,
            tiktokMain: `Main Account`,
            tiktokAlt: `Alt Account`,
            confirmOpen: `Open "{label}" in a new tab?`,
            projGames: `Games I made with Google AI Studio`,
            projGamesCap: `View on Google Drive`,
            projSource: `Source Code`,
            projSourceCap: `View on GitHub`,
            projSora: `My old Sora videos`,
            projSoraCap: `ZIP on Google Drive`,
            nameXboxCtrl: `Xbox Series X Controller`,
            nameFakePs4: `Fake PS4 Controller`,
            nameRandomHeadphones: `Random Headphones`,
            capIosMain: `iOS 15.8.3 jailbroken • Main`,
            capAndroidSec: `Android 13 • Secondary`,
            capLentMom: `Lent to my mom`,
            capBroken: `Broken screen, doesn't charge, blown speakers`,
            capMainLaptop: `Main laptop`,
            capToshiba: `Shit harddrive, 4 GB DDR3, Windows 10`,
            capStickDrift: `Slight stick drift`,
            capLatency: `Too much latency with Bluetooth`,
            capPs4NoTv: `Doesn't show up on TV`,
            capSpeaker: `Portable Speaker`,
            capFireStick: `Has a 2019 Fire Stick 4K`,
            capEarbuds: `Earbuds`,
            capOverEar: `Over-ear`,
            notFoundTitle: `this can is empty`,
            notFoundText: `the page you're looking for got eaten. it was probably beans ツ.`,
            notFoundButton: `← back home`,
            clockLabel: `it's {time} for beans ツ rn`,
            secretToast: `you typed the secret code 🫘`,
            expTitle: `Enable Experimental Mode?`,
            expText: `Are you sure you want to enable Experimental Mode?`,
            expPassword: `Password`,
            expHint: `Hint: my other Easter egg`,
            expWrong: `Wrong password. Try again.`,
            expCancel: `Cancel`,
            expEnable: `Enable`,
            titleGame: `Bean Catcher`,
            gameInstructions: `Catch the beans, dodge the peppers. Move with your mouse, your finger, or the ← → keys.`,
            gameStart: `Play`,
            gamePlayAgain: `Play again`,
            gameScore: `Score`,
            gameBest: `Best`,
            gameOver: `Game over`
        },
        es: {
            navHome: `🏠 Inicio`,
            navDevices: `Dispositivos`,
            navSettings: `Ajustes`,
            navBeansStuff: `🫘 Cosas de Frijoles`,
            titleDiscord: `Discord`,
            titleSocials: `Redes`,
            titlePhones: `Teléfonos`,
            titleTablets: `Tabletas`,
            titleLaptops: `Portátiles`,
            titleOther: `Otras Cosas`,
            titleVisual: `Ajustes Visuales`,
            titlePerformance: `Ajustes de Rendimiento`,
            titleExperimental: `Ajustes Experimentales`,
            titleProjects: `Proyectos`,
            quote: `"solo soy una lata de frijoles, ¿qué pensabas que era?"`,
            setDarkMode: `Modo oscuro`,
            setFigcaptions: `Mostrar leyendas`,
            setSmallPagebar: `Barra de páginas pequeña`,
            setBoldFont: `Fuente en negrita`,
            setFont: `Fuente`,
            setLanguage: `Idioma`,
            setPagebarPos: `Posición de la barra`,
            setWallpaper: `Fondo de pantalla`,
            setAccent: `Color de acento`,
            setBlur: `Efecto de desenfoque`,
            setWallpaperBlur: `Desenfoque del fondo`,
            setReducedAnim: `Animación reducida`,
            setLowEnd: `Modo de bajo rendimiento`,
            setExperimental: `Funciones experimentales`,
            posTop: `Arriba`,
            posBottom: `Abajo`,
            wpDefault: `Predeterminado`,
            wpClouds: `Nubes`,
            wpDark: `Oscuro sólido`,
            wpBeans: `Frijoles`,
            wpBlackBeans: `Frijoles negros`,
            wpBlue: `Fondo azul`,
            accOrange: `Naranja frijol`,
            accBlue: `Azul`,
            accPurple: `Morado`,
            accBlack: `Negro`,
            nodeStatus: `Estado`,
            nodeActivity: `Jugando / Viendo`,
            nodeSpotify: `Escuchando en Spotify`,
            by: `de`,
            statusOnline: `EN LÍNEA`,
            statusIdle: `AUSENTE`,
            statusDnd: `NO MOLESTAR`,
            statusOffline: `DESCONECTADO`,
            tiktokMain: `Cuenta principal`,
            tiktokAlt: `Cuenta alternativa`,
            confirmOpen: `¿Abrir "{label}" en una pestaña nueva?`,
            projGames: `Juegos que hice con Google AI Studio`,
            projGamesCap: `Ver en Google Drive`,
            projSource: `Código fuente`,
            projSourceCap: `Ver en GitHub`,
            projSora: `Mis videos viejos de Sora`,
            projSoraCap: `ZIP en Google Drive`,
            nameXboxCtrl: `Mando de Xbox Series X`,
            nameFakePs4: `Mando de PS4 falso`,
            nameRandomHeadphones: `Auriculares cualquiera`,
            capIosMain: `iOS 15.8.3 con jailbreak • Principal`,
            capAndroidSec: `Android 13 • Secundario`,
            capLentMom: `Prestada a mi mamá`,
            capBroken: `Pantalla rota, no carga, altavoces reventados`,
            capMainLaptop: `Portátil principal`,
            capToshiba: `Disco duro de mierda, 4 GB DDR3, Windows 10`,
            capStickDrift: `Ligero drift del joystick`,
            capLatency: `Demasiada latencia con Bluetooth`,
            capPs4NoTv: `No se ve en la TV`,
            capSpeaker: `Altavoz portátil`,
            capFireStick: `Tiene un Fire Stick 4K de 2019`,
            capEarbuds: `Audífonos`,
            capOverEar: `De diadema`,
            notFoundTitle: `esta lata está vacía`,
            notFoundText: `la página que buscas se la comieron. seguro fue beans ツ.`,
            notFoundButton: `← volver al inicio`,
            clockLabel: `hora de beans ツ ahora: {time}`,
            secretToast: `escribiste el código secreto 🫘`,
            expTitle: `¿Activar el Modo Experimental?`,
            expText: `¿Seguro que quieres activar el Modo Experimental?`,
            expPassword: `Contraseña`,
            expHint: `Pista: mi otro easter egg`,
            expWrong: `Contraseña incorrecta. Inténtalo de nuevo.`,
            expCancel: `Cancelar`,
            expEnable: `Activar`,
            titleGame: `Atrapa Frijoles`,
            gameInstructions: `Atrapa los frijoles, esquiva los chiles. Muévete con el ratón, el dedo o las teclas ← →.`,
            gameStart: `Jugar`,
            gamePlayAgain: `Jugar otra vez`,
            gameScore: `Puntos`,
            gameBest: `Récord`,
            gameOver: `Fin del juego`
        },
        fr: {
            navHome: `🏠 Accueil`,
            navDevices: `Appareils`,
            navSettings: `Paramètres`,
            navBeansStuff: `🫘 Trucs de Haricots`,
            titleDiscord: `Discord`,
            titleSocials: `Réseaux`,
            titlePhones: `Téléphones`,
            titleTablets: `Tablettes`,
            titleLaptops: `Ordinateurs portables`,
            titleOther: `Autres objets`,
            titleVisual: `Paramètres visuels`,
            titlePerformance: `Paramètres de performance`,
            titleExperimental: `Paramètres expérimentaux`,
            titleProjects: `Projets`,
            quote: `« je ne suis qu'une boîte de haricots, à quoi t'attendais-tu ? »`,
            setDarkMode: `Mode sombre`,
            setFigcaptions: `Afficher les légendes`,
            setSmallPagebar: `Petite barre de pages`,
            setBoldFont: `Police en gras`,
            setFont: `Police`,
            setLanguage: `Langue`,
            setPagebarPos: `Position de la barre`,
            setWallpaper: `Fond d'écran`,
            setAccent: `Couleur d'accentuation`,
            setBlur: `Effet de flou`,
            setWallpaperBlur: `Flou du fond d'écran`,
            setReducedAnim: `Animation réduite`,
            setLowEnd: `Mode faible performance`,
            setExperimental: `Fonctionnalités expérimentales`,
            posTop: `Haut`,
            posBottom: `Bas`,
            wpDefault: `Par défaut`,
            wpClouds: `Nuages`,
            wpDark: `Sombre uni`,
            wpBeans: `Haricots`,
            wpBlackBeans: `Haricots noirs`,
            wpBlue: `Fond bleu`,
            accOrange: `Orange haricot`,
            accBlue: `Bleu`,
            accPurple: `Violet`,
            accBlack: `Noir`,
            nodeStatus: `Statut`,
            nodeActivity: `Joue / Regarde`,
            nodeSpotify: `Écoute sur Spotify`,
            by: `de`,
            statusOnline: `EN LIGNE`,
            statusIdle: `INACTIF`,
            statusDnd: `NE PAS DÉRANGER`,
            statusOffline: `HORS LIGNE`,
            tiktokMain: `Compte principal`,
            tiktokAlt: `Compte secondaire`,
            confirmOpen: `Ouvrir « {label} » dans un nouvel onglet ?`,
            projGames: `Jeux que j'ai créés avec Google AI Studio`,
            projGamesCap: `Voir sur Google Drive`,
            projSource: `Code source`,
            projSourceCap: `Voir sur GitHub`,
            projSora: `Mes anciennes vidéos Sora`,
            projSoraCap: `ZIP sur Google Drive`,
            nameXboxCtrl: `Manette Xbox Series X`,
            nameFakePs4: `Manette PS4 contrefaite`,
            nameRandomHeadphones: `Casque quelconque`,
            capIosMain: `iOS 15.8.3 jailbreaké • Principal`,
            capAndroidSec: `Android 13 • Secondaire`,
            capLentMom: `Prêtée à ma mère`,
            capBroken: `Écran cassé, ne charge pas, haut-parleurs grillés`,
            capMainLaptop: `Ordinateur portable principal`,
            capToshiba: `Disque dur de merde, 4 Go DDR3, Windows 10`,
            capStickDrift: `Léger drift du stick`,
            capLatency: `Trop de latence en Bluetooth`,
            capPs4NoTv: `Ne s'affiche pas sur la TV`,
            capSpeaker: `Enceinte portable`,
            capFireStick: `Avec une Fire Stick 4K de 2019`,
            capEarbuds: `Écouteurs`,
            capOverEar: `Casque circum-auriculaire`,
            notFoundTitle: `cette boîte est vide`,
            notFoundText: `la page que tu cherches a été mangée. c'était sûrement beans ツ.`,
            notFoundButton: `← retour à l'accueil`,
            clockLabel: `heure de beans ツ maintenant : {time}`,
            secretToast: `tu as tapé le code secret 🫘`,
            expTitle: `Activer le mode expérimental ?`,
            expText: `Tu veux vraiment activer le mode expérimental ?`,
            expPassword: `Mot de passe`,
            expHint: `Indice : mon autre easter egg`,
            expWrong: `Mot de passe incorrect. Réessaie.`,
            expCancel: `Annuler`,
            expEnable: `Activer`,
            titleGame: `Attrape-Haricots`,
            gameInstructions: `Attrape les haricots, évite les piments. Déplace-toi à la souris, au doigt ou avec les touches ← →.`,
            gameStart: `Jouer`,
            gamePlayAgain: `Rejouer`,
            gameScore: `Score`,
            gameBest: `Record`,
            gameOver: `Partie terminée`
        }
    };

    function t(key, vars, lang) {
        const l = lang || loadSettings().language;
        const dict = TRANSLATIONS[l] || TRANSLATIONS.en;
        let str = dict[key] !== undefined ? dict[key] : (TRANSLATIONS.en[key] !== undefined ? TRANSLATIONS.en[key] : key);
        if (vars) {
            Object.keys(vars).forEach(function (k) {
                str = str.split('{' + k + '}').join(vars[k]);
            });
        }
        return str;
    }

    function loadSettings() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return Object.assign({}, DEFAULTS);
            return Object.assign({}, DEFAULTS, JSON.parse(raw));
        } catch (e) {
            console.warn('beans settings: failed to load, using defaults', e);
            return Object.assign({}, DEFAULTS);
        }
    }

    function saveSettings(settings) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        } catch (e) {
            console.warn('beans settings: failed to save', e);
        }
    }

    function applyLanguage(lang) {
        const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
        document.documentElement.lang = TRANSLATIONS[lang] ? lang : 'en';
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            const key = el.getAttribute('data-i18n');
            const text = dict[key] !== undefined ? dict[key] : TRANSLATIONS.en[key];
            if (text !== undefined) el.textContent = text;
        });
    }

    function applySettings(settings) {
        const body = document.body;
        if (!body) return;

        body.classList.toggle('light-mode', !settings.darkMode);
        body.classList.toggle('hide-figcaptions', !settings.showFigcaptions);
        body.classList.toggle('small-pagebar', !!settings.smallPagebar);
        body.classList.toggle('pagebar-bottom', settings.pagebarPosition === 'bottom');
        body.classList.toggle('bold-font', !!settings.boldFont);

        body.classList.remove('font-google-sans', 'font-inter', 'font-pixel');
        if (settings.font === 'google-sans') body.classList.add('font-google-sans');
        else if (settings.font === 'inter') body.classList.add('font-inter');
        else if (settings.font === 'pixel') body.classList.add('font-pixel');
        else if (settings.font === '8bit') body.classList.add('font-8bit');

        body.classList.remove('accent-blue', 'accent-purple', 'accent-black');
        if (settings.accentColor === 'blue') body.classList.add('accent-blue');
        else if (settings.accentColor === 'purple') body.classList.add('accent-purple');
        else if (settings.accentColor === 'black') body.classList.add('accent-black');

        body.classList.remove('wallpaper-clouds', 'wallpaper-dark', 'wallpaper-beans', 'wallpaper-black-beans', 'wallpaper-onn-peak', 'wallpaper-blue');
        if (settings.wallpaper === 'clouds') body.classList.add('wallpaper-clouds');
        else if (settings.wallpaper === 'dark') body.classList.add('wallpaper-dark');
        else if (settings.wallpaper === 'beans') body.classList.add('wallpaper-beans');
        else if (settings.wallpaper === 'black-beans') body.classList.add('wallpaper-black-beans');
        else if (settings.wallpaper === 'onn-peak') body.classList.add('wallpaper-onn-peak');
        else if (settings.wallpaper === 'blue') body.classList.add('wallpaper-blue');

        // Low-End Mode is a master switch: it forces the individual
        // performance toggles off/on regardless of their own state.
        const noBlur = settings.lowEndMode || !settings.blurEffect;
        const noWallpaperBlur = settings.lowEndMode || !settings.wallpaperBlur;
        const reducedMotion = settings.lowEndMode || !!settings.reducedAnimation;

        body.classList.toggle('no-blur', noBlur);
        body.classList.toggle('no-wallpaper-blur', noWallpaperBlur);
        body.classList.toggle('reduced-motion', reducedMotion);
        body.classList.toggle('low-end', !!settings.lowEndMode);

        body.classList.toggle('experimental', !!settings.experimentalFeatures);

        applyLanguage(settings.language);
    }

    // Exposed so settings.html can read/write/re-apply live as controls change.
    window.beansSettings = {
        load: loadSettings,
        save: saveSettings,
        apply: applySettings,
        defaults: DEFAULTS,
        t: t
    };

    const FADE_MS = 260;

    function initPageFade() {
        const body = document.body;

        // Fade the new page in. Runs after applySettings() so reduced-motion
        // (which sets transition:none on body) is already in place if enabled.
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                body.classList.add('page-loaded');
            });
        });

        // Intercept same-site nav clicks, fade out, then navigate.
        document.querySelectorAll('a.nav-item').forEach(function (link) {
            link.addEventListener('click', function (e) {
                const href = link.getAttribute('href');
                if (!href || link.classList.contains('active')) return;

                const reduced = body.classList.contains('reduced-motion');
                if (reduced) return; // let the browser navigate instantly

                e.preventDefault();
                body.classList.remove('page-loaded');
                body.classList.add('fade-out');
                setTimeout(function () {
                    window.location.href = href;
                }, FADE_MS);
            });
        });

        // Restore from bfcache (browser back/forward) cleanly.
        window.addEventListener('pageshow', function () {
            body.classList.remove('fade-out');
            body.classList.add('page-loaded');
        });
    }

    const RANDOM_QUOTES = {
        en: [
            `i am just a can of beans, what did you think I was?`,
            `beans 🤤🤤🤤`,
            `do you love beans?`,
            `change the wallpaper from default to beans or black beans for a suprise!`
        ],
        es: [
            `solo soy una lata de frijoles, ¿qué pensabas que era?`,
            `frijoles 🤤🤤🤤`,
            `¿te encantan los frijoles?`,
            `¡cambia el fondo de predeterminado a frijoles o frijoles negros para una sorpresa!`
        ],
        fr: [
            `je ne suis qu'une boîte de haricots, à quoi t'attendais-tu ?`,
            `haricots 🤤🤤🤤`,
            `tu aimes les haricots ?`,
            `change le fond d'écran de par défaut à haricots ou haricots noirs pour une surprise !`
        ]
    };

    function initQuoteTypewriter() {
        const el = document.querySelector('.quote-bubble p[data-i18n="quote"]');
        if (!el) return;

        const settings = loadSettings();
        const pool = RANDOM_QUOTES[settings.language] || RANDOM_QUOTES.en;
        const fullText = pool[Math.floor(Math.random() * pool.length)];
        el.textContent = fullText;

        // Respect the Reduced Animation / Low-End Mode setting — just show the text as-is.
        if (document.body.classList.contains('reduced-motion')) return;

        el.textContent = '';
        el.classList.add('typing');

        let i = 0;
        const speed = 32; // ms per character

        function typeNext() {
            if (i <= fullText.length) {
                el.textContent = fullText.slice(0, i);
                i++;
                setTimeout(typeNext, speed);
            } else {
                el.classList.remove('typing');
            }
        }

        setTimeout(typeNext, 350); // let the page fade-in settle first
    }

    function initAvatarBeanBurst() {
        const ring = document.querySelector('.avatar-ring');
        if (!ring) return;

        const CLICKS_TO_FALL = 20;
        let clickCount = 0;

        ring.addEventListener('click', function () {
            if (ring.classList.contains('fallen')) return;

            clickCount++;

            if (clickCount >= CLICKS_TO_FALL) {
                ring.classList.remove('wobble');
                ring.classList.add('fallen');
                ring.style.cursor = 'default';
                return;
            }

            const reduced = document.body.classList.contains('reduced-motion');

            ring.classList.remove('wobble');
            void ring.offsetWidth; // restart the animation if clicked again quickly
            if (!reduced) ring.classList.add('wobble');

            if (reduced) return;

            for (let i = 0; i < 6; i++) {
                const particle = document.createElement('span');
                particle.className = 'bean-particle';
                particle.textContent = '🫘';
                const tx = (Math.random() - 0.5) * 80;
                particle.style.setProperty('--tx', tx + 'px');
                particle.style.left = (45 + Math.random() * 10) + '%';
                particle.style.top = '40%';
                ring.appendChild(particle);
                setTimeout(function () { particle.remove(); }, 1000);
            }
        });
    }

    const BEANS_TIMEZONE = 'America/Grand_Turk';
    const CLOCK_LOCALES = { en: 'en-US', es: 'es-ES', fr: 'fr-FR' };

    function formatBeansTime(lang) {
        const locale = CLOCK_LOCALES[lang] || 'en-US';
        const options = { hour: 'numeric', minute: '2-digit' };
        try {
            return new Date().toLocaleTimeString(locale, Object.assign({ timeZone: BEANS_TIMEZONE }, options));
        } catch (e) {
            return new Date().toLocaleTimeString(locale, options);
        }
    }

    function initLiveClock() {
        const textEl = document.getElementById('profile-clock-text');
        if (!textEl) return;

        const lang = loadSettings().language;
        let last = '';

        function tick() {
            const next = t('clockLabel', { time: formatBeansTime(lang) }, lang);
            if (next !== last) {
                textEl.textContent = next;
                last = next;
            }
        }

        tick();
        setInterval(tick, 1000);
    }

    function showToast(message) {
        let toast = document.getElementById('secret-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'secret-toast';
            toast.className = 'secret-toast';
            toast.setAttribute('role', 'status');
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(showToast.timer);
        showToast.timer = setTimeout(function () {
            toast.classList.remove('show');
        }, 2800);
    }

    function triggerBeanRain() {
        showToast(t('secretToast'));
        if (document.body.classList.contains('reduced-motion')) return;

        const layer = document.createElement('div');
        layer.className = 'bean-rain';
        document.body.appendChild(layer);

        for (let i = 0; i < 70; i++) {
            const piece = document.createElement('span');
            piece.className = 'bean-rain-item';
            piece.textContent = Math.random() < 0.15 ? '🥫' : '🫘';
            piece.style.left = (Math.random() * 100) + 'vw';
            piece.style.fontSize = (18 + Math.random() * 26) + 'px';
            piece.style.animationDuration = (2.2 + Math.random() * 2.3) + 's';
            piece.style.animationDelay = (Math.random() * 1.6) + 's';
            piece.style.setProperty('--spin', (Math.random() * 720 - 360) + 'deg');
            layer.appendChild(piece);
        }

        setTimeout(function () { layer.remove(); }, 6500);
    }


    // EXPERIMENTAL RUN 1: Command Console
    function initExperimentalFeatures() {
        if (!document.body.classList.contains('experimental')) return;

        let state = { gravity: false, matrix: false, crt: false };
        let matrixCanvas = null;
        let matrixFrame = 0;
        let matrixResize = null;
        const panel = document.createElement('div');
        panel.className = 'exp-console';
        panel.innerHTML = '<div class="exp-console-head"><span>BEANS EXPERIMENTAL CONSOLE</span><button type="button" class="exp-console-close" aria-label="Close console">×</button></div><div class="exp-console-output" aria-live="polite"></div><div class="exp-console-line"><span>&gt;</span><input class="exp-console-input" type="text" autocomplete="off" spellcheck="false" aria-label="Experimental command"></div>';
        document.body.appendChild(panel);

        const output = panel.querySelector('.exp-console-output');
        const input = panel.querySelector('.exp-console-input');

        function print(line) {
            const row = document.createElement('div');
            row.textContent = line;
            output.appendChild(row);
            output.scrollTop = output.scrollHeight;
        }

        function gravity(on) {
            state.gravity = on;
            document.body.classList.toggle('exp-gravity', on);
            print(on ? 'Low-Gravity Mode: ON' : 'Low-Gravity Mode: OFF');
        }

        function matrix(on) {
            state.matrix = on;
            document.body.classList.toggle('exp-matrix', on);
            if (on && !document.querySelector('.exp-matrix-canvas')) {
                const canvas = document.createElement('canvas');
                canvas.className = 'exp-matrix-canvas';
                document.body.appendChild(canvas);
                const ctx = canvas.getContext('2d');
                let drops = [];

                function resize() {
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                    drops = Array(Math.ceil(canvas.width / 16)).fill(1);
                }

                function draw() {
                    if (!document.body.classList.contains('exp-matrix')) {
                        canvas.remove();
                        return;
                    }
                    ctx.fillStyle = 'rgba(0,0,0,0.08)';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = '#32ff75';
                    ctx.font = '14px monospace';
                    const chars = '01{}[]<>/|$#@%*';
                    for (let i = 0; i < drops.length; i++) {
                        ctx.fillText(chars.charAt(Math.floor(Math.random() * chars.length)), i * 16, drops[i] * 16);
                        if (drops[i] * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
                        drops[i]++;
                    }
                    matrixFrame = requestAnimationFrame(draw);
                }

                resize();
                matrixCanvas = canvas;
                matrixResize = resize;
                window.addEventListener('resize', matrixResize);
                matrixFrame = requestAnimationFrame(draw);
                draw();
            }
            if (!on) {
                if (matrixFrame) cancelAnimationFrame(matrixFrame);
                matrixFrame = 0;
                if (matrixResize) window.removeEventListener('resize', matrixResize);
                matrixResize = null;
                if (matrixCanvas) matrixCanvas.remove();
                matrixCanvas = null;
            }
            print(on ? 'Matrix Mode: ON' : 'Matrix Mode: OFF');
        }

        function crt(on) {
            state.crt = on;
            document.body.classList.toggle('exp-crt', on);
            print(on ? 'CRT Mode: ON' : 'CRT Mode: OFF');
        }

        function bios() {
            if (document.querySelector('.exp-bios')) return;
            const screen = document.createElement('div');
            screen.className = 'exp-bios';
            screen.innerHTML = '<div class="exp-bios-screen"><div class="exp-bios-title">BEANS BIOS v1.0</div><div>Copyright (C) beans ツ</div><br><div>CPU ............ BEAN PROCESSOR</div><div>MEMORY ......... OK</div><div>STORAGE ........ OK</div><div>DISPLAY ........ OK</div><div>NETWORK ........ OK</div><br><div>Experimental firmware loaded.</div><div>Press ESC or click to continue...</div><div class="exp-bios-cursor">_</div></div>';
            document.body.appendChild(screen);
            function close() {
                screen.remove();
                document.removeEventListener('keydown', key);
            }
            function key(e) {
                if (e.key === 'Escape' || e.key === 'Enter') close();
            }
            screen.addEventListener('click', close);
            document.addEventListener('keydown', key);
        }

        function command(raw) {
            const cmd = raw.trim().toLowerCase();
            if (!cmd) return;
            print('> ' + raw.trim());
            if (cmd === 'help') print('commands: help, gravity, matrix, crt, bios, clear, status, close');
            else if (cmd === 'gravity') gravity(!state.gravity);
            else if (cmd === 'matrix') matrix(!state.matrix);
            else if (cmd === 'crt') crt(!state.crt);
            else if (cmd === 'bios') bios();
            else if (cmd === 'clear') output.innerHTML = '';
            else if (cmd === 'status') print('gravity=' + (state.gravity ? 'on' : 'off') + ' | matrix=' + (state.matrix ? 'on' : 'off') + ' | crt=' + (state.crt ? 'on' : 'off'));
            else if (cmd === 'close' || cmd === 'exit') panel.classList.remove('open');
            else print('Unknown command. Type "help".');
        }

        panel.querySelector('.exp-console-close').addEventListener('click', function () {
            panel.classList.remove('open');
        });

        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                command(input.value);
                input.value = '';
            }
            if (e.key === 'Escape') panel.classList.remove('open');
        });

        document.addEventListener('keydown', function (e) {
            const tag = e.target && e.target.tagName ? e.target.tagName : '';
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
            if (e.key === String.fromCharCode(96) || (e.ctrlKey && e.key.toLowerCase() === 'k')) {
                e.preventDefault();
                panel.classList.toggle('open');
                if (panel.classList.contains('open')) input.focus();
            }
        });

        const badge = document.createElement('button');
        badge.type = 'button';
        badge.className = 'exp-console-badge';
        badge.textContent = 'EXP';
        badge.title = 'Open Experimental Console';
        badge.addEventListener('click', function () {
            panel.classList.add('open');
            input.focus();
        });
        document.body.appendChild(badge);
        print('Experimental console ready. Type "help".');
    }

    function initSecretCode() {
        const SECRET_CODE = 'beans';
        let typed = '';

        document.addEventListener('keydown', function (e) {
            const target = e.target;
            const tag = target && target.tagName ? target.tagName : '';
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
            if (target && target.isContentEditable) return;
            if (e.ctrlKey || e.metaKey || e.altKey) return;
            if (!e.key || e.key.length !== 1) return;

            typed = (typed + e.key.toLowerCase()).slice(-SECRET_CODE.length);
            if (typed === SECRET_CODE) {
                typed = '';
                triggerBeanRain();
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        applySettings(loadSettings());
        initPageFade();
        initQuoteTypewriter();
        initAvatarBeanBurst();
        initLiveClock();
        initSecretCode();
        initExperimentalFeatures();
    });
})();
