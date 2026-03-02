const quizData = {
    title: "Quiz Application", 
    questions: [
        {
            text: "Which HTML element is used to link an external JavaScript file?",
            choices: [
                { label: "<js>", isCorrect: false},
                { label: "<script>", isCorrect: true},
                { label: "<javascript>", isCorrect: false},
                { label: "<link>", isCorrect: false }
            ]
        },
        {
            text: "What does the DOM represent?",
            choices: [
                { label: "A CSS framework", isCorrect: false },
                { label: "A database system", isCorrect: false }, 
                { label: "The page structure as objects you can manipulate", isCorrect: true },
                { label: "A JavaScript compiler", isCorrect: false } 
            ]
        }, 
        {
            text: "Which event is fired when a button is clicked?",
            choices: [
                { label: "hover", isCorrect: false },
                { label: "press", isCorrect: false },
                { label: "click", isCorrect: true },
                { label: "submit", isCorrect: false }
            ] 
        }, 
        {
            text: "Which keyboard is used to declare a block-scoped variable?",
            choices: [
                { label: "var", isCorrect: false },
                { label: "let", isCorrect: true },
                { label: "define", isCorrect: false },
                { label: "int", isCorrect: false }
            ]
        },
        {
            text: "Which array method returns the first item that matches a condition?", 
            choices: [
                { label: "filter()", isCorrect: false },
                { label: "find()", isCorrect: true },
                { label: "map()", isCorrect: false },
                { label: "reduce()", isCorrect: false }
            ]
        }
    ]
};

let currentIndex = 0;
let correctCount = 0;
let incorrectCount = 0;
let hasAttemptedCurrentQuestion = false;

const questionTextE1 = document.getElementById("questionText");
const answersFormEl = document.getElementById("answersForm");
const feeedbackE1 = document.getElementById("feedback");

const correctCountE1 =  document.getElementById("correctCount");
const  incorrectCountE1 = document.getElementById("incorrectCount");

const questionNumberE1 = document.getElementById("questionNumber");
const questionTotalE1 = document.getElementById("questionTotal");

const checkBtn = document.getElementById("checkBtn");
const nextBtn = document.getElementById("nextBtn");


checkBtn.addEventListener("click", handleCheckAnswer);
nextBtn.addEventListener("click", handleNextQuestion);
answersFormEl.addEventListener("change", handleAnswerSelectionChange);

initializeQuiz() ;

function initializeQuiz() {
    questionTotalE1.textContent = `of ${quizData.questions.length}`;
    renderQuestion();
    updateScoreboard();
}

function renderQuestion() {
    const question = quizData.questions[currentIndex];
    hasAttemptedCurrentQuestion = false;
    feeedbackE1.textContent = "";
    nextBtn.disabled = true;
    checkBtn.disabled = true;

    questionNumberE1.textContent = `Question ${currentIndex + 1}`;
    questionTextE1.textContent = question.text;

    answersFormEl.innerHTML = "";

    question.choices.forEach((choice, idx) => {
        const optionId = `q${currentIndex}_choice${idx}`;

        const label = document.createElement("label");
        label.className = "answer";
        label.setAttribute("for", optionId);

        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "answer";
        radio.id = optionId;
        radio.value = String(idx);

        const span = document.createElement("span");
        span.textContent = choice.label;

        label.appendChild(radio);
        label.appendChild(span);
        answersFormEl.appendChild(label);
    });
}

function handleAnswerSelectionChange() {
    if (!hasAttemptedCurrentQuestion) {
        checkBtn.disabled = !getSelectedChoiceIndex().isSelected;
    }
}

function handleCheckAnswer() {
    if (hasAttemptedCurrentQuestion) return;

    const { isSelected, index } = getSelectedChoiceIndex();
    if (!isSelected) {
        showToast("Pick an answer first.");
        return;
    }

    hasAttemptedCurrentQuestion = true;
    checkBtn.disabled = true;
    nextBtn.disabled =false;

    const question = quizData.questions[currentIndex];
    const selectedChoice = question.choices[index];
    const correctChoiceIndex = question.choices.findIndex(c => c.isCorrect);

    highlightCorrectAnswer(correctChoiceIndex);
    lockAnswerInputs();

    if (selectedChoice.isCorrect) {
        correctCount++;
        feeedbackE1.textContent = "Correct!";
    } else {
        incorrectCount++;
        feeedbackE1.textContent = "Incorrect. ";
        highlightIncorrectSelection(index, correctChoiceIndex);
    }

    updateScoreboard();
}

function handleNextQuestion() {
    if (!hasAttemptedCurrentQuestion) {
        showToast("Check your answer before moving on.");
        return;
    }

    currentIndex++;

    if (currentIndex >= quizData.questions.length) {
        showFinalScore();
        return;
    }

    renderQuestion();
}

function getSelectedChoiceIndex() {
    const selected = document.querySelector('input[name="answer"]:checked');
    if (!selected) return { isSelected: false, index: -1 };
    return { isSelected: true, index: Number(selected.value)};
}

function  updateScoreboard() {
    correctCountE1.textContent = String(correctCount);
    incorrectCountE1.textContent = String(incorrectCount);
}

function highlightCorrectAnswer(correctIndex) {
    const allLabels = Array.from(answersFormEl.querySelectorAll(".answer"));
    allLabels[correctIndex].classList.add("correct");
}

function highlightIncorrectSelection(selectedIndex, correctIndex) {
    if (selectedIndex === correctIndex) return;

    const allLabels = Array.from(answersFormEl.querySelectorAll(".answer"));
    allLabels[selectedIndex].classList.add("incorrect");
}

function lockAnswerInputs() {
    const radios = answersFormEl.querySelectorAll('input[name="answer"]');
    radios.forEach(r => (r.disabled = true));

    const labels = answersFormEl.querySelectorAll(".answer");
    labels.forEach(l => l.classList.add("disabled"));
}

function showFinalScore() {
    const total = quizData.questions.length;

    Swal.fire({
        icon: "info",
        title: "Quiz Complete!",
        html: `
        <p><strong>Final Results</strong></p>
        <p> Correct: <strong>${correctCount}</strong></p>
        <p> Incorrect: <strong>${incorrectCount}</strong></p>
        <p> Score: <strong>${correctCount}</strong> / <strong>${total}</strong></p>
        `,
        confirmButtonText: "Restart Quiz"
    }).then(() => restartQuiz());
}

function restartQuiz() {
    currentIndex = 0;
    correctCount = 0;
    incorrectCount = 0;
    updateScoreboard();
    renderQuestion();
}

function showToast(message) {
    Swal.fire({
        toast: true, 
        position: "top",
        icon: "warning",
        title: message,
        showConfirmButton: false,
        timer: 1600,
        timerProgressBar: true
    });
}