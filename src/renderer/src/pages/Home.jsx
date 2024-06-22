import React from 'react'
import { Link } from 'react-router-dom';
import WellBiengHeadline from '../components/Atoms/WellBiengHeadline';

function Home() {
    return (
        <div className="bg-pink-100 min-h-screen relativemin-h-screen flex flex-col items-center p-24 space-y-36 lg:space-y-36">
          <header className="text-center mb-8 w-full space-y-6">
            <WellBiengHeadline />
            <p className="text-lg text-gray-700 font-nigeria lg:text-2xl">Track your well-being and self-care journey</p>
          </header>
            <div className="flex flex-col items-center space-y-4 w-full">
            <Link to='/login' className="bg-pink-500 text-white font-semibold w-1/2 py-2 px-4 rounded shadow hover:bg-pink-600 md:w-1/3 lg:w-1/4">
              Login
            </Link>
              <Link to='register' className="bg-white text-pink-500 font-semibold w-1/2 py-2 px-4 rounded border border-pink-500 shadow hover:bg-pink-50 md:w-1/3 lg:w-1/4">
              Register
            </Link>
          </div>
        </div>
      )
}

export default Home