import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Layout from "@/components/organisms/Layout"
import Workouts from "@/components/pages/Workouts"
import ExerciseLibrary from "@/components/pages/ExerciseLibrary"
import Progress from "@/components/pages/Progress"
import Profile from "@/components/pages/Profile"
import WorkoutSession from "@/components/pages/WorkoutSession"

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/workouts" replace />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/workout/:planId" element={<WorkoutSession />} />
            <Route path="/exercises" element={<ExerciseLibrary />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  )
}

export default App