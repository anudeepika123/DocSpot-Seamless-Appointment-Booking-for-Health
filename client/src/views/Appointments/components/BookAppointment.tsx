// React Imports
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// Redux
import {
  useBookedAppointmentsQuery,
  useCheckBookingAvailabilityMutation,
  useGetDoctorQuery,
} from "../../../redux/api/doctorSlice";
// Utils
import {
  add30Minutes,
  convertToAMPMFormat,
  formatDate,
  formatTime,
  onKeyDown,
  thousandSeparatorNumber,
} from "../../../utils";
// React Icons
import { RiLuggageDepositLine } from "react-icons/ri";
import { MdOutlineExplicit } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { CiMoneyCheck1 } from "react-icons/ci";
import { IoMdTime } from "react-icons/io";
// Formik
import { Form, Formik, FormikProps } from "formik";
// Yup
import * as Yup from "yup";
// MUI Imports
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Box, Grid, Divider, Button, TextField } from "@mui/material";
// Custom Imports
import DatePicker from "../../../components/DatePicker";
import Navbar from "../../../components/Navbar";
import { Heading, SubHeading } from "../../../components/Heading";
import OverlayLoader from "../../../components/Spinner/OverlayLoader";
import useTypedSelector from "../../../hooks/useTypedSelector";
import { selectedUserId, userIsDoctor } from "../../../redux/auth/authSlice";
import {
  useBookAppointmentMutation,
  useGetUserQuery,
} from "../../../redux/api/userSlice";
import ToastAlert from "../../../components/ToastAlert/ToastAlert";

const AppointmentSchema = Yup.object().shape({
  date: Yup.string().required("Date is required"),
  time: Yup.string().required("Time is required"),
});

interface AppointmentForm {
  date: string | null;
  time: string | null;
}

const BookAppointment = () => {
  const navigate = useNavigate();
  // Doctor Id  ===> userId
  const { userId } = useParams();
  const loginUserId = useTypedSelector(selectedUserId);
  const isDoctor = useTypedSelector(userIsDoctor);
  const [isAvailable, setIsAvailable] = useState(false);
  const [appointment, setAppointment] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [formValues, setFormValues] = useState<AppointmentForm>({
    date: null,
    time: null,
  });

  const [toast, setToast] = useState({
    message: "",
    appearence: false,
    type: "",
  });

  const handleCloseToast = () => {
    setToast({ ...toast, appearence: false });
  };

  // Doctor Get API
  const { data, isLoading } = useGetDoctorQuery({
    userId,
  });

  // User Get API
  const { data: logedInUserData, isLoading: logedInUserLoading } =
    useGetUserQuery({
      userId: loginUserId,
    });

  // Get Booked Slots API
  const { data: getAppointmentData, isLoading: getAppointmentLoading } =
    useBookedAppointmentsQuery({ userId });

  const [bookAppointment, { isLoading: appointmentLoading }] =
    useBookAppointmentMutation();

  const [checkBookingAvailability, { isLoading: checkBookingLoading }] =
    useCheckBookingAvailabilityMutation();

  const appointmentHandler = async (appointmentData: AppointmentForm) => {
    if (appointment === "checkAvailability") {
      const payload = {
        doctorId: userId,
        date: appointmentData.date,
        time: appointmentData.time,
      };
      const doctorAvailability: any = await checkBookingAvailability(payload);

      if (doctorAvailability?.data?.status) {
        setIsAvailable(true);
        setToast({
          ...toast,
          message: doctorAvailability?.data?.message,
          appearence: true,
          type: "success",
        });
      }
      if (doctorAvailability?.error) {
        setToast({
          ...toast,
          message: doctorAvailability?.error?.data?.message,
          appearence: true,
          type: "error",
        });
      }

      try {
      } catch (error) {
        console.error("Check Booking Availability Error:", error);
        setToast({
          ...toast,
          message: "Something went wrong",
          appearence: true,
          type: "error",
        });
      }
    }

    if (appointment === "bookAppointment") {
      const payload = {
        doctorId: userId,
        userId: loginUserId,
        doctorInfo: data?.data,
        userInfo: logedInUserData?.data,
        date: appointmentData.date,
        time: appointmentData.time,
      };

      try {
        const userAppointment: any = await bookAppointment(payload);
        if (userAppointment?.data?.status) {
          setIsAvailable(false);
          setToast({
            ...toast,
            message: userAppointment?.data?.message,
            appearence: true,
            type: "success",
          });
          setTimeout(() => {
            navigate(isDoctor ? "/doctors/appointments" : "/appointments");
          }, 1500);
        }
        if (userAppointment?.error) {
          setToast({
            ...toast,
            message: userAppointment?.error?.data?.message,
            appearence: true,
            type: "error",
          });
        }
      } catch (error) {
        console.error("Book Appointment Error:", error);
        setToast({
          ...toast,
          message: "Something went wrong",
          appearence: true,
          type: "error",
        });
      }
    }
  };

 return (
  <>
    {(isLoading || logedInUserLoading || getAppointmentLoading) && (
      <OverlayLoader />
    )}

    <Navbar>
      <Heading
        sx={{
          fontSize: "30px",
          fontWeight: 800,
          background: "linear-gradient(90deg, #4f46e5, #9333ea)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 4,
        }}
      >
        Book Appointment
      </Heading>

      <Box sx={{ mt: 2 }}>
        <Grid container spacing={4}>

          {/* LEFT CARD */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                backdropFilter: "blur(12px)",
                background: "rgba(255,255,255,0.7)",
                borderRadius: "25px",
                p: 4,
                border: "1px solid rgba(255,255,255,0.4)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
                transition: "0.4s",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
                },
              }}
            >
              <Heading sx={{ fontSize: "20px", mb: 2 }}>
                Doctor Timings
              </Heading>

              <Divider sx={{ mb: 3 }} />

              <Box
                sx={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#4f46e5",
                  textAlign: "center",
                  p: 2,
                  background: "#eef2ff",
                  borderRadius: "12px",
                }}
              >
                {`${convertToAMPMFormat(
                  data?.data?.fromTime
                )} - ${convertToAMPMFormat(data?.data?.toTime)}`}
              </Box>

              {/* Keep your Formik form here */}
            </Box>
          </Grid>

          {/* MIDDLE CARD */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                background:
                  "linear-gradient(135deg, #ffffff, #f3f4ff)",
                borderRadius: "25px",
                p: 4,
                boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
                transition: "0.4s",
                "&:hover": {
                  transform: "translateY(-8px)",
                },
              }}
            >
              <Heading sx={{ fontSize: "22px", mb: 1 }}>
                {`${data?.data?.prefix} ${data?.data?.fullName}`}
              </Heading>

              <Box
                sx={{
                  fontSize: "15px",
                  color: "#9333ea",
                  fontWeight: 500,
                  mb: 2,
                }}
              >
                {data?.data?.specialization}
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Box fontWeight={500}>Experience</Box>
                <Box>{data?.data?.experience} Years</Box>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Box fontWeight={500}>Consultation</Box>
                <Box>30 Minutes</Box>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Box fontWeight={500}>Fee</Box>
                <Box
                  sx={{
                    fontWeight: 700,
                    color: "#16a34a",
                    fontSize: "16px",
                  }}
                >
                  ₹ {thousandSeparatorNumber(data?.data?.feePerConsultation)}
                </Box>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box fontWeight={500}>Location</Box>
                <Box sx={{ textAlign: "right", maxWidth: "150px" }}>
                  {data?.data?.address}
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* RIGHT CARD */}
          {getAppointmentData?.data?.length > 0 && (
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  background:
                    "linear-gradient(135deg, #ffffff, #eef2ff)",
                  borderRadius: "25px",
                  p: 4,
                  boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
                  maxHeight: "450px",
                  overflowY: "auto",
                }}
              >
                <Heading sx={{ fontSize: "20px", mb: 3 }}>
                  Booked Slots
                </Heading>

                <Divider sx={{ mb: 2 }} />

                {getAppointmentData?.data?.map((item: any) => (
                  <Box
                    key={item._id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background:
                        "linear-gradient(90deg,#e0e7ff,#f3e8ff)",
                      padding: "10px 14px",
                      borderRadius: "12px",
                      mb: 2,
                      fontSize: "14px",
                      fontWeight: 500,
                      transition: "0.3s",
                      "&:hover": {
                        transform: "scale(1.03)",
                      },
                    }}
                  >
                    <Box>{formatDate(item?.date)}</Box>
                    <Box>
                      {`${formatTime(item?.time)} - ${formatTime(
                        add30Minutes(item?.time)
                      )}`}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </Navbar>

    <ToastAlert
      appearence={toast.appearence}
      type={toast.type}
      message={toast.message}
      handleClose={handleCloseToast}
    />
  </>
);

};

export default BookAppointment;
