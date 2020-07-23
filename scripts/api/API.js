let { default: axios } = require('axios');
let qs = require('query-string');
let { APIKey } = require('../../config.json');
let Beatmap = require('./Beatmap');

module.exports = class API {
    constructor() {
        this.api = axios.create({
            baseURL: 'https://osu.ppy.sh/api/',
            method: 'get',
            timeout: 7e3
        })
    }

    async getBeatmap(beatmapId, mode = 0, mods = 0) {
        if (!beatmapId) return;

        let { data } = await this.api.get(`get_beatmaps?${qs.stringify({
            k: APIKey,
            b: beatmapId,
            m: mode,
            a: 1,
            mods
        })}`)
        
        return new Beatmap(data[0]);
    }
}