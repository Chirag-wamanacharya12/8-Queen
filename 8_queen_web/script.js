const boardElement = document.getElementById('board');
const messageBox = document.getElementById('messageBox');
const gameCountElement = document.getElementById('gameCount');
let gameCount = 0;
let queens = [];

const queenImgSrc = 'D:\\8_queen\\queen.png';  // Update this to the correct path or use a relative path

// Function to initialize the board
function initializeBoard() {
    boardElement.innerHTML = '';
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', handleCellClick);
            boardElement.appendChild(cell);
        }
    }
}

// Function to handle cell clicks (updated to show remaining queens)
function handleCellClick(event) {
    const cell = event.currentTarget;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (isQueenPresent(row, col)) {
        removeQueen(row, col);
        updateMessageBox(`Removed queen from (${row}, ${col}). ${8 - queens.length} queen(s) remaining.`);
    } else {
        if (isValidMove(row, col)) {
            placeQueen(row, col);
            updateMessageBox(`Placed queen at (${row}, ${col}). ${8 - queens.length} queen(s) remaining.`);
        } else {
            highlightInvalidMove(cell);
            updateMessageBox('Invalid move!');
        }
    }
}

// Function to check if a queen is present in a cell
function isQueenPresent(row, col) {
    return queens.some(queen => queen.row === row && queen.col === col);
}

// Function to place a queen on the board
function placeQueen(row, col) {
    const cell = getCell(row, col);
    const queenImg = document.createElement('img');
    queenImg.src = queenImgSrc;
    cell.appendChild(queenImg);
    queens.push({ row, col });
}

// Function to remove a queen from the board
function removeQueen(row, col) {
    const cell = getCell(row, col);
    cell.innerHTML = '';
    queens = queens.filter(queen => !(queen.row === row && queen.col === col));
}

// Function to get a cell element by row and column
function getCell(row, col) {
    return boardElement.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
}

// Function to check if a move is valid
function isValidMove(row, col) {
    for (const queen of queens) {
        if (queen.row === row || queen.col === col || Math.abs(queen.row - row) === Math.abs(queen.col - col)) {
            return false;
        }
    }
    return true;
}

// Function to highlight an invalid move
function highlightInvalidMove(cell) {
    cell.classList.add('invalid');
    setTimeout(() => cell.classList.remove('invalid'), 2000);
}

// Function to update the message box
function updateMessageBox(message) {
    messageBox.textContent = message;
}

// Function to update the game count
function updateGameCount() {
    gameCountElement.textContent = `Game Count: ${++gameCount}`;
}

// Function to verify the solution
function verifySolution() {
    if (queens.length === 8) {
        if (isCorrectSolution()) {
            updateMessageBox('Congratulations! You solved the puzzle.');
            updateGameCount(); // Increment game count after correct solution
            setTimeout(() => {
                initializeBoard();
                queens = [];
                updateMessageBox('New game started! Place your queens.');
            }, 2000); // Show the message for 2 seconds before resetting
        } else {
            updateMessageBox('Incorrect solution. Try again.');
        }
    } else {
        updateMessageBox(`Place all 8 queens first. ${8 - queens.length} queen(s) remaining.`);
    }
}

// Function to check if the current solution is correct
function isCorrectSolution() {
    const solutions = generateSolutions();
    const currentSolution = queens.map(queen => [queen.row, queen.col]);
    return solutions.some(solution =>
        solution.every(([row, col]) => currentSolution.some(q => q[0] === row && q[1] === col))
    );
}

// Function to generate all possible solutions using backtracking
function generateSolutions() {
    const solutions = [];
    function solve(row, board = []) {
        if (row === 8) {
            solutions.push([...board]);
            return;
        }
        for (let col = 0; col < 8; col++) {
            if (isValidMoveInBoard(row, col, board)) {
                board.push([row, col]);
                solve(row + 1, board);
                board.pop();
            }
        }
    }
    function isValidMoveInBoard(row, col, board) {
        return !board.some(([r, c]) => r === row || c === col || Math.abs(r - row) === Math.abs(c - col));
    }
    solve(0);
    return solutions;
}

// Event Listeners for buttons
document.getElementById('newGameBtn').addEventListener('click', () => {
    if (queens.length > 0 && queens.length < 8) {
        updateMessageBox('Finish the current game before starting a new one.');
    } else {
        queens = [];
        initializeBoard();
        updateMessageBox('New game started! Place your queens.');
        updateGameCount();
    }
});

document.getElementById('resetBtn').addEventListener('click', () => {
    if (queens.length > 0 && queens.length < 8) {
        updateMessageBox('Finish the current game or complete the board before resetting.');
    } else {
        queens = [];
        initializeBoard();
        updateMessageBox('Game reset! Start placing your queens.');
    }
});

document.getElementById('verifyBtn').addEventListener('click', () => {
    verifySolution();
});

document.getElementById('exitBtn').addEventListener('click', () => {
    window.close();
});

// Initialize the board when the page loads
initializeBoard();
