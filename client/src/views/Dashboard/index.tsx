// React Imports
import { useNavigate } from "react-router-dom";
// Utils
import {
  convertToAMPMFormat,
  maskingPhoneNumber,
  thousandSeparatorNumber,
} from "../../utils";
// React Icons
import { IoPhonePortraitOutline } from "react-icons/io5";
import { CiLocationOn } from "react-icons/ci";
import { CiMoneyCheck1 } from "react-icons/ci";
import { IoMdTime } from "react-icons/io";
// MUI Imports
import { Box, Grid, Divider } from "@mui/material";
// Custom Imports
import { Heading } from "../../components/Heading";
import Navbar from "../../components/Navbar";
import { useGetApprovedDoctorsQuery } from "../../redux/api/doctorSlice";
import OverlayLoader from "../../components/Spinner/OverlayLoader";

const Dashboard = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetApprovedDoctorsQuery({});

  return (
  <>
    {isLoading && <OverlayLoader />}

    <Navbar>
      <Heading
        sx={{
          fontSize: "26px",
          fontWeight: 700,
          background: "linear-gradient(90deg, #667eea, #764ba2)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Available Doctors
      </Heading>

      {data?.data?.length !== 0 && (
        <Heading
          sx={{
            margin: "10px 0 20px 0",
            fontSize: "14px",
            fontWeight: 500,
            color: "#666",
          }}
        >
          Select a doctor to book an appointment
        </Heading>
      )}

      <Box sx={{ mt: 2 }}>
        <Grid container spacing={4}>
          {data?.data?.length === 0 ? (
            <Box
              sx={{
                margin: "40px auto",
                background: "linear-gradient(135deg, #ffffff, #f4f6ff)",
                borderRadius: "20px",
                padding: "30px 40px",
                boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
                textAlign: "center",
                fontSize: "16px",
                fontWeight: 500,
                color: "#555",
              }}
            >
              No Doctors Available in this Clinic
            </Box>
          ) : (
            <>
              {data?.data?.map((row: any) => (
                <Grid item xs={12} sm={6} md={4} key={row?.userId}>
                  <Box
                    sx={{
                      background:
                        "linear-gradient(135deg, #ffffff, #f8f9ff)",
                      borderRadius: "20px",
                      padding: "25px",
                      boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
                      cursor: "pointer",
                      transition: "0.3s ease",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
                      },
                    }}
                    onClick={() => {
                      navigate(`/book-appointments/${row?.userId}`);
                    }}
                  >
                    {/* Doctor Name */}
                    <Heading
                      sx={{
                        fontSize: "18px",
                        display: "flex",
                        flexDirection: "column",
                        marginBottom: "10px",
                      }}
                    >
                      {`${row?.prefix} ${row?.fullName}`}
                      <Box
                        sx={{
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "#764ba2",
                          marginTop: "4px",
                        }}
                      >
                        {row?.specialization}
                      </Box>
                    </Heading>

                    <Divider sx={{ mb: 2 }} />

                    {/* Phone */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1.5,
                        fontSize: "14px",
                      }}
                    >
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IoPhonePortraitOutline />
                        Phone
                      </Box>
                      <Box>{maskingPhoneNumber(row?.phoneNumber)}</Box>
                    </Box>

                    {/* Address */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1.5,
                        fontSize: "14px",
                      }}
                    >
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <CiLocationOn />
                        Address
                      </Box>
                      <Box sx={{ textAlign: "right", maxWidth: "150px" }}>
                        {row?.address}
                      </Box>
                    </Box>

                    {/* Fee */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1.5,
                        fontSize: "14px",
                      }}
                    >
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <CiMoneyCheck1 />
                        Fee
                      </Box>
                      <Box sx={{ fontWeight: 600 }}>
                        ₹ {thousandSeparatorNumber(row?.feePerConsultation)}
                      </Box>
                    </Box>

                    {/* Timings */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "14px",
                      }}
                    >
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IoMdTime />
                        Timings
                      </Box>
                      <Box>
                        {`${convertToAMPMFormat(
                          row?.fromTime
                        )} - ${convertToAMPMFormat(row?.toTime)}`}
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </>
          )}
        </Grid>
      </Box>
    </Navbar>
  </>
);

};

export default Dashboard;
