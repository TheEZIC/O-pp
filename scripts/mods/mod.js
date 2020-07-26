module.exports = class Mod {
    constructor(modName) {
        this.modName = modName;

        this.mod = document.getElementById(modName);
        this.icon = document.getElementById(`${modName}-icon`);
        this.container = document.getElementById(`${modName}-container`);
        this.modsEmitter = require("./index.js").modsEmitter;

        if(this.mod)
            this.container.style.display = 'flex';
            this.mod.addEventListener('change', () => this.switchMod());
    }

    switchMod() {
        if (this.mod.getAttribute('checked') === 'checked')
            this.disactivate();
        else 
            this.activate();
    }

    activate() {
        this.mod.checked = true;
        this.mod.setAttribute('checked', 'checked');
        this.icon.style.transform = 'scale(1.2, 1.2) rotate(10deg)';
        this.modsEmitter.emit('addMod', this.modName);
    }

    disactivate() {
        this.mod.checked = false;
        this.mod.setAttribute('checked', '');
        this.icon.style.transform = 'scale(1.0, 1.0) rotate(0deg)';
        this.modsEmitter.emit('removeMod', this.modName);
    }
}