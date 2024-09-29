function onPageLoad(){
    createKeyCards();
    closeInfoBox();
    render('C');
}


function createKeyCards(){
    const allKeys = [
        'Ab Major / F Minor',
        'A Major / F# Minor',
        'Bb Major / G Minor',
        'B Major / G# Minor',
        'Cb Major / Ab Minor',
        'C Major / A Minor',
        'C# Major / A# Minor',
        'Db Major / Bb Minor',
        'D Major / B Minor',
        'Eb Major / C Minor',
        'E Major / C# Minor',
        'F Major / D Minor',
        'F# Major / D# Minor',
        'Gb Major / Eb Minor',
        'G Major / E Minor',
    ];

    const kc = document.getElementById("KeyCardsContainer");
    for(let k of allKeys) {
        kc.appendChild(createCard(k, onKeyCardClick));
    }
}

function createCard(text, clickHandler) {
    const noteCard = document.createElement("div");
    noteCard.innerHTML = text;
    noteCard.onclick = clickHandler;
    noteCard.className = "note_card";
    return noteCard;
}

function onKeyCardClick(e){
    if(!TEST_IS_ACTIVE){
        return;
    }
    const card = e.currentTarget;
    //console.log(card.innerHTML);
    const clickedKey = card.innerHTML.split(" ")[0];
    if(clickedKey === TEST_KEY){
        updateScore(CORRECT_ANSWERS + 1, INCORRECT_ANSWERS);
        pickRandomKey();
    }
    else{
        updateScore(CORRECT_ANSWERS, INCORRECT_ANSWERS + 1);
    }
}

function closeInfoBox() {
    document.getElementById("infobox").style.display = 'none';
}


// rendering notes
function render(key) {
    const canvas = document.createElement('canvas');
    canvas.className = "renderCanvas";
    const container = document.getElementById("renderedNote");
    container.innerHTML = "";
    container.appendChild(canvas);

    const { Renderer, Stave, StaveConnector } = Vex.Flow;
    const renderer = new Renderer(canvas, Renderer.Backends.CANVAS);

    renderer.resize(400, 250);
    const context = renderer.getContext();
    //context.setFont('Arial', 10);

    const trebleStave = new Stave(30, 10, 350);
    trebleStave.addClef("treble").setKeySignature(key);
    trebleStave.setContext(context).draw();

    const bassStave = new Stave(30, 120, 350);
    bassStave.addClef("bass").setKeySignature(key);
    bassStave.setContext(context).draw();

    new StaveConnector(trebleStave, bassStave).setType('single').setContext(context).draw();
    new StaveConnector(trebleStave, bassStave).setType('brace').setContext(context).draw();
    new StaveConnector(trebleStave, bassStave).setType('singleRight').setContext(context).draw();
}

// test itself
let TEST_IS_ACTIVE = false;
let CORRECT_ANSWERS = 0;
let INCORRECT_ANSWERS = 0;
let TEST_KEY = "";


function startTesting() {
    TEST_IS_ACTIVE = true;
    updateScore(0, 0);
    pickRandomKey();
    closeInfoBox();
}


const ALL_KEYS = [
    'C',
    'G', 'D', 'A', 'E', 'B', 'F#', 'C#', // sharp keys
    'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb' // flat keys
];


function pickRandomKey(){
    const key = getRandomArrayElement(ALL_KEYS);
    TEST_KEY = key;
    render(key);
}

function stopTesting(){
    if(!TEST_IS_ACTIVE){
        return;
    }
    TEST_IS_ACTIVE = false;
    updateScore(0, 0);
    render("treble", "C");
}


function getRandomArrayElement(arr){
    return arr[Math.floor(Math.random() * arr.length)];
}


function updateScore(newCorrectAnswers, newIncorrectAnswers){
    if(CORRECT_ANSWERS !== newCorrectAnswers){
        CORRECT_ANSWERS = newCorrectAnswers;
        document.getElementById('correct_answers').innerHTML =
            `<span class="right_answer">Correct: ${CORRECT_ANSWERS}</span>`;
    }
    if(INCORRECT_ANSWERS !== newIncorrectAnswers){
        INCORRECT_ANSWERS = newIncorrectAnswers;
        document.getElementById('incorrect_answers').innerHTML =
            `<span class="wrong_answer">Incorrect: ${INCORRECT_ANSWERS}</span>`;
    }
}

