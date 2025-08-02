// Email Service for Portfolio Contact Form
// Uses EmailJS to send emails directly from the client

class EmailService {
    constructor() {
        this.initialized = false;
        this.publicKey = "kQz7Oxc-bjkHroN9e"; // Replace with your correct EmailJS public key (starts with user_)
        this.serviceId = "service_portfolioGmail"; // Replace with your NEW service ID if you created a new one
        this.templateId = "template_portfolio"; // Replace with your EmailJS template ID
    }

    // Initialize EmailJS
    async init() {
        try {
            if (typeof emailjs !== 'undefined') {
                emailjs.init(this.publicKey);
                this.initialized = true;
                console.log('EmailJS initialized successfully');
                return true;
            } else {
                console.error('EmailJS library not loaded');
                return false;
            }
        } catch (error) {
            console.error('Failed to initialize EmailJS:', error);
            return false;
        }
    }

    // Send email using EmailJS
    async sendEmail(formData) {
        try {
            console.log('=== EMAIL SEND ATTEMPT ===');
            console.log('Form data received:', formData);
            
            if (!this.initialized) {
                console.log('EmailJS not initialized, initializing now...');
                const initResult = await this.init();
                if (!initResult) {
                    throw new Error('EmailJS initialization failed');
                }
            }

            const templateParams = {
                from_name: formData.name,
                from_email: formData.email,
                message: formData.message,
                to_email: 'panosqwe632@gmail.com',
                reply_to: formData.email
            };

            console.log('Template params:', templateParams);
            console.log('Using Service ID:', this.serviceId);
            console.log('Using Template ID:', this.templateId);

            const response = await emailjs.send(
                this.serviceId,
                this.templateId,
                templateParams
            );

            console.log('✅ Email sent successfully:', response);
            return {
                Success: true,
                Message: 'Email sent successfully!'
            };

        } catch (error) {
            console.error('❌ Failed to send email:', error);
            return {
                Success: false,
                Message: `Failed to send email: ${error.message}`
            };
        }
    }
}

// Create global instance
window.emailService = new EmailService();

// Global function for Blazor to call
window.sendContactEmail = async function(formData) {
    try {
        const result = await window.emailService.sendEmail(formData);
        console.log('📤 Returning result to Blazor:', result);
        const jsonResult = JSON.stringify(result);
        console.log('📤 JSON result:', jsonResult);
        return jsonResult;
    } catch (error) {
        console.error('Error in sendContactEmail:', error);
        const errorResult = JSON.stringify({
            Success: false,
            Message: 'An unexpected error occurred.'
        });
        console.log('📤 Returning error result to Blazor:', errorResult);
        return errorResult;
    }
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (window.emailService) {
        window.emailService.init();
    }
});
