import { cn } from "@/utils/cn"
import Button from "@/components/atoms/Button"

const FilterButtons = ({ filters, activeFilter, onFilterChange, className, ...props }) => {
  return (
    <div className={cn("flex flex-wrap gap-2", className)} {...props}>
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={activeFilter === filter.value ? "primary" : "ghost"}
          size="sm"
          onClick={() => onFilterChange(filter.value)}
          className="text-sm"
        >
          {filter.label}
        </Button>
      ))}
    </div>
  )
}

export default FilterButtons