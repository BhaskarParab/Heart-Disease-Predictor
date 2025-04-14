"use client"

import React, { useState } from "react"
import { Paper, Typography, Tabs, Tab, Grid, colors } from "@mui/material"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import DoctorConsultation from "./Doctor-consultation"
import HealthRecommendations from "./Health-recommendations"

interface HealthData {
  date: string
  cholesterol: number
  bloodPressure: number
  heartRate: number
  cp: number
  fbs: number
  restECG: number
  exang: number
  oldpeak: number
  slope: number
  ca: number
  thal: number
  riskLevel: number
}

interface DataVisualizationEnhancedProps {
  data: HealthData[]
}

const metricNames = {
  cholesterol: "Cholesterol",
  bloodPressure: "Blood Pressure",
  heartRate: "Heart Rate",
  cp: "Chest Pain",
  fbs: "Fasting Blood Sugar",
  restECG: "Resting ECG",
  exang: "Exercise Induced Angina",
  oldpeak: "ST Depression",
  slope: "Slope of ST Segment",
  ca: "Major Vessels",
  thal: "Thalassemia",
  riskLevel: "Risk Level",
}

interface DataVisualizationEnhancedProps {
  data: HealthData[];
  style?: React.CSSProperties; // Add style prop
}

const DataVisualizationEnhanced: React.FC<DataVisualizationEnhancedProps> = ({ data, style }) => {
  const [tabValue, setTabValue] = useState(0)
  const [featureTabValue, setFeatureTabValue] = useState(0)

  if (data.length === 0) {
    return <div>No data available</div>
  }

  const latestData = data[data.length - 1]

  const transformedData = Object.entries(latestData)
    .filter(([key]) => key !== "date")
    .map(([key, value]) => ({
      name: metricNames[key as keyof typeof metricNames],
      value: value as number,
    }))

  const getRiskColor = (value: number) => {
    if (value < 30) return colors.green[500]
    if (value < 60) return colors.orange[500]
    return colors.red[500]
  }

  const chartComponents = [
    <LineChart data={transformedData} key="line" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="value"
        stroke={colors.blue[500]}
        strokeWidth={2}
        animationDuration={1000}
        animationEasing="ease-in-out"
      />
    </LineChart>,
    <BarChart data={transformedData} key="bar" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="value" fill={colors.purple[500]} animationDuration={1000} animationEasing="ease-in-out" />
    </BarChart>,
    <AreaChart data={transformedData} key="area" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Area
        type="monotone"
        dataKey="value"
        fill={colors.teal[500]}
        stroke={colors.teal[500]}
        animationDuration={1000}
        animationEasing="ease-in-out"
      />
    </AreaChart>,
  ]

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }} style={style}> 
      <Typography variant="h6" gutterBottom>
        Health Parameters Overview
      </Typography>

      <Tabs value={featureTabValue} onChange={(_, newValue) => setFeatureTabValue(newValue)} sx={{ mb: 2 }}>
        <Tab label="Visualization" />
        <Tab label="Recommendations" />
        <Tab label="Find a Doctor" />
      </Tabs>

      {featureTabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ mb: 2 }}>
              <Tab label="Line Chart" />
              <Tab label="Bar Chart" />
              <Tab label="Area Chart" />
            </Tabs>

            <div style={{ height: "500px" }}>
              <ResponsiveContainer width="100%" height="100%">
                {chartComponents[tabValue]}
              </ResponsiveContainer>
            </div>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" gutterBottom>
              Latest Readings
            </Typography>
            <Paper
              sx={{
                p: 2,
                mb: 2,
                bgcolor: getRiskColor(latestData.riskLevel) + "22",
                transition: "background-color 0.5s ease-in-out",
              }}
            >
              <Typography variant="body2">{new Date(latestData.date).toLocaleDateString()}</Typography>
              <Grid container spacing={1}>
                {transformedData.map((metric, index) => (
                  <React.Fragment key={index}>
                    <Grid item xs={6}>
                      <Typography variant="caption">{metric.name}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography>
                        {metric.value}
                        {metric.name === "Cholesterol" && " mg/dL"}
                        {metric.name === "Blood Pressure" && " mmHg"}
                        {metric.name === "Heart Rate" && " bpm"}
                      </Typography>
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}

      {featureTabValue === 1 && (
        <HealthRecommendations
          healthData={{
            cholesterol: latestData.cholesterol,
            bloodPressure: latestData.bloodPressure,
            heartRate: latestData.heartRate,
            riskLevel: latestData.riskLevel,
          }}
        />
      )}

      {featureTabValue === 2 && <DoctorConsultation riskLevel={latestData.riskLevel} />}
    </Paper>
  )
}

export default DataVisualizationEnhanced

