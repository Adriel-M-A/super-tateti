import { useState, useMemo } from 'react';
import IconRenderer from './IconRenderer';
import { useGame } from '../../contexts/GameContext';

const DotsAndBoxesBoard = ({ size, lines, boxes, currentPlayer: propsCurrentPlayer, onMove, players: propsPlayers }) => {
    const { players: contextPlayers, currentPlayerIndex } = useGame();
    const players = propsPlayers || contextPlayers;
    const currentPlayer = propsCurrentPlayer || players[currentPlayerIndex];
    const [selectedDot, setSelectedDot] = useState(null); // { r, c }

    const numDots = size + 1;

    // Auxiliar para obtener vecinos a los que se puede conectar
    const getValidNeighbors = (r, c) => {
        const neighbors = [];
        // Arriba (línea vertical r-1, c)
        if (r > 0 && lines.v[r - 1][c] === null) neighbors.push({ r: r - 1, c });
        // Abajo (línea vertical r, c)
        if (r < size && lines.v[r][c] === null) neighbors.push({ r: r + 1, c });
        // Izquierda (línea horizontal r, c-1)
        if (c > 0 && lines.h[r][c - 1] === null) neighbors.push({ r: r, c: c - 1 });
        // Derecha (línea horizontal r, c)
        if (c < size && lines.h[r][c] === null) neighbors.push({ r: r, c: c + 1 });
        return neighbors;
    };

    const isSaturated = (r, c) => getValidNeighbors(r, c).length === 0;

    // Tamaño de la caja para el grid
    const boxSizeClass = useMemo(() => {
        if (size <= 5) return 'w-16 h-16 md:w-20 md:h-20';
        if (size <= 7) return 'w-12 h-12 md:w-14 md:h-14';
        return 'w-10 h-10 md:w-12 md:h-12';
    }, [size]);

    const handleDotClick = (r, c) => {
        // No permitir seleccionar un punto saturado como origen
        if (!selectedDot && isSaturated(r, c)) return;

        if (!selectedDot) {
            setSelectedDot({ r, c });
            return;
        }

        if (selectedDot.r === r && selectedDot.c === c) {
            setSelectedDot(null);
            return;
        }

        const dr = Math.abs(selectedDot.r - r);
        const dc = Math.abs(selectedDot.c - c);

        if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1)) {
            let type, row, col;
            if (dr === 0) { // Horizontal
                type = 'h';
                row = r;
                col = Math.min(selectedDot.c, c);
            } else { // Vertical
                type = 'v';
                row = Math.min(selectedDot.r, r);
                col = c;
            }

            const moved = onMove(type, row, col);
            if (moved) {
                setSelectedDot(null);
            } else {
                // Si la línea estaba ocupada, cambiamos origen solo si el nuevo punto no está saturado
                if (!isSaturated(r, c)) setSelectedDot({ r, c });
            }
        } else {
            // Si no son adyacentes, cambiamos el origen solo si el nuevo punto no está saturado
            if (!isSaturated(r, c)) setSelectedDot({ r, c });
        }
    };

    return (
        <div className="relative inline-block p-8 select-none">
            <div className="relative">
                {/* 1. Grid de Cajas (Base Estructural) */}
                <div
                    className="grid"
                    style={{
                        gridTemplateColumns: `repeat(${size}, 1fr)`,
                    }}
                >
                    {boxes.map((row, r) =>
                        row.map((boxOwnerIndex, c) => (
                            <div
                                key={`box-${r}-${c}`}
                                className={`${boxSizeClass} flex items-center justify-center transition-all duration-700 relative`}
                                style={{
                                    backgroundColor: boxOwnerIndex !== null ? `${players[boxOwnerIndex].color}15` : 'transparent'
                                }}
                            >
                                {boxOwnerIndex !== null && (
                                    <div className="animate-in zoom-in duration-500" style={{ color: players[boxOwnerIndex].color }}>
                                        <IconRenderer
                                            iconName={players[boxOwnerIndex].icon}
                                            size={size > 7 ? 20 : 32}
                                            strokeWidth={3}
                                        />
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* 2. Capa de Líneas (Absolutas) */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Líneas Horizontales */}
                    {lines.h.map((row, r) =>
                        row.map((owner, c) => owner !== null && (
                            <div
                                key={`line-h-${r}-${c}`}
                                className="absolute h-1.5 rounded-full transition-colors duration-300"
                                style={{
                                    width: `${100 / size}%`,
                                    top: `${(r / size) * 100}%`,
                                    left: `${(c / size) * 100}%`,
                                    backgroundColor: players[owner]?.color || 'var(--page-text)',
                                    opacity: 0.8,
                                    transform: 'translateY(-50%)'
                                }}
                            />
                        ))
                    )}
                    {/* Líneas Verticales */}
                    {lines.v.map((row, r) =>
                        row.map((owner, c) => owner !== null && (
                            <div
                                key={`line-v-${r}-${c}`}
                                className="absolute w-1.5 rounded-full transition-colors duration-300"
                                style={{
                                    height: `${100 / size}%`,
                                    top: `${(r / size) * 100}%`,
                                    left: `${(c / size) * 100}%`,
                                    backgroundColor: players[owner]?.color || 'var(--page-text)',
                                    opacity: 0.8,
                                    transform: 'translateX(-50%)'
                                }}
                            />
                        ))
                    )}
                </div>

                {/* 3. Capa de Puntos (Botones en intersecciones) */}
                {Array.from({ length: numDots }).map((_, r) =>
                    Array.from({ length: numDots }).map((_, c) => {
                        const isSelected = selectedDot?.r === r && selectedDot?.c === c;

                        // Determinar si este punto es un vecino válido del seleccionado (está al lado y no hay línea)
                        const isValidNeighbor = selectedDot && (
                            (Math.abs(selectedDot.r - r) === 1 && selectedDot.c === c && (r > selectedDot.r ? lines.v[selectedDot.r][c] === null : lines.v[r][c] === null)) ||
                            (Math.abs(selectedDot.c - c) === 1 && selectedDot.r === r && (c > selectedDot.c ? lines.h[r][selectedDot.c] === null : lines.h[r][c] === null))
                        );

                        const saturated = isSaturated(r, c);

                        return (
                            <button
                                key={`dot-${r}-${c}`}
                                disabled={!selectedDot && saturated}
                                onClick={() => handleDotClick(r, c)}
                                className={`
                                    absolute rounded-full transition-all duration-300 z-30
                                    ${isSelected
                                        ? 'w-4 h-4 scale-125 shadow-[0_0_20px_currentColor]'
                                        : (isValidNeighbor
                                            ? 'w-3.5 h-3.5 opacity-100 scale-110 shadow-[0_0_12px_currentColor]'
                                            : 'w-2.5 h-2.5 opacity-40 hover:opacity-100'
                                        )
                                    }
                                    ${saturated && !selectedDot ? 'opacity-5 cursor-not-allowed scale-75' : 'cursor-pointer'}
                                `}
                                style={{
                                    top: `${(r / size) * 100}%`,
                                    left: `${(c / size) * 100}%`,
                                    backgroundColor: (isSelected || isValidNeighbor) ? currentPlayer.color : 'var(--page-text)',
                                    color: currentPlayer.color,
                                    transform: 'translate(-50%, -50%)',
                                }}
                            />
                        );
                    })
                )}
            </div>

            <p className="mt-12 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 text-center opacity-50">
                {selectedDot ? 'Selecciona un vecino resaltado' : 'Selecciona un punto para conectar'}
            </p>
        </div>
    );
};

export default DotsAndBoxesBoard;
