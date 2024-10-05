document.addEventListener("DOMContentLoaded", () => {
    const quizData = [
        { question: "In welchem Jahr wurde das Album 'The Dark Side of the Moon' veröffentlicht?", options: ["1970", "1973", "1975", "1979"], answer: 1 },
        { question: "Welches Instrument ist in dem Lied 'Money' prominent zu hören?", options: ["Saxophon", "Flöte", "Geige", "Orgel"], answer: 0 },
        { question: "Wie viele Songs enthält das Album 'The Dark Side of the Moon'?", options: ["8", "9", "10", "11"], answer: 1 },
        { question: "Wie lange hielt sich 'The Dark Side of the Moon' in den US-Charts?", options: ["200 Wochen", "500 Wochen", "700 Wochen", "900 Wochen"], answer: 3 },
        { question: "Welches Thema behandelt der Song 'Time' aus dem Album?", options: ["Krieg", "Liebe", "Zeit", "Natur"], answer: 2 },
        { question: "Welcher Song des Albums wird oft mit Wahnsinn und Isolation in Verbindung gebracht?", options: ["Brain Damage", "Money", "Time", "Us and Them"], answer: 0 },
        { question: "Wer war der ursprüngliche Frontmann von Pink Floyd?", options: ["Roger Waters", "David Gilmour", "Nick Mason", "Syd Barrett"], answer: 3 },
        { question: "Welches Pink Floyd-Album enthält den berühmten Song 'Comfortably Numb'?", options: ["Animals", "The Wall", "Wish You Were Here", "The Division Bell"], answer: 1 },
        { question: "Welcher Song von Pink Floyd beginnt mit dem Zitat 'I've always been mad, I know I've been mad'?", options: ["Time", "Brain Damage", "Shine On You Crazy Diamond", "Speak to Me"], answer: 3 },
        { question: "Welches Instrument spielte Richard Wright in der Band?", options: ["Gitarre", "Schlagzeug", "Keyboard", "Bass"], answer: 2 },
        { question: "Welcher Pink Floyd-Song handelt von Syd Barrett?", options: ["Shine On You Crazy Diamond", "Another Brick in the Wall", "Wish You Were Here", "Brain Damage"], answer: 0 },
        { question: "Welche Farbe hat das Licht auf dem berühmten Albumcover von 'The Dark Side of the Moon'?", options: ["Blau", "Grün", "Weiß", "Regenbogenfarben"], answer: 3 },
        { question: "Wie lautet der Titel des Films, der auf dem Album 'The Wall' basiert?", options: ["Echoes", "The Wall", "The Final Cut", "Division Bell"], answer: 1 },
        { question: "Welcher Pink Floyd-Song enthält den Satz 'We don't need no education'?", options: ["Comfortably Numb", "Money", "Another Brick in the Wall", "Wish You Were Here"], answer: 2 },
        { question: "Wie lautet der Vorname des Schlagzeugers von Pink Floyd?", options: ["Roger", "Nick", "David", "Richard"], answer: 1 }
    ];

    let currentQuiz = 0;
    let score = 0;

    const quizCard = document.getElementById("quiz-card");

    function loadQuiz() {
        quizCard.innerHTML = '';
        const questionData = quizData[currentQuiz];
        const questionElement = document.createElement("h2");
        questionElement.textContent = questionData.question;

        const optionsDiv = document.createElement("div");
        optionsDiv.classList.add("options");

        questionData.options.forEach((option, index) => {
            const label = document.createElement("label");
            const input = document.createElement("input");
            input.type = "radio";
            input.name = "option";
            input.value = index;
            const span = document.createElement("span");
            span.textContent = option;
            label.appendChild(input);
            label.appendChild(span);
            optionsDiv.appendChild(label);
        });

        const submitButton = document.createElement("button");
        submitButton.textContent = "Weiter";
        submitButton.classList.add("cta-button");

        const cancelButton = createCancelButton(); // Erstelle Abbrechen-Button

        quizCard.appendChild(questionElement);
        quizCard.appendChild(optionsDiv);
        quizCard.appendChild(submitButton);
        quizCard.appendChild(cancelButton); // Füge den Abbrechen-Button hinzu

        submitButton.addEventListener("click", () => {
            const selectedOption = document.querySelector('input[name="option"]:checked');
            if (selectedOption && parseInt(selectedOption.value) === questionData.answer) {
                score++;
            }
            currentQuiz++;
            if (currentQuiz < quizData.length) {
                loadQuiz();
            } else {
                showResult();
            }
        });
    }

    function showResult() {
        quizCard.innerHTML = `<h2>Du hast ${score} von ${quizData.length} Fragen richtig beantwortet!</h2>`;
        const restartButton = document.createElement("button");
        restartButton.textContent = "Quiz erneut starten";
        restartButton.classList.add("cta-button");

        const cancelButton = createCancelButton(); // Erstelle Abbrechen-Button für das Ergebnis

        restartButton.addEventListener("click", () => {
            currentQuiz = 0;
            score = 0;
            loadQuiz();
        });

        quizCard.appendChild(restartButton);
        quizCard.appendChild(cancelButton); // Füge den Abbrechen-Button hinzu
    }

    function createCancelButton() {
        const cancelButton = document.createElement("button");
        cancelButton.textContent = "Abbrechen";
        cancelButton.classList.add("cta-button");
        cancelButton.style.backgroundColor = "red"; // Farbe für "Abbrechen"-Button

        cancelButton.addEventListener("click", () => {
            if (confirm("Möchtest du das Quiz wirklich abbrechen und zur Hauptseite zurückkehren?")) {
                window.location.href = 'main.html'; // Zurück zur Hauptseite
            }
        });

        return cancelButton;
    }

    loadQuiz();
});
