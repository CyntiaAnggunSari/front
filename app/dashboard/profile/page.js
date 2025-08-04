"use client";
import React, { useActionState, useEffect, useState, useRef } from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { redirect } from "next/navigation";
import { updatePassword, getDetail } from "@/app/actions/profile";
import { useSearchParams } from "next/navigation";

export default function UpdateProfilePage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search"); // userId
  const [role, setRole] = useState("");
  const [data, setData] = useState({});
  const [passwordLama, setPasswordLama] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasiPasswordBaru, setKonfirmasiPasswordBaru] = useState("");
  const [open, setOpen] = useState(false);
  const [alertStatus, setAlertStatus] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const roleId = localStorage.getItem("roleId");
    if (roleId == 1) {
      setRole("admin");
    } else if (roleId == 2) {
      setRole("guru");
    } else if (roleId == 3) {
      setRole("siswa");
    }
    getData();
  }, []);

  const getData = async () => {
    try {
      const result = await getDetail();

      if (result.status === 200) {
        setData(result.data);
      } else {
        setOpen(true);
        setMessage(result.message);
        setAlertStatus("error");
      }
    } catch (error) {
      setOpen(true);
      setMessage("Terjadi kesalahan");
      setAlertStatus("error");
    }
  };

  const updatePasswordHandler = async () => {
    setIsLoading(true);

    if (passwordBaru == konfirmasiPasswordBaru) {
      try {
        const data = { passwordLama: passwordLama, passwordBaru: passwordBaru };
        const result = await updatePassword(data);

        if (result.status === 200) {
          setOpen(true);
          setMessage(result.message);
          setAlertStatus("success");
          setPasswordLama("");
          setPasswordBaru("");
          setKonfirmasiPasswordBaru("");
        } else {
          setOpen(true);
          setMessage(result.message);
          setAlertStatus("error");
        }
        setIsLoading(false);
      } catch (error) {
        setOpen(true);
        setMessage("Terjadi kesalahan");
        setAlertStatus("error");
        setIsLoading(false);
      }
    } else {
      setOpen(true);
      setMessage("Konfirmasi password baru sesuai");
      setAlertStatus("error");
      setIsLoading(false);
      return;
    }
  };

  const backHandler = () => {
    return redirect("/dashboard");
  };

  const agamaOptions = [
    { label: "Islam", value: "Islam" },
    { label: "Katolik", value: "Katolik" },
    { label: "Protestan", value: "Protestan" },
    { label: "Hindu", value: "Hindu" },
    { label: "Buddha", value: "Buddha" },
    { label: "Kung hu cu", value: "Kung hu cu" },
    { label: "Lainnya", value: "Lainnya" },
  ];

  return (
    <div className="flex flex-col w-full p-4">
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/dashboard">
          Dashboard
        </Link>
        <Link underline="hover" color="inherit" href="/dashboard/profile">
          Profile
        </Link>
        <Typography>Edit</Typography>
      </Breadcrumbs>
      <div className="mt-2 w-full">
        <Card>
          <CardContent>
            <div className="flex flex-col w-full p-6 gap-3">
              <button
                className="focus:outline-none flex px-4 py-2 bg-light-orange text-black w-fit rounded-md mb-4 cursor-pointer"
                onClick={backHandler}
                type="button"
              >
                Kembali
              </button>

              {/* NIP / NIS */}
              {role === "guru" || role === "admin" ? (
                <FormControl fullWidth>
                  <div className="flex flex-row">
                    <div className="w-40">NIP</div>
                    <div>: {data.nip}</div>
                  </div>
                </FormControl>
              ) : role === "siswa" ? (
                <FormControl fullWidth>
                  <div className="flex flex-row">
                    <div className="w-40">NIS</div>
                    <div>: {data.nis}</div>
                  </div>
                </FormControl>
              ) : null}

              {/* Nama */}
              <FormControl fullWidth>
                <div className="flex flex-row">
                  <div className="w-40">Nama</div>
                  <div>: {data.nama}</div>
                </div>
              </FormControl>

              <FormControl fullWidth>
                <div className="flex flex-row">
                  <div className="w-40">Alamat</div>
                  <div>: {data.alamat}</div>
                </div>
              </FormControl>

              <FormControl fullWidth>
                <div className="flex flex-row">
                  <div className="w-40">Jenis Kelamin</div>
                  <div>: {data.jenis_kelamin}</div>
                </div>
              </FormControl>

              <FormControl fullWidth>
                <div className="flex flex-row">
                  <div className="w-40">Agama</div>
                  <div>: {data.agama}</div>
                </div>
              </FormControl>

              <FormControl fullWidth>
                <div className="flex flex-row">
                  <div className="w-40">Nomor HP</div>
                  <div>: {data.no_hp}</div>
                </div>
              </FormControl>
              <FormControl fullWidth>
                <FormLabel htmlFor="passwordLama">Password Lama</FormLabel>
                <TextField
                  id="passwordLama"
                  name="passwordLama"
                  variant="outlined"
                  fullWidth
                  size="small"
                  type="password"
                  value={passwordLama}
                  onChange={(e) => setPasswordLama(e.target.value)}
                />
              </FormControl>
              <FormControl fullWidth>
                <FormLabel htmlFor="passwordBaru">Password Baru</FormLabel>
                <TextField
                  id="passwordBaru"
                  name="passwordBaru"
                  variant="outlined"
                  fullWidth
                  size="small"
                  type="password"
                  value={passwordBaru}
                  onChange={(e) => setPasswordBaru(e.target.value)}
                />
              </FormControl>
              <FormControl fullWidth>
                <FormLabel htmlFor="passwordBaru">
                  Konfirmasi Password Baru
                </FormLabel>
                <TextField
                  id="konfirmasiPasswordBaru"
                  name="konfirmasiPasswordBaru"
                  variant="outlined"
                  fullWidth
                  size="small"
                  type="password"
                  value={konfirmasiPasswordBaru}
                  onChange={(e) => setKonfirmasiPasswordBaru(e.target.value)}
                />
              </FormControl>
            </div>
          </CardContent>

          <CardActions>
            <div className="flex flex-row w-full px-6 pb-6 justify-end">
              <button
                type="button"
                className="flex justify-center w-40 py-2 bg-soft-blue text-white font-semibold rounded-md cursor-pointer"
                disabled={isLoading}
                onClick={updatePasswordHandler}
              >
                {isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "SIMPAN"
                )}
              </button>
            </div>
          </CardActions>

          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={open}
            onClose={() => setOpen(false)}
            autoHideDuration={6000}
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
        </Card>
      </div>
    </div>
  );
}
