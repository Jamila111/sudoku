import { create } from 'zustand';
import {
    createEmptyGrid,
    createSolvedGrid,
    createPuzzleFromSolution,
    checkSolution,
    isValidMove
} from './utils/sudokuLogic';

const useStore = create((set, get) => ({
    sudokuGrid: createEmptyGrid(),
    initialGrid: Array(9).fill().map(() => Array(9).fill(false)),
    selectedCell: null,
    isComplete: false,
    difficulty: 'medium',
    errors: new Set(),

    generateNewPuzzle: () => {
        const { difficulty } = get();
        const solvedGrid = createSolvedGrid();
        const puzzleGrid = createPuzzleFromSolution(solvedGrid, difficulty);
        const initialGridState = puzzleGrid.map(row =>
            row.map(cell => cell !== null)
        );

        set({
            sudokuGrid: puzzleGrid,
            initialGrid: initialGridState,
            selectedCell: null,
            isComplete: false,
            errors: new Set()
        });
    },

    setDifficulty: (difficulty) => set({ difficulty }),

    setSelectedCell: (cell) => set({ selectedCell: cell }),

    updateCell: (row, col, value) => {
        const { sudokuGrid, initialGrid, errors } = get();
        if (initialGrid[row][col]) return;

        const newGrid = sudokuGrid.map(r => [...r]);
        newGrid[row][col] = value;

        if (value === null) {
            const key = `${row},${col}`;
            const newErrors = new Set(errors);
            newErrors.delete(key);
            set({
                sudokuGrid: newGrid,
                errors: newErrors,
                isComplete: false
            });
            return;
        }

        const newErrors = new Set(errors);
        const key = `${row},${col}`;

        if (!isValidMove(newGrid, row, col, value)) {
            newErrors.add(key);
        } else {
            newErrors.delete(key);
        }

        const isComplete = newErrors.size === 0 && checkSolution(newGrid);

        set({
            sudokuGrid: newGrid,
            errors: newErrors,
            isComplete
        });
    },

    clearCell: () => {
        const { selectedCell, initialGrid } = get();
        if (selectedCell && !initialGrid[selectedCell[0]][selectedCell[1]]) {
            get().updateCell(selectedCell[0], selectedCell[1], null);
        }
    }
}));

export default useStore;