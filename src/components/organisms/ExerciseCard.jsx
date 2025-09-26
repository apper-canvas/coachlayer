import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const ExerciseCard = ({ exercise, onClick, className, ...props }) => {
  const getMuscleGroupColor = (muscleGroup) => {
    const colors = {
      "Chest": "primary",
      "Back": "secondary", 
      "Shoulders": "accent",
      "Arms": "success",
      "Legs": "destructive",
      "Core": "default"
    }
    return colors[muscleGroup] || "default"
  }

  return (
    <Card 
      className={cn(
        "cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden",
        className
      )} 
      onClick={() => onClick?.(exercise)}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-blue-100/30 opacity-50" />
      <CardHeader className="relative z-10 pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base leading-tight flex-1">{exercise.name}</CardTitle>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-blue-600 flex items-center justify-center ml-2">
            <ApperIcon name="Target" className="w-5 h-5 text-white" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative z-10 pt-0">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1">
            {exercise.muscleGroups.slice(0, 2).map((muscle) => (
              <Badge key={muscle} variant={getMuscleGroupColor(muscle)} className="text-xs">
                {muscle}
              </Badge>
            ))}
            {exercise.muscleGroups.length > 2 && (
              <Badge variant="default" className="text-xs">
                +{exercise.muscleGroups.length - 2}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <ApperIcon name="Wrench" size={12} />
              {exercise.equipment.slice(0, 1).join(", ")}
              {exercise.equipment.length > 1 && ` +${exercise.equipment.length - 1}`}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ExerciseCard