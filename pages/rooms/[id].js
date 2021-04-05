import { DataStore, withSSRContext } from 'aws-amplify';
import { useContext, useEffect, useState } from 'react';
import { Room, Message, User } from '../../models';
import { UserContext } from '../../utils/UserContext';
import Link from 'next/link'
import Router from 'next/router';
import SetUsername from '../../components/SetUsername';
import { BiAlignLeft } from "react-icons/bi";

export default function RoomComponent({room}) {

  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [message, setMessage ] = useState('');
  const [messageSending, setMessageSending] = useState(false);
  const {username, setUsername} = useContext(UserContext);
  
  let userToDelete;

  const handleShowMenu = () => {
    setShowMenu(!showMenu);
  }

  const leaveRoom = async () => {
    await DataStore.save(
      new Message({
        "author": "server",
        "content": `${username} has left the room.`,
        "roomID": room.id,
        "timestamp": Date.now()
      })
    );   
    await DataStore.delete(userToDelete); 
  }
  const beforeLeaveRoom = async() => {
    await DataStore.delete(userToDelete); 
  }
  const joinRoom = async () => {
    await DataStore.save(
      new Message({
        "author": 'SERVER',
        "content": `${username} has joined the room.`,
        "roomID": room.id,
        "timestamp": Date.now()
      })
    );     
    const user = await DataStore.save(
      new User({
        "username": username,
        "roomID": room.id,
      })
    );   
    userToDelete = user;
  }

  const handleWindowClose = async (e) => {
    await leaveRoom();
    e.preventDefault();
    e.returnValue = false;
 }

 const handleBeforeWindowClose = async (e) => {
  await beforeLeaveRoom();
  e.preventDefault();
  e.returnValue = false;
}

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeWindowClose); 
    window.addEventListener("unload", handleWindowClose); 
    Router.events.on('routeChangeStart', leaveRoom);
    joinRoom();

    const fetchMessages = async () => {
      const messageData = await DataStore.query(Message, (m) => m.roomID('eq', room.id)); 
      setMessages(messageData);
    }

    const fetchUsers = async () => {
      const userData = await DataStore.query(User, (u) => u.roomID('eq', room.id)); 
      setUsers(userData);
    }

    fetchMessages();
    
    DataStore.observe(Message).subscribe(async msg => {
      fetchMessages();
      fetchUsers();
    })

    fetchUsers();

    const subscription = DataStore.observe(User).subscribe(async user => {
      fetchUsers();
    })

    setInterval(function(){ 
      fetchMessages();
      fetchUsers();
     }, 30000);

     return function cleanup() {
      subscription.unsubscribe();
     }
  }, [])

  const onChangeMessage = event => {
    setMessage(event.target.value);
  };

  const handleKeypress = e => {
    if (e.key === 'Enter') {
      handleSendMessage(e);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if(message !== '' && !messageSending) {
      setMessageSending(true);
      await DataStore.save(
        new Message({
          "content": message,
          "roomID": room.id,
          "author": username,
          "timestamp": Date.now()
        })
      ); 
    }
    setMessageSending(false);
    setMessage('');
  }

  return (
    <div className="flex h-screen">
      <div 
      className={`
        ${showMenu ? '-translate-x-0 transition delay-150 duration-300 ease-in-out' : 'transform -translate-x-full transition delay-150 duration-300 ease-in-out'}
           bg-white absolute p-10 h-full flex-col lg:flex lg:relative lg:translate-x-0
        `}
      >
        <div className="flex-shrink">
          <Link href="/"><a>Leave Room</a></Link>
          <SetUsername />
        </div>
        <div className="flex-auto flex flex-col">
          <h4 className="mt-10 mb-5 underline flex-shrink">Active Users ({users.length})</h4>
          <ul className="overflow-auto flex-auto h-80 lg:h-0">
            {
              users.map(user =>  (
                <li key={user.id}>
                  {user.username}
                </li>
              ))
            }
          </ul>
        </div>
      </div>
      
      <div class="p-10 h-full flex flex-col flex-grow">
        <ul class="overflow-auto flex-auto h-0 flex-row-reverse">
          {
            messages.map(message =>  (
              <li key={message.id} className="bg-gray-100 my-4 pt-4 px-6 border-b">
                <div>
                  <h6 className="text-main font-black"> 
                    {message.author !== null ? message.author : "Anom"} <span className="font-medium text-xs"> - {new Date(message.timestamp).toISOString().slice(0, 19).replace('T', ' ')}</span>
                  </h6>
                  <div className="p-4 my-2 bg-white">
                    {message.content}
                  </div>
                </div>
              </li>
            ))
          }
        </ul>
        <div className="flex-shrink flex">
          
          <BiAlignLeft className="z-10 bg-green-500 text-white h-14 w-24 px-4 py-2 cursor-pointer lg:hidden" role="button" label="toggle menu" onClick={handleShowMenu}/>
          <input 
            type="text" 
            type="text" 
            name="message" 
            value={message} 
            onChange={onChangeMessage}  
            onKeyPress={handleKeypress}
            className="h-14 mt-0"
          />
          <button type="submit" onClick={handleSendMessage} className="h-14">Send</button>
        </div>
      </div>
    </div>
  )
}

export async function getStaticPaths(req) {
  const { DataStore } = withSSRContext(req)
  const rooms = await DataStore.query(Room)
  const paths = rooms.map(room => ({params: {id: room.id}}))
  return {
    paths,
    fallback: true
  }
}

export async function getStaticProps (req) {
  const { DataStore } = withSSRContext(req)
  const { params } = req
  const { id } = params

  const room = await DataStore.query(Room, id)

  return {
    props: {
      room: JSON.parse(JSON.stringify(room)) 
    }
  }
}