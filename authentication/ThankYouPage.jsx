import React from 'react';
import backgroundImage from '../../images/bg-img.png';
import logo from '../../images/Logo (2).png'
import { Link } from 'react-router-dom';

const ThankYouPage = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6"
      style={{ backgroundImage: `linear-gradient(rgba(241, 230, 208, 0.4), rgba(240, 229, 207, 0.4)), url(${backgroundImage})` }}
    >
      {/* Benefits section */}
      <div className="bg-white rounded-lg shadow-xl p-6 sm:p-10 max-w-md w-full mx-auto space-y-6 sm:space-y-8">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <img src={logo} alt="" className="mx-auto w-auto h-auto max-w-full" />
          <h2 className="font-semibold text-lg sm:text-xl md:text-2xl">Benefits Unlocked</h2>
        </div>

        {/* Benefits Content */}
        <div className="space-y-4 sm:space-y-6 text-center p-3 sm:p-6">
          <p className="text-gray-600 text-xl sm:text-sm">
            Your free African Wave account has been created
            <br />
            <span className="text-gray-600 font-medium">with benefits now available to you.</span>
          </p>
          <p className="text-gray-600 text-xl sm:text-sm">
            Earn points by engaging with content on <span>The African Wave!</span>
            <br />
            <span className="font-medium">Redeem points for cash or other rewards.</span>
          </p>
        </div>
        {/* Buttons */}
        <div className="space-y-4 flex flex-col items-center">
  <Link to="/" className="w-full sm:w-2/3 md:w-1/2 flex justify-center">
    <button className="w-full flex justify-center font-bold text-emerald-800 bg-white py-3 shadow-lg shadow-slate-300 rounded-3xl transition-colors hover:bg-emerald-50 text-base sm:text-lg">
      Done
    </button>
  </Link>
  <button className="w-full sm:w-2/3 md:w-1/2 text-center text-gray-500 text-sm sm:text-base hover:text-gray-700 transition-colors">
    No thanks, I'm done
  </button>
</div>
      </div>
    </div>
  );
}

export default ThankYouPage;