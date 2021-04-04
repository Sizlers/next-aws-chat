import { useContext, useState } from 'react';
import { UserContext } from "../utils/UserContext";
import useForm from '../utils/useForm';

export default function SetUsername() {
  const {username, setUsername} = useContext(UserContext);
  const { values, updateValue } = useForm({
    username: ''
  });

  const handleSetUsername = () => {
    setUsername(values.username)
  }
  return (
    <fieldset>
      <label htmlFor="username" >
        Username
        <input type="text" id="username" name="username" placeholder="notacat108" value={values.usernameCreate} onChange={updateValue} />
      </label>
      <button onClick={handleSetUsername}>Confirm</button>
    </fieldset>
  )
}