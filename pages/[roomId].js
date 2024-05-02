// Import statements

import Player from "@/components/player";
import { useSocket } from "@/context/socket";
import useMediaStream from "@/hooks/useMediaStream";
import usePeer from "@/hooks/usePeer";
import usePlayer from "@/hooks/usePlayer";
import { useEffect } from "react";

const Room = () => {
    const socket = useSocket();
    const { peer, myId } = usePeer();
    const { stream } = useMediaStream();
    const { players, setPlayers } = usePlayer();

    useEffect(() => {
        if (!socket || !peer || !stream) {
            return;
        }

        const handleUserConnected = (newUser) => {
            console.log("User connected in room with userId " + newUser);

            const call = peer.call(newUser, stream);

            call.on("stream", (incomingStream) => {
                console.log("Incoming Stream from " + newUser);

                // Assuming url should be a URL pointing to the stream
                // If incomingStream is not a URL, you might need to modify this
                setPlayers((prev) => ({
                    ...prev,
                    [newUser]: {
                        url: incomingStream, // Assuming incomingStream is a URL
                        muted: true,
                        playing: true,
                    },
                }));
            });
        };

        socket.on("user-connected", handleUserConnected);

        return () => {
            socket.off("user-connected", handleUserConnected);
        };
    }, [socket, peer, stream, setPlayers]);

    useEffect(() => {
        if (!peer || !stream) {
            return;
        }

        peer.on("call", (call) => {
            const { peer: callerId } = call;
            call.answer(stream);

            call.on("stream", (incomingStream) => {
                console.log("Incoming Stream from " + callerId);

                // Update the state with the incoming stream URL
                setPlayers((prev) => ({
                    ...prev,
                    [callerId]: {
                        url: incomingStream, // Assuming incomingStream is a URL
                        muted: true,
                        playing: true,
                    },
                }));
            });
        });
    }, [peer, stream, setPlayers]);

    useEffect(() => {
        if (!stream || !myId) {
            return;
        }

        console.log(`Setting my stream ${myId}`);

        // Set the player state for the local stream
        setPlayers((prev) => ({
            ...prev,
            [myId]: {
                url: stream, // Assuming stream is a URL
                muted: true,
                playing: true,
            },
        }));
    }, [myId, setPlayers, stream]);

    console.log(players);

    return (
        <div>
            {/* Render the video streams */}
            {Object.keys(players).map((playerId) => {
                const { url, muted, playing } = players[playerId];

                return (
                    <Player
                        key={playerId}
                        url={url}
                        muted={muted}
                        playing={playing}
                    />
                );
            })}
        </div>
    );
};

export default Room;
