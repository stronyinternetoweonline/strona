// Manager pobierania wielu plików - Opcja 2
class DownloadManager {
    constructor() {
        this.files = [
            { 
                url: 'pliki/1.zip', 
                name: 'zdjęcia' 
            },
            { 
                url: 'pliki/2.zip', 
                name: 'zdjęcia' 
            },
            { 
                url: 'pliki/3.zip', 
                name: 'zdjęcia' 
            },
            { 
                url: 'pliki/4.zip', 
                name: 'zdjęcia' 
            },
            { 
                url: 'pliki/5.zip', 
                name: 'zdjęcia' 
            },
            { 
                url: 'pliki/6.zip', 
                name: 'zdjęcia' 
            }
          
        ];
        this.isDownloading = false;
    }

    initialize() {
        const downloadAllBtn = document.getElementById('downloadAll');
        if (downloadAllBtn) {
            downloadAllBtn.addEventListener('click', () => this.downloadAll());
        }
    }

    downloadFile(file) {
        return new Promise((resolve) => {
            try {
                const link = document.createElement('a');
                link.href = file.url;
                link.download = file.name;
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                
                setTimeout(() => {
                    document.body.removeChild(link);
                    resolve();
                }, 800);
            } catch (error) {
                console.error('Błąd podczas pobierania:', file.name, error);
                resolve(); // Kontynuuj nawet jeśli jeden plik się nie uda
            }
        });
    }

    async downloadAll() {
        if (this.isDownloading) return;
        
        this.isDownloading = true;
        const downloadAllBtn = document.getElementById('downloadAll');
        
        if (downloadAllBtn) {
            downloadAllBtn.disabled = true;
            downloadAllBtn.textContent = 'Pobieranie...';
        }
        
        try {
            for (let i = 0; i < this.files.length; i++) {
                await this.downloadFile(this.files[i]);
                
                // Opóźnienie między plikami (1 sekunda)
                if (i < this.files.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
            
            // Powiadomienie o sukcesie
            this.showNotification('Wszystkie pliki zostały pobrane!');
            
        } catch (error) {
            console.error('Błąd podczas pobierania wszystkich plików:', error);
            this.showNotification('Wystąpił błąd podczas pobierania', 'error');
        } finally {
            this.isDownloading = false;
            
            if (downloadAllBtn) {
                downloadAllBtn.disabled = false;
                downloadAllBtn.textContent = 'Pobierz wszystkie';
            }
        }
    }

    showNotification(message, type = 'success') {
        // Utwórz element powiadomienia
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
        `;
        
        if (type === 'success') {
            notification.style.background = 'linear-gradient(to right, #00b09b, #96c93d)';
        } else {
            notification.style.background = 'linear-gradient(to right, #ff416c, #ff4b2b)';
        }
        
        document.body.appendChild(notification);
        
        // Automatyczne usunięcie po 4 sekundach
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
}

// Dodaj style CSS dla animacji powiadomień
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification {
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }
`;
document.head.appendChild(style);

// Inicjalizacja po załadowaniu DOM
document.addEventListener('DOMContentLoaded', () => {
    const downloadManager = new DownloadManager();
    downloadManager.initialize();
});
