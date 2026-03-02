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
    const getHeaderH = () => {
        const height = header ? header.getBoundingClientRect().height : 0;
        document.documentElement.style.setProperty('--header-h', `${height}px`);
        return height;
    };

    function scrollToHash(hash) {
        const el = document.querySelector(hash);
        if (!el) return;

        const headerH = getHeaderH();
        const y = el.getBoundingClientRect().top + window.scrollY - headerH;

        window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
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
        desc: 'Speak Ukrainian out loud with instant AI feedback.',
        buttonText: 'Start Speaking',
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
        desc: 'Text your AI tutor anytime, anywhere.',
        buttonText: 'Start Texting',
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
        desc: 'Your personal Ukrainian AI is ready the moment you are - no waiting, no scheduling.',
        buttonText: 'Start Anytime',
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
        desc: 'Start where you feel comfortable. No pressure. Just steady progress.',
        buttonText: 'Start Slow',
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
        desc: 'Talk about your favorite topics, from secret talents to future goals.',
        buttonText: 'Pick the Topic',
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
        desc: 'Every mistake becomes progress. Your AI adapts your level and improves your weak spots naturally.',
        buttonText: 'Start Learning',
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

    // Update action button text
    const startBtn = document.getElementById('startRoute');
    if (startBtn) {
        startBtn.textContent = route.buttonText || 'Start Learning';
    }

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

// Mobile Menu Toggle logic moved to consolidated block at end of file

// Redundant smooth scroll listener removed in favor of scrollToHash at top of file

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
    .animate-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
}
    
    .animate-on-scroll.animate-visible {
    opacity: 1;
    transform: translateY(0);
}
    
    .about-card.animate-on-scroll:nth-child(1) { transition-delay: 0.1s; }
    .about-card.animate-on-scroll:nth-child(2) { transition-delay: 0.2s; }
    .about-card.animate-on-scroll:nth-child(3) { transition-delay: 0.3s; }
    .about-card.animate-on-scroll:nth-child(4) { transition-delay: 0.4s; }
    .about-card.animate-on-scroll:nth-child(5) { transition-delay: 0.5s; }
    .about-card.animate-on-scroll:nth-child(6) { transition-delay: 0.6s; }
    
    .service-card.animate-on-scroll:nth-child(1) { transition-delay: 0.1s; }
    .service-card.animate-on-scroll:nth-child(2) { transition-delay: 0.2s; }
    .service-card.animate-on-scroll:nth-child(3) { transition-delay: 0.3s; }
    .service-card.animate-on-scroll:nth-child(4) { transition-delay: 0.4s; }
    
    .method-step.animate-on-scroll:nth-child(1) { transition-delay: 0.1s; }
    .method-step.animate-on-scroll:nth-child(2) { transition-delay: 0.2s; }
    .method-step.animate-on-scroll:nth-child(3) { transition-delay: 0.3s; }
    .method-step.animate-on-scroll:nth-child(4) { transition-delay: 0.4s; }
    
    .testimonial-card.animate-on-scroll:nth-child(odd) { transition-delay: 0.1s; }
    .testimonial-card.animate-on-scroll:nth-child(even) { transition-delay: 0.2s; }
    
    .pricing-card.animate-on-scroll:nth-child(1) { transition-delay: 0.1s; }
    .pricing-card.animate-on-scroll:nth-child(2) { transition-delay: 0.2s; }
    .pricing-card.animate-on-scroll:nth-child(3) { transition-delay: 0.3s; }

    /* Mobile menu button animation */
    .mobile-menu-btn.active span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
}
    .mobile-menu-btn.active span:nth-child(2) {
    opacity: 0;
}
    .mobile-menu-btn.active span:nth-child(3) {
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
    0%, 100% { background-position: 0% 50%;
}
50% { background-position: 100% 50%; }
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

// Services logic removed as requested

// Courses initialization removed

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

        // 2. Mobile Menu Logic (Consolidated)
        const toggle = document.querySelector('.mobile-toggle');
        const mobileNav = document.getElementById('mobileMenuPanel');

        if (toggle && mobileNav) {
            // Toggle
            toggle.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent immediate closing
                mobileNav.classList.toggle('open');
                toggle.classList.toggle('active');
                const isOpen = mobileNav.classList.contains('open');
                toggle.setAttribute('aria-expanded', isOpen);
            });

            // Close on Outside Click
            document.addEventListener('click', (e) => {
                if (mobileNav.classList.contains('open') &&
                    !mobileNav.contains(e.target) &&
                    !toggle.contains(e.target)) {

                    mobileNav.classList.remove('open');
                    toggle.classList.remove('active');
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });

            // Close on Escape Key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
                    mobileNav.classList.remove('open');
                    toggle.classList.remove('active');
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });

            // Close on Link Click
            mobileNav.addEventListener('click', (e) => {
                if (e.target.tagName === 'A') {
                    mobileNav.classList.remove('open');
                    toggle.classList.remove('active');
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

// ===== Fluency Roadmap Accordion Logic =====
(function initRoadmapAccordion() {
    function setupRoadmap() {
        const accordion = document.querySelector('.roadmap-accordion');
        const accordionItems = document.querySelectorAll('.accordion-item');
        if (!accordion || !accordionItems.length) return;

        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            if (!header) return;

            header.addEventListener('click', (e) => {
                e.stopPropagation();

                // Mobile specific: Expand ALL into grid view
                if (window.innerWidth <= 768) {
                    accordion.classList.add('expanded-all');
                    accordionItems.forEach(i => {
                        i.classList.add('active');
                        const h = i.querySelector('.accordion-header');
                        if (h) h.setAttribute('aria-expanded', 'true');
                    });
                    return;
                }

                // Desktop: Standard Toggle behavior
                const isActive = item.classList.contains('active');

                // Auto-close others
                accordionItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const otherHeader = otherItem.querySelector('.accordion-header');
                    if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
                });

                // Toggle current
                if (!isActive) {
                    item.classList.add('active');
                    header.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupRoadmap);
    } else {
        setupRoadmap();
    }
})();

// ===== FAQ Exclusive Accordion Logic =====
document.querySelectorAll('.faq-item').forEach((details) => {
    details.addEventListener('toggle', (e) => {
        if (details.open) {
            document.querySelectorAll('.faq-item').forEach((otherDetails) => {
                if (otherDetails !== details && otherDetails.open) {
                    otherDetails.removeAttribute('open');
                }
            });
        }
    });
});

// ===== Dynamic Pricing Carousel Arrows =====
(function () {
    const pricingGrid = document.querySelector('.pricing-grid');
    const arrows = document.querySelectorAll('.swipe-arrow-indicator');

    if (pricingGrid && arrows.length > 0) {
        let hasSeenFluency = false;
        const confidenceArrow = document.getElementById('confidence-arrow');

        pricingGrid.addEventListener('scroll', () => {
            const scrollLeft = pricingGrid.scrollLeft;
            const cardWidth = pricingGrid.querySelector('.pricing-card').offsetWidth;

            // Fluency plan is roughly at scrollLeft = cardWidth * 2
            if (scrollLeft > cardWidth * 1.5) {
                hasSeenFluency = true;
            }

            arrows.forEach(arrow => {
                const isConfidence = arrow.id === 'confidence-arrow';

                // If it's the confidence arrow and we've swiped back from fluency
                if (isConfidence && hasSeenFluency && scrollLeft < cardWidth * 1.5 && scrollLeft > cardWidth * 0.5) {
                    arrow.textContent = '↔';
                    arrow.classList.remove('is-reversed');
                } else if (scrollLeft > 100) {
                    arrow.classList.add('is-reversed');
                    arrow.textContent = '➔';
                } else {
                    arrow.classList.remove('is-reversed');
                    arrow.textContent = '➔';
                }
            });
        }, { passive: true });
    }
})();
