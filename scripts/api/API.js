let { default: axios } = require('axios');
let qs = require('query-string');
let Beatmap = require('./Beatmap');
let Notification = require('../notification');

module.exports = class API {
    constructor() {
        this.api = axios.create({
            baseURL: 'https://osu.ppy.sh/api/',
            method: 'get',
            timeout: 7e3
        })
    }

    getApiKey() {
        return new Promise(resolve => {
            return chrome.storage.local.get(['APIKey'], async res => resolve(res.APIKey))
        })
    }

    async getBeatmap(beatmapId, mode = 0, mods = 0) {
        let mapData = await this.getApiKey().then(async APIKey => {
            try {
                let { data } = await this.api.get(`get_beatmaps?${qs.stringify({
                    k: APIKey,
                    b: beatmapId,
                    m: mode,
                    a: 1,
                    mods
                })}`)
    
                return (data[0]);
            } catch(e) {
                console.log(e)
            }
        })

        if (!mapData) return new Notification({ 
            type: 'ERROR', 
            text: 'Wrong API Key. Please, restart extension and enter correct',
            removeAPI: true
        });

        return new Beatmap(mapData);
    }
}