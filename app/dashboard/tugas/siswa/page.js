"use client";
import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { useSearchParams } from "next/navigation";
import { getTugasBySiswa, saveNilaiTugasSiswa } from "@/app/actions/tugas";

export default function TugasSiswaPage() {
  const searchParams = useSearchParams();
  const id_tugas = searchParams.get("tugas");
  const id_siswa = searchParams.get("siswa");
  const id_pertanyaan = searchParams.get("id_pertanyaan");
  const [open, setOpen] = useState(false);
  const [nilai, setNilai] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [alertStatus, setAlertStatus] = useState("");
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [dataTugas, setDataTugas] = useState({});
  const [dataSoal, setDataSoal] = useState([]);

  useEffect(() => {
    getDataTugasSiswa();
  }, []);

  const getDataTugasSiswa = async () => {
    try {
      const data = { id_tugas: id_tugas, id_siswa: id_siswa };

      const getDataTugas = await getTugasBySiswa(data);

      if (getDataTugas.status == 200) {
        if (getDataTugas.data.jenis == "upload" && getDataTugas.data.file) {
          setDataTugas(getDataTugas.data);
          setFile(getDataTugas.data.file);
        } else {
          let totalNilai = 0;
          const newData = getDataTugas.data?.soal?.map((soal) => {
            if (soal.nilai) {
              totalNilai += soal.nilai;
            } else {
              if (soal.jenis == "pg" && soal.jawaban_pg == soal.jawaban_benar) {
                totalNilai += 100;
                return { ...soal, nilai: 100 };
              }
              return { ...soal, nilai: 0 };
            }

            return soal;
          });

          const nilaiBersih = getDataTugas.data?.soal?.length
            ? totalNilai / getDataTugas.data?.soal?.length
            : 0;
          setNilai(Math.round(nilaiBersih));
          setDataTugas(getDataTugas.data);
          setDataSoal(newData);
        }

        if (getDataTugas.data.nilai) {
          setNilai(getDataTugas.data.nilai);
        }
      } else {
        setOpen(true);
        setMessage(getDataTugas.message);
        setAlertStatus("error");
      }
    } catch (error) {
      setOpen(true);
      setMessage("Terjadi kesalahan");
      setAlertStatus("error");
    }
  };

  const saveDataNilaiTugasSiswa = async () => {
    setIsSaveLoading(true);
    try {
      const data = {
        id_tugas: id_tugas,
        id_siswa: id_siswa,
        nilai: nilai,
        jawaban: dataSoal.map((soal) => ({
          id_pertanyaan: soal.id_soal,
          jenis: soal.jenis,
          nilai: soal.nilai,
        })),
      };
      const result = await saveNilaiTugasSiswa(data);

      if (result.status == 200) {
        getDataTugasSiswa();
        setOpen(true);
        setMessage(result.message);
        setAlertStatus("success");
      } else {
        setOpen(true);
        setMessage(result.message);
        setAlertStatus("error");
      }
      setIsSaveLoading(false);
    } catch (error) {
      setOpen(true);
      setMessage("Gagal menyimpan nilai tugas siswa");
      setAlertStatus("error");
      setIsSaveLoading(false);
    }
  };

  const nilaiChangeHandler = (nilai, id) => {
    let totalNilai = 0;
    const newDataSoal = dataSoal.map((value) => {
      if (value.id_soal == id) {
        totalNilai += parseInt(nilai);
        return { ...value, nilai: parseInt(nilai) };
      } else {
        totalNilai += parseInt(value.nilai);
      }
      return value;
    });

    const nilaiBersih = totalNilai / dataSoal.length;
    setNilai(Math.round(nilaiBersih));
    setDataSoal(newDataSoal);
  };

  return (
    <div className="flex flex-col w-full p-4">
      <Breadcrumbs aria-label="breadcrumb">
        <Typography>Tugas</Typography>
      </Breadcrumbs>
      <div className="mt-2 w-full">
        <div className="flex flex-row w-full gap-2 items-center my-4">
          <span>Masukan Nilai :</span>
          <TextField
            id="nilai"
            name="nilai"
            variant="outlined"
            size="small"
            type="text"
            value={nilai}
            onChange={(e) => setNilai(e.target.value)}
          />
          <button
            className="focus:outline-none px-4 py-3 bg-green rounded-lg text-white font-bold cursor-pointer"
            onClick={saveDataNilaiTugasSiswa}
            disabled={isSaveLoading}
          >
            {isSaveLoading ? <CircularProgress size={20} /> : "Simpan"}
          </button>
        </div>
        {dataTugas.jenis == "upload" ? (
          <embed
            type="application/pdf"
            src={file}
            className="w-full"
            style={{ height: 800 }}
          ></embed>
        ) : (
          <div>
            <h2 className="text-lg font-bold">Soal Pilihan Ganda</h2>
            {dataSoal
              ?.filter((soal) => soal.jenis == "pg")
              .map((soal, index) => (
                <div key={soal.id_soal} className="mb-6">
                  <p className="font-semibold">
                    {index + 1}. {soal.pertanyaan}
                  </p>
                  <div className="flex flex-col w-full ml-4">
                    <span>A. {soal.opsi_a}</span>
                    <span>B. {soal.opsi_b}</span>
                    <span>C. {soal.opsi_c}</span>
                    <span>D. {soal.opsi_d}</span>
                  </div>
                  <p>Jawaban:</p>
                  <p className="ml-4">{soal.jawaban_pg}</p>
                  <TextField
                    id="jawabanPg"
                    name="jawabanPg"
                    variant="outlined"
                    size="small"
                    type="text"
                    defaultValue={soal.nilai}
                    onChange={(e) =>
                      nilaiChangeHandler(e.target.value, soal.id_soal)
                    }
                    sx={{ width: 100 }}
                  />
                </div>
              ))}
            <h2 className="text-lg font-bold">Essay</h2>
            {dataSoal
              ?.filter((soal) => soal.jenis == "esai")
              .map((soal, index) => (
                <div key={soal.id_soal} className="mb-4">
                  <p>
                    {index + 1}. {soal.pertanyaan}
                  </p>
                  <p>Jawaban:</p>
                  <p className="ml-4">{soal.jawaban_esai}</p>
                  <TextField
                    id="jawabanEsai"
                    name="jawabanEsai"
                    variant="outlined"
                    size="small"
                    type="text"
                    onChange={(e) =>
                      nilaiChangeHandler(e.target.value, soal.id_soal)
                    }
                    sx={{ width: 100 }}
                  />
                </div>
              ))}
          </div>
        )}
      </div>
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
  );
}
