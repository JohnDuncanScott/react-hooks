// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react';
import { useLocalStorageState } from '../utils';
const initialSquares = Array(9).fill(null);

function Board({ squares, onClick }) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const [history, setHistory] = useLocalStorageState("tic-tac-toe:history", [initialSquares]);
  const [currentStep, setCurrentStep] = useLocalStorageState("tic-tac-toe:step", 0);

  const currentSquares = history[currentStep];
  const winner = calculateWinner(currentSquares);
  const nextValue = calculateNextValue(currentSquares);
  const status = calculateStatus(winner, currentSquares, nextValue);

  function selectSquare(squareIndex) {
    if (winner || currentSquares[squareIndex]) {
      return;
    }

    const newHistory = history.slice(0, currentStep + 1);
    const squaresCopy = [...currentSquares];

    squaresCopy[squareIndex] = nextValue;
    setHistory([...newHistory, squaresCopy]);
    setCurrentStep(newHistory.length);
  }

  function restart() {
    setHistory([ initialSquares ]);
    setCurrentStep(0);
  }

  const moves = history.map((stepSquares, step) => {
    const description = step ? `Go to move #${step}` : "Go to game start";
    const isCurrentStep = step === currentStep;

    return (
      <li key={step}>
        <button disabled={isCurrentStep} onClick={() => setCurrentStep(step)}>
          {description} {isCurrentStep ? "(current)" : null}
        </button>
      </li>
    )
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={currentSquares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

function calculateStatus(winner, squares, nextValue) {
  if (winner) {
    return `Winner: ${winner}`;
  }

  return squares.every(Boolean) ? "Scratch: Cat's game" : `Next player: ${nextValue}`;
}

function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O';
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}

function App() {
  return <Game />
}

export default App;
