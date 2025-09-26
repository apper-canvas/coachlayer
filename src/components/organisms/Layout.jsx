import { Outlet } from "react-router-dom"
import TabNavigation from "@/components/molecules/TabNavigation"
import ApperIcon from "@/components/ApperIcon"

const Layout = () => {
  const tabs = [
    { path: "/workouts", label: "Workouts", icon: "Dumbbell" },
    { path: "/exercises", label: "Library", icon: "BookOpen" },
    { path: "/progress", label: "Progress", icon: "TrendingUp" },
    { path: "/profile", label: "Profile", icon: "User" }
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-secondary to-blue-700 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center">
              <ApperIcon name="Zap" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold">Coach Pro</h1>
              <p className="text-sm text-blue-200">Ready to train?</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-yellow-400 flex items-center justify-center">
            <ApperIcon name="User" className="w-4 h-4 text-gray-800" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface shadow-2xl border-t border-gray-200">
        <div className="max-w-md mx-auto">
          <TabNavigation tabs={tabs} />
        </div>
      </div>
    </div>
  )
}

export default Layout