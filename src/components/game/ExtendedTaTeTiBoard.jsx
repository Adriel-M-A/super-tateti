import React, { useMemo } from 'react';
import IconRenderer from './IconRenderer';
import { useGame } from '../../contexts/GameContext';

const ExtendedTaTeTiBoard = ({ rows, cols, board, completedLines, players: propsPlayers, onCellClick }) => {
    const { players: contextPlayers, currentPlayerIndex } = useGame();
    const players = propsPlayers || contextPlayers;
    // Calcular tamaño de celda adaptable
    const cellSize = useMemo(() => {
        const maxDim = Math.max(rows, cols);
        if (maxDim <= 7) return 'w-14 h-14 md:w-16 md:h-16';
        if (maxDim <= 10) return 'w-10 h-10 md:w-12 md:h-12';
        return 'w-8 h-8 md:w-10 md:h-10';
    }, [rows, cols]);

    const fontSize = useMemo(() => {
        const maxDim = Math.max(rows, cols);
        if (maxDim <= 7) return 'text-3xl';
        if (maxDim <= 10) return 'text-xl';
        return 'text-lg';
    }, [rows, cols]);

    return (
        <div className="relative p-2 md:p-4 overflow-hidden">
            <div className="relative">
                {/* Capa de Líneas (SVG) */}
                <svg
                    className="absolute inset-0 pointer-events-none z-20"
                    viewBox={`0 0 ${cols} ${rows}`}
                    preserveAspectRatio="none"
                    style={{ width: '100%', height: '100%' }}
                >
                    {completedLines.map((line, idx) => {
                        const startX = line.start.c + 0.5;
                        const startY = line.start.r + 0.5;
                        const endX = line.end.c + 0.5;
                        const endY = line.end.r + 0.5;
                        const player = players.find(p => p.id === line.playerId);

                        return (
                            <line
                                key={`line-${idx}`}
                                x1={startX} y1={startY}
                                x2={endX} y2={endY}
                                stroke={player?.color || 'currentColor'}
                                strokeWidth="0.14"
                                strokeLinecap="round"
                                className="animate-in fade-in zoom-in duration-700"
                                style={{
                                    opacity: 0.85,
                                    filter: 'drop-shadow(0 0 1px rgba(0,0,0,0.5))'
                                }}
                            />
                        );
                    })}
                </svg>

                {/* Rejilla de Celdas */}
                <div
                    className="grid relative z-10"
                    style={{
                        gridTemplateColumns: `repeat(${cols}, 1fr)`,
                        gridTemplateRows: `repeat(${rows}, 1fr)`
                    }}
                >
                    {board.map((row, r) => (
                        row.map((cell, c) => {
                            const player = cell ? players.find(p => p.id === cell) : null;
                            const isLastRow = r === rows - 1;
                            const isLastCol = c === cols - 1;

                            return (
                                <button
                                    key={`${r}-${c}`}
                                    onClick={() => onCellClick(r, c)}
                                    disabled={!!cell}
                                    className={`
                                        ${cellSize} flex items-center justify-center transition-all duration-300
                                        ${!isLastRow ? 'border-b-2 border-board-border' : ''}
                                        ${!isLastCol ? 'border-r-2 border-board-border' : ''}
                                        ${!cell ? 'hover:bg-cell-hover cursor-pointer' : 'cursor-default'}
                                    `}
                                >
                                    {player && (
                                        <div
                                            className={`animate-in zoom-in duration-300 ${fontSize}`}
                                            style={{
                                                color: player.color,
                                                filter: players[currentPlayerIndex]?.id === player.id
                                                    ? `drop-shadow(0 0 8px ${player.color}) brightness(1.15)`
                                                    : 'none',
                                                opacity: players[currentPlayerIndex]?.id === player.id ? 1 : 0.55,
                                                transition: 'filter 0.3s, opacity 0.3s'
                                            }}
                                        >
                                            <IconRenderer
                                                iconName={player.icon}
                                                size={Math.max(rows, cols) > 10 ? 20 : 32}
                                                strokeWidth={3}
                                            />
                                        </div>
                                    )}
                                </button>
                            );
                        })
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ExtendedTaTeTiBoard;
