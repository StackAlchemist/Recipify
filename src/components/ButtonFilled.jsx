import React from 'react'

const ButtonFilled = ({content}) => {
  return (
<button className="text-emerald-600 bg-white rounded-full px-4 py-1.5 
  border border-emerald-600
  transition duration-300 ease-in-out 
  hover:bg-emerald-600 hover:text-white hover:border-white
  active:scale-95">
  {content}
</button>

  )
}

export default ButtonFilled
