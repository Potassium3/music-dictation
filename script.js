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
    let split = Math.random() > 0.5 ? true : false // Random true/false
    if (depth <= 5 && split && duration >= 0.5) {
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
        barDurations.push(details.metre[3]/(details.metre[1]-3))
    }
    for (let i=0; i<details.metre[2]; i++) {
        barDurations.push(details.metre[0]/(details.metre[1]-3));
    }
    let barsToReturn = []
    for (let bar of barDurations) {
        barsToReturn.push(recursiveGenerate(details, duration=bar));
    }
    console.log("BARS: "+barDurations)
    return {
        metre: details.metre,
        bars: barsToReturn,
    }
}

function collapseUpToDepth(arr, dep) {
    if (dep == 0) {
        return arr;
    }
    let newarr = [];
    for (let item of arr) {
        if (item[0] != undefined) {
            let subitems = collapseUpToDepth(item, dep-1);
            for (let subitem of subitems) {
                newarr.push(subitem);
            }
        } else {
            newarr.push(item);
        }
    }
    return newarr;
}

function crotchetExpand(arr) {
    if (arr[0] == undefined) {
        return `
        <div class="div-music-main-note div-music-main-note-subcrotchet">
            <div class="div-music-main-note-notehead div-music-main-note-notehead-subcrotchet" style="top:40px;"></div>
            <div class="div-music-main-note-notestemdown" style="top:40px;"></div>
        </div>
        `
    } else {
        let subCrotchetText = ""
        let wrap = true
        for (let item of arr) {
            if (item[0] != undefined) {
                subCrotchetText += crotchetExpand(item)
            } else {
                subCrotchetText += `
                <div class="div-music-main-note div-music-main-note-subcrotchet">
                    <div class="div-music-main-note-notehead div-music-main-note-notehead-subcrotchet" style="top:40px;"></div>
                    <div class="div-music-main-note-notestemdown" style="top:40px;"></div>
                </div>`
                wrap = false
            }
        }
        if (wrap) {
            return `
            <div class="div-music-main-note-subcrotchetcont div-music-main-note-subcrotchetcont-notestemdown">
                ${subCrotchetText}
                <div class="div-music-main-note-subcrotchetbeam" style="top:40px;"></div>
            </div>`
        } else {
            return subCrotchetText
        }
    }
}

function showMusic(music, depth) {
    const elem = document.getElementById("display-music");
    let notes = "";
    let collapsedBars = collapseUpToDepth(music.bars, depth);
    let barDuration = music.metre[0]/(music.metre[1]-3);
    // THE ERROR IS HERE!!!!!
    let totalDuration = 0;
    for (let note of collapsedBars) {

        if (note == 1) {
            console.log("C")
            notes += `
            <div class="div-music-main-note div-music-main-note-crotchet">
                <div class="div-music-main-note-notehead div-music-main-note-notehead-crotchet" style="top:40px;"></div>
                <div class="div-music-main-note-notestemdown" style="top:40px;"></div>
            </div>`
            totalDuration += 1;
        } else if (note == 2) {
            console.log("M")
            notes += `
            <div class="div-music-main-note div-music-main-note-minim">
                <div class="div-music-main-note-notehead div-music-main-note-notehead-minim" style="top:40px;"></div>
                <div class="div-music-main-note-notestemdown" style="top:40px;"></div>
            </div>`
            totalDuration += 2;
        } else if (note == 4) {
            console.log("S")
            notes += `
            <div class="div-music-main-note div-music-main-note-semibreve">
                <div class="div-music-main-note-notehead div-music-main-note-notehead-semibreve" style="top:40px;"></div>
            </div>`
            totalDuration += 4;
        } else {
            console.log("SC")
            notes += `
            <div class="div-music-main-note div-music-main-note-cont">
                ${crotchetExpand(note)}
            </div>`
            totalDuration += 1;
        }

        if (totalDuration%music.metre[0] == music.metre[3] && totalDuration!=0 && totalDuration!=music.metre[0]/(music.metre[1]-3)*music.metre[2]) {
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
    showMusic(music, details.depth);//{'metre':[4,4,2,0],'bars':[[[[[0.5],[0.5]],[1]],[2]],[[[1],[[0.5],[0.5]]],[[[0.5],[0.5]],[[0.5],[0.5]]]]]});
}

let detailsForMusic = {
    depth: 2, // 1 = crotchet+minim, 2 = quaver, 3 = semi
    metre: [2, 4, 2, 0], // Time sig, bars, anacrusis duration
    dots: false,
    ties: false,
    rests: false,
    triplets: false,
}

generateAndShowMusic(detailsForMusic);