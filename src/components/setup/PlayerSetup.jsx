import usePlayerSetup from '../../hooks/usePlayerSetup';
import SetupLayout from '../layout/SetupLayout';
import PlayerConfigRow from './PlayerConfigRow';

const PlayerSetup = ({ title = "Ta-Te-Ti", onComplete, initialPlayers = null }) => {
    const { players, updatePlayer, getVisiblePlayers, getTakenResources } = usePlayerSetup(2, 2, initialPlayers);

    const activePlayers = getVisiblePlayers(2);
    const { takenIcons, takenColors } = getTakenResources(activePlayers);

    const handleStart = () => {
        onComplete({ P1: activePlayers[0], P2: activePlayers[1] });
    };

    return (
        <SetupLayout
            gameTitle={title}
            onBack={() => window.location.reload()}
            onStart={handleStart}
        >
            <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
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
        </SetupLayout>
    );
};

export default PlayerSetup;
