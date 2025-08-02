// Smooth scrolling functionality for navigation
window.addSmoothScrolling = () => {
    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        const navbar = document.querySelector('.navbar');
        const toggle = document.querySelector('.navbar-toggle');
        const menu = document.querySelector('.navbar-menu');
        
        if (navbar && toggle && menu && !navbar.contains(e.target)) {
            menu.classList.remove('active');
            toggle.classList.remove('active');
        }
    });
};

// Initialize eye tracking and key systems
window.initNavbarTracking = () => {
    console.log('🚀 Initializing navbar tracking and interactive systems...');
    
    // Initialize our eye tracking system
    setTimeout(() => {
        if (typeof window.initSkyDropSystem === 'function') {
            window.initSkyDropSystem();
        } else {
            console.log('⚠️ Sky drop system not loaded yet, retrying...');
            // Retry every second for up to 10 seconds
            let retryCount = 0;
            const retryInterval = setInterval(() => {
                if (typeof window.initSkyDropSystem === 'function') {
                    window.initSkyDropSystem();
                    clearInterval(retryInterval);
                } else if (retryCount++ > 10) {
                    console.log('❌ Failed to load sky drop system after 10 retries');
                    clearInterval(retryInterval);
                }
            }, 1000);
        }
    }, 500);
};
