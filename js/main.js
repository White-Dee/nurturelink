// ============================================
// NurtureLink Mind Wellness - Main JavaScript
// ============================================

// Current language state
let currentLang = 'si';
let currentTestimonial = 0;
let totalTestimonialSlides = 0;

// ===== PRELOADER =====
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('hidden');
        // Start animations after preloader
        initScrollAnimations();
        animateCounters();
    }, 1500);
});

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Update active nav link
    updateActiveNavLink();
});

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ===== MOBILE MENU =====
function toggleMenu() {
    const navMenu = document.getElementById('navMenu');
    const hamburger = document.getElementById('hamburger');
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Close menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('navMenu').classList.remove('active');
        document.getElementById('hamburger').classList.remove('active');
    });
});

// ===== LANGUAGE TOGGLE =====
function setLanguage(lang) {
    currentLang = lang;
    
    // Update button states
    document.getElementById('btnSi').classList.toggle('active', lang === 'si');
    document.getElementById('btnEn').classList.toggle('active', lang === 'en');
    
    // Update body class for font
    document.body.classList.toggle('lang-en', lang === 'en');
    document.documentElement.lang = lang === 'si' ? 'si' : 'en';
    
    // Update all elements with data-si and data-en attributes
    document.querySelectorAll('[data-si][data-en]').forEach(el => {
        const text = lang === 'si' ? el.getAttribute('data-si') : el.getAttribute('data-en');
        if (text) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = text;
            } else if (el.tagName === 'OPTION') {
                el.textContent = text;
            } else {
                el.textContent = text;
            }
        }
    });
    
    // Reload blog posts with new language
    loadBlogPosts();
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const elements = document.querySelectorAll(
        '.service-card, .blog-card, .contact-card, .about-feature, .testimonial-card'
    );
    
    elements.forEach(el => el.classList.add('animate-on-scroll'));
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    elements.forEach(el => observer.observe(el));
}

// ===== TESTIMONIALS SLIDER =====
function initTestimonials() {
    const track = document.getElementById('testimonialsTrack');
    const cards = track.querySelectorAll('.testimonial-card');
    const dotsContainer = document.getElementById('testDots');
    
    // Calculate slides based on viewport
    const isMobile = window.innerWidth < 768;
    const cardsPerSlide = isMobile ? 1 : 2;
    totalTestimonialSlides = Math.ceil(cards.length / cardsPerSlide);
    
    // Create dots
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalTestimonialSlides; i++) {
        const dot = document.createElement('div');
        dot.className = `test-dot ${i === 0 ? 'active' : ''}`;
        dot.onclick = () => goToTestimonial(i);
        dotsContainer.appendChild(dot);
    }
    
    updateTestimonialPosition();
}

function slideTestimonials(direction) {
    currentTestimonial += direction;
    
    if (currentTestimonial < 0) currentTestimonial = totalTestimonialSlides - 1;
    if (currentTestimonial >= totalTestimonialSlides) currentTestimonial = 0;
    
    updateTestimonialPosition();
}

function goToTestimonial(index) {
    currentTestimonial = index;
    updateTestimonialPosition();
}

function updateTestimonialPosition() {
    const track = document.getElementById('testimonialsTrack');
    const cards = track.querySelectorAll('.testimonial-card');
    const isMobile = window.innerWidth < 768;
    
    if (cards.length === 0) return;
    
    const cardWidth = cards[0].offsetWidth + 28; // card width + margin
    const cardsPerSlide = isMobile ? 1 : 2;
    const offset = currentTestimonial * cardWidth * cardsPerSlide;
    
    track.style.transform = `translateX(-${offset}px)`;
    
    // Update dots
    document.querySelectorAll('.test-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentTestimonial);
    });
}

// Auto-slide testimonials
setInterval(() => {
    slideTestimonials(1);
}, 5000);

// ===== LOAD BLOG POSTS =====
async function loadBlogPosts() {
    try {
        const response = await fetch('/api/blog');
        const posts = await response.json();
        
        const grid = document.getElementById('blogGrid');
        grid.innerHTML = '';
        
        posts.forEach(post => {
            const title = currentLang === 'si' ? post.title_si : post.title_en;
            const excerpt = currentLang === 'si' ? post.excerpt_si : post.excerpt_en;
            const category = currentLang === 'si' ? post.category_si : post.category_en;
            
            const card = document.createElement('div');
            card.className = 'blog-card animate-on-scroll animated';
            card.innerHTML = `
                <span class="blog-category">${category}</span>
                <h3 class="blog-title">${title}</h3>
                <p class="blog-excerpt">${excerpt}</p>
                <div class="blog-date">
                    <i class="far fa-calendar-alt"></i>
                    ${new Date(post.date).toLocaleDateString(currentLang === 'si' ? 'si-LK' : 'en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </div>
            `;
            grid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading blog posts:', error);
    }
}

// ===== APPOINTMENT MODAL =====
function openAppointmentModal() {
    const modal = document.getElementById('appointmentModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAppointmentModal() {
    const modal = document.getElementById('appointmentModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal on backdrop click
document.getElementById('appointmentModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        closeAppointmentModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAppointmentModal();
    }
});

// ===== FORM SUBMISSIONS =====
// Contact Form
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast(result.message);
            e.target.reset();
        }
    } catch (error) {
        showToast(currentLang === 'si' 
            ? 'දෝෂයක් සිදු විය. කරුණාකර නැවත උත්සාහ කරන්න.' 
            : 'An error occurred. Please try again.');
    }
});

// Appointment Form
document.getElementById('appointmentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
        const response = await fetch('/api/appointment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast(result.message);
            e.target.reset();
            closeAppointmentModal();
        }
    } catch (error) {
        showToast(currentLang === 'si' 
            ? 'දෝෂයක් සිදු විය. කරුණාකර නැවත උත්සාහ කරන්න.' 
            : 'An error occurred. Please try again.');
    }
});

// ===== TOAST NOTIFICATION =====
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// ===== HERO PARTICLES =====
function createParticles() {
    const container = document.getElementById('particles');
    const colors = ['#7B1F3A', '#C8963E', '#E91E63', '#4CAF50', '#2196F3', '#FF9800'];
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 8 + 4}px;
            height: ${Math.random() * 8 + 4}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            opacity: ${Math.random() * 0.15 + 0.05};
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 4 + 3}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        container.appendChild(particle);
    }
}

// ===== SMOOTH SCROLL FOR NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    loadBlogPosts();
    initTestimonials();
    
    // Re-init testimonials on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            currentTestimonial = 0;
            initTestimonials();
        }, 250);
    });

    // Set min date for appointment to today
    const dateInput = document.querySelector('input[name="date"]');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
});
