const rhythmLevels = {
    0: "Adaptive practice",
    1: "Simple crotchet and quaver rhythms in 4/4",
    2: "Dotted rhythms",
    3: "Rhythms with ties and syncopation",
    4: "Rhythms with rests",
    5: "Rhythms in other simple metres",
    6: "Rhythms with triplets",
    7: "Rhythms in simple and compound metres",
    8: "Rhythms with an anacrusis (upbeat)",
    9: "Rhythms with a faster tempo",
    10: "Longer rhythms",
}

/*
Details:
{
    depth: 2, // 1 = crotchet+minim, 2 = quaver, 3 = semi
    metre: [4, 4, 2, 0], // Time sig, bars, anacrusis duration
    dots: false,
    ties: false,
    rests: false,
    triplets: false,
}

Music:
{
    metre: [4, 4, 2, 0], // Time sig, bars, anacrusis duration
    bars: [
        0: [
            4,
            [
                3,
                2,
            ],
        ],
    ],
}

*/

function recursiveGenerate(details, duration, depth=0) {
    let re = [0, 0]
    let split = Math.random() > 0.5 ? true : false
    if (depth <= 2 && split) {
        let duration1 = duration/2;
        let duration2 = duration/2;
        re[0] = recursiveGenerate(details, duration1, depth+1);
        re[1] = recursiveGenerate(details, duration2, depth+1);
    } else {
        // Base case
        return [duration]
    }
    return re
}

function generateMusic(details) {
    let barDurations;
    barDurations = [];
    if (details.metre[3] != 0) {
        barDurations.push(details.metre[3])
    }
    for (let i=0; i<details.metre[2]; i++) {
        barDurations.push(details.metre[0]);
    }
    let barsToReturn = []
    for (let bar of barDurations) {
        barsToReturn.push(recursiveGenerate(details, duration=bar));
    }
    return {
        metre: details.metre,
        bars: barsToReturn,
    }
}

function showMusic(music) {
    const elem = document.getElementById("display-music");
    elem.innerHTML = `
        <div class="div-music-staves">
            <div class="div-music-staves-stave"></div>
            <div class="div-music-staves-stave"></div>
            <div class="div-music-staves-stave"></div>
            <div class="div-music-staves-stave"></div>
            <div class="div-music-staves-stave"></div>
        </div>
        <div class="div-music-main">
            <div class="div-music-main-clef"></div>
            <div class="div-music-main-note">
                <div class="div-music-main-note-notehead"></div>
                <div class="div-music-main-note-notestemdown"></div>
            </div>
            <div class="div-music-main-barline">
                <div class="div-music-main-barline-single"></div>
            </div>
            <div class="div-music-main-note">
                <div class="div-music-main-note-notehead"></div>
                <div class="div-music-main-note-notestemdown"></div>
            </div>
            <div class="div-music-main-cursor">
                <div class="div-music-main-cursor-single"></div>
            </div>
            <div class="div-music-main-end">
                <div class="div-music-main-end-double"></div>
            </div>
        </div>
    `
}

function generateAndShowMusic(details) {
    let music = generateMusic(details);
    showMusic({'metre':[4,4,2,0],'bars':[[[[[0.5],[0.5]],[1]],[2]],[[[1],[[0.5],[0.5]]],[[[0.5],[0.5]],[[0.5],[0.5]]]]]});
}

let detailsForMusic = {
    depth: 2, // 1 = crotchet+minim, 2 = quaver, 3 = semi
    metre: [4, 4, 2, 0], // Time sig, bars, anacrusis duration
    dots: false,
    ties: false,
    rests: false,
    triplets: false,
}
generateAndShowMusic(detailsForMusic);