import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

// a custom hook for getting the value of the socket.
export const useSocket = () => {
    const socket = useContext(SocketContext);
    return socket;
}

export const SocketProvider = (props) => {
    const { children } = props;
    const [socket, setSocket] = useState(null);

    // wheneve the component will mount, it will initialize the socket.
    useEffect(() => {
        const connection = io();
        setSocket(connection);
    }, []);

    socket?.on('connect_error', async (err) => {
        console.log("Error Establishing connection");
        await fetch('/api/socket');
    })

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}