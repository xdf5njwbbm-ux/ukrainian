// ===== Navigation Scroll Effect =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== Smooth Scrolling with Header Offset =====
// Smooth-scroll nav links to full sections (accounts for sticky header)
(() => {
    const header = document.querySelector("header, .header, .site-header, .navbar");
    const getHeaderH = () => (header ? Math.round(header.getBoundingClientRect().height) : 0);
    const EXTRA_GAP = 16;

    function scrollToHash(hash) {
        const el = document.querySelector(hash);
        if (!el) return;

        const headerH = getHeaderH();
        const y = el.getBoundingClientRect().top + window.scrollY - headerH - EXTRA_GAP;

        window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
        // Keep URL updated without hard jump
        history.pushState(null, "", hash);
    }

    document.addEventListener("click", (e) => {
        const a = e.target.closest('a[href^="#"]');
        if (!a) return;

        const hash = a.getAttribute("href");
        if (!hash || hash === "#") return;

        const target = document.querySelector(hash);
        if (!target) return;

        e.preventDefault();
        scrollToHash(hash);
    });

    // If page loads with a hash, fix the landing position
    window.addEventListener("load", () => {
        if (location.hash) {
            setTimeout(() => scrollToHash(location.hash), 0);
        }
    });

    // Fix: Force page to always load at top (Hero) and remove hash
    if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
    }

    window.addEventListener("load", () => {
        // If hash exists, strip it and force scroll to top
        if (window.location.hash) {
            history.replaceState(null, null, window.location.pathname);
            window.scrollTo(0, 0);
        } else {
            // Even without hash, ensure we start at top
            window.scrollTo(0, 0);
        }
    });

    // Dynamic Header Height Calculation
    function updateHeaderHeight() {
        const header = document.querySelector('.header-nav');
        if (header) {
            const height = header.offsetHeight;
            document.documentElement.style.setProperty('--header-h', height + 'px');
        }
    }

    window.addEventListener('load', updateHeaderHeight);
    window.addEventListener('resize', updateHeaderHeight);
})();

// ===== Interactive Route Panel =====
const routePanel = document.getElementById('routePanel');
const routeOverlay = document.getElementById('routeOverlay');
const routeIcon = document.getElementById('routeIcon');
const routeTitle = document.getElementById('routeTitle');
const routeDesc = document.getElementById('routeDesc');
const routeSteps = document.getElementById('routeSteps');
const progressBar = document.getElementById('progressBar');
const routeMeta = document.getElementById('routeMeta');

// Route content data
const routeData = {
    voice: {
        icon: '🎧',
        title: 'AI Voice Calling',
        desc: 'Learn how voice calling accelerates your Ukrainian fluency.',
        time: '~10 min',
        steps: [
            { title: 'Why Voice Matters', text: 'Speaking out loud activates different neural pathways than reading. Your brain learns faster when your mouth moves!', activity: '🎯 Try saying "Привіт" (Hello) out loud right now' },
            { title: 'Real-Time Pronunciation', text: 'Our AI listens to your accent and gives instant feedback. No more wondering if you\'re saying it right.', activity: '🔊 The AI will correct your accent as you speak' },
            { title: 'Natural Conversations', text: 'Forget scripted dialogues. Chat about your day, your hobbies, anything—just like talking to a friend.', activity: '💬 Start with: "How was your day?" in Ukrainian' },
            { title: 'Build Confidence', text: 'The more you speak, the more natural it becomes. Our AI never judges—practice without anxiety.', activity: '🚀 Schedule your first 5-minute voice session' }
        ]
    },
    text: {
        icon: '💬',
        title: 'Instant Texting',
        desc: 'Perfect for busy schedules—practice Ukrainian anytime, anywhere.',
        time: '~8 min',
        steps: [
            { title: 'Learn at Your Pace', text: 'No pressure to respond immediately. Think through your responses and learn grammar as you go.', activity: '✍️ Type "Дякую" (Thank you) to get started' },
            { title: 'Grammar Corrections', text: 'Every message you send gets instant grammar feedback. Learn from your mistakes in real-time.', activity: '📝 The AI highlights errors and explains fixes' },
            { title: 'Vocabulary Building', text: 'New words are automatically saved to your personal dictionary. Review them anytime!', activity: '📚 Your word bank grows with every chat' },
            { title: 'Multi-Tasking Friendly', text: 'Practice during lunch breaks, commutes, or waiting rooms. Ukrainian fits into your life.', activity: '⏰ Set a daily 5-minute texting goal' }
        ]
    },
    always: {
        icon: '🌙',
        title: 'Available 24/7',
        desc: 'Your AI tutor never sleeps—practice at 3 AM or 3 PM.',
        time: '~5 min',
        steps: [
            { title: 'No Scheduling', text: 'Forget booking appointments. Your AI tutor is ready the moment you are.', activity: '⚡ Start a session right now—no waiting!' },
            { title: 'Any Timezone', text: 'Whether you\'re in Tokyo or Toronto, your tutor adapts to YOUR schedule.', activity: '🌍 Practice during your optimal learning hours' },
            { title: 'Midnight Motivation', text: 'Can\'t sleep? Turn that time into productive practice. Late-night learners welcome!', activity: '🌙 Night owl or early bird—we\'ve got you' },
            { title: 'Consistent Progress', text: 'Daily micro-sessions add up. 10 minutes a day beats 2 hours once a week.', activity: '📈 Track your streak and watch it grow' }
        ]
    },
    beginner: {
        icon: '🌱',
        title: 'Beginner Friendly',
        desc: 'Start from absolute zero—no prior knowledge needed.',
        time: '~7 min',
        steps: [
            { title: 'Zero Assumptions', text: 'Never learned a Slavic language? Perfect. We start with the Cyrillic alphabet.', activity: '🔤 Learn your first 5 letters today' },
            { title: 'Slow & Patient', text: 'The AI adjusts to YOUR speed. Take as long as you need—no rushing.', activity: '🐢 Set your preferred pace: slow, medium, or fast' },
            { title: 'Survival Phrases', text: 'Master essential phrases first: greetings, thank you, please, and basic questions.', activity: '🗣️ Learn 10 survival phrases this week' },
            { title: 'Celebrate Wins', text: 'Every small victory matters. Watch your progress badges stack up!', activity: '🏆 Earn your first achievement badge' }
        ]
    },
    topics: {
        icon: '💡',
        title: 'Topic Mastery',
        desc: 'Talk about what YOU love—from cooking to quantum physics.',
        time: '~6 min',
        steps: [
            { title: 'Your Interests', text: 'Love cooking? Gaming? Travel? Learn Ukrainian through topics that excite you.', activity: '❤️ Pick your top 3 favorite topics' },
            { title: 'Specialized Vocab', text: 'Learn the exact words you need for YOUR hobbies and profession.', activity: '📖 Unlock topic-specific vocabulary packs' },
            { title: 'Deep Conversations', text: 'Go beyond small talk. Discuss your passions in depth with your AI tutor.', activity: '🎯 Have a 10-minute chat about your hobby' },
            { title: 'Cultural Connections', text: 'Discover how Ukrainians talk about your interests. Learn cultural context!', activity: '🇺🇦 Explore Ukrainian perspectives on your topics' }
        ]
    },
    focus: {
        icon: '🎯',
        title: 'Personalized Focus',
        desc: 'The AI remembers YOUR mistakes and helps you fix them.',
        time: '~8 min',
        steps: [
            { title: 'Smart Memory', text: 'The AI tracks every mistake you make and ensures you don\'t repeat them.', activity: '🧠 Your personal weakness tracker is active' },
            { title: 'Targeted Practice', text: 'Struggle with verb conjugations? Get extra exercises exactly where you need them.', activity: '📊 Review your top 3 weak areas' },
            { title: 'Progress Analytics', text: 'See exactly where you\'ve improved and what still needs work. Data-driven learning.', activity: '📈 Check your weekly progress report' },
            { title: 'Adaptive Difficulty', text: 'As you improve, challenges get harder. Always learning at the edge of your ability.', activity: '⚡ Watch difficulty auto-adjust to your level' }
        ]
    }
};

function openRoutePanel(routeKey) {
    const route = routeData[routeKey];
    if (!route) return;

    routeIcon.textContent = route.icon;
    routeTitle.textContent = route.title;
    routeDesc.textContent = route.desc;
    routeMeta.textContent = route.time;

    // Render steps
    routeSteps.innerHTML = route.steps.map((step, i) => `
        <div class="step">
            <h4><span class="step-index">${i + 1}.</span>${step.title}</h4>
            <p>${step.text}</p>
            <div class="activity">${step.activity}</div>
        </div>
    `).join('');

    // Animate progress bar
    progressBar.style.width = '0%';
    setTimeout(() => {
        progressBar.style.width = '100%';
    }, 100);

    routePanel.classList.add('open');
    routeOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeRoutePanel() {
    routePanel.classList.remove('open');
    routeOverlay.classList.remove('open');
    document.body.style.overflow = '';
}

// Card click handlers
document.querySelectorAll('.about-card[data-route]').forEach(card => {
    card.addEventListener('click', () => {
        openRoutePanel(card.dataset.route);
    });
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openRoutePanel(card.dataset.route);
        }
    });
});

// Close handlers
document.getElementById('closePanel')?.addEventListener('click', closeRoutePanel);
document.getElementById('closeRoute')?.addEventListener('click', closeRoutePanel);
routeOverlay?.addEventListener('click', closeRoutePanel);
document.getElementById('startRoute')?.addEventListener('click', () => {
    closeRoutePanel();
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
});

// ===== Mobile Menu Toggle =====
(() => {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenuPanel');
    const header = document.querySelector('.header-nav');

    if (!mobileMenuBtn || !mobileMenu) return;

    // Toggle menu open/close
    function toggleMenu() {
        const isOpen = mobileMenu.classList.contains('open');

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    function openMenu() {
        mobileMenu.classList.add('open');
        mobileMenuBtn.classList.add('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        if (header) header.classList.add('menu-open');
    }

    function closeMenu() {
        mobileMenu.classList.remove('open');
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        if (header) header.classList.remove('menu-open');
    }

    // Click hamburger to toggle
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent immediate click-outside trigger
        toggleMenu();
    });

    // Close when clicking a nav link
    mobileMenu.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            closeMenu();
        }
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        const isOpen = mobileMenu.classList.contains('open');
        if (!isOpen) return;

        // Don't close if clicking inside menu or on hamburger
        if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            closeMenu();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
            closeMenu();
        }
    });
})();

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.about-card, .service-card, .method-step, .testimonial-card, .pricing-card').forEach(el => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
});

// ===== Contact Form Handling =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form values
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());

        // Show success message (in a real scenario, you'd send this to a server)
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span>Message Sent!</span>
        `;
        submitBtn.style.background = '#10b981';
        submitBtn.disabled = true;

        // Reset form
        this.reset();

        // Reset button after 3 seconds
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 3000);
    });
}

// ===== Dynamic Year in Footer =====
const yearSpan = document.querySelector('.footer-bottom p');
if (yearSpan) {
    const currentYear = new Date().getFullYear();
    yearSpan.innerHTML = yearSpan.innerHTML.replace('2026', currentYear);
}

// ===== Parallax Effect & Ukrainian Glow for Hero Section =====
const hero = document.getElementById('hero');
const heroContent = document.querySelector('.hero-content');

// Create the Ukrainian flag glow overlay
const glowOverlay = document.createElement('div');
glowOverlay.className = 'ukrainian-glow-overlay';
document.body.appendChild(glowOverlay);

window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroHeight = hero ? hero.offsetHeight : window.innerHeight;

    // Parallax effect for hero content
    if (scrolled < heroHeight) {
        const opacity = 1 - (scrolled / heroHeight) * 0.5;
        const translateY = scrolled * 0.3;
        if (heroContent) {
            heroContent.style.opacity = opacity;
            heroContent.style.transform = `translateY(${translateY}px)`;
        }
    }

    // Ukrainian flag glow effect when scrolling past hero
    if (scrolled > heroHeight * 0.7) {
        glowOverlay.classList.add('active');
        // Calculate intensity based on scroll position
        const intensity = Math.min((scrolled - heroHeight * 0.7) / (heroHeight * 0.3), 1);
        glowOverlay.style.setProperty('--glow-intensity', intensity);
    } else {
        glowOverlay.classList.remove('active');
    }
});

// ===== Add CSS for scroll animations =====
const style = document.createElement('style');
style.textContent = `
    .animate - on - scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
}
    
    .animate - on - scroll.animate - visible {
    opacity: 1;
    transform: translateY(0);
}
    
    .about - card.animate - on - scroll: nth - child(1) { transition - delay: 0.1s; }
    .about - card.animate - on - scroll: nth - child(2) { transition - delay: 0.2s; }
    .about - card.animate - on - scroll: nth - child(3) { transition - delay: 0.3s; }
    .about - card.animate - on - scroll: nth - child(4) { transition - delay: 0.4s; }
    .about - card.animate - on - scroll: nth - child(5) { transition - delay: 0.5s; }
    .about - card.animate - on - scroll: nth - child(6) { transition - delay: 0.6s; }
    
    .service - card.animate - on - scroll: nth - child(1) { transition - delay: 0.1s; }
    .service - card.animate - on - scroll: nth - child(2) { transition - delay: 0.2s; }
    .service - card.animate - on - scroll: nth - child(3) { transition - delay: 0.3s; }
    .service - card.animate - on - scroll: nth - child(4) { transition - delay: 0.4s; }
    
    .method - step.animate - on - scroll: nth - child(1) { transition - delay: 0.1s; }
    .method - step.animate - on - scroll: nth - child(2) { transition - delay: 0.2s; }
    .method - step.animate - on - scroll: nth - child(3) { transition - delay: 0.3s; }
    .method - step.animate - on - scroll: nth - child(4) { transition - delay: 0.4s; }
    
    .testimonial - card.animate - on - scroll: nth - child(odd) { transition - delay: 0.1s; }
    .testimonial - card.animate - on - scroll: nth - child(even) { transition - delay: 0.2s; }
    
    .pricing - card.animate - on - scroll: nth - child(1) { transition - delay: 0.1s; }
    .pricing - card.animate - on - scroll: nth - child(2) { transition - delay: 0.2s; }
    .pricing - card.animate - on - scroll: nth - child(3) { transition - delay: 0.3s; }

    /* Mobile menu button animation */
    .mobile - menu - btn.active span: nth - child(1) {
    transform: rotate(45deg) translate(5px, 5px);
}
    .mobile - menu - btn.active span: nth - child(2) {
    opacity: 0;
}
    .mobile - menu - btn.active span: nth - child(3) {
    transform: rotate(-45deg) translate(7px, -7px);
}
`;
document.head.appendChild(style);

// ===== Typing Effect for Hero Title (Optional Enhancement) =====
const createTypingEffect = () => {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;

    // Add subtle animation to text gradient
    const animateGradient = () => {
        const gradientSpan = heroTitle.querySelector('.text-gradient');
        if (gradientSpan) {
            gradientSpan.style.backgroundSize = '200% 200%';
            gradientSpan.style.animation = 'gradientShift 3s ease infinite';
        }
    };

    animateGradient();
};

// Add gradient animation keyframes
const gradientStyle = document.createElement('style');
gradientStyle.textContent = `
@keyframes gradientShift {
    0 %, 100 % { background- position: 0 % 50 %;
}
50 % { background- position: 100 % 50 %; }
    }
`;
document.head.appendChild(gradientStyle);

// Initialize typing effect
createTypingEffect();

// ===== Service Card Toggle =====
function toggleServiceCard(selectedCard) {
    // Remove 'active' class from all other cards (exclusive selection)
    const allCards = document.querySelectorAll('.service-card');
    allCards.forEach(card => {
        if (card !== selectedCard) {
            card.classList.remove('active');
        }
    });
    // Toggle 'active' on the clicked card
    selectedCard.classList.toggle('active');
}

// ===== Preloader (if needed) =====
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ===== Interactive Phone Grid for Learning Options =====
const LEARNING_OPTIONS_CONFIG = {
    badge: "OUR SERVICES",
    headline: "Learning Options for",
    highlight: "Everyone",
    subhead: "Choose your preferred learning style and start speaking Ukrainian today.",

    aiAvatarSrc: "https://api.dicebear.com/9.x/bottts/svg?seed=AI_Tutor", // Placeholder avatar

    phones: [
        {
            key: "errors",
            title: "Correct Errors",
            cta: "Fix My Message",
            chat: [
                { role: "user", text: "Ми карліти фото?\nSorry if my Ukrainian is bad, I’m still learning." },
                { role: "ai", text: "Думаю, ти мав на увазі:\nМи дивилися фото?" },
                { role: "note", text: "Пояснення:\n• Дивитися = to look / to watch\n• «карліти» ❌ — такого слова в українській немає" },
                { role: "ai", text: "Не хвилюйся 🙂 Помилки — це нормально, коли вчиш мову." },
                { role: "user", text: "Ми дивилися фото? 😊" },
                { role: "ai", text: "Чудово ✅ Хочеш ще один приклад?" }
            ]
        },
        {
            key: "casual",
            title: "Casual Chat",
            cta: "Start Texting",
            chat: [
                { role: "ai", text: "Привіт! Як справи?" },
                { role: "user", text: "Привіт! Добре, в порядку. А у тебе?" },
                { role: "ai", text: "Добре! Сьогодні багато справ, трохи втомився." },
                { role: "user", text: "Треба відпочити. Може, подивишся фільм? 😄" },
                { role: "ai", text: "Класна ідея! Який жанр любиш?" }
            ]
        },
        {
            key: "lesson",
            title: "Structured Lesson",
            cta: "Continue Lesson",
            chat: [
                { role: "note", text: "Сьогоднішній урок: «треба»\nYou use «треба» when you need / must do something." },
                { role: "ai", text: "Давай потренуємось:\nТреба купити їжу." },
                { role: "user", text: "I need to buy food." },
                { role: "ai", text: "Добре! Тепер скажи українською:\nYou need to work tomorrow." },
                { role: "user", text: "Треба працювати завтра." },
                { role: "ai", text: "Чудово ✅" }
            ]
        },
        {
            key: "jokes",
            title: "Jokes & Fun",
            cta: "Get a Joke",
            chat: [
                { role: "user", text: "Розкажи жарт!" },
                { role: "ai", text: "Добре 😄\nЧому програмісти люблять каву? ☕" },
                { role: "user", text: "Не знаю 😄" },
                { role: "ai", text: "Бо без кави код не працює! 😂" },
                { role: "user", text: "Ахах, ще один!" },
                { role: "ai", text: "Який у програміста улюблений напій?\n— Java ☕😅" }
            ]
        }
    ]
};

function escapeHTML(str) {
    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function buildPhonesSectionHTML(cfg) {
    const phonesHTML = cfg.phones.map(p => `
    < div class="phone-card" data - phone="${p.key}" >
        <h3 class="phone-title">${escapeHTML(p.title)}</h3>

        <div class="phone-mock">
          <div class="chat-header">
            <div class="chat-left">
              <img class="chat-avatar" data-avatar="ai" src="${escapeHTML(cfg.aiAvatarSrc)}" alt="AI avatar">
              <span>AI Tutor</span>
            </div>
            <span style="opacity:.75;color:#fff;font-size:12px;">18:11</span>
          </div>

          <div class="chat-body" data-chat="${p.key}"></div>
        </div>

        <button class="phone-cta" type="button">${escapeHTML(p.cta)}</button>
      </div >
    `).join("");

    return `
    < div style = "text-align:center; padding: 22px 0 6px;" >
        <div style="
          display:inline-flex;
          padding:6px 12px;
          border-radius:999px;
          border:1px solid rgba(255,255,255,0.18);
          background: rgba(22,119,255,0.18);
          color:#fff;
          font-weight:700;
          letter-spacing:.08em;
          font-size:12px;
        ">${escapeHTML(cfg.badge)}</div>

        <h2 style="margin:14px 0 8px; font-size:44px; color:#fff; line-height:1.05;">
          ${escapeHTML(cfg.headline)} <span style="color:#ffd54a;">${escapeHTML(cfg.highlight)}</span>
        </h2>

        <p style="margin:0 auto; max-width: 760px; color: rgba(255,255,255,0.8);">
          ${escapeHTML(cfg.subhead)}
        </p>
      </div >

    <div class="phones-grid">
        ${phonesHTML}
    </div>
`;
}

function renderPhoneChats(cfg) {
    cfg.phones.forEach(p => {
        const chatEl = document.querySelector(`[data - chat= "${p.key}"]`);
        if (!chatEl) return;

        chatEl.innerHTML = p.chat.map(m => `
    < div class="bubble ${m.role}" > ${escapeHTML(m.text)}</div >



        `).join("");
    });
}

// Script ready

// Smooth scroll reveal (professional touch)
(() => {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || items.length === 0) return;

    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add("in");
                    io.unobserve(e.target);
                }
            });
        }, {
        threshold: 0.12
    }
    );

    items.forEach((el) => io.observe(el));
})();

// Header Interaction (New SaaS Style)
// Use immediate execution with readyState check instead of DOMContentLoaded
// because script loads at end of body and DOM may already be ready
(function initHeader() {
    function setupHeader() {
        // 1. Dropdown Logic
        const dropdown = document.querySelector('.login-dropdown');
        const dropBtn = document.querySelector('.login-btn');
        const dropMenu = document.querySelector('.dropdown-menu');

        if (dropdown && dropBtn && dropMenu) {
            dropBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dropMenu.classList.toggle('active');
                const expanded = dropMenu.classList.contains('active');
                dropBtn.setAttribute('aria-expanded', expanded);
            });

            document.addEventListener('click', (e) => {
                if (!dropdown.contains(e.target)) {
                    dropMenu.classList.remove('active');
                    dropBtn.setAttribute('aria-expanded', 'false');
                }
            });
        }

        // 2. Mobile Menu Logic (Fixed & Dynamic)
        const toggle = document.querySelector('.mobile-toggle');
        const mobileNav = document.getElementById('mobileMenuPanel');
        const desktopNav = document.querySelector('.nav-center');
        const desktopActions = document.querySelector('.nav-actions');

        console.log('Mobile menu init:', { toggle: !!toggle, mobileNav: !!mobileNav, desktopNav: !!desktopNav });

        if (toggle && mobileNav) {
            // --- Dynamic Content Injection ---
            // 1. Clone main nav links
            if (desktopNav) {
                const navLinks = desktopNav.querySelectorAll('a');
                console.log('Found', navLinks.length, 'nav links');

                navLinks.forEach(a => {
                    const link = a.cloneNode(true);
                    link.className = 'mobile-nav-link'; // Add class for styling
                    console.log('Cloning link:', link.textContent, link.href);
                    mobileNav.appendChild(link);
                });
            }

            // 2. Clone/Create Actions (Login + CTA)
            if (desktopActions) {
                const mobileActionsDiv = document.createElement('div');
                mobileActionsDiv.className = 'mobile-actions';

                // Login (simplified from dropdown to direct link)
                const loginLink = document.createElement('a');
                loginLink.href = '#login';
                loginLink.className = 'mobile-login';
                loginLink.textContent = 'Log in';
                mobileActionsDiv.appendChild(loginLink);

                // CTA
                const ctaBtn = desktopActions.querySelector('.btn-cta');
                if (ctaBtn) {
                    const mobileCta = ctaBtn.cloneNode(true);
                    mobileCta.className = 'mobile-cta';
                    mobileActionsDiv.appendChild(mobileCta);
                }

                mobileNav.appendChild(mobileActionsDiv);
            }

            console.log('Mobile menu populated with', mobileNav.children.length, 'items');
            // ---------------------------------

            // Toggle
            toggle.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent immediate closing
                mobileNav.classList.toggle('open');
                const isOpen = mobileNav.classList.contains('open');
                toggle.setAttribute('aria-expanded', isOpen);
            });

            // Close on Outside Click
            document.addEventListener('click', (e) => {
                if (mobileNav.classList.contains('open') &&
                    !mobileNav.contains(e.target) &&
                    !toggle.contains(e.target)) {

                    mobileNav.classList.remove('open');
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });

            // Close on Escape Key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
                    mobileNav.classList.remove('open');
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });

            // Close on Link Click (Delegation for dynamically added links)
            mobileNav.addEventListener('click', (e) => {
                if (e.target.tagName === 'A') {
                    mobileNav.classList.remove('open');
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }

    // Run immediately if DOM is already loaded, otherwise wait
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupHeader);
    } else {
        setupHeader();
    }
})();
// ===== Fluency Roadmap Interaction =====
(() => {
    // Stage data with all content
    const stages = [
        {
            id: 1,
            title: "Pick Your Persona",
            description: "Choose an AI conversation partner that matches your learning style and personality. Whether you prefer a friendly local, a professional tutor, or a casual peer, selecting the right persona creates psychological comfort and consistent motivation for daily practice.",
            checklist: [
                "Browse available tutor personas",
                "Match their personality and teaching style",
                "Start your first conversation"
            ],
            result: "You'll have a personalized AI guide who adapts to your pace and keeps you engaged for the long term."
        },
        {
            id: 2,
            title: "Start Texting",
            description: "Build your foundation through low-pressure text conversations that let you compose at your own pace. This silent practice helps you expand vocabulary, refine grammar, and gain confidence before speaking aloud. You'll develop natural phrasing while maintaining full control of the learning tempo.",
            checklist: [
                "Start daily text conversations",
                "Practice grammar and vocabulary",
                "Build confidence privately"
            ],
            result: "You'll develop a strong foundation in Ukrainian grammar and phrases without the pressure of real-time speaking."
        },
        {
            id: 3,
            title: "Voice Call",
            description: "Transition to voice mode to bridge the gap between knowing Ukrainian and using it in real time. Regular voice practice sharpens your pronunciation, trains your ear for native speech, and helps you develop the natural conversational rhythm essential for fluency. This step transforms passive knowledge into active speaking ability.",
            checklist: [
                "Switch to voice conversations",
                "Improve pronunciation and listening",
                "Develop natural speaking rhythm"
            ],
            result: "You'll gain the confidence and skill to hold real-time Ukrainian conversations with natural flow and accurate pronunciation."
        },
        {
            id: 4,
            title: "Get Feedback",
            description: "Accelerate your progress with instant corrections and detailed insights after every session. By tracking patterns in your errors and celebrating your improvements, you develop self-awareness and strategic focus. This feedback loop ensures you're always moving toward authentic fluency, not just memorizing phrases.",
            checklist: [
                "Receive instant corrections",
                "Track your progress over time",
                "Identify improvement areas"
            ],
            result: "You'll have clear visibility into your strengths and weaknesses, allowing you to focus practice where it matters most."
        }
    ];

    const detailsCard = document.querySelector('.details-card');
    const stageNodes = document.querySelectorAll('.stage-node');
    const prevBtn = document.querySelector('.nav-prev');
    const nextBtn = document.querySelector('.nav-next');
    const progressText = document.querySelector('.progress-text');

    if (!detailsCard || !stageNodes.length) return;

    let currentStage = 1;

    // Update the details panel content
    function updateStageDetails(stageNum) {
        const stage = stages[stageNum - 1];
        if (!stage) return;

        // Fade out
        detailsCard.style.opacity = '0';

        setTimeout(() => {
            // Update content
            detailsCard.querySelector('.details-title').textContent = stage.title;
            detailsCard.querySelector('.details-desc').textContent = stage.description;

            // Update checklist
            const checklistUl = detailsCard.querySelector('.details-checklist ul');
            checklistUl.innerHTML = stage.checklist
                .map(item => `<li>${item}</li>`)
                .join('');

            // Update result
            detailsCard.querySelector('.details-result').innerHTML =
                `<strong>Result:</strong> ${stage.result}`;

            // Update progress text
            if (progressText) {
                progressText.textContent = `Step ${stageNum} of 4`;
            }

            // Update navigation buttons
            if (prevBtn) {
                prevBtn.disabled = stageNum === 1;
            }
            if (nextBtn) {
                nextBtn.disabled = stageNum === 4;
            }

            // Fade in
            detailsCard.style.opacity = '1';
        }, 150);

        // Update active node state
        stageNodes.forEach((node, index) => {
            const isActive = index + 1 === stageNum;
            node.classList.toggle('active', isActive);
            node.setAttribute('aria-selected', isActive);
        });

        currentStage = stageNum;
    }

    // Stage node click handlers
    stageNodes.forEach((node) => {
        node.addEventListener('click', () => {
            const stageNum = parseInt(node.dataset.stage);
            if (stageNum && stageNum !== currentStage) {
                updateStageDetails(stageNum);
            }
        });
    });

    // Previous/Next button handlers
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentStage > 1) {
                updateStageDetails(currentStage - 1);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentStage < 4) {
                updateStageDetails(currentStage + 1);
            }
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Only handle if we're focused on the roadmap section
        const roadmapSection = document.getElementById('fluency-roadmap');
        if (!roadmapSection) return;

        const rect = roadmapSection.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

        if (!isInViewport) return;

        if (e.key === 'ArrowRight' && currentStage < 4) {
            e.preventDefault();
            updateStageDetails(currentStage + 1);
        } else if (e.key === 'ArrowLeft' && currentStage > 1) {
            e.preventDefault();
            updateStageDetails(currentStage - 1);
        }
    });
})();
