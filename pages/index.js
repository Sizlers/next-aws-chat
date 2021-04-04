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
    <main className="
    theme-background min-h-screen grid
    grid-flow-row grid-rows-2 grid-cols-1
    lg:grid-cols-2 lg:grid-rows-1
    xl:grid-cols-5">
      <div className="
        flex items-center
        lg:col-span-1
        xl:col-span-3">
        <div className="
        hidden text-white lg:block px-10
        xl:px-24
        ">
          <h2 className="
          mb-4
          xl:mb-8">About this project</h2>
          <p>A simple chat app, which allows users to join and create rooms without the friction of a user sign-in, built utilising NextJS, AWS Amplify and Tailwinds.</p>
          <p>I built this app to trial AWS amplify with NextJS to see what challenges I would run into while exploring these technologies. In the future, I would expand upon this project by using these technologies for a more complex application. Using NextJS for this use case is a little unnecessary, due to the additional complexity of being run inside a lambda, or hosted independently on Vercel, instead of placed inside of an S3 bucket if I used just client side technologies.</p>
          <p>In this project, I use a mixture of tailwinds and SCSS, as I decided it would be a great opportunity to try out tailwinds at the same time!</p>
          <p>Please find the code here: *insert github link*</p>
          <p>Feedback is greatly appreciated :) </p>
        </div>
      </div>
      <div 
      className="bg-white flex items-center cols-1
      lg:col-span-1 lg:min-h-screen
      xl:col-span-2
      ">
        <div className="w-full px-10">
          <h1 className="
          mb-3
          lg:mb-4
          xl:mb-6">Next Chat App</h1>
          <SetUsername />
        </div>
       
      </div>
    </main>
  )
}