// YouTube IFrame API ready callback
let player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    height: "600",
    width: window.innerWidth > 1200 ? "1200" : "100%",
    videoId: "k9ynZnEBtvw",
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
    playerVars: {
      autoplay: 0,
      controls: 0,
      rel: 0,
      modestbranding: 1,
      showinfo: 0,
      enablejsapi: 1,
      preload: 1,
    },
  });
}

function onPlayerReady(event) {
  console.log("Video ist bereit");
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.UNSTARTED) {
    document.getElementById("loader").classList.remove("hidden");
  } else {
    document.getElementById("loader").classList.add("hidden");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // --- Login-Prozess (index.html) ---
  const loginContainer = document.getElementById("login-container");
  if (loginContainer) {
    const emailInput = document.getElementById("email-input");
    const passwordInput = document.getElementById("password-input");
    const loginButton = document.getElementById("login-button");
    const loginError = document.getElementById("login-error");
    const startScreen = document.getElementById("start-screen");

    // Setze hier das gewünschte Passwort
    const correctPassword = "YourExperience"; // Beispielpasswort

    // Event-Listener für "Anmelden" Button
    loginButton.addEventListener("click", () => {
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      if (email === "" || password === "") {
        alert("Bitte E-Mail und Passwort eingeben.");
        return;
      }

      // Momentan wird das Passwort ignoriert und immer weitergeleitet
      // Um die Funktionalität zu testen, zeige eine Alarmnachricht und leite weiter
      alert("Login erfolgreich!");

      // Passwortcontainer ausblenden
      loginContainer.classList.add("hidden");

      // Startbildschirm anzeigen
      startScreen.classList.remove("hidden");
    });

    // Optional: Drücken der Enter-Taste zum Absenden
    emailInput.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        loginButton.click();
      }
    });

    passwordInput.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        loginButton.click();
      }
    });

    // Event-Listener für "Erlebnis starten" Button (index.html)
    const startButton = document.getElementById("start-button");
    if (startButton) {
      startButton.addEventListener("click", () => {
        // Setze das Flag in sessionStorage, um main.html anzuweisen, den Sound abzuspielen
        sessionStorage.setItem('playAmbience', 'true');
        // Navigiere zu main.html
        window.location.href = 'main.html';
      });
    }
  }

  // --- Funktionen für main.html ---
  const mainContent = document.getElementById("main-content");
  if (mainContent) {
    const soundModal = document.getElementById("sound-modal");
    const soundConfirmButton = document.getElementById("sound-confirm-button");
    const pauseButton = document.getElementById("pause-button");
    const playButton = document.getElementById("play-button");
    const videoContainer = document.getElementById("video-container");
    const downArrows = document.querySelectorAll(".clickable-down-arrow");
    const secretElement = document.getElementById("secret");

    const countdownSection = document.getElementById("countdown");
    const daysFront = document.getElementById("days-front");
    const daysBack = document.getElementById("days-back");
    const hoursFront = document.getElementById("hours-front");
    const hoursBack = document.getElementById("hours-back");
    const minutesFront = document.getElementById("minutes-front");
    const minutesBack = document.getElementById("minutes-back");
    const secondsFront = document.getElementById("seconds-front");
    const secondsBack = document.getElementById("seconds-back");

    const backToStartButton = document.getElementById("back-to-start");
    const startQuizButton = document.getElementById("start-quiz-button");

    // Hintergrundmusik für Sound-Modal
    const ambienceMusic = document.getElementById("ambience-music");
    ambienceMusic.volume = 0.6; // Setze die Lautstärke auf 60%

    // Start der Feuerfliegen-Animation
    initFireflies();

    // Prüfe, ob das Flag gesetzt ist, um den Sound abzuspielen
    if (sessionStorage.getItem('playAmbience') === 'true') {
      // Spiele den Sound ab
      ambienceMusic.play().then(() => {
        console.log("Hintergrundmusik gestartet.");
      }).catch((error) => {
        console.warn("Sound konnte nicht abgespielt werden:", error);
        // Optional: Benutzer informieren, dass der Sound nicht abgespielt werden konnte
      });
      // Entferne das Flag, um erneutes Abspielen zu verhindern
      sessionStorage.removeItem('playAmbience');
    }

    // Zeige Sound-Modal
    soundModal.classList.remove("hidden");

    // Event-Listener für Sound-Bestätigung
    soundConfirmButton.addEventListener("click", () => {
      // Sound ausfaden und stoppen
      fadeOutAudio(ambienceMusic, 2000); // Dauer in Millisekunden (hier 2 Sekunden)

      // Sound-Modal ausblenden
      soundModal.classList.add("hidden");

      // Hauptinhalt anzeigen
      mainContent.classList.remove("hidden");

      // Video-Container anzeigen und Video starten
      videoContainer.classList.remove("hidden");
      if (player && typeof player.playVideo === "function") {
        player.playVideo();
      }

      // Pause-Button anzeigen und Play-Button verstecken
      pauseButton.classList.remove("hidden");
      playButton.classList.add("hidden");

      // Countdown starten
      countdownSection.classList.remove("hidden");
      initCountdown();
    });

    // Pause-Button Event-Listener
    pauseButton.addEventListener("click", () => {
      if (player && typeof player.pauseVideo === "function") {
        player.pauseVideo();
        pauseButton.classList.add("hidden");
        playButton.classList.remove("hidden");
      }
    });

    // Play-Button Event-Listener
    playButton.addEventListener("click", () => {
      if (player && typeof player.playVideo === "function") {
        player.playVideo();
        playButton.classList.add("hidden");
        pauseButton.classList.remove("hidden");
      }
    });

    // Schwebender Pfeil Klick-Event nur für klickbare Pfeile
    downArrows.forEach((arrow) => {
      arrow.addEventListener("click", () => {
        const sections = document.querySelectorAll("section");
        const currentSection = arrow.closest("section");
        let currentIndex = Array.from(sections).indexOf(currentSection);

        if (currentIndex < sections.length - 1) {
          sections[currentIndex + 1].scrollIntoView({ behavior: "smooth" });
        } else {
          // Letzte Section erreicht, Button zum Start anzeigen
          backToStartButton.classList.remove("hidden");
          backToStartButton.scrollIntoView({ behavior: "smooth" });
        }
      });
    });

    // Back to Start Button Event-Listener
    backToStartButton.addEventListener("click", () => {
      const sections = document.querySelectorAll("section");
      if (sections.length > 0) {
        sections[0].scrollIntoView({ behavior: "smooth" });
        backToStartButton.classList.add("hidden");
      }
    });

    // Easter Egg: Geheimnachricht beim Klicken auf das geheime Element
    secretElement.addEventListener("click", () => {
      const modal = document.createElement("div");
      modal.classList.add("custom-modal");
      modal.innerHTML = `
        <p>🎉 Überraschung! Alles Gute zum Geburtstag! 🎉</p>
        <button class="cta-button">Schließen</button>
      `;
      document.body.appendChild(modal);

      const closeButton = modal.querySelector("button");
      closeButton.addEventListener("click", () => {
        document.body.removeChild(modal);
      });
    });

    startQuizButton.addEventListener("click", () => {
      window.location.href = 'quiz.html';
    });

    // Countdown-Funktion
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

    // Funktion zum Ausfaden des Audios
    function fadeOutAudio(audio, duration) {
      const fadeInterval = 50;
      const fadeStep = audio.volume / (duration / fadeInterval);

      const fadeAudio = setInterval(() => {
        if (audio.volume > fadeStep) {
          audio.volume -= fadeStep;
        } else {
          audio.volume = 0;
          audio.pause();
          clearInterval(fadeAudio);
        }
      }, fadeInterval);
    }

    // Dynamische Ladefunktion für Bilder in der Galerie
    function loadGalleryImages() {
      const galleryContainer = document.getElementById('gallery-container');
      // Verwenden einer JSON-Datei zur Auflistung der Bilder
      fetch('assets/Erinnerungen/images.json')
        .then(response => response.json())
        .then(images => {
          images.forEach((imageName) => {
            const imgElement = document.createElement('img');
            imgElement.src = `assets/Erinnerungen/${imageName}`;
            imgElement.alt = 'Erinnerung';
            galleryContainer.appendChild(imgElement);
          });
        })
        .catch(error => {
          console.error('Fehler beim Laden der Bilder:', error);
        });
    }

    // Feuerfliegen-Animation
    function initFireflies() {
      const firefliesCanvas = document.getElementById("fireflies");
      const ctx = firefliesCanvas.getContext("2d");
      const fireflies = [];
      const numFireflies = 80; // Mehr Feuerfliegen

      class Firefly {
        constructor() {
          this.reset();
        }

        reset() {
          this.x = Math.random() * firefliesCanvas.width;
          this.y = Math.random() * firefliesCanvas.height;
          this.radius = Math.random() * 3 + 1; // Größere Feuerfliegen
          this.alpha = Math.random() * 0.5 + 0.5; // Heller
          this.speedX = (Math.random() - 0.5) * 1; // Schnellere Bewegung
          this.speedY = (Math.random() - 0.5) * 1;
        }

        update() {
          this.x += this.speedX;
          this.y += this.speedY;
          // Grenzen überprüfen
          if (this.x > firefliesCanvas.width || this.x < 0 || this.y > firefliesCanvas.height || this.y < 0) {
            this.reset();
          }
        }

        draw(ctx) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 200, ${this.alpha})`;
          ctx.fill();
        }
      }

      for (let i = 0; i < numFireflies; i++) {
        fireflies.push(new Firefly());
      }

      function animateFireflies() {
        ctx.clearRect(0, 0, firefliesCanvas.width, firefliesCanvas.height);
        fireflies.forEach((firefly) => {
          firefly.update();
          firefly.draw(ctx);
        });
        requestAnimationFrame(animateFireflies);
      }

      function resizeFirefliesCanvas() {
        firefliesCanvas.width = window.innerWidth;
        firefliesCanvas.height = window.innerHeight;
        fireflies.forEach((firefly) => {
          firefly.reset();
        });
      }

      window.addEventListener("resize", resizeFirefliesCanvas);
      resizeFirefliesCanvas();
      animateFireflies();
    }

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

      function animateStarfield() {
        ctx.clearRect(0, 0, starfield.width, starfield.height);
        stars.forEach((star) => {
          star.update();
          star.draw(ctx);
        });
        requestAnimationFrame(animateStarfield);
      }

      function resizeStarfieldCanvas() {
        starfield.width = window.innerWidth;
        starfield.height = window.innerHeight;
        stars.forEach((star) => {
          star.reset();
        });
      }

      window.addEventListener("resize", resizeStarfieldCanvas);
      resizeStarfieldCanvas();
      animateStarfield();
    }

    // Initialisierung des Sternenhimmels
    initStarfield();

    // Lade die Bilder für die Galerie
    loadGalleryImages();
  }
});
