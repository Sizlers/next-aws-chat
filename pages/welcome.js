import { useContext, useEffect, useState } from 'react';
import Router from 'next/router';
import { UserContext } from "../utils/UserContext";
import Link from 'next/link';
import { DataStore } from '@aws-amplify/datastore';
import { Room } from '../models';

export default function Welcome() {  
  const {username, setUsername} = useContext(UserContext);
  const [error, setError] = useState('');

  const handleBackToStart = () => {
    setUsername('');
    Router.push('/');
  }

  const handleCreateRoom = async (e) => {
    try {
      const room = await DataStore.save(
        new Room({
          "Messages": []
        })
      );
      Router.push(`/rooms/${room.id}`)  
    } catch(err) {
      setError(`An error has occurred, please try again. ${err}`)
    }
  }

  useEffect( () => {
    if(username === '') {
      Router.push('/')
    }
  }, [])

  return (
    <>
      <main className="grid grid-cols-2 min-h-screen split-screen">
        <div className="inset-center-x top-20">
          <h1>Hi, {username} <br />do you want to</h1>
          {error}
        </div>
        <Link href="/welcome/join-room">
          <div className="flex items-center justify-center blue-split">
            <button className="btn-large btn-white">Join a room</button>
          </div>
        </Link>

        <div onClick={handleCreateRoom} className="flex items-center justify-center">
          <button className="btn-large">Create a room</button>
        </div>
      </main>

      <footer className="absolute bottom-20 width w-full flex justify-center">
        <button onClick={handleBackToStart}>Back to start</button>
      </footer>

    </>
  )
}