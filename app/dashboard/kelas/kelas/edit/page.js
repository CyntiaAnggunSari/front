"use client";
import React, { useEffect, useRef, useState } from "react";
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
import { useParams, redirect } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { updateKelas, getDetailKelas } from "@/app/actions/kelas";
import { getListGuru } from "@/app/actions/guru";

export default function EditKelasPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [alertStatus, setAlertStatus] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [dataKelas, setDataKelas] = useState([]);
  const [dataGuru, setDataGuru] = useState([]);
  const [dataGuruLoading, setDataGuruLoading] = useState(false);
  const [formData, setFormData] = useState({
    id_kelas: "",
    nama: "",
    id_guru: "",
    wali_kelas: "",
  });

  const namaRef = useRef(null);
  const guruRef = useRef(null);

  useEffect(() => {
    const fetchKelas = async () => {
      setIsLoading(true);
      const data = { id: search };
      const res = await getDetailKelas(data);
      console.log("🔍 Detail kelas:", res.data);

      if (res.status === 200) {
        setFormData({
          id_kelas: res.data.id_kelas, // ⬅️ Tambahkan ini
          nama: res.data.nama,
          id_guru: res.data.id_guru,
          wali_kelas: res.data.wali_kelas,
        });

        // ✅ Tambahkan ini: Ambil data guru berdasarkan wali_kelas untuk isi autocomplete
        const guruList = await getListGuru({
          limit: 20,
          page: 1,
          search: res.data.wali_kelas, // atau bisa pakai nama guru
        });
        if (guruList.status === 200) {
          setDataGuru(guruList.data);
        }
      } else {
        setOpen(true);
        setMessage(res.message);
        setAlertStatus("error");
      }
      setIsLoading(false);
    };

    fetchKelas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nama = namaRef.current?.value.trim();

    if (!nama || !formData.id_guru || !formData.wali_kelas) {
      setOpen(true);
      setMessage("Semua input wajib diisi");
      setAlertStatus("error");
      return;
    }

    setIsLoading(true);

    const payload = new FormData();
    payload.append("id_kelas",formData.id_kelas);
    payload.append("nama", nama);
    payload.append("wali_kelas", formData.wali_kelas);
    payload.append("id_guru", formData.id_guru); 

    const result = await updateKelas(payload); 

    if (result.status === 200) {
      setOpen(true);
      setMessage("Data berhasil diperbarui");
      setAlertStatus("success");
    } else {
      setOpen(true);
      setMessage(result.message);
      setAlertStatus("error");
    }
    setIsLoading(false);
  };

  const backHandler = () => redirect("/dashboard/kelas/kelas");

  const getDataGuru = async (keyword) => {
    setDataGuruLoading(true);
    try {
      const payload = { limit: 20, page: 1, search: keyword };
      const listGuru = await getListGuru(payload);
      if (listGuru.status == 200) {
        setDataGuru(listGuru.data);
      } else {
        setOpen(true);
        setMessage(listGuru.message);
        setAlertStatus("error");
      }
    } catch (error) {
      setOpen(true);
      setMessage("Terjadi kesalahan");
      setAlertStatus("error");
    }
    setDataGuruLoading(false);
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
        <Typography>Edit</Typography>
      </Breadcrumbs>
      <div className="mt-2 w-full">
        <Card>
          <form onSubmit={handleSubmit}>
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
                  <FormLabel htmlFor="id_kelas">Id Kelas</FormLabel>
                  <TextField
                    id="id_kelas"
                    variant="outlined"
                    fullWidth
                    size="small"
                    type="text"
                    disabled
                    defaultValue={formData.id_kelas}
                  />
                  <input
                    type="hidden"
                    name="id_kelas"
                    defaultValue={formData.id_kelas}
                  />
                </FormControl>

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
                    value={formData.nama}
                    onChange={(e) =>
                      setFormData({ ...formData, nama: e.target.value })
                    }
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
                      option.id_guru === value.id_guru
                    }
                    value={
                      dataGuru.find((g) => g.id_guru === formData.id_guru) ||
                      null
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Ketik minimal 1 huruf"
                      />
                    )}
                    slotProps={{ clearIndicator: { ref: guruRef } }}
                    loading={dataGuruLoading}
                    onInputChange={(event) =>
                      getDataGuru(event?.target?.value || "")
                    }
                    onChange={(event, value) => {
                      setFormData({
                        ...formData,
                        id_guru: value ? value.id_guru : "",
                        wali_kelas: value ? value.nama : "",
                      });
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
                    "SIMPAN PERUBAHAN"
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
