// Game State
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let currentQuestion = null;
let gameActive = false;
let correctAnswersInARow = 0;
let donationPromptShown = false;
let timer;
let timeLeft = 10;
let timerActive = false;
let currentQuestionNumber = 0;
let totalQuestions = 10;
let playerName = '';
const leaderboardKey = 'mathGameLeaderboard';

// Audio elements
const timerSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3'); // Short beep sound
timerSound.volume = 0.5;
const correctSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3'); // Correct answer sound
correctSound.volume = 0.5;
const wrongSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2598/2598-preview.mp3'); // Wrong answer sound
wrongSound.volume = 0.3;

// DOM Elements
const questionElement = document.getElementById('question');
const answerInput = document.getElementById('answer');
const submitButton = document.getElementById('submit-btn');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const progressBar = document.getElementById('progress-bar');
const schoolBase = document.getElementById('school-base');
const schoolAddons = document.getElementById('school-addons');
const donationModal = document.getElementById('donation-modal');
const modalPoints = document.getElementById('modal-points');
const donateNowBtn = document.getElementById('donate-now');
const notNowBtn = document.getElementById('not-now');
const donationScoreElement = document.getElementById('donation-score');
const donationAmountElement = document.getElementById('donation-amount');
const donateLink = document.getElementById('donate-link');

// Milestones with emojis and point values
const milestones = [
    { points: 50, text: 'P.E. Program Support', emoji: '🏃‍♂️' },
    { points: 100, text: 'Art Program Support', emoji: '🎨' },
    { points: 150, text: 'Music Program Support', emoji: '🎶' },
    { points: 200, text: 'Fundraising Goal: $50,000', emoji: '🏆' },
];

// Initialize welcome video overlay
function initVideoPlayer() {
    const welcomeOverlay = document.getElementById('welcome-overlay');
    const closeWelcomeBtn = document.getElementById('close-welcome');
    const youtubeVideo = document.getElementById('youtube-video');
    const nicknameModal = document.getElementById('nickname-modal');
    
    // YouTube video ID
    const youtubeVideoId = 'XD3lr-_01xA';
    
    // Set the video source with proper parameters
    const videoUrl = `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&controls=1&rel=0`;
    youtubeVideo.src = videoUrl;
    
    // Close welcome overlay and show nickname modal
    closeWelcomeBtn.addEventListener('click', () => {
        // Hide the video overlay
        welcomeOverlay.style.display = 'none';
        
        // Stop the video
        youtubeVideo.src = '';
        
        // Show the nickname modal
        nicknameModal.style.display = 'flex';
        
        // Focus on the nickname input
        document.getElementById('player-name').focus();
    });
    
    // Add click handler to kid's photo to reopen the video
    const kidPhoto = document.getElementById('kid-photo');
    kidPhoto.addEventListener('click', () => {
        // Show the overlay
        welcomeOverlay.style.display = 'flex';
        
        // Reload the video
        youtubeVideo.src = videoUrl;
    });
    
    // Set up nickname input
    setupNicknameInput();
    
    // Set up leaderboard
    setupLeaderboard();
}

// Set up nickname input and start game functionality
function setupNicknameInput() {
    const nicknameModal = document.getElementById('nickname-modal');
    const playerNameInput = document.getElementById('player-name');
    const startWithNameBtn = document.getElementById('start-with-name');
    
    // Start game when button is clicked
    startWithNameBtn.addEventListener('click', () => {
        startGameWithName();
    });
    
    // Also allow Enter key to start the game
    playerNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            startGameWithName();
        }
    });
}

// Start game with player name
function startGameWithName() {
    const nicknameModal = document.getElementById('nickname-modal');
    const playerNameInput = document.getElementById('player-name');
    
    // Get player name (default to 'Player' if empty)
    playerName = playerNameInput.value.trim();
    if (playerName === '') {
        playerName = 'Player ' + Math.floor(Math.random() * 1000);
    }
    
    // Hide nickname modal
    nicknameModal.style.display = 'none';
    
    // Start the game
    startGame();
}

// Set up leaderboard functionality
function setupLeaderboard() {
    const showLeaderboardBtn = document.getElementById('show-leaderboard');
    const closeLeaderboardBtn = document.getElementById('close-leaderboard');
    const leaderboardModal = document.getElementById('leaderboard-modal');
    
    // Show leaderboard when button is clicked
    showLeaderboardBtn.addEventListener('click', () => {
        displayLeaderboard();
        leaderboardModal.style.display = 'flex';
    });
    
    // Close leaderboard when close button is clicked
    closeLeaderboardBtn.addEventListener('click', () => {
        leaderboardModal.style.display = 'none';
    });
}

// Update leaderboard with new score
function updateLeaderboard(score) {
    // Get current leaderboard or initialize empty array
    const leaderboard = JSON.parse(localStorage.getItem(leaderboardKey)) || [];
    
    // Add current score
    leaderboard.push({
        name: playerName,
        score: score,
        date: new Date().toISOString()
    });
    
    // Sort by score (highest first) and keep top 10
    leaderboard.sort((a, b) => b.score - a.score);
    const topScores = leaderboard.slice(0, 10);
    
    // Save back to localStorage
    localStorage.setItem(leaderboardKey, JSON.stringify(topScores));
}

// Display leaderboard entries
function displayLeaderboard() {
    const leaderboardList = document.getElementById('leaderboard-list');
    const leaderboard = JSON.parse(localStorage.getItem(leaderboardKey)) || [];
    
    if (leaderboard.length === 0) {
        leaderboardList.innerHTML = '<p style="text-align: center; padding: 20px;">No scores yet. Be the first to play!</p>';
    } else {
        let html = '';
        
        leaderboard.forEach((entry, index) => {
            html += `
                <div class="leaderboard-entry">
                    <div class="leaderboard-rank">${index + 1}</div>
                    <div class="leaderboard-name">${entry.name}</div>
                    <div class="leaderboard-score">${entry.score} pts</div>
                </div>
            `;
        });
        
        leaderboardList.innerHTML = html;
    }
}

// Timer functions
function startTimer() {
    clearInterval(timer);
    
    // Set time based on question number (3s for first, 15s for last)
    timeLeft = Math.floor(3 + (currentQuestionNumber * 1.3)); // 3s for Q1, ~15s for Q10
    
    updateTimerDisplay();
    timerActive = true;
    
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        // Play sound when time is running out
        if (timeLeft <= 3 && timeLeft > 0) {
            timerSound.currentTime = 0;
            timerSound.play().catch(e => console.log('Audio play failed:', e));
        }
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            timerActive = false;
            timeUp();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const timerBar = document.getElementById('timer-bar');
    const timerText = document.getElementById('timer-text');
    
    // Calculate max time for current question
    const maxTime = Math.floor(3 + (currentQuestionNumber * 1.3));
    const percentage = (timeLeft / maxTime) * 100;
    
    timerBar.style.width = `${percentage}%`;
    timerText.textContent = `${timeLeft}s`;
    
    // Change color based on percentage of time left
    if (percentage <= 30) {
        timerBar.style.background = 'linear-gradient(90deg, #ef476f, #ff9e7d)';
    } else if (percentage <= 60) {
        timerBar.style.background = 'linear-gradient(90deg, #ffd166, #ffb347)';
    } else {
        timerBar.style.background = 'linear-gradient(90deg, #4a6fa5, #06d6a0)';
    }
}

function stopTimer() {
    clearInterval(timer);
    timerActive = false;
}

function resetTimer() {
    stopTimer();
    // Set time based on question number
    timeLeft = Math.floor(3 + (currentQuestionNumber * 1.3));
    updateTimerDisplay();
}

function timeUp() {
    if (!gameActive) return;
    
    wrongSound.play().catch(e => console.log('Audio play failed:', e));
    showFeedback('Time\'s up!', 'error');
    
    // Small penalty for running out of time
    score = Math.max(0, score - 5);
    correctAnswersInARow = 0;
    updateScore();
    
    // Generate new question after a short delay
    setTimeout(() => {
        generateQuestion();
    }, 1500);
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Set high score display
    highScoreElement.textContent = highScore;
    
    // Event listeners
    submitButton.addEventListener('click', handleSubmit);
    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    });
    
    // Donation modal buttons
    donateNowBtn.addEventListener('click', () => {
        closeDonationModal();
        // Redirect to donation page
        window.location.href = document.getElementById('donate-link').href;
        // Continue the game after donation prompt
        continueAfterPrompt();
    });
    
    notNowBtn.addEventListener('click', () => {
        closeDonationModal();
        // Continue the game after donation
        continueAfterPrompt();
    });
    
    // Initialize the game board and video player
    updateSchoolVisual();
    initVideoPlayer();
    
    // Debug logging for troubleshooting
    console.log('Game initialized, total questions:', totalQuestions);
});

// Handle form submission
function handleSubmit() {
    if (!gameActive) {
        startGame();
        return;
    }
    
    const userAnswer = parseInt(answerInput.value);
    
    if (isNaN(userAnswer)) {
        showFeedback('Please enter a valid number', 'error');
        return;
    }
    
    checkAnswer(userAnswer);
}

// Start a new game
function startGame() {
    // Reset game state
    score = 0;
    correctAnswersInARow = 0;
    donationPromptShown = false;
    currentQuestionNumber = 0;
    updateScore();
    
    // Update UI
    gameActive = true;
    submitButton.textContent = 'Submit';
    answerInput.disabled = false;
    answerInput.value = '';
    
    // Generate first question
    generateQuestion();
    
    // Focus on answer input
    answerInput.focus();
}

// Generate a new math question
function generateQuestion() {
    // Always stop any running timer before generating a new question
    stopTimer();

    // Log current question number for debugging
    console.log('Generating question number:', currentQuestionNumber + 1);
    
    // Check if we've reached the end of the game (10 questions)
    if (currentQuestionNumber >= totalQuestions && gameActive) {
        console.log('Game ended after question:', currentQuestionNumber);
        endGame();
        return;
    }
    
    // Reset timer for new question
    resetTimer();
    if (gameActive) {
        startTimer();
    }
    
    let num1, num2, operator, answer;
    // Determine operation based on question number
    // Earlier questions: more addition/subtraction
    // Later questions: more multiplication/division
    let operation;
    
    if (currentQuestionNumber <= 3) {
        // First 3 questions: 80% +/-, 20% */÷
        operation = Math.random() < 0.8 ? Math.floor(Math.random() * 2) : 2 + Math.floor(Math.random() * 2);
    } else if (currentQuestionNumber <= 7) {
        // Questions 4-7: 50% +/-, 50% */÷
        operation = Math.floor(Math.random() * 4);
    } else {
        // Questions 8-10: 20% +/-, 80% */÷
        operation = Math.random() < 0.8 ? 2 + Math.floor(Math.random() * 2) : Math.floor(Math.random() * 2);
    }
    
    // Adjust difficulty based on score
    const difficulty = Math.min(Math.floor(score / 10), 5);
    const maxNumber = 10 + (difficulty * 5);
    
    switch (operation) {
        case 0: // Addition
            // Difficulty increases with question number
            const maxAddend = 10 + (currentQuestionNumber * 9); // 19 to 100
            num1 = Math.floor(Math.random() * maxAddend) + 1;
            num2 = Math.floor(Math.random() * maxAddend) + 1;
            operator = '+';
            answer = num1 + num2;
            break;
        case 1: // Subtraction
            const maxMinuend = 10 + (currentQuestionNumber * 9); // 19 to 100
            num1 = Math.floor(Math.random() * maxMinuend) + 10;
            num2 = Math.floor(Math.random() * num1) + 1; // Ensure num2 <= num1
            operator = '-';
            answer = num1 - num2;
            break;
        case 2: // Multiplication
            // Difficulty increases with question number
            const maxFactor1 = 3 + Math.floor(currentQuestionNumber / 2); // 3 to 8
            const maxFactor2 = 5 + currentQuestionNumber; // 5 to 15
            num1 = Math.floor(Math.random() * maxFactor1) + 2;
            num2 = Math.floor(Math.random() * maxFactor2) + 2;
            operator = '×';
            answer = num1 * num2;
            break;
        case 3: // Division
            // Difficulty increases with question number
            const maxDivisor = 3 + Math.floor(currentQuestionNumber / 2); // 3 to 8
            num2 = Math.floor(Math.random() * maxDivisor) + 2; // Divisor
            
            // For later questions, allow larger quotients
            const maxQuotient = 3 + currentQuestionNumber; // 3 to 13
            answer = Math.floor(Math.random() * maxQuotient) + 2; // Quotient
            
            num1 = num2 * answer; // Ensure clean division
            operator = '÷';
            break;
    }
    
    currentQuestion = { num1, num2, operator, answer };
    questionElement.textContent = `${num1} ${operator} ${num2} = ?`;
    answerInput.value = '';
}

// Check if the player's answer is correct
function endGame() {
    // Game is over after 10 questions
    gameActive = false;
    stopTimer();
    
    // Show final score
    questionElement.textContent = `Game Over! ${playerName}'s Final Score: ${score}`;
    submitButton.textContent = 'Play Again';
    answerInput.disabled = true;
    
    // Update the leaderboard with the player's score
    updateLeaderboard(score);
    
    // Show donation prompt if score is high enough
    if (score > 50 && !donationPromptShown) {
        showDonationPrompt();
    }
    
    // Update high score if needed
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        highScoreElement.textContent = highScore;
    }
    
    // Show donation message and leaderboard notification
    const donationMessage = score > 50 ? 
        `Amazing job! Your score of ${score} could help our school! Please consider donating.` : 
        `Your score of ${score} has been added to the leaderboard!`;
        
    // Use a more visible on-screen message instead of an alert
    const messageDiv = document.createElement('div');
    messageDiv.style.position = 'fixed';
    messageDiv.style.top = '50%';
    messageDiv.style.left = '50%';
    messageDiv.style.transform = 'translate(-50%, -50%)';
    messageDiv.style.background = 'white';
    messageDiv.style.padding = '20px';
    messageDiv.style.borderRadius = '10px';
    messageDiv.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
    messageDiv.style.zIndex = '10000';
    messageDiv.style.maxWidth = '80%';
    messageDiv.style.textAlign = 'center';
    
    messageDiv.innerHTML = `
        <h3 style="margin-top: 0; color: #4a6fa5;">Game Over!</h3>
        <p>${donationMessage}</p>
        <p>Click the 'View Leaderboard' button to see how you rank.</p>
        <button style="background: #4a6fa5; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 10px;">OK</button>
    `;
    
    document.body.appendChild(messageDiv);
    
    // Remove the message when the OK button is clicked
    messageDiv.querySelector('button').addEventListener('click', () => {
        document.body.removeChild(messageDiv);
    });
}

function checkAnswer(userAnswer) {
    // Stop the timer when answer is submitted
    stopTimer();

    // Increment question number AFTER the answer is processed
    if (gameActive) {
        currentQuestionNumber++;
    }

    // Check if we've reached the end of the game (10 questions)
    if (currentQuestionNumber > totalQuestions) {
        console.log('Final question answered, ending game');
        updateScore();
        endGame();
        return;
    }

    if (userAnswer === currentQuestion.answer) {
        // Correct answer
        let basePoints = 10;
        let speedBonus = Math.max(0, timeLeft - 2); // Bonus for answering quickly
        score += basePoints + speedBonus;
        correctAnswersInARow++;
        if (speedBonus > 0) {
            showFeedback(`Speed Bonus! +${speedBonus} pts`, 'success');
        }
        
        // Bonus points for multiple correct answers in a row
        if (correctAnswersInARow >= 3) {
            const bonus = 5 * (correctAnswersInARow - 2);
            score += bonus;
            showFeedback(`+${10} + ${bonus} bonus!`, 'success');
        } else {
            showFeedback('Correct! +10', 'success');
        }
        
        // Update visuals and check for milestones
        updateSchoolVisual();
        checkMilestones();
        
        // Update progress (resets every 100 points)
        const progress = (score % 100) / 100;
        updateProgressBar(progress * 100);
        
        // Show donation prompt at certain score thresholds, but never on the last question
        if ((score === 50 || score === 100 || score % 200 === 0) && !donationPromptShown && currentQuestionNumber < totalQuestions) {
            showDonationPrompt();
            return; // We'll continue the game after the donation prompt is closed
        }
    } else {
        // Play wrong answer sound
        wrongSound.play().catch(e => console.log('Audio play failed:', e));
        
        // Incorrect answer
        correctAnswersInARow = 0;
        showFeedback(`Incorrect! The answer was ${currentQuestion.answer}`, 'error');
        
        // Small penalty for wrong answers, but don't go below 0
        score = Math.max(0, score - 5);
    }
    
    updateScore();
    generateQuestion();
}

// Update the score display
function updateScore() {
    scoreElement.textContent = score;
    donationScoreElement.textContent = score;
    donationAmountElement.textContent = Math.floor(score / 10); // $1 per 10 points
    
    // Update high score if needed
    if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = highScore;
        localStorage.setItem('highScore', highScore);
    }
}

// Update the progress bar
function updateProgressBar(percent) {
    progressBar.style.width = `${percent}%`;
    
    // Change color based on progress
    if (percent < 30) {
        progressBar.style.background = 'linear-gradient(90deg, #4a6fa5, #5a7fb5)';
    } else if (percent < 70) {
        progressBar.style.background = 'linear-gradient(90deg, #4a6fa5, #ef476f)';
    } else {
        progressBar.style.background = 'linear-gradient(90deg, #4a6fa5, #06d6a0)';
    }
}

// Update the school visual based on score
function updateSchoolVisual() {
    // Make the school bounce
    schoolBase.classList.add('bounce');
    setTimeout(() => {
        schoolBase.classList.remove('bounce');
    }, 500);
    
    // Always keep schoolAddons empty (no dynamic icons)
    schoolAddons.innerHTML = '';
    
    // Optionally keep the scaling effect (or remove if you want it static)
    const scale = 1 + (Math.min(score, 200) / 500);
    schoolBase.style.transform = `scale(${scale})`;
}

// Check for milestone achievements
function checkMilestones() {
    // Use the correct selector for the updated milestone list
    const milestoneElements = document.querySelectorAll('.milestone-list li');
    milestones.forEach((milestone, index) => {
        const milestoneElement = milestoneElements[index];
        if (milestoneElement && score >= milestone.points && !milestoneElement.classList.contains('achieved')) {
            // Mark milestone as achieved
            milestoneElement.classList.add('achieved');
            
            // Show celebration
            showFeedback(`Milestone: ${milestone.text} ${milestone.emoji}`, 'milestone');
            
            // Add confetti effect
            createConfetti();
        }
    });
}

// Show feedback message
function showFeedback(message, type) {
    const feedback = document.createElement('div');
    feedback.className = `feedback ${type}`;
    feedback.textContent = message;
    document.body.appendChild(feedback);
    
    // Remove the feedback after animation
    setTimeout(() => {
        feedback.remove();
    }, 2000);
}

// Create confetti effect
function createConfetti() {
    const colors = ['#4a6fa5', '#ef476f', '#ffd166', '#06d6a0', '#118ab2'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = Math.random() * 10 + 5 + 'px';
        confetti.style.opacity = '1';
        
        // Random rotation and animation duration
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        
        document.body.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
}

// Show donation prompt
function showDonationPrompt() {
    donationPromptShown = true;
    modalPoints.textContent = score;
    donationModal.style.display = 'flex';
    
    // Set focus to the donate button for better accessibility
    setTimeout(() => {
        donateNowBtn.focus();
    }, 100);
    
    // Add event listeners for donation modal buttons if they don't exist
    if (!donateNowBtn.hasEventListener) {
        donateNowBtn.hasEventListener = true;
        donateNowBtn.addEventListener('click', () => {
            closeDonationModal();
            // Redirect to donation page
            window.location.href = document.getElementById('donate-link').href;
            // Continue the game after donation prompt
            continueAfterPrompt();
        });
    }
    
    if (!notNowBtn.hasEventListener) {
        notNowBtn.hasEventListener = true;
        notNowBtn.addEventListener('click', () => {
            closeDonationModal();
            // Continue the game after donation prompt
            continueAfterPrompt();
        });
    }
}

// Close donation modal
function closeDonationModal() {
    donationModal.style.display = 'none';
}

// Continue game after donation prompt
function continueAfterPrompt() {
    // Re-enable input
    answerInput.disabled = false;
    answerInput.focus();
    
    // Generate the next question
    generateQuestion();
}

// Reset the game
function resetGame() {
    gameActive = false;
    currentQuestionNumber = 0;
    submitButton.textContent = 'Play Again';
    answerInput.disabled = true;
    questionElement.textContent = 'Ready to play again?';
    
    // Reset timer and progress bar
    resetTimer();
    updateProgressBar(0);
    
    // Reset timer display
    const timerText = document.getElementById('timer-text');
    timerText.textContent = '3s';
}
