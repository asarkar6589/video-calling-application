import { useEffect, useRef, useState } from 'react';

const useMediaStream = () => {
    const [state, setState] = useState(null);
    const isStreamSet = useRef(false);

    useEffect(() => {
        if (isStreamSet.current) {
            return;
        }
        isStreamSet.current = true;
        try {
            (async function initStream() {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: true,
                })
                console.log("Setting Your Stream");
                setState(stream);
            })()
        } catch (error) {
            console.log("Error in media navigator" + error);
        }
    }, []);

    return {
        stream: state
    }
}

export default useMediaStream;