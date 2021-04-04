import { UserContext } from "../utils/UserContext";
import { useContext, useEffect } from 'react';
import SetUsername from '../components/SetUsername'
import Router from 'next/router';
import styles from '../styles/Home.module.scss';

export default function Home() {
  const {username, setUsername} = useContext(UserContext);

  useEffect( () => {
    if(username !== '') {
      Router.push('/welcome')
    }
  }, [username])

  return(
    <main className="lg:grid lg:grid-cols-2 lg:space-x-28 min-h-screen">
      <div class="flex items-center home-content-container">
        <div class="home-content md:mt-10">
          <h1>Next AWS App</h1>
        </div>
      </div>
      <div className="flex items-center md:mt-10">
        <div className="w-full">
          <SetUsername />
        </div>
       
      </div>
    </main>
  )
}