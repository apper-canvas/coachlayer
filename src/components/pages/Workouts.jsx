import { useState, useEffect } from "react"
import WorkoutPlanCard from "@/components/organisms/WorkoutPlanCard"
import StatCard from "@/components/molecules/StatCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { workoutPlanService } from "@/services/api/workoutPlanService"
import { workoutSessionService } from "@/services/api/workoutSessionService"

const Workouts = () => {
  const [plans, setPlans] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadData = async () => {
    try {
      setError("")
      setLoading(true)
      
      const [plansData, sessionsData] = await Promise.all([
        workoutPlanService.getAll(),
        workoutSessionService.getAll()
      ])
      
      setPlans(plansData)
      
      // Calculate stats
      const thisWeekSessions = sessionsData.filter(session => {
        const sessionDate = new Date(session.date)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return sessionDate >= weekAgo && session.completed
      })
      
      const totalMinutes = sessionsData
        .filter(session => session.completed)
        .reduce((total, session) => total + session.duration, 0)
      
      const currentStreak = calculateStreak(sessionsData)
      
      setStats({
        weeklyWorkouts: thisWeekSessions.length,
        totalMinutes,
        currentStreak,
        totalWorkouts: sessionsData.filter(session => session.completed).length
      })
    } catch (err) {
      setError(err.message || "Failed to load workout data")
    } finally {
      setLoading(false)
    }
  }

  const calculateStreak = (sessions) => {
    const completedSessions = sessions
      .filter(session => session.completed)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
    
    if (completedSessions.length === 0) return 0
    
    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    for (let session of completedSessions) {
      const sessionDate = new Date(session.date)
      sessionDate.setHours(0, 0, 0, 0)
      
      const daysDiff = Math.floor((today - sessionDate) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === streak) {
        streak++
      } else if (daysDiff > streak) {
        break
      }
    }
    
    return streak
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />
  if (!plans.length) return (
    <Empty 
      title="No workout plans available"
      description="Start your fitness journey with our personalized workout plans."
      icon="Dumbbell"
      actionLabel="Browse Exercise Library"
      action={() => window.location.href = "/exercises"}
    />
  )

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto">
      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            title="This Week"
            value={stats.weeklyWorkouts}
            icon="Calendar"
            change={`${stats.weeklyWorkouts > 3 ? "Great progress!" : "Keep going!"}`}
            changeType={stats.weeklyWorkouts > 3 ? "positive" : "neutral"}
            gradient="from-primary/10 to-orange-100"
          />
          <StatCard
            title="Current Streak"
            value={`${stats.currentStreak} days`}
            icon="Flame"
            change={stats.currentStreak > 0 ? "On fire!" : "Start today!"}
            changeType={stats.currentStreak > 0 ? "positive" : "neutral"}
            gradient="from-accent/20 to-yellow-100"
          />
        </div>
      )}

      {/* Workout Plans */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold text-gray-900">Your Plans</h2>
        </div>
        
        <div className="space-y-4">
          {plans.map((plan) => (
            <WorkoutPlanCard key={plan.Id} plan={plan} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Workouts