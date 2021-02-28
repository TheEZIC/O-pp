const popupTitle = document.getElementById('title');
const popupArtist = document.getElementById('artist');
const popupHeader = document.getElementById('header');
const popupOuter = document.getElementById('outer');
const popupBPM = document.getElementById('BPM');
const popupSR = document.getElementById('SR');

function modeToNumber(mode) {
    switch (mode) {
        case 'taiko': return 1;
        case 'fruits': return 2;
        case 'mania': return 3;
        default: return 0;
    }
}

function adaptBPM(bpm, mods) {
    if (mods.has('DT')) bpm *= 1.5;
    if (mods.has('HT')) bpm *= 0.75;

    return Math.ceil(bpm);
}

function setMapInformation(map, mods, pp) {
    console.log(mods)
    popupOuter.innerText = parseInt(pp) || 0;
    popupTitle.innerText = `${map.title} (${map.diffName})`;
    popupArtist.innerText = map.artist;
    popupSR.innerText = map.diff.SR.toFixed(2);
    popupBPM.innerText = adaptBPM(+map.bpm.toFixed(0), mods);
    popupHeader.style.backgroundImage = `url('https://assets.ppy.sh/beatmaps/${map.beatmapsetId}/covers/cover.jpg')`;
    preload.style.display = 'none';
}

module.exports.setMapInformation = setMapInformation;
module.exports.modeToNumber = modeToNumber;