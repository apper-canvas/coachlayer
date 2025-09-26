import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Badge from "@/components/atoms/Badge"
import WorkoutTimer from "@/components/organisms/WorkoutTimer"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"
import { workoutPlanService } from "@/services/api/workoutPlanService"
import { workoutSessionService } from "@/services/api/workoutSessionService"
import { exerciseService } from "@/services/api/exerciseService"
import { toast } from "react-toastify"

const WorkoutSession = () => {
  const { planId } = useParams()
  const navigate = useNavigate()
  
  const [plan, setPlan] = useState(null)
  const [exercises, setExercises] = useState([])
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [exerciseData, setExerciseData] = useState({})
  const [sessionStartTime, setSessionStartTime] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadWorkoutData = async () => {
    try {
      setError("")
      setLoading(true)
      
      const planData = await workoutPlanService.getById(parseInt(planId))
      if (!planData) {
        throw new Error("Workout plan not found")
      }
      
      setPlan(planData)
      
      // Load exercise details
      const exercisePromises = planData.exercises.map(exerciseId => 
        exerciseService.getById(exerciseId)
      )
      const exerciseDetails = await Promise.all(exercisePromises)
      setExercises(exerciseDetails.filter(exercise => exercise !== null))
      
      // Initialize exercise data
      const initialData = {}
      exerciseDetails.forEach(exercise => {
        if (exercise) {
          initialData[exercise.Id] = {
            sets: 3,
            reps: 10,
            weight: 0,
            completed: false,
            restTime: 60
          }
        }
      })
      setExerciseData(initialData)
      setSessionStartTime(new Date())
    } catch (err) {
      setError(err.message || "Failed to load workout data")
    } finally {
      setLoading(false)
    }
  }

  const updateExerciseData = (exerciseId, field, value) => {
    setExerciseData(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        [field]: value
      }
    }))
  }

  const completeExercise = () => {
    const currentExercise = exercises[currentExerciseIndex]
    updateExerciseData(currentExercise.Id, "completed", true)
    
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1)
      toast.success(`${currentExercise.name} completed! Great job!`)
    } else {
      completeWorkout()
    }
  }

  const completeWorkout = async () => {
    try {
      const sessionDuration = Math.floor((new Date() - sessionStartTime) / 1000 / 60)
      
      const sessionData = {
        planId: parseInt(planId),
        date: new Date().toISOString(),
        exercises: exercises.map(exercise => ({
          id: exercise.Id,
          name: exercise.name,
          ...exerciseData[exercise.Id]
        })),
        duration: sessionDuration,
        completed: true
      }
      
      await workoutSessionService.create(sessionData)
      toast.success("Workout completed! Amazing work!")
      navigate("/progress")
    } catch (err) {
      toast.error("Failed to save workout session")
    }
  }

  const exitWorkout = () => {
    if (window.confirm("Are you sure you want to exit this workout? Progress will be lost.")) {
      navigate("/workouts")
    }
  }

  useEffect(() => {
    loadWorkoutData()
  }, [planId])

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadWorkoutData} />
  if (!plan || !exercises.length) return <Error message="Workout data not found" />

  const currentExercise = exercises[currentExerciseIndex]
  const currentData = exerciseData[currentExercise?.Id] || {}
  const completedExercises = exercises.filter(ex => exerciseData[ex.Id]?.completed).length
  const progress = (completedExercises / exercises.length) * 100

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto min-h-screen">
      {/* Workout Header */}
      <Card className="overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-orange-100/50 opacity-70" />
        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg mb-1">{plan.name}</CardTitle>
              <p className="text-sm text-gray-600 mb-2">Exercise {currentExerciseIndex + 1} of {exercises.length}</p>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary to-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <Button onClick={exitWorkout} variant="ghost" size="sm" className="gap-2">
              <ApperIcon name="X" size={16} />
              Exit
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Current Exercise */}
      <Card className="overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-blue-100/50 opacity-70" />
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-blue-600 flex items-center justify-center">
              <ApperIcon name="Target" className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-display font-bold">{currentExercise.name}</h3>
              <div className="flex flex-wrap gap-1 mt-1">
                {currentExercise.muscleGroups.map((muscle) => (
                  <Badge key={muscle} variant="secondary" className="text-xs">
                    {muscle}
                  </Badge>
                ))}
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="space-y-4">
            {/* Exercise Instructions */}
            <div className="p-4 bg-white/50 rounded-xl">
              <p className="text-sm text-gray-700 leading-relaxed">
                {currentExercise.instructions}
              </p>
            </div>
            
            {/* Exercise Inputs */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Sets</label>
                <Input
                  type="number"
                  value={currentData.sets || 3}
                  onChange={(e) => updateExerciseData(currentExercise.Id, "sets", parseInt(e.target.value) || 0)}
                  min="1"
                  max="10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Reps</label>
                <Input
                  type="number"
                  value={currentData.reps || 10}
                  onChange={(e) => updateExerciseData(currentExercise.Id, "reps", parseInt(e.target.value) || 0)}
                  min="1"
                  max="50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Weight</label>
                <Input
                  type="number"
                  value={currentData.weight || 0}
                  onChange={(e) => updateExerciseData(currentExercise.Id, "weight", parseFloat(e.target.value) || 0)}
                  min="0"
                  step="2.5"
                />
              </div>
            </div>
            
            {/* Rest Timer */}
            {currentData.completed && currentExerciseIndex < exercises.length - 1 && (
              <WorkoutTimer
                duration={currentData.restTime || 60}
                autoStart={true}
                onComplete={() => toast.info("Rest time over! Ready for next exercise?")}
              />
            )}
            
            {/* Action Button */}
            <Button
              onClick={completeExercise}
              className="w-full gap-2 py-3"
              disabled={currentData.completed}
            >
              {currentData.completed ? (
                <>
                  <ApperIcon name="Check" size={16} />
                  Completed
                </>
              ) : currentExerciseIndex === exercises.length - 1 ? (
                <>
                  <ApperIcon name="Trophy" size={16} />
                  Finish Workout
                </>
              ) : (
                <>
                  <ApperIcon name="Check" size={16} />
                  Complete Exercise
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Exercise Navigation */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => setCurrentExerciseIndex(prev => Math.max(0, prev - 1))}
          variant="outline"
          size="sm"
          disabled={currentExerciseIndex === 0}
          className="gap-2"
        >
          <ApperIcon name="ChevronLeft" size={16} />
          Previous
        </Button>
        
        <div className="text-sm text-gray-600 font-medium">
          {completedExercises} / {exercises.length} completed
        </div>
        
        <Button
          onClick={() => setCurrentExerciseIndex(prev => Math.min(exercises.length - 1, prev + 1))}
          variant="outline"
          size="sm"
          disabled={currentExerciseIndex === exercises.length - 1}
          className="gap-2"
        >
          Next
          <ApperIcon name="ChevronRight" size={16} />
        </Button>
      </div>

      {/* Exercise List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Workout Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {exercises.map((exercise, index) => (
              <div
                key={exercise.Id}
                className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                  index === currentExerciseIndex
                    ? "bg-gradient-to-r from-primary/20 to-orange-100 border-2 border-primary/30"
                    : exerciseData[exercise.Id]?.completed
                    ? "bg-gradient-to-r from-green-100 to-emerald-100"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    exerciseData[exercise.Id]?.completed
                      ? "bg-green-500 text-white"
                      : index === currentExerciseIndex
                      ? "bg-primary text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}>
                    {exerciseData[exercise.Id]?.completed ? (
                      <ApperIcon name="Check" size={12} />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className={`font-medium ${
                    index === currentExerciseIndex ? "text-primary" : "text-gray-900"
                  }`}>
                    {exercise.name}
                  </span>
                </div>
                <div className="text-xs text-gray-600">
                  {exerciseData[exercise.Id]?.sets || 3} × {exerciseData[exercise.Id]?.reps || 10}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default WorkoutSession