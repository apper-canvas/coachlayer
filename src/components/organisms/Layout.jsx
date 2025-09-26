import { Outlet } from "react-router-dom";
import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { AuthContext } from "@/App";
import ApperIcon from "@/components/ApperIcon";
import TabNavigation from "@/components/molecules/TabNavigation";
import Button from "@/components/atoms/Button";

const Layout = () => {
  const { logout } = useContext(AuthContext)
  const { user } = useSelector((state) => state.user)

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-surface shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center">
            <span className="text-white font-display font-bold text-sm">C</span>
          </div>
          <h1 className="text-xl font-display font-bold text-gray-900">Coach Pro</h1>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <span className="text-sm font-body text-gray-600">
              Welcome, {user.firstName || user.name || "User"}
            </span>
)}
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="flex items-center gap-2 text-blue-200 hover:text-white"
          >
            <ApperIcon name="LogOut" size={16} />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface shadow-2xl border-t border-gray-200">
        <div className="max-w-md mx-auto">
          <TabNavigation />
        </div>
      </div>
    </div>
  )
}

export default Layout