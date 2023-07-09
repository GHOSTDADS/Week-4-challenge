// three questions,
//store the score and initials. have a reset button.
//needs a timer
//needs random questions.
//2 html pages, index.html and highscores.html
//its just list items that have a listener event you can click to load the next item
var timerEl = document.getElementById('timer');
var questionEl = document.querySelector('.question');
var answersEl = document.querySelector('#answersButton');
var questionBox = document.querySelector('.questionholder');
var answerBox = document.querySelector('.answers');
var highscoreBox = document.querySelector("#highscore");
var highscoreEl = document.querySelector('.highscoreList');
var commentEl = document.querySelector('#comment');
formEl = document.createElement("form");
formEl.setAttribute("class", "highscoreInput");
labelEl = document.createElement("label");
inputEl = document.createElement("input");
inputEl.setAttribute("id", "intialInput");
labelEl.textContent = "Enter Initials:";
formEl.appendChild(labelEl);
formEl.appendChild(inputEl);
var x = 0;
var timeLeft = 5;
var highscores = [];
var highscoreinput = [];
let timeInterval;
var pathname = location.pathname;
console.log(location.pathname);

var quizQA = [
    { question: "What does JS stand for?",
    answer: ["1. Javascript", "2. John silver", "3. Jabascradfgdfgsdgsdgdstch", "4. Jabsocks"],
    correct: 0
    },
    { question: "What 2 ?",
    answer: ["1", "2", "3", "4"],
    correct: 2
    },
    { question: "What 3 ?",
    answer: ["1", "2", "3", "4"],
    correct: 3
    },
    { question: "What 4 ?",
    answer: ["1", "2", "3", "4"],
    correct: 3
    },
    { question: "What 5?",
    answer: ["1", "2", "3", "4"],
    correct: 1
    },
]


//runs code if on the index.html page
if (pathname == "/index.html"){
//sets up the page for first load
function startup() {
    questionEl.innerHTML = "";
    answersEl.innerHTML = "";
    questionEl.textContent = "Welcome to the Quiz";
    var quizDescription = document.createElement("p");
    quizDescription.textContent = "Please press the 'Start Quiz' button to begin the quiz! \n you have 60 seconds to answer 4 quesions :)";
    questionBox.appendChild(quizDescription);
    var startQuizButton = document.createElement('button');
    startQuizButton.setAttribute("data-start", "start");
    startQuizButton.textContent = "Start Quiz";
    answersEl.appendChild(startQuizButton);
    var storedHS = JSON.parse(localStorage.getItem("Score"));
    if (storedHS !== null){
        highscores = storedHS;
        console.log(highscores);
    }
}

// adds the listner for clicking on the buttons, first checks if its the start quiz button, then check if its an answer button and if its right or wrong.
answersEl.addEventListener("click", function(event) {
    var element = event.target;
    var start = element.getAttribute("data-start");
    var index = element.getAttribute("data-index");
    if (element.matches("button") === true && start == "start" ){
        startQuiz();
    } else if (element.matches("button") === true && index == quizQA[x].correct){
        console.log("correct!");
        commentEl.textContent = "Correct!";
        setTimeout(timeOut, 1000);
        x++;
        nextQuestion(x);
    } else if (element.matches("button") === true && index !== quizQA[x].correct){
        console.log("wrong!!");
        commentEl.textContent = "Wrong!";
        setTimeout(timeOut, 1000);
        timeLeft -= 5;
        x++;
        nextQuestion(x);
    }
})

function startQuiz() {
    countdown();
    nextQuestion(x);
}

function nextQuestion(a) {
    questionEl.innerHTML = "";
    answersEl.innerHTML = "";
    questionBox.children[1].innerHTML = "";
    //check if theres no more questions
    if (a > (quizQA.length - 1)){
        console.log("THE END");
        gameEnd();
        return;
    }

    var questionContent = quizQA[a].question;
    questionEl.textContent = questionContent;

    //creates list elements and attaches buttons to them that have the answers to the question on the screen
    //sets their data attribute so we can find which is the correct one when clicked.
    for (var i = 0; i < quizQA[a].answer.length; i++) {
        var answer = quizQA[a].answer[i];
        var li = document.createElement("li");
        var button = document.createElement("button");
        button.textContent = answer;
        button.setAttribute("data-index", i);
        li.appendChild(button);
        answersEl.appendChild(li);
    } 
}

function gameEnd(){
    //stops the timer.
    clearInterval(timeInterval);
    
    //clears the page
    questionEl.innerHTML = "";
    answersEl.innerHTML = "";
    questionBox.children[1].innerHTML = "";
    
    //captures the timer value
    var score = timeLeft;
    timerEl.textContent = timeLeft;
    questionEl.textContent = "Your final score is " + score;
    questionBox.appendChild(formEl);
    highscoreinput.push(score);
}

function storeScores() {
    localStorage.setItem("Score", JSON.stringify(highscores));
}

formEl.addEventListener("submit", function(event){
    event.preventDefault();
    var intialsInput = document.querySelector('#intialInput');
    var highscoreText = intialsInput.value.trim();
    //checks if field is blank and then returns if so.
    if (highscoreText === ""){
        return;
    }
    highscoreinput.push(highscoreText);
    highscoreinput = highscoreinput.join(" - ");
    highscores.push(highscoreinput);
    storeScores();
    window.location.href = 'highscore.html';
})


//function for the timer on the during quiz.
function countdown() {
    //the `setInterval()` method to call a function to be executed every 1000 milliseconds
    timeInterval = setInterval(function () {
      // As long as the `timeLeft` is greater or equal than 1
      if (timeLeft >= 1) {
        // Set the `textContent` of `timerEl` to show the remaining seconds
        timerEl.textContent = timeLeft;
        // Decrement `timeLeft` by 1
        timeLeft--;
      } else {
        // Once `timeLeft` gets to 0, set `timerEl` to an empty string
        timerEl.textContent = '';
        gameEnd()
        // Use `clearInterval()` to stop the timer
      }
    }, 1000);
}
//this functions removes the correct or wrong text on the screen.
function timeOut() {
    commentEl.innerHTML = "";
}

//runs the initial page set up function.
startup();
}

//runs code if on highscore.html
if (pathname == "/highscore.html"){
// scripting for highscore page
highscoreBox.addEventListener("click", function(event){
    var element = event.target;
    var highscoreBTN = element.getAttribute("data-clear");
    console.log(highscoreBTN);
if (element.matches("button") === true && highscoreBTN == "clear"){
    localStorage.clear();
    highscores = JSON.parse(localStorage.getItem("Score"));
    renderHighscores();
} });

function renderHighscores() {
    console.log(highscores);
    highscoreEl.innerHTML = "";
    for (let i = 0; i < highscores.length; i++){
        var highscore = highscores[i];

        var li = document.createElement("li");
        li.textContent = highscore;
        highscoreEl.appendChild(li);
    }
    
}

function startup(){
    var storedHS = JSON.parse(localStorage.getItem("Score"));
    if ( storedHS !== null){
        highscores = storedHS;
    }
    console.log(highscores);
    renderHighscores();
}

startup();
}