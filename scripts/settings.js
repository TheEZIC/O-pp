module.exports = class Setting {
    constructor() {
        document.getElementById('optionsBtn').addEventListener('click', this.show);
        document.getElementById('optionsCloseBtn').addEventListener('click', this.hide);
        document.getElementById('optionsAPIConfirm').addEventListener('click', this.updateAPIKey);
    }

    show() {
        let options = document.getElementById('options');

        options.classList.remove('options--close');
        options.classList.add('options--open');
    }

    hide() {
        let options = document.getElementById('options');

        options.classList.remove('options--open');
        options.classList.add('options--close');
    }

    updateAPIKey() {
        let { value: APIKey } = document.getElementById('optionsAPIInput');

        chrome.storage.local.set({ APIKey });
    }
}