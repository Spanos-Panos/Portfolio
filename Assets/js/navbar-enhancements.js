// Enhanced Navbar functionality with section tracking
function initNavbarTracking() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.navbar-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Add scroll effects to navbar
    let lastScrollY = window.scrollY;
    
    function updateNavbar() {
        const currentScrollY = window.scrollY;
        
        // Add scrolled class for styling
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
    }
    
    // Track active section
    function updateActiveSection() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        // Update active nav link
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Throttled scroll handler
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateNavbar();
                updateActiveSection();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    // Add event listeners
    window.addEventListener('scroll', onScroll);
    
    // Initialize
    updateNavbar();
    updateActiveSection();
}

// Theme toggle functionality
function toggleTheme(isDarkMode) {
    const root = document.documentElement;
    
    if (isDarkMode) {
        // Dark mode (default)
        root.style.setProperty('--global-bg-primary', '#0a0a0a');
        root.style.setProperty('--global-bg-secondary', 'rgba(26, 26, 26, 0.8)');
        root.style.setProperty('--global-text-primary', '#ffffff');
        root.style.setProperty('--global-text-secondary', '#e0e0e0');
        root.style.setProperty('--global-text-tertiary', '#b0b0b0');
    } else {
        // Light mode
        root.style.setProperty('--global-bg-primary', '#f8fafc');
        root.style.setProperty('--global-bg-secondary', 'rgba(255, 255, 255, 0.8)');
        root.style.setProperty('--global-text-primary', '#1a202c');
        root.style.setProperty('--global-text-secondary', '#4a5568');
        root.style.setProperty('--global-text-tertiary', '#718096');
    }
    
    // Store preference
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}

// Initialize theme from localStorage
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const isDarkMode = savedTheme !== 'light';
    toggleTheme(isDarkMode);
    return isDarkMode;
}

// Add enhanced button hover effects
function initButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        // Add ripple effect on click
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                z-index: 1;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add CSS for ripple animation
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Enhanced icon animations
function initIconAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px'
    };
    
    const iconObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const icon = entry.target;
                if (icon.classList.contains('icon-glow')) {
                    icon.style.animation = 'iconPulse 2s ease-in-out infinite';
                }
            }
        });
    }, observerOptions);
    
    // Observe all icons
    document.querySelectorAll('.icon').forEach(icon => {
        iconObserver.observe(icon);
    });
}

// Initialize all enhanced features
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initNavbarTracking();
    initButtonEffects();
    initIconAnimations();
});

// Make functions available globally for Blazor
window.initNavbarTracking = initNavbarTracking;
window.initButtonEffects = initButtonEffects;
window.initIconAnimations = initIconAnimations;
window.toggleTheme = toggleTheme;
window.initTheme = initTheme;
