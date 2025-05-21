import React, { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { MessageCircleMore, SendIcon } from 'lucide-react'
import { formatMessageTime } from '../lib/utils'
import EmojiPicker from 'emoji-picker-react'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
import toast from 'react-hot-toast'

const ChatContainer = () => {
  const { message: messages, selectedUser, setSelectedUser, sendMessage, getMessages } = useContext(ChatContext)
  const { authUser, onlineUsers } = useContext(AuthContext)

  const scrollEnd = useRef()
  const [input, setInput] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const handleSendMessages = async (e) => {
    e.preventDefault()
    if (input.trim() === "") return null
    await sendMessage({ text: input.trim() })
    setInput("")
  }

  const handleSendImage = async (e) => {
    const file = e.target.files[0]
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select an image file")
      return
    }

    const reader = new FileReader()
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result })
      e.target.value = ""
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id)
    }
  }, [selectedUser])

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleEmojiClick = (emojiData) => {
    setInput(prev => prev + emojiData.emoji)
  }

  return selectedUser ? (
    <div className='h-full overflow-y-auto overflow-x-hidden relative backdrop-blur-lg'>
      {/* ---------Header----------- */}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
        <img src={selectedUser.profilePic || assets.avatar_icon} alt="Profile" className='w-8 rounded-full' />
        <p className='flex-1 text-lg text-white flex items-center gap-2'>
          {selectedUser.fullName}
          {
            onlineUsers.includes(selectedUser._id) &&
            <span className='w-2 h-2 rounded-full bg-green-500'></span>
          }
        </p>
        <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt="ArrowIcon" className='md:hidden max-w-7' />
        <img src={assets.help_icon} alt="HelpIcon" className='max-md:hidden max-w-5' />
      </div>

      {/* ------------------Chat area-------------- */}
      <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
        {Array.isArray(messages) && messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId !== authUser._id && 'flex-row-reverse'}`}>
            {msg.image ? (
              <img src={msg.image} alt="" className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8' />
            ) : (
              <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-green-500/30 text-white ${msg.senderId === authUser._id ? 'rounded-br-none' : 'rounded-bl-none'} `}>{msg.text}</p>
            )}
            <div className='text-center text-xs'>
              <img src={msg.senderId === authUser._id ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-7 rounded-full' />
              <p className='text-gray-500'>{formatMessageTime(msg.createdAt)}</p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {/* --------bottom area----------- */}
      <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
        <div className='flex-1 flex items-center bg-gray-100/12 px-3 py-2 rounded-full relative'>
          <button onClick={() => setShowEmojiPicker(prev => !prev)} className='text-white mr-2 hover:bg-gray-300/20 cursor-pointer'>😀</button>
          {showEmojiPicker && (
            <div className='absolute bottom-14 left-0 z-10'>
              <EmojiPicker onEmojiClick={handleEmojiClick} theme='dark' />
            </div>
          )}

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" ? handleSendMessages(e) : null}
            placeholder='Type a message'
            className='flex-1 text-sm p-2 border-none rounded-lg outline-none bg-transparent text-white placeholder-gray-400'
          />
          <input onChange={handleSendImage} type="file" id="image" accept='image/png, image/jpeg' hidden />
          <label htmlFor="image">
            <img src={assets.gallery_icon} alt="Gallery" className='w-5 ml-2 cursor-pointer hover:bg-gray-300/20' />
          </label>
        </div>

        <div className='size-9 gap-0.5 rounded-full bg-green-500/50 flex items-center justify-center'>
          <SendIcon onClick={handleSendMessages} className='text-gray-200 w-4 h-5' />
        </div>
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-white bg-green-950/20 max-md:hidden'>
      <div className='flex gap-1.5'>
        <div className='size-19 gap-0.5 rounded-full rounded-bl-none bg-[#16395d] flex items-center justify-center'>
          <MessageCircleMore className='w-12 h-12' />
        </div>
      </div>
      <p className='text-lg font-medium text-white'>Chat anytime, anywhere</p>
    </div>
  )
}

export default ChatContainer
