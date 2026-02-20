// React Imports
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// Formik Imports
import { Form, Formik, FormikProps } from "formik";
// MUI Imports
import { Button, Box, Typography } from "@mui/material";
// Custom Imports
import { SubHeading } from "../../components/Heading";
import PrimaryInput from "../../components/PrimaryInput/PrimaryInput";
import ToastAlert from "../../components/ToastAlert/ToastAlert";
// React Icons Imports
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
// Validation Schema Imports
import { loginSchema } from "./components/validationSchema";
// Utils Imports
import { onKeyDown } from "../../utils";
// Images Imports
import BottomLogo from "../../assets/images/bottomLogo.svg";
// Redux API
import { useLoginMutation } from "../../redux/api/authApiSlice";
import { setUser } from "../../redux/auth/authSlice";
import BackgroundImage from "../../assets/images/photo1.png";

interface ISLoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // states
  const [showPassword, setShowPassword] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [formValues, setFormValues] = useState<ISLoginForm>({
    email: "",
    password: "",
  });
  const [toast, setToast] = useState({
    message: "",
    appearence: false,
    type: "",
  });

  const hideShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleCloseToast = () => {
    setToast({ ...toast, appearence: false });
  };

  // Login Api Bind
  const [loginUser, { isLoading }] = useLoginMutation();

  const LoginHandler = async (data: ISLoginForm) => {
    try {
      const payload = {
        email: data.email,
        password: data.password,
      };

      const user: any = await loginUser(payload);
      if (user?.data?.status) {
        dispatch(setUser(user?.data));
        localStorage.setItem("user", JSON.stringify(user?.data));
        navigate("/");
      }
      if (user?.error) {
        setToast({
          ...toast,
          message: user?.error?.data?.message,
          appearence: true,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Login Error:", error);
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
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          "@media (max-width: 900px)": {
            flexDirection: "column",
          },
        }}
      >
        {/* LEFT SIDE - LOGIN FORM */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 4,
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: "420px",
              background: "#ffffff",
              padding: "40px",
              borderRadius: "20px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            }}
          >
            <Typography
              sx={{
                fontSize: "28px",
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: "10px",
                color: "#333",
              }}
            >
              Welcome Back 👋
            </Typography>

            <Typography
              sx={{
                textAlign: "center",
                marginBottom: "30px",
                color: "#666",
              }}
            >
              Login to Book Your Appointment
            </Typography>

            <Formik
              initialValues={formValues}
              onSubmit={(values: ISLoginForm) => {
                LoginHandler(values);
              }}
              validationSchema={loginSchema}
            >
              {(props: FormikProps<ISLoginForm>) => {
                const {
                  values,
                  touched,
                  errors,
                  handleBlur,
                  handleChange,
                } = props;

                return (
                  <Form onKeyDown={onKeyDown}>
                    <Box sx={{ marginBottom: "20px" }}>
                      <SubHeading>Email</SubHeading>
                      <PrimaryInput
                        type="text"
                        name="email"
                        placeholder="Enter your email"
                        value={values.email}
                        helperText={
                          errors.email && touched.email ? errors.email : ""
                        }
                        error={errors.email && touched.email ? true : false}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Box>

                    <Box sx={{ marginBottom: "10px" }}>
                      <SubHeading>Password</SubHeading>
                      <PrimaryInput
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter your password"
                        value={values.password}
                        helperText={
                          errors.password && touched.password
                            ? errors.password
                            : ""
                        }
                        error={
                          errors.password && touched.password ? true : false
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onClick={hideShowPassword}
                        endAdornment={
                          showPassword ? (
                            <AiOutlineEye />
                          ) : (
                            <AiOutlineEyeInvisible />
                          )
                        }
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "15px",
                      }}
                    >
                      <Typography sx={{ fontSize: "14px", color: "#555" }}>
                        New here?{" "}
                        <Link
                          to="/signup"
                          style={{
                            fontWeight: "bold",
                            color: "#764ba2",
                            textDecoration: "none",
                          }}
                        >
                          Create account
                        </Link>
                      </Typography>
                    </Box>

                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={isLoading}
                      sx={{
                        marginTop: "25px",
                        padding: "10px",
                        borderRadius: "10px",
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        fontWeight: "bold",
                        textTransform: "none",
                        fontSize: "16px",
                        "&:hover": {
                          opacity: 0.9,
                        },
                      }}
                    >
                      {isLoading ? "Logging in..." : "Login"}
                    </Button>
                  </Form>
                );
              }}
            </Formik>
          </Box>
        </Box>

        {/* RIGHT SIDE IMAGE */}
        <Box
          sx={{
            flex: 1,
            backgroundImage: `url(${BackgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderTopLeftRadius: "40px",
            borderBottomLeftRadius: "40px",
            "@media (max-width: 900px)": {
              height: "300px",
              borderRadius: "0px",
            },
          }}
        />
      </Box>
    </Box>

    <ToastAlert
      appearence={toast.appearence}
      type={toast.type}
      message={toast.message}
      handleClose={handleCloseToast}
    />
  </>
);
};

export default Login;