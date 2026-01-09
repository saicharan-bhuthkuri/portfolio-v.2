document.addEventListener('DOMContentLoaded', () => {

    // Mobile Menu Logic
    const hamburger = document.querySelector('.hamburger-menu');
    const mobileNav = document.querySelector('.mobile-nav-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-list a');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            mobileNav.classList.toggle('active');

            // Toggle hamburger icon animation (simple scale for now)
            hamburger.style.transform = mobileNav.classList.contains('active') ? 'scale(0.9)' : 'scale(1)';
        });
    }

    // Close mobile menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
        });
    });

    // Header Scroll Shadow
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

    // Smooth Scroll (Polyfill support for older browsers optional, mainly modern behavior here)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adjust for fixed header
                const headerOffset = 85;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
    // Toast Notification Helper
    function showToast(message, type = 'success') {
        // Remove existing toasts
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) existingToast.remove();

        // Create elements
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;

        const icon = document.createElement('i');
        icon.className = type === 'success' ? 'fas fa-check-circle toast-icon' : 'fas fa-exclamation-circle toast-icon';

        const text = document.createElement('span');
        text.innerText = message;

        toast.appendChild(icon);
        toast.appendChild(text);
        document.body.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('active'), 10);

        // Remove after 3s
        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    // Contact Form Submission
    const contactForm = document.querySelector('#contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';

            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message')
            };

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    showToast('Message sent successfully!', 'success');
                    contactForm.reset();
                } else {
                    const result = await response.json();
                    showToast('Failed to send: ' + (result.error || 'Error'), 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showToast('Something went wrong. Please try again.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }
});
