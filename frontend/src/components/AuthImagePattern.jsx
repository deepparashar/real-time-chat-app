import React from 'react'

const AuthImagePattern = ({title,subtitle}) => {
  return (
    <div className='hidden lg:flex items-center justify-center bg-green-20 p-12 mt-20'>
        <div className='max-w-md text-center'>
            <div className='grid grid-cols-3 gap-3 mb-3'>
                {[...Array(9)].map((_, i) => (
                    <div key={i} className={`aspect-square rounded-2xl bg-green-500/30 ${
                        i % 2 ===0 ? "animate-pulse" : ""
                    }`}></div>
                ))}

                <h2 className='text-2xl text-white font-bold mb-4'>{title}</h2>
                 <p className='text-base-content/60 text-white'>{subtitle}</p>
            </div>
        </div>
      
    </div>
  )
}

export default AuthImagePattern
