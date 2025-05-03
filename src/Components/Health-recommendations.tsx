"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react"
import {
  Paper,
  Typography,
  Tabs,
  Tab,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Chip,
  CircularProgress,
  Button,
  alpha,
} from "@mui/material"
import jsPDF from "jspdf"
import { saveAs } from "file-saver"
import {
  Restaurant,
  DirectionsRun,
  Spa,
  ExpandMore,
  MonitorHeart,
  Check,
  Download,
  Warning,
  FavoriteBorder,
  Schedule,
  HealthAndSafety,
} from "@mui/icons-material"

interface HealthData {
  cholesterol: number
  bloodPressure: number
  heartRate: number
  riskLevel: number
}

interface HealthRecommendationsProps {
  healthData: HealthData
}

interface RecommendationSection {
  title: string
  items: string[]
}

interface MealPlan {
  title: string
  breakfast: string
  snack1: string
  lunch: string
  snack2: string
  dinner: string
  note: string
}

interface ExercisePlan {
  title: string
  monday: string
  tuesday: string
  wednesday: string
  thursday: string
  friday: string
  saturday: string
  sunday: string
  note: string
}

const HealthRecommendations: React.FC<HealthRecommendationsProps> = ({ healthData }) => {
  const [loading, setLoading] = useState(true)
  const [tabValue, setTabValue] = useState(0)

  // Validate and normalize health data
  const normalizedHealthData = useMemo(() => ({
    cholesterol: isNaN(healthData.cholesterol) ? 0 : Math.max(0, healthData.cholesterol),
    bloodPressure: isNaN(healthData.bloodPressure) ? 0 : Math.max(0, healthData.bloodPressure),
    heartRate: isNaN(healthData.heartRate) ? 0 : Math.max(0, healthData.heartRate),
    riskLevel: isNaN(healthData.riskLevel) ? 0 : Math.max(0, Math.min(100, healthData.riskLevel))
  }), [healthData])

  // Risk calculation
  const getRiskCategory = useCallback((): string => {
    if (normalizedHealthData.riskLevel < 30) return "Low"
    if (normalizedHealthData.riskLevel < 60) return "Moderate"
    return "High"
  }, [normalizedHealthData.riskLevel])

  // Health status calculations
  const isHighCholesterol = useMemo(
    () => normalizedHealthData.cholesterol > 200,
    [normalizedHealthData.cholesterol]
  )

  const isHighBloodPressure = useMemo(
    () => normalizedHealthData.bloodPressure > 130,
    [normalizedHealthData.bloodPressure]
  )

  const isHighHeartRate = useMemo(
    () => normalizedHealthData.heartRate > 100,
    [normalizedHealthData.heartRate]
  )

  const isLowHeartRate = useMemo(
    () => normalizedHealthData.heartRate < 60,
    [normalizedHealthData.heartRate]
  )

  // Recommendation sections
  const dietRecommendations = useMemo<RecommendationSection[]>(() => [
    {
      title: "Heart-Healthy Foods to Include",
      items: [
        "Leafy green vegetables (spinach, kale, collard greens)",
        "Whole grains (brown rice, oatmeal, whole grain bread)",
        "Berries (strawberries, blueberries, raspberries)",
        "Fatty fish rich in omega-3s (salmon, mackerel, sardines)",
        "Nuts and seeds (walnuts, almonds, flaxseeds, chia seeds)",
        "Legumes (beans, lentils, chickpeas)",
        "Olive oil as primary cooking oil",
        "Avocados for healthy fats",
      ],
    },
    {
      title: "Foods to Limit or Avoid",
      items: [
        "Processed meats (bacon, sausage, hot dogs)",
        "Refined carbohydrates (white bread, pastries, sweets)",
        "Sugar-sweetened beverages",
        "Fried foods and fast food",
        "Full-fat dairy products",
        "Foods high in saturated and trans fats",
        ...(isHighCholesterol ? ["High-cholesterol foods (organ meats, egg yolks)"] : []),
        ...(isHighBloodPressure ? ["High-sodium foods (processed foods, canned soups)"] : []),
      ],
    },
    {
      title: "Meal Planning Tips",
      items: [
        "Aim for 4-5 servings of fruits and vegetables daily",
        "Include 2 servings of fish weekly",
        "Choose lean proteins (chicken, turkey, tofu)",
        "Opt for low-fat or fat-free dairy products",
        "Use herbs and spices instead of salt for flavoring",
        "Practice portion control using the plate method",
        "Stay hydrated with water instead of sugary drinks",
        "Consider the DASH or Mediterranean diet approach",
      ],
    },
  ], [isHighCholesterol, isHighBloodPressure])

  const exerciseRecommendations = useMemo<RecommendationSection[]>(() => [
    {
      title: "Cardiovascular Exercise",
      items: [
        "Aim for 150 minutes of moderate-intensity aerobic activity weekly",
        "Try brisk walking, swimming, cycling, or dancing",
        "Start with 10-minute sessions if you're new to exercise",
        "Gradually increase duration and intensity",
        "Monitor your heart rate during exercise",
        "Include interval training for improved cardiovascular fitness",
        "Consider activities you enjoy to maintain consistency",
        "Exercise with a friend or group for motivation",
      ],
    },
    {
      title: "Strength Training",
      items: [
        "Include strength training 2-3 times per week",
        "Focus on major muscle groups (legs, hips, back, chest, abdomen, shoulders, arms)",
        "Start with light weights and proper form",
        "Aim for 8-12 repetitions per exercise",
        "Allow 48 hours of recovery between strength sessions for the same muscle group",
        "Consider bodyweight exercises if you're new to strength training",
        "Incorporate resistance bands for variety",
        "Consult with a fitness professional for a personalized program",
      ],
    },
    {
      title: "Flexibility & Balance",
      items: [
        "Include stretching exercises at least 2-3 times weekly",
        "Hold each stretch for 10-30 seconds",
        "Try yoga or tai chi for combined flexibility and balance benefits",
        "Incorporate balance exercises like standing on one foot",
        "Stretch after your muscles are warmed up",
        "Focus on major muscle-tendon groups",
        "Practice deep breathing during stretching",
        "Consider joining a yoga or stretching class",
      ],
    },
  ], [])

  const lifestyleRecommendations = useMemo<RecommendationSection[]>(() => [
    {
      title: "Stress Management",
      items: [
        "Practice mindfulness meditation for 10-15 minutes daily",
        "Try deep breathing exercises when feeling stressed",
        "Engage in activities you enjoy regularly",
        "Maintain social connections and support networks",
        "Consider journaling to process emotions",
        "Set realistic goals and priorities",
        "Learn to say no to excessive demands",
        "Seek professional help if stress becomes overwhelming",
      ],
    },
    {
      title: "Sleep Hygiene",
      items: [
        "Aim for 7-9 hours of quality sleep each night",
        "Maintain a consistent sleep schedule",
        "Create a relaxing bedtime routine",
        "Keep your bedroom cool, dark, and quiet",
        "Limit screen time before bed",
        "Avoid caffeine and large meals before bedtime",
        "Exercise regularly, but not close to bedtime",
        "Consider relaxation techniques if you have trouble falling asleep",
      ],
    },
    {
      title: "Habits to Modify",
      items: [
        "Quit smoking and avoid secondhand smoke",
        "Limit alcohol consumption",
        "Reduce caffeine intake if excessive",
        "Manage and monitor your blood pressure regularly",
        "Take medications as prescribed",
        "Schedule regular check-ups with your healthcare provider",
        "Monitor your heart health with home devices if recommended",
        "Join support groups for lifestyle changes if needed",
      ],
    },
  ], [])

  // Meal plan generator
  const getMealPlan = useCallback((): MealPlan => {
    const riskCategory = getRiskCategory()
    switch(riskCategory) {
      case "High":
        return {
          title: "Strict Heart-Healthy Meal Plan",
          breakfast: "Oatmeal with berries, ground flaxseed, and cinnamon (no added sugar)",
          snack1: "Apple slices with 1 tablespoon natural almond butter",
          lunch: "Quinoa bowl with mixed vegetables, chickpeas, and olive oil dressing",
          snack2: "Small handful of unsalted nuts and seeds mix",
          dinner: "Baked salmon with steamed broccoli and brown rice",
          note: "Focus on very low sodium, low saturated fat, and high fiber foods. Avoid processed foods completely.",
        }
      case "Moderate":
        return {
          title: "Balanced Heart-Healthy Meal Plan",
          breakfast: "Whole grain toast with avocado and poached egg",
          snack1: "Greek yogurt with berries",
          lunch: "Mediterranean salad with grilled chicken, olive oil and lemon dressing",
          snack2: "Hummus with vegetable sticks",
          dinner: "Grilled fish with roasted vegetables and quinoa",
          note: "Moderate sodium intake, focus on lean proteins and whole foods.",
        }
      default:
        return {
          title: "Preventive Heart-Healthy Meal Plan",
          breakfast: "Smoothie with spinach, banana, berries, and plant-based protein",
          snack1: "Small handful of mixed nuts",
          lunch: "Whole grain wrap with turkey, avocado, and vegetables",
          snack2: "Cottage cheese with fruit",
          dinner: "Stir-fried vegetables with tofu and brown rice",
          note: "Focus on variety and moderation while maintaining heart-healthy principles.",
        }
    }
  }, [getRiskCategory])

  // Exercise plan generator
  const getExercisePlan = useCallback((): ExercisePlan => {
    const riskCategory = getRiskCategory()
    switch(riskCategory) {
      case "High":
        return {
          title: "Carefully Monitored Exercise Plan",
          monday: "15-20 min slow walking, light stretching",
          tuesday: "Rest day with gentle stretching",
          wednesday: "15-20 min recumbent bike, light resistance bands",
          thursday: "Rest day with gentle stretching",
          friday: "15-20 min slow walking, light stretching",
          saturday: "10-15 min seated exercises, deep breathing",
          sunday: "Complete rest day",
          note: "Always consult your doctor before starting. Monitor heart rate closely and stop if you feel any discomfort.",
        }
      case "Moderate":
        return {
          title: "Moderate Exercise Plan",
          monday: "30 min brisk walking, light strength training",
          tuesday: "20 min cycling, flexibility exercises",
          wednesday: "Rest day or gentle yoga",
          thursday: "30 min swimming or water aerobics",
          friday: "30 min brisk walking, light strength training",
          saturday: "Active recreation (gardening, dancing, etc.)",
          sunday: "Rest day with stretching",
          note: "Aim to gradually increase duration. Keep intensity moderate and monitor how you feel.",
        }
      default:
        return {
          title: "Preventive Exercise Plan",
          monday: "30-45 min cardio (running, cycling), strength training",
          tuesday: "30 min HIIT workout, flexibility training",
          wednesday: "45-60 min cardio (swimming, rowing), core exercises",
          thursday: "Rest day or yoga/pilates",
          friday: "30-45 min cardio, strength training",
          saturday: "60 min active recreation or sports",
          sunday: "Active recovery (walking, light cycling)",
          note: "Mix up activities to work different muscle groups and maintain interest.",
        }
    }
  }, [getRiskCategory])

  // PDF generation
  const generatePDF = useCallback(() => {
    const doc = new jsPDF()
    const mealPlan = getMealPlan()
    const exercisePlan = getExercisePlan()

    // PDF styling constants
    const TITLE_COLOR = "#4F46E5"
    const TEXT_COLOR = "#374151"
    const LINE_HEIGHT = 7
    const LEFT_MARGIN = 20

    let yPos = 15

    // Header
    doc.setFontSize(18)
    doc.setTextColor(TITLE_COLOR)
    doc.text("Personalized Health Plan", LEFT_MARGIN, yPos)
    yPos += LINE_HEIGHT * 2

    // Health Metrics
    doc.setFontSize(14)
    doc.text("Your Health Metrics", LEFT_MARGIN, yPos)
    yPos += LINE_HEIGHT
    doc.setFontSize(12)
    doc.setTextColor(TEXT_COLOR)

    const metrics = [
      `Cholesterol: ${normalizedHealthData.cholesterol} mg/dL (${isHighCholesterol ? "High" : "Normal"})`,
      `Blood Pressure: ${normalizedHealthData.bloodPressure}/85 mmHg (${isHighBloodPressure ? "High" : "Normal"})`,
      `Heart Rate: ${normalizedHealthData.heartRate} BPM (${isHighHeartRate ? "High" : isLowHeartRate ? "Low" : "Normal"})`,
      `Risk Level: ${normalizedHealthData.riskLevel}% (${getRiskCategory()})`
    ]

    metrics.forEach(metric => {
      doc.text(metric, LEFT_MARGIN, yPos)
      yPos += LINE_HEIGHT
    })

    yPos += LINE_HEIGHT

    // Meal Plan Section
    doc.setFontSize(14)
    doc.text("Meal Plan", LEFT_MARGIN, yPos)
    yPos += LINE_HEIGHT
    doc.setFontSize(12)
    doc.setTextColor(TEXT_COLOR)

    Object.entries(mealPlan).forEach(([key, value]) => {
      if (["title", "note"].includes(key)) return
      const text = `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`
      doc.splitTextToSize(text, 170).forEach((line: string) => {
        doc.text(line, LEFT_MARGIN, yPos)
        yPos += LINE_HEIGHT
      })
    })

    // Meal Plan Note
    doc.text(`Note: ${mealPlan.note}`, LEFT_MARGIN, yPos + LINE_HEIGHT)
    
    // Exercise Plan Section
    doc.addPage()
    yPos = 15
    doc.setFontSize(14)
    doc.setTextColor(TITLE_COLOR)
    doc.text("Exercise Plan", LEFT_MARGIN, yPos)
    yPos += LINE_HEIGHT * 2
    doc.setFontSize(12)
    doc.setTextColor(TEXT_COLOR)

    Object.entries(exercisePlan).forEach(([key, value]) => {
      if (["title", "note"].includes(key)) return
      const text = `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`
      doc.splitTextToSize(text, 170).forEach((line: string) => {
        doc.text(line, LEFT_MARGIN, yPos)
        yPos += LINE_HEIGHT
      })
    })

    // Exercise Plan Note
    doc.text(`Note: ${exercisePlan.note}`, LEFT_MARGIN, yPos + LINE_HEIGHT)

    doc.save("health-plan.pdf")
  }, [getMealPlan, getExercisePlan, normalizedHealthData, isHighCholesterol, isHighBloodPressure, isHighHeartRate, isLowHeartRate, getRiskCategory])

  // Calendar reminders
  const generateReminders = useCallback(() => {
    const getIcsDate = (date: Date, hours = 0, minutes = 0) => {
      const pad = (n: number) => n.toString().padStart(2, "0")
      return [
        date.getFullYear(),
        pad(date.getMonth() + 1),
        pad(date.getDate()),
        "T",
        pad(hours),
        pad(minutes),
        "00"
      ].join("")
    }

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Health App//EN",
      "BEGIN:VEVENT",
      "SUMMARY:Follow Daily Meal Plan",
      "DESCRIPTION:Remember to follow your personalized meal plan for optimal heart health.",
      `DTSTART:${getIcsDate(new Date(), 8)}`,
      `DTEND:${getIcsDate(new Date(), 8, 30)}`,
      "RRULE:FREQ=DAILY;COUNT=7",
      "BEGIN:VALARM",
      "TRIGGER:-PT15M",
      "ACTION:DISPLAY",
      "DESCRIPTION:Meal Plan Reminder",
      "END:VALARM",
      "END:VEVENT",
      "BEGIN:VEVENT",
      "SUMMARY:Daily Exercise Session",
      "DESCRIPTION:Time for your scheduled physical activity. Refer to your exercise plan.",
      `DTSTART:${getIcsDate(new Date(), 18)}`,
      `DTEND:${getIcsDate(new Date(), 18, 30)}`,
      "RRULE:FREQ=DAILY;COUNT=7",
      "BEGIN:VALARM",
      "TRIGGER:-PT15M",
      "ACTION:DISPLAY",
      "DESCRIPTION:Exercise Reminder",
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n")

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" })
    saveAs(blob, "health-reminders.ics")
  }, [])

  // Loading state
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  // Risk indicator component
  const RiskIndicator = useCallback(({ risk }: { risk: string }) => (
    <Chip
      label={risk}
      sx={{
        bgcolor: (theme) => {
          if (risk === "High") return alpha(theme.palette.error.main, 0.1)
          if (risk === "Moderate") return alpha(theme.palette.warning.main, 0.1)
          return alpha(theme.palette.success.main, 0.1)
        },
        color: (theme) => {
          if (risk === "High") return theme.palette.error.main
          if (risk === "Moderate") return theme.palette.warning.main
          return theme.palette.success.main
        },
      }}
    />
  ), [])

  const HeartRateIndicator = useCallback(({ rate }: { rate: number }) => {
    if (rate === 0) return <RiskIndicator risk="Not provided" />
    if (rate < 60) return <RiskIndicator risk="Low" />
    if (rate > 100) return <RiskIndicator risk="High" />
    return <RiskIndicator risk="Normal" />
  }, [RiskIndicator])

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 400,
          p: 4,
        }}
      >
        <CircularProgress size={60} thickness={4} sx={{ color: "primary.main", mb: 2 }} />
        <Typography variant="h6" color="primary.main">
          Loading your personalized health recommendations...
        </Typography>
      </Box>
    )
  }

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 4, maxWidth: 1200, mx: "auto", backgroundColor: '#eef2ff' }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <HealthAndSafety sx={{ color: "primary.main", fontSize: 40 }} />
        <Typography variant="h4" component="h1" sx={{ color: "primary.main", fontWeight: "bold" }}>
          Personalized Health Recommendations
        </Typography>
      </Box>

      <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
        {getRiskCategory() === "High" && "Based on your risk assessment, we recommend significant lifestyle changes."}
        {getRiskCategory() === "Moderate" && "Your risk factors suggest benefits from moderate lifestyle adjustments."}
        {getRiskCategory() === "Low" && "Maintain heart health with these preventive measures."}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          {
            label: "Cholesterol",
            value: `${normalizedHealthData.cholesterol} mg/dL`,
            icon: <Warning sx={{ color: isHighCholesterol ? "error.main" : "success.main" }} />,
            status: <RiskIndicator risk={isHighCholesterol ? "High" : "Normal"} />,
            note: "<200 mg/dL optimal",
          },
          {
            label: "Blood Pressure",
            value: `${normalizedHealthData.bloodPressure}/85 mmHg`,
            icon: <FavoriteBorder sx={{ color: isHighBloodPressure ? "error.main" : "success.main" }} />,
            status: <RiskIndicator risk={isHighBloodPressure ? "High" : "Normal"} />,
            note: "<130/80 mmHg optimal",
          },
          {
            label: "Heart Rate",
            value: `${normalizedHealthData.heartRate} BPM`,
            icon: <MonitorHeart sx={{ 
              color: isHighHeartRate ? "error.main" : isLowHeartRate ? "warning.main" : "success.main" 
            }} />,
            status: <HeartRateIndicator rate={normalizedHealthData.heartRate} />,
            note: "60-100 BPM normal",
          },
          {
            label: "Risk Level",
            value: `${normalizedHealthData.riskLevel}%`,
            icon: <Schedule sx={{ 
              color: getRiskCategory() === "High" ? "error.main" : 
                     getRiskCategory() === "Moderate" ? "warning.main" : "success.main" 
            }} />,
            status: <RiskIndicator risk={getRiskCategory()} />,
            note: `${getRiskCategory()} risk category`,
          },
        ].map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper sx={{ p: 3, height: "100%", borderRadius: 6 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Box
                  sx={{
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                    p: 1,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {metric.icon}
                </Box>
                {metric.status}
              </Box>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {metric.label}
              </Typography>
              <Typography variant="h4" sx={{ my: 1 }}>
                {metric.value}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {metric.note}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          variant="fullWidth"
          sx={{
            "& .MuiTabs-indicator": { height: 4 },
            "& .MuiTab-root": { py: 3, minHeight: "auto" },
          }}
        >
          <Tab label="Diet Plan" icon={<Restaurant />} iconPosition="start" />
          <Tab label="Exercise" icon={<DirectionsRun />} iconPosition="start" />
          <Tab label="Lifestyle" icon={<Spa />} iconPosition="start" />
          <Tab label="Action Plan" icon={<Download />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* Diet Panel */}
      <Box sx={{ pt: 4 }} hidden={tabValue !== 0}>
        {dietRecommendations.map((section, index) => (
          <Accordion key={index} defaultExpanded={index === 0} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {section.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                {section.items.map((item, i) => (
                  <ListItem key={i} sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Check color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Exercise Panel */}
      <Box sx={{ pt: 4 }} hidden={tabValue !== 1}>
        {exerciseRecommendations.map((section, index) => (
          <Accordion key={index} defaultExpanded={index === 0} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {section.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                {section.items.map((item, i) => (
                  <ListItem key={i} sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Check color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Lifestyle Panel */}
      <Box sx={{ pt: 4 }} hidden={tabValue !== 2}>
        {lifestyleRecommendations.map((section, index) => (
          <Accordion key={index} defaultExpanded={index === 0} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {section.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                {section.items.map((item, i) => (
                  <ListItem key={i} sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Check color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Action Plan Panel */}
      <Box sx={{ pt: 4 }} hidden={tabValue !== 3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: "100%", borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                <Restaurant /> Weekly Meal Plan
              </Typography>
              <List>
                {Object.entries(getMealPlan()).map(([key, value]) =>
                  key !== "title" && key !== "note" ? (
                    <ListItem key={key} sx={{ px: 0 }}>
                      <ListItemText
                        primary={key.charAt(0).toUpperCase() + key.slice(1)}
                        secondary={value as string}
                        primaryTypographyProps={{ fontWeight: "medium" }}
                      />
                    </ListItem>
                  ) : null
                )}
              </List>
              <Typography variant="body2" sx={{ mt: 2, fontStyle: "italic", color: "text.secondary" }}>
                {getMealPlan().note}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: "100%", borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                <DirectionsRun /> Exercise Schedule
              </Typography>
              <List>
                {Object.entries(getExercisePlan()).map(([key, value]) =>
                  key !== "title" && key !== "note" ? (
                    <ListItem key={key} sx={{ px: 0 }}>
                      <ListItemText
                        primary={key.charAt(0).toUpperCase() + key.slice(1)}
                        secondary={value as string}
                        primaryTypographyProps={{ fontWeight: "medium" }}
                      />
                    </ListItem>
                  ) : null
                )}
              </List>
              <Typography variant="body2" sx={{ mt: 2, fontStyle: "italic", color: "text.secondary" }}>
                {getExercisePlan().note}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            Track Your Progress
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: "text.secondary" }}>
            Monitor your health metrics regularly and adjust your plans as needed
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={generatePDF}
                sx={{
                  borderRadius: 2,
                  background: "linear-gradient(45deg,rgb(0, 115, 255) 30%,rgb(0, 60, 255) 90%)",
                  "&:hover": {
                    background: "linear-gradient(45deg,rgb(0, 89, 255) 30%,rgb(0, 64, 255) 90%)",
                  },
                }}
              >
                Download Full Plan
              </Button>
              {/* <Button
                variant="outlined"
                color="primary"
                onClick={generateReminders}
                sx={{ borderRadius: 2, ml: 2 }}
              >
                Set Reminders
              </Button> */}
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Paper>
  )
}

export default HealthRecommendations