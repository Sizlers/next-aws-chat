import 'tailwindcss/tailwind.css'
import '../styles/globals.scss'
import Amplify from 'aws-amplify'
import config from '../aws-exports'
import { UserContext } from "../utils/UserContext";
import { useState, useMemo } from 'react';

Amplify.configure({...config, ssr: true})

function MyApp({ Component, pageProps }) {
  const [username, setUsername] = useState('');

const providerValue = useMemo(() => ({username, setUsername}), [username, setUsername]);

  return (
    <UserContext.Provider value={{username, setUsername}}>
      <Component {...pageProps} />
    </UserContext.Provider>
  )
}
export default MyApp
