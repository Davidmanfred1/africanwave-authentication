import React, { useState } from 'react';
import image from "../../images/bg-img.png";
import { HiMail } from 'react-icons/hi';
import { FaApple, FaFacebook, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from "../../firebase";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, OAuthProvider } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  
  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess("Successfully signed in! Redirecting...");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError("Account not found. Please create an account first.");
      } else if (err.code === 'auth/wrong-password') {
        setError("Incorrect password. Please try again.");
      } else if (err.code === 'auth/invalid-email') {
        setError("Invalid email format.");
      } else {
        setError("Please Check Your Email and Password");
      }
    }
    setLoading(false);
  };
  
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setSuccess("Successfully signed in with Google! Redirecting...");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError("Sign in was cancelled");
      } else {
        setError("Google sign-in failed. Please try again.");
      }
    }
    setLoading(false);
  };

  const handleFacebookSignIn = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    const provider = new FacebookAuthProvider();
    
    // Add additional scopes for more user data
    provider.addScope('email');
    provider.addScope('public_profile');
    
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Get additional user data from Facebook
      const credential = FacebookAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;
      
      // Store user data in Firestore
      try {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          provider: 'facebook',
          lastLogin: new Date().toISOString(),
          facebookAccessToken: accessToken,
          // Add any additional user data you want to store
        }, { merge: true });
      } catch (firestoreError) {
        console.error("Error storing user data:", firestoreError);
        // Continue with sign in even if storing data fails
      }
      
      setSuccess("Successfully signed in with Facebook! Redirecting...");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error("Facebook sign-in error:", err);
      
      if (err.code === 'auth/popup-closed-by-user') {
        setError("Sign in was cancelled");
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setError("An account already exists with the same email address but different sign-in credentials.");
      } else if (err.code === 'auth/network-request-failed') {
        setError("Network error. Please check your internet connection and try again.");
      } else if (err.code === 'auth/too-many-requests') {
        setError("Too many sign-in attempts. Please try again later.");
      } else if (err.code === 'auth/popup-blocked') {
        setError("Pop-up was blocked. Please allow pop-ups for this site and try again.");
      } else if (err.code === 'auth/cancelled-popup-request') {
        setError("Sign-in was cancelled. Please try again.");
      } else if (err.code === 'auth/operation-not-allowed') {
        setError("Facebook sign-in is not enabled. Please contact support.");
      } else {
        setError("Facebook sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    const provider = new OAuthProvider('apple.com');
    try {
      await signInWithPopup(auth, provider);
      setSuccess("Successfully signed in with Apple! Redirecting...");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError("Sign in was cancelled");
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setError("An account already exists with the same email address but different sign-in credentials.");
      } else {
        setError("Apple sign-in failed. Please try again.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-fixed" style={{
      backgroundImage: `linear-gradient(rgba(241, 230, 208, 0.4), rgba(240, 229, 207, 0.4)), url(${image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh'
    }}>
      {/* Mobile View */}
      <div className="lg:hidden flex flex-col items-center justify-start w-full h-full p-4 pt-10 sm:pt-16 relative min-h-[30vh]">
        <div className="flex justify-center space-x-4 mb-8">
          <Link to="/signin">
            <button className="px-6 py-2.5 bg-[#1b5e3c] text-white font-semibold rounded-full shadow-lg hover:bg-[#154a2f] transition-all duration-300 transform hover:scale-105">
              Sign In
            </button>
          </Link>
          <Link to="/signup">
            <button className="px-6 py-2.5 bg-white text-[#1b5e3c] font-semibold rounded-full shadow-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105">
              Sign Up
            </button>
          </Link>
        </div>
      </div>

      {/* Large Screen: Left-side Image & Buttons */}
      <div className="hidden lg:block lg:w-1/2 bg-cover bg-center relative">
        <div className="absolute inset-y-0 right-4 flex flex-col justify-center items-end -mr-4">
          <Link to="/signin">
            <button className="w-36 px-6 py-3 bg-[#1b5e3c] text-white font-semibold rounded-tl-3xl shadow-lg hover:bg-[#154a2f] transition-all duration-300">
              Sign In
            </button>
          </Link>
          <Link to="/signup">
            <button className="w-36 px-6 py-3 bg-white text-[#1b5e3c] font-semibold rounded-bl-3xl shadow-lg hover:bg-gray-50 transition-all duration-300">
              Sign Up
            </button>
          </Link>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-white lg:rounded-l-3xl relative shadow-2xl lg:min-h-screen">
        <div className="w-full max-w-md space-y-8 relative px-4 sm:px-0 py-8 lg:py-0">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-2">
              WELCOME
            </h1>
            <p className="text-gray-600 text-lg">Sign in to continue your journey</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="p-4 bg-green-100 text-green-700 rounded-lg border-l-4 border-green-500">
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg border-l-4 border-red-500">
              {error}
              {error.includes("create an account") && (
                <Link to="/signup" className="block mt-2 text-red-600 hover:text-red-800 font-medium">
                  Create Account Now
                </Link>
              )}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
            {/* Email Field */}
            <div className="relative group">
              <input
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none border-b-2 border-gray-300 focus:border-[#1b5e3c] transition duration-300 bg-gray-50 rounded-t-lg"
                placeholder="Email Address"
                required
                disabled={loading}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 h-10 w-10 bg-[#1b5e3c] rounded-full flex items-center justify-center group-hover:bg-[#154a2f] transition-all duration-300">
                <HiMail className="h-5 w-5 text-white" />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none border-b-2 border-gray-300 focus:border-[#1b5e3c] transition duration-300 bg-gray-50 rounded-t-lg"
                placeholder="Password"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-10 w-10 bg-[#1b5e3c] rounded-full flex items-center justify-center group-hover:bg-[#154a2f] transition-all duration-300"
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5 text-white" />
                ) : (
                  <FaEye className="h-5 w-5 text-white" />
                )}
              </button>
              <Link to='/forgetpassword'>
                <h1 className="absolute right-0 -bottom-6 text-sm font-bold text-gray-600 hover:text-[#1b5e3c] cursor-pointer transition-colors duration-300">
                  Forgotten Password?
                </h1>
              </Link>
            </div>

            {/* Submit Button */}
            <div className="relative flex justify-center pt-8">
              <button
                type="submit"
                disabled={loading}
                className={`w-full sm:w-2/3 px-6 py-3 shadow-lg bg-[#1b5e3c] text-white font-bold rounded-full hover:bg-[#154a2f] transition-all duration-300 transform hover:scale-105 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">OR CONTINUE WITH</span>
              </div>
            </div>

            {/* Social Media Buttons */}
            <div className="flex items-center justify-center w-full">
              <div className="space-y-4 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleFacebookSignIn}
                  disabled={loading}
                  className={`w-full sm:w-[300px] px-4 py-3 border-2 border-gray-200 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 text-sm sm:text-base ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <FaFacebook className="text-xl" />
                  Continue with Facebook
                </button>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className={`w-full sm:w-[300px] px-4 py-3 border-2 border-gray-200 rounded-full bg-white hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 text-sm sm:text-base ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <FcGoogle className="text-xl" />
                  Continue with Google
                </button>
                {/* <button
                  type="button"
                  onClick={handleAppleSignIn}
                  disabled={loading}
                  className={`w-full sm:w-[300px] px-4 py-3 border-2 border-gray-200 rounded-full bg-black text-white hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 text-sm sm:text-base ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <FaApple className="text-xl" />
                  Continue with Apple
                </button> */}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Signin;
