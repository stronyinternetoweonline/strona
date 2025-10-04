
function hashPassword(password) {
   
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; 
    }
    return hash.toString();
}


const users = {
    'pablo': {
        passwordHash: hashPassword('gyat67'),
        redirectTo: 'dashboard.html'
    },
    'Szymon': {
        passwordHash: hashPassword('Żarnowski'),
        redirectTo: 'gallery.html'
    },
    'Filip': {
        passwordHash: hashPassword('Nowakowski'),
        redirectTo: 'gallery.html'
    },
    'Miłosz': {
        passwordHash: hashPassword('Jagiełło'),
        redirectTo: 'gallery.html'
    }
};


document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const changePasswordForm = document.getElementById('changePasswordForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('error-message');
            
           
            if (users[username] && users[username].passwordHash === hashPassword(password)) {
             
                errorMessage.textContent = '';
                errorMessage.className = 'message';
            
                sessionStorage.setItem('loggedInUser', username);
                
          
                window.location.href = users[username].redirectTo;
            } else {
             
                errorMessage.textContent = 'Nieprawidłowa nazwa użytkownika lub hasło';
                errorMessage.className = 'error-message';
            }
        });
    }
    

    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const messageElement = document.getElementById('message');
            
            const loggedInUser = sessionStorage.getItem('loggedInUser');
            
            if (!loggedInUser) {
                messageElement.textContent = 'Nie jesteś zalogowany';
                messageElement.className = 'error-message';
                return;
            }
            
  
            if (users[loggedInUser].passwordHash !== hashPassword(currentPassword)) {
                messageElement.textContent = 'Aktualne hasło jest nieprawidłowe';
                messageElement.className = 'error-message';
                return;
            }
            
   
            if (newPassword !== confirmPassword) {
                messageElement.textContent = 'Nowe hasła nie są identyczne';
                messageElement.className = 'error-message';
                return;
            }
            
       
            users[loggedInUser].passwordHash = hashPassword(newPassword);
            messageElement.textContent = 'Hasło zostało zmienione pomyślnie';
            messageElement.className = 'message';
        
            changePasswordForm.reset();
        });
    }
    

    const changePasswordLink = document.getElementById('changePasswordLink');
    const logoutLink = document.getElementById('logoutLink');
    const backLink = document.getElementById('backLink');
    
    if (changePasswordLink) {
        changePasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'change-password.html';
        });
    }
    
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            sessionStorage.removeItem('loggedInUser');
            window.location.href = 'index.html';
        });
    }
    
    if (backLink) {
        backLink.addEventListener('click', function(e) {
            e.preventDefault();
            const loggedInUser = sessionStorage.getItem('loggedInUser');
            if (loggedInUser && users[loggedInUser]) {
                window.location.href = users[loggedInUser].redirectTo;
            } else {
                window.location.href = 'index.html';
            }
        });
    }
    
  
    const protectedPages = ['dashboard.html', 'gallery.html', 'change-password.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
        const loggedInUser = sessionStorage.getItem('loggedInUser');
        
        if (!loggedInUser || !users[loggedInUser]) {
            window.location.href = 'index.html';
            return;
        }
        
      
        if (currentPage !== users[loggedInUser].redirectTo && currentPage !== 'change-password.html') {
            window.location.href = users[loggedInUser].redirectTo;
        }
    }
    const gallery = document.querySelector('.gallery');
    const aresGallery = document.getElementById('aresGallery');
    
    if (gallery || aresGallery) {
        loadGallery(gallery || aresGallery);
    }
});


function loadGallery(galleryElement) {
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    let imageCount, folder, extension;
    
  
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'dashboard.html') {
    
        imageCount = 12;
        folder = 'ares/';
        extension = '.JPG';
    } else if (currentPage === 'gallery.html') {
     
        imageCount = 109;
        folder = 'fotki/';
        extension = '.png';
    } else {
        return;
    }
    

    galleryElement.innerHTML = '';
    

    if (!document.querySelector('.gallery-styles')) {
        const style = document.createElement('style');
        style.className = 'gallery-styles';
        style.textContent = `
            .gallery {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 15px;
                margin-top: 20px;
                max-height: 70vh;
                overflow-y: auto;
                padding: 10px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 10px;
            }
            
            .gallery-item {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                transition: transform 0.3s;
                aspect-ratio: 1;
            }
            
            .gallery-item:hover {
                transform: scale(1.05);
            }
            
            .gallery-item img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                display: block;
            }

            /* Responsywność galerii */
            @media (max-width: 900px) {
                .gallery {
                    grid-template-columns: repeat(2, 1fr);
                }
            }

            @media (max-width: 600px) {
                .gallery {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(style);
    }
    

    for (let i = 1; i <= imageCount; i++) {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        const img = document.createElement('img');
  
        img.src = `${folder}${i}${extension}`;
        img.alt = `Zdjęcie ${i}`;
        img.loading = 'lazy';
        
      
        img.onerror = function() {
            
            const color = currentPage === 'dashboard.html' ? '8e2de2' : '4a00e0';
            this.src = `https://via.placeholder.com/200x200/${color}/ffffff?text=Image+${i}`;
            this.alt = `Placeholder dla zdjęcia ${i}`;
        };
        
        galleryItem.appendChild(img);
        galleryElement.appendChild(galleryItem);
    }
}

