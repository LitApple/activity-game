const images = [
    'images/img1.jpg', 'images/img1.jpg', 'images/img2.jpg', 'images/img2.jpg',
    'images/img3.jpg', 'images/img3.jpg', 'images/img4.jpg', 'images/img4.jpg',
    'images/img5.jpg', 'images/img5.jpg', 'images/img6.jpg', 'images/img6.jpg',
    'images/img7.jpg', 'images/img7.jpg', 'images/img8.jpg', 'images/img8.jpg'
];

let shuffledImages = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let startTime = null;
let timerInterval = null;

// DOM 元素
const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');
const gameContainer = document.getElementById('game-container');
const gameBoard = document.getElementById('game-board');
const timerDisplay = document.getElementById('timer');
const completionScreen = document.getElementById('completion-screen');
const completionTime = document.getElementById('completion-time');
const restartButton = document.getElementById('restart-button');

// 初始化游戏
function initializeGame() {
    shuffledImages = images.sort(() => Math.random() - 0.5);
    gameBoard.innerHTML = '';
    shuffledImages.forEach(image => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.image = image;

        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back" style="background-image: url('${image}')"></div>
            </div>
        `;

        gameBoard.appendChild(card);
        card.addEventListener('click', () => flipCard(card));
    });
}

// 开始游戏
startButton.addEventListener('click', () => {
    startScreen.style.display = 'none';
    gameContainer.style.display = 'block';
    initializeGame();
    startTimer();
});

// 翻牌逻辑
function flipCard(card) {
    if (lockBoard || card === firstCard || card.classList.contains('matched')) return;
    card.classList.add('flipped');
    if (!firstCard) {
        firstCard = card;
        return;
    }
    secondCard = card;
    checkMatch();
}

// 检查是否匹配
function checkMatch() {
    const isMatch = firstCard.dataset.image === secondCard.dataset.image;
    if (isMatch) {
        disableMatchedCards();
        resetCards(true);
        checkWin();
    } else {
        lockBoard = true;
        setTimeout(() => resetCards(false), 1000);
    }
}

// 禁用配对成功的卡牌
function disableMatchedCards() {
    firstCard.removeEventListener('click', () => flipCard(firstCard));
    secondCard.removeEventListener('click', () => flipCard(secondCard));
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
}

// 重置卡牌
function resetCards(isMatch) {
    if (!isMatch) {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
    }
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

// 启动计时器
function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        timerDisplay.textContent = `时间：${elapsedTime} 秒`;
    }, 1000);
}

// 停止计时器
function stopTimer() {
    clearInterval(timerInterval);
}

// 检查游戏是否完成
function checkWin() {
    const allCards = document.querySelectorAll('.card');
    if ([...allCards].every(card => card.classList.contains('flipped'))) {
        stopTimer();
        const totalTime = Math.floor((Date.now() - startTime) / 1000);
        gameContainer.style.display = 'none';
        completionScreen.style.display = 'flex';
        completionTime.textContent = `你的用时为：${totalTime} 秒`;
    }
}

// 重新开始游戏
restartButton.addEventListener('click', () => {
    completionScreen.style.display = 'none';
    startScreen.style.display = 'flex';
    timerDisplay.textContent = '时间：0 秒';
    initializeGame();
});
