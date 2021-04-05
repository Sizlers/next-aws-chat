import { useContext, useEffect, useState } from 'react';
import useForm from '../../utils/useForm';
import { UserContext } from '../../utils/UserContext';
import Router from 'next/router';
import { DataStore } from '@aws-amplify/datastore';
import { Room, User } from '../../models';
import Link from 'next/link';
import Loading from '../../components/Loading';

export default function JoinRoom() {
  const {username, setUsername} = useContext(UserContext);
  const { values, updateValue } = useForm({
    roomId: ''
  });
  const [error, setError] = useState('');
  const [roomList, setRoomList] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleJoinRoom = async (roomId) => {
    try {
      setLoading(true);
      const room = await DataStore.query(Room, (r) => r.id('eq', roomId));
      if(room.length === 0) {
        setLoading(false);
        setError('Room not found, please enter another room id, or create a room.');
      } else {
        Router.push(`/rooms/${roomId}`)
      }
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
    <>
      {loading && <Loading />}
      <div className="mb-10 px-5 xl:px-0 max-w-screen-xl m-auto lg:mb-20">
        <h1 className="mt-12 mb-6 lg:mt-20 lg:mb-10">Join a Room</h1>
        <fieldset>
          <div className="lg:flex items-end">
            <label htmlFor="RoomId" className="w-full">
              Room ID
              <span class="error block">{error}</span>
              <input id="RoomId" type="text" name="roomId" className="lg:h-20" value={values.roomId} onChange={updateValue} />
            </label>
            <button type="submit" className="w-full mt-2 lg:mt-0 lg:w-40 lg:h-20" onClick={() => handleJoinRoom(values.roomId)}>
              Join Room
            </button>
          </div>

        </fieldset>
      </div>
      <div className="px-5">
        { roomList.length > 0 &&
          <table className="max-w-screen-xl mx-auto text-left w-full">
            <thead className="flex w-full">
              <tr className="flex w-full">
                <th className="p-4 w-2/3 lg:3/5">Room ID</th>
                <th className="hidden md:block p-4 w-1/3 lg:1/5">User Count</th>
                <th className="p-4 w-1/3 lg:1/5"></th>
              </tr>
            </thead>
            <tbody className="flex flex-col items-center justify-between overflow-y-scroll w-full h-56 md:h-96 lg:h-80">
              {
                roomList.map(room => (
                  <tr key={room.roomId} className="flex w-full">
                    <td className="p-2 lg:p-4 w-2/3 lg:w-3/5">{room.roomId}</td>
                    <td className="hidden md:block lg:flex p-4 w-1/3 lg:1/5">{room.userCount}</td>
                    <td className="bg-main lg:p-4 w-1/3 lg:1/5 justify-center border-t hover:bg-main-900" onClick={() => handleJoinRoom(room.roomId)} role="button">
                      <span className="text-white font-bold">Join Room</span>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        }
      </div>

      <footer className="absolute bottom-10 lg:bottom-20 width w-full flex justify-center">
        <Link href="/welcome">
          <button>Back</button>
        </Link>
      </footer>
    </>
  )
}