document.addEventListener('DOMContentLoaded', () => {
    const navbarRight = document.querySelector('.nav-links-right');
    const dashboardAlert = document.querySelector('.dashboard-alert');
    const eligibilityForm = document.getElementById('eligibilitate-form'); 

    const API_STATUS = '/auth/status';
    const API_LOGOUT = '/logout';

    async function checkAuthStatus() {
        try {
            const response = await fetch(API_STATUS);
            const data = await response.json();
            
            if (response.ok && data.isLoggedIn) {
                return data;
            }
            return { isLoggedIn: false };

        } catch (error) {
            console.error('Eroare la verificarea stării de autentificare:', error);
            return { isLoggedIn: false };
        }
    }

    async function handleLogout() {
        try {
            const response = await fetch(API_LOGOUT, { method: 'POST' });
            if (response.ok) {
                console.log('Utilizator deconectat cu succes.');
                alert('Ai fost deconectat cu succes.'); 
                window.location.href = '/';
            } else {
                console.error('Eroare la deconectare:', await response.json());
                alert('Eroare la deconectare. Încercați din nou.');
            }
        } catch (error) {
            console.error('Eroare de rețea la deconectare:', error);
            alert('A apărut o problemă la server în timpul deconectării.');
        }
    }

    function updateUI(userStatus) {
        const { isLoggedIn, userName, userRole } = userStatus;
        
        if (isLoggedIn && navbarRight) {
            
            navbarRight.innerHTML = `
                <span class="welcome-message">Salut, ${userName.split(' ')[0]}</span>
                <a href="/dashboard" class="btn-secondary-nav" style="background: var(--color-secondary);">
                    <i class="fas fa-chart-line"></i> Dashboard
                </a>
                <button id="logoutBtn" class="btn-secondary-nav" style="background: #a00000; border: none; cursor:pointer;">
                    <i class="fas fa-sign-out-alt"></i> Deconectare
                </button>
            `;

            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', handleLogout);
            }

        } else if (!isLoggedIn && navbarRight) {
             navbarRight.innerHTML = `
                <a href="login.html" class="btn-secondary-nav">
                    <i class="fas fa-sign-in-alt"></i> Conectare
                </a>
            `;
        }


        if (dashboardAlert) {
            if (isLoggedIn) {
                dashboardAlert.style.backgroundColor = '#d1e7dd';
                dashboardAlert.style.borderColor = '#badbcc';
                dashboardAlert.style.color = '#0f5132';
                dashboardAlert.innerHTML = `
                    <i class="fas fa-check-circle fa-lg"></i>
                    <p>
                        Bun venit, <strong>${userName}</strong>! Ești logat ca <b>${userRole ? userRole.toUpperCase() : 'UTILIZATOR'}</b>.
                        Aici vei vedea în curând poziția ta în lista de așteptare.
                        <a href="#eligibilitate-form" class="alert-link" style="color:#0f5132;">Completează formularul de mai jos pentru a aplica.</a>
                    </p>
                `;
            } else {
                dashboardAlert.style.backgroundColor = 'var(--color-tertiary-light)';
                dashboardAlert.style.borderColor = 'var(--color-tertiary)';
                dashboardAlert.style.color = 'var(--color-tertiary-dark)';
                dashboardAlert.innerHTML = `
                    <i class="fas fa-info-circle fa-lg"></i>
                    <p>
                        Nu ai încă o cerere înregistrată. Pentru a aplica, te rugăm să te <a href="login.html" class="alert-link">autentifici</a>.
                    </p>
                `;
            }
        }
    }

    checkAuthStatus().then(updateUI);
});