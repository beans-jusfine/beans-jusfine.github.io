/* beans ツ — shared settings engine
   Loaded on every page. Reads saved preferences from localStorage and
   applies them via body classes / CSS custom properties so index.html,
   devices.html, and settings.html all stay in sync. */

(function () {
    const STORAGE_KEY = 'beansSettings';

    const DEFAULTS = {
        darkMode: true,
        showSocialLabels: false,
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
            navHome: '🏠 Home',
            navDevices: 'Devices',
            navSettings: 'Settings',
            navBeansStuff: '🫘 Beans Stuff',
            titleDiscord: 'Discord',
            titleSocials: 'Check out my socials below!',
            titlePhones: 'Phones',
            titleTablets: 'Tablets',
            titleLaptops: 'Laptops',
            titleOther: 'Other Stuff',
            titleVisual: 'Visual Settings',
            titlePerformance: 'Performance Settings',
            titleExperimental: 'Experimental Settings',
            titleProjects: 'Projects',
            quote: '"i am just a can of beans, what did you think I was?"'
        },
        es: {
            navHome: '🏠 Inicio',
            navDevices: 'Dispositivos',
            navSettings: 'Ajustes',
            navBeansStuff: '🫘 Cosas de Frijoles',
            titleDiscord: 'Discord',
            titleSocials: '¡Mira mis redes abajo!',
            titlePhones: 'Teléfonos',
            titleTablets: 'Tabletas',
            titleLaptops: 'Portátiles',
            titleOther: 'Otras Cosas',
            titleVisual: 'Ajustes Visuales',
            titlePerformance: 'Ajustes de Rendimiento',
            titleExperimental: 'Ajustes Experimentales',
            titleProjects: 'Proyectos',
            quote: '"solo soy una lata de frijoles, ¿qué pensabas que era?"'
        },
        fr: {
            navHome: '🏠 Accueil',
            navDevices: 'Appareils',
            navSettings: 'Paramètres',
            navBeansStuff: '🫘 Trucs de Haricots',
            titleDiscord: 'Discord',
            titleSocials: 'Découvrez mes réseaux ci-dessous !',
            titlePhones: 'Téléphones',
            titleTablets: 'Tablettes',
            titleLaptops: 'Ordinateurs portables',
            titleOther: 'Autres objets',
            titleVisual: 'Paramètres visuels',
            titlePerformance: 'Paramètres de performance',
            titleExperimental: 'Paramètres expérimentaux',
            titleProjects: 'Projets',
            quote: '« je ne suis qu\'une boîte de haricots, à quoi t\'attendais-tu ? »'
        }
    };

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
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) el.textContent = dict[key];
        });
    }

    function toggleExperimentalBadge(active) {
        let badge = document.getElementById('experimental-badge');
        if (active) {
            if (!badge) {
                badge = document.createElement('div');
                badge.id = 'experimental-badge';
                badge.textContent = '🧪 Experimental Mode';
                badge.style.cssText =
                    'position:fixed;bottom:16px;right:16px;z-index:1000;' +
                    'background:var(--accent, #a34b25);color:#fff;padding:8px 14px;' +
                    'border-radius:20px;font-size:12px;font-weight:600;' +
                    'box-shadow:0 6px 20px rgba(0,0,0,0.4);' +
                    'backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);';
                document.body.appendChild(badge);
            }
        } else if (badge) {
            badge.remove();
        }
    }

    function applySettings(settings) {
        const body = document.body;
        if (!body) return;

        body.classList.toggle('light-mode', !settings.darkMode);
        body.classList.toggle('show-social-labels', !!settings.showSocialLabels);
        body.classList.toggle('hide-figcaptions', !settings.showFigcaptions);
        body.classList.toggle('small-pagebar', !!settings.smallPagebar);
        body.classList.toggle('pagebar-bottom', settings.pagebarPosition === 'bottom');
        body.classList.toggle('bold-font', !!settings.boldFont);

        body.classList.remove('font-google-sans', 'font-inter');
        if (settings.font === 'google-sans') body.classList.add('font-google-sans');
        else if (settings.font === 'inter') body.classList.add('font-inter');

        body.classList.remove('accent-blue', 'accent-purple', 'accent-black');
        if (settings.accentColor === 'blue') body.classList.add('accent-blue');
        else if (settings.accentColor === 'purple') body.classList.add('accent-purple');
        else if (settings.accentColor === 'black') body.classList.add('accent-black');

        body.classList.remove('wallpaper-clouds', 'wallpaper-dark', 'wallpaper-beans', 'wallpaper-black-beans', 'wallpaper-onn-peak');
        if (settings.wallpaper === 'clouds') body.classList.add('wallpaper-clouds');
        else if (settings.wallpaper === 'dark') body.classList.add('wallpaper-dark');
        else if (settings.wallpaper === 'beans') body.classList.add('wallpaper-beans');
        else if (settings.wallpaper === 'black-beans') body.classList.add('wallpaper-black-beans');
        else if (settings.wallpaper === 'onn-peak') body.classList.add('wallpaper-onn-peak');

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
        toggleExperimentalBadge(!!settings.experimentalFeatures);

        applyLanguage(settings.language);
    }

    // Exposed so settings.html can read/write/re-apply live as controls change.
    window.beansSettings = {
        load: loadSettings,
        save: saveSettings,
        apply: applySettings,
        defaults: DEFAULTS
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

    const RANDOM_QUOTES = [
        'i am just a can of beans, what did you think I was?',
        'beans 🤤🤤🤤',
        'do you love beans?',
        'change the wallpaper from default to beans or black beans for a suprise!'
    ];

    function initQuoteTypewriter() {
        const el = document.querySelector('.quote-bubble p[data-i18n="quote"]');
        if (!el) return;

        // Random quote pool only applies in English — other languages fall back
        // to their single translated quote since these aren't translated yet.
        const settings = loadSettings();
        let fullText = el.textContent;
        if (settings.language === 'en') {
            fullText = RANDOM_QUOTES[Math.floor(Math.random() * RANDOM_QUOTES.length)];
            el.textContent = fullText;
        }

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

    document.addEventListener('DOMContentLoaded', function () {
        applySettings(loadSettings());
        initPageFade();
        initQuoteTypewriter();
    });
})();
