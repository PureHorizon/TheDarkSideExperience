// Firebase-Konfiguration
const firebaseConfig = {
    apiKey: "AIzaSyCxudE-0h2wvVHARfXU8FrGwhK2BDakFgk",
    authDomain: "thedarksideexperience-58792.firebaseapp.com",
    projectId: "thedarksideexperience-58792",
    storageBucket: "thedarksideexperience-58792.appspot.com",
    messagingSenderId: "927396544039",
    appId: "1:927396544039:web:5e8b56621447a8c5055802"
};

// Firebase initialisieren
firebase.initializeApp(firebaseConfig);
console.log("Firebase wurde initialisiert.");

// Firebase Auth initialisieren
const auth = firebase.auth();
console.log("Firebase Auth wurde initialisiert.");

// YouTube IFrame API ready callback
let player;

// Diese Funktion muss global sein
function onYouTubeIframeAPIReady() {
    console.log("YouTube IFrame API ist bereit.");
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
        console.log("Loader angezeigt.");
    } else {
        document.getElementById("loader").classList.add("hidden");
        console.log("Loader versteckt.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded ausgelöst.");

    // --- Login-Prozess ---
    const loginContainer = document.getElementById("login-container");
    if (loginContainer) {
        console.log("Login-Container gefunden.");
        const emailInput = document.getElementById("email-input");
        const passwordInput = document.getElementById("password-input");
        const loginButton = document.getElementById("login-button");
        const loginError = document.getElementById("login-error");
        const startScreen = document.getElementById("start-screen");

        // Event-Listener für "Anmelden" Button
        loginButton.addEventListener("click", () => {
            console.log("Login-Button wurde geklickt.");
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            if (email === "" || password === "") {
                alert("Bitte E-Mail und Passwort eingeben.");
                console.log("E-Mail oder Passwort fehlt.");
                return;
            }

            // Firebase Login
            console.log("Versuche, den Benutzer anzumelden...");
            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Erfolgreich angemeldet
                    const user = userCredential.user;
                    console.log("Anmeldung erfolgreich:", user);
                    alert("Anmeldung erfolgreich!");
                    sessionStorage.setItem('loggedIn', 'true'); // Setze den Anmeldestatus
                    loginContainer.classList.add("hidden");
                    startScreen.classList.remove("hidden");
                    console.log("Startbildschirm angezeigt.");
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.error("Fehler bei der Anmeldung:", errorCode, errorMessage);
                    alert("Fehler bei der Anmeldung: " + errorMessage);
                });
        });

        // Enter-Taste für Eingabefelder aktivieren
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

        // Start-Button Event-Listener
        const startButton = document.getElementById("start-button");
        if (startButton) {
            startButton.addEventListener("click", () => {
                console.log("Start-Button wurde geklickt.");
                sessionStorage.setItem('playAmbience', 'true');
                window.location.href = 'main.html'; // Navigiere zu main.html
            });
        }
    }

    // --- Funktionen für main.html ---
    const mainContent = document.getElementById("main-content");
    const starfieldCanvas = document.getElementById("starfield");
    const soundModal = document.getElementById("sound-modal");
    const quitQuizButton = document.getElementById("quit-quiz-button");

    if (mainContent) {
        console.log("main-content erkannt.");

        // Überprüfe den Anmeldestatus
        if (sessionStorage.getItem('loggedIn') !== 'true') {
            console.log("Anmeldestatus nicht gesetzt. Weiterleitung zur Login-Seite.");
            alert("Bitte logge dich zuerst ein.");
            window.location.href = 'index.html'; // Leite zur Login-Seite weiter
            return;
        } else {
            console.log("Anmeldestatus bestätigt.");
        }

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
        ambienceMusic.volume = 0.6;

        if (sessionStorage.getItem('playAmbience') === 'true') {
            console.log("playAmbience gefunden. Spiele Hintergrundmusik ab.");
            ambienceMusic.play().then(() => {
                console.log("Hintergrundmusik gestartet.");
            }).catch((error) => {
                console.warn("Sound konnte nicht abgespielt werden:", error);
            });
            sessionStorage.removeItem('playAmbience');
        }

        // Zeige das Sound-Modal
        soundModal.classList.remove("hidden");
        console.log("Sound-Modal wird angezeigt.");

        soundConfirmButton.addEventListener("click", () => {
            console.log("sound-confirm-button wurde geklickt.");
            fadeOutAudio(ambienceMusic, 2000);
            soundModal.classList.add("hidden");
            mainContent.classList.remove("hidden");
            starfieldCanvas.classList.remove("hidden");
            initStarfield();

            videoContainer.classList.remove("hidden");
            if (player && typeof player.playVideo === "function") {
                player.playVideo();
                console.log("YouTube-Video gestartet.");
            }

            pauseButton.classList.remove("hidden");
            playButton.classList.add("hidden");

            countdownSection.classList.remove("hidden");
            initCountdown();
            console.log("Hauptinhalt angezeigt und Countdown gestartet.");
        });

        pauseButton.addEventListener("click", () => {
            console.log("pause-button wurde geklickt.");
            if (player && typeof player.pauseVideo === "function") {
                player.pauseVideo();
                pauseButton.classList.add("hidden");
                playButton.classList.remove("hidden");
                console.log("Video pausiert.");
            }
        });

        playButton.addEventListener("click", () => {
            console.log("play-button wurde geklickt.");
            if (player && typeof player.playVideo === "function") {
                player.playVideo();
                playButton.classList.add("hidden");
                pauseButton.classList.remove("hidden");
                console.log("Video abgespielt.");
            }
        });

        // Countdown-Funktion
        function initCountdown() {
            console.log("Starte Countdown.");
            countdown();
            setInterval(countdown, 1000);
        }

        function countdown() {
            const eventDate = new Date("2024-10-12T23:22:45");
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
                countdownSection.querySelector("h2").textContent = "Die Show hat begonnen!";
                document.getElementById("timer").style.display = "none";
                console.log("Countdown beendet.");
            }
        }

        startQuizButton.addEventListener("click", () => {
            console.log("start-quiz-button wurde geklickt.");
            window.location.href = 'quiz.html';
        });

        if (quitQuizButton) {
            quitQuizButton.addEventListener("click", () => {
                console.log("quit-quiz-button wurde geklickt.");
                const confirmQuit = confirm("Möchtest du das Quiz wirklich abbrechen und zur Hauptseite zurückkehren?");
                if (confirmQuit) {
                    window.location.href = 'main.html'; // Leitet zur Hauptseite zurück
                }
            });
        }

        // Hilfsfunktionen
        function fadeOutAudio(audio, duration) {
            console.log("Starte Fade-Out der Audio.");
            const fadeInterval = 50;
            const fadeStep = audio.volume / (duration / fadeInterval);

            const fadeAudio = setInterval(() => {
                if (audio.volume > fadeStep) {
                    audio.volume -= fadeStep;
                } else {
                    audio.volume = 0;
                    audio.pause();
                    clearInterval(fadeAudio);
                    console.log("Fade-Out abgeschlossen und Audio pausiert.");
                }
            }, fadeInterval);
        }

        function updateFlipCard(front, back, newValue) {
            if (front.textContent !== newValue.toString()) {
                back.textContent = newValue.toString();
                const flipInner = front.parentElement;
                flipInner.classList.add("flipping");
                console.log(`Flip-Card aktualisiert: ${newValue}`);

                setTimeout(() => {
                    front.textContent = newValue.toString();
                    flipInner.classList.remove("flipping");
                }, 600);
            }
        }

        // Feuerfliegen-Animation
        function initFireflies() {
            console.log("Initialisiere Feuerfliegen-Animation.");
            const firefliesCanvas = document.getElementById("fireflies");
            const ctx = firefliesCanvas.getContext("2d");
            const fireflies = [];
            const numFireflies = 80;

            class Firefly {
                constructor() {
                    this.reset();
                }

                reset() {
                    this.x = Math.random() * firefliesCanvas.width;
                    this.y = Math.random() * firefliesCanvas.height;
                    this.radius = Math.random() * 3 + 1;
                    this.alpha = Math.random() * 0.5 + 0.5;
                    this.speedX = (Math.random() - 0.5) * 1;
                    this.speedY = (Math.random() - 0.5) * 1;
                }

                update() {
                    this.x += this.speedX;
                    this.y += this.speedY;
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
            console.log("Initialisiere Sternenhimmel-Animation.");
            const ctx = starfieldCanvas.getContext("2d");
            const stars = [];
            const numStars = 200;

            class Star {
                constructor() {
                    this.reset();
                }

                reset() {
                    this.x = Math.random() * starfieldCanvas.width;
                    this.y = Math.random() * starfieldCanvas.height;
                    this.radius = Math.random() * 1.5 + 0.5;
                    this.alpha = Math.random() * 0.5 + 0.5;
                    this.speed = Math.random() * 0.5 + 0.2;
                }

                update() {
                    this.y += this.speed;
                    if (this.y > starfieldCanvas.height) {
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
                ctx.clearRect(0, 0, starfieldCanvas.width, starfieldCanvas.height);
                stars.forEach((star) => {
                    star.update();
                    star.draw(ctx);
                });
                requestAnimationFrame(animateStarfield);
            }

            function resizeStarfieldCanvas() {
                starfieldCanvas.width = window.innerWidth;
                starfieldCanvas.height = window.innerHeight;
                stars.forEach((star) => {
                    star.reset();
                });
            }

            window.addEventListener("resize", resizeStarfieldCanvas);
            resizeStarfieldCanvas();
            animateStarfield();
        }

        function loadGalleryImages() {
            console.log("Lade Galerie-Bilder.");
            const galleryContainer = document.getElementById('gallery-container');

            const images = [
                'image1.jpg',
                'image2.jpg',
                'image3.jpg',
                'image4.jpg',
                'image5.jpg',
                'image6.jpg',
                'image7.jpg',
                'image8.jpg'
            ];

            images.forEach((imageName) => {
                const imgElement = document.createElement('img');
                imgElement.src = `assets/Erinnerungen/${imageName}`;
                imgElement.alt = 'Erinnerung';
                imgElement.classList.add('gallery-image'); // Hinzufügen einer Klasse zur Steuerung der Bilder
                imgElement.addEventListener('click', () => openImageModal(imgElement.src));
                galleryContainer.appendChild(imgElement);
            });
        }

        // Bild-Modal-Funktion
        function openImageModal(imageSrc) {
            console.log("Öffne Bild-Modal:", imageSrc);
            const modal = document.createElement('div');
            modal.classList.add('image-modal');
            modal.innerHTML = `
                <span class="close-button">&times;</span>
                <img src="${imageSrc}" class="modal-image" />
            `;
            document.body.appendChild(modal);

            const closeButton = modal.querySelector('.close-button');
            closeButton.addEventListener('click', () => {
                console.log("Schließe Bild-Modal.");
                document.body.removeChild(modal);
            });

            // Schließen durch Klick außerhalb des Bildes
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    console.log("Schließe Bild-Modal durch Klick außerhalb.");
                    document.body.removeChild(modal);
                }
            });
        }

        // Lade die Bilder für die Galerie
        loadGalleryImages();
    }
});
