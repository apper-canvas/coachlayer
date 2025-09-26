import { useState } from "react"
import Chart from "react-apexcharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card"
import FilterButtons from "@/components/molecules/FilterButtons"

const ProgressChart = ({ data, title = "Workout Progress", className, ...props }) => {
  const [timeframe, setTimeframe] = useState("week")

  const timeframes = [
    { label: "Week", value: "week" },
    { label: "Month", value: "month" },
    { label: "Year", value: "year" }
  ]

  const getFilteredData = () => {
    switch (timeframe) {
      case "week":
        return data.slice(-7)
      case "month":
        return data.slice(-30)
      case "year":
        return data
      default:
        return data
    }
  }

  const filteredData = getFilteredData()

  const chartOptions = {
    chart: {
      type: "area",
      height: 300,
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    colors: ["#FF6B35", "#004E89"],
    stroke: {
      curve: "smooth",
      width: 3
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 100]
      }
    },
    grid: {
      show: true,
      strokeDashArray: 3,
      borderColor: "#e5e7eb"
    },
    xaxis: {
      categories: filteredData.map(item => item.date),
      labels: {
        style: {
          colors: "#6b7280",
          fontSize: "12px",
          fontFamily: "Inter"
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: "#6b7280",
          fontSize: "12px",
          fontFamily: "Inter"
        }
      }
    },
    tooltip: {
      theme: "light",
      style: {
        fontSize: "12px",
        fontFamily: "Inter"
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false
    }
  }

  const series = [
    {
      name: "Workouts Completed",
      data: filteredData.map(item => item.workouts)
    }
  ]

  return (
    <Card className={className} {...props}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <FilterButtons
            filters={timeframes}
            activeFilter={timeframe}
            onFilterChange={setTimeframe}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Chart
          options={chartOptions}
          series={series}
          type="area"
          height={300}
        />
      </CardContent>
    </Card>
  )
}

export default ProgressChart