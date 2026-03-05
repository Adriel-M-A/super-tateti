import React from 'react';

// Representa una celda individual que puede ser un valor (X, O, null) o un sub-tablero
const Cell = ({ value, onClick, isSelectable, level }) => {
    // Si el valor es un array, significa que es un sub-tablero (recursividad)
    if (Array.isArray(value)) {
        return (
            <div className={`p-1 border shadow-inner transition-all duration-300 ${isSelectable ? 'bg-slate-800/50 border-violet-500/50 shadow-violet-500/20' : 'bg-slate-900/20 border-slate-700/30 grayscale-[0.5]'}`}>
                <Board
                    cells={value}
                    onCellClick={onClick}
                    level="sub"
                    isSelectable={isSelectable}
                />
            </div>
        );
    }

    // Si es una celda final (X, O o vacío)
    return (
        <button
            onClick={isSelectable ? onClick : undefined}
            className={`
        aspect-square flex items-center justify-center text-3xl font-bold transition-all duration-200
        ${level === 'sub' ? 'text-xl' : 'text-5xl'}
        ${!value && isSelectable ? 'hover:bg-violet-500/10 cursor-pointer' : 'cursor-default'}
        ${level === 'sub' ? 'border-[0.5px] border-slate-700/50' : 'border-2 border-slate-600'}
        ${value === 'X' ? 'text-violet-500 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]' : ''}
        ${value === 'O' ? 'text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]' : ''}
      `}
        >
            {value}
        </button>
    );
};

const Board = ({ cells, onCellClick, level = 'super', isSelectable = true, activeSubBoard = null }) => {
    return (
        <div className={`grid grid-cols-3 gap-1 w-full aspect-square ${level === 'super' ? 'max-w-md mx-auto p-2 bg-slate-800 rounded-xl shadow-2xl border border-slate-700' : ''}`}>
            {cells.map((cell, index) => {
                // En el nivel super, determinamos si este sub-tablero es el que debe jugarse
                const canPlayInThisCell = level === 'super' ? (activeSubBoard === null || activeSubBoard === index) : isSelectable;

                return (
                    <Cell
                        key={index}
                        value={cell}
                        level={level}
                        isSelectable={canPlayInThisCell}
                        onClick={() => onCellClick(index)}
                    />
                );
            })}
        </div>
    );
};

export default Board;
