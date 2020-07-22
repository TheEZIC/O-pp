module.exports = class Beatmap {
    constructor(map) {
        this.beatmapId = map.beatmap_id;
        this.beatmapsetId = map.beatmapset_id;
        this.mode = map.mode;

        this.artist = map.artist;
        this.title = map.title;
        this.diffName = map.version;
        this.mapper = map.creator;

        this.combo = +map.max_combo;

        this.stats = {
            CS: +map.diff_size,
            OD: +map.diff_overall,
            AR: +map.diff_approach,
            HP: +map.diff_drain
        }

        this.diff = {
            SR: +map.difficultyrating,
            aim: +map.diff_aim,
            speed: +map.diff_speed
        }

        this.objects = {
            circles: +map.count_normal,
            sliders: +map.count_slider,
            spinners: +map.count_spinner,
            totalObj: null
        }

        this.objects.totalObj = this.calcTotalObj()
    }

    calcTotalObj() {
        let { circles, sliders, spinners } = this.objects;
        return circles + sliders + spinners;
    }
}