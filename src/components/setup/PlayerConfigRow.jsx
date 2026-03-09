import React from 'react';
import IconRenderer from '../game/IconRenderer';
import { ICON_OPTIONS, COLOR_OPTIONS } from '../../constants/playerConfig';

const PlayerConfigRow = ({
    index,
    player,
    onUpdate,
    takenIcons = [],
    takenColors = []
}) => {
    return (
        <div className="w-full flex flex-col md:flex-row items-center gap-4 md:gap-8 p-4 md:p-6 bg-cell-hover border border-board-border rounded-2xl md:rounded-3xl hover:bg-page-text/5 transition-all group animate-in slide-in-from-right duration-300" style={{ animationDelay: `${index * 50}ms` }}>

            {/* Cabecera del Jugador (Icono actual + Nombre editable) */}
            <div className="flex items-center gap-3 w-full md:w-44 shrink-0">
                <div
                    className="w-10 h-10 flex items-center justify-center shrink-0 transition-all"
                    style={{ color: player.color }}
                >
                    <IconRenderer iconName={player.icon} size={36} strokeWidth={3} />
                </div>
                <input
                    value={player.name}
                    onChange={e => onUpdate({ name: e.target.value })}
                    placeholder={`Jugador ${index + 1}`}
                    maxLength={16}
                    className="font-black uppercase italic tracking-tighter text-sm md:text-base bg-transparent border-b border-transparent focus:border-current outline-none w-full text-left transition-colors duration-200 cursor-text min-w-0"
                    style={{ color: player.color }}
                />
            </div>

            {/* Separador vertical (solo desktop) */}
            <div className="hidden md:block w-px h-12 bg-board-border shrink-0"></div>

            {/* Selector de Iconos */}
            <div className="flex-1 flex flex-col items-center md:items-start gap-2 w-full">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 italic opacity-50">Símbolo</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    {ICON_OPTIONS.map(({ id }) => {
                        const isSelected = player.icon === id;
                        const isTaken = takenIcons.includes(id) && !isSelected;
                        return (
                            <button
                                key={id}
                                disabled={isTaken}
                                onClick={() => onUpdate({ icon: id })}
                                className={`
                                    p-2 rounded-lg transition-all
                                    ${isSelected ? 'bg-page-text/10 ring-2 ring-page-text/20 scale-110 shadow-md' : 'opacity-30 hover:opacity-100 grayscale-[0.8] hover:grayscale-0'}
                                    ${isTaken ? 'opacity-10 grayscale cursor-not-allowed scale-90' : 'cursor-pointer'}
                                `}
                            >
                                <IconRenderer iconName={id} size={20} color={isSelected ? player.color : 'currentColor'} strokeWidth={3} />
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Selector de Colores */}
            <div className="flex-1 flex flex-col items-center md:items-start gap-2 w-full">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 italic opacity-50">Color</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    {COLOR_OPTIONS.map(({ id, hex, bg }) => {
                        const isSelected = player.color === hex;
                        const isTaken = takenColors.includes(hex) && !isSelected;
                        return (
                            <button
                                key={id}
                                disabled={isTaken}
                                onClick={() => onUpdate({ color: hex })}
                                className={`
                                    w-7 h-7 rounded-full transition-all border-4 border-transparent
                                    ${bg}
                                    ${isSelected ? 'scale-125 ring-2 ring-page-text shadow-xl' : 'opacity-40 hover:opacity-100 hover:scale-110'}
                                    ${isTaken ? 'opacity-10 scale-90 cursor-not-allowed grayscale' : 'cursor-pointer'}
                                `}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PlayerConfigRow;
// Re-exportar constantes para compatibilidad con imports existentes
export { ICON_OPTIONS, COLOR_OPTIONS };
