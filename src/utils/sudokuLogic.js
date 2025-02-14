export const createEmptyGrid = () => {
    return Array(9).fill().map(() => Array(9).fill(null));
};

export const isValidMove = (grid, row, col, num) => {
    const tempGrid = grid.map(row => [...row]);
    tempGrid[row][col] = null;

    for (let x = 0; x < 9; x++) {
        if (tempGrid[row][x] === num) return false;
    }

    for (let x = 0; x < 9; x++) {
        if (tempGrid[x][col] === num) return false;
    }

    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (tempGrid[boxRow + i][boxCol + j] === num) return false;
        }
    }
    return true;
};

export const solveSudoku = (grid) => {
    const emptyCell = findEmptyCell(grid);
    if (!emptyCell) return true;

    const [row, col] = emptyCell;
    const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    for (const num of nums) {
        if (isValidMove(grid, row, col, num)) {
            grid[row][col] = num;
            if (solveSudoku(grid)) return true;
            grid[row][col] = null;
        }
    }
    return false;
};

const findEmptyCell = (grid) => {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (grid[row][col] === null) return [row, col];
        }
    }
    return null;
};

const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

export const createSolvedGrid = () => {
    const grid = createEmptyGrid();
    solveSudoku(grid);
    return grid;
};

export const createPuzzleFromSolution = (solvedGrid, difficulty) => {
    const puzzle = solvedGrid.map(row => [...row]);
    const cellsToRemove = {
        easy: 20,
        medium: 35,
        hard: 50
    }[difficulty];

    const positions = shuffle(
        Array(81).fill().map((_, i) => [Math.floor(i / 9), i % 9])
    );

    for (let i = 0; i < cellsToRemove; i++) {
        const [row, col] = positions[i];
        puzzle[row][col] = null;
    }
    return puzzle;
};

export const checkSolution = (grid) => {
    if (grid.some(row => row.includes(null))) return false;

    for (let row = 0; row < 9; row++) {
        const rowNums = new Set(grid[row]);
        if (rowNums.size !== 9) return false;
    }

    for (let col = 0; col < 9; col++) {
        const colNums = new Set(grid.map(row => row[col]));
        if (colNums.size !== 9) return false;
    }

    for (let boxRow = 0; boxRow < 9; boxRow += 3) {
        for (let boxCol = 0; boxCol < 9; boxCol += 3) {
            const boxNums = new Set();
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    boxNums.add(grid[boxRow + i][boxCol + j]);
                }
            }
            if (boxNums.size !== 9) return false;
        }
    }

    return true;
};

const isValidUnit = (unit) => {
    const nums = unit.filter(n => n !== null);
    return nums.length === new Set(nums).size;
};

const isValidBox = (grid, boxIndex) => {
    const boxRow = Math.floor(boxIndex / 3) * 3;
    const boxCol = (boxIndex % 3) * 3;
    const box = [];

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            box.push(grid[boxRow + i][boxCol + j]);
        }
    }
    return isValidUnit(box);
};
