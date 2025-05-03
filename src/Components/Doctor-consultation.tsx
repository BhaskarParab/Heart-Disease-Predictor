"use client"

import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  Avatar,
  Rating as MuiRating,
  Chip,
  CircularProgress,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Snackbar,
  Alert,
  TextareaAutosize,
  Stack,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  LocalHospital,
  LocationOn,
  Phone,
  CalendarMonth,
  VideoCall,
  Message,
  Star,
  Notifications as NotificationsIcon,
  CheckCircle,
  Warning,
  Info,
  Close,
} from "@mui/icons-material";
import { getMessaging, onMessage } from "firebase/messaging";
import { app } from "../firebase";

// Interface for Doctor data structure
interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  location: string;
  distance: string;
  rating: number;
  reviews: number;
  experience: string;
  availability: string[];
  image: string;
  phone: string;
}

// Interface for component props
interface DoctorConsultationProps {
  riskLevel: number;
  userLocation?: string;
  userId?: string;
}

// Interface for feedback data
interface FeedbackData {
  doctorId: string;
  rating: number;
  comments: string;
}

// Interface for notification data
interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "warning" | "info" | "error";
  read: boolean;
  timestamp: Date;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const DoctorConsultation: React.FC<DoctorConsultationProps> = ({
  riskLevel,
  userLocation = "Current Location",
  userId,
}) => {
  // State management
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState<{ [doctorId: string]: string | null }>({});
  const [feedbackTouched, setFeedbackTouched] = useState(false);

  const [feedback, setFeedback] = useState<FeedbackData>({
    doctorId: "",
    rating: 0,
    comments: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationMenuAnchor, setNotificationMenuAnchor] = useState<null | HTMLElement>(null);

  // Mock data for doctors
  const mockDoctors: Doctor[] = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      hospital: "Heart Care Medical Center",
      location: "123 Health St, Medical District",
      distance: "2.3 miles",
      rating: 4.8,
      reviews: 127,
      experience: "15 years",
      availability: ["Mon 10AM-4PM", "Wed 9AM-3PM", "Fri 11AM-5PM"],
      image: "https://api.dicebear.com/6.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4",
      phone: "+1 (555) 123-4567",
    },
    {
      id: "2",
      name: "Dr. Michael Chen",
      specialty: "Cardiologist",
      hospital: "University Medical Hospital",
      location: "456 University Ave, Downtown",
      distance: "3.7 miles",
      rating: 4.9,
      reviews: 203,
      experience: "20 years",
      availability: ["Tue 9AM-5PM", "Thu 10AM-6PM", "Sat 9AM-1PM"],
      image: "https://api.dicebear.com/6.x/avataaars/svg?seed=Michael&backgroundColor=c0aede",
      phone: "+1 (555) 987-6543",
    },
    {
      id: "3",
      name: "Dr. Emily Rodriguez",
      specialty: "Cardiologist",
      hospital: "Community Health Partners",
      location: "789 Wellness Blvd, Eastside",
      distance: "1.5 miles",
      rating: 4.7,
      reviews: 156,
      experience: "12 years",
      availability: ["Mon 1PM-7PM", "Wed 2PM-8PM", "Fri 9AM-3PM"],
      image: "https://api.dicebear.com/6.x/avataaars/svg?seed=Emily&backgroundColor=ffdfbf",
      phone: "+1 (555) 456-7890",
    },
    {
      id: "4",
      name: "Dr. James Wilson",
      specialty: "Cardiovascular Surgeon",
      hospital: "Advanced Cardiac Institute",
      location: "321 Specialist Circle, Medical District",
      distance: "4.2 miles",
      rating: 4.9,
      reviews: 189,
      experience: "18 years",
      availability: ["Tue 8AM-2PM", "Thu 9AM-3PM", "Fri 1PM-5PM"],
      image: "https://api.dicebear.com/6.x/avataaars/svg?seed=James&backgroundColor=d1d4f9",
      phone: "+1 (555) 789-0123",
    },
    {
      id: "5",
      name: "Dr. Olivia Thompson",
      specialty: "Preventive Cardiology",
      hospital: "Wellness Heart Center",
      location: "555 Prevention Way, Westside",
      distance: "3.1 miles",
      rating: 4.6,
      reviews: 142,
      experience: "10 years",
      availability: ["Mon 9AM-5PM", "Wed 10AM-6PM", "Thu 11AM-7PM"],
      image: "https://api.dicebear.com/6.x/avataaars/svg?seed=Olivia&backgroundColor=c6f6d5",
      phone: "+1 (555) 234-5678",
    },
  ];

  // Initialize Firebase Messaging
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const messaging = getMessaging(app);

      // Request notification permission
      const requestPermission = async () => {
        try {
          const permission = await Notification.requestPermission();
          if (permission === "granted") {
            console.log("Notification permission granted.");
          }
        } catch (error) {
          console.error("Error requesting notification permission:", error);
        }
      };

      requestPermission();

      // Listen for incoming messages
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log("Message received. ", payload);
        
        const notificationTitle = payload.notification?.title || "New Notification";
        const notificationBody = payload.notification?.body || "You have a new notification";
        
        // Add to local notifications
        addNotification({
          title: notificationTitle,
          message: notificationBody,
          type: "info",
        });

        // Show system notification if permitted
        if (Notification.permission === "granted") {
          new Notification(notificationTitle, {
            body: notificationBody,
            icon: "/icons/icon-192x192.png",
          });
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, []);

  // Simulate fetching doctors data
  useEffect(() => {
    const fetchDoctors = async () => {
      setTimeout(() => {
        setDoctors(mockDoctors);
        setLoading(false);
      }, 1500);
    };

    fetchDoctors();
  },);

  // Filter doctors based on search term and specialty
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialty = selectedSpecialty ? doctor.specialty === selectedSpecialty : true;

    return matchesSearch && matchesSpecialty;
  });

  // Get unique specialties for filtering
  const specialties = Array.from(new Set(doctors.map((doctor) => doctor.specialty)));

  /**
   * Adds a new notification to the notifications array
   * @param notification - The notification to add
   */
  const addNotification = (notification: {
    title: string;
    message: string;
    type: "success" | "warning" | "info" | "error";
    action?: {
      label: string;
      onClick: () => void;
    };
  }) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      title: notification.title,
      message: notification.message,
      type: notification.type,
      read: false,
      timestamp: new Date(),
      action: notification.action,
    };

    setNotifications((prev) => [newNotification, ...prev]);
  };

  /**
   * Marks a specific notification as read
   * @param id - The ID of the notification to mark as read
   */
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  /**
   * Marks all notifications as read
   */
  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  /**
   * Handles click on a notification
   * @param notification - The notification that was clicked
   */
  const handleNotificationClick = (notification: Notification) => {
    markNotificationAsRead(notification.id);
    if (notification.action) {
      notification.action.onClick();
    }
    setNotificationMenuAnchor(null);
  };

  /**
   * Handles booking an appointment
   */
  const handleBookAppointment = () => {
    if (!selectedSlots) {
      setSnackbar({
        open: true,
        message: "Please select an available slot.",
        severity: "error",
      });
      return;
    }

    // Simulate booking process
    setTimeout(() => {
      const successMessage = `Appointment booked with ${selectedDoctor?.name} on ${selectedSlot}.`;
      
      // Add notification
      addNotification({
        title: "Appointment Confirmed",
        message: successMessage,
        type: "success",
        action: {
          label: "View Details",
          onClick: () => {
            console.log("View appointment details");
          },
        },
      });

      setSnackbar({
        open: true,
        message: successMessage,
        severity: "success",
      });
      setIsDialogOpen(false);
      setSelectedSlot(null);
      setSelectedDoctor(null);
    }, 1000);
  };

  /**
   * Opens the feedback dialog for a specific doctor
   * @param doctor - The doctor to leave feedback for
   */
  const handleOpenFeedbackDialog = (doctor: Doctor) => {
    setFeedback({
      doctorId: doctor.id,
      rating: 0,
      comments: "",
    });
    setFeedbackTouched(false); // Reset touched state when reopening the dialog
    setIsFeedbackDialogOpen(true);
  };
  
  /**
   * Closes the feedback dialog
   */
  const handleCloseFeedbackDialog = () => {
    setIsFeedbackDialogOpen(false);
  };
  
  /**
   * Submits feedback for a doctor
   */
  const handleFeedbackSubmit = () => {
    setFeedbackTouched(true); // mark fields as touched to show validation
 
    if (feedback.rating <= 0 || feedback.comments.trim() === "") {
      // Inline error handling or notification can be added here
      return;
    }
  
    try {
      setTimeout(() => {
        // Update the doctor's rating (mock implementation)
        setDoctors((prevDoctors) =>
          prevDoctors.map((doctor) =>
            doctor.id === feedback.doctorId
              ? {
                  ...doctor,
                  rating:
                    (doctor.rating * doctor.reviews + feedback.rating) /
                    (doctor.reviews + 1),
                  reviews: doctor.reviews + 1,
                }
              : doctor
          )
        );
  
        // Add notification
        addNotification({
          title: "Feedback Submitted",
          message: "Thank you for your feedback!",
          type: "success",
        });
  
        setIsFeedbackDialogOpen(false);
      }, 1000);
    } catch (error) {
      // Optional: handle error here if needed
    }
  };
  
  /**
   * Handles rating change in feedback form
   */
  const handleRatingChange = (
    event: React.SyntheticEvent,
    newValue: number | null
  ) => {
    if (newValue !== null) {
      setFeedback((prev) => ({ ...prev, rating: newValue }));
    }
  };
  
  /**
   * Handles comments change in feedback form
   */
  const handleCommentsChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFeedback((prev) => ({ ...prev, comments: event.target.value }));
  };
  
  /**
   * Closes the snackbar
   */
  const handleCloseSnackbar = () => {
    // No snackbar to close anymore
  };
  

  // Calculate unread notifications
  const unreadNotifications = notifications.filter((n) => !n.read);

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2, backgroundColor: "#eef2fd" }}>
      {/* Notification Icon with Badge */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <IconButton
          color="inherit"
          onClick={(e) => setNotificationMenuAnchor(e.currentTarget)}
          sx={{ position: "relative" }}
        >
          <Badge badgeContent={unreadNotifications.length} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Box>

      {/* Notification Menu */}
      <Menu
        anchorEl={notificationMenuAnchor}
        open={Boolean(notificationMenuAnchor)}
        onClose={() => setNotificationMenuAnchor(null)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 500,
            overflow: "auto",
          },
        }}
      >
        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">Notifications</Typography>
          <Box>
            <Button
              size="small"
              onClick={markAllNotificationsAsRead}
              disabled={unreadNotifications.length === 0}
            >
              Mark all as read
            </Button>
            <IconButton
              size="small"
              onClick={() => setNotificationMenuAnchor(null)}
              sx={{ ml: 1 }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        <Divider />
        {notifications.length === 0 ? (
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              No notifications yet
            </Typography>
          </Box>
        ) : (
          notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              sx={{
                backgroundColor: notification.read ? "inherit" : "action.hover",
                borderLeft: `4px solid ${
                  notification.type === "success"
                    ? "#4caf50"
                    : notification.type === "warning"
                    ? "#ff9800"
                    : notification.type === "error"
                    ? "#f44336"
                    : "#2196f3"
                }`,
              }}
            >
              <ListItemIcon>
                {notification.type === "success" ? (
                  <CheckCircle color="success" />
                ) : notification.type === "warning" ? (
                  <Warning color="warning" />
                ) : notification.type === "error" ? (
                  <Warning color="error" />
                ) : (
                  <Info color="info" />
                )}
              </ListItemIcon>
              <ListItemText
                primary={notification.title}
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                      display="block"
                    >
                      {notification.message}
                    </Typography>
                    <Typography
                      component="span"
                      variant="caption"
                      color="text.secondary"
                    >
                      {new Date(notification.timestamp).toLocaleString()}
                    </Typography>
                  </>
                }
              />
            </MenuItem>
          ))
        )}
      </Menu>

      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "rgb(0, 123, 255)",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <LocalHospital /> Consult a Specialist
      </Typography>

      <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
        {riskLevel > 50
          ? "Based on your risk assessment, we recommend consulting with a cardiologist soon."
          : "Regular check-ups with a heart specialist are recommended for preventive care."}
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search by doctor name, hospital, or location"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <LocationOn sx={{ color: "text.secondary", mr: 1 }} />,
              }}
              sx={{ mb: { xs: 2, md: 0 } }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {specialties.map((specialty) => (
                <Chip
                  key={specialty}
                  label={specialty}
                  clickable
                  color={selectedSpecialty === specialty ? "primary" : "default"}
                  onClick={() => {
                    if (selectedSpecialty === specialty) {
                      setSelectedSpecialty(null);
                    } else {
                      setSelectedSpecialty(specialty);
                    }
                  }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredDoctors.map((doctor) => (
            <Grid item xs={12} key={doctor.id}>
              <Paper
                elevation={1}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  },
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={2} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Avatar src={doctor.image} alt={doctor.name} sx={{ width: 80, height: 80, mb: 1 }} />
                    <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                      <MuiRating value={doctor.rating} precision={0.1} size="small" readOnly />
                      <Typography variant="body2" sx={{ ml: 0.5 }}>
                        ({doctor.reviews})
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {doctor.experience} exp
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                      {doctor.name}
                    </Typography>
                    <Typography variant="body2" color="primary" sx={{ mb: 1 }}>
                      {doctor.specialty}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}>
                      <LocalHospital fontSize="small" color="action" />
                      {doctor.hospital}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}>
                      <LocationOn fontSize="small" color="action" />
                      {doctor.location} • {doctor.distance} from {userLocation}
                    </Typography>
                    <Typography variant="body2" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Phone fontSize="small" color="action" />
                      {doctor.phone}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={4}>
  <Typography variant="body2" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}>
    <CalendarMonth fontSize="small" color="primary" />
    <strong>Available slots:</strong>
  </Typography>
  <Box sx={{ mb: 2 }}>
    {doctor.availability.map((slot, index) => (
      <Chip
        key={index}
        label={slot}
        size="small"
        onClick={() => {
          setSelectedDoctor(doctor); // update selected doctor
          setSelectedSlots({ [doctor.id]: slot }); // reset all other selections
        }}
        sx={{
          mr: 0.5,
          mb: 0.5,
          cursor: "pointer",
          backgroundColor: selectedSlots[doctor.id] === slot ? "rgb(0, 123, 255)" : undefined,
          color: selectedSlots[doctor.id] === slot ? "#fff" : undefined,
        }}
      />
    ))}
  </Box>
  <Stack direction="column" spacing={1}>
    <Button
      variant="contained"
      startIcon={<CalendarMonth />}
      fullWidth
      onClick={() => {
        setSelectedDoctor(doctor);
        setIsDialogOpen(true);
      }}
      disabled={!selectedSlots[doctor.id]}
      sx={{
        borderRadius: 2,
        background: selectedSlots[doctor.id]
          ? "linear-gradient(45deg, rgb(0, 123, 255) 30%, rgb(0, 132, 255) 90%)"
          : "linear-gradient(45deg, rgb(255, 255, 255) 30%, rgb(255, 255, 255) 90%)",
        "&:hover": {
          background: selectedSlots[doctor.id]
            ? "linear-gradient(45deg, rgb(0, 89, 255) 30%, rgb(0, 81, 255) 90%)"
            : "linear-gradient(45deg, rgb(49, 135, 255) 30%, rgb(0, 106, 255) 90%)",
        },
      }}
    >
      Book Appointment
    </Button>
    <Button
      variant="outlined"
      startIcon={<Star />}
      fullWidth
      onClick={() => handleOpenFeedbackDialog(doctor)}
      sx={{
        borderRadius: 2,
      }}
    >
      Leave Feedback
    </Button>
  </Stack>
</Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Booking Confirmation Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Appointment</DialogTitle>
        <DialogContent>
          <Typography>
            You are booking an appointment with{" "}
            <strong>{selectedDoctor?.name}</strong> on{" "}
            <strong>{selectedDoctor ? selectedSlots[selectedDoctor.id] : ""}</strong>.
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            {selectedDoctor?.hospital}
          </Typography>
          <Typography variant="body2">
            {selectedDoctor?.location}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleBookAppointment}
            variant="contained"
            color="primary"
            sx={{
              borderRadius: 2,
              background: "linear-gradient(45deg,rgb(0, 115, 255) 30%,rgb(0, 76, 255) 90%)",
              "&:hover": {
                background: "linear-gradient(45deg,rgb(0, 110, 255) 30%,rgb(0, 72, 255) 90%)",
              },
            }}
          >
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>

      {/* // Feedback Dialog JSX */}
<Dialog open={isFeedbackDialogOpen} onClose={handleCloseFeedbackDialog} maxWidth="sm" fullWidth>
  <DialogTitle>Leave Feedback</DialogTitle>
  <DialogContent>
    <Box sx={{ mt: 2 }}>
      <Typography variant="body1" sx={{ mb: 1 }}>
        How would you rate your experience with this doctor?
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <MuiRating
          name="doctor-rating"
          value={feedback.rating}
          onChange={handleRatingChange}
          precision={0.5}
          size="large"
          emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
        />
        {feedbackTouched && feedback.rating === 0 && (
          <Typography variant="caption" color="error" sx={{ marginLeft: "12px", whiteSpace: "nowrap" }}>
            Please provide a rating.
          </Typography>
        )}
      </Box>
    </Box>

    <Box sx={{ mt: 3 }}>
      <Typography variant="body1" sx={{ mb: 1 }}>
        Additional comments (optional):
      </Typography>
      <TextareaAutosize
        minRows={4}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "4px",
          border: "1px solid rgba(0, 0, 0, 0.23)",
          fontFamily: "inherit",
          fontSize: "0.875rem",
        }}
        value={feedback.comments}
        onChange={handleCommentsChange}
        placeholder="Share your experience with this doctor..."
      />
      {feedbackTouched && feedback.comments.trim() === "" && (
        <Typography variant="caption" color="error">
          Please leave a comment before submitting.
        </Typography>
      )}
    </Box>
  </DialogContent>

  <DialogActions>
    <Button onClick={handleCloseFeedbackDialog} color="primary">
      Cancel
    </Button>
    <Button
      onClick={handleFeedbackSubmit}
      variant="contained"
      color="primary"
      sx={{
        borderRadius: 2,
        background:
          "linear-gradient(45deg,rgb(0, 115, 255) 30%,rgb(0, 76, 255) 90%)",
        "&:hover": {
          background:
            "linear-gradient(45deg,rgb(0, 110, 255) 30%,rgb(0, 72, 255) 90%)",
        },
      }}
    >
      Submit Feedback
    </Button>
  </DialogActions>
</Dialog>



      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Divider sx={{ my: 4 }} />
    </Paper>
  );
};

export default DoctorConsultation;