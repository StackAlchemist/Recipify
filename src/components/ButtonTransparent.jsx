import React from 'react'

const ButtonTransparent = ({content}) => {
  return (
    <button className="border border-white text-white rounded-full px-4 py-1.5 transition duration-300 ease-in-out hover:bg-white hover:text-emerald-600 active:scale-95">
      {content}
    </button>
  )
}

export default ButtonTransparent
