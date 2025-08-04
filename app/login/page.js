"use client";

import React, { useState, useActionState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import MailIcon from "@mui/icons-material/Mail";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "next/link";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { login } from "../actions/auth";
import { redirect } from "next/navigation";

export default function LoginPage() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alertStatus, setAlertStatus] = useState("error");
  const [formState, formAction] = useActionState(login, {
    message: "",
    nama: "",
  });

  useEffect(() => {
    if (formState.message !== "") {
      setAlertStatus("error");
      setMessage(formState.message);
      setOpen(true);
      setIsLoading(false);
    } else if (formState.nama !== "") {
      setAlertStatus("success");
      setMessage("Login berhasil");
      setOpen(true);
      console.log(formState.userId);
      localStorage.setItem("nama", formState.nama);
      localStorage.setItem("roleId", formState.roleId);
       localStorage.setItem("userId", formState.userId);
      setTimeout(() => {
        redirect("/dashboard");
      }, 1500); // biar snackbar sempat tampil
    }
  }, [formState]);

  const handleSubmit = (e) => {
    if (!username.trim() || !password.trim()) {
      e.preventDefault(); // hentikan submit
      setMessage("Username dan Password wajib diisi");
      setOpen(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true); // Lolos validasi
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };
  return (
    <div className="flex h-screen w-full bg-[url(/images/background.jpg)] bg-cover justify-center items-center">
      <div className="w-fit bg-gray-100/80 p-4 rounded-lg text-center">
        <span className="font-bold text-black">Login</span>
        <form action={formAction} onSubmit={handleSubmit}>
          <div className="flex flex-col w-md mt-4 px-4 gap-2">
            <FormControl variant="standard" fullWidth>
              <InputLabel htmlFor="standard-adornment-password">
                Username
              </InputLabel>
              <Input
                id="standard-adornment-username"
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton>
                      <MailIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <FormControl variant="standard" fullWidth>
              <InputLabel htmlFor="standard-adornment-password">
                Password
              </InputLabel>
              <Input
                id="standard-adornment-password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </div>
          <div className="flex flex-row w-md px-4 items-center mt-4">
            <div className="w-1/2">
              <FormGroup>
                <FormControlLabel control={<Checkbox />} label="Remember me" />
              </FormGroup>
            </div>
            <div className="w-1/2">
              <Link href="/#">Forget Password</Link>
            </div>
          </div>
          <div className="w-md jutify-center items-center px-4 py-3 mt-4 ">
            <button
              type="submit"
              className="focus:outline-none py-3 w-full text-white bg-dark-red rounded-lg font-bold cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress color="inherit" /> : "Login"}
            </button>
          </div>
        </form>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={open}
          onClose={() => setOpen(false)}
          key="feedbackLogin"
        >
          <Alert
            onClose={() => setOpen(false)}
            severity={alertStatus}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}
