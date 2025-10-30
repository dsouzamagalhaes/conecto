// Perfil Organizador JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializePerfilOrganizador();
});

// Garantir que a função esteja disponível globalmente
window.createEvent = function() {
    console.log('Abrindo modal de evento');
    const modal = document.getElementById('create-event-modal');
    if (modal) {
        modal.style.display = 'block';
        modal.style.zIndex = '99999';
        document.body.style.overflow = 'hidden';
        
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('evento-data');
        if (dateInput) {
            dateInput.value = today;
        }
    }
};

window.closeCreateEventModal = function() {
    const modal = document.getElementById('create-event-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};

function initializePerfilOrganizador() {
    checkAuthentication();
    initializeTabs();
    initializeForms();
    loadUserData();
    loadContratos();
}

// Check if user is authenticated
function checkAuthentication() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    console.log('Verificando autenticação...');
    console.log('Token presente:', !!token);
    console.log('Usuário:', user);
    
    if (!token || !user.id) {
        console.log('Usuário não autenticado, redirecionando...');
        showNotification('Você precisa estar logado para acessar esta página', 'error');
        setTimeout(() => {
            window.location.href = '/login';
        }, 2000);
        return false;
    }
    
    if (user.tipo !== 'organizador') {
        console.log('Usuário não é organizador');
        showNotification('Acesso permitido apenas para organizadores', 'error');
        setTimeout(() => {
            window.location.href = '/';
        }, 2000);
        return false;
    }
    
    return true;
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
    
    // Create event form
    const createEventForm = document.getElementById('create-event-form');
    if (createEventForm) {
        createEventForm.addEventListener('submit', handleCreateEventSubmission);
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
        const response = await fetch('/api/organizadores/perfil', {
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
        const response = await fetch('/api/organizadores/contato', {
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

async function handleCreateEventSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Validate required fields
    if (!data.nome || !data.descricao || !data.lugar || !data.data || !data.horario) {
        showNotification('Por favor, preencha todos os campos obrigatórios', 'error');
        return;
    }
    
    // Convert numeric fields
    data.capacidade_total = parseInt(data.capacidade_total) || 0;
    data.ingressos_venda = parseInt(data.ingressos_venda) || 0;
    data.ingressos_parceria = parseInt(data.ingressos_parceria) || 0;
    data.preco_ingresso = parseFloat(data.preco_ingresso) || 0;
    
    console.log('Dados do evento:', data);
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Criando...';
    submitButton.disabled = true;
    
    try {
        const token = localStorage.getItem('token');
        console.log('Token:', token ? 'Presente' : 'Ausente');
        
        if (!token) {
            showNotification('Você precisa estar logado para criar eventos', 'error');
            return;
        }
        
        const response = await fetch('/api/eventos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        
        console.log('Status da resposta:', response.status);
        
        if (response.ok) {
            const result = await response.json();
            console.log('Evento criado:', result);
            showNotification('Evento criado com sucesso!', 'success');
            closeCreateEventModal();
            e.target.reset();
            // Reload page to show new event
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else {
            const error = await response.json();
            console.error('Erro na resposta:', error);
            
            if (response.status === 401 || response.status === 403) {
                showNotification('Sessão expirada. Faça login novamente.', 'error');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                showNotification(error.error || 'Erro ao criar evento', 'error');
            }
        }
    } catch (error) {
        console.error('Erro de conexão:', error);
        showNotification('Erro de conexão. Verifique sua internet e tente novamente.', 'error');
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
    
    // Test API connection
    testApiConnection();
}

// Test API connection
async function testApiConnection() {
    try {
        const token = localStorage.getItem('token');
        
        // Test health endpoint
        const healthResponse = await fetch('/api/health');
        if (healthResponse.ok) {
            console.log('API health OK');
        }
        
        // Test events endpoint with auth
        if (token) {
            const testResponse = await fetch('/api/eventos/test', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (testResponse.ok) {
                const result = await testResponse.json();
                console.log('Auth test OK:', result);
            } else {
                console.log('Auth test falhou:', testResponse.status);
                const error = await testResponse.json();
                console.log('Erro:', error);
            }
        }
    } catch (error) {
        console.error('Erro de conexão com API:', error);
    }
}

// Event functions
function createEvent() {
    alert('Botão clicado! Abrindo modal...');
    console.log('Tentando abrir modal');
    
    const modal = document.getElementById('create-event-modal');
    console.log('Modal encontrado:', !!modal);
    
    if (modal) {
        modal.style.display = 'block';
        modal.style.zIndex = '99999';
        document.body.style.overflow = 'hidden';
        
        // Set default date
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('evento-data');
        if (dateInput) {
            dateInput.value = today;
        }
        
        console.log('Modal deveria estar visível agora');
    } else {
        alert('Modal não encontrado!');
    }
}

function closeCreateEventModal() {
    const modal = document.getElementById('create-event-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function editEvent(eventId) {
    showNotification('Funcionalidade de edição de evento em desenvolvimento!', 'info');
}

function manageEvent(eventId) {
    showNotification('Funcionalidade de gerenciamento de evento em desenvolvimento!', 'info');
}

// Avatar functions
function editAvatar() {
    showNotification('Funcionalidade de edição de avatar em desenvolvimento!', 'info');
}

// Test functions
async function testConnection() {
    try {
        showNotification('Testando conexão...', 'info');
        const response = await fetch('/api/health');
        if (response.ok) {
            const result = await response.json();
            showNotification('Conexão OK: ' + result.message, 'success');
        } else {
            showNotification('Conexão falhou: ' + response.status, 'error');
        }
    } catch (error) {
        showNotification('Erro de conexão: ' + error.message, 'error');
    }
}

async function testAuth() {
    try {
        showNotification('Testando autenticação...', 'info');
        const token = localStorage.getItem('token');
        
        if (!token) {
            showNotification('Token não encontrado', 'error');
            return;
        }
        
        const response = await fetch('/api/eventos/test', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            showNotification('Autenticação OK - Tipo: ' + result.user.tipo, 'success');
            console.log('Dados do usuário:', result.user);
        } else {
            const error = await response.json();
            showNotification('Autenticação falhou: ' + error.error, 'error');
        }
    } catch (error) {
        showNotification('Erro no teste: ' + error.message, 'error');
    }
}

// Account functions
function deleteAccount() {
    if (confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
        showNotification('Funcionalidade de exclusão de conta em desenvolvimento!', 'info');
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('create-event-modal');
    if (event.target === modal) {
        closeCreateEventModal();
    }
});

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

// Load contratos
async function loadContratos() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const response = await fetch('/api/contratacoes/organizador', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const contratos = await response.json();
            displayContratos(contratos);
        }
    } catch (error) {
        console.error('Erro ao carregar contratos:', error);
    }
}

function displayContratos(contratos) {
    const contratosList = document.querySelector('.contratos-list');
    
    if (contratos.length === 0) {
        contratosList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-handshake"></i>
                <h4>Nenhum contrato ativo</h4>
                <p>Quando você contratar artistas, os contratos aparecerão aqui</p>
            </div>
        `;
        return;
    }
    
    const contratosHtml = contratos.map(contrato => `
        <div class="contrato-card" data-status="${contrato.status}">
            <div class="contrato-header">
                <div class="contrato-info">
                    <h4>${contrato.artista_nome}</h4>
                    <span class="contrato-status ${contrato.status}">${getStatusText(contrato.status)}</span>
                </div>
                <div class="contrato-date">
                    <i class="fas fa-calendar"></i>
                    ${new Date(contrato.data_evento).toLocaleDateString('pt-BR')}
                </div>
            </div>
            <div class="contrato-details">
                <div class="detail-item">
                    <i class="fas fa-clock"></i>
                    <span>${contrato.horario}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${contrato.local}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-users"></i>
                    <span>${contrato.publico_esperado}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-hourglass-half"></i>
                    <span>${contrato.duracao}h</span>
                </div>
            </div>
            <div class="contrato-contact">
                <p><strong>Contato:</strong> ${contrato.nome_contato}</p>
                <p><strong>Email:</strong> ${contrato.email_contato}</p>
                <p><strong>Telefone:</strong> ${contrato.telefone_contato}</p>
            </div>
            ${contrato.observacoes ? `<div class="contrato-notes"><p><strong>Observações:</strong> ${contrato.observacoes}</p></div>` : ''}
            <div class="contrato-actions">
                <button class="btn btn-small btn-secondary" onclick="viewContrato(${contrato.id})">
                    <i class="fas fa-eye"></i> Ver Detalhes
                </button>
            </div>
        </div>
    `).join('');
    
    contratosList.innerHTML = contratosHtml;
    
    // Initialize filter buttons
    initializeContratosFilter();
}

function getStatusText(status) {
    const statusMap = {
        'pendente': 'Pendente',
        'confirmado': 'Confirmado',
        'finalizado': 'Finalizado',
        'cancelado': 'Cancelado'
    };
    return statusMap[status] || status;
}

function initializeContratosFilter() {
    const filterButtons = document.querySelectorAll('.contratos-filter .filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter contracts
            filterContratos(filter);
        });
    });
}

function filterContratos(filter) {
    const contratoCards = document.querySelectorAll('.contrato-card');
    
    contratoCards.forEach(card => {
        const status = card.getAttribute('data-status');
        const shouldShow = filter === 'all' || status === filter;
        
        card.style.display = shouldShow ? 'block' : 'none';
    });
}

async function viewContrato(contratoId) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            showNotification('Você precisa estar logado', 'error');
            return;
        }
        
        const response = await fetch(`/api/contratacoes/${contratoId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const contrato = await response.json();
            openContratoModal(contrato);
        } else {
            showNotification('Erro ao carregar detalhes do contrato', 'error');
        }
    } catch (error) {
        showNotification('Erro de conexão', 'error');
    }
}

function openContratoModal(contrato) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'contrato-details-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Detalhes do Contrato</h2>
                <span class="modal-close" onclick="closeContratoModal()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="contrato-details-full">
                    <div class="detail-section">
                        <h3><i class="fas fa-user"></i> Artista</h3>
                        <p class="detail-value">${contrato.artista_nome}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h3><i class="fas fa-info-circle"></i> Status</h3>
                        <span class="contrato-status ${contrato.status}">${getStatusText(contrato.status)}</span>
                    </div>
                    
                    <div class="detail-row">
                        <div class="detail-section">
                            <h3><i class="fas fa-calendar"></i> Data</h3>
                            <p class="detail-value">${new Date(contrato.data_evento).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <div class="detail-section">
                            <h3><i class="fas fa-clock"></i> Horário</h3>
                            <p class="detail-value">${contrato.horario}</p>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h3><i class="fas fa-map-marker-alt"></i> Local</h3>
                        <p class="detail-value">${contrato.local}</p>
                    </div>
                    
                    <div class="detail-row">
                        <div class="detail-section">
                            <h3><i class="fas fa-users"></i> Público Esperado</h3>
                            <p class="detail-value">${contrato.publico_esperado}</p>
                        </div>
                        <div class="detail-section">
                            <h3><i class="fas fa-hourglass-half"></i> Duração</h3>
                            <p class="detail-value">${contrato.duracao}h</p>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h3><i class="fas fa-address-book"></i> Informações de Contato</h3>
                        <div class="contact-details">
                            <p><strong>Nome:</strong> ${contrato.nome_contato}</p>
                            <p><strong>Email:</strong> ${contrato.email_contato}</p>
                            <p><strong>Telefone:</strong> ${contrato.telefone_contato}</p>
                        </div>
                    </div>
                    
                    ${contrato.observacoes ? `
                        <div class="detail-section">
                            <h3><i class="fas fa-sticky-note"></i> Observações</h3>
                            <p class="detail-value">${contrato.observacoes}</p>
                        </div>
                    ` : ''}
                    
                    <div class="detail-section">
                        <h3><i class="fas fa-calendar-plus"></i> Solicitado em</h3>
                        <p class="detail-value">${new Date(contrato.created_at).toLocaleString('pt-BR')}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeContratoModal();
        }
    });
}

function closeContratoModal() {
    const modal = document.getElementById('contrato-details-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}