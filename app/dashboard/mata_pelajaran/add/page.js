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
import { saveMatapelajaran } from "@/app/actions/matapelajaran";
import { getListKelasByPeriode } from "@/app/actions/kelas";
import { getListGuru } from "@/app/actions/guru";
import { getListMapel } from "@/app/actions/matapelajaran";
export default function AddMatapelajaran() {
  const [open, setOpen] = useState(false);
  const [alertStatus, setAlertStatus] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [dataGuru, setDataGuru] = useState([]);
  const [dataGuruLoading, setDataGuruLoading] = useState(false);
  const [idGuru, setIdGuru] = useState("");
  const [dataMapel, setDataMapel] = useState([]);
  const [dataMapelLoading, setDataMapelLoading] = useState(false);
  const [idMapel, setIdMapel] = useState("");
  const [dataKelas, setDataKelas] = useState([]);
  const [dataKelasLoading, setDataKelasLoading] = useState(false);
  const [idKelas, setIdKelas] = useState("");
  const [guruMp, setGuruMp] = useState("");
   const [Mapel, setMapel] = useState("");
  const [kelas, setKelas] = useState("");
  const [formState, formAction] = useActionState(saveMatapelajaran, {
    status: 0,
    message: "",
  });
  const guruRef = useRef(null);
  const kelasRef = useRef(null);
  const mapelRef = useRef(null);
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

   const getDataMapel = async (keyword) => {
    setDataGuruLoading(true);
    try {
      const payload = {
        limit: 20,
        page: 1,
        search: keyword,
      };
      const listMapel = await getListMapel(payload);

      if (listMapel.status == 200) {
        setDataMapel(listMapel.data);
      } else {
        setOpen(true);
        setMessage(listMapel.message);
        setAlertStatus("error");
      }
      setDataMapelLoading(false);
    } catch (error) {
      setOpen(true);
      setMessage("Terjadi kesalahan");
      setAlertStatus("error");
      setDataMapelLoading(false);
    }
  };
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
  };
  const getDataKelas = async (keyword) => {
    setDataKelasLoading(true);
    try {
      const payload = {
        limit: 20,
        page: 1,
        search: keyword,
      };
      const listKelas = await getListKelasByPeriode(payload);

      if (listKelas.status == 200) {
        setDataKelas(listKelas.data);
      } else {
        setOpen(true);
        setMessage(listGuru.message);
        setAlertStatus("error");
      }
      setDataKelasLoading(false);
    } catch (error) {
      setOpen(true);
      setMessage("Terjadi kesalahan");
      setAlertStatus("error");
      setDataKelasLoading(false);
    }
  };

  const handleSubmit = (e) => {
  const guru = idGuru;
  const kelas = idKelas;

  if ( !guru  || !kelas) {
    e.preventDefault(); // 🚫 stop submit ke server
    setMessage("Semua input wajib diisi");
    setAlertStatus("error");
    setOpen(true);
    setIsLoading(false);
    return;
  }
  setIsLoading(true); // ✅ valid, boleh submit
};


  const resetHandler = () => {
    guruRef.current?.click();
    kelasRef.current?.click();
    mapelRef.current?.click();
  };

  const backHandler = () => {
    return redirect("/dashboard/mata_pelajaran");
  };
  return (
    <div className="flex flex-col w-full p-4">
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/dashboard">
          Dashboard
        </Link>
        <Link
          underline="hover"
          color="inherit"
          href="/dashboard/mata_pelajaran"
        >
          Matapelajaran
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
                  <FormLabel htmlFor="nama_mp">Matapelajaran</FormLabel>
                  <Autocomplete
                    id="nama_mp"
                    fullWidth
                    options={dataMapel}
                    size="small"
                    getOptionLabel={(option) =>
                      `${option.id_mapel} - ${option.nama_mapel}`
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
                    slotProps={{ clearIndicator: { ref: mapelRef } }}
                    loading={dataMapelLoading}
                    onInputChange={(event) => getDataMapel(event.target.value)}
                    onChange={(event, value) => {
                      setIdMapel(value ? value.id_mapel : "");
                      setMapel(value ? value.nama_mapel : "");
                    }}
                  />
                  <input type="hidden" name="id_mapel" value={idMapel} />
                  <input type="hidden" name="nama_mp" value={Mapel} />
                </FormControl>
                <FormControl fullWidth>
                  <FormLabel htmlFor="guru_mp">Guru</FormLabel>
                  <Autocomplete
                    id="guru_mp"
                    fullWidth
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
                      setGuruMp(value ? value.nama : "");
                    }}
                  />
                  <input type="hidden" name="id_guru" value={idGuru} />
                  <input type="hidden" name="guru_mp" value={guruMp} />
                </FormControl>
                <FormControl fullWidth>
                  <FormLabel htmlFor="id_kelas">Kelas</FormLabel>
                  <Autocomplete
                    id="id_kelas"
                    fullWidth
                    options={dataKelas}
                    size="small"
                    getOptionLabel={(option) => option.nama}
                    isOptionEqualToValue={(option, value) =>
                      option.value == value.value
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Ketik minimal 1 huruf"
                      />
                    )}
                    slotProps={{ clearIndicator: { ref: kelasRef } }}
                    loading={dataKelasLoading}
                    onInputChange={(event) => getDataKelas(event.target.value)}
                    onChange={(event, value) => {
                      setIdKelas(value ? value.id_kelas : "");
                      setKelas(value ? value.nama : "");
                    }}
                  />
                  <input type="hidden" name="id_kelas" value={idKelas} />
                  <input type="hidden" name="kelas" value={kelas} />
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
