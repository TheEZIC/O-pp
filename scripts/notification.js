module.exports = class Notification {
    constructor(params) {
        this.params = params; 
        this.notification = document.getElementById('notification');
        this.createNotification();

        if (this.params.type !== 'ERROR')
            document.getElementById('notificationCloseBtn').addEventListener('click', () => this.close());
    }

    createNotification() {
        let { type, text, removeAPI = false } = this.params;
        let content = '';
        if (!type || !text) return;

        if (type === 'WARNING') content = `
            <i class="fa fa-times notification__closeBtn" id="notificationCloseBtn"></i>
            <i class="fas fa-exclamation-circle notification__icon notification__icon--warning"></i>
            <span class="notification__title">${text}</span>
        `;

        if (type === 'ERROR') {
            content = `
                <i class="fas fa-times-circle notification__icon notification__icon--error"></i>
                <span class="notification__title">${text}</span>
            `;
            if (removeAPI) chrome.storage.local.remove(['APIKey']);
        }

        this.notification.innerHTML = content;
        this.notification.style.display = 'flex';
    }

    close() {
        this.notification.style.display = 'none';
        document.getElementById('notificationCloseBtn').removeEventListener('click', () => this.close());
    }
}