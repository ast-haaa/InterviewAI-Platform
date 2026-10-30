import React, { useState } from 'react'
import { BsRobot } from "react-icons/bs";
import { IoSparkles } from "react-icons/io5";
import { motion } from "motion/react"
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../utils/firebase';
import axios from 'axios';
import { ServerUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function Auth({isModel = false}) {
    const dispatch = useDispatch()
    const [authError, setAuthError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleGoogleAuth = async () => {
        setAuthError(null)
        setIsLoading(true)

        let User;
        try {
            const response = await signInWithPopup(auth, provider)
            User = response.user
        } catch (firebaseErr) {
            console.error("Firebase Auth Error:", firebaseErr)
            setIsLoading(false)
            dispatch(setUserData(null))
            setAuthError(`Firebase Error: ${firebaseErr.code || firebaseErr.message}`)
            return
        }

        try {
            const name = User.displayName
            const email = User.email
            const result = await axios.post(ServerUrl + "/api/auth/google", { name, email }, { withCredentials: true })
            dispatch(setUserData(result.data))
        } catch (backendErr) {
            console.error("Backend Auth Error:", backendErr)
            dispatch(setUserData(null))
            setAuthError(backendErr.response?.data?.message || `Connected to Google, but failed to connect to backend server at ${ServerUrl}. Ensure server is running on port 8000.`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={`
          w-full 
          ${isModel ? "py-4" : "min-h-screen bg-[#f3f3f3] dark:bg-gray-900 flex items-center justify-center px-6 py-20"}
        `}>
            <motion.div 
                initial={{opacity:0 , y:-40}} 
                animate={{opacity:1 , y:0}} 
                transition={{duration:1.05}}
                className={`
                w-full 
                ${isModel ? "max-w-md p-8 rounded-3xl" : "max-w-lg p-12 rounded-[32px]"}
                bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-700
              `}>
                <div className='flex items-center justify-center gap-3 mb-6'>
                    <div className='bg-black text-white p-2 rounded-lg'>
                        <BsRobot size={18}/>
                    </div>
                    <h2 className='font-semibold text-lg text-gray-900 dark:text-gray-100'>InterviewIQ.AI</h2>
                </div>

                <h1 className='text-2xl md:text-3xl font-semibold text-center leading-snug mb-4 text-gray-900 dark:text-gray-100'>
                    Continue with
                    <span className='bg-green-100 text-green-600 px-3 py-1 rounded-full inline-flex items-center gap-2'>
                        <IoSparkles size={16}/>
                        AI Smart Interview
                    </span>
                </h1>

                <p className='text-gray-500 dark:text-gray-300 text-center text-sm md:text-base leading-relaxed mb-8'>
                    Sign in to start AI-powered mock interviews, track your progress, and unlock detailed performance insights.
                </p>

                <motion.button 
                    onClick={handleGoogleAuth}
                    disabled={isLoading}
                    whileHover={{opacity:0.9 , scale:1.03}}
                    whileTap={{opacity:1 , scale:0.98}}
                    className='w-full flex items-center justify-center gap-3 py-3 bg-black text-white rounded-full shadow-md disabled:opacity-50 cursor-pointer'>
                    <FcGoogle size={20}/>
                    {isLoading ? "Signing in..." : "Continue with Google"}
                </motion.button>

                {authError && (
                    <div className='mt-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-xs md:text-sm text-center'>
                        {authError}
                    </div>
                )}
            </motion.div>
        </div>
    )
}

export default Auth
