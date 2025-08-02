// Interactive Emoji Animations
document.addEventListener('DOMContentLoaded', function() {
    initEmojiAnimations();
});

function initEmojiAnimations() {
    // Add click animations to all emojis
    addEmojiClickAnimations();
    
    // Add hover animations to all emojis
    addEmojiHoverAnimations();
    
    // Add special form submission animation
    addFormSubmissionAnimation();
}

function addEmojiClickAnimations() {
    // Phone emojis - Ring animation
    const phoneEmojis = document.querySelectorAll('[href*="tel"], .social-icon:contains("📱"), .social-icon:contains("📞")');
    phoneEmojis.forEach(el => {
        const emoji = el.querySelector('.social-icon') || el;
        if (emoji.textContent.includes('📱') || emoji.textContent.includes('📞')) {
            el.addEventListener('click', function(e) {
                e.preventDefault();
                animateRing(emoji);
                // Delay the actual phone action
                setTimeout(() => {
                    if (el.href) window.open(el.href, '_self');
                }, 1000);
            });
        }
    });
    
    // Email emojis - Fly animation
    const emailEmojis = document.querySelectorAll('[href*="mailto"], .social-icon:contains("📧"), .social-icon:contains("✉️")');
    emailEmojis.forEach(el => {
        const emoji = el.querySelector('.social-icon') || el;
        if (emoji.textContent.includes('📧') || emoji.textContent.includes('✉️')) {
            el.addEventListener('click', function(e) {
                animateFly(emoji);
            });
        }
    });
    
    // Skill emojis - Bounce and glow
    const skillEmojis = document.querySelectorAll('.skill-icon, .badge-icon');
    skillEmojis.forEach(emoji => {
        emoji.addEventListener('click', function() {
            animateBounceGlow(emoji);
        });
    });
    
    // Project emojis - Pulse animation
    const projectEmojis = document.querySelectorAll('.project-icon');
    projectEmojis.forEach(emoji => {
        emoji.addEventListener('click', function() {
            animatePulse(emoji);
        });
    });
    
    // Github folder emojis - Open/close animation
    const githubEmojis = document.querySelectorAll('.btn-icon:contains("📂"), [href*="github"] .btn-icon');
    githubEmojis.forEach(emoji => {
        const parent = emoji.closest('a');
        if (parent) {
            parent.addEventListener('click', function(e) {
                e.preventDefault();
                animateFolderOpen(emoji);
                setTimeout(() => {
                    if (parent.href) window.open(parent.href, '_blank');
                }, 800);
            });
        }
    });
}

function addEmojiHoverAnimations() {
    // Add hover effects to all emojis
    const allEmojis = document.querySelectorAll('.skill-icon, .badge-icon, .project-icon, .btn-icon, .social-icon');
    allEmojis.forEach(emoji => {
        emoji.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2) rotate(10deg)';
            this.style.transition = 'all 0.3s ease';
        });
        
        emoji.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

function addFormSubmissionAnimation() {
    // Find the contact form
    const contactForm = document.querySelector('#contact-form, .contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const submitButton = this.querySelector('button[type="submit"], .submit-btn');
            if (submitButton) {
                const rocket = submitButton.querySelector('.icon, .btn-icon') || submitButton;
                animateRocketLaunch(rocket);
            }
        });
    }
}

// Animation functions
function animateRing(element) {
    element.style.animation = 'ring 1s ease-in-out';
    setTimeout(() => {
        element.style.animation = '';
    }, 1000);
}

function animateFly(element) {
    element.style.animation = 'flyAway 1.5s ease-out forwards';
    setTimeout(() => {
        element.style.animation = '';
        element.style.transform = '';
    }, 1500);
}

function animateBounceGlow(element) {
    element.style.animation = 'bounceGlow 0.8s ease-in-out';
    setTimeout(() => {
        element.style.animation = '';
    }, 800);
}

function animatePulse(element) {
    element.style.animation = 'pulse 1s ease-in-out';
    setTimeout(() => {
        element.style.animation = '';
    }, 1000);
}

function animateFolderOpen(element) {
    element.style.animation = 'folderOpen 0.8s ease-in-out';
    setTimeout(() => {
        element.style.animation = '';
    }, 800);
}

function animateRocketLaunch(element) {
    element.style.animation = 'rocketLaunch 2s ease-out forwards';
    setTimeout(() => {
        element.style.animation = '';
        element.style.transform = '';
    }, 2000);
}

// Particle effect for special animations
function createParticles(element, type = 'sparkle') {
    const rect = element.getBoundingClientRect();
    const particleCount = type === 'explosion' ? 15 : 8;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = `particle particle-${type}`;
        particle.style.position = 'fixed';
        particle.style.left = rect.left + rect.width / 2 + 'px';
        particle.style.top = rect.top + rect.height / 2 + 'px';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        
        if (type === 'sparkle') {
            particle.textContent = '✨';
        } else if (type === 'explosion') {
            particle.textContent = ['💥', '⭐', '🔥', '✨'][Math.floor(Math.random() * 4)];
        }
        
        document.body.appendChild(particle);
        
        // Animate particle
        const angle = (Math.PI * 2 * i) / particleCount;
        const distance = type === 'explosion' ? 150 : 100;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        particle.animate([
            { transform: 'translate(0, 0) scale(0)', opacity: 1 },
            { transform: `translate(${x}px, ${y}px) scale(1)`, opacity: 0 }
        ], {
            duration: 1000,
            easing: 'ease-out'
        }).onfinish = () => {
            particle.remove();
        };
    }
}

// Enhanced animation with particles
function animateWithParticles(element, animationType, particleType) {
    // Run the main animation
    switch(animationType) {
        case 'bounce':
            animateBounceGlow(element);
            break;
        case 'pulse':
            animatePulse(element);
            break;
        case 'rocket':
            animateRocketLaunch(element);
            break;
    }
    
    // Add particles
    setTimeout(() => {
        createParticles(element, particleType);
    }, animationType === 'rocket' ? 500 : 200);
}

// Make functions globally available
window.animateWithParticles = animateWithParticles;
window.createParticles = createParticles;
