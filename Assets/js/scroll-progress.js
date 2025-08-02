// Scroll Progress Indicator Functions
let scrollProgressContainer;
let progressCircle;
let scrollButton;
let circleRadius = 25;
let circumference = 2 * Math.PI * circleRadius;

function initScrollProgress() {
    scrollProgressContainer = document.getElementById('scroll-progress');
    progressCircle = document.getElementById('progress-circle');
    scrollButton = scrollProgressContainer?.querySelector('.scroll-progress-btn');
    
    if (!scrollProgressContainer || !progressCircle || !scrollButton) {
        console.warn('Scroll progress elements not found');
        return;
    }

    // Set initial progress circle properties
    progressCircle.style.strokeDasharray = circumference;
    progressCircle.style.strokeDashoffset = circumference;

    // Add scroll event listener with throttling for smoother performance
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                updateScrollProgress();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Initial update
    updateScrollProgress();
}

function updateScrollProgress() {
    if (!scrollProgressContainer || !progressCircle || !scrollButton) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Smooth the scroll percentage calculation
    const scrollPercent = Math.min(Math.max(scrollTop / documentHeight, 0), 1);

    // Update progress circle with smoother calculation
    const offset = circumference - (scrollPercent * circumference);
    progressCircle.style.strokeDashoffset = Math.round(offset * 100) / 100; // Round for smoother animation

    // Show/hide based on scroll position
    if (scrollTop > 100) {
        scrollProgressContainer.classList.add('visible');
    } else {
        scrollProgressContainer.classList.remove('visible');
    }

    // Update button icon based on position - show direction of movement
    const isTopHalf = scrollPercent < 0.5;
    
    if (isTopHalf) {
        // In top half - show down arrow (will go to footer)
        scrollButton.innerHTML = '<i class="fas fa-chevron-down"></i>';
        scrollButton.title = 'Go to footer';
    } else {
        // In bottom half - show up arrow (will go to top)
        scrollButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
        scrollButton.title = 'Go to top';
    }
}

function handleScrollButtonClick() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = scrollTop / documentHeight;
    
    // Smart navigation: top half goes to footer, bottom half goes to hero
    if (scrollPercent < 0.5) {
        // In top half - navigate to footer
        const footer = document.querySelector('#contact, footer, .footer-section');
        if (footer) {
            footer.scrollIntoView({ behavior: 'smooth' });
        } else {
            // Fallback: scroll to bottom
            window.scrollTo({ top: documentHeight, behavior: 'smooth' });
        }
    } else {
        // In bottom half - navigate to hero/top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function scrollToTop() {
    handleScrollButtonClick();
}

// Responsive circle adjustment
function adjustProgressCircleForMobile() {
    if (window.innerWidth <= 768) {
        circleRadius = 20;
        circumference = 2 * Math.PI * circleRadius;
        if (progressCircle) {
            progressCircle.style.strokeDasharray = circumference;
            updateScrollProgress();
        }
    } else {
        circleRadius = 25;
        circumference = 2 * Math.PI * circleRadius;
        if (progressCircle) {
            progressCircle.style.strokeDasharray = circumference;
            updateScrollProgress();
        }
    }
}

// Add resize listener
window.addEventListener('resize', adjustProgressCircleForMobile);

// Make functions globally available
window.initScrollProgress = initScrollProgress;
window.scrollToTop = handleScrollButtonClick;
