import { DataStore, withSSRContext } from 'aws-amplify';
import { useContext, useEffect, useState } from 'react';
import { Room, Message, User } from '../../models';
import { UserContext } from '../../utils/UserContext';
import Link from 'next/link'
import Router from 'next/router';
import SetUsername from '../../components/SetUsername';

export default function RoomComponent({room}) {

  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage ] = useState('');
  const [messageSending, setMessageSending] = useState(false);
  const {username, setUsername} = useContext(UserContext);
  
  let userToDelete;

  const leaveRoom = async () => {
    await DataStore.save(
      new Message({
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
    <div className="flex">
      <div className="p-10">
        <Link href="/"><a>Leave Room</a></Link>
        <SetUsername />
        <h4>Active Users ({users.length})</h4>
        <ul>
          {
            users.map(user =>  (
              <li key={user.id}>
                {user.username}
              </li>
            ))
          }
        </ul>
      </div>
          
      <div class="message-list">
        <ul>
          {
            messages.map(message =>  (
              <li key={message.id}>
                <div>
                  <h6> 
                    {message.author} - <span>{new Date(message.timestamp).toISOString().slice(0, 19).replace('T', ' ')}</span>
                  </h6>
                  <div>
                    {message.content}
                  </div>
                </div>
              </li>
            ))
          }
        </ul>
        <div>
          <input 
            type="text" 
            type="text" 
            name="message" 
            value={message} 
            onChange={onChangeMessage}  
            onKeyPress={handleKeypress}
          />
          <button type="submit" onClick={handleSendMessage}>Send</button>
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