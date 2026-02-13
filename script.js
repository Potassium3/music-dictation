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

const melodyLevels = {
    0: "Adaptive practice",
    1: "Simple open-key melodies in treble clef",
    2: "Melodies with a greater range of notes",
    3: "Introducing key signatures",
    4: "Bass clef melodies",
    5: "More complex key signatures",
    6: "Accidentals",
    7: "All key signatures",
    8: "Varied tempo",
    9: "Other clefs",
    10: "",
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
    let split = Math.random() > 0.5 ? true : false // Random true/false
    if (depth <= 5 && split && duration >= 0.5) {
        let re;
        if ([3].includes(duration)) {
            let groupTwoOne = Math.random() > 0.5 ? true : false // Random true/false
            re = [0, 0]
            let duration1, duration2;
            if (groupTwoOne) {
                duration1 = duration*2/3;
                duration2 = duration/3;
            } else {
                duration1 = duration/3;
                duration2 = duration*2/3;
            }
            re[0] = recursiveGenerate(details, duration1, depth+1);
            re[1] = recursiveGenerate(details, duration2, depth+1);
        } else {
            re = [0, 0]
            let duration1 = duration/2;
            let duration2 = duration/2;
            re[0] = recursiveGenerate(details, duration1, depth+1);
            re[1] = recursiveGenerate(details, duration2, depth+1);
        }
        return re
    } else {
        // Base case
        return {
            duration: duration,
            pitch: Math.floor(Math.random()*5),
        }
    }
}

function generateMusic(details) {
    let barDurations;
    barDurations = [];
    if (details.metre[3] != 0) {
        barDurations.push(details.metre[3]/(details.metre[1]-3))
        for (let i=0; i<details.metre[2]-1; i++) {
            barDurations.push(details.metre[0]/(details.metre[1]-3));
        }
        barDurations.push((details.metre[0]-details.metre[3])/(details.metre[1]-3))
    } else {
        for (let i=0; i<details.metre[2]; i++) {
            barDurations.push(details.metre[0]/(details.metre[1]-3));
        }
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

function getNoteHTML(duration, pitch=8, articulation=0) {
    pitch = Math.floor(Math.random()*6+5);

    let top = pitch*-5+65;
    let stemdown = pitch >= 7;
    let stemtext = stemdown ? "down" : "up";

    if (duration == 1) {
        return `
        <div class="div-music-main-note div-music-main-note-crotchet">
            <div class="div-music-main-note-notehead div-music-main-note-notehead-crotchet" style="top:${top}px;"></div>
            <div class="div-music-main-note-notestem${stemtext}" style="top:${top}px;"></div>
        </div>
        `
    } else if (duration == 2) {
        return `
        <div class="div-music-main-note div-music-main-note-minim">
            <div class="div-music-main-note-notehead div-music-main-note-notehead-minim" style="top:${top}px;"></div>
            <div class="div-music-main-note-notestem${stemtext}" style="top:${top}px;"></div>
        </div>`
    } else if (duration == 3) {
        return `
        <div class="div-music-main-note div-music-main-note-minim">
            <div class="div-music-main-note-notehead div-music-main-note-notehead-minim" style="top:${top}px;"></div>
            <div class="div-music-main-note-notestem${stemtext}" style="top:${top}px;"></div>
            <div class="div-music-main-note-dot" style="top:${top}px;"></div>
        </div>`
    } else if (duration == 4) {
        return `
        <div class="div-music-main-note div-music-main-note-semibreve">
            <div class="div-music-main-note-notehead div-music-main-note-notehead-semibreve" style="top:${top}px;"></div>
        </div>`
    } else {
        /*return `
        <div class="div-music-main-note div-music-main-note-subcrotchet">
            <div class="div-music-main-note-notehead div-music-main-note-notehead-subcrotchet" style="top:${top}px;"></div>
            <div class="div-music-main-note-notestemdown" style="top:${top}px;height:${68-top}px"></div>
        </div>`*/
        return `
        <div class="div-music-main-note div-music-main-note-subcrotchet">
            <div class="div-music-main-note-notehead div-music-main-note-notehead-subcrotchet" style="top:${top}px;"></div>
            <div class="div-music-main-note-notestemup" style="top:${top}px;height:${top+8.5}px"></div>
        </div>`
    }
}

function depthSum(arr) {
    let total = 0;
    for (let item of arr) {
        if (item.length == 2) {
            // item is an array
            total += depthSum(item);
        } else {
            // item is a number
            total += item.duration;
        }
    }
    return total;
}

function collapseUpToDepth(arr, dep) {
    let newarr = [];
    for (let item of arr) {
        if (item[0] != undefined && depthSum(item) > 1) {
            // item is an array
            let subitems = collapseUpToDepth(item, dep-1);
            for (let subitem of subitems) {
                newarr.push(subitem);
            }
        } else {
            // item is an object
            newarr.push(item);
        }
    }
    return newarr;
}

function crotchetExpand(arr) {
    console.log(arr)
    console.log(typeof arr)
    if (arr.length != 2) {
        // Single note
        return getNoteHTML(0.5, arr.pitch);
    } else {
        let subCrotchetText = ""
        for (let item of arr) {
            if (item.length == 2) {
                // Array
                subCrotchetText += crotchetExpand(item);
            } else {
                subCrotchetText += getNoteHTML(0.5, item.pitch);
            }
        }
        if (true) {
            return `
            <div class="div-music-main-note-subcrotchetcont div-music-main-note-subcrotchetcont-notestemdown">
                ${subCrotchetText}
                <div class="div-music-main-note-subcrotchetbeam div-music-main-note-subcrotchetbeamdown"></div>
            </div>`
        } else {
            return subCrotchetText
        }
    }
}

function showMusic(music) {
    const elem = document.getElementById("display-music");
    let notes = "";
    let collapsedBars = collapseUpToDepth(music.bars, 2);
    let barDuration = music.metre[0]/(music.metre[1]-3);
    let totalDuration = 0;
    for (let note of collapsedBars) {

        if (note.duration == 1) {
            notes += getNoteHTML(1);
            totalDuration += 1;
        } else if (note.duration == 2) {
            notes += getNoteHTML(2);
            totalDuration += 2;
        } else if (note.duration == 3) {
            notes += getNoteHTML(3);
            totalDuration += 3;
        } else if (note.duration == 4) {
            notes += getNoteHTML(4);
            totalDuration += 4;
        } else {
            notes += `
            <div class="div-music-main-note div-music-main-note-cont">
                ${crotchetExpand(note)}
            </div>`
            totalDuration += 1;
        }

        if (totalDuration%music.metre[0] == music.metre[3] && totalDuration!=0 && totalDuration!=barDuration*music.metre[2]) {
            notes += `
            <div class="div-music-main-barline">
                <div class="div-music-main-barline-single"></div>
            </div>`
        }
    }
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
            <div class="div-music-main-time">
                <div>${music.metre[0]}</div>
                <div>${music.metre[1]}</div>
            </div>
            ${notes}
            <div class="div-music-main-cursor"></div>
            <div class="div-music-main-end">
                <div class="div-music-main-end-double"></div>
            </div>
        </div>
    `
}

function generateAndShowMusic(details) {
    let music = generateMusic(details);
    console.log(music);
    showMusic(music);//{'metre':[4,4,2,0],'bars':[[[[[0.5],[0.5]],[1]],[2]],[[[1],[[0.5],[0.5]]],[[[0.5],[0.5]],[[0.5],[0.5]]]]]});
}

let detailsForMusic = {
    metre: [4, 4, 4, 0], // Time sig, bars, anacrusis duration
    dots: false,
    ties: false,
    rests: false,
    triplets: false,
}

generateAndShowMusic(detailsForMusic);

let notes = [
    new Audio("sounds/af.wav"),
    new Audio("sounds/a.wav"),
    new Audio("sounds/bf.wav"),
    new Audio("sounds/b.wav"),
    new Audio("sounds/c.wav"),
    new Audio("sounds/df.wav"),
    new Audio("sounds/d.wav"),
    new Audio("sounds/ef.wav"),
    new Audio("sounds/e.wav"),
    new Audio("sounds/f.wav"),
    new Audio("sounds/gf.wav"),
    new Audio("sounds/g.wav"),
];