import React from 'react'
import img from '../assets/GreetCard.png'

function Greetcard({username}) {
  return (
   
    <div className="bg-white shadow-xl rounded-2xl p-4 flex flex-col md:flex-row 
            items-center md:items-start gap-3 w-full md:w-auto border border-gray-300">
      
      <div className='flex-1'>
        <h4 className='text-2xl md:text-3xl font-bold text-gray-800 m-6'>Welcome {username}!</h4>
        <p className='text-gray-500 mt-3 text-base m-6 '>
          Good to see you today! Let’s make it productive.
        </p>
      </div>
      
      <div className='flex-shrink-0'>
        <img 
          src={img} 
          alt='Greetcard' 
          className='w-40 h-40 md:w-40 md:h-40 rounded-2xl object-cover ' 
        />
      </div>
    </div>
  )
}

export default Greetcard
