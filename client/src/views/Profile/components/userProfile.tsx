// Hooks
import useTypedSelector from "../../../hooks/useTypedSelector";
// Redux
import { useGetUserQuery } from "../../../redux/api/userSlice";
import {
  selectedUserId,
  userIsAdmin,
  userIsDoctor,
} from "../../../redux/auth/authSlice";
// Utils
import {
  formatDateTime,
  getNameInitials,
  maskingPhoneNumber,
} from "../../../utils";
// MUI Imports
import { Box, Avatar } from "@mui/material";
// Custom Imports
import OverlayLoader from "../../../components/Spinner/OverlayLoader";
import Navbar from "../../../components/Navbar";
import { Heading } from "../../../components/Heading";

const UserProfile = () => {
  const userId = useTypedSelector(selectedUserId);
  const isDoctor = useTypedSelector(userIsDoctor);
  const isAdmin = useTypedSelector(userIsAdmin);

  const { data, isLoading } = useGetUserQuery({
    userId,
  });

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
        Profile Details
      </Heading>

      <Box
        sx={{
          margin: "30px 0",
          background: "linear-gradient(135deg, #ffffff, #f3f4ff)",
          borderRadius: "20px",
          padding: "30px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          maxWidth: "380px",
          transition: "0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
          },
        }}
      >
        {/* Role Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "15px",
          }}
        >
          <Box
            sx={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#555",
              letterSpacing: "0.5px",
            }}
          >
            {isDoctor ? "Doctor" : isAdmin ? "Owner" : "User"}
          </Box>

          {isAdmin && (
            <Box
              sx={{
                background:
                  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                fontSize: "12px",
                color: "#fff",
                borderRadius: "20px",
                padding: "5px 12px",
                fontWeight: 600,
              }}
            >
              Admin
            </Box>
          )}
        </Box>

        {/* Avatar */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            margin: "25px 0 15px 0",
          }}
        >
          <Avatar
            sx={{
              width: 90,
              height: 90,
              fontSize: "28px",
              fontWeight: 700,
              background:
                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            }}
          >
            {getNameInitials(data?.data?.name)}
          </Avatar>
        </Box>

        {/* Name */}
        <Heading
          sx={{
            display: "flex",
            justifyContent: "center",
            margin: "10px 0 5px",
            fontSize: "20px",
            fontWeight: 700,
            color: "#333",
          }}
        >
          {data?.data?.name}
        </Heading>

        {/* Phone */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
            fontSize: "14px",
            color: "#666",
          }}
        >
          {maskingPhoneNumber(data?.data?.phoneNumber)}
        </Box>

        {/* Divider */}
        <Box
          sx={{
            height: "1px",
            background: "#e0e0e0",
            margin: "15px 0",
          }}
        />

        {/* Created At */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "13px",
            color: "#555",
          }}
        >
          <Box sx={{ fontWeight: 600 }}>Created At</Box>
          <Box>{formatDateTime(data?.data?.createdAt)}</Box>
        </Box>
      </Box>
    </Navbar>
  </>
);
};

export default UserProfile;
