module.exports = class APIKey {
    static confirmElement = document.getElementById('startScreenAPIConfirm');
    static containerElement = document.getElementById('startScreen');
    static inputElement = document.getElementById('startScreenAPIInput');

    static save() {
		let { value: APIKey } = this.inputElement;

		chrome.storage.local.set({ APIKey });
		this.containerElement.style.display = 'none';
    }

    static showScreen() {
		this.containerElement.style.display = 'flex';
	}

    static tryToGet() {
		return new Promise(async resolve => {
			await chrome.storage.local.get(['APIKey'], res => resolve(!!res.APIKey));
		})
	}
}