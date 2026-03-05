import { useState } from 'react';
import SetupLayout from '../layout/SetupLayout';
import PlayerConfigRow, { COLOR_OPTIONS, ICON_OPTIONS } from './PlayerConfigRow';

const PlayerSetup = ({ title = "Ta-Te-Ti", onComplete }) => {
    const [players, setPlayers] = useState([
        { id: 'P1', name: 'Jugador 1', icon: ICON_OPTIONS[0].id, color: COLOR_OPTIONS[0].hex },
        { id: 'P2', name: 'Jugador 2', icon: ICON_OPTIONS[1].id, color: COLOR_OPTIONS[1].hex }
    ]);

    const updatePlayer = (index, updates) => {
        const newPlayers = [...players];
        newPlayers[index] = { ...newPlayers[index], ...updates };
        setPlayers(newPlayers);
    };

    const handleStart = () => {
        onComplete({ P1: players[0], P2: players[1] });
    };

    const takenIcons = players.map(p => p.icon);
    const takenColors = players.map(p => p.color);

    return (
        <SetupLayout
            gameTitle={title}
            onBack={() => window.location.reload()}
            onStart={handleStart}
        >
            <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
                {players.map((player, idx) => (
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
        </SetupLayout>
    );
};

export default PlayerSetup;
