// auth.js - Sistema de autenticação

const Auth = {
    // Verificar se usuário está autenticado
    checkAuth: function() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const loginTime = localStorage.getItem('loginTime');
        
        // Se não estiver logado, redirecionar
        if (isLoggedIn !== 'true') {
            this.redirectToLogin();
            return false;
        }
        
        // Verificar expiração da sessão (8 horas)
        if (loginTime) {
            const loginDate = new Date(loginTime);
            const currentDate = new Date();
            const hoursDiff = Math.abs(currentDate - loginDate) / 36e5;
            
            if (hoursDiff > 8) {
                this.logout();
                return false;
            }
        }
        
        return true;
    },
    
    // Redirecionar para login
    redirectToLogin: function() {
        const currentPage = window.location.pathname.split('/').pop();
        localStorage.setItem('redirectAfterLogin', currentPage);
        window.location.href = 'login.html';
    },
    
    // Logout
    logout: function() {
        localStorage.clear();
        window.location.href = 'login.html';
    },
    
    // Criar botão de logout
    createLogoutButton: function() {
        const logoutBtn = document.createElement('button');
        logoutBtn.id = 'logoutButton';
        logoutBtn.innerHTML = 'SAIR';
        logoutBtn.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #1a1a1a;
            color: white;
            border: 2px solid white;
            padding: 8px 16px;
            font-size: 12px;
            font-weight: bold;
            cursor: pointer;
            z-index: 1000;
            transition: all 0.3s;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        `;
        
        logoutBtn.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'white';
            this.style.color = '#1a1a1a';
            this.style.borderColor = '#1a1a1a';
        });
        
        logoutBtn.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '#1a1a1a';
            this.style.color = 'white';
            this.style.borderColor = 'white';
        });
        
        logoutBtn.addEventListener('click', function() {
            Auth.logout();
        });
        
        document.body.appendChild(logoutBtn);
    },
    
    // Inicializar verificação de autenticação
    init: function() {
        if (!this.checkAuth()) {
            return false;
        }
        
        this.createLogoutButton();
        return true;
    }
};

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    Auth.init();
});