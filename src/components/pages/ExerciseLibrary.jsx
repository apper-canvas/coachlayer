import { useState, useEffect } from "react"
import SearchBar from "@/components/molecules/SearchBar"
import FilterButtons from "@/components/molecules/FilterButtons"
import ExerciseCard from "@/components/organisms/ExerciseCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card"
import { exerciseService } from "@/services/api/exerciseService"
import { aiService } from "@/services/api/aiService"
import { toast } from "react-toastify"
const ExerciseLibrary = () => {
  const [exercises, setExercises] = useState([])
  const [filteredExercises, setFilteredExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState("All")

  const muscleFilters = [
    { label: "All", value: "All" },
    { label: "Chest", value: "Chest" },
    { label: "Back", value: "Back" },
    { label: "Shoulders", value: "Shoulders" },
    { label: "Arms", value: "Arms" },
    { label: "Legs", value: "Legs" },
    { label: "Core", value: "Core" }
  ]

  const loadExercises = async () => {
    try {
      setError("")
      setLoading(true)
      const data = await exerciseService.getAll()
      setExercises(data)
      setFilteredExercises(data)
    } catch (err) {
      setError(err.message || "Failed to load exercises")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadExercises()
  }, [])

  useEffect(() => {
    let filtered = exercises

    // Apply muscle group filter
if (activeFilter !== "All") {
      filtered = filtered.filter(exercise => {
        const muscleGroups = exercise.muscle_groups_c?.split(",").map(m => m.trim()) || exercise.muscleGroups || []
        return muscleGroups.includes(activeFilter)
      })
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(exercise => {
        const name = exercise.name_c || exercise.name || ""
        const muscleGroups = exercise.muscle_groups_c?.split(",").map(m => m.trim()) || exercise.muscleGroups || []
        const equipment = exercise.equipment_c?.split(",").map(e => e.trim()) || exercise.equipment || []
        
        return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               muscleGroups.some(muscle => 
                 muscle.toLowerCase().includes(searchTerm.toLowerCase())
               ) ||
               equipment.some(equip => 
                 equip.toLowerCase().includes(searchTerm.toLowerCase())
               )
      })
    }

    setFilteredExercises(filtered)
  }, [exercises, activeFilter, searchTerm])

const [selectedExercise, setSelectedExercise] = useState(null)
  const [aiEnhancement, setAiEnhancement] = useState("")
  const [aiLoading, setAiLoading] = useState(false)

  const handleExerciseClick = async (exercise) => {
    const name = exercise.name_c || exercise.name || "Exercise"
    const muscleGroups = exercise.muscle_groups_c?.split(",").map(m => m.trim()) || exercise.muscleGroups || []
    
    setSelectedExercise(exercise)
    setAiLoading(true)
    setAiEnhancement("")
    
    try {
      const result = await aiService.getExerciseEnhancement(exercise)
      if (result.success) {
        setAiEnhancement(result.enhancement)
        toast.success(`AI enhanced instructions for ${name}`)
      } else {
        toast.info(`${name} - ${muscleGroups.join(", ")}`)
      }
    } catch (error) {
      console.error('Failed to get AI enhancement:', error)
      toast.info(`${name} - ${muscleGroups.join(", ")}`)
    } finally {
      setAiLoading(false)
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadExercises} />

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-2xl font-display font-bold text-gray-900">Exercise Library</h1>
        
        {/* Search */}
        <SearchBar
          placeholder="Search exercises..."
          onSearch={setSearchTerm}
        />
        
        {/* Muscle Group Filters */}
        <FilterButtons
          filters={muscleFilters}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{filteredExercises.length} exercises found</span>
      </div>

      {/* Exercise Grid */}
      {filteredExercises.length === 0 ? (
        <Empty
          title="No exercises found"
          description="Try adjusting your search or filter criteria."
          icon="Search"
          actionLabel="Clear Filters"
          action={() => {
            setSearchTerm("")
            setActiveFilter("All")
          }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.Id}
              exercise={exercise}
              onClick={handleExerciseClick}
            />
          ))}
</div>
      )}

      {/* AI Enhancement Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50" onClick={() => setSelectedExercise(null)}>
          <div className="bg-white w-full max-w-md mx-auto rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-display font-bold text-lg text-gray-900">
                  {selectedExercise.name_c || selectedExercise.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {(selectedExercise.muscle_groups_c?.split(",").map(m => m.trim()) || selectedExercise.muscleGroups || []).join(", ")}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedExercise(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" size={20} />
              </Button>
            </div>

            {aiLoading ? (
              <div className="text-center py-8">
                <ApperIcon name="Bot" className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-pulse" />
                <p className="text-gray-600">AI Coach is analyzing this exercise...</p>
              </div>
            ) : aiEnhancement ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <ApperIcon name="Bot" className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">AI Enhanced Instructions</span>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {aiEnhancement}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {selectedExercise.instructions_c || selectedExercise.instructions || "Basic exercise instructions"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ExerciseLibrary