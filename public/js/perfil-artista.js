// Perfil Artista JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializePerfilArtista();
});

function initializePerfilArtista() {
    initializeTabs();
    initializeForms();
    loadUserData();
    loadCandidaturas();
}

// Tab System
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            button.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
}

// Forms
function initializeForms() {
    // About form
    const aboutForm = document.getElementById('about-form');
    if (aboutForm) {
        aboutForm.addEventListener('submit', handleAboutSubmission);
    }
    
    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmission);
    }
    
    // Settings form
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', handleSettingsSubmission);
    }
}

async function handleAboutSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';
    submitButton.disabled = true;
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/artistas/perfil', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showNotification('Informações salvas com sucesso!', 'success');
        } else {
            const error = await response.json();
            showNotification(error.error || 'Erro ao salvar informações', 'error');
        }
    } catch (error) {
        showNotification('Erro de conexão. Tente novamente.', 'error');
    } finally {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

async function handleContactSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';
    submitButton.disabled = true;
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/artistas/contato', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showNotification('Informações de contato salvas com sucesso!', 'success');
        } else {
            const error = await response.json();
            showNotification(error.error || 'Erro ao salvar contato', 'error');
        }
    } catch (error) {
        showNotification('Erro de conexão. Tente novamente.', 'error');
    } finally {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

async function handleSettingsSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Validate passwords
    if (data['nova-senha'] && data['nova-senha'] !== data['confirmar-senha']) {
        showNotification('As senhas não coincidem.', 'error');
        return;
    }
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';
    submitButton.disabled = true;
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/auth/perfil', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                nome: data.nome,
                senha: data['nova-senha'] || undefined
            })
        });
        
        if (response.ok) {
            showNotification('Configurações salvas com sucesso!', 'success');
            // Clear password fields
            document.getElementById('nova-senha').value = '';
            document.getElementById('confirmar-senha').value = '';
        } else {
            const error = await response.json();
            showNotification(error.error || 'Erro ao salvar configurações', 'error');
        }
    } catch (error) {
        showNotification('Erro de conexão. Tente novamente.', 'error');
    } finally {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

// Load user data
function loadUserData() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Update profile info if needed
    if (user.nome) {
        const profileName = document.querySelector('.profile-name');
        if (profileName) {
            profileName.textContent = user.nome;
        }
    }
}

// Portfolio functions
function addPortfolioItem() {
    showNotification('Funcionalidade de portfólio em desenvolvimento!', 'info');
}

// Avatar functions
function editAvatar() {
    showNotification('Funcionalidade de edição de avatar em desenvolvimento!', 'info');
}

// Account functions
function deleteAccount() {
    if (confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
        showNotification('Funcionalidade de exclusão de conta em desenvolvimento!', 'info');
    }
}

// Notification system
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

// Load candidaturas
function loadCandidaturas() {
    const candidaturas = JSON.parse(localStorage.getItem('candidaturas') || '[]');
    const candidaturasList = document.getElementById('candidaturas-list');
    const emptyCandidaturas = document.getElementById('empty-candidaturas');
    
    if (candidaturas.length === 0) {
        emptyCandidaturas.style.display = 'block';
        return;
    }
    
    emptyCandidaturas.style.display = 'none';
    
    const candidaturasHtml = candidaturas.map(candidatura => `
        <div class="evento-card">
            <div class="evento-header">
                <h4>${candidatura.eventoNome}</h4>
                <div class="evento-status pending">${candidatura.status}</div>
            </div>
            <p class="evento-description">${candidatura.mensagem}</p>
            <div class="evento-details">
                <span><i class="fas fa-money-bill-wave"></i> R$ ${candidatura.preco}</span>
                <span><i class="fas fa-calendar"></i> ${new Date(candidatura.data).toLocaleDateString('pt-BR')}</span>
            </div>
            <div class="evento-actions">
                <button class="btn btn-small btn-secondary" onclick="verCandidatura('${candidatura.id}')">
                    <i class="fas fa-eye"></i> Ver Detalhes
                </button>
                <button class="btn btn-small btn-danger" onclick="cancelarCandidatura('${candidatura.id}')">
                    <i class="fas fa-times"></i> Cancelar
                </button>
            </div>
        </div>
    `).join('');
    
    candidaturasList.innerHTML = candidaturasHtml;
}

function verCandidatura(candidaturaId) {
    const candidaturas = JSON.parse(localStorage.getItem('candidaturas') || '[]');
    const candidatura = candidaturas.find(c => c.id == candidaturaId);
    
    if (candidatura) {
        alert(`Evento: ${candidatura.eventoNome}\nCachê: R$ ${candidatura.preco}\nMensagem: ${candidatura.mensagem}\nStatus: ${candidatura.status}`);
    }
}

function cancelarCandidatura(candidaturaId) {
    if (confirm('Tem certeza que deseja cancelar esta candidatura?')) {
        let candidaturas = JSON.parse(localStorage.getItem('candidaturas') || '[]');
        candidaturas = candidaturas.filter(c => c.id != candidaturaId);
        localStorage.setItem('candidaturas', JSON.stringify(candidaturas));
        loadCandidaturas();
        showNotification('Candidatura cancelada com sucesso!', 'success');
    }
}