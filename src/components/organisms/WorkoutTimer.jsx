import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const WorkoutTimer = ({ 
  duration = 60, 
  onComplete, 
  autoStart = false,
  className,
  ...props 
}) => {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isActive, setIsActive] = useState(autoStart)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    let interval = null
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsActive(false)
            setIsCompleted(true)
            onComplete?.()
            return 0
          }
          return time - 1
        })
      }, 1000)
    } else if (!isActive && timeLeft !== 0) {
      clearInterval(interval)
    }
    
    return () => clearInterval(interval)
  }, [isActive, timeLeft, onComplete])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const progress = ((duration - timeLeft) / duration) * 100

  const handleStart = () => setIsActive(true)
  const handlePause = () => setIsActive(false)
  const handleReset = () => {
    setTimeLeft(duration)
    setIsActive(false)
    setIsCompleted(false)
  }

  return (
    <Card className={cn("overflow-hidden", className)} {...props}>
      <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-yellow-100/50 opacity-70" />
      <CardContent className="relative z-10 p-8 text-center">
        {/* Progress Ring */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="#E5E7EB"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="#FF6B35"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 50}`}
              strokeDashoffset={`${2 * Math.PI * 50 * (1 - progress / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={cn(
                "text-3xl font-display font-bold transition-colors duration-300",
                isCompleted ? "text-green-600" : timeLeft <= 10 && isActive ? "text-red-500" : "text-gray-900"
              )}>
                {formatTime(timeLeft)}
              </div>
              <div className="text-xs text-gray-600 font-body">
                {isCompleted ? "Complete!" : isActive ? "Active" : "Paused"}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          {!isActive && !isCompleted && (
            <Button onClick={handleStart} size="sm" className="gap-2">
              <ApperIcon name="Play" size={16} />
              Start
            </Button>
          )}
          {isActive && (
            <Button onClick={handlePause} variant="secondary" size="sm" className="gap-2">
              <ApperIcon name="Pause" size={16} />
              Pause
            </Button>
          )}
          <Button onClick={handleReset} variant="outline" size="sm" className="gap-2">
            <ApperIcon name="RotateCcw" size={16} />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default WorkoutTimer