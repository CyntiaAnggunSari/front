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
import Autocomplete from "@mui/material/Autocomplete";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { redirect } from "next/navigation";
import { saveKelas } from "@/app/actions/kelas";
import { getListGuru } from "@/app/actions/guru";


export default function AddKelasPage() {
  const [open, setOpen] = useState(false);
  const [alertStatus, setAlertStatus] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [dataGuru, setDataGuru] = useState([]);
  const [dataGuruLoading, setDataGuruLoading] = useState(false);
  const [idGuru, setIdGuru] = useState("");
  const [waliKelas, setWaliKelas] = useState("");
const [formState, formAction] = useActionState(saveKelas, {
    status: 0,
    message: "",
  });

 const namaRef = useRef(null);
 const guruRef = useRef(null);

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
   
const getDataGuru = async (keyword) => {
    setDataGuruLoading(true);
    try {
      const payload = {
        limit: 20,
        page: 1,
        search: keyword,
      };
      const listGuru = await getListGuru(payload);

      if (listGuru.status == 200) {
        setDataGuru(listGuru.data);
      } else {
        setOpen(true);
        setMessage(listGuru.message);
        setAlertStatus("error");
      }
      setDataGuruLoading(false);
    } catch (error) {
      setOpen(true);
      setMessage("Terjadi kesalahan");
      setAlertStatus("error");
      setDataGuruLoading(false);
    }  
  }

const resetHandler = () => {
    guruRef.current?.click();
    namaRef.current?.focus();
  };

  const handleSubmit = (e) => {
  const nama = namaRef.current?.value.trim();
  const wali_kelas = e.target.wali_kelas.value.trim();

  if ( !nama || !wali_kelas) {
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
    return redirect("/dashboard/kelas/kelas");
  };
  return (
    <div className="flex flex-col w-full p-4">
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/dashboard">
          Dashboard
        </Link>
        <Link underline="hover" color="inherit" href="/dashboard/kelas/kelas">
          Kelas
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
                  <FormLabel htmlFor="nama">Nama Kelas</FormLabel>
                  <TextField
                    id="nama"
                    name="nama"
                    variant="outlined"
                    fullWidth
                    size="small"
                    type="text"
                    inputRef={namaRef}
                  />
                </FormControl>
                 
                <FormControl fullWidth>
                  <FormLabel htmlFor="walikelas">Wali Kelas</FormLabel>
                  <Autocomplete
                    options={dataGuru}
                    size="small"
                    getOptionLabel={(option) =>
                      `${option.nip} - ${option.nama}`
                    }
                    isOptionEqualToValue={(option, value) =>
                      option.value == value.value
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Ketik minimal 1 huruf"
                      />
                    )}
                    slotProps={{ clearIndicator: { ref: guruRef } }}
                    loading={dataGuruLoading}
                    onInputChange={(event) => getDataGuru(event.target.value)}
                    onChange={(event, value) => {
                      setIdGuru(value ? value.id_guru : "");
                      setWaliKelas(value ? value.nama : "");
                    }}
                  />
                  <input type="hidden" name="id_guru" value={idGuru} />
                  <input type="hidden" name="wali_kelas" value={waliKelas} />
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
