import React, { useEffect } from 'react';
import Board from "./Board";
import useStore from "./store";

const GenerateGrid = () => {
    const generateNewPuzzle = useStore(state => state.generateNewPuzzle);

    useEffect(() => {
        generateNewPuzzle();
    }, [generateNewPuzzle]);

    return <Board />;
};

export default GenerateGrid;
