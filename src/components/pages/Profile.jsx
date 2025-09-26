import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card"
import StatCard from "@/components/molecules/StatCard"
import Badge from "@/components/atoms/Badge"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"
import { userService } from "@/services/api/userService"
import { workoutSessionService } from "@/services/api/workoutSessionService"
import { toast } from "react-toastify"

const Profile = () => {
  const [user, setUser] = useState(null)
  const [personalRecords, setPersonalRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({})

  const loadProfileData = async () => {
    try {
      setError("")
      setLoading(true)
      
      const [userData, sessionsData] = await Promise.all([
userService.getCurrentUser(),
        workoutSessionService.getAll()
      ])
      
      setUser(userData)
      setEditForm(userData)
      
      // Calculate personal records from workout sessions
      const records = calculatePersonalRecords(sessionsData)
      setPersonalRecords(records)
    } catch (err) {
      setError(err.message || "Failed to load profile data")
    } finally {
      setLoading(false)
    }
  }

  const calculatePersonalRecords = (sessions) => {
    const records = []
    const exerciseMaxes = {}
    
    sessions.forEach(session => {
      if (session.exercises && session.completed) {
        session.exercises.forEach(exercise => {
          const exerciseName = exercise.name || "Unknown Exercise"
          const weight = exercise.weight || 0
          const reps = exercise.reps || 0
          
          if (weight > 0 && reps > 0) {
            const oneRepMax = weight * (1 + reps / 30) // Brzycki formula approximation
            
            if (!exerciseMaxes[exerciseName] || oneRepMax > exerciseMaxes[exerciseName].max) {
              exerciseMaxes[exerciseName] = {
                max: oneRepMax,
                weight,
                reps,
                date: session.date
              }
            }
          }
        })
      }
    })
    
    // Convert to array format
    Object.entries(exerciseMaxes).forEach(([exercise, data]) => {
      records.push({
        exercise,
        weight: Math.round(data.weight),
        reps: data.reps,
        date: data.date,
        estimatedMax: Math.round(data.max)
      })
    })
    
    return records.sort((a, b) => b.estimatedMax - a.estimatedMax).slice(0, 5)
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
    if (!isEditing) {
      setEditForm({ ...user })
    }
  }

  const handleSaveProfile = async () => {
    try {
const updatedUser = await userService.update(user.Id, editForm)
      if (updatedUser) {
        setUser(updatedUser)
      }
      setIsEditing(false)
      toast.success("Profile updated successfully!")
    } catch (err) {
      toast.error("Failed to update profile")
    }
  }

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }))
  }

  const getFitnessLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case "beginner": return "success"
      case "intermediate": return "accent" 
      case "advanced": return "primary"
      default: return "default"
    }
  }

  useEffect(() => {
    loadProfileData()
  }, [])

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadProfileData} />
  if (!user) return <Error message="User profile not found" onRetry={loadProfileData} />

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto">
      {/* Profile Header */}
      <Card className="overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-blue-100/50 opacity-70" />
        <CardContent className="relative z-10 p-6 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center">
            <ApperIcon name="User" className="w-10 h-10 text-white" />
          </div>
          
          {isEditing ? (
            <div className="space-y-3">
              <Input
value={editForm.name_c || editForm.name || ""}
                onChange={(e) => handleInputChange("name_c", e.target.value)}
                placeholder="Your Name"
                className="text-center"
              />
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">
{user.name_c || user.name}
              </h2>
              <div className="flex items-center justify-center gap-2 mb-4">
<Badge variant={getFitnessLevelColor(user.fitness_level_c || user.fitnessLevel)}>
                  {user.fitness_level_c || user.fitnessLevel}
                </Badge>
<div className="text-sm text-gray-600">
                  Member since {new Date(user.join_date_c || user.joinDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-center gap-2">
            <Button
              onClick={isEditing ? handleSaveProfile : handleEditToggle}
              size="sm"
              variant={isEditing ? "primary" : "outline"}
              className="gap-2"
            >
              <ApperIcon name={isEditing ? "Save" : "Edit"} size={14} />
              {isEditing ? "Save" : "Edit Profile"}
            </Button>
            {isEditing && (
              <Button
                onClick={handleEditToggle}
                size="sm"
                variant="ghost"
                className="gap-2"
              >
                <ApperIcon name="X" size={14} />
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Fitness Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="Target" className="text-primary" />
            Fitness Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-3">
              <Input
value={(editForm.goals_c || editForm.goals || []).join(", ")}
                onChange={(e) => handleInputChange("goals_c", e.target.value.split(", ").filter(g => g))}
                placeholder="Enter your fitness goals (comma separated)"
              />
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
{(user.goals_c || user.goals || [])?.length > 0 ? (
                (user.goals_c || user.goals || []).map((goal, index) => (
                  <Badge key={index} variant="secondary">
                    {goal}
                  </Badge>
                ))
              ) : (
                <p className="text-gray-600 text-sm">No goals set yet. Set your goals to stay motivated!</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Personal Records */}
      {personalRecords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="Award" className="text-accent" />
              Personal Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {personalRecords.map((record, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-accent/10 to-yellow-100 rounded-xl">
                  <div className="flex-1">
                    <h4 className="font-display font-semibold text-gray-900">
                      {record.exercise}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {record.weight}lbs × {record.reps} reps
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(record.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-display font-bold text-primary">
                      {record.estimatedMax}
                    </div>
                    <div className="text-xs text-gray-600">Est. 1RM</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title="Fitness Level"
value={user.fitness_level_c || user.fitnessLevel}
          icon="TrendingUp"
          gradient="from-primary/10 to-orange-100"
        />
        <StatCard
          title="Member Since"
          value={new Date().getFullYear() - new Date(user.joinDate).getFullYear() + " yr"}
          icon="Calendar"
          gradient="from-secondary/10 to-blue-100"
        />
      </div>

      {/* App Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="Settings" className="text-gray-600" />
            App Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <ApperIcon name="Bell" size={20} />
            Workout Reminders
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <ApperIcon name="Download" size={20} />
            Export Data
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <ApperIcon name="HelpCircle" size={20} />
            Help & Support
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default Profile