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
import { updateAdmin, getDetailAdmin } from "@/app/actions/admin";
import { useSearchParams } from "next/navigation";

export default function AddAdminPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const [showPassword, setShowPassword] = useState(false);
  const [dataAdmin, setDataAdmin] = useState([]);
  const [open, setOpen] = useState(false);
  const [alertStatus, setAlertStatus] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [jenisKelamin, setJenisKelamin] = useState("");
   const [agama, setAgama] = useState(null);
  const [formState, formAction] = useActionState(updateAdmin, {
    status: 0,
    message: "",
  });
  const agamaRef = useRef(null);
  const namaRef = useRef(null);

  useEffect(() => {
    if (formState.status == 200) {
      setOpen(true);
      setMessage(formState.message);
      setAlertStatus("success");
      resetHandler();
      getDataAdmin();
    } else if (formState.status == 500) {
      setOpen(true);
      setMessage(formState.message);
      setAlertStatus("error");
    }
    setIsLoading(false);
  }, [formState]);

  const resetHandler = () => {
    agamaRef.current?.click();
    namaRef.current?.focus();
    setJenisKelamin("");
  };

  useEffect(() => {
    const roleId = localStorage.getItem("roleId");
    if (roleId == 1) {
      getDataAdmin();
    } else {
      redirect("/404");
    }
  }, []);

  const getDataAdmin = async () => {
    try {
      const data = { nip: search };
      const result = await getDetailAdmin(data);

      if (result.status == 200) {
        setDataAdmin(result.data);
        setJenisKelamin(result.data?.jenis_kelamin);
        setAgama({
          label: result.data.agama,
          value: result.data.agama,
        });
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

  const backHandler = () => {
    return redirect("/dashboard/admin");
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
        <Link underline="hover" color="inherit" href="/dashboard/admin">
          Admin
        </Link>
        <Typography>Edit</Typography>
      </Breadcrumbs>
      <div className="mt-2 w-full">
        <Card>
          <form action={formAction} onSubmit={() => setIsLoading(true)}>
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
                  <FormLabel htmlFor="nip">NIP</FormLabel>
                  <TextField
                    id="nip"
                    variant="outlined"
                    fullWidth
                    size="small"
                    type="text"
                    disabled
                    defaultValue={dataAdmin.nip}
                  />
                  <input
                    type="hidden"
                    name="nip"
                    defaultValue={dataAdmin.nip}
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
                    inputRef={namaRef}
                    defaultValue={dataAdmin.nama}
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
                    defaultValue={dataAdmin.alamat}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <FormLabel htmlFor="alamat">Agama</FormLabel>
                  <Autocomplete
                    fullWidth
                    options={agamaOptions}
                    size="small"
                    value={agama}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) =>
                      option.value == value.value
                    }
                    onChange={(event, value) => setAgama(value)}
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
                    defaultValue={dataAdmin.no_hp}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <FormLabel htmlFor="password">
                    Password Baru (Opsional)
                  </FormLabel>
                  <TextField
                    id="password"
                    name="password"
                    variant="outlined"
                    fullWidth
                    size="small"
                    type={showPassword ? "text" : "password"}
                    placeholder="Kosongkan jika tidak ingin mengubah"
                    InputProps={{
                      endAdornment: (
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-xs text-blue-500"
                        >
                          {showPassword ? "Sembunyikan" : "Lihat"}
                        </button>
                      ),
                    }}
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
