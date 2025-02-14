import React from 'react';
import useStore from './store';

const Cell = ({ row, col, value }) => {
    const selectedCell = useStore(state => state.selectedCell);
    const setSelectedCell = useStore(state => state.setSelectedCell);
    const initialGrid = useStore(state => state.initialGrid);
    const errors = useStore(state => state.errors);

    const isSelected = selectedCell &&
        selectedCell[0] === row &&
        selectedCell[1] === col;
    const isInitial = initialGrid[row][col];
    const hasError = errors.has(`${row},${col}`);

    const handleClick = () => {
        if (!isInitial) {
            setSelectedCell([row, col]);
        }
    };

    return (
        <div
            className={`sudoku-cell ${isSelected ? 'selected' : ''} 
                       ${isInitial ? 'initial' : ''} 
                       ${hasError ? 'error' : ''}`}
            onClick={handleClick}
        >
            {value || ''}
        </div>
    );
};

export default Cell;