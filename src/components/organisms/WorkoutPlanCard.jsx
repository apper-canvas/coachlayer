import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const WorkoutPlanCard = ({ plan, className, ...props }) => {
  const navigate = useNavigate()

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "beginner": return "success"
      case "intermediate": return "accent"
      case "advanced": return "destructive"
      default: return "default"
    }
  }

  const handleStartWorkout = () => {
    navigate(`/workout/${plan.Id}`)
  }

  return (
    <Card className={cn("overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105", className)} {...props}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-orange-100/30 opacity-50" />
      <CardHeader className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
<CardTitle className="text-lg mb-2">{plan.name_c || plan.name}</CardTitle>
            <p className="text-sm text-gray-600 mb-3">{plan.description_c || plan.description}</p>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant={getDifficultyColor(plan.difficulty_c || plan.difficulty)}>
                {plan.difficulty_c || plan.difficulty}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <ApperIcon name="Clock" size={14} />
                {plan.duration_c || plan.duration} min
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <ApperIcon name="Target" size={14} />
                {plan.exercises_c?.split(",").length || plan.exercises?.length || 0} exercises
              </div>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center">
            <ApperIcon name="Dumbbell" className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative z-10 pt-0">
        <Button onClick={handleStartWorkout} className="w-full gap-2">
          <ApperIcon name="Play" size={16} />
          Start Workout
        </Button>
      </CardContent>
    </Card>
  )
}

export default WorkoutPlanCard