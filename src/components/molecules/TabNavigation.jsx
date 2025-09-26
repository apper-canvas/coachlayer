import { NavLink } from "react-router-dom"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const TabNavigation = ({ tabs = [
  { path: "/", icon: "Dumbbell", label: "Workouts" },
  { path: "/exercise-library", icon: "Library", label: "Library" },
  { path: "/progress", icon: "TrendingUp", label: "Progress" },
  { path: "/profile", icon: "User", label: "Profile" }
], className, ...props }) => {
  return (
    <nav className={cn("flex justify-around items-center bg-surface border-t border-gray-200 px-2 py-1", className)} {...props}>
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center px-4 py-3 rounded-xl transition-all duration-200 min-w-[80px]",
              isActive
                ? "bg-gradient-to-br from-primary/20 to-orange-100 text-primary"
                : "text-gray-600 hover:text-primary hover:bg-gradient-to-br hover:from-primary/5 hover:to-orange-50"
            )
          }
        >
          <ApperIcon name={tab.icon} size={20} className="mb-1" />
          <span className="text-xs font-body font-medium">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default TabNavigation