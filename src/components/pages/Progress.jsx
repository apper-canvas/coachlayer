import { useState, useEffect } from "react"
import StatCard from "@/components/molecules/StatCard"
import ProgressRing from "@/components/molecules/ProgressRing"
import ProgressChart from "@/components/organisms/ProgressChart"
import Badge from "@/components/atoms/Badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { workoutSessionService } from "@/services/api/workoutSessionService"

const Progress = () => {
  const [sessions, setSessions] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadProgressData = async () => {
    try {
      setError("")
      setLoading(true)
      const data = await workoutSessionService.getAll()
      setSessions(data)
      calculateStats(data)
    } catch (err) {
      setError(err.message || "Failed to load progress data")
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (sessions) => {
    const completedSessions = sessions.filter(session => session.completed)
    const totalWorkouts = completedSessions.length
    const totalMinutes = completedSessions.reduce((total, session) => total + session.duration, 0)
    
    // Weekly goal progress (target: 4 workouts per week)
    const thisWeek = completedSessions.filter(session => {
      const sessionDate = new Date(session.date)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return sessionDate >= weekAgo
    })
    
    const weeklyProgress = (thisWeek.length / 4) * 100
    
    // Calculate streak
    const currentStreak = calculateStreak(sessions)
    
    // Monthly comparison
    const thisMonth = completedSessions.filter(session => {
      const sessionDate = new Date(session.date)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return sessionDate >= monthAgo
    })
    
    const lastMonth = completedSessions.filter(session => {
      const sessionDate = new Date(session.date)
      const twoMonthsAgo = new Date()
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2)
      const oneMonthAgo = new Date()
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
      return sessionDate >= twoMonthsAgo && sessionDate < oneMonthAgo
    })
    
    const monthlyChange = thisMonth.length - lastMonth.length
    
    // Chart data (last 30 days)
    const chartData = generateChartData(completedSessions)
    
    setStats({
      totalWorkouts,
      totalMinutes: Math.round(totalMinutes / 60), // Convert to hours
      weeklyProgress: Math.min(weeklyProgress, 100),
      thisWeekWorkouts: thisWeek.length,
      currentStreak,
      monthlyChange,
      chartData
    })
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

  const generateChartData = (sessions) => {
    const last30Days = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]
      
      const dayWorkouts = sessions.filter(session => {
        const sessionDate = new Date(session.date).toISOString().split("T")[0]
        return sessionDate === dateStr
      }).length
      
      last30Days.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        workouts: dayWorkouts
      })
    }
    return last30Days
  }

  const achievements = [
    { title: "First Workout", description: "Complete your first session", unlocked: true },
    { title: "Week Warrior", description: "7-day workout streak", unlocked: stats?.currentStreak >= 7 },
    { title: "Month Master", description: "30-day streak", unlocked: stats?.currentStreak >= 30 },
    { title: "Century Club", description: "100 total workouts", unlocked: stats?.totalWorkouts >= 100 }
  ]

  useEffect(() => {
    loadProgressData()
  }, [])

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadProgressData} />
  if (!sessions.length) return (
    <Empty
      title="No workout data yet"
      description="Start your first workout to begin tracking your progress!"
      icon="TrendingUp"
      actionLabel="Start First Workout"
      action={() => window.location.href = "/workouts"}
    />
  )

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto">
      {/* Progress Overview */}
      <div className="text-center">
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">Your Progress</h1>
        <p className="text-gray-600">Keep crushing your fitness goals!</p>
      </div>

      {/* Weekly Goal Ring */}
      {stats && (
        <div className="flex justify-center">
          <ProgressRing
            percentage={stats.weeklyProgress}
            size={140}
            strokeWidth={10}
            label="Weekly Goal"
            value={`${stats.thisWeekWorkouts}/4`}
            color="primary"
          />
        </div>
      )}

      {/* Key Stats */}
      {stats && (
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            title="Total Workouts"
            value={stats.totalWorkouts}
            icon="Target"
            change={stats.monthlyChange > 0 ? `+${stats.monthlyChange} this month` : "Start your streak!"}
            changeType={stats.monthlyChange > 0 ? "positive" : "neutral"}
            gradient="from-secondary/10 to-blue-100"
          />
          <StatCard
            title="Hours Trained"
            value={stats.totalMinutes}
            icon="Clock"
            change="Keep it up!"
            changeType="positive"
            gradient="from-accent/20 to-yellow-100"
          />
          <StatCard
            title="Current Streak"
            value={`${stats.currentStreak} days`}
            icon="Flame"
            change={stats.currentStreak > 0 ? "On fire!" : "Start today!"}
            changeType={stats.currentStreak > 0 ? "positive" : "neutral"}
            gradient="from-primary/10 to-orange-100"
          />
          <StatCard
            title="This Week"
            value={stats.thisWeekWorkouts}
            icon="Calendar"
            change="This week"
            changeType="neutral"
            gradient="from-green-100 to-emerald-100"
          />
        </div>
      )}

      {/* Progress Chart */}
      {stats?.chartData && (
        <ProgressChart data={stats.chartData} title="30-Day Activity" />
      )}

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="Award" className="text-accent" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 ${
                  achievement.unlocked
                    ? "border-accent bg-gradient-to-r from-accent/10 to-yellow-100"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  achievement.unlocked
                    ? "bg-gradient-to-r from-accent to-yellow-400"
                    : "bg-gray-300"
                }`}>
                  <ApperIcon 
                    name={achievement.unlocked ? "Trophy" : "Lock"} 
                    className={`w-5 h-5 ${achievement.unlocked ? "text-gray-800" : "text-gray-500"}`}
                  />
                </div>
                <div className="flex-1">
                  <h4 className={`font-display font-semibold ${
                    achievement.unlocked ? "text-gray-900" : "text-gray-500"
                  }`}>
                    {achievement.title}
                  </h4>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
                {achievement.unlocked && (
                  <Badge variant="accent">Unlocked!</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Progress