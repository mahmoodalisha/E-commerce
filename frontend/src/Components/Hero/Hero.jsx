import React from 'react'
import './Hero.css'
import hand_icon from '../Assets/hand_icon.png'
import arrow_icon from '../Assets/arrow.png'
import hero_image from '../Assets/hero_image.png'

const Hero = () => {
  return (
    <div className='hero'>
      <div className="hero-left">
        <h2>New Arrivals</h2>
      <div>
        <div className="hero-hand-icon">
            <p>Get</p>
        </div>
        <p>The Best Deals Here</p>
        
      </div>
      </div>
      <div className="hero-right">
        <img src={hero_image} alt='' />
    </div>
    </div>
  )
}

export default Hero
