import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import {MessageCircleMore} from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'

const Sidebar = () => {

   const {getUsers, users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages} = useContext(ChatContext)
   const [input, setInput] = useState(false)

    const {logout, onlineUsers} = useContext(AuthContext)
    const navigate = useNavigate()

    const filteredUser = input ? users.filter((user) =>user.fullName.toLowerCase().includes(input.toLowerCase())) : users;

    useEffect(()=>{
        getUsers();
    },[onlineUsers])

  return (
    <div className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-x-hidden overflow-y-auto text-white ${selectedUser ? "max-md:hidden" : ""}`}>
    <div className='pb-5'>
        <div className='flex justify-between items-center'>

          <div className='flex gap-1.5'>
          <div className='size-9 gap-0.5 rounded-full rounded-bl-none bg-[#16395d] flex items-center justify-center'>
            <MessageCircleMore className='w-5 h-5' />
          </div>
            <h1 className='mt-1 font-semibold text-xl'>Howdy</h1>
          </div>
          
          <div className='relative py-2 group'>
            <img src={assets.menu_icon} alt="menu" className='max-h-5 cursor-pointer' />
            <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#0a2138] border border-gray-600 text-gray-100 hidden group-hover:block'>
                <p onClick={() => navigate('/profile')} className='cursor-pointer text-sm'>Edit Profile</p>
                <hr className='my-2 border-t border-gray-500' />
                <p onClick={() => logout()} className='cursor-pointer text-sm'>Logout</p>
            </div>
          </div>
        </div>

       <div className='bg-[#0a2138] rounded-full flex items-center gap-2 py-3 px-4 mt-5'>
         <img src={assets.search_icon} alt="Search" className='w-3' />
         <input onChange={(e)=>setInput(e.target.value)} type="text" className='bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1' placeholder='Search User...' />
       </div>

    </div>

    <div className='flex flex-col'>
     {filteredUser.map((user, index) => (
      <div onClick={e => {setSelectedUser(user); setUnseenMessages(prev=>({...prev, [user._id]:0}))}}
      key={index}
      className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id === user._id && 'bg-[#0a2138]/50'}`}>
        <img src={user?.profilePic || assets.avatar_icon} alt="Avatar" className='w-[35px] aspect-[1/1] rounded-full' />
        <div className='flex flex-col leading-5'>
          <p>{user.fullName}</p>
          {
            onlineUsers.includes(user._id) ?
             <span className='text-green-500 text-xs'>Online</span> :
             <span className='text-neutral-500 text-xs'>Offline</span>
          }
        </div>
        {unseenMessages[user._id] > 0 && <p className='absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-green-500/50'>{unseenMessages[user._id]}</p>}
      </div>
     ))}
    </div>
     
    </div>
  )
}

export default Sidebar