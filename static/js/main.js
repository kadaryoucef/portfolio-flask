/* ============================================================
   KADARI YOUCEF – Portfolio JavaScript
   - Navbar scroll effect & active link
   - Hamburger menu
   - Dark / Light mode toggle
   - Typewriter effect
   - Scroll reveal animations
   - Skill bar animations
   - Contact form AJAX
   - Premium Features: Particles, Cursor, Filtering, Translation
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ──────────────────────────────────────────
       1. NAVBAR – scroll effect + active link
    ─────────────────────────────────────────── */
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        // scrolled shadow
        navbar.classList.toggle('scrolled', window.scrollY > 40);

        // active link highlight
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
        });
        navLinks.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
        });
    });

    /* ──────────────────────────────────────────
       2. HAMBURGER MENU
    ─────────────────────────────────────────── */
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        const isOpen = mobileMenu.classList.contains('open');
        hamburger.setAttribute('aria-expanded', isOpen);
        // animate spans
        const spans = hamburger.querySelectorAll('span');
        if (isOpen) {
            spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
        } else {
            spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
        }
    });

    // close menu on link click
    mobileMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            const spans = hamburger.querySelectorAll('span');
            spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
        });
    });

    /* ──────────────────────────────────────────
       3. DARK / LIGHT MODE TOGGLE
    ─────────────────────────────────────────── */
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    const htmlEl = document.documentElement;

    // restore saved preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlEl.setAttribute('data-theme', savedTheme);
    themeIcon.textContent = savedTheme === 'dark' ? '🌙' : '☀️';

    themeToggle.addEventListener('click', () => {
        const isDark = htmlEl.getAttribute('data-theme') === 'dark';
        const next = isDark ? 'light' : 'dark';
        htmlEl.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        themeIcon.textContent = next === 'dark' ? '🌙' : '☀️';
    });

    /* ──────────────────────────────────────────
       4. TYPEWRITER EFFECT
    ─────────────────────────────────────────── */
    const phrases = [
        'Flutter Apps 📱',
        'Python Backends 🐍',
        'REST APIs 🔗',
        'Mobile Experiences ✨',
        'PostgreSQL DBs 🗄️',
        'Firebase Apps 🔥',
        'Beautiful UIs 🎨',
    ];

    const el = document.getElementById('typewriterText');
    let pIdx = 0;
    let cIdx = 0;
    let deleting = false;

    function typeLoop() {
        const phrase = phrases[pIdx];

        if (!deleting) {
            el.textContent = phrase.substring(0, cIdx + 1);
            cIdx++;
            if (cIdx === phrase.length) {
                deleting = true;
                setTimeout(typeLoop, 1800);
                return;
            }
        } else {
            el.textContent = phrase.substring(0, cIdx - 1);
            cIdx--;
            if (cIdx === 0) {
                deleting = false;
                pIdx = (pIdx + 1) % phrases.length;
            }
        }

        const speed = deleting ? 60 : 90;
        setTimeout(typeLoop, speed);
    }
    typeLoop();

    /* ──────────────────────────────────────────
       5. SCROLL REVEAL ANIMATIONS
    ─────────────────────────────────────────── */
    const reveals = document.querySelectorAll('.reveal');

    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.12 });

    reveals.forEach(el => revealObs.observe(el));

    /* ──────────────────────────────────────────
       6. SKILL BAR ANIMATIONS
    ─────────────────────────────────────────── */
    const skillBars = document.querySelectorAll('.skill-progress');

    const skillObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target.dataset.width;
                entry.target.style.width = target + '%';
                skillObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    skillBars.forEach(bar => skillObs.observe(bar));

    /* ──────────────────────────────────────────
       7. CONTACT FORM – AJAX submit
    ─────────────────────────────────────────── */
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMsg = document.getElementById('formSuccess');
    const errorMsg = document.getElementById('formError');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            successMsg.style.display = 'none';
            errorMsg.style.display = 'none';

            const payload = {
                name: form.name.value.trim(),
                email: form.email.value.trim(),
                message: form.message.value.trim(),
            };

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Sending…</span>';

            try {
                const res = await fetch('/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                const data = await res.json();

                if (data.status === 'success') {
                    successMsg.style.display = 'block';
                    form.reset();
                } else {
                    errorMsg.style.display = 'block';
                }
            } catch (_) {
                errorMsg.style.display = 'block';
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>Send Message ✈️</span>';
            }
        });
    }

    /* ──────────────────────────────────────────
       8. SMOOTH SCROLL for anchor links
    ─────────────────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ──────────────────────────────────────────
       9. PARTICLE SYSTEM & CUSTOM CURSOR
    ─────────────────────────────────────────── */
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    const follower = document.getElementById('cursorFollower');
    const dot = document.getElementById('cursorDot');

    let particles = [];
    const particleCount = 60;

    function resize() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.init();
        }
        init() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.fillStyle = `rgba(108, 99, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    if (canvas && ctx) {
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        }
        animate();
    }

    // Custom Cursor Movement
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (dot) {
            dot.style.left = mouseX + 'px';
            dot.style.top = mouseY + 'px';
        }
    });

    function updateCursor() {
        if (!follower) return;
        followerX += (mouseX - followerX) * 0.12;
        followerY += (mouseY - followerY) * 0.12;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        requestAnimationFrame(updateCursor);
    }
    updateCursor();

    // Cursor Hover Effects
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-item');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => follower && follower.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => follower && follower.classList.remove('cursor-hover'));
    });

    /* ──────────────────────────────────────────
       10. PROJECT FILTERING
    ─────────────────────────────────────────── */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            projectCards.forEach(card => {
                const category = card.dataset.category;
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hide');
                    card.classList.add('show');
                } else {
                    card.classList.add('hide');
                    card.classList.remove('show');
                }
            });
        });
    });

    /* ──────────────────────────────────────────
       11. MULTI-LANGUAGE TRANSLATION (FR/AR)
    ─────────────────────────────────────────── */
    const translations = {
        fr: {
            hero_greeting: "👋 Bonjour, Je suis",
            hero_subtitle: "Développeur Full-Stack spécialisé dans la création d'expériences mobiles et web exceptionnelles avec Flutter et Python.",
            section_about: "À Propos",
            section_skills: "Compétences",
            section_projects: "Projets",
            section_contact: "Contact",
            filter_all: "Tout",
            filter_flutter: "Flutter",
            filter_python: "Python",
            filter_web: "Web",
            contact_title: "Discutons de votre projet 🚀",
            lang_text: "AR"
        },
        ar: {
            hero_greeting: "👋 مرحباً، أنا",
            hero_subtitle: "مطور تطبيقات ومواقع متكامل خبرة في إنشاء تجارب استثنائية باستخدام Flutter و Python.",
            section_about: "حول",
            section_skills: "المهارات",
            section_projects: "المشاريع",
            section_contact: "اتصل بي",
            filter_all: "الكل",
            filter_flutter: "فلاتر",
            filter_python: "بايثون",
            filter_web: "ويب",
            contact_title: "دعنا نتحدث عن مشروعك 🚀",
            lang_text: "FR"
        }
    };

    const langToggle = document.getElementById('langToggle');
    let currentLang = 'fr';

    if (langToggle) {
        langToggle.addEventListener('click', () => {
            currentLang = currentLang === 'fr' ? 'ar' : 'fr';
            document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
            document.documentElement.setAttribute('lang', currentLang);
            updateTranslations();
        });
    }

    function updateTranslations() {
        const t = translations[currentLang];

        // Basic selection
        const greeting = document.querySelector('.hero-greeting');
        if (greeting) greeting.textContent = t.hero_greeting;

        const subtitle = document.querySelector('.hero-subtitle');
        if (subtitle) subtitle.textContent = t.hero_subtitle;

        const langText = document.querySelector('.lang-text');
        if (langText) langText.textContent = t.lang_text;

        // Nav Links
        const navNodes = document.querySelectorAll('.nav-link');
        if (navNodes.length >= 4) {
            navNodes[0].textContent = t.section_about;
            navNodes[1].textContent = t.section_skills;
            navNodes[2].textContent = t.section_projects;
            navNodes[3].textContent = t.section_contact;
        }

        // Filter Buttons
        const btns = document.querySelectorAll('.filter-btn');
        if (btns.length >= 4) {
            btns[0].textContent = t.filter_all;
            btns[1].textContent = t.filter_flutter;
            btns[2].textContent = t.filter_python;
            btns[3].textContent = t.filter_web;
        }

        const contactHeader = document.querySelector('.contact-info h3');
        if (contactHeader) contactHeader.textContent = t.contact_title;
    }

    // Custom Cursor visibility init
    const showCursor = () => {
        if (follower) follower.style.visibility = 'visible';
        if (dot) dot.style.visibility = 'visible';
        window.removeEventListener('mousemove', showCursor);
    };
    window.addEventListener('mousemove', showCursor);

});