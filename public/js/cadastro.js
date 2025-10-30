// Cadastro Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeCadastroPage();
});

function initializeCadastroPage() {
    initializeCadastroForm();
    initializeFloatingLabels();
    initializeSocialSignup();
    initializePasswordValidation();
}

// Cadastro Form
function initializeCadastroForm() {
    const cadastroForm = document.getElementById('signup-form');
    
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', handleCadastroSubmission);
    }
}

async function handleCadastroSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Validation
    if (!validateForm(data)) {
        return;
    }
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Criando conta...';
    submitButton.disabled = true;
    
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: data.email,
                senha: data.password,
                tipo: data.tipo,
                nome: data.nome,
                descricao: ''
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showNotification('Conta criada com sucesso! Redirecionando...', 'success');
            
            // Reset form
            e.target.reset();
            
            // Redirect to login after success
            setTimeout(() => {
                window.location.href = '/login';
            }, 1500);
        } else {
            showNotification(result.error || 'Erro ao criar conta', 'error');
        }
    } catch (error) {
        showNotification('Erro de conexão. Tente novamente.', 'error');
    } finally {
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

function validateForm(data) {
    // Check required fields
    if (!data.nome || !data.email || !data.telefone || !data.tipo || !data.password) {
        showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
        return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification('Por favor, insira um email válido.', 'error');
        return false;
    }
    
    // Password validation
    if (data.password.length < 6) {
        showNotification('A senha deve ter pelo menos 6 caracteres.', 'error');
        return false;
    }
    
    // Confirm password
    if (data.password !== data['confirm-password']) {
        showNotification('As senhas não coincidem.', 'error');
        return false;
    }
    
    // Terms acceptance
    const termsCheckbox = document.getElementById('terms');
    if (!termsCheckbox.checked) {
        showNotification('Você deve aceitar os termos de uso.', 'error');
        return false;
    }
    
    return true;
}

// Password Validation
function initializePasswordValidation() {
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('blur', () => {
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            
            if (confirmPassword && password !== confirmPassword) {
                confirmPasswordInput.style.borderColor = '#ff4757';
                showNotification('As senhas não coincidem.', 'error');
            } else if (confirmPassword && password === confirmPassword) {
                confirmPasswordInput.style.borderColor = '#00ff88';
            }
        });
    }
}

// Floating Labels
function initializeFloatingLabels() {
    const formInputs = document.querySelectorAll('.form-group input, .form-group select');
    
    formInputs.forEach(input => {
        // Set initial state
        if (input.value) {
            input.parentElement.classList.add('filled');
        }
        
        // Handle focus and blur events
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
            
            if (input.value) {
                input.parentElement.classList.add('filled');
            } else {
                input.parentElement.classList.remove('filled');
            }
        });
        
        // Handle input events
        input.addEventListener('input', () => {
            if (input.value) {
                input.parentElement.classList.add('filled');
            } else {
                input.parentElement.classList.remove('filled');
            }
        });
        
        // Handle change events for select
        input.addEventListener('change', () => {
            if (input.value) {
                input.parentElement.classList.add('filled');
            } else {
                input.parentElement.classList.remove('filled');
            }
        });
    });
}

// Social Signup
function initializeSocialSignup() {
    const googleBtn = document.querySelector('.google-btn');
    const facebookBtn = document.querySelector('.facebook-btn');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            showNotification('Cadastro com Google em desenvolvimento.', 'info');
        });
    }
    
    if (facebookBtn) {
        facebookBtn.addEventListener('click', () => {
            showNotification('Cadastro com Facebook em desenvolvimento.', 'info');
        });
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: '#fff',
        fontSize: '0.9rem',
        zIndex: '10001',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease',
        maxWidth: '400px',
        wordWrap: 'break-word'
    });
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.background = 'linear-gradient(135deg, #00ff88, #00cc6a)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(135deg, #ff4757, #ff3838)';
            break;
        default:
            notification.style.background = 'linear-gradient(135deg, #00f5ff, #0099cc)';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.color = 'inherit';
    closeButton.style.marginLeft = '1rem';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '1.2rem';
    
    closeButton.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
        if (notification.parentElement) {
            notification.parentElement.removeChild(notification);
        }
    }, 300);
}