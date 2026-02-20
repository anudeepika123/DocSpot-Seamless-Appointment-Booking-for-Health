// React Imports
import { useState } from "react";
// Redux
import {
  useChangeDoctorStatusMutation,
  useGetAllDoctorsQuery,
} from "../../redux/api/doctorSlice";
// MUI Imports
import { Box, Tooltip } from "@mui/material";
// Utils
import { formatDateTime, maskingPhoneNumber } from "../../utils";
// React Icons
import { TiTickOutline } from "react-icons/ti";
import { MdBlock } from "react-icons/md";
// Custom Imports
import CustomChip from "../../components/CustomChip";
import ToastAlert from "../../components/ToastAlert/ToastAlert";
import Spinner from "../../components/Spinner";
import { Heading } from "../../components/Heading";
import MUITable, {
  StyledTableRow,
  StyledTableCell,
} from "../../components/MUITable";
import Navbar from "../../components/Navbar";
import OverlayLoader from "../../components/Spinner/OverlayLoader";
import { IoBookOutline } from "react-icons/io5";
import { CgUnblock } from "react-icons/cg";

const tableHead = [
  "Name",
  "Specialty",
  "Email",
  "Phone Number",
  "Date",
  "Status",
  "Actions",
];

const Doctors = () => {
  const [doctorId, setDoctorId] = useState("");
  const [toast, setToast] = useState({
    message: "",
    appearence: false,
    type: "",
  });

  const { data, isLoading, isSuccess } = useGetAllDoctorsQuery({});

  const handleCloseToast = () => {
    setToast({ ...toast, appearence: false });
  };

  const [doctorStatus, { isLoading: doctorLoading }] =
    useChangeDoctorStatusMutation();

  const doctorHandler = async (data: any, status: string) => {
    try {
      const payload = {
        doctorId: data._id,
        status: status,
        userId: data.userId,
      };

      const doctor: any = await doctorStatus(payload);

      if (doctor?.data?.status) {
        setToast({
          ...toast,
          message: "Doctor Status Changed Successfully",
          appearence: true,
          type: "success",
        });
      }
      if (doctor?.error) {
        setToast({
          ...toast,
          message: doctor?.error?.data?.message,
          appearence: true,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Doctor Status Changed Error:", error);
      setToast({
        ...toast,
        message: "Something went wrong",
        appearence: true,
        type: "error",
      });
    }
  };

 return (
  <>
    {isLoading && <OverlayLoader />}

    <Navbar>
      {/* PREMIUM HEADING */}
      <Heading
        sx={{
          fontSize: "30px",
          fontWeight: 800,
          background: "linear-gradient(90deg,#4f46e5,#9333ea)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 4,
        }}
      >
        Doctors Management
      </Heading>

      {/* GLASS TABLE CONTAINER */}
      <Box
        sx={{
          borderRadius: "25px",
          backdropFilter: "blur(14px)",
          background: "rgba(255,255,255,0.75)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.08)",
          p: 2,
          transition: "0.3s",
        }}
      >
        <MUITable tableHead={tableHead}>
          {isSuccess && data?.data?.length > 0 ? (
            data?.data?.map((row: any) => (
              <StyledTableRow
                key={row.email}
                sx={{
                  transition: "0.3s",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg,#eef2ff,#f3e8ff)",
                    transform: "scale(1.01)",
                  },
                }}
              >
                <StyledTableCell sx={{ fontWeight: 600 }}>
                  {`${row.prefix} ${row.fullName}`}
                </StyledTableCell>

                <StyledTableCell>
                  {row.specialization}
                </StyledTableCell>

                <StyledTableCell>
                  {row.email}
                </StyledTableCell>

                <StyledTableCell>
                  {maskingPhoneNumber(row.phoneNumber)}
                </StyledTableCell>

                <StyledTableCell>
                  {formatDateTime(row.createdAt)}
                </StyledTableCell>

                {/* STATUS CHIP */}
                <StyledTableCell>
                  <Box
                    sx={{
                      px: 2,
                      py: 0.5,
                      borderRadius: "20px",
                      fontSize: "13px",
                      fontWeight: 600,
                      display: "inline-block",
                      background:
                        row.status === "approved"
                          ? "#dcfce7"
                          : row.status === "pending"
                          ? "#fef9c3"
                          : "#fee2e2",
                      color:
                        row.status === "approved"
                          ? "#166534"
                          : row.status === "pending"
                          ? "#854d0e"
                          : "#991b1b",
                    }}
                  >
                    {row.status.charAt(0).toUpperCase() +
                      row.status.slice(1)}
                  </Box>
                </StyledTableCell>

                {/* ACTION BUTTON */}
                <Tooltip
                  title={
                    row.status === "pending"
                      ? "Approve Doctor"
                      : row.status === "blocked"
                      ? "Unblock Doctor"
                      : "Block Doctor"
                  }
                  placement="bottom"
                >
                  <StyledTableCell
                    sx={{
                      cursor: "pointer",
                      fontWeight: 600,
                      color:
                        row.status === "approved"
                          ? "#dc2626"
                          : "#16a34a",
                      transition: "0.3s",
                      "&:hover": {
                        transform: "scale(1.1)",
                      },
                    }}
                    onClick={() => {
                      doctorHandler(
                        row,
                        row.status === "pending"
                          ? "approved"
                          : row.status === "blocked"
                          ? "approved"
                          : "blocked"
                      );
                      setDoctorId(row._id);
                    }}
                  >
                    {doctorId === row._id && doctorLoading ? (
                      <Spinner size={20} />
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        {row.status === "pending" ? (
                          <TiTickOutline
                            style={{ fontSize: "20px" }}
                          />
                        ) : row.status === "blocked" ? (
                          <CgUnblock
                            style={{ fontSize: "18px" }}
                          />
                        ) : (
                          <MdBlock />
                        )}

                        {row.status === "pending"
                          ? "Approve"
                          : row.status === "blocked"
                          ? "Unblock"
                          : "Block"}
                      </Box>
                    )}
                  </StyledTableCell>
                </Tooltip>
              </StyledTableRow>
            ))
          ) : (
            <StyledTableRow sx={{ height: "120px" }}>
              <StyledTableCell
                colSpan={tableHead.length}
                align="center"
              >
                <Box
                  sx={{
                    fontSize: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    color: "#6b7280",
                  }}
                >
                  <IoBookOutline />
                  No records found
                </Box>
              </StyledTableCell>
            </StyledTableRow>
          )}
        </MUITable>
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

export default Doctors;
