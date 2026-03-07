import IconRenderer from './IconRenderer';

// Porcentaje del área de celda que ocupa cada tamaño de pieza
const PIECE_PCT = { 1: 30, 2: 48, 3: 66, 4: 84 };

// Tamaño del ícono dentro de la pieza (proporcional)
const ICON_SIZE_MAP = { 1: 8, 2: 12, 3: 18, 4: 26 };

/**
 * Círculo-pieza con estética consistente con los demás juegos:
 * borde coloreado, fondo semitransparente, ícono del jugador y reflejo diagonal.
 */
const Piece = ({ size, player, selected = false, small = false }) => {
    if (!player) return null;
    const pct = PIECE_PCT[size] ?? 50;
    const iconSize = ICON_SIZE_MAP[size] ?? 14;

    return (
        <div
            style={{
                width: `${pct}%`,
                height: `${pct}%`,
                borderColor: player.color,
                backgroundColor: `${player.color}20`,
                boxShadow: selected
                    ? `0 0 0 2px white, 0 0 16px ${player.color}99`
                    : `0 2px 8px ${player.color}40`,
            }}
            className={`
                rounded-full border-2 flex items-center justify-center relative
                overflow-hidden transition-all duration-300 pointer-events-none
                ${selected ? 'scale-105' : ''}
            `}
        >
            {/* Ícono del jugador */}
            <div style={{ color: player.color }} className="relative z-10">
                <IconRenderer iconName={player.icon} size={iconSize} strokeWidth={2.5} />
            </div>

            {/* Reflejo premium diagonal */}
            <div className="absolute inset-0 bg-linear-to-br from-white/25 to-transparent pointer-events-none" />
        </div>
    );
};

const GobbletBoard = ({ board, boardSize, selected, players, currentPlayerIndex, onCellClick, isValidTarget }) => {
    const playerMap = {};
    players.forEach(p => { playerMap[p.id] = p; });
    const currentPlayerId = players[currentPlayerIndex]?.id;

    return (
        <div
            className="grid gap-2 p-3 bg-transparent w-full"
            style={{ gridTemplateColumns: `repeat(${boardSize}, 1fr)`, maxWidth: `${boardSize * 96 + 32}px` }}
        >
            {board.map((row, r) =>
                row.map((stack, c) => {
                    const topPiece = stack.length > 0 ? stack[stack.length - 1] : null;
                    const depth = stack.length;
                    const valid = isValidTarget(r, c);
                    const isBoardSelected = selected?.source === 'board' && selected.r === r && selected.c === c;
                    const isEmpty = !topPiece;

                    return (
                        <div
                            key={`${r}-${c}`}
                            onClick={() => onCellClick(r, c)}
                            className={`
                                aspect-square flex items-center justify-center relative
                                rounded-2xl border-2 transition-all duration-200 cursor-pointer
                                ${isEmpty
                                    ? 'bg-slate-200/10 dark:bg-slate-800/20 border-slate-300/20 dark:border-slate-700/20'
                                    : 'border-transparent'
                                }
                                ${valid ? 'ring-2 ring-blue-400/60 bg-blue-500/10 hover:bg-blue-500/20' : 'hover:bg-page-text/5'}
                                ${isBoardSelected ? 'ring-2 ring-white/60 bg-page-text/10' : ''}
                            `}
                        >
                            {topPiece && (
                                <div className="w-full h-full flex items-center justify-center animate-in zoom-in duration-300">
                                    <Piece
                                        size={topPiece.size}
                                        player={playerMap[topPiece.playerId]}
                                        selected={isBoardSelected}
                                    />
                                </div>
                            )}

                            {/* Indicador de profundidad de pila */}
                            {depth > 1 && (
                                <div className="absolute bottom-1 right-1.5 text-[8px] font-black text-page-text/30 leading-none">
                                    {depth}
                                </div>
                            )}

                            {/* Hint de destino válido cuando está vacía */}
                            {valid && isEmpty && (
                                <div
                                    className="w-6 h-6 rounded-full border-2 border-dashed border-blue-400/50 animate-pulse"
                                />
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
};

export { Piece };
export default GobbletBoard;
