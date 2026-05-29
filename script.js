document.getElementById('openSettings').addEventListener('click', () => {
    document.getElementById('setup-panel').style.display = 'block';
});

document.getElementById('generateBtn').addEventListener('click', generateGame);

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
    const words = input.split(',').map(w => w.trim().toUpperCase()).filter(w => w.length > 0);

    // Safety check: ensure words exist
    if (words.length === 0) return;

    const longest = Math.max(...words.map(w => w.length));
    const totalChars = words.join('').length;
    // Increased buffer for better placement success rate
    const size = Math.max(longest + 2, Math.ceil(Math.sqrt(totalChars * 2.5)));

    const grid = Array(size).fill(null).map(() => Array(size).fill(''));
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];

    words.forEach(word => {
        let placed = false;
        let attempts = 0;
        while (!placed && attempts < 200) { // Increased attempts for complex grids
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

    renderGrid(grid, size, words);
}

function renderGrid(grid, size, words) {
    const gridEl = document.getElementById('grid');
    gridEl.style.gridTemplateColumns = `repeat(${size}, 30px)`;
    gridEl.innerHTML = '';

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    // 1. Render the Grid Cells
    grid.forEach(row => row.forEach(char => {
        const div = document.createElement('div');
        div.className = 'cell';
        div.style.width = '30px';
        div.style.height = '30px';
        div.textContent = char || alphabet[Math.floor(Math.random() * 26)];
        gridEl.appendChild(div);
    }));

    // 2. Update the Word List (Moved OUTSIDE the loops)
    const listEl = document.getElementById('list');
    listEl.innerHTML = '';
    words.forEach(word => {
        const li = document.createElement('li');
        li.textContent = word;
        listEl.appendChild(li);
    });
}