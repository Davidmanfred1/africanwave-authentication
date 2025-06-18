import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAuth, verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import { FaLock } from 'react-icons/fa6';
import { HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';
import image from "../../images/bg-img.png"; // Fixed path to match other components

function ResetPassword() {
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [oobCode, setOobCode] = useState(null);
    const [email, setEmail] = useState(''); // Store email if verification succeeds

    const location = useLocation();
    const navigate = useNavigate();
    const auth = getAuth();

    // Extract oobCode and verify it on component mount
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('oobCode');

        if (!code) {
            setError('Invalid password reset link. Please request a new one.');
            setIsLoading(false);
            return;
        }

        setOobCode(code);

        const verifyCode = async () => {
            try {
                const userEmail = await verifyPasswordResetCode(auth, code);
                setEmail(userEmail); // Store email for potential use
                setError(''); // Clear any previous errors
            } catch (err) {
                console.error('Error verifying password reset code:', err);
                if (err.code === 'auth/expired-action-code') {
                    setError('Password reset link has expired. Please request a new one.');
                } else if (err.code === 'auth/invalid-action-code') {
                    setError('Password reset link is invalid. Please request a new one.');
                } else {
                    setError('An error occurred. Please try again.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        verifyCode();
    }, [auth, location.search]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(''); // Clear error when user types
        setSuccessMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!oobCode) {
            setError('Password reset link is invalid or missing.');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (formData.newPassword.length < 8) { // Or your password strength requirement
            setError('Password must be at least 8 characters long.');
            return;
        }

        setIsSubmitting(true);

        try {
            await confirmPasswordReset(auth, oobCode, formData.newPassword);
            setSuccessMessage('Password has been reset successfully! You can now log in with your new password.');
            // Optionally redirect after a delay
            setTimeout(() => {
                navigate('/signin');
            }, 3000); // Redirect after 3 seconds
        } catch (err) {
            console.error('Error confirming password reset:', err);
             if (err.code === 'auth/expired-action-code') {
                setError('Password reset link has expired. Please request a new one.');
            } else if (err.code === 'auth/invalid-action-code') {
                 setError('Password reset link is invalid. Please request a new one.');
            } else if (err.code === 'auth/weak-password') {
                 setError('Password is too weak. Please choose a stronger password.');
            } else {
                setError('Failed to reset password. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Render loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4" style={{ backgroundImage: `linear-gradient(rgba(241, 230, 208, 0.4), rgba(240, 229, 207, 0.4)), url(${image})` }}>
                <div className="bg-white/95 backdrop-blur-sm p-10 rounded-2xl shadow-2xl w-full max-w-md text-center">
                    <p className="text-gray-600">Verifying link...</p>
                    {/* Add a spinner here if desired */}
                </div>
            </div>
        );
    }

    // Render error if code verification failed (and not loading anymore)
     if (!isLoading && error && !email) { // Show general error if verification failed
        return (
             <div className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4" style={{ backgroundImage: `linear-gradient(rgba(241, 230, 208, 0.4), rgba(240, 229, 207, 0.4)), url(${image})` }}>
                <div className="bg-white/95 backdrop-blur-sm p-10 rounded-2xl shadow-2xl w-full max-w-md text-center">
                     <div className="flex items-center justify-center text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200 mb-6">
                        <HiExclamationCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                    <a href="/forgot-password" className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors duration-300">
                         Request a new reset link
                    </a>
                     <div className="text-center mt-6">
                        <a href="/signin" className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors duration-300">
                            Back to Login
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // Render success message after password change
    if (successMessage) {
         return (
             <div className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4" style={{ backgroundImage: `linear-gradient(rgba(241, 230, 208, 0.4), rgba(240, 229, 207, 0.4)), url(${image})` }}>
                <div className="bg-white/95 backdrop-blur-sm p-10 rounded-2xl shadow-2xl w-full max-w-md text-center">
                     <div className="flex items-center justify-center text-green-700 text-sm bg-green-50 p-3 rounded-lg border border-green-200 mb-6">
                        <HiCheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                        <span>{successMessage}</span>
                    </div>
                     <div className="text-center mt-6">
                        <a href="/signin" className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors duration-300">
                            Proceed to Login
                        </a>
                    </div>
                </div>
            </div>
        );
    }


    // Render the password reset form if code is verified and not submitted yet
    return (
        <div className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4"
            style={{
                backgroundImage: `linear-gradient(rgba(241, 230, 208, 0.4), rgba(240, 229, 207, 0.4)), url(${image})`
            }}>
            <div className="bg-white/95 backdrop-blur-sm p-10 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:shadow-xl">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Set Your New Password</h1>
                    <p className="text-gray-600">Create a strong password for your account.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative group">
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className="block w-full px-4 py-3 text-gray-800 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                            placeholder="New Password"
                            required
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <FaLock className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-300" />
                        </div>
                    </div>

                     <div className="relative group">
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="block w-full px-4 py-3 text-gray-800 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                            placeholder="Confirm New Password"
                            required
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <FaLock className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-300" />
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
                                : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                        }`}
                    >
                        {isSubmitting ? 'Setting Password...' : 'Set New Password'}
                    </button>
                </form>
                 <div className="text-center mt-6">
                    <a href="/signin" className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors duration-300">
                        Back to Login
                    </a>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword; 