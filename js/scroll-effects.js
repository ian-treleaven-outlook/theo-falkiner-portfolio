// Scroll-driven animations using GSAP ScrollTrigger

document.addEventListener('DOMContentLoaded', function() {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded, using fallback animations');
        initFallbackAnimations();
        return;
    }

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Initialize all scroll animations
    initParallax();
    initFadeIns();
    initNavigation();
});

// Parallax effect for hero background
function initParallax() {
    const parallaxBg = document.querySelector('.parallax-bg');
    
    if (parallaxBg) {
        gsap.to(parallaxBg, {
            yPercent: 30,
            ease: 'none',
            scrollTrigger: {
                trigger: '.section-hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
    }
}

// Fade-in animations for content sections
function initFadeIns() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    fadeElements.forEach((element) => {
        gsap.from(element, {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: element,
                start: 'top 85%',
                end: 'top 50%',
                toggleActions: 'play none none reverse',
                onEnter: () => element.classList.add('visible'),
                onLeaveBack: () => element.classList.remove('visible')
            }
        });
    });
}

// Animate gallery items
function initScrollAnimations() {
    const artItems = document.querySelectorAll('.art-item');
    
    artItems.forEach((item, index) => {
        const isLeft = item.classList.contains('layout-left');
        const xStart = isLeft ? -50 : 50;
        
        gsap.from(item, {
            opacity: 0,
            x: xStart,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                end: 'top 40%',
                toggleActions: 'play none none reverse',
                onEnter: () => item.classList.add('visible'),
                onLeaveBack: () => item.classList.remove('visible')
            }
        });
    });
}

// Navigation background on scroll
function initNavigation() {
    const nav = document.getElementById('main-nav');
    
    if (nav) {
        ScrollTrigger.create({
            start: 'top -80',
            end: 99999,
            toggleClass: {
                targets: nav,
                className: 'scrolled'
            }
        });
    }
}

// Fallback animations if GSAP is not available
function initFallbackAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});