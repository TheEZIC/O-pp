module.exports = class Notification {
    containerElement = document.getElementById('notification');
    closeElement = document.getElementById('notificationCloseBtn');

    constructor(params) {
        this.params = params; 
        
        this.createNotification();

        if (this.params.type !== 'ERROR')
            this.closeElement.addEventListener('click', () => this.close());
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
        }

        this.containerElement.innerHTML = content;
        this.containerElement.style.display = 'flex';
    }

    close() {
        this.containerElement.style.display = 'none';
        this.closeElement.removeEventListener('click', () => this.close());
    }
}