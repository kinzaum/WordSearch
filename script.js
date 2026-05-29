let isDragging = false;
let selectedCells = []; 
let currentGrid = []; 
let currentWords = []; 

// --- 1. Global Event Listeners ---
document.getElementById('openSettings').addEventListener('click', () => {
    document.getElementById('setup-panel').style.display = 'block';
});

document.getElementById('generateBtn').addEventListener('click', generateGame);

// --- 2. Unified Pointer Logic (Works on PC and Mobile) ---
document.addEventListener('pointerdown', (e) => {
    // Only start if clicking a cell
    if (e.target.classList.contains('cell')) {
        isDragging = true;
        selectedCells = [];
        handlePointerMove(e);
        e.target.setPointerCapture(e.pointerId);
    }
});

document.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    handlePointerMove(e);
});

document.addEventListener('pointerup', () => {
    if (!isDragging) return;
    isDragging = false;

    // Reset styles on all cells
    document.querySelectorAll('.cell').forEach(el => {
        el.style.transform = "scale(1)";
    });

    let formedWord = selectedCells.map(cell => currentGrid[cell.row][cell.col]).join('');
    
    if (currentWords.includes(formedWord)) {
        console.log("Found word:", formedWord);
        document.querySelectorAll('.cell.selected').forEach(el => {
            el.classList.add('found');
            el.classList.remove('selected');
        });
        markWordAsFound(formedWord);
    } else {
        document.querySelectorAll('.cell.selected').forEach(el => el.classList.remove('selected'));
    }
    
    selectedCells = []; 
});

function handlePointerMove(e) {
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (el && el.classList.contains('cell') && !el.classList.contains('selected')) {
        el.classList.add('selected');
        el.style.transform = "scale(0.98)";
        selectedCells.push({ 
            row: parseInt(el.dataset.row), 
            col: parseInt(el.dataset.col) 
        });
    }
}

// --- 3. Game Logic Functions ---
function markWordAsFound(word) {
    const listItems = document.querySelectorAll('#list li');
    listItems.forEach(li => {
        if (li.textContent === word) {
            li.style.textDecoration = 'line-through';
            li.style.color = '#a0a0a0'; 
            li.style.opacity = '0.6';   
        }
    });

    const allFound = Array.from(listItems).every(li => li.style.textDecoration === 'line-through');
    if (allFound) {
        setTimeout(() => alert("Congratulations! You found all the words!"), 500);
    }
}

function canPlace(word, row, col, dir, grid, size) {
    for (let i = 0; i < word.length; i++) {
        let r = row + i * dir[0];
        let c = col + i * dir[1];
        if (r < 0 || r >= size || c < 0 || c >= size || (grid[r][c] !== '' && grid[r][c] !== word[i])) {
            return false;
        }
    }
    return true;
}

function generateGame() {
    document.getElementById('setup-panel').style.display = 'none';
    const input = document.getElementById('wordInput').value;
    
    currentWords = input.split(',').map(w => w.trim().toUpperCase()).filter(w => w.length > 0);
    if (currentWords.length === 0) return;

    const longest = Math.max(...currentWords.map(w => w.length));
    const totalChars = currentWords.join('').length;
    const size = Math.max(longest + 2, Math.ceil(Math.sqrt(totalChars * 2.5)));

    const grid = Array(size).fill(null).map(() => Array(size).fill(''));
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];

    currentWords.forEach(word => {
        let placed = false;
        let attempts = 0;
        while (!placed && attempts < 200) {
            const dir = directions[Math.floor(Math.random() * directions.length)];
            const row = Math.floor(Math.random() * size);
            const col = Math.floor(Math.random() * size);
            if (canPlace(word, row, col, dir, grid, size)) {
                for (let i = 0; i < word.length; i++) {
                    grid[row + i * dir[0]][col + i * dir[1]] = word[i];
                }
                placed = true;
            }
            attempts++;
        }
    });

    currentGrid = grid;
    renderGrid(currentGrid, size, currentWords);
}

function renderGrid(grid, size, words) {
    const gridEl = document.getElementById('grid');
    gridEl.style.gridTemplateColumns = `repeat(${size}, 30px)`;
    gridEl.innerHTML = '';
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    grid.forEach((row, rowIndex) => row.forEach((char, colIndex) => {
        const div = document.createElement('div');
        div.className = 'cell';
        div.textContent = char || alphabet[Math.floor(Math.random() * 26)];
        div.dataset.row = rowIndex;
        div.dataset.col = colIndex;
        gridEl.appendChild(div);
    }));

    const listEl = document.getElementById('list');
    listEl.innerHTML = ''; 
    words.forEach(word => {
        const li = document.createElement('li');
        li.textContent = word;
        listEl.appendChild(li);
    });
}