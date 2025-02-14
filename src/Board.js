import React, { useEffect } from 'react';
import { Container, Row, Col, Button, Dropdown, Alert } from 'react-bootstrap';
import Cell from './Cell';
import useStore from './store';

const Board = () => {
    const sudokuGrid = useStore(state => state.sudokuGrid);
    const generateNewPuzzle = useStore(state => state.generateNewPuzzle);
    const difficulty = useStore(state => state.difficulty);
    const setDifficulty = useStore(state => state.setDifficulty);
    const isComplete = useStore(state => state.isComplete);
    const errors = useStore(state => state.errors);
    const clearCell = useStore(state => state.clearCell);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Backspace' || e.key === 'Delete') {
                clearCell();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [clearCell]);

    return (
        <Container className="py-4">
            <Row className="justify-content-center mb-4">
                <Col xs={12} md={8} lg={6} className="text-center">
                    <h2>Sudoku Game</h2>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <Dropdown>
                            <Dropdown.Toggle variant="secondary">
                                Difficulty: {difficulty}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => setDifficulty('easy')}>Easy</Dropdown.Item>
                                <Dropdown.Item onClick={() => setDifficulty('medium')}>Medium</Dropdown.Item>
                                <Dropdown.Item onClick={() => setDifficulty('hard')}>Hard</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <Button variant="primary" onClick={generateNewPuzzle}>
                            New Game
                        </Button>
                    </div>

                    {isComplete && (
                        <Alert variant="success" className="mb-3">
                            Congratulations! You've solved the puzzle!
                        </Alert>
                    )}

                    {errors.size > 0 && (
                        <Alert variant="danger" className="mb-3">
                            There are some incorrect numbers in your solution
                        </Alert>
                    )}
                </Col>
            </Row>

            <Row className="justify-content-center">
                <Col xs={12} md={8} lg={6}>
                    <div className="sudoku-board">
                        {sudokuGrid.map((row, rowIndex) => (
                            row.map((cell, colIndex) => (
                                <Cell
                                    key={`${rowIndex}-${colIndex}`}
                                    row={rowIndex}
                                    col={colIndex}
                                    value={cell}
                                />
                            ))
                        ))}
                    </div>
                    <NumberPad />
                </Col>
            </Row>
        </Container>
    );
};

const NumberPad = () => {
    const updateCell = useStore(state => state.updateCell);
    const selectedCell = useStore(state => state.selectedCell);

    const handleNumberClick = (num) => {
        if (selectedCell) {
            updateCell(selectedCell[0], selectedCell[1], num);
        }
    };

    return (
        <Row className="mt-4 g-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <Col key={num} xs={4}>
                    <Button
                        variant="outline-primary"
                        className="w-100"
                        onClick={() => handleNumberClick(num)}
                    >
                        {num}
                    </Button>
                </Col>
            ))}
            <Col xs={12}>
                <Button
                    variant="outline-secondary"
                    className="w-100"
                    onClick={() => handleNumberClick(null)}
                >
                    Clear
                </Button>
            </Col>
        </Row>
    );
};

export default Board;
