import React from "react"
import { useSearchParams, Link } from "react-router-dom"

const ErrorPage = () => {
  const [searchParams] = useSearchParams()
  const errorMessage = searchParams.get("message") || "An error occurred"
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 bg-surface rounded-2xl shadow-xl text-center">
        <h1 className="text-2xl font-display font-bold text-red-600 mb-4">Authentication Error</h1>
        <p className="text-gray-700 mb-6">{errorMessage}</p>
        <Link to="/login" className="inline-block px-6 py-3 bg-primary text-white rounded-xl hover:bg-orange-500 transition-colors font-display font-medium">
          Return to Login
        </Link>
      </div>
    </div>
  )
}

export default ErrorPage