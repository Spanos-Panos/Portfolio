// Skills Progress Animation
document.addEventListener('DOMContentLoaded', function() {
    // Wait for elements to be available
    setTimeout(initSkillsAnimation, 1000);
});

function initSkillsAnimation() {
    const skillCards = document.querySelectorAll('.skill-card');
    console.log('Found skill cards:', skillCards.length);
    
    if (skillCards.length === 0) {
        console.warn('No skill cards found, retrying...');
        setTimeout(initSkillsAnimation, 1000);
        return;
    }
    
    // Initialize progress bars to 0 width
    skillCards.forEach(card => {
        const progressBar = card.querySelector('.skill-progress');
        if (progressBar) {
            progressBar.style.width = '0%';
        }
    });
    
    // Intersection Observer for skill progress animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -20px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillCard = entry.target;
                const progressBar = skillCard.querySelector('.skill-progress');
                
                if (progressBar && !progressBar.classList.contains('animated')) {
                    const targetWidth = progressBar.getAttribute('data-width');
                    console.log('Animating progress bar to:', targetWidth + '%');
                    
                    // Add a small delay for visual effect
                    setTimeout(() => {
                        progressBar.style.width = targetWidth + '%';
                        progressBar.classList.add('animated');
                    }, Math.random() * 300 + 100);
                }
            }
        });
    }, observerOptions);
    
    // Observe all skill cards
    skillCards.forEach(card => {
        observer.observe(card);
    });
    
    // Fallback: Force animation after delay if intersection observer doesn't work
    setTimeout(() => {
        console.log('Fallback animation triggered');
        skillCards.forEach((card, index) => {
            const progressBar = card.querySelector('.skill-progress');
            if (progressBar && !progressBar.classList.contains('animated')) {
                const targetWidth = progressBar.getAttribute('data-width');
                setTimeout(() => {
                    progressBar.style.width = targetWidth + '%';
                    progressBar.classList.add('animated');
                }, index * 200);
            }
        });
    }, 5000);
}

// Manual trigger function for testing
function triggerSkillsAnimation() {
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach((card, index) => {
        const progressBar = card.querySelector('.skill-progress');
        if (progressBar) {
            const targetWidth = progressBar.getAttribute('data-width');
            setTimeout(() => {
                progressBar.style.width = targetWidth + '%';
                progressBar.classList.add('animated');
            }, index * 200);
        }
    });
}

// Make function globally available for testing
window.triggerSkillsAnimation = triggerSkillsAnimation;
