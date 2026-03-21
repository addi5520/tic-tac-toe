const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const scoresText = document.getElementById('scores');
const winsNeededSelect = document.getElementById('winsNeeded');
const player1Input = document.getElementById('player1Name');
const player2Input = document.getElementById('player2Name');

// Game variables
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let isGameRunning = true;
let scoreX = 0;
let scoreO = 0;
let winsNeeded = 3;
let matchOver = false;
let player1Name = "Player X";
let player2Name = "Player O";

// All ways to win a game
const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

function updateScores() {
    scoresText.textContent = `${player1Name}: ${scoreX} | ${player2Name}: ${scoreO}`;
}

function getCurrentPlayerName() {
    return currentPlayer === "X" ? player1Name : player2Name;
}

function updatePlayerNames() {
    player1Name = player1Input.value.trim() || "Player X";
    player2Name = player2Input.value.trim() || "Player O";
    updateScores();
    if (!matchOver) {
        statusText.textContent = `${getCurrentPlayerName()}'s Turn`;
    }
}

// Initialize
updateScores();
winsNeeded = parseInt(winsNeededSelect.value);

function cellClicked(e) {
    const cell = e.target;
    const index = cell.getAttribute('data-index');

    // Prevent clicking if the space is taken or game is over
    if (board[index] !== "" || !isGameRunning) return;

    // Update the array and the UI
    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer === "X" ? "x-mark" : "o-mark");
    
    checkWin();
}

function checkWin() {
    let roundWon = false;
    let winningCombination = [];

    // Check the current board against all win conditions
    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            winningCombination = [a, b, c];
            break;
        }
    }

    if (roundWon) {
        // Highlight winning cells
        winningCombination.forEach(index => {
            cells[index].classList.add('win');
        });

        if (currentPlayer === "X") {
            scoreX++;
        } else {
            scoreO++;
        }
        updateScores();
        
        if (scoreX >= winsNeeded) {
            statusText.textContent = `🏆 ${player1Name} Wins the Match! 🏆`;
            matchOver = true;
            isGameRunning = false;
        } else if (scoreO >= winsNeeded) {
            statusText.textContent = `🏆 ${player2Name} Wins the Match! 🏆`;
            matchOver = true;
            isGameRunning = false;
        } else {
            statusText.textContent = `🎉 ${getCurrentPlayerName()} Wins! 🎉 (Next game starting...)`;
            setTimeout(() => {
                resetGame();
            }, 2000);
        }
    } else if (!board.includes("")) {
        // If there are no empty spaces and no win, it's a tie
        statusText.textContent = "It's a Draw! 🤝 (Next game starting...)";
        setTimeout(() => {
            resetGame();
        }, 2000);
    } else {
        // Change turns
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusText.textContent = `${getCurrentPlayerName()}'s Turn`;
    }
}

function resetGame() {
    // Reset all variables and the UI
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    isGameRunning = !matchOver;
    statusText.textContent = `${getCurrentPlayerName()}'s Turn`;
    
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("x-mark", "o-mark", "win");
    });
}

function resetMatch() {
    scoreX = 0;
    scoreO = 0;
    winsNeeded = parseInt(winsNeededSelect.value);
    matchOver = false;
    updatePlayerNames();
    resetGame();
}

// Listen for clicks on every cell
cells.forEach(cell => cell.addEventListener('click', cellClicked));

// Listen for name changes
player1Input.addEventListener('input', updatePlayerNames);
player2Input.addEventListener('input', updatePlayerNames);

// Initialize
updatePlayerNames();
winsNeeded = parseInt(winsNeededSelect.value);