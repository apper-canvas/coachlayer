import { useState } from "react"
import Input from "@/components/atoms/Input"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const SearchBar = ({ placeholder = "Search...", onSearch, className, ...props }) => {
  const [searchTerm, setSearchTerm] = useState("")

  const handleChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch(value)
  }

  return (
    <div className={cn("relative", className)} {...props}>
      <ApperIcon 
        name="Search" 
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
        size={20}
      />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
        className="pl-12 pr-4"
      />
    </div>
  )
}

export default SearchBar