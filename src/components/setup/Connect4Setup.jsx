import { useState } from 'react';
import { Users } from 'lucide-react';
import SetupLayout from '../layout/SetupLayout';
import PlayerConfigRow from './PlayerConfigRow';
import SetupSelector from './SetupSelector';
import usePlayerSetup from '../../hooks/usePlayerSetup';

const Connect4Setup = ({ onComplete }) => {
    // Conecta 4 es estrictamente para 2 jugadores
    const numPlayers = 2;
    const { players, updatePlayer, getVisiblePlayers, getTakenResources } = usePlayerSetup(2, 2);

    const activePlayers = getVisiblePlayers(numPlayers);
    const { takenIcons, takenColors } = getTakenResources(activePlayers);

    const handleStart = () => {
        onComplete({
            players: activePlayers
        });
    };

    return (
        <SetupLayout
            gameTitle="Conecta 4"
            onBack={() => window.location.reload()}
            onStart={handleStart}
        >
            <div className="space-y-8 w-full max-w-4xl mx-auto">
                <div className="grid grid-cols-1 gap-4">
                    <SetupSelector
                        icon={Users}
                        title="Duelo de Estrategia"
                        options={[2]}
                        value={numPlayers}
                        onChange={() => { }} // No cambia, es siempre 2
                        className="opacity-80"
                    />
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
