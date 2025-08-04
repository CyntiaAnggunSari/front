"use client";
import React, { useEffect, useState, useCallback } from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { redirect } from "next/navigation";
import { saveTugas } from "@/app/actions/tugas";
import { getListMatapelajaranByGuruIdPeriode } from "@/app/actions/matapelajaran";
import { useDropzone } from "react-dropzone";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import dayjs from "dayjs";
import "dayjs/locale/id";

export default function AddTugasPage() {
  const [open, setOpen] = useState(false);
  const [alertStatus, setAlertStatus] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dataMatapelajaran, setDataMatapelajaran] = useState([]);
  const [dataMpLoading, setDataMpLoading] = useState(false);
  const [idMp, setIdMp] = useState("");
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");
  const [idKelas, setIdKelas] = useState([]);
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState(null);
  const [tanggalAkhir, setTanggalAkhir] = useState(null);
  const [jenisTugas, setJenisTugas] = useState("upload");
  const [listSoal, setListSoal] = useState([]);
  const [listMp, setListMp] = useState([]);

  useEffect(() => {
    getDataMp();
  }, []);

  const getDataMp = async (keyword) => {
    setDataMpLoading(true);
    try {
      const listMp = await getListMatapelajaranByGuruIdPeriode({
        limit: 20,
        page: 1,
        search: keyword,
      });
      if (listMp.status === 200) {
        setDataMatapelajaran(listMp.data);
      } else {
        setMessage(listMp.message);
        setAlertStatus("error");
        setOpen(true);
      }
    } catch (error) {
      setMessage("Terjadi kesalahan saat mengambil data matapelajaran");
      setAlertStatus("error");
      setOpen(true);
    }
    setDataMpLoading(false);
  };

  const backHandler = () => {
    return redirect("/dashboard/tugas");
  };

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setFile(reader.result);
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const addSoal = () => {
    setListSoal([
      ...listSoal,
      {
        jenis: "pg",
        pertanyaan: "",
        opsi_a: "",
        opsi_b: "",
        opsi_c: "",
        opsi_d: "",
        jawaban_benar: "",
      },
    ]);
  };

  const submitHandler = async (e) => {
    e.preventDefault(); // ⬅️ letakkan di paling atas dulu

    if (
      !judul ||
      !deskripsi ||
      listMp.length < 1 ||
      !tanggalMulai ||
      !tanggalAkhir ||
      (jenisTugas === "upload" && !file) ||
      (jenisTugas === "campuran" && listSoal.length === 0)
    ) {
      setAlertStatus("error");
      setMessage("Semua input wajib diisi!");
      setOpen(true);
      return;
    }

    // ... lanjut payload dan simpan

    const payload = {
      judul,
      deskripsi,
      mapel: listMp,
      kelas: JSON.stringify(idKelas),
      tanggal_mulai: dayjs(tanggalMulai.toISOString()).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
      tanggal_berakhir: dayjs(tanggalAkhir.toISOString()).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
      fileTugas: jenisTugas === "upload" ? file : "",
      fileName: jenisTugas === "upload" ? fileName : "",
      jenis: jenisTugas,
      soal:
        jenisTugas === "campuran"
          ? listSoal.map((item) => ({
              tipe: item.jenis,
              pertanyaan: item.pertanyaan,
              opsi:
                item.jenis === "pg"
                  ? [item.opsi_a, item.opsi_b, item.opsi_c, item.opsi_d]
                  : null,
              jawaban: item.jenis === "pg" ? item.jawaban_benar : null,
            }))
          : [],
    };

    const res = await saveTugas(payload);
    setIsLoading(false);
    setAlertStatus(res.status === 201 ? "success" : "error");
    setMessage(res.message);
    setOpen(true);

    if (res.status === 201) {
      // Reset semua input ke nilai awal
      setJudul("");
      setDeskripsi("");
      setIdMp("");
      setIdKelas([]);
      setTanggalMulai(null);
      setTanggalAkhir(null);
      setJenisTugas("upload");
      setFile("");
      setFileName("");
      setListSoal([]);
      setListMp([]);
    }
  };

  const jenisSoal = [
    { label: "Pilihan Ganda", value: "pg" },
    { label: "Esai", value: "esai" },
  ];

  return (
    <div className="flex flex-col w-full p-4">
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/dashboard">
          Dashboard
        </Link>
        <Link underline="hover" color="inherit" href="/dashboard/tugas">
          Tugas
        </Link>
        <Typography>Tambah</Typography>
      </Breadcrumbs>
      <form onSubmit={submitHandler} className="mt-4 w-full">
        <Card>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col w-full p-6 gap-3">
              <button
                className="focus:outline-none flex px-4 py-2 bg-light-orange text-black w-fit rounded-md mb-4 cursor-pointer"
                onClick={backHandler}
                type="button"
              >
                Kembali
              </button>
              <TextField
                label="Judul Tugas"
                name="judul"
                fullWidth
                size="small"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
              />
              <TextField
                label="Deskripsi"
                name="deskripsi"
                fullWidth
                multiline
                rows={3}
                size="small"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
              />
              <Autocomplete
                multiple
                options={dataMatapelajaran}
                value={listMp}
                getOptionLabel={(opt) =>
                  opt?.nama_mp && opt?.nama
                    ? `${opt.nama_mp} - ${opt.nama}`
                    : ""
                }
                isOptionEqualToValue={(option, value) =>
                  option.id_mp === value.id_mp
                }
                onChange={(e, value) => {
                  setListMp(value);          
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Mata Pelajaran" size="small" />
                )}
                loading={dataMpLoading}
              />
              <TextField
                select
                label="Jenis Tugas"
                name="jenisTugas"
                SelectProps={{ native: true }}
                value={jenisTugas}
                onChange={(e) => setJenisTugas(e.target.value)}
                fullWidth
                size="small"
              >
                <option value="upload">Upload</option>
                <option value="campuran">Campuran (PG & Esai)</option>
              </TextField>
              <div className="flex gap-4">
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="id"
                >
                  <DateTimePicker
                    label="Tanggal Mulai"
                    value={tanggalMulai}
                    onChange={(value) => setTanggalMulai(value)}
                  />
                </LocalizationProvider>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="id"
                >
                  <DateTimePicker
                    label="Tanggal Akhir"
                    value={tanggalAkhir}
                    onChange={(value) => setTanggalAkhir(value)}
                  />
                </LocalizationProvider>
              </div>
              {jenisTugas === "upload" && (
                <div
                  className="border border-dashed border-2 border-dark-orange p-4 text-center"
                  {...getRootProps()}
                >
                  <input {...getInputProps()} accept=".pdf" />
                  {isDragActive ? (
                    <p>Drop file di sini...</p>
                  ) : (
                    <p>Drag & drop atau klik untuk upload file (PDF)</p>
                  )}
                </div>
              )}
              <input type="hidden" value={file} name="fileTugas" />
              <input type="hidden" value={fileName} name="fileName" />
              <input
                type="hidden"
                name="soal"
                value={JSON.stringify(listSoal)}
              />
              <input type="hidden" name="jenisTugas" value={jenisTugas} />
              <input
                type="hidden"
                name="kelas"
                value={JSON.stringify(idKelas)}
              />
              <input type="hidden" name="id_mapel" value={idMp} />
              {file && jenisTugas === "upload" && (
                <embed
                  type="application/pdf"
                  src={file}
                  className="w-full h-96"
                />
              )}
              {jenisTugas === "campuran" && (
                <div className="mt-4">
                  <Typography variant="h6">Soal Campuran</Typography>
                  {listSoal.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col border p-4 mt-2 rounded gap-4"
                    >
                      <TextField
                        fullWidth
                        label="Teks Pertanyaan"
                        value={item.pertanyaan}
                        onChange={(e) => {
                          const newList = [...listSoal];
                          newList[index].pertanyaan = e.target.value;
                          setListSoal(newList);
                        }}
                      />
                      <FormControl sx={{ width: 200 }}>
                        <InputLabel id="mapel-select-label">
                          Jenis Pertanyaan
                        </InputLabel>
                        <Select
                          labelId="mapel-select-label"
                          id="mapel-select"
                          value={item.jenis}
                          label="Kelas"
                          onChange={(e) => {
                            const newList = [...listSoal];
                            newList[index].jenis = e.target.value;
                            setListSoal(newList);
                          }}
                        >
                          {jenisSoal.map((data) => (
                            <MenuItem key={data.value} value={data.value}>
                              {data.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {item.jenis === "pg" && (
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <TextField
                            label="Opsi A"
                            value={item.opsi_a}
                            onChange={(e) => {
                              const newList = [...listSoal];
                              newList[index].opsi_a = e.target.value;
                              setListSoal(newList);
                            }}
                          />
                          <TextField
                            label="Opsi B"
                            value={item.opsi_b}
                            onChange={(e) => {
                              const newList = [...listSoal];
                              newList[index].opsi_b = e.target.value;
                              setListSoal(newList);
                            }}
                          />
                          <TextField
                            label="Opsi C"
                            value={item.opsi_c}
                            onChange={(e) => {
                              const newList = [...listSoal];
                              newList[index].opsi_c = e.target.value;
                              setListSoal(newList);
                            }}
                          />
                          <TextField
                            label="Opsi D"
                            value={item.opsi_d}
                            onChange={(e) => {
                              const newList = [...listSoal];
                              newList[index].opsi_d = e.target.value;
                              setListSoal(newList);
                            }}
                          />
                          <TextField
                            label="Jawaban Benar"
                            value={item.jawaban_benar}
                            onChange={(e) => {
                              const newList = [...listSoal];
                              newList[index].jawaban_benar = e.target.value;
                              setListSoal(newList);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSoal}
                    className="mt-2 bg-orange-500 px-3 py-2 text-white rounded cursor-pointer"
                  >
                    + Tambah Soal
                  </button>
                </div>
              )}
            </div>
          </CardContent>
          <CardActions className="justify-end px-6 pb-6">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "SIMPAN"
              )}
            </button>
          </CardActions>
        </Card>
      </form>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity={alertStatus}
          variant="filled"
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
