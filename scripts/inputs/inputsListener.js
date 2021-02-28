let { setMapInformation } = require("../utils");

module.exports = class InputsListener {
    constructor(main) {
		this.main = main;

		const { map, mode, mods } = main;

        this.map = map;
		this.mods = mods;
        this.listen(mode);
    }

	listen(mode) {
		switch (mode) {
            default:
            case 1:
            case 2:
				return this.listenDefaultInputs();
            case 3:
				return this.listenManiaInputs();
        }
    }
    
    listenDefaultInputs() {
		return (
			document.querySelectorAll('.default-input')
			.forEach(e => e.addEventListener('input', e => {
				const { value, id } = e.target;

				if (id === 'accuracy') this.accuracy = value;
				if (id === 'combo') this.combo = value;
				if (id === 'miss') this.miss = value;

				const { pp } = this.main.getPP();

				return setMapInformation(this.map, this.mods, pp);
			}))
		);
	}

	listenManiaInputs() {
		return (
			document.getElementById('score').addEventListener('input', e => {
				const { value } = e.target;
				this.score = value;

				const { pp } = this.main.getPP();

				return setMapInformation(this.map, this.mods, pp);
			})
		);
	}
}