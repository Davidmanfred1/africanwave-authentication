import React, { useState } from 'react';
import { auth } from "../../firebase";  // Import Firebase auth
import { createUserWithEmailAndPassword, updateProfile, linkWithCredential, EmailAuthProvider, FacebookAuthProvider, OAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import image from "../../images/bg-img.png";
import { HiMail } from 'react-icons/hi';
import { FaApple, FaFacebook, FaEye, FaEyeSlash } from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';
import { Link } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate password match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      navigate("/thankyou");
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        try {
          // Try to sign in with Google first
          const provider = new GoogleAuthProvider();
          const result = await signInWithPopup(auth, provider);
          
          // If successful, link the email/password to the Google account
          const credential = EmailAuthProvider.credential(email, password);
          await linkWithCredential(result.user, credential);
          
          setError(
            <div className="text-green-600">
              Successfully linked email/password to your Google account. You can now sign in with either method.
            </div>
          );
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } catch (linkError) {
          setError(
            <div>
              This email is already registered. Please{' '}
              <Link to="/signin" className="text-blue-600 hover:underline">
                sign in
              </Link>{' '}
              instead.
            </div>
          );
        }
      } else {
        setError(error.message);
      }
    }
    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError("");
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/thankyou");
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError("Sign up was cancelled");
      } else {
        setError("Google sign-up failed. Please try again.");
      }
    }
    setLoading(false);
  };

  const handleFacebookSignUp = async () => {
    setLoading(true);
    setError("");
    const provider = new FacebookAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/thankyou");
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError("Sign up was cancelled");
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setError("An account already exists with the same email address but different sign-in credentials.");
      } else {
        setError("Facebook sign-up failed. Please try again.");
      }
    }
    setLoading(false);
  };

  const handleAppleSignUp = async () => {
    setLoading(true);
    setError("");
    const provider = new OAuthProvider('apple.com');
    try {
      await signInWithPopup(auth, provider);
      navigate("/thankyou");
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError("Sign up was cancelled");
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setError("An account already exists with the same email address but different sign-in credentials.");
      } else {
        setError("Apple sign-up failed. Please try again.");
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
          <Link to="/signup">
            <button className="px-6 py-2.5 bg-[#1b5e3c] text-white font-semibold rounded-full shadow-lg hover:bg-[#154a2f] transition-all duration-300">
              Sign Up
            </button>
          </Link>
          <Link to="/signin">
            <button className="px-6 py-2.5 bg-white text-[#1b5e3c] font-semibold rounded-full shadow-lg hover:bg-gray-50 transition-all duration-300">
              Sign In
            </button>
          </Link>
        </div>
      </div>

      {/* Large Screen: Left-side Image & Buttons */}
      <div className="hidden lg:block lg:w-1/2 bg-cover bg-center relative">
        <div className="absolute inset-y-0 right-4 flex flex-col justify-center items-end -mr-4">
          <Link to="/signup">
            <button className="w-36 px-6 py-3 bg-[#1b5e3c] text-white font-semibold rounded-tl-3xl shadow-lg hover:bg-[#154a2f] transition-all duration-300">
              Sign Up
            </button>
          </Link>
          <Link to="/signin">
            <button className="w-36 px-6 py-3 bg-white text-[#1b5e3c] font-semibold rounded-bl-3xl shadow-lg hover:bg-gray-50 transition-all duration-300">
              Sign In
            </button>
          </Link>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 bg-white lg:rounded-l-3xl relative shadow-2xl lg:min-h-screen">
        <div className="w-full max-w-md space-y-6 relative px-4 sm:px-0">
          <div className="text-center mb-6">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-2">
              Let's Get Started
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">Create your account to continue</p>
          </div>

          {error && <p className="text-red-500 text-center p-3 bg-red-50 rounded-lg">{error}</p>}

          <form className="mt-6 space-y-4" onSubmit={handleSignup}>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  className="block w-full px-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none border-b-2 border-gray-300 focus:border-[#1b5e3c] transition duration-300 bg-gray-50 rounded-t-lg"
                  placeholder="Email Address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="absolute right-3 top-3 h-8 w-8 border bg-[#1b5e3c] border-[#1b5e3c] rounded-full flex items-center justify-center">
                  <HiMail className="h-4 w-4 font-bold pointer-events-none text-white" />
                </div>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="block w-full px-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none border-b-2 border-gray-300 focus:border-[#1b5e3c] transition duration-300 bg-gray-50"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 h-8 w-8 border bg-[#1b5e3c] border-[#1b5e3c] rounded-full flex items-center justify-center cursor-pointer"
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-4 w-4 text-white" />
                  ) : (
                    <FaEye className="h-4 w-4 text-white" />
                  )}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="block w-full px-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none border-b-2 border-gray-300 focus:border-[#1b5e3c] transition duration-300 bg-gray-50 rounded-b-lg"
                  placeholder="Confirm Password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 h-8 w-8 border bg-[#1b5e3c] border-[#1b5e3c] rounded-full flex items-center justify-center cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="h-4 w-4 text-white" />
                  ) : (
                    <FaEye className="h-4 w-4 text-white" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <div className="relative flex justify-center mt-6">
              <button
                type="submit"
                className="w-full sm:w-1/2 px-6 py-3 shadow-lg bg-[#1b5e3c] text-white font-bold rounded-full hover:bg-[#154a2f] transition-all duration-300 transform hover:scale-105"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </div>

            <div className="relative my-6">
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">OR CONTINUE WITH</span>
              </div>
            </div>

            <div className="flex items-center justify-center w-full">
              <div className="space-y-3 w-full sm:w-auto flex flex-col items-center">
                <button
                  type="button"
                  onClick={handleFacebookSignUp}
                  disabled={loading}
                  className="w-full sm:w-[300px] px-4 py-3 border border-gray-300 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-3 text-sm sm:text-base"
                >
                  <FaFacebook className="text-xl" />
                  Continue with Facebook
                </button>
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  disabled={loading}
                  className="w-full sm:w-[300px] px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-3 text-sm sm:text-base"
                >
                  <FcGoogle className="text-xl" />
                  Continue with Google
                </button>
                {/* <button
                  type="button"
                  onClick={handleAppleSignUp}
                  disabled={loading}
                  className="w-full sm:w-[300px] px-4 py-3 border border-gray-300 rounded-lg bg-black text-white hover:bg-gray-900 transition-all duration-300 flex items-center justify-center gap-3 text-sm sm:text-base"
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

export default Signup;
