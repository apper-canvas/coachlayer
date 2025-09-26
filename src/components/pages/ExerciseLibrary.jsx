import { useState, useEffect } from "react"
import SearchBar from "@/components/molecules/SearchBar"
import FilterButtons from "@/components/molecules/FilterButtons"
import ExerciseCard from "@/components/organisms/ExerciseCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { exerciseService } from "@/services/api/exerciseService"
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
      filtered = filtered.filter(exercise => 
        exercise.muscleGroups.includes(activeFilter)
      )
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(exercise =>
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.muscleGroups.some(muscle => 
          muscle.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        exercise.equipment.some(equip => 
          equip.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    setFilteredExercises(filtered)
  }, [exercises, activeFilter, searchTerm])

  const handleExerciseClick = (exercise) => {
    toast.info(`${exercise.name} - ${exercise.muscleGroups.join(", ")}`)
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
    </div>
  )
}

export default ExerciseLibrary