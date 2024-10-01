// YouTube IFrame API ready callback
let player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    height: "338",
    width: "600",
    videoId: "k9ynZnEBtvw", // Ersetze mit deinem YouTube Video-ID
    events: {
      onReady: onPlayerReady,
    },
    playerVars: {
      autoplay: 1,
      controls: 0,
      rel: 0,
      modestbranding: 1,
      showinfo: 0,
      enablejsapi: 1,
    },
  });
}

function onPlayerReady(event) {
  // Video pausieren, bis der Nutzer auf "Erlebnis starten" klickt
  player.stopVideo();
}

document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("start-button");
  const startScreen = document.getElementById("start-screen");
  const experience = document.getElementById("experience");
  const quizStartSection = document.getElementById("quiz-start-section");
  const quizStartButton = document.getElementById("start-quiz-button");
  const quizSection = document.getElementById("quiz");
  const quizResultSection = document.getElementById("quiz-result");
  const countdownSection = document.getElementById("countdown");
  const loader = document.getElementById("loader"); // Ladebildschirm

  const passwordContainer = document.getElementById("password-container");
  const passwordInput = document.getElementById("password-input");
  const passwordSubmit = document.getElementById("password-submit");
  const passwordError = document.getElementById("password-error");

  const pauseButton = document.getElementById("pause-button");
  const playButton = document.getElementById("play-button");
  const videoContainer = document.getElementById("video-container");

  const quizContainer = document.getElementById("quiz-container");
  const quizResultText = document.getElementById("result-text");
  const restartQuizButton = document.getElementById("restart-quiz");
  const backToStartButton = document.getElementById("back-to-start");

  const daysFront = document.getElementById("days-front");
  const daysBack = document.getElementById("days-back");
  const hoursFront = document.getElementById("hours-front");
  const hoursBack = document.getElementById("hours-back");
  const minutesFront = document.getElementById("minutes-front");
  const minutesBack = document.getElementById("minutes-back");
  const secondsFront = document.getElementById("seconds-front");
  const secondsBack = document.getElementById("seconds-back");

  const secretElement = document.getElementById("secret");

  const soundModal = document.getElementById("sound-modal");
  const soundConfirmButton = document.getElementById("sound-confirm-button");

  const correctPassword = "YourExperience"; // Setze hier das gewünschte Passwort

  let hasStarted = false; // Flag, um zu überprüfen, ob der Startscreen bereits verlassen wurde

  // Passwortschutz-Event-Listener
  passwordSubmit.addEventListener("click", () => {
    if (passwordInput.value === correctPassword) {
      console.log("Richtiges Passwort");
      passwordContainer.style.display = "none"; // Passwortfeld ausblenden
      loader.style.display = "none"; // Ladebildschirm ausblenden
      document.getElementById("main-content").classList.remove("hidden"); // Hauptinhalt anzeigen
      initStarfield(); // Sternenhimmel initialisieren
    } else {
      console.log("Falsches Passwort");
      passwordError.classList.remove("hidden"); // Fehlermeldung anzeigen
    }
  });

  // Optional: Drücken der Enter-Taste zum Absenden
  passwordInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      passwordSubmit.click(); // Bei Enter-Taste auch bestätigen
    }
  });

  // Klick auf "Erlebnis starten"
  startButton.addEventListener("click", () => {
    if (hasStarted) return; // Verhindert erneutes Starten
    hasStarted = true;

    console.log("Button gedrückt");

    // Startscreen ausblenden
    startScreen.classList.add("hidden");

    // Erlebnisbereich anzeigen
    experience.classList.remove("hidden");

    // Automatisch zum Erlebnisbereich scrollen
    experience.scrollIntoView({ behavior: "smooth" });

    // Zeige Sound-Modal vor dem Start
    soundModal.classList.remove("hidden");
  });

  // Bestätigen der Tonaktivierung
  soundConfirmButton.addEventListener("click", () => {
    soundModal.classList.add("hidden");

    // Video-Container anzeigen und Video starten
    videoContainer.classList.remove("hidden");
    player.playVideo();

    // Pause-Button anzeigen und Play-Button verstecken
    pauseButton.classList.remove("hidden");
    playButton.classList.add("hidden");

    // Quiz-Start-Button anzeigen
    quizStartSection.classList.remove("hidden");

    // Countdown starten
    countdownSection.classList.remove("hidden");
    initCountdown();
  });

  // Pause-Button Event-Listener
  pauseButton.addEventListener("click", () => {
    if (player && typeof player.pauseVideo === "function") {
      player.pauseVideo();
      console.log("Video pausiert");
      pauseButton.classList.add("hidden"); // Pause-Button verstecken
      playButton.classList.remove("hidden"); // Play-Button anzeigen
    }
  });

  // Play-Button Event-Listener
  playButton.addEventListener("click", () => {
    if (player && typeof player.playVideo === "function") {
      player.playVideo();
      console.log("Video abgespielt");
      playButton.classList.add("hidden"); // Play-Button verstecken
      pauseButton.classList.remove("hidden"); // Pause-Button anzeigen
    }
  });

  // Start Quiz Button Event-Listener
  quizStartButton.addEventListener("click", () => {
    console.log("Quiz starten Button geklickt");
    quizStartSection.classList.add("hidden"); // Verstecke den Quiz Start Section
    quizSection.classList.remove("hidden"); // Zeige das Quiz an
    quizSection.classList.add("animated"); // Füge Animation hinzu
    quizSection.scrollIntoView({ behavior: "smooth" }); // Scrollen zum Quiz
    loadQuiz(); // Lade die Quizfragen
  });

  // Funktion zum Laden des Quiz
  // Funktion zum Laden des Quiz
  function loadQuiz() {
    const quizData = [
      // Fragen zum Album "The Dark Side of the Moon"
      {
        question:
          "In welchem Jahr wurde das Album 'The Dark Side of the Moon' veröffentlicht?",
        options: ["1970", "1973", "1975", "1979"],
        answer: 1,
      },
      {
        question:
          "Welches Instrument ist in dem Lied 'Money' prominent zu hören?",
        options: ["Saxophon", "Flöte", "Geige", "Orgel"],
        answer: 0,
      },
      {
        question:
          "Wie viele Songs enthält das Album 'The Dark Side of the Moon'?",
        options: ["8", "9", "10", "11"],
        answer: 1,
      },
      {
        question:
          "Wie lange hielt sich 'The Dark Side of the Moon' in den US-Charts?",
        options: ["200 Wochen", "500 Wochen", "700 Wochen", "900 Wochen"],
        answer: 3,
      },
      {
        question: "Welches Thema behandelt der Song 'Time' aus dem Album?",
        options: ["Krieg", "Liebe", "Zeit", "Natur"],
        answer: 2,
      },
      {
        question:
          "Welcher Song des Albums wird oft mit Wahnsinn und Isolation in Verbindung gebracht?",
        options: ["Brain Damage", "Money", "Time", "Us and Them"],
        answer: 0,
      },

      // Allgemeine Fragen zu Pink Floyd
      {
        question: "Wer war der ursprüngliche Frontmann von Pink Floyd?",
        options: ["Roger Waters", "David Gilmour", "Nick Mason", "Syd Barrett"],
        answer: 3,
      },
      {
        question:
          "Welches Pink Floyd-Album enthält den berühmten Song 'Comfortably Numb'?",
        options: [
          "Animals",
          "The Wall",
          "Wish You Were Here",
          "The Division Bell",
        ],
        answer: 1,
      },
      {
        question:
          "Welcher Song von Pink Floyd beginnt mit dem Zitat 'I've always been mad, I know I've been mad'?",
        options: [
          "Time",
          "Brain Damage",
          "Shine On You Crazy Diamond",
          "Speak to Me",
        ],
        answer: 3,
      },
      {
        question: "Welches Instrument spielte Richard Wright in der Band?",
        options: ["Gitarre", "Schlagzeug", "Keyboard", "Bass"],
        answer: 2,
      },
      {
        question: "Welcher Pink Floyd-Song handelt von Syd Barrett?",
        options: [
          "Shine On You Crazy Diamond",
          "Another Brick in the Wall",
          "Wish You Were Here",
          "Brain Damage",
        ],
        answer: 0,
      },
      {
        question:
          "Welche Farbe hat das Licht auf dem berühmten Albumcover von 'The Dark Side of the Moon'?",
        options: ["Blau", "Grün", "Weiß", "Regenbogenfarben"],
        answer: 3,
      },
      {
        question:
          "Wie lautet der Titel des Films, der auf dem Album 'The Wall' basiert?",
        options: ["Echoes", "The Wall", "The Final Cut", "Division Bell"],
        answer: 1,
      },
      {
        question:
          "Welcher Pink Floyd-Song enthält den Satz 'We don't need no education'?",
        options: [
          "Comfortably Numb",
          "Money",
          "Another Brick in the Wall",
          "Wish You Were Here",
        ],
        answer: 2,
      },
      {
        question: "Wie lautet der Vorname des Schlagzeugers von Pink Floyd?",
        options: ["Roger", "Nick", "David", "Richard"],
        answer: 1,
      },
      {
        question: "Welcher der folgenden Songs ist kein Instrumentalstück?",
        options: [
          "On the Run",
          "Echoes",
          "A Saucerful of Secrets",
          "Set the Controls for the Heart of the Sun",
        ],
        answer: 3,
      },
    ];

    quizContainer.innerHTML = ""; // Leere den Quiz-Bereich
    currentQuiz = 0;
    score = 0;
    showQuestion(quizData[currentQuiz], quizData);
  }

  let currentQuiz = 0;
  let score = 0;
  let quizDataGlobal = [];

  function showQuestion(questionData, quizData) {
    quizDataGlobal = quizData;
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("quiz-question", "active");

    const questionTitle = document.createElement("p");
    questionTitle.textContent = `${currentQuiz + 1}. ${questionData.question}`;
    questionDiv.appendChild(questionTitle);

    const optionsDiv = document.createElement("div");
    optionsDiv.classList.add("options");

    questionData.options.forEach((option, i) => {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "radio";
      input.name = `question${currentQuiz}`;
      input.value = i;
      const span = document.createElement("span");
      span.textContent = option;
      label.appendChild(input);
      label.appendChild(span);
      optionsDiv.appendChild(label);
    });

    questionDiv.appendChild(optionsDiv);
    quizContainer.appendChild(questionDiv);

    // Wenn nicht die letzte Frage, zeige "Weiter" Button, sonst "Quiz abschließen"
    const nextButton = document.createElement("button");
    nextButton.textContent =
      currentQuiz < quizData.length - 1 ? "Weiter" : "Quiz abschließen";
    nextButton.classList.add("cta-button");
    nextButton.style.marginTop = "20px";
    questionDiv.appendChild(nextButton);

    nextButton.addEventListener("click", () => {
      const selected = document.querySelector(
        `input[name="question${currentQuiz}"]:checked`
      );
      if (selected) {
        if (parseInt(selected.value) === questionData.answer) {
          score++;
        }
        // Entferne die aktuelle Frage
        questionDiv.classList.remove("active");
        questionDiv.classList.add("hidden");
        // Zeige nächste Frage oder Ergebnis
        currentQuiz++;
        if (currentQuiz < quizData.length) {
          showQuestion(quizData[currentQuiz], quizData);
        } else {
          showResult();
        }
      } else {
        alert("Bitte wähle eine Antwort aus.");
      }
    });
  }

  function showResult() {
    quizSection.classList.add("hidden");
    quizResultSection.classList.remove("hidden");
    quizResultSection.scrollIntoView({ behavior: "smooth" }); // Scrollen zum Ergebnis
    quizResultText.textContent = `Du hast ${score} von ${quizDataGlobal.length} Fragen richtig beantwortet!`;
  }

  // Quiz neu starten
  restartQuizButton.addEventListener("click", () => {
    quizResultSection.classList.add("hidden");
    quizSection.classList.remove("hidden");
    quizSection.scrollIntoView({ behavior: "smooth" }); // Scrollen zum Quiz
    loadQuiz();
  });

  // Zurück zur Startseite Button
  backToStartButton.addEventListener("click", () => {
    quizResultSection.classList.add("hidden");
    startScreen.classList.remove("hidden");
    quizStartSection.classList.remove("hidden"); // Stelle sicher, dass der "Quiz starten" Button wieder sichtbar ist
    startScreen.scrollIntoView({ behavior: "smooth" });

    // Setze hasStarted nicht zurück, damit der Startscreen nicht erneut zugänglich ist
    // hasStarted = false; // Entferne oder kommentiere diese Zeile
  });

  // Countdown
  function initCountdown() {
    countdown();
    setInterval(countdown, 1000);
  }

  function countdown() {
    const eventDate = new Date("2024-10-12T20:22:45"); // Ersetze durch das Datum der Veranstaltung
    const now = new Date();
    const timeLeft = eventDate - now;

    if (timeLeft > 0) {
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
      const seconds = Math.floor((timeLeft / 1000) % 60);

      updateFlipCard(daysFront, daysBack, days);
      updateFlipCard(hoursFront, hoursBack, hours);
      updateFlipCard(minutesFront, minutesBack, minutes);
      updateFlipCard(secondsFront, secondsBack, seconds);
    } else {
      countdownSection.querySelector("h2").textContent =
        "Die Show hat begonnen!";
      document.getElementById("timer").style.display = "none";
    }
  }

  function updateFlipCard(front, back, newValue) {
    if (front.textContent !== newValue.toString()) {
      back.textContent = newValue.toString();
      const flipInner = front.parentElement;
      flipInner.classList.add("flipping");

      setTimeout(() => {
        front.textContent = newValue.toString();
        flipInner.classList.remove("flipping");
      }, 600); // Dauer der Flip-Animation
    }
  }

  // Easter Egg: Geheimnachricht beim Klicken auf ein bestimmtes Element
  secretElement.addEventListener("click", () => {
    // Verbessertes Easter Egg: Zeige ein Modal mit einer Nachricht
    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.backgroundColor = "rgba(0,0,0,0.9)";
    modal.style.color = "#fff";
    modal.style.padding = "20px";
    modal.style.borderRadius = "10px";
    modal.style.zIndex = "100";
    modal.style.textAlign = "center";
    modal.style.animation = "fadeIn 1s";

    const message = document.createElement("p");
    message.textContent = "🎉 Überraschung! Alles Gute zum Geburtstag! 🎉";
    message.style.fontSize = "20px";
    message.style.marginBottom = "20px";

    const closeButton = document.createElement("button");
    closeButton.textContent = "Schließen";
    closeButton.classList.add("cta-button");
    closeButton.style.backgroundColor = "#ff0000";
    closeButton.style.color = "#fff";
    closeButton.style.padding = "10px 20px";
    closeButton.style.border = "none";
    closeButton.style.borderRadius = "5px";
    closeButton.style.cursor = "pointer";
    closeButton.style.transition = "background-color 0.3s, transform 0.3s";
    closeButton.addEventListener("mouseenter", () => {
      closeButton.style.backgroundColor = "#cc0000";
      closeButton.style.transform = "scale(1.05)";
    });
    closeButton.addEventListener("mouseleave", () => {
      closeButton.style.backgroundColor = "#ff0000";
      closeButton.style.transform = "scale(1)";
    });

    closeButton.addEventListener("click", () => {
      document.body.removeChild(modal);
    });

    modal.appendChild(message);
    modal.appendChild(closeButton);
    document.body.appendChild(modal);
  });

  // Sternenhimmel-Animation
  function initStarfield() {
    const starfield = document.getElementById("starfield");
    const ctx = starfield.getContext("2d");
    const stars = [];
    const numStars = 200;

    class Star {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * starfield.width;
        this.y = Math.random() * starfield.height;
        this.radius = Math.random() * 1.5;
        this.alpha = Math.random();
        this.speed = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.y += this.speed;
        if (this.y > starfield.height) {
          this.reset();
          this.y = 0;
        }
      }

      draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < numStars; i++) {
      stars.push(new Star());
    }

    function animate() {
      ctx.clearRect(0, 0, starfield.width, starfield.height);
      stars.forEach((star) => {
        star.update();
        star.draw(ctx);
      });
      requestAnimationFrame(animate);
    }

    function resizeCanvas() {
      starfield.width = window.innerWidth;
      starfield.height = window.innerHeight;
      stars.forEach((star) => {
        star.reset();
      });
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    animate();
  }

  // Navigation mit Pfeiltasten
  document.addEventListener("keydown", (event) => {
    const sections = document.querySelectorAll("section");
    const activeSection = Array.from(sections).find(
      (section) => !section.classList.contains("hidden")
    );
    let index = Array.from(sections).indexOf(activeSection);

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (index < sections.length - 1) {
        for (let i = index + 1; i < sections.length; i++) {
          if (!sections[i].classList.contains("hidden")) {
            sections[i].scrollIntoView({ behavior: "smooth" });
            break;
          }
        }
      }
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (index > 0) {
        for (let i = index - 1; i >= 0; i--) {
          if (!sections[i].classList.contains("hidden")) {
            sections[i].scrollIntoView({ behavior: "smooth" });
            break;
          }
        }
      }
    }
  });
});
