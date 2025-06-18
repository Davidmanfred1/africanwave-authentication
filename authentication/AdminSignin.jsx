import React, { useState } from 'react';
import { Lock, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../../images/logo.jpg"
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

function AdminSignin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if user has admin role in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (!userDoc.exists() || userDoc.data().role !== "admin") {
        // Sign out the user if they're not an admin
        await auth.signOut();
        setError("Access denied. Admin privileges required.");
        return;
      }

      // If user is admin, navigate to admin dashboard
      navigate("/admin/dashboard");
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError("Account not found. Please check your credentials.");
      } else if (err.code === 'auth/wrong-password') {
        setError("Incorrect password. Please try again.");
      } else if (err.code === 'auth/invalid-email') {
        setError("Invalid email format.");
      } else {
        setError("Authentication failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="mx-auto h-28 w-28 flex items-center justify-center">
            <img src={logo} alt="logo" />
          </div>
          <h2 className=" text-3xl font-extrabold text-gray-900">Admin Portal</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter Password"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-gray-800 hover:text-blue-500 cursor-pointer">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-1/2 px-4 py-2 shadow-lg bg-white text-[#1b5e3c] font-bold shadow-slate-200 rounded-3xl hover:bg-green-50 transition-colors mt-10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminSignin;