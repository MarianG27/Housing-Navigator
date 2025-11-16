document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form-container form');
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();
            const password = passwordInput.value;

            if (!email || !password) {
                alert('Vă rugăm introduceți adresa de email și parola.');
                return;
            }

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify({ 
                        email: email, 
                        password: password 
                    }) 
                });
                const result = await response.json();

                if (response.ok && result.success) { 
                    alert('Autentificare reușită! Redirectare către Dashboard...');
                    window.location.href = '/index.html'; 
                } else {
                    alert(`Eroare de autentificare: ${result.message || 'Email sau parolă incorectă.'}`);
                    passwordInput.value = '';
                }

            } catch (error) {
                console.error('Eroare de rețea sau la procesarea serverului:', error);
                alert('A apărut o problemă la conectarea la server. Vă rugăm încercați din nou.');
            }
        });
    }
});