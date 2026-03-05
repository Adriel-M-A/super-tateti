import React from 'react';
import * as LucideIcons from 'lucide-react';

const Cell = ({ value, onClick, isSelectable, level, winner = null, playersConfig = null }) => {
    // Si hay un ganador en este sub-tablero (y estamos renderizándolo como una celda del super-tablero)
    if (level === 'super' && winner) {
        if (winner === 'DRAW') {
            return (
                <div className="aspect-square flex items-center justify-center rounded-lg transition-all duration-500 bg-white/5 border border-white/10 relative overflow-hidden group">
                    <span className="text-6xl font-black absolute top-1/2 left-1/2 -translate-x-3/4 -translate-y-3/4 text-blue-500/40 -rotate-12 group-hover:scale-110 transition-transform">
                        {playersConfig ? React.createElement(LucideIcons[playersConfig.P1.icon], { size: 64, strokeWidth: 3 }) : 'X'}
                    </span>
                    <span className="text-6xl font-black absolute top-1/2 left-1/2 -translate-x-1/4 -translate-y-1/4 text-red-500/40 rotate-12 group-hover:scale-110 transition-transform">
                        {playersConfig ? React.createElement(LucideIcons[playersConfig.P2.icon], { size: 64, strokeWidth: 3 }) : 'O'}
                    </span>
                    <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-red-500/10 animate-pulse"></div>
                </div>
            );
        }

        const config = playersConfig ? (winner === 'X' ? playersConfig.P1 : playersConfig.P2) : null;

        return (
            <div
                className={`aspect-square flex items-center justify-center rounded-lg transition-all duration-500 bg-white/10 shadow-lg`}
                style={{ color: config ? config.color : (winner === 'X' ? '#3b82f6' : '#ef4444') }}
            >
                {config
                    ? React.createElement(LucideIcons[config.icon], { size: 80, strokeWidth: 4 })
                    : <span className="text-8xl font-black">{winner}</span>
                }
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
                    playersConfig={playersConfig}
                />
            </div>
        );
    }

    const config = (playersConfig && value) ? (value === 'X' ? playersConfig.P1 : playersConfig.P2) : null;

    return (
        <button
            onClick={isSelectable ? onClick : undefined}
            className={`
        aspect-square flex items-center justify-center transition-all duration-200
        ${!value && isSelectable ? 'hover:bg-cell-hover cursor-pointer' : 'cursor-default'}
        ${level === 'sub' ? 'border border-cell-border' : 'border-4 border-board-border'}
        bg-transparent
      `}
            style={{
                color: config ? config.color : (value === 'X' ? '#3b82f6' : (value === 'O' ? '#ef4444' : 'currentColor')),
                filter: value ? 'drop-shadow(0 0 8px currentColor)' : 'none'
            }}
        >
            {config
                ? React.createElement(LucideIcons[config.icon], { size: level === 'sub' ? 24 : 56, strokeWidth: 3 })
                : <span className={`font-bold ${level === 'sub' ? 'text-2xl' : 'text-6xl'}`}>{value}</span>
            }
        </button>
    );
};

const Board = ({ cells, onCellClick, level = 'super', isSelectable = true, activeSubBoard = null, subBoardWinners = [], playersConfig = null }) => {
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
                        playersConfig={playersConfig}
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
