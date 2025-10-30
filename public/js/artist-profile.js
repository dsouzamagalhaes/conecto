// Artist Profile Page JavaScript

let currentArtist = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeArtistProfile();
});

function initializeArtistProfile() {
    // Get artist data from page
    const artistName = document.querySelector('.artist-title')?.textContent;
    const artistDescription = document.querySelector('.artist-subtitle')?.textContent;
    
    // Extract artist ID from URL
    const urlParts = window.location.pathname.split('/');
    const artistId = urlParts[urlParts.length - 1];
    
    currentArtist = {
        id: artistId,
        name: artistName,
        description: artistDescription
    };
    
    initializeBookingModal();
    initializeFavoriteButton();
    updateNavigation();
}

function initializeBookingModal() {
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmission);
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('booking-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeBookingModal();
            }
        });
    }
}

function initializeFavoriteButton() {
    const favoriteBtn = document.querySelector('.artist-actions-hero .btn-secondary');
    if (favoriteBtn && currentArtist) {
        favoriteBtn.addEventListener('click', () => toggleFavorite(currentArtist.id, favoriteBtn));
        
        // Check if already favorited
        checkFavoriteStatus(currentArtist.id, favoriteBtn);
    }
}

function openBookingModal(artistName) {
    const modal = document.getElementById('booking-modal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Set today as default date
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('event-date');
        if (dateInput) {
            dateInput.value = today;
        }
    }
}

function closeBookingModal() {
    const modal = document.getElementById('booking-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Reset form
        const form = document.getElementById('booking-form');
        if (form) {
            form.reset();
        }
    }
}

async function handleBookingSubmission(e) {
    e.preventDefault();
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitButton.disabled = true;
    
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            showNotification('Você precisa estar logado para contratar artistas', 'error');
            return;
        }
        
        const formData = new FormData(e.target);
        const data = {
            artistaId: currentArtist.id,
            data: formData.get('event-date'),
            horario: formData.get('event-time'),
            local: formData.get('event-location'),
            duracao: formData.get('event-duration'),
            publico: formData.get('expected-audience'),
            nome: formData.get('contact-name'),
            email: formData.get('contact-email'),
            telefone: formData.get('contact-phone'),
            observacoes: formData.get('special-requirements')
        };
        
        const response = await fetch('/api/contratacoes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showNotification('Solicitação de contratação enviada com sucesso!', 'success');
            closeBookingModal();
        } else {
            const error = await response.json();
            showNotification(error.error || 'Erro ao enviar solicitação', 'error');
        }
    } catch (error) {
        showNotification('Erro de conexão. Tente novamente.', 'error');
    } finally {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

async function toggleFavorite(artistId, button) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            showNotification('Você precisa estar logado para favoritar artistas', 'error');
            return;
        }
        
        const response = await fetch(`/api/favoritos/${artistId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            const icon = button.querySelector('i');
            
            if (result.favoritado) {
                icon.className = 'fas fa-heart';
                button.classList.add('favorited');
            } else {
                icon.className = 'far fa-heart';
                button.classList.remove('favorited');
            }
            
            showNotification(result.message, 'success');
        } else {
            const error = await response.json();
            showNotification(error.error || 'Erro ao processar favorito', 'error');
        }
    } catch (error) {
        showNotification('Erro de conexão. Tente novamente.', 'error');
    }
}

async function checkFavoriteStatus(artistId, button) {
    try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const response = await fetch(`/api/favoritos/${artistId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            const icon = button.querySelector('i');
            
            if (result.favoritado) {
                icon.className = 'fas fa-heart';
                button.classList.add('favorited');
            } else {
                icon.className = 'far fa-heart';
                button.classList.remove('favorited');
            }
        }
    } catch (error) {
        console.log('Erro ao verificar status do favorito');
    }
}

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