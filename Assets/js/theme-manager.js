// Advanced Theme Manager - Light/Dark Mode with Purple Theme Variations
class ThemeManager {
    constructor() {
        this.currentTheme = 'dark'; // Default to dark mode
        this.init();
    }

    init() {
        // Check for saved theme preference or default to dark
        const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
        this.setTheme(savedTheme);
        
        // Add theme toggle button functionality
        this.addThemeToggleListener();
        
        // Listen for system theme changes
        this.watchSystemTheme();
        
        console.log('Theme Manager initialized with theme:', savedTheme);
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio-theme', theme);
        
        // Update toggle button state
        this.updateToggleButton();
        
        // Trigger custom event for components that need to react
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: theme } 
        }));
        
        console.log('Theme set to:', theme);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('portfolio-theme-manual', 'true'); // Mark as manually set
        
        // Add animation class
        const toggleBtn = document.querySelector('.theme-toggle-btn');
        if (toggleBtn) {
            toggleBtn.classList.add('switching');
            setTimeout(() => {
                toggleBtn.classList.remove('switching');
            }, 600);
        }
        
        this.setTheme(newTheme);
    }

    addThemeToggleListener() {
        // Add click listener to theme toggle button
        document.addEventListener('click', (e) => {
            if (e.target.closest('.theme-toggle-btn')) {
                this.toggleTheme();
            }
        });
    }

    createThemeToggle() {
        // Wait for navbar to be available
        const checkNavbar = () => {
            const navbar = document.querySelector('.navbar-nav');
            if (navbar) {
                this.insertThemeToggle(navbar);
            } else {
                setTimeout(checkNavbar, 100);
            }
        };
        checkNavbar();
    }

    insertThemeToggle(navbar) {
        // Create theme toggle button
        const toggleContainer = document.createElement('li');
        toggleContainer.className = 'nav-item theme-toggle-container';
        
        const toggleButton = document.createElement('button');
        toggleButton.className = 'theme-toggle-btn';
        toggleButton.setAttribute('aria-label', 'Toggle theme');
        toggleButton.innerHTML = `
            <div class="theme-toggle-inner">
                <span class="theme-icon theme-icon-sun">☀️</span>
                <span class="theme-icon theme-icon-moon">🌙</span>
            </div>
        `;
        
        toggleButton.addEventListener('click', () => this.toggleTheme());
        toggleContainer.appendChild(toggleButton);
        
        // Insert before the last nav item (usually contact)
        const lastItem = navbar.lastElementChild;
        navbar.insertBefore(toggleContainer, lastItem);
    }

    updateToggleButton() {
        const toggleBtn = document.querySelector('.theme-toggle-btn');
        if (toggleBtn) {
            toggleBtn.setAttribute('data-theme', this.currentTheme);
        }
    }

    watchSystemTheme() {
        // Optional: React to system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                // Only auto-switch if user hasn't manually set a preference
                if (!localStorage.getItem('portfolio-theme-manual')) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }

    // Method to manually override system theme
    setManualTheme(theme) {
        localStorage.setItem('portfolio-theme-manual', 'true');
        this.setTheme(theme);
    }
}

// Smooth theme transition helper
function enableThemeTransition() {
    const css = `
        * {
            transition: background-color 0.3s ease, 
                       color 0.3s ease, 
                       border-color 0.3s ease,
                       box-shadow 0.3s ease !important;
        }
    `;
    const style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);
    
    // Remove transition after theme change is complete
    setTimeout(() => {
        document.head.removeChild(style);
    }, 300);
}

// Initialize theme manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});

// Export for global access
window.ThemeManager = ThemeManager;
