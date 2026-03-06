import React from 'react';

/**
 * Componente genérico para selectores en las pantallas de configuración.
 * Soporta selección de botones únicos o una cuadrícula de opciones.
 */
const SetupSelector = ({
    icon: Icon,
    title,
    options = [],
    value,
    onChange,
    type = 'buttons', // 'buttons' | 'range'
    min = 0,
    max = 10,
    className = "",
    iconContainerClassName = ""
}) => {
    return (
        <div className={`p-4 bg-cell-hover border border-board-border rounded-2xl md:rounded-3xl transition-all hover:border-page-text/10 ${className}`}>
            <div className="flex items-center gap-2 mb-4">
                {Icon && (
                    <div className={iconContainerClassName}>
                        <Icon className="text-blue-500" size={16} />
                    </div>
                )}
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{title}</h3>
            </div>

            {type === 'buttons' ? (
                <div className="flex gap-1.5">
                    {options.map((option) => {
                        const isSelected = value === option;
                        return (
                            <button
                                key={option}
                                onClick={() => onChange(option)}
                                className={`flex-1 py-2.5 rounded-xl font-black text-sm transition-all ${isSelected
                                    ? 'bg-page-text text-page-bg scale-105 shadow-lg z-10'
                                    : 'bg-page-text/5 hover:bg-page-text/10 text-slate-500'
                                    }`}
                            >
                                {option}
                            </button>
                        );
                    })}
                </div>
            ) : (
                <div className="flex items-center gap-4">
                    <input
                        type="range"
                        min={min}
                        max={max}
                        value={value}
                        onChange={(e) => onChange(parseInt(e.target.value))}
                        className="flex-1 accent-page-text h-1.5 bg-page-text/10 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-xl font-black w-8 text-center text-page-text">
                        {value}
                    </span>
                </div>
            )}
        </div>
    );
};

export default SetupSelector;
