// Global variables
let isLoading = false;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Initialize Website
function initializeWebsite() {
    // Clear any invalid auth data on homepage
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        clearInvalidAuth();
    }
    
    initializeNavigation();
    initializeContactForm();
    initializeSmoothScrolling();
    updateNavigation();
}

// Clear invalid authentication data
function clearInvalidAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    // If there's fake/test data, clear it
    if (token === 'fake-token-for-testing' || (user && user.includes('teste'))) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    }
}

// Navigation
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect for navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Contact Form
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    // Only initialize if we're on the homepage and form exists
    if (!contactForm || !window.location.pathname.includes('index') && window.location.pathname !== '/') {
        return;
    }
    
    const formInputs = contactForm.querySelectorAll('input, textarea');
    
    // Add floating label effects
    formInputs.forEach(input => {
        // Handle focus and blur events
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
    });
    
    // Form submission only for homepage contact form
    contactForm.addEventListener('submit', handleFormSubmission);
}

function handleFormSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<span>Enviando...</span>';
    submitButton.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        
        // Reset form
        e.target.reset();
        
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }, 2000);
}

// Update navigation based on login status
function updateNavigation() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const token = localStorage.getItem('token');
    
    const perfilLink = document.getElementById('perfil-link');
    const loginLink = document.getElementById('login-link');
    const logoutBtn = document.getElementById('logout-btn');
    const oportunidadesLink = document.querySelector('a[href="/eventos-artista"]');
    
    if (user && token) {
        // User is logged in
        if (perfilLink) {
            perfilLink.style.display = 'block';
            perfilLink.textContent = 'Meu Perfil';
            perfilLink.href = user.tipo === 'artista' ? '/perfil-artista' : '/perfil-organizador';
        }
        if (loginLink) loginLink.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'block';
        
        // Show/hide opportunities link based on user type
        if (oportunidadesLink) {
            oportunidadesLink.style.display = user.tipo === 'artista' ? 'block' : 'none';
        }
    } else {
        // User is not logged in
        if (perfilLink) perfilLink.style.display = 'none';
        if (loginLink) loginLink.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (oportunidadesLink) oportunidadesLink.style.display = 'none';
    }
    
    // Handle logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    window.location.href = '/login';
}

// Clear all auth data (for debugging)
function clearAuthData() {
    localStorage.clear();
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    console.log('Auth data cleared');
    window.location.reload();
}