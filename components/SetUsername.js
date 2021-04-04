import { useContext, useState } from 'react';
import { UserContext } from "../utils/UserContext";
import useForm from '../utils/useForm';

export default function SetUsername() {
  const {username, setUsername} = useContext(UserContext);
  const { values, updateValue } = useForm({
    username: ''
  });
  const [error, setError] = useState('');

  const handleSetUsername = () => {
    if(values.username !== '') {
      setUsername(values.username)
    } else {
      setError('Please enter a username.')
      console.log('test')
    }
  }
  return (
    <>
      {
        error && <span className="error">{error}</span>
      }
      <fieldset>
        <label htmlFor="username"  className="block">
          Username
          <input 
            type="text" 
            id="username" 
            name="username" 
            placeholder="notacat108" 
            value={values.usernameCreate} 
            onChange={updateValue} 
            className="w-full"
          />
        </label>
        <button onClick={handleSetUsername}
          className="mt-5"
        >Confirm</button>
      </fieldset>
    </>
  )
}