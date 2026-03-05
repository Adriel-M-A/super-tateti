import React from 'react';

// Representa una celda individual que puede ser un valor (X, O, null) o un sub-tablero
const Cell = ({ value, onClick, isSelectable, level, winner = null }) => {
    // Si hay un ganador en este sub-tablero (y estamos renderizándolo como una celda del super-tablero)
    if (level === 'super' && winner) {
        return (
            <div className={`aspect-square flex items-center justify-center text-8xl font-black rounded-lg transition-all duration-500 bg-white/10 ${winner === 'X' ? 'text-blue-500/80' : 'text-red-500/80 shadow-[inset_0_0_20px_rgba(239,68,68,0.2)]'}`}>
                {winner}
            </div>
        );
    }

    if (Array.isArray(value)) {
        return (
            <div className={`p-1 border transition-all duration-300 ${isSelectable ? 'bg-cell-hover border-board-border shadow-lg scale-[1.02]' : 'bg-transparent border-cell-border opacity-40'}`}>
                <Board
                    cells={value}
                    onCellClick={onClick}
                    level="sub"
                    isSelectable={isSelectable}
                    boardIndex={null} // El boardIndex se pasará desde el nivel superior
                />
            </div>
        );
    }

    return (
        <button
            onClick={isSelectable ? onClick : undefined}
            className={`
        aspect-square flex items-center justify-center font-bold transition-all duration-200
        ${level === 'sub' ? 'text-2xl' : 'text-6xl'}
        ${!value && isSelectable ? 'hover:bg-cell-hover cursor-pointer' : 'cursor-default'}
        ${level === 'sub' ? 'border border-cell-border' : 'border-4 border-board-border'}
        ${value === 'X' ? 'text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]' : ''}
        ${value === 'O' ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]' : ''}
        bg-transparent
      `}
        >
            {value}
        </button>
    );
};

const Board = ({ cells, onCellClick, level = 'super', isSelectable = true, activeSubBoard = null, subBoardWinners = [], boardIndex = null }) => {
    return (
        <div className={`grid grid-cols-3 gap-1 w-full aspect-square ${level === 'super' ? 'max-w-lg mx-auto p-4 bg-transparent' : ''}`}>
            {cells.map((cell, index) => {
                const canPlayInThisCell = level === 'super' ? (activeSubBoard === null || activeSubBoard === index) : isSelectable;

                return (
                    <Cell
                        key={index}
                        value={cell}
                        level={level}
                        isSelectable={canPlayInThisCell}
                        winner={level === 'super' ? subBoardWinners[index] : null}
                        onClick={level === 'super'
                            ? (cellIndex) => onCellClick(index, cellIndex)
                            : () => onCellClick(index)
                        }
                    />
                );
            })}
        </div>
    );
};

export default Board;
