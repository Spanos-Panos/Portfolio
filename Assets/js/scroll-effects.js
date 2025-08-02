// Smooth Scroll Effects for Progressive Gradient Animation
document.addEventListener('DOMContentLoaded', function() {
    let lastScrollY = 0;
    let isScrolling = false;
    
    function handleScroll() {
        const currentScrollY = window.scrollY;
        const body = document.body;
        const sections = document.querySelectorAll('section');
        
        // Calculate scroll percentage based on viewport height
        const viewportHeight = window.innerHeight;
        const maxScrollForEffect = viewportHeight * 2; // Effect completes after 2 viewport heights
        const scrollPercentage = Math.min(currentScrollY / maxScrollForEffect, 1.95); // Clamp to 1 (100%)
        
        // Apply smooth gradient expansion using CSS custom property
        body.style.setProperty('--scroll-progress', scrollPercentage);
        
        // Add scrolled class for other effects when scrolling starts
        if (currentScrollY > 40) {
            body.classList.add('scrolled');
        } else {
            body.classList.remove('scrolled');
        }
        
        // Add glassmorphism effects to sections in viewport with performance optimization
        if (!isScrolling) {
            isScrolling = true;
            
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
                
                if (isInViewport && currentScrollY > lastScrollY) {
                    // Scrolling down - add glass effect
                    section.classList.add('glass-visible');
                } else if (!isInViewport || currentScrollY < lastScrollY) {
                    // Scrolling up or out of view - remove glass effect
                    section.classList.remove('glass-visible');
                }
            });
            
            // Reset scrolling flag after a short delay
            setTimeout(() => {
                isScrolling = false;
            }, 16); // ~60fps
        }
        
        lastScrollY = currentScrollY;
    }
    
    // Throttle scroll events for better performance
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(handleScroll);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', () => {
        requestTick();
        ticking = false;
    });
    
    // Initialize on load
    handleScroll();
});
