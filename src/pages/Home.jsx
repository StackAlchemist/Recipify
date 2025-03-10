import React from 'react'
import Hero from '../components/Hero'
import FeaturedProducts from '../components/FeaturedProducts'

const Home = () => {
  return (
    <div className='mb-10'>
      <Hero/>
      <FeaturedProducts />
    </div>
  )
}

export default Home
