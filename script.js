// Theme management
class ThemeManager {
    constructor() {
        this.theme = this.getInitialTheme();
        this.init();
    }

    getInitialTheme() {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }

        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }

        return 'light';
    }

    init() {
        this.applyTheme();
        this.bindEvents();
        
        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    this.theme = e.matches ? 'dark' : 'light';
                    this.applyTheme();
                }
            });
        }
    }

    applyTheme() {
        document.documentElement.classList.toggle('dark', this.theme === 'dark');
        localStorage.setItem('theme', this.theme);
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme();
    }

    bindEvents() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
}

// Smooth scrolling for anchor links
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        // Handle all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const navHeight = 80; // Account for fixed navigation
                    
                    window.scrollTo({
                        top: offsetTop - navHeight,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Intersection Observer for animations
class AnimationObserver {
    constructor() {
        this.init();
    }

    init() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements that should animate
        const elementsToAnimate = document.querySelectorAll('.project-card, .about-grid > *, .hero-content');
        elementsToAnimate.forEach(el => {
            this.observer.observe(el);
        });
    }
}

// Navigation background opacity on scroll
class NavigationHandler {
    constructor() {
        this.init();
    }

    init() {
        const nav = document.querySelector('.nav');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
        
            
            // Add/remove scrolled class based on scroll position
            if (currentScrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }

            lastScrollY = currentScrollY;
        });
    }
}

// Image lazy loading fallback for older browsers
class ImageHandler {
    constructor() {
        this.init();
    }

    init() {
        // Add error handling for images
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('error', (e) => {
                // Fallback for broken images
                e.target.style.backgroundColor = 'var(--muted)';
                e.target.style.display = 'flex';
                e.target.style.alignItems = 'center';
                e.target.style.justifyContent = 'center';
                e.target.innerHTML = '<span style="color: var(--muted-foreground);">Image unavailable</span>';
            });

            // Add loading animation
            img.addEventListener('load', (e) => {
                e.target.style.opacity = '1';
            });

            // Set initial opacity for fade-in effect
            img.style.opacity = '1';
            img.style.transition = 'opacity 0.3s ease';
        });
    }
}

// Typing effect for hero section
document.addEventListener('DOMContentLoaded', () => {
    const phrases = [
        "Innovate, develop, deliver.",
        "Crafting seamless user experiences.",
        "Passionate about technology and design.",
        "I build modern web applications.",
        "I love clean code and thoughtful design.",
        "Let's create something amazing together!"
    ];
    let i = 0, j = 0, isDeleting = false, current = '', speed = 80;
    const typed = document.getElementById('typed');
    function type() {
        if (!typed) return;
        if (!isDeleting && j <= phrases[i].length) {
            current = phrases[i].substring(0, j++);
            typed.textContent = current;
            setTimeout(type, speed);
        } else if (isDeleting && j >= 0) {
            current = phrases[i].substring(0, j--);
            typed.textContent = current;
            setTimeout(type, speed / 2);
        } else {
            isDeleting = !isDeleting;
            if (!isDeleting) i = (i + 1) % phrases.length;
            setTimeout(type, 1000);
        }
    }
    type();
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new SmoothScroll();
    new AnimationObserver();
    new NavigationHandler();
    new ImageHandler();
    
    // Add some CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation: fadeInUp 0.6s ease forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .nav.scrolled {
            background-color: rgba(255, 255, 255, 0.95);
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }
        
        .dark .nav.scrolled {
            background-color: rgba(37, 37, 37, 0.95);
        }
        
        .project-card,
        .about-grid > *,
        .hero-content {
            opacity: 0;
            transform: translateY(30px);
        }
    `;
    document.head.appendChild(style);
});

// Add some interactive enhancements
document.addEventListener('DOMContentLoaded', () => {
    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s ease;
                left: ${x}px;
                top: ${y}px;
                width: ${size}px;
                height: ${size}px;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Add the ripple animation CSS
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
});

// Scroll-to-top button functionality
document.addEventListener('DOMContentLoaded', () => {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// Animate skills on scroll
const skillItems = document.querySelectorAll('.skill-item');
function showSkillsOnScroll() {
  skillItems.forEach(item => {
    const rect = item.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      item.classList.add('visible');
    }
  });
}
window.addEventListener('scroll', showSkillsOnScroll);
window.addEventListener('DOMContentLoaded', showSkillsOnScroll);

// Project modal functionality
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('projectModal');
    const modalBody = document.getElementById('modalBody');
    const closeModal = document.querySelector('.close-modal');
    document.querySelectorAll('.project-card .btn-sm').forEach((btn, idx) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.project-card');
            modalBody.innerHTML = card.innerHTML;
            modal.style.display = 'flex';
        });
    });
    closeModal.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
});