import React, { useState, useEffect } from 'react'
import Board from './components/Board'
import PlayerSetup from './components/PlayerSetup'
import * as LucideIcons from 'lucide-react'

function App() {
  // Estados del juego
  const [gameState, setGameState] = useState('setup') // 'setup' | 'playing'
  const [players, setPlayers] = useState({
    P1: { icon: 'X', color: 'blue' },
    P2: { icon: 'Circle', color: 'red' }
  })

  const [board, setBoard] = useState(Array(9).fill(null).map(() => Array(9).fill(null)))
  const [isXNext, setIsXNext] = useState(true)
  const [activeSubBoard, setActiveSubBoard] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [subBoardWinners, setSubBoardWinners] = useState(Array(9).fill(null))
  const [globalWinner, setGlobalWinner] = useState(null)

  const handleSetupComplete = (selectedPlayers) => {
    setPlayers(selectedPlayers);
    setGameState('playing');
  }

  // Aplicar o quitar la clase 'dark' del elemento html
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const toggleTheme = () => setIsDarkMode(!isDarkMode)

  // Función para comprobar si hay un ganador en un tablero de 9 celdas
  const checkWinner = (cells) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontales
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Verticales
      [0, 4, 8], [2, 4, 6],             // Diagonales
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];

      // Lógica de ganador normal
      if (cells[a] && cells[a] !== 'DRAW' && cells[a] === cells[b] && cells[a] === cells[c]) {
        return cells[a];
      }

      // Lógica de comodín: Una línea gana para 'X' si tiene solo 'X' y 'DRAW' 
      // y al menos una 'X' (para evitar que una línea de vacíos cuente)
      const xLine = [a, b, c].every(idx => cells[idx] === 'X' || cells[idx] === 'DRAW');
      const hasX = [a, b, c].some(idx => cells[idx] === 'X');
      if (xLine && hasX) return 'X';

      const oLine = [a, b, c].every(idx => cells[idx] === 'O' || cells[idx] === 'DRAW');
      const hasO = [a, b, c].some(idx => cells[idx] === 'O');
      if (oLine && hasO) return 'O';
    }
    return null;
  };

  const handleCellClick = (boardIndex, cellIndex) => {
    // 0. Validar si ya terminó el juego
    if (globalWinner) return;

    // 1. Validar si es el sub-tablero correcto
    if (activeSubBoard !== null && activeSubBoard !== boardIndex) return;

    // 2. Validar si el sub-tablero ya tiene ganador
    if (subBoardWinners[boardIndex]) return;

    // 3. Validar si la celda ya está ocupada
    if (board[boardIndex][cellIndex]) return;

    // Realizar la jugada
    const newBoard = board.map((subBoard, bIdx) => {
      if (bIdx === boardIndex) {
        const newSubBoard = [...subBoard];
        newSubBoard[cellIndex] = isXNext ? 'X' : 'O';
        return newSubBoard;
      }
      return subBoard;
    });

    // Comprobar si esta jugada gana el sub-tablero
    const newSubBoardWinners = [...subBoardWinners];
    const winner = checkWinner(newBoard[boardIndex]);
    if (winner) {
      newSubBoardWinners[boardIndex] = winner;
    } else if (newBoard[boardIndex].every(cell => cell !== null)) {
      // Si no hay ganador pero el tablero está lleno, es un EMPATE/COMODÍN
      newSubBoardWinners[boardIndex] = 'DRAW';
    }

    // Comprobar si esta victoria de sub-tablero gana el juego global
    const finalWinner = checkWinner(newSubBoardWinners);
    if (finalWinner) {
      setGlobalWinner(finalWinner);
    }

    // Determinar el próximo sub-tablero activo
    let nextActiveSubBoard = cellIndex;

    // Si el tablero marcado ya estaba terminado (ganado o lleno), el jugador tiene libertad
    if (newSubBoardWinners[nextActiveSubBoard]) {
      nextActiveSubBoard = null;
    }

    setBoard(newBoard);
    setSubBoardWinners(newSubBoardWinners);
    setIsXNext(!isXNext);
    setActiveSubBoard(nextActiveSubBoard);
  }

  return (
    <div className="min-h-screen bg-page-bg text-page-text flex flex-col items-center justify-center p-4 transition-colors duration-300">
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:scale-110 transition-all font-bold text-sm"
        title="Cambiar tema"
      >
        {isDarkMode ? '🌞 MODO CLARO' : '🌙 MODO OSCURO'}
      </button>

      <header className="mb-8 text-center flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter">
          SUPER TA-TE-TI
        </h1>

        {globalWinner ? (
          <div
            className="bg-white/5 p-8 rounded-3xl border-4 animate-bounce shadow-2xl flex flex-col items-center gap-4 transition-all"
            style={{
              borderColor: players[globalWinner === 'X' ? 'P1' : 'P2'].color,
              boxShadow: `0 0 40px ${players[globalWinner === 'X' ? 'P1' : 'P2'].color}44`
            }}
          >
            <div
              className="p-4 rounded-full bg-white/10"
              style={{ color: players[globalWinner === 'X' ? 'P1' : 'P2'].color }}
            >
              {React.createElement(LucideIcons[players[globalWinner === 'X' ? 'P1' : 'P2'].icon], { size: 64, strokeWidth: 4 })}
            </div>
            <h2 className="text-4xl font-black uppercase tracking-tighter" style={{ color: players[globalWinner === 'X' ? 'P1' : 'P2'].color }}>
              ¡GANADOR JUGADOR {globalWinner === 'X' ? '1' : '2'}!
            </h2>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors uppercase text-sm font-bold"
            >
              Reiniciar Juego
            </button>
          </div>
        ) : gameState === 'playing' ? (
          <div className="flex items-center justify-center gap-8 text-2xl font-bold">
            <div
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all ${isXNext ? 'shadow-lg scale-110' : 'opacity-30'}`}
              style={{
                backgroundColor: isXNext ? players.P1.color : 'transparent',
                color: isXNext ? 'white' : 'currentColor',
                border: `2px solid ${players.P1.color}`
              }}
            >
              {React.createElement(LucideIcons[players.P1.icon], { size: 28, strokeWidth: 3 })}
              JUGADOR 1
            </div>
            <div
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all ${!isXNext ? 'shadow-lg scale-110' : 'opacity-30'}`}
              style={{
                backgroundColor: !isXNext ? players.P2.color : 'transparent',
                color: !isXNext ? 'white' : 'currentColor',
                border: `2px solid ${players.P2.color}`
              }}
            >
              {React.createElement(LucideIcons[players.P2.icon], { size: 28, strokeWidth: 3 })}
              JUGADOR 2
            </div>
          </div>
        ) : (
          <p className="text-slate-500 font-bold uppercase tracking-widest animate-pulse">
            Configura tu identidad de batalla
          </p>
        )}
      </header>

      <main className="w-full flex justify-center">
        {gameState === 'setup' ? (
          <PlayerSetup onComplete={handleSetupComplete} />
        ) : (
          <div className="w-full max-w-2xl">
            <Board
              cells={board}
              onCellClick={handleCellClick}
              activeSubBoard={activeSubBoard}
              subBoardWinners={subBoardWinners}
              playersConfig={players}
            />
          </div>
        )}
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
