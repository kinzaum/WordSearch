
let isDragging = false;
let startCell = null;
let selectedCells = []; 
let currentGrid = []; // Define globally so mouseup can access it
let currentWords = []; // Define globally so mouseup can access it
let hoverTimer = null; // Store the timer
let currentDirection = null;

// --- 2. Global Event Listeners ---
document.getElementById('openSettings').addEventListener('click', () => {
    document.getElementById('setup-panel').style.display = 'block';
});

document.getElementById('generateBtn').addEventListener('click', generateGame);

function markWordAsFound(word) {
    const listItems = document.querySelectorAll('#list li');
    listItems.forEach(li => {
        if (li.textContent === word) {
            li.style.textDecoration = 'line-through';
            li.style.color = '#a0a0a0'; 
            li.style.opacity = '0.6';   
        }
    });

    // NOW this is inside the function, where it belongs:
    const allFound = Array.from(listItems).every(li => li.style.textDecoration === 'line-through');
    if (allFound) {
        setTimeout(() => alert("Congratulations! You found all the words!"), 500);
    }
}

document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;

    // Reset the transform on all cells
    document.querySelectorAll('.cell').forEach(el => el.style.transform = "scale(1)");

    let formedWord = selectedCells.map(cell => currentGrid[cell.row][cell.col]).join('');
    
    if (currentWords.includes(formedWord)) {
        console.log("Found word:", formedWord);
        
        // Correctly apply styles to each selected element
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

// --- 3. Game Logic Functions ---
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
    
    // Assign to the global variable so mouseup can see it
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
        if (!placed) console.warn(`Could not place word: ${word}`);
    });

    // Save grid to global variable and render
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

        div.addEventListener('mousedown', () => {
            isDragging = true;
            selectedCells = [{ row: rowIndex, col: colIndex }];
            div.classList.add('selected');
            div.style.transform = "scale(0.98)"; // Visual "press"
            currentDirection = null;
        });

        div.addEventListener('mouseover', () => {
            if (!isDragging) return;

            // Clear any existing timer so we don't start multiple
            clearTimeout(hoverTimer);

            // Set a new timer
            hoverTimer = setTimeout(() => {
                // Enforce the direction lock logic here as well
                if (!div.classList.contains('selected')) {
                    div.classList.add('selected');
                    selectedCells.push({ 
                        row: parseInt(div.dataset.row), 
                        col: parseInt(div.dataset.col) 
                    });
                }
            }, 100); // 0.1 seconds delay
        });

            div.addEventListener('mouseout', () => {
            clearTimeout(hoverTimer);
        });
        
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