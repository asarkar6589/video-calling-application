import { useSocket } from "@/context/socket";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
/*

const { useState, useEffect } = require("react"); 

if we use it here, then out app will crash because every thing is rendered on the server, and in server we dont have a navigator, so we have to do the import under useEffect()

*/

const usePeer = () => {
    const [peer, setPeer] = useState(null);
    // when we connect to the peer server, we will receive a unique id, which we have to keep a track of.
    const [myId, setMyId] = useState('');

    const isPeerSet = useRef(false);

    const socket = useSocket();

    const roomId = useRouter().query.roomId;

    useEffect(() => {
        if (isPeerSet.current || !roomId || !socket) {
            return;
        }
        isPeerSet.current = true;
        // immediately invoked function
        (async function initPeer() {
            const myPeer = new (await import('peerjs')).default()
            setPeer(myPeer);

            // how to get the id:
            myPeer.on('open', (id) => {
                console.log("Your peer id is " + id);
                setMyId(id);
                socket?.emit('join-room', roomId, id);
            })
        })()
    }, [roomId, socket]);

    return {
        peer,
        myId
    }
}

export default usePeer;

/*

So, this peerjs is another different server, we have to start this server separately by writing the command : peerjs --port 3001

*/