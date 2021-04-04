import { DataStore } from "@aws-amplify/datastore";
import { Room } from '../models';
import Router from 'next/router'
import useForm from '../utils/useForm';
import { useContext, useState } from 'react';
import { UserContext } from "../utils/UserContext";

export default function JoinRoom() {
  const [errors, setErrors] = useState({
    invalidUsernameJoin: "",
    invalidRoomIdJoin: "",
    invalidUsernameCreate: ""
  }) 
  const { username, setUsername } = useContext(UserContext);
  const { values, updateValue } = useForm({
    roomId: '',
    usernameCreate: '',
    usernameJoin: ''
  });

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setErrors({});
    setUsername(values.usernameCreate);

    let validated = true;

    if(values.usernameCreate === '') {
      setErrors({
        ...errors,
        invalidUsernameCreate: "Please enter a username"
      })
      validated = false;
    }

    if(validated) {
      const createdRoom = await DataStore.save(
          new Room({
          "Messages": []
        })
      );
      Router.push(`/rooms/${createdRoom.id}`)
    }    
  }

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    setUsername(values.usernameJoin);
    setErrors({})

    let validated = true;
    const room = await DataStore.query(Room, (r) => r.id('eq', values.roomId));
   
    if(room.length !== 1) {
      setErrors({
        ...errors,
        invalidRoomIdJoin: "Room does not exist."
      })
      validated = false;
    }
    if(values.usernameJoin === '') {
      setErrors({
        ...errors,
        invalidUsernameJoin: "Please enter a username"
      })
      validated = false;
    }

    if(validated) {
      Router.push(`/rooms/${values.roomId}`)
    }
  }

  return (
    <main >
      <div>
        <form>
          <fieldset>
            <legend>Join Room</legend>
            <span>{errors.invalidRoomIdJoin}</span>
            <label htmlFor="RoomId">
              Room ID
              <input id="RoomId" type="text" name="roomId" value={values.roomId} onChange={updateValue} />
            </label>

            <span>{errors.invalidUsernameJoin}</span>
            <label htmlFor="username">
              Username
              <input type="text" id="usernameJoin" name="usernameJoin" value={values.usernameJoin} onChange={updateValue}/>
            </label>
            <button type="submit" onClick={handleJoinRoom}>
              Enter ->
            </button>
          </fieldset>
        </form>

        <form>
          <fieldset>
            <legend>Create Room</legend>
            {errors.invalidUsernameCreate}
            <label htmlFor="username">
              Username
              <input type="text" id="usernameCreate" name="usernameCreate" value={values.usernameCreate} onChange={updateValue}/>
            </label>
            <button type="submit" onClick={handleCreateRoom}>
              Create ->
            </button>
          </fieldset>
        </form>
      </div>
    </main>
  )
}
