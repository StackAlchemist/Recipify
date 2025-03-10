import React from 'react'

const Heading = ({text1, text2}) => {
  return (
    <div className=''>
      <p className='text-gray-400 text-3xl font-semibold space-grotesk'>{text1} <span className='text-emerald-600'>{text2}</span></p> 
      <p className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-emerald-600 space-grotesk'></p>
    </div>
  )
}

export default Heading
