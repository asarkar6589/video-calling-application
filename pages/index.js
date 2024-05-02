import { useRouter } from "next/router";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const router = useRouter();
  const [roomId, setRoomId] = useState('');

  const createAndJoin = () => {
    // creating roomId
    const roomId = uuidv4();
    router.push(`/${roomId}`);
  }

  const joinRoom = () => {
    if (roomId) {
      router.push(`/${roomId}`);
    }
    else {
      alert('Please Enter A Room Id');
    }
  }

  return (
    <div className="w-4/12 mx-auto p-2 border border-white rounded mt-8 text-white flex flex-col items-center">
      <h1 className="text-xl text-center">Google Meet Clone</h1>

      <div className="flex flex-col items-center mt-3 w-full">
        <input placeholder="Enter Room Id" value={roomId} onChange={e => setRoomId(e.target.value)} className="text-black text-lg p-1 rounded w-9/12 mb-3" />
        <button onClick={joinRoom} className="py-2 px-4 rounded bg-red-800 ">Join Room</button>
      </div>

      <span className="my-3 text-xl">------------------ Or ------------------</span>

      <button onClick={createAndJoin} className=" py-2 px-4 rounded bg-red-800">Create a new Room</button>
    </div>
  );
}
