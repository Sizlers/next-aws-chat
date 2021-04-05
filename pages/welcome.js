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
      <main className="min-h-screen">
        <div className="pt-20">
          <h1 className="text-center">Hi, {username} <br />do you want to...</h1>
          {error}
        </div>

        <section className="
          grid
          grid-cols-1 grid-rows-2 min-h-full absolute top-0 w-full py-36
          lg:grid-cols-2 lg:grid-rows-1
          ">

          <div className="
          bg-gray-300 absolute inset-center 
            h-0.5  w-2/3
            lg:w-0.5 lg:h-1/3
          "></div>
          <div className="flex justify-center items-center col-span-1">
              <Link href="/welcome/join-room">
                <button className="btn-large btn-white">Join a room</button>
              </Link>
          </div>
          <div className="flex justify-center items-center col-span-1">
            <button className="btn-large" onClick={handleCreateRoom} >Create a room</button>
          </div>
        </section>
      </main>

      <footer className="absolute bottom-20 width w-full flex justify-center">
        <button onClick={handleBackToStart}>Back to start</button>
      </footer>
    </>
  )
}