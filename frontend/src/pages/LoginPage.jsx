import React, { useContext, useState } from 'react'
import AuthImagePattern from '../components/AuthImagePattern'
import assets from '../assets/assets'
import {ArrowBigLeftDashIcon} from 'lucide-react'
import { AuthContext } from '../context/AuthContext'

const LoginPage = () => {

  const [currState, setCurrState] = useState("Sign up")
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [bio, setBio] = useState('')
  const [isDataSubmitted, setisDataSubmitted] = useState(false)

  const {login} = useContext(AuthContext)

  const handleOnSubmit = (e) => {
   e.preventDefault();

   if (currState === 'Sign up' && !isDataSubmitted) {
     setisDataSubmitted(true)
   }
   
   login(currState === "Sign up" ? "signup" : "login", {fullName, email, password, bio})
  }

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-xs'>

      {/* -------left--------- */}

      <AuthImagePattern title="Join our community"
   subtitle="Connect with your love one's and stay in touch."/>
      
      {/* right */}
      
      <form onSubmit={handleOnSubmit} className='borde-2 bg-white/18 text-white border border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
      <h2 className='font-medium text-2xl flex justify-between items-center'>
        {currState}
        {/* <img src={assets.arrow_icon} alt="" className='w-5 cursor-pointer' /> */}
        {isDataSubmitted && 
        <ArrowBigLeftDashIcon onClick={() => setisDataSubmitted(false)} className='cursor-pointer'/>
        }
        </h2>
        {
        currState === 'Sign up' && !isDataSubmitted && (
        <input onChange={(e) => setFullName(e.target.value)} value={fullName} type="text" 
        placeholder='Full Name' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500' required />
       )}
       {!isDataSubmitted && (
        <>
        <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" 
        placeholder='Email Address' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500' required />
       <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" 
       placeholder='Password' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500' required />
        </>
       )}

       {
        currState === 'Sign up' && isDataSubmitted && (
          <textarea onChange={(e) => setBio(e.target.value)} value={bio} 
          rows={4} className='p-2 border border-gray-500 rounded-md
           focus:outline-none focus:ring-2 focus:ring-green-500' placeholder='bio...' required>

          </textarea>
        )
       }

       <button type='submit' className='py-3 bg-gradient-to-r from-green-500 to-green-800 text-white rounded-md cursor-pointer'>
        {currState === 'Sign up' ? 'Create an account' : 'Login'}
       </button>

       <div className='flex items-center gap-2 text-sm text-gray-300'>
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
       </div>

       <div className='flex flex-col gap-2'>
        {currState === 'Sign up' ? 
        (
          <p className='text-sm text-gray-300'>Already have an account? <span className='font-medium text-green-500 cursor-pointer' onClick={() => {setCurrState("Login"); setisDataSubmitted(false)}} >Login here</span></p>
        ) : 
        (
          <p className='text-sm text-gray-300'>Create an account <span className='font-medium text-green-500 cursor-pointer' onClick={() => {setCurrState("Sign up"); setisDataSubmitted(false)}} >Click here</span></p>
        )}
       </div>

      </form>
   
    </div>
  )
}

export default LoginPage