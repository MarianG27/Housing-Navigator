document.addEventListener('DOMContentLoaded', () => {


    const MOCK_USERS = [
     
        { email: 'admin1@hn.ro', password: 'Admin.123', role: 'admin', name: 'Admin One' },
        { email: 'admin2@hn.ro', password: 'Admin.456', role: 'admin', name: 'Admin Two' },
        { email: 'admin3@hn.ro', password: 'Admin.789', role: 'admin', name: 'Admin Three' },
   
        { email: 'user1@hn.ro', password: 'User.123', role: 'user', name: 'Popescu Ion' },
        { email: 'user2@hn.ro', password: 'User.456', role: 'user', name: 'Ionescu Maria' },
        { email: 'user3@hn.ro', password: 'User.789', role: 'user', name: 'Georgescu Alex' },
        { email: 'user4@hn.ro', password: 'User.101', role: 'user', name: 'Dumitru Ana' },
        { email: 'user5@hn.ro', password: 'User.102', role: 'user', name: 'Vasile Mihai' },
        { email: 'user6@hn.ro', password: 'User.103', role: 'user', name: 'Stanescu Elena' }
    ];

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');


 
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('i');

        question.addEventListener('click', () => {
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.querySelector('.faq-answer').classList.remove('open');
                    otherItem.querySelector('.faq-answer').style.maxHeight = "0";
                    otherItem.querySelector('i').classList.remove('open');
                }
            });

            answer.classList.toggle('open');
            icon.classList.toggle('open');

            if (answer.classList.contains('open')) {
                answer.style.maxHeight = answer.scrollHeight + 50 + "px";
            } else {
                answer.style.maxHeight = "0";
            }
        });
    });


  
    const loginForm = document.querySelector('.login-form-container form');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('loginEmail').value;
            const passwordInput = document.getElementById('loginPassword').value;

            const foundUser = MOCK_USERS.find(user =>
                user.email === emailInput && user.password === passwordInput
            );

            if (foundUser) {
              
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userRole', foundUser.role);
                localStorage.setItem('userName', foundUser.name);
                alert(`Autentificare reușită! Bine ai venit, ${foundUser.name} (${foundUser.role}).`);
                window.location.href = 'index.html'; 
                alert('Eroare de autentificare: Email sau parolă incorectă.');
            }
        });
    }

   
    const navbarRight = document.querySelector('.nav-links-right');
    const dashboardAlert = document.querySelector('.dashboard-alert');
    const connectButton = document.querySelector('.nav-links-right .btn-secondary-nav');

    if (isLoggedIn && navbarRight) {
      
        navbarRight.innerHTML = `
            <span class="welcome-message">Salut, ${userName.split(' ')[0]}</span>
            <a href="#dashboard-section" class="btn-secondary-nav" style="background: var(--color-secondary);">
                <i class="fas fa-chart-line"></i> Dashboard
            </a>
            <button id="logoutBtn" class="btn-secondary-nav" style="background: #a00000; border: none; cursor:pointer;">
                <i class="fas fa-sign-out-alt"></i> Deconectare
            </button>
        `;

      
        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.clear();
            alert('Ai fost deconectat cu succes.');
            window.location.reload();
        });
    }

    if (dashboardAlert && !loginForm) {
        if (isLoggedIn) {
            dashboardAlert.style.backgroundColor = '#d1e7dd';
            dashboardAlert.style.borderColor = '#badbcc';
            dashboardAlert.style.color = '#0f5132';
            dashboardAlert.innerHTML = `
                <i class="fas fa-check-circle fa-lg"></i>
                <p>
                    Bun venit, <strong>${userName}</strong>! Ești logat ca **${userRole.toUpperCase()}**.
                    Aici vei vedea în curând poziția ta în lista de așteptare.
                    <a href="#eligibilitate-form" class="alert-link" style="color:#0f5132;">Completează formularul de mai jos pentru a aplica.</a>
                </p>
            `;
        }
    }


  
    const form = document.querySelector('#eligibilitate-form form');
    const verifyBtn = document.getElementById('verifyBtn');
    const submitBtn = document.getElementById('submitBtn');
    const resultMessage = document.getElementById('resultMessage');

    const resetResult = () => {
        resultMessage.classList.remove('visible', 'high-chance', 'low-chance');
        resultMessage.innerHTML = '';
        submitBtn.style.display = 'none';
    }

    const validateForm = () => {
        const inputs = form.querySelectorAll('input[required], select[required]');
        let isValid = true;
        inputs.forEach(input => {
            if (!input.value || (input.type === 'number' && input.value < 0) || (input.type === 'number' && input.id !== 'netIncome' && input.value <= 0)) {
                isValid = false;
            }
        });
        return isValid;
    }

    verifyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        resetResult();

        if (!validateForm()) {
            resultMessage.className = 'result-message visible low-chance';
            resultMessage.innerHTML = '<h4>Eroare:</h4>Te rugăm să completezi toate câmpurile obligatorii pentru a calcula șansele.';
            return;
        }

        const netIncome = parseInt(document.getElementById('netIncome').value) || 0;
        const familyMembers = parseInt(document.getElementById('familyMembers').value) || 1;
        const hasDisability = document.getElementById('hasDisability').value;
        const housingSituation = document.getElementById('housingSituation').value;

        const incomePerMember = netIncome / familyMembers;
        let score = 0;

        if (incomePerMember < 800) {
            score += 40;
        } else if (incomePerMember < 1500) {
            score += 20;
        } else if (incomePerMember < 2500) {
            score += 10;
        } else {
            score += 5;
        }

        if (housingSituation === 'homeless') {
            score += 30;
        } else if (housingSituation === 'rent_private') {
            score += 15;
        }

        if (hasDisability === 'yes') {
            score += 10;
        }

        const disclaimer = '<span class="disclaimer">Disclaimer: Nu garantăm 100% că punctajul dvs. este exact.</span>';

        let messageHTML = '';
        let resultClass = '';

        if (score >= 40) {
            resultClass = 'high-chance';
            messageHTML = `
                <h4>Ești FOARTE ELIGIBIL!</h4>
                <p>Punctajul estimat este de **${score}** de puncte. Ai șanse mari să obții o locuință socială.</p>
                <p class="register-prompt">Acum poți **trimite cererea oficială** pentru a intra în lista de așteptare.</p>
                ${disclaimer}
            `;
            submitBtn.style.display = 'block';

        } else if (score >= 15) {
            resultClass = 'low-chance';
            messageHTML = `
                <h4>Ești ELIGIBIL, dar cu șanse medii.</h4>
                <p>Punctajul estimat este de **${score}** de puncte. Poți aplica, dar timpul de așteptare poate fi lung.</p>
                <p class="register-prompt">Dacă dorești, poți **trimite cererea oficială** acum.</p>
                ${disclaimer}
            `;
            submitBtn.style.display = 'block';
        } else {
            resultClass = 'low-chance';
            messageHTML = `
                <h4>Șanse mici de eligibilitate.</h4>
                <p>Punctajul estimat este de **${score}** de puncte. Conform criteriilor de bază, nu te califici momentan pentru o poziție bună în lista de așteptare.</p>
                <p>Te rugăm să verifici din nou datele sau să consulți secțiunea "Cum Funcționează".</p>
                ${disclaimer}
            `;
            submitBtn.style.display = 'none';
        }

        resultMessage.innerHTML = messageHTML;
        resultMessage.classList.add('visible', resultClass);

    });

  
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            if (!validateForm()) return;

            if (isLoggedIn) {
              
                alert(`Cererea oficială a fost trimisă cu succes de către ${userName}!`);
                resetResult();
                resultMessage.className = 'result-message visible high-chance';
                resultMessage.innerHTML = '<h4>Succes!</h4><p>Cererea ta a fost înregistrată. Vei primi un email de confirmare și îți poți verifica poziția în Dashboard.</p>';
            } else {
              
                alert("Pentru a trimite cererea oficială și a salva datele, trebuie să fii logat. Vei fi redirecționat către pagina de Conectare/Înregistrare.");
                window.location.href = 'login.html';
            }
        });
    }
});