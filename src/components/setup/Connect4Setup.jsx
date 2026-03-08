import { useState } from 'react';
import SetupLayout from '../layout/SetupLayout';
import PlayerConfigRow from './PlayerConfigRow';
import SetupSelector from './SetupSelector';
import usePlayerSetup from '../../hooks/usePlayerSetup';
import useCompetitiveSetup from '../../hooks/useCompetitiveSetup';

const Connect4Setup = ({
    onComplete,
    onBack,
    initialPlayers = null,
    initialCompetitiveMode = false,
    initialTurnTime = 0
}) => {
    const { competitiveMode, turnTime, competitiveSelectorProps } = useCompetitiveSetup(initialCompetitiveMode, initialTurnTime);
    // Conecta 4 es estrictamente para 2 jugadores
    const numPlayers = 2;
    const { players, updatePlayer, getVisiblePlayers, getTakenResources } = usePlayerSetup(2, 2, initialPlayers);

    const activePlayers = getVisiblePlayers(numPlayers);
    const { takenIcons, takenColors } = getTakenResources(activePlayers);

    const handleStart = () => {
        onComplete({
            players: activePlayers,
            competitiveMode,
            turnTime: competitiveMode ? turnTime : 0
        });
    };

    return (
        <SetupLayout
            gameTitle="Conecta 4"
            onBack={onBack ?? (() => window.location.reload())}
            onStart={handleStart}
        >
            <div className="space-y-8 w-full max-w-4xl mx-auto pb-10">
                {/* Modo Competitivo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <SetupSelector {...competitiveSelectorProps} />
                    </div>
                </div>

                {/* Filas de Jugadores */}
                <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {activePlayers.map((player, idx) => (
                        <PlayerConfigRow
                            key={player.id}
                            index={idx}
                            player={player}
                            onUpdate={(updates) => updatePlayer(idx, updates)}
                            takenIcons={takenIcons}
                            takenColors={takenColors}
                        />
                    ))}
                </div>
            </div>
        </SetupLayout>
    );
};

export default Connect4Setup;
