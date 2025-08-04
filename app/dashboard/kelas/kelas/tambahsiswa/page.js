"use client";
import React, { useEffect, useState, useRef } from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import { useParams, redirect } from "next/navigation";
import { saveKelasSiswa } from "@/app/actions/kelas";
import { getListSiswaAvailable } from "@/app/actions/siswa";
import { getDetailKelas } from "@/app/actions/kelas";
import { useSearchParams } from "next/navigation";

export default function AddKelasSiswaPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [alertStatus, setAlertStatus] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dataSiswa, setDataSiswa] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [dataKelas, setDataKelas] = useState({});

  useEffect(() => {
    const roleId = localStorage.getItem("roleId");
    if (roleId == 1) {
      getDataKelas();
    } else {
      redirect("/404");
    }
  }, []);

  const getDataSiswa = async (id_periode) => {
    try {
      const res = await getListSiswaAvailable({ id_periode: id_periode });
      if (res.status === 200) {
        setDataSiswa(res.data);
      } else {
        showError(res.message);
      }
    } catch {
      console.error("Terjadi kesalahan saat mengambil data siswa:", error);
    }
  };

  const getDataKelas = async () => {
    try {
      const data = { id: search };
      const res = await getDetailKelas(data);
      if (res.status === 200) {
        setDataKelas(res.data);
        if (res.data.id_periode) {
          getDataSiswa(res.data.id_periode); // Panggil setelah dapat periode
        }
      } else {
        showError(res.message);
      }
    } catch {
      showError("Terjadi kesalahan saat mengambil data kelas.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const payload = {
        id: search,
        siswa: selectedRows,
      };
      const res = await saveKelasSiswa(payload);

      // ✅ Cek apakah res tidak undefined dulu
      if (res && (res.status === 200 || res.status === 207)) {
        setDataSiswa((prev) =>
          prev.filter((siswa) => !selectedRows.includes(siswa.id_siswa))
        );
        setSelectedRows([]);
        setAlertStatus("success");
        setMessage(res.message);
      } else {
        setAlertStatus("error");
        setMessage(res?.message || "Terjadi kesalahan saat menyimpan.");
      }

      setOpen(true);
    } catch (err) {
      console.error("❌ Gagal simpan:", err);
      showError("Terjadi kesalahan saat menyimpan.");
    } finally {
      setIsLoading(false);
    }
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
        <Link
          underline="hover"
          color="inherit"
          href="/dashboard/kelas/kelas_siswa"
        >
          Kelas Siswa
        </Link>
        <Typography>Add</Typography>
      </Breadcrumbs>
      <button
        className="focus:outline-none flex px-4 py-2 bg-light-orange text-black w-fit rounded-md mb-4 cursor-pointer"
        onClick={backHandler}
        type="button"
      >
        Kembali
      </button>
      <form onSubmit={handleSubmit}>
        <Card className="mt-4">
          <CardContent>
            <div className="flex flex-col gap-3">
              <div>
                <strong>Nama Kelas:</strong> {dataKelas.nama}
              </div>
              <div>
                <strong>Wali Kelas:</strong> {dataKelas.wali_kelas}
              </div>
              <TableContainer component={Paper} className="mt-4">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={
                            selectedRows.length === dataSiswa.length &&
                            dataSiswa.length > 0
                          }
                          onChange={(e) => {
                            setSelectedRows(
                              e.target.checked
                                ? dataSiswa.map((row) => row.id_siswa) // 🔁 Ganti dari row.nis
                                : []
                            );
                          }}
                        />
                      </TableCell>
                      <TableCell>NIS</TableCell>
                      <TableCell>Nama</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataSiswa.map((row) => (
                      <TableRow key={row.nis}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedRows.includes(row.id_siswa)} // 🔁 Ganti dari row.nis
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setSelectedRows((prev) =>
                                checked
                                  ? [...prev, row.id_siswa] // 🔁 Ganti dari row.nis
                                  : prev.filter((id) => id !== row.id_siswa)
                              );
                            }}
                          />
                        </TableCell>
                        <TableCell>{row.nis}</TableCell>
                        <TableCell>{row.nama}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </CardContent>
          <CardActions className="justify-end px-6 pb-6">
            <button
              type="submit"
              className="w-40 py-2 bg-soft-blue text-white font-semibold rounded-md"
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
