module.exports = class InputsListener {
    constructor(map, mode, setMapInformation) {
        this.map = map;
        this.setMapInformation = setMapInformation;
        this.listen(mode)
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
				let { value, id } = e.target;

				if (id === 'accuracy') this.accuracy = value;
				if (id === 'combo') this.combo = value;
				if (id === 'miss') this.miss = value;

				return this.setMapInformation(this.map);
			}))
		);
	}

	listenManiaInputs() {
		return (
			document.getElementById('score').addEventListener('input', e => {
				let { value } = e.target;

				this.score = value;

				return this.setMapInformation(this.map);
			})
		);
	}
}