const RANDOM_SENTENCE_URL_API = "https://api.quotable.io/random";
const typeDisplay = document.getElementById("type-display");
const typeInput = document.getElementById("type-input");
const timer = document.getElementById("timer");

const typeSound = new Audio("./audio/typing-sound.mp3");
const wrongSound = new Audio("./audio/wrong.mp3");
const correctSound = new Audio("./audio/correct.mp3");

// inputテキスト入力。あっているかどうかの判定。
typeInput.addEventListener("input", () => {

    // タイプ音をつける
    typeSound.play();
    typeSound.currentTime = 0;

    const sentenceArray = typeDisplay.querySelectorAll("span");
    const arrayValue = typeInput.value.split("");
    let correct = true;

    sentenceArray.forEach((characterSpan, index) => {
        if((arrayValue[index] == null)) {
            characterSpan.classList.remove("correct");
            characterSpan.classList.remove("incorrect");
            correct = false;
        } else if (characterSpan.innerText == arrayValue[index]){
            characterSpan.classList.add("correct");
            characterSpan.classList.remove("incorrect");
        } else {
            characterSpan.classList.add("incorrect");
            characterSpan.classList.remove("correct");

            // 不正解音をつける
            wrongSound.play();
            wrongSound.currentTime = 0;

            correct = false;
        }
    })

    if (correct == true){
        correctSound.play();
        correctSound.currentTime = 0;
        RenderNextSentence();
    }
});


// 非同期でランダムな文章を取得する
function GetRandomSentence(){
    //URLからデータを読み込む
    return fetch(RANDOM_SENTENCE_URL_API)
    //データを受け取ってresponseという引数に入れ、それをjson形式に加工する
    //jsonはオブジェクト（連想配列）
    .then((response) => response.json())
    //json形式に加工したデータをdataという引数で受け取り、dataのcontent（中身）を抽出する
    .then((data) => data.content);
}

// ランダムな文章を取得して表示する
//非同期処理をするために、asyncとawaitを付け加える
async function RenderNextSentence(){
    const sentence = await GetRandomSentence();

    // typeDisplay.innerText = "";
    //文章を1文字ずつ分解して、spanタグを生成する
    let oneText = sentence.split("");

    //forEachは配列の中身を１つずつ取り出す関数
    oneText.forEach((character) => {
        //charcterの数だけspanタグを生成する
        const characterSpan = document.createElement("span");
        //spanタグの中にcharcterを入れる
        characterSpan.innerText = character;
        //typeDisplayの子要素にcharcterSpanを追加
        typeDisplay.appendChild(characterSpan); 
    });

    // テキストボックスの中身を消す
    typeInput.value = "";

    StartTimer();
}


let startTime;
let originTime = 50;
function StartTimer() {
    timer.innerText = originTime;
    startTime = new Date();
    setInterval(() => {
        timer.innerText = originTime - getTimerTime();
        if (timer.innerText <= 0) TimeUp();
    }, 1000);
}

function getTimerTime() {
    return Math.floor((new Date() - startTime) / 1000);
}
function TimeUp() {
    RenderNextSentence();
}


RenderNextSentence();