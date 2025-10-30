// Login Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeLoginPage();
});

function initializeLoginPage() {
    initializeLoginForm();
    initializeFloatingLabels();
    initializeSocialLogin();
}

// Login Form
function initializeLoginForm() {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmission);
    }
}

async function handleLoginSubmission(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Basic validation
    if (!email || !password) {
        showNotification('Por favor, preencha todos os campos.', 'error');
        return;
    }
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
    submitButton.disabled = true;
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha: password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Store token
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Also store in cookie for server-side authentication
            document.cookie = `token=${data.token}; path=/; max-age=86400`;
            
            showNotification('Login realizado com sucesso! Redirecionando...', 'success');
            
            setTimeout(() => {
                // Redirect based on user type
                if (data.user.tipo === 'artista') {
                    window.location.href = '/perfil-artista';
                } else if (data.user.tipo === 'organizador') {
                    window.location.href = '/perfil-organizador';
                } else {
                    window.location.href = '/';
                }
            }, 1500);
        } else {
            showNotification(data.error || 'Erro ao fazer login', 'error');
        }
    } catch (error) {
        showNotification('Erro de conexão. Tente novamente.', 'error');
    } finally {
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

// Floating Labels
function initializeFloatingLabels() {
    const formInputs = document.querySelectorAll('.form-group input');
    
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
    });
}

// Social Login
function initializeSocialLogin() {
    console.log('Inicializando login social...');
    
    const googleBtn = document.querySelector('.google-btn');
    const facebookBtn = document.querySelector('.facebook-btn');
    
    console.log('Botões encontrados:', { google: !!googleBtn, facebook: !!facebookBtn });
    
    if (googleBtn) {
        googleBtn.addEventListener('click', handleGoogleLogin);
        console.log('Event listener adicionado ao botão Google');
    }
    
    if (facebookBtn) {
        facebookBtn.addEventListener('click', handleFacebookLogin);
        console.log('Event listener adicionado ao botão Facebook');
    }
}

function handleGoogleLogin(e) {
    e.preventDefault();
    console.log('Botão Google clicado');
    openSocialDataModal('google');
}

function handleFacebookLogin(e) {
    e.preventDefault();
    console.log('Botão Facebook clicado');
    openSocialDataModal('facebook');
}

function openSocialDataModal(provider) {
    console.log('Abrindo modal para provider:', provider);
    
    // Remover modal existente se houver
    const existingModal = document.getElementById('social-data-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'social-data-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Complete seus dados - ${provider === 'google' ? 'Google' : 'Facebook'}</h2>
                <span class="modal-close">&times;</span>
            </div>
            <div class="modal-body">
                <form id="social-data-form">
                    <div class="form-group">
                        <input type="email" id="social-email" name="email" placeholder="Seu email" required>
                        <i class="fas fa-envelope form-icon"></i>
                    </div>
                    <div class="form-group">
                        <input type="text" id="social-nome" name="nome" placeholder="Seu nome completo" required>
                        <i class="fas fa-user form-icon"></i>
                    </div>
                    <div class="form-group">
                        <select id="social-tipo" name="tipo" required>
                            <option value="">Selecione o tipo de conta</option>
                            <option value="organizador">Organizador de Eventos</option>
                            <option value="artista">Artista</option>
                        </select>
                        <i class="fas fa-users form-icon"></i>
                    </div>
                    <button type="submit" class="btn btn-primary btn-full">
                        <i class="fab fa-${provider}"></i> Continuar com ${provider === 'google' ? 'Google' : 'Facebook'}
                    </button>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    console.log('Modal adicionado ao DOM');
    
    // Forçar o display
    modal.style.display = 'flex';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.zIndex = '10000';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    
    document.body.style.overflow = 'hidden';
    
    console.log('Modal deve estar visível agora');
    
    // Handle close button
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', closeSocialDataModal);
    
    // Handle form submission
    const form = document.getElementById('social-data-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('social-email').value.trim();
        const nome = document.getElementById('social-nome').value.trim();
        const tipo = document.getElementById('social-tipo').value;
        
        console.log('Dados do formulário:', { email, nome, tipo });
        
        // Validação
        if (!email || !nome || !tipo) {
            showNotification('Por favor, preencha todos os campos.', 'error');
            return;
        }
        
        if (!email.includes('@')) {
            showNotification('Por favor, insira um email válido.', 'error');
            return;
        }
        
        const userData = {
            email: email,
            nome: nome,
            tipo: tipo,
            provider: provider,
            providerId: provider + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
        };
        
        console.log('Dados do usuário para envio:', userData);
        
        closeSocialDataModal();
        processSocialLogin(userData);
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeSocialDataModal();
        }
    });
    
    // Focus no primeiro campo
    setTimeout(() => {
        const emailInput = document.getElementById('social-email');
        if (emailInput) {
            emailInput.focus();
        }
    }, 200);
}

function closeSocialDataModal() {
    console.log('Fechando modal social');
    const modal = document.getElementById('social-data-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
        console.log('Modal removido');
    } else {
        console.log('Modal não encontrado para fechar');
    }
}

async function processSocialLogin(userData) {
    try {
        showNotification('Processando login social...', 'info');
        
        console.log('Enviando dados para login social:', userData);
        
        const response = await fetch('/api/auth/social-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        console.log('Resposta do servidor:', response.status);
        
        const data = await response.json();
        console.log('Dados da resposta:', data);
        
        if (response.ok) {
            // Store token
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Also store in cookie for server-side authentication
            document.cookie = `token=${data.token}; path=/; max-age=86400`;
            
            showNotification(`Login com ${userData.provider} realizado com sucesso!`, 'success');
            
            setTimeout(() => {
                // Redirect based on user type
                if (data.user.tipo === 'artista') {
                    window.location.href = '/perfil-artista';
                } else if (data.user.tipo === 'organizador') {
                    window.location.href = '/perfil-organizador';
                } else {
                    window.location.href = '/';
                }
            }, 1500);
        } else {
            console.error('Erro na resposta:', data);
            showNotification(data.error || 'Erro no login social', 'error');
        }
    } catch (error) {
        console.error('Erro no login social:', error);
        showNotification('Erro de conexão no login social. Verifique sua internet.', 'error');
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