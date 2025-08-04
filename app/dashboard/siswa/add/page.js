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
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Autocomplete from "@mui/material/Autocomplete";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { redirect } from "next/navigation";
import { saveSiswa } from "@/app/actions/siswa";

export default function AddSiswaPage() {
  const [open, setOpen] = useState(false);
  const [alertStatus, setAlertStatus] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [formState, formAction] = useActionState(saveSiswa, {
    status: 0,
    message: "",
  });
  const agamaRef = useRef(null);
  const nisRef = useRef(null);

  useEffect(() => {
    if (formState.status == 201) {
      setOpen(true);
      setMessage(formState.message);
      setAlertStatus("success");
      resetHandler();
    } else if (formState.status == 500) {
      setOpen(true);
      setMessage(formState.message);
      setAlertStatus("error");
    }
    setIsLoading(false);
  }, [formState]);

  const resetHandler = () => {
    agamaRef.current?.click();
    nisRef.current?.focus();
    setJenisKelamin("");
  };

  const handleSubmit = (e) => {
  const nis = nisRef.current?.value.trim();
  const nama = e.target.nama.value.trim();
  const alamat = e.target.alamat.value.trim();
  const agama = e.target.agama?.value?.trim();
  const noHp = e.target.noHp.value.trim();
  const password = e.target.password.value.trim();

  if (!nis || !nama || !jenisKelamin || !alamat || !agama || !noHp || !password) {
    e.preventDefault(); // 🚫 stop submit ke server
    setMessage("Semua input wajib diisi");
    setAlertStatus("error");
    setOpen(true);
    setIsLoading(false);
    return;
  }
   setIsLoading(true); // ✅ valid, boleh submit
};

  const backHandler = () => {
    return redirect("/dashboard/siswa");
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
        <Link underline="hover" color="inherit" href="/dashboard/siswa">
          Siswa
        </Link>
        <Typography>Add</Typography>
      </Breadcrumbs>
      <div className="mt-2 w-full">
        <Card>
          <form action={formAction} onSubmit={handleSubmit}>
            <CardContent>
              <div className="flex flex-col w-full p-6 gap-3">
                <button
                  className="focus:outline-none flex px-4 py-2 bg-light-orange text-black w-fit rounded-md mb-4 cursor-pointer"
                  onClick={backHandler}
                  type="button"
                >
                  Kembali
                </button>
                <FormControl fullWidth>
                  <FormLabel htmlFor="nis">NIS</FormLabel>
                  <TextField
                    id="nis"
                    name="nis"
                    variant="outlined"
                    fullWidth
                    size="small"
                    type="text"
                    inputRef={nisRef}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <FormLabel htmlFor="nama">Nama</FormLabel>
                  <TextField
                    id="nama"
                    name="nama"
                    variant="outlined"
                    fullWidth
                    size="small"
                    type="text"
                  />
                </FormControl>
                <FormControl>
                  <label htmlFor="jenisKelamin">Jenis Kelamin</label>
                  <RadioGroup
                    row
                    name="row-radio-buttons-group"
                    id="jenisKelamin"
                  >
                    <FormControlLabel
                      value="Laki - Laki"
                      control={
                        <Radio
                          checked={jenisKelamin == "Laki - Laki" ? true : false}
                          onChange={() => setJenisKelamin("Laki - Laki")}
                        />
                      }
                      name="jenisKelamin"
                      label="Laki - Laki"
                    />
                    <FormControlLabel
                      value="Perempuan"
                      control={
                        <Radio
                          checked={jenisKelamin == "Perempuan" ? true : false}
                          onChange={() => setJenisKelamin("Perempuan")}
                        />
                      }
                      name="jenisKelamin"
                      label="Perempuan"
                    />
                  </RadioGroup>
                </FormControl>
                <FormControl fullWidth>
                  <FormLabel htmlFor="alamat">Alamat</FormLabel>
                  <TextField
                    id="alamat"
                    name="alamat"
                    variant="outlined"
                    fullWidth
                    size="small"
                    type="text"
                  />
                </FormControl>
                <FormControl fullWidth>
                  <FormLabel htmlFor="alamat">Agama</FormLabel>
                  <Autocomplete
                    fullWidth
                    options={agamaOptions}
                    size="small"
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) =>
                      option.value == value.value
                    }
                    renderInput={(params) => (
                      <TextField {...params} name="agama" />
                    )}
                    slotProps={{ clearIndicator: { ref: agamaRef } }}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <FormLabel htmlFor="nomorhp">Nomor HP</FormLabel>
                  <TextField
                    id="nomorhp"
                    name="noHp"
                    variant="outlined"
                    fullWidth
                    size="small"
                    type="text"
                  />
                </FormControl>
                <FormControl fullWidth>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <TextField
                    id="password"
                    name="password"
                    variant="outlined"
                    fullWidth
                    size="small"
                    type="text"
                  />
                </FormControl>
              </div>
            </CardContent>
            <CardActions>
              <div className="flex flex-row w-full px-6 pb-6 justify-end">
                <button
                  type="submit"
                  className="flex justify-center w-40 py-2 bg-soft-blue text-white font-semibold rounded-md cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "SIMPAN"
                  )}
                </button>
              </div>
            </CardActions>
          </form>
        </Card>
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
      </div>
    </div>
  );
}
