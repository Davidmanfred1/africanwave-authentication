import React, { useState } from 'react';
import { HiMail } from 'react-icons/hi';
import { FaApple, FaFacebook, FaLock } from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';
import { HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';
import image from "../../images/bg-img.png"
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

function ForgetPassword() {
    const [formData, setFormData] = useState({
        email: '',
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccessMessage('');
        
        if (!formData.email) {
            setError('Please enter your email address');
            setIsSubmitting(false);
            return;
        }

        try {
            const auth = getAuth();
            await sendPasswordResetEmail(auth, formData.email);
            setSuccessMessage('Password reset email sent! Please check your inbox for the link to reset your password.');
            setEmailSent(true);
        } catch (err) {
            console.error('Error sending reset email:', err);
            if (err.code === 'auth/user-not-found') {
                setError('No account found with this email address');
            } else if (err.code === 'auth/invalid-email') {
                setError('Please enter a valid email address');
            } else {
                setError('Failed to send reset email. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(''); // Clear error when user types
        setSuccessMessage(''); // Clear success message when user types
    };

    return (
        <div className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4"
            style={{
                backgroundImage: `linear-gradient(rgba(241, 230, 208, 0.4), rgba(240, 229, 207, 0.4)), url(${image})`
            }}>
            <div className="bg-white/95 backdrop-blur-sm p-10 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:shadow-xl">
                {!emailSent ? (
                    <>
                        <div className="text-center mb-10">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Reset Your Password</h1>
                            <p className="text-gray-600">Enter your email to receive a password reset link</p>
                        </div>

                        <form onSubmit={handleEmailSubmit} className="space-y-6">
                            <div className="relative group">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 text-gray-800 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                                    placeholder="Enter your email"
                                    required
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <HiMail className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-300" />
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                                    <HiExclamationCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full px-6 py-3 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] ${
                                    isSubmitting 
                                        ? 'bg-green-400 cursor-not-allowed' 
                                        : 'bg-green-600 hover:bg-green-700'
                                }`}
                            >
                                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <div className="text-center mb-10">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Check Your Email</h1>
                            <p className="text-gray-600">We've sent a password reset link to {formData.email}.</p> 
                        </div>

                        {successMessage && (
                            <div className="flex items-center text-green-700 text-sm bg-green-50 p-3 rounded-lg border border-green-200 mb-4">
                                 <HiCheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                                 <span>{successMessage}</span>
                            </div>
                        )}

                        {error && (
                                <div className="flex items-center text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200 mb-4">
                                     <HiExclamationCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                                     <span>{error}</span>
                                </div>
                            )}
                        
                        <div className="mt-6 text-center">
                             <button
                                onClick={handleEmailSubmit} // Re-use the same submit handler
                                disabled={isSubmitting}
                                className={`inline-block px-4 py-2 rounded-md text-sm font-semibold text-white transition-colors duration-300 ${ 
                                    isSubmitting
                                        ? 'bg-green-400 cursor-not-allowed' 
                                        : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                                }`}
                            >
                                {isSubmitting ? 'Resending...' : 'Resend Email'}
                            </button>
                        </div>
                    </>
                )}

                <div className="text-center mt-4">
                    <a href="/signin" className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors duration-300">
                        Back to Login
                    </a>
                </div>
            </div>
        </div>
    );
}

export default ForgetPassword;


