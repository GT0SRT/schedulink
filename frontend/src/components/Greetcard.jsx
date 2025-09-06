import React from 'react';

function Greetcard({ username }) {
  return (
    <div className="bg-white md:mt-5 shadow-xl rounded-2xl p-2 md:p-4 flex md:flex-row 
            items-center md:items-start gap-3 w-full md:w-auto border border-gray-300">

      <div className='flex-1'>
        <h4 className='text-xl md:text-3xl font-bold text-gray-800 m-6 mb-1'>
          Welcome {username}!
        </h4>
        <p className='text-gray-500 text-sm text-base m-6 mt-2'>
          Good to see you today! Let’s make it productive.
        </p>
      </div>
      
      <div className='flex-shrink-0 -mt-12 md:-mt-30 md:mr-6'>
        <img 
          src={"https://user-images.githubusercontent.com/21218732/108165714-05c74a80-7119-11eb-9a61-2963220f99de.png"} 
          alt='Greetcard' 
          className='w-30 h-30 md:w-60 md:h-60 rounded-2xl object-cover' 
        />
      </div>
    </div>
  );
}

export default Greetcard;
