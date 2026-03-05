import { useState } from 'react'
import Board from './components/Board'

function App() {
  // El estado inicial es un array de 9 elementos, cada uno es un array de 9 nulls (los sub-tableros)
  const [board, setBoard] = useState(Array(9).fill(null).map(() => Array(9).fill(null)))
  const [isXNext, setIsXNext] = useState(true)
  const [activeSubBoard, setActiveSubBoard] = useState(null) // null significa que puede jugar en cualquier lado

  const handleCellClick = (boardIndex, cellIndex) => {
    // Por ahora solo una función simple para demostrar la interactividad
    console.log(`Jugada en sub-tablero ${boardIndex}, celda ${cellIndex}`);

    // Aquí irá la lógica compleja de validación y cambio de turno
    const newBoard = board.map((subBoard, bIdx) => {
      if (bIdx === boardIndex) {
        return subBoard.map((cell, cIdx) => {
          if (cIdx === cellIndex && cell === null) {
            return isXNext ? 'X' : 'O';
          }
          return cell;
        });
      }
      return subBoard;
    });

    setBoard(newBoard);
    setIsXNext(!isXNext);
    // Siguiendo la regla: la celda marcada (cellIndex) determina el próximo sub-tablero (activeSubBoard)
    setActiveSubBoard(cellIndex);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
      <header className="mb-8 text-center">
        <h1 className="text-4xl md:text-6xl font-black mb-2 bg-clip-text text-transparent from-violet-400 to-pink-400 drop-shadow-sm">
          SUPER TA-TE-TI
        </h1>
        <div className="flex items-center justify-center gap-4 text-xl font-medium">
          <span className={isXNext ? 'text-violet-400 border-b-2 border-violet-400' : 'text-slate-500'}>Jugador X</span>
          <span className="text-slate-700">|</span>
          <span className={!isXNext ? 'text-pink-400 border-b-2 border-pink-400' : 'text-slate-500'}>Jugador O</span>
        </div>
      </header>

      <main className="w-full max-w-2xl">
        <Board
          cells={board}
          onCellClick={(boardIndex) => (cellIndex) => handleCellClick(boardIndex, cellIndex)}
          activeSubBoard={activeSubBoard}
        />
      </main>

      <footer className="mt-8 text-slate-500 text-sm italic">
        {activeSubBoard === null
          ? "Puedes jugar en cualquier tablero"
          : `Obligado a jugar en el tablero ${activeSubBoard + 1}`}
      </footer>
    </div>
  )
}

export default App
