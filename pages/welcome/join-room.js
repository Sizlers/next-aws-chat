import { useContext, useEffect, useState } from 'react';
import useForm from '../../utils/useForm';
import { UserContext } from '../../utils/UserContext';
import Router from 'next/router';
import { DataStore } from '@aws-amplify/datastore';
import { Room, User } from '../../models';
import Link from 'next/link';

export default function JoinRoom() {
  const {username, setUsername} = useContext(UserContext);
  const { values, updateValue } = useForm({
    roomId: ''
  });
  const [error, setError] = useState('');
  const [roomList, setRoomList] = useState([]);
  const handleJoinRoom = async (roomId) => {
    try {
      const room = await DataStore.query(Room, (r) => r.id('eq', roomId));
      Router.push(`/rooms/${roomId}`)
    } catch (err) {
      setError(`An error has occurred, please try again. ${err}`)
    }
  }
  const queryRooms = async (e) => {
    let rooms = [];
    const users = await DataStore.query(User);

    users.forEach((user) => {
      const loggedRoom = rooms.find(({roomId}) => roomId === user.roomID);
      if(loggedRoom) {
        loggedRoom.userCount++
      } else {
        rooms = [
          ...rooms, 
          {
            roomId: user.roomID,
            userCount: 1
          }
        ]
      }
    });
    setRoomList(rooms);
  }
  useEffect( () => {
    if(username === '') {
      Router.push('/')
    }

    queryRooms();
  }, [])

  return (
    <div>
      <h1 className="mt-20">Join a Room</h1>
      {error}

      <div className="max-w-screen-xl m-auto mb-20">
        <fieldset>
          <label htmlFor="RoomId">
            Room ID
            <input id="RoomId" type="text" name="roomId" value={values.roomId} onChange={updateValue} />
          </label>
          <button type="submit" onClick={() => handleJoinRoom(values.roomId)}>
            Enter ->
          </button>
        </fieldset>
      </div>
      { roomList.length > 0 &&
        <table className="w-full max-w-screen-xl m-auto">
          <thead>
            <tr>
              <th>Room ID</th>
              <th>User Count</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              roomList.map(room => (
                <tr key={room.roomId}>
                  <td>{room.roomId}</td>
                  <td>{room.userCount}</td>
                  <td><button onClick={() => handleJoinRoom(room.roomId)}>Join Room</button></td>
                </tr>
              ))
            }
          </tbody>
        </table>
      }
      <footer className="pb-20 pt-20 width w-full flex justify-center">
        <Link href="/welcome">
          <button>Back to start</button>
        </Link>
      </footer>
    </div>
  )
}