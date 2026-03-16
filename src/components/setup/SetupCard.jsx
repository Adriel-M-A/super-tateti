import React from "react";

/**
 * Card base utilizada en las pantallas de configuración.
 * Garantiza padding, borde y fondo consistente entre los distintos bloques.
 */
const SetupCard = ({ className = "", style = {}, children }) => {
  return (
    <div
      className={`p-4 bg-cell-hover border border-board-border rounded-2xl md:rounded-3xl transition-all hover:border-page-text/10 ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default SetupCard;
