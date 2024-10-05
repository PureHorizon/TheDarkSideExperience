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

            alert("Login erfolgreich!");
            loginContainer.classList.add("hidden");
            startScreen.classList.remove("hidden");
        });

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

        const startButton = document.getElementById("start-button");
        if (startButton) {
            startButton.addEventListener("click", () => {
                sessionStorage.setItem('playAmbience', 'true');
                window.location.href = 'main.html';
            });
        }
    }

    // --- Funktionen für main.html ---
    const mainContent = document.getElementById("main-content");
    const starfieldCanvas = document.getElementById("starfield");
    const soundModal = document.getElementById("sound-modal");
    const quitQuizButton = document.getElementById("quit-quiz-button");

    if (mainContent) {
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
            ambienceMusic.play().then(() => {
                console.log("Hintergrundmusik gestartet.");
            }).catch((error) => {
                console.warn("Sound konnte nicht abgespielt werden:", error);
            });
            sessionStorage.removeItem('playAmbience');
        }

        soundModal.classList.remove("hidden");

        soundConfirmButton.addEventListener("click", () => {
            fadeOutAudio(ambienceMusic, 2000);
            soundModal.classList.add("hidden");
            mainContent.classList.remove("hidden");
            starfieldCanvas.classList.remove("hidden");
            initStarfield();

            videoContainer.classList.remove("hidden");
            if (player && typeof player.playVideo === "function") {
                player.playVideo();
            }

            pauseButton.classList.remove("hidden");
            playButton.classList.add("hidden");

            countdownSection.classList.remove("hidden");
            initCountdown();
        });

        pauseButton.addEventListener("click", () => {
            if (player && typeof player.pauseVideo === "function") {
                player.pauseVideo();
                pauseButton.classList.add("hidden");
                playButton.classList.remove("hidden");
            }
        });

        playButton.addEventListener("click", () => {
            if (player && typeof player.playVideo === "function") {
                player.playVideo();
                playButton.classList.add("hidden");
                pauseButton.classList.remove("hidden");
            }
        });

        // Countdown-Funktion
        function initCountdown() {
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
            }
        }

        startQuizButton.addEventListener("click", () => {
            console.log("Quiz-Button wurde geklickt");
            window.location.href = 'quiz.html';
        });

        if (quitQuizButton) {
            quitQuizButton.addEventListener("click", () => {
                const confirmQuit = confirm("Möchtest du das Quiz wirklich abbrechen und zur Hauptseite zurückkehren?");
                if (confirmQuit) {
                    window.location.href = 'main.html'; // Leitet zur Hauptseite zurück
                }
            });
        }

        // Hilfsfunktionen
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

        function updateFlipCard(front, back, newValue) {
            if (front.textContent !== newValue.toString()) {
                back.textContent = newValue.toString();
                const flipInner = front.parentElement;
                flipInner.classList.add("flipping");

                setTimeout(() => {
                    front.textContent = newValue.toString();
                    flipInner.classList.remove("flipping");
                }, 600);
            }
        }

        // Feuerfliegen-Animation
        function initFireflies() {
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
            const modal = document.createElement('div');
            modal.classList.add('image-modal');
            modal.innerHTML = `
                <span class="close-button">&times;</span>
                <img src="${imageSrc}" class="modal-image" />
            `;
            document.body.appendChild(modal);

            const closeButton = modal.querySelector('.close-button');
            closeButton.addEventListener('click', () => {
                document.body.removeChild(modal);
            });

            // Schließen durch Klick außerhalb des Bildes
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                }
            });
        }

        // Lade die Bilder für die Galerie
        loadGalleryImages();
    }
});
