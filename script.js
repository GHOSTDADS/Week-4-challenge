//initializing all the varibales needed
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
var timeLeft = 75;
var highscores = [];
var highscoreinput = [];
let timeInterval;
var pathname = location.pathname;
console.log(pathname);

//this array has all the questions and answers
var quizQA = [
    { question: "What does JS stand for?",
    answer: ["1. Javascript", "2. John silver", "3. Jabascradfgdfgsdgsdgdstch", "4. Jabsocks"],
    correct: 0
    },
    { question: "What is the correct syntax for referring to an external script called 'xxx.js'?",
    answer: ["<script name='xxx.js'>", "<script src='xxx.js'>", "<script href='xxx.js'>", "<script id='xxx.js'>"],
    correct: 1
    },
    { question: "How do you write 'Hello World' in an alert box?",
    answer: ["prompt('Hello World');", "msg('Hello World');", "alertbox('Hello World');", "alert('Hello World');"],
    correct: 3
    },
    { question: 'How do you call a function named "myFunction"?',
    answer: ["activate myFunction()", "var myFunction()", "call myFunction()", "myFunction()"],
    correct: 3
    },
    { question: 'How to write an IF statement for executing some code if "i" is NOT equal to 5?',
    answer: ["if (i <> 5)", "if (i != 5)  ", "if i =! 5 then", "if i <> 5"],
    correct: 1
    },
]


//runs code if on the index.html page
if (pathname == "/Week-4-challenge/index.html"){
//sets up the page for first load
function startup() {
    //clears out anything left on the page
    questionEl.innerHTML = "";
    answersEl.innerHTML = "";
    //starts to build the intial page look
    questionEl.textContent = "Welcome to the Quiz";
    //creates and attaches the test description to the div with the class "questionholder"
    var quizDescription = document.createElement("p");
    quizDescription.textContent = "Please press the 'Start Quiz' button to begin the quiz! you have 75 seconds to answer 5 quesions :) Your score will be the time left on your timer but WATCH OUT!! Each wrong answer will minus 15 seconds from your timer! Higher score is better! ";
    questionBox.appendChild(quizDescription);
    //creates and attaches the button to start the quiz to the index.html doc
    var startQuizButton = document.createElement('button');
    startQuizButton.setAttribute("data-start", "start");
    startQuizButton.textContent = "Start Quiz";
    answersEl.appendChild(startQuizButton);
    //checks to see if anything is in local storage and puts it into the score array.
    var storedHS = JSON.parse(localStorage.getItem("Score"));
    if (storedHS !== null){
        highscores = storedHS;
    }
}


//functions for index.html:
//function that runs to start the quiz
function startQuiz() {
    countdown();
    nextQuestion(x);
}


//this clears the page then creates the next  question and answer set.
function nextQuestion(a) {
    questionEl.innerHTML = "";
    answersEl.innerHTML = "";
    questionBox.children[1].innerHTML = "";
    //check if theres no more questions, if there isn't, then it ends the game
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

//this function ends the game.
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
    //creates and attaches the sentence saying the final score
    questionEl.textContent = "Your final score is " + score;
    questionBox.appendChild(formEl);
    //puts the timer value into the highscore array
    highscoreinput.push(score);
}

//this functions pushesthe highscore into local storage
function storeScores() {
    localStorage.setItem("Score", JSON.stringify(highscores));
}

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

//event listners
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
        timeLeft -= 15;
        x++;
        nextQuestion(x);
    }
})


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

//runs the initial page set up function.
startup();
}


//highscore.html scripting
//runs code if on highscore.html
if (pathname == "/Week-4-challenge/highscore.html"){
// scripting for highscore page

//this event listner looks to see if you click the "clear high scores" button and if so, clears local storage and re renders the page to remove the list.
highscoreBox.addEventListener("click", function(event){
    var element = event.target;
    var highscoreBTN = element.getAttribute("data-clear");
    console.log(highscoreBTN);
if (element.matches("button") === true && highscoreBTN == "clear"){
    localStorage.clear();
    highscores = JSON.parse(localStorage.getItem("Score"));
    renderHighscores();
} });


//this function renders the highscores to the page in a list.
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

//this fucntion does the initial set up for the page
// it checks to see if anything is in local storage then puts it into the highscores variable for use later
function startup(){
    var storedHS = JSON.parse(localStorage.getItem("Score"));
    if ( storedHS !== null){
        highscores = storedHS;
    }
    console.log(highscores);
    renderHighscores();
}

//runs the initial page set up function.
startup();
}