// MUI Imports
import { Box, Tooltip } from "@mui/material";
// Custom Imports
import { Heading } from "../../components/Heading";
import Navbar from "../../components/Navbar";
import MUITable, {
  StyledTableCell,
  StyledTableRow,
} from "../../components/MUITable";
import OverlayLoader from "../../components/Spinner/OverlayLoader";
// Redux
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
} from "../../redux/api/userSlice";
// Utils
import { formatDateTime } from "../../utils";
import CustomChip from "../../components/CustomChip";
import { MdDeleteOutline } from "react-icons/md";
import { useState } from "react";
import ToastAlert from "../../components/ToastAlert/ToastAlert";
import Spinner from "../../components/Spinner";

const tableHead = ["Name", "Email", "Date", "Roles", "Actions"];

const Users = () => {
  const [userId, setUserId] = useState("");
  const [toast, setToast] = useState({
    message: "",
    appearence: false,
    type: "",
  });

  const handleCloseToast = () => {
    setToast({ ...toast, appearence: false });
  };

  const { data, isLoading, isSuccess } = useGetAllUsersQuery({});

  const [deleteUser, { isLoading: deleteLoading }] = useDeleteUserMutation();

  const DeleteHandler = async (id: string) => {
    try {
      const user: any = await deleteUser({ userId: id });

      if (user?.data === null) {
        setToast({
          ...toast,
          message: "User Deleted Successfully",
          appearence: true,
          type: "success",
        });
      }
    } catch (error) {
      console.error("Deleting User Error:", error);
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
      {/* Gradient Heading */}
      <Heading
        sx={{
          fontSize: "30px",
          fontWeight: 800,
          background: "linear-gradient(90deg,#2563eb,#7c3aed)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 4,
        }}
      >
        Users Management
      </Heading>

      {/* Glass Container */}
      <Box
        sx={{
          borderRadius: "25px",
          backdropFilter: "blur(12px)",
          background: "rgba(255,255,255,0.75)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.08)",
          p: 2,
          transition: "0.3s",
        }}
      >
        <MUITable tableHead={tableHead}>
          {isSuccess &&
            data?.data?.map((row: any) => (
              <StyledTableRow
                key={row.name}
                sx={{
                  transition: "0.3s",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg,#eef2ff,#f5f3ff)",
                    transform: "scale(1.01)",
                  },
                }}
              >
                {/* Name */}
                <StyledTableCell sx={{ fontWeight: 600 }}>
                  {row?.name}
                </StyledTableCell>

                {/* Email */}
                <StyledTableCell>
                  {row.email}
                </StyledTableCell>

                {/* Date */}
                <StyledTableCell>
                  {formatDateTime(row.createdAt)}
                </StyledTableCell>

                {/* Role Badge */}
                <StyledTableCell>
                  <Box
                    sx={{
                      px: 2,
                      py: 0.5,
                      borderRadius: "20px",
                      fontSize: "13px",
                      fontWeight: 600,
                      display: "inline-block",
                      background: row?.isAdmin
                        ? "#ede9fe"
                        : row?.isDoctor
                        ? "#dbeafe"
                        : "#dcfce7",
                      color: row?.isAdmin
                        ? "#5b21b6"
                        : row?.isDoctor
                        ? "#1d4ed8"
                        : "#166534",
                    }}
                  >
                    {row?.isAdmin
                      ? "Owner"
                      : row?.isDoctor
                      ? "Doctor"
                      : "User"}
                  </Box>
                </StyledTableCell>

                {/* Delete Action */}
                <StyledTableCell>
                  {userId === row.id && deleteLoading ? (
                    <Spinner size={20} />
                  ) : (
                    !row?.isAdmin &&
                    !row?.isDoctor && (
                      <Tooltip title="Delete User" placement="bottom">
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            cursor: "pointer",
                            fontWeight: 600,
                            color: "#dc2626",
                            transition: "0.3s",
                            "&:hover": {
                              transform: "scale(1.1)",
                            },
                          }}
                          onClick={() => {
                            DeleteHandler(row.id);
                            setUserId(row.id);
                          }}
                        >
                          <MdDeleteOutline style={{ fontSize: "18px" }} />
                          Delete
                        </Box>
                      </Tooltip>
                    )
                  )}
                </StyledTableCell>
              </StyledTableRow>
            ))}
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

export default Users;
