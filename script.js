// --- 1. Global Variables ---
let isDragging = false;
let selectedCells = []; 
let currentGrid = []; 
let currentWords = []; 
let placedWords = []; 
let currentDirection = null;

const wordCategories = {
    FRUITS: "APPLE,BANANA,CHERRY,ORANGE,PEACH,GRAPE,MELON,BERRY,KIWI,MANGO,LEMON,LIME,PLUM,PEAR,FIG,GUAVA,DATE,PAPAYA,COCONUT,APRICOT,TANGERINE,GRAPEFRUIT,CRANBERRY,BLACKBERRY,PASSIONFRUIT,DRAGONFRUIT,LYCHEE,PERSIMMON,POMEGRANATE,RHUBARB,STARFRUIT,TANGELO,CURRANT,ELDERBERRY,GOOSEBERRY,MULBERRY,BOYSENBERRY,SALAL,LOQUAT,QUINCE,CLEMENTINE,SATSUMA,KUMQUAT,CITRON",
    ANIMALS: "TIGER,LION,ELEPHANT,ZEBRA,GIRAFFE,MONKEY,DOG,CAT,RABBIT,HORSE,BEAR,WOLF,FOX,DEER,MOOSE,SQUIRREL,PANDA,KOALA,KANGAROO,HIPPO,RHINO,LEOPARD,CHEETAH,PANTHER,JAGUAR,BUFFALO,BISON,CAMEL,LLAMA,ALPACA,SHEEP,GOAT,COW,PIG,DONKEY,MOUSE,RAT,HAMSTER,BADGER,OTTER,SEAL,WALRUS,WHALE,DOLPHIN,SHARK,EAGLE,HAWK,OWL,PENGUIN",
    TECHNOLOGY: "CODE,SCRIPT,HTML,CSS,BROWSER,SERVER,DATABASE,NETWORK,CLOUD,MOBILE,TABLET,LAPTOP,KEYBOARD,MOUSE,SCREEN,PIXEL,BINARY,ALGORITHM,DEBUG,SOFTWARE,HARDWARE,MEMORY,PROCESSOR,ROBOT,DRONE,VR,AR,WIFI,BLUETOOTH,SECURITY,ENCRYPT,FIREWALL,PYTHON,JAVA,JAVASCRIPT,LINUX,WINDOWS,ANDROID,IOS,UPDATE,DOWNLOAD,UPLOAD,STORAGE,CYBER,DIGITAL,VIRTUAL,DATA,LINK,NODE,SYSTEM",
    SPACE: "PLANET,STAR,GALAXY,ORBIT,MOON,SUN,COMET,ASTEROID,NEBULA,ROCKET,ALIEN,GRAVITY,TELESCOPE,VACUUM,SUNLIGHT,METEOR,ECLIPSE,COSMOS,QUASAR,PULSAR,VOID,SYSTEM,SHUTTLE,MISSION",
    OCEAN: "WAVE,CORAL,REEF,SHARK,WHALE,DOLPHIN,TURTLE,SEAL,FISH,CRAB,STARFISH,SQUID,OCTOPUS,JELLYFISH,SHELL,TIDE,CURRENT,DEPTH,ISLAND,SAND,SALT,KELP,ABYSS,BEACH",
    CITIES: "PARIS,LONDON,TOKYO,NEWYORK,BERLIN,ROME,MADRID,SYDNEY,TORONTO,DUBAI,MOSCOW,CAIRO,BEIJING,SEOUL,MUMBAI,BANGKOK,LIMA,VIENNA,PRAGUE,ATHENS,OSLO,DENVER,CHICAGO,BOSTON",
    MUSIC: "JAZZ,ROCK,BLUES,POP,SOUL,FUNK,OPERA,CHOIR,GUITAR,PIANO,DRUMS,BASS,VIOLIN,FLUTE,TRUMPET,TEMPO,RHYTHM,CHORD,LYRIC,VOCAL,AUDIO,RADIO,STAGE,SOLO",
    COLORS: "RED,BLUE,GREEN,YELLOW,PURPLE,ORANGE,PINK,BROWN,BLACK,WHITE,GRAY,CYAN,MAGENTA,GOLD,SILVER,BEIGE,MAROON,TEAL,INDIGO,NAVY,LIME,OLIVE,CORAL,IVORY",
    SPORTS: "SOCCER,TENNIS,GOLF,RUGBY,HOCKEY,BASEBALL,BOXING,JUDO,KARATE,SKIING,SURFING,CHESS,CYCLING,FENCING,ROWING,DIVING,ARCHERY,CRICKET,DARTS,TRACK,SUMO,JUDO,RUGBY,POLO",
    FOOD: "PIZZA,PASTA,SUSHI,TACO,CURRY,SALAD,SOUP,BREAD,CAKE,STEAK,BURGER,TOFU,CHILI,RICE,CAKE,PIE,TART,TOAST,CHEESE,YOGURT,HONEY,JAM,SOUP,STEW",
    WEATHER: "RAIN,SNOW,WIND,SUNNY,CLOUD,STORM,FOGGY,MIST,THUNDER,LIGHTNING,HAIL,HEAT,COLD,FROST,SNOWY,HUMID,DRY,WET,CLEAR,CLOUDY,BREEZE,GALE,STORM,WINDY",
    TOOLS: "HAMMER,DRILL,SAW,PLIERS,WRENCH,NAIL,SCREW,BOLT,LEVEL,TAPE,RULER,FILE,KNIFE,AXE,PLANE,BRUSH,DRILL,BIT,VISE,CLAMP,SNIPS,CHISEL,LEVEL,BOLT",
    CLOTHING: "SHIRT,PANTS,DRESS,SKIRT,HAT,SHOES,BOOTS,SOCKS,COAT,JACKET,SCARF,GLOVES,BELT,TIE,SUIT,JEANS,VEST,SHORTS,CAP,HAT,BOOTS,CLOAK,ROBE,SHIRT",
    BODY: "HEAD,EYE,EAR,NOSE,MOUTH,NECK,ARM,HAND,FINGER,LEG,FOOT,TOE,BACK,CHEST,HEART,LUNGS,BRAIN,BLOOD,SKIN,BONE,MUSCLE,KNEE,ELBOW,JAW",
    NATURE: "TREE,LEAF,ROOT,FLOWER,GRASS,BUSH,FOREST,WOOD,RIVER,LAKE,MOUNTAIN,HILL,VALLEY,CAVE,STONE,ROCK,SAND,SKY,CLOUD,WIND,RAIN,SNOW,FIRE,ICE",
    BRASIL: "BRASIL,AMOR,FELIZ,AMIGO,CASA,FLOR,MAR,SOL,LUA,LIVRO,CARRO,ESCOLA,PORTA,JANELA,MESA,CADEIRA,PEDRA,AGUA,FOGO,TERRA,CHUVA,VENTO,NOITE,DIA,VIDA,CANCAO,DANCA,JOGO,COMIDA,CAFE,PAO,LEITE,CARNE,PEIXE,FRUTA,VERDE,AZUL,PRETO,BRANCO,ROXO,MUNDO,TEMPO,CORACAO,MENTE,ALMA,ESPERANCA,SONHO,VIAGEM,CALOR,FRIO"
};

// --- 2. Event Listeners ---
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
    const panel = document.getElementById('setup-panel');
    if (panel) {
        panel.style.display = 'block';
    } else {
        console.error("Setup panel not found!");
    }
});

document.getElementById('generateBtn').addEventListener('click', generateGame);

document.getElementById('themeSelector').addEventListener('change', (e) => {
    document.body.className = e.target.value || '';
});

window.addEventListener('load', () => {
    const categories = Object.keys(wordCategories);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    // Set the dropdown value
    const select = document.getElementById('wordCategory');
    select.value = randomCategory;

    const themeSelect = document.getElementById('themeSelector');
    themeSelect.value = 'theme-ocean'; // Sets dropdown to Ocean
    document.body.className = 'theme-ocean'; // Applies the CSS class
    
    // Trigger the game generation
    updateWordList(randomCategory);
    generateGame();
});

// Use capture phase on document to ensure global cleanup
document.addEventListener('pointerup', () => {
    isDragging = false;
    selectedCells = [];
    currentDirection = null;
    document.querySelectorAll('.cell').forEach(el => {
        el.style.transform = "scale(1)";
        if (!el.classList.contains('found')) el.classList.remove('selected');
    });
}, true);

// --- 3. Core Logic ---
function updateWordList(category) {
    if (!category || !wordCategories[category]) return;
    const allWords = wordCategories[category].split(',');
    const shuffled = [...allWords].sort(() => 0.5 - Math.random());
    document.getElementById('wordInput').value = shuffled.slice(0, 10).join(',');
}

document.getElementById('hintBtn').addEventListener('click', () => {
    // Find all words that haven't been crossed out yet
    const remainingWords = placedWords.filter(p => {
        const listItems = document.querySelectorAll('#list li');
        let found = true;
        listItems.forEach(li => {
            if (li.textContent === p.word && li.style.textDecoration !== 'line-through') {
                found = false;
            }
        });
        return !found;
    });

    if (remainingWords.length > 0) {
        // Pick a random remaining word
        const hintWord = remainingWords[Math.floor(Math.random() * remainingWords.length)];
        
        // Find the cell element on the grid
        const cells = document.querySelectorAll('.cell');
        const startCell = Array.from(cells).find(el => 
            parseInt(el.dataset.row) === hintWord.startRow && 
            parseInt(el.dataset.col) === hintWord.startCol
        );

        // Flash the cell to show the hint
        if (startCell) {
            startCell.style.outline = "3px solid red";
            setTimeout(() => {
                startCell.style.outline = "none";
            }, 1000);
        }
    }
});

function handleCellEntry(el) {
    // REMOVE the check for .found here. 
    // We only want to stop if the drag isn't active.
    if (!isDragging) return;

    const row = parseInt(el.dataset.row);
    const col = parseInt(el.dataset.col);

    // If it's already selected in the CURRENT drag, ignore it
    if (el.classList.contains('selected')) return;

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
    
    // Check for match after adding the cell
    checkMatch();
}

function checkMatch() {
    const foundWordObj = placedWords.find(p => {
        if (selectedCells.length !== p.word.length) return false;
        return selectedCells.every((cell, index) => 
            cell.row === p.startRow + (index * p.dr) && 
            cell.col === p.startCol + (index * p.dc)
        );
    });

    if (foundWordObj) {
        document.querySelectorAll('.cell.selected').forEach(cellEl => {
            cellEl.classList.add('found');
            cellEl.classList.remove('selected');
        });
        markWordAsFound(foundWordObj.word);
        isDragging = false;
        selectedCells = [];
        currentDirection = null;
    }
}

function markWordAsFound(word) {
    const listItems = document.querySelectorAll('#list li');
    listItems.forEach(li => {
        if (li.textContent === word) {
            li.style.textDecoration = 'line-through';
            li.style.color = '#a0a0a0';
        }
    });

    const allFound = Array.from(listItems).every(li => li.style.textDecoration === 'line-through');
    if (allFound) {
        const congrats = document.getElementById('congrats-panel');
        congrats.style.display = 'block';
        setTimeout(() => congrats.style.display = 'none', 3000);
    }
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
    // Get and sanitize input
    const input = document.getElementById('wordInput').value;
    const wordsToPlace = input.split(',').map(w => w.trim().toUpperCase()).filter(w => w.length > 0);
    
    // 1. Length Validation: Prevent freezing by checking word length
    const size = 12;
    const longWord = wordsToPlace.find(w => w.length > size);
    if (longWord) {
        alert("Oops! The word '" + longWord + "' is too long. Please use words with " + size + " characters or fewer.");
        return; // Exit function so it doesn't enter the infinite loop
    }

    if (wordsToPlace.length === 0) return;
    
    // Close the settings panel after validation
    document.getElementById('setup-panel').style.display = 'none';

    let success = false;
    let grid, finalPlacedWords;
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];

    // 2. Generation Loop: Keeps trying until all words fit
    while (!success) {
        grid = Array(size).fill(null).map(() => Array(size).fill(''));
        finalPlacedWords = [];
        let allPlaced = true;

        for (const word of wordsToPlace) {
            let placed = false;
            let attempts = 0;
            // Try to place each word up to 100 times
            while (!placed && attempts < 100) {
                const dir = directions[Math.floor(Math.random() * directions.length)];
                const row = Math.floor(Math.random() * size);
                const col = Math.floor(Math.random() * size);
                
                if (canPlace(word, row, col, dir, grid, size)) {
                    finalPlacedWords.push({ word, startRow: row, startCol: col, dr: dir[0], dc: dir[1] });
                    for (let i = 0; i < word.length; i++) {
                        grid[row + i * dir[0]][col + i * dir[1]] = word[i];
                    }
                    placed = true;
                }
                attempts++;
            }
            if (!placed) {
                allPlaced = false;
                break; // Failed to place a word, restart the whole grid
            }
        }
        if (allPlaced) success = true;
    }

    // 3. Finalize
    placedWords = finalPlacedWords;
    currentGrid = grid;
    renderGrid(grid, size, wordsToPlace);
}

function renderGrid(grid, size, words) {
    const gridEl = document.getElementById('grid');
    //gridEl.style.gridTemplateColumns = `repeat(${size}, 30px)`;
    gridEl.innerHTML = '';
    
    grid.forEach((row, r) => row.forEach((c, col) => {
        const div = document.createElement('div');
        div.className = 'cell';
        div.textContent = grid[r][col] || String.fromCharCode(65 + Math.floor(Math.random() * 26));
        div.dataset.row = r;
        div.dataset.col = col;
        gridEl.appendChild(div);
    }));

    // Reset interaction handlers
    gridEl.onpointerdown = (e) => {
        isDragging = true;
        selectedCells = [];
        currentDirection = null;
        document.querySelectorAll('.cell').forEach(el => el.classList.remove('selected'));
        if (e.target.classList.contains('cell')) {
            handleCellEntry(e.target);
        }
    };

    gridEl.onpointermove = (e) => {
        if (!isDragging) return;
        // Use elementFromPoint to find the cell under the pointer regardless of what event fired
        const el = document.elementFromPoint(e.clientX, e.clientY);
        if (el && el.classList.contains('cell')) {
            handleCellEntry(el);
        }
    };

    // Ensure dragging ends regardless of where the pointer is released
    gridEl.onpointerup = () => {
        isDragging = false;
    };

    const listEl = document.getElementById('list');
    listEl.innerHTML = ''; 
    words.forEach(word => {
        const li = document.createElement('li');
        li.textContent = word;
        listEl.appendChild(li);
    });
}
