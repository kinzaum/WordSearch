// --- 1. Global Variables ---
let isDragging = false;
let selectedCells = []; 
let currentGrid = []; 
let currentWords = []; 
let placedWords = []; // Track exact word positions and paths
let currentDirection = null;

const wordCategories = {
    FRUITS: "APPLE,BANANA,CHERRY,ORANGE,PEACH,GRAPE,MELON,BERRY,KIWI,MANGO,LEMON,LIME,PLUM,PEAR,FIG,GUAVA,DATE,PAPAYA,COCONUT,APRICOT,TANGERINE,GRAPEFRUIT,CRANBERRY,BLACKBERRY,PASSIONFRUIT,DRAGONFRUIT,LYCHEE,PERSIMMON,POMEGRANATE,RHUBARB,STARFRUIT,TANGELO,CURRANT,ELDERBERRY,GOOSEBERRY,MULBERRY,BOYSENBERRY,SALAL,LOQUAT,QUINCE,CLEMENTINE,SATSUMA,KUMQUAT,CITRON",
    ANIMALS: "TIGER,LION,ELEPHANT,ZEBRA,GIRAFFE,MONKEY,DOG,CAT,RABBIT,HORSE,BEAR,WOLF,FOX,DEER,MOOSE,SQUIRREL,PANDA,KOALA,KANGAROO,HIPPO,RHINO,LEOPARD,CHEETAH,PANTHER,JAGUAR,BUFFALO,BISON,CAMEL,LLAMA,ALPACA,SHEEP,GOAT,COW,PIG,DONKEY,MOUSE,RAT,HAMSTER,BADGER,OTTER,SEAL,WALRUS,WHALE,DOLPHIN,SHARK,EAGLE,HAWK,OWL,PENGUIN",
    TECHNOLOGY: "CODE,SCRIPT,HTML,CSS,BROWSER,SERVER,DATABASE,NETWORK,CLOUD,MOBILE,TABLET,LAPTOP,KEYBOARD,MOUSE,SCREEN,PIXEL,BINARY,ALGORITHM,DEBUG,SOFTWARE,HARDWARE,MEMORY,PROCESSOR,ROBOT,DRONE,VR,AR,WIFI,BLUETOOTH,SECURITY,ENCRYPT,FIREWALL,PYTHON,JAVA,JAVASCRIPT,LINUX,WINDOWS,ANDROID,IOS,UPDATE,DOWNLOAD,UPLOAD,STORAGE,CYBER,DIGITAL,VIRTUAL,DATA,LINK,NODE,SYSTEM"
};

// --- 2. Word Selection & UI ---
function updateWordList(category) {
    if (!category || !wordCategories[category]) return;
    const allWords = wordCategories[category].split(',');
    const shuffled = [...allWords].sort(() => 0.5 - Math.random());
    document.getElementById('wordInput').value = shuffled.slice(0, 10).join(',');
}

document.getElementById('wordCategory').addEventListener('change', (e) => {
    if (!e.target.value) return;
    updateWordList(e.target.value);
    generateGame();
});

document.getElementById('shuffleBtn').addEventListener('click', () => {
    const cat = document.getElementById('wordCategory').value;
    if (!cat) return;
    updateWordList(cat);
    generateGame();
});

document.getElementById('openSettings').addEventListener('click', () => {
    document.getElementById('setup-panel').style.display = 'block';
});

document.getElementById('generateBtn').addEventListener('click', generateGame);

document.getElementById('themeSelector').addEventListener('change', (e) => {
    document.body.className = e.target.value || '';
});

// --- 3. Pointer Logic ---
document.addEventListener('pointerup', () => {
    if (!isDragging) return;
    isDragging = false;

    document.querySelectorAll('.cell').forEach(el => el.style.transform = "scale(1)");

    // Check against placedWords path, not just string value
    const foundWordObj = placedWords.find(p => {
        if (selectedCells.length !== p.word.length) return false;
        return selectedCells.every((cell, index) => {
            return cell.row === p.startRow + (index * p.dr) && 
                   cell.col === p.startCol + (index * p.dc);
        });
    });

    if (foundWordObj) {
        document.querySelectorAll('.cell.selected').forEach(el => {
            el.classList.add('found');
            el.classList.remove('selected');
        });
        markWordAsFound(foundWordObj.word);
    } else {
        document.querySelectorAll('.cell.selected').forEach(el => el.classList.remove('selected'));
    }
    
    selectedCells = [];
    currentDirection = null;
});

function handleCellEntry(el) {
    if (!isDragging || el.classList.contains('selected')) return;

    const row = parseInt(el.dataset.row);
    const col = parseInt(el.dataset.col);

    if (selectedCells.length === 0) {
        addCell(el, row, col);
    } else if (selectedCells.length === 1) {
        const last = selectedCells[0];
        const dr = row - last.row;
        const dc = col - last.col;
        if (Math.abs(dr) <= 1 && Math.abs(dc) <= 1 && !(dr === 0 && dc === 0)) {
            currentDirection = [dr, dc];
            addCell(el, row, col);
        }
    } else {
        const last = selectedCells[selectedCells.length - 1];
        if (row === last.row + currentDirection[0] && col === last.col + currentDirection[1]) {
            addCell(el, row, col);
        }
    }
}

function addCell(el, row, col) {
    el.classList.add('selected');
    el.style.transform = "scale(0.98)";
    selectedCells.push({ row, col });
}

// --- 4. Game Generation ---
function markWordAsFound(word) {
    const listItems = document.querySelectorAll('#list li');
    listItems.forEach(li => {
        if (li.textContent === word) {
            li.style.textDecoration = 'line-through';
            li.style.color = '#a0a0a0';
        }
    });
}

function canPlace(word, row, col, dir, grid, size) {
    for (let i = 0; i < word.length; i++) {
        let r = row + i * dir[0];
        let c = col + i * dir[1];
        if (r < 0 || r >= size || c < 0 || c >= size || (grid[r][c] !== '' && grid[r][c] !== word[i])) return false;
    }
    return true;
}

function generateGame() {
    document.getElementById('setup-panel').style.display = 'none';
    const input = document.getElementById('wordInput').value;
    currentWords = input.split(',').map(w => w.trim().toUpperCase()).filter(w => w.length > 0);
    if (currentWords.length === 0) return;

    placedWords = []; 
    const size = 12; 
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
                placedWords.push({ word, startRow: row, startCol: col, dr: dir[0], dc: dir[1] });
                for (let i = 0; i < word.length; i++) grid[row + i * dir[0]][col + i * dir[1]] = word[i];
                placed = true;
            }
            attempts++;
        }
    });

    currentGrid = grid;
    renderGrid(grid, size, currentWords);
}

function renderGrid(grid, size, words) {
    const gridEl = document.getElementById('grid');
    gridEl.style.gridTemplateColumns = `repeat(${size}, 30px)`;
    gridEl.innerHTML = '';
    
    grid.forEach((row, r) => row.forEach((c, col) => {
        const div = document.createElement('div');
        div.className = 'cell';
        div.textContent = grid[r][col] || String.fromCharCode(65 + Math.floor(Math.random() * 26));
        div.dataset.row = r;
        div.dataset.col = col;
        div.addEventListener('pointerenter', () => handleCellEntry(div));
        div.addEventListener('pointerdown', () => { isDragging = true; handleCellEntry(div); });
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
