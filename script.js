// Szyfrowanie hasła (uproszczone - w rzeczywistej aplikacji użyj bezpieczniejszego rozwiązania)
function hashPassword(password) {
    // W rzeczywistej aplikacji użyj bezpiecznej funkcji haszującej jak bcrypt
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Konwertuj na 32-bitową liczbę całkowitą
    }
    return hash.toString();
}

// Baza danych użytkowników (w rzeczywistej aplikacji przechowuj to po stronie serwera)
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

// Obsługa formularza logowania
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const changePasswordForm = document.getElementById('changePasswordForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('error-message');
            
            // Sprawdź czy użytkownik istnieje
            if (users[username] && users[username].passwordHash === hashPassword(password)) {
                // Zalogowano pomyślnie
                errorMessage.textContent = '';
                errorMessage.className = 'message';
                
                // Zapisz informacje o zalogowanym użytkowniku w sessionStorage
                sessionStorage.setItem('loggedInUser', username);
                
                // Przekieruj na odpowiednią stronę
                window.location.href = users[username].redirectTo;
            } else {
                // Błąd logowania
                errorMessage.textContent = 'Nieprawidłowa nazwa użytkownika lub hasło';
                errorMessage.className = 'error-message';
            }
        });
    }
    
    // Obsługa formularza zmiany hasła
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
            
            // Sprawdź aktualne hasło
            if (users[loggedInUser].passwordHash !== hashPassword(currentPassword)) {
                messageElement.textContent = 'Aktualne hasło jest nieprawidłowe';
                messageElement.className = 'error-message';
                return;
            }
            
            // Sprawdź czy nowe hasło i potwierdzenie się zgadzają
            if (newPassword !== confirmPassword) {
                messageElement.textContent = 'Nowe hasła nie są identyczne';
                messageElement.className = 'error-message';
                return;
            }
            
            // Zmień hasło
            users[loggedInUser].passwordHash = hashPassword(newPassword);
            messageElement.textContent = 'Hasło zostało zmienione pomyślnie';
            messageElement.className = 'message';
            
            // Wyczyść formularz
            changePasswordForm.reset();
        });
    }
    
    // Obsługa linków w nagłówku
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
    
    // Sprawdź czy użytkownik jest zalogowany na stronach chronionych
    const protectedPages = ['dashboard.html', 'gallery.html', 'change-password.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
        const loggedInUser = sessionStorage.getItem('loggedInUser');
        
        if (!loggedInUser || !users[loggedInUser]) {
            window.location.href = 'index.html';
            return;
        }
        
        // Jeśli użytkownik jest na niewłaściwej stronie, przekieruj go
        if (currentPage !== users[loggedInUser].redirectTo && currentPage !== 'change-password.html') {
            window.location.href = users[loggedInUser].redirectTo;
        }
    }
    
    // Załaduj odpowiednią galerię zdjęć
    const gallery = document.querySelector('.gallery');
    const aresGallery = document.getElementById('aresGallery');
    
    if (gallery || aresGallery) {
        loadGallery(gallery || aresGallery);
    }
});

// Funkcja do ładowania galerii zdjęć
function loadGallery(galleryElement) {
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    let imageCount, folder, extension;
    
    // Ustal parametry galerii na podstawie użytkownika i strony
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'dashboard.html') {
        // Galeria dla użytkownika pablo (zdjęcia 1-12 z folderu ares)
        imageCount = 12;
        folder = 'ares/';
        extension = '.JPG';
    } else if (currentPage === 'gallery.html') {
        // Galeria dla pozostałych użytkowników (zdjęcia 1-109 z folderu fotki)
        imageCount = 109;
        folder = 'fotki/';
        extension = '.png';
    } else {
        return; // Nie ładuj galerii na innych stronach
    }
    
    // Wyczyść galerię przed załadowaniem nowych zdjęć
    galleryElement.innerHTML = '';
    
    // Dodaj zdjęcia do galerii
    for (let i = 1; i <= imageCount; i++) {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        const img = document.createElement('img');
        // Użyj prawidłowych ścieżek do zdjęć
        img.src = `${folder}${i}${extension}`;
        img.alt = `Zdjęcie ${i}`;
        img.loading = 'lazy'; // Lazy loading dla lepszej wydajności
        
        // Obsługa błędów ładowania zdjęć
        img.onerror = function() {
            // Jeśli zdjęcie nie istnieje, użyj placeholder z odpowiednim kolorem
            const color = currentPage === 'dashboard.html' ? '8e2de2' : '4a00e0';
            this.src = `https://via.placeholder.com/200x150/${color}/ffffff?text=Image+${i}`;
            this.alt = `Placeholder dla zdjęcia ${i}`;
        };
        
        galleryItem.appendChild(img);
        galleryElement.appendChild(galleryItem);
    }
    
    // Dodaj styl do galerii jeśli nie ma
    if (!document.querySelector('.gallery-styles')) {
        const style = document.createElement('style');
        style.className = 'gallery-styles';
        style.textContent = `
            .gallery {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 15px;
                margin-top: 20px;
            }
            
            .gallery-item {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                transition: transform 0.3s;
            }
            
            .gallery-item:hover {
                transform: scale(1.05);
            }
            
            .gallery-item img {
                width: 100%;
                height: 150px;
                object-fit: cover;
                display: block;
            }
        `;
        document.head.appendChild(style);
    }
}