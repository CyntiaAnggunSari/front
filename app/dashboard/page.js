"use client";
import React, { useEffect, useState } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import moment from "moment";
import { getDataDashboard } from "../actions/dashboard";
import { getListPengumuman } from "../actions/pengumuman";
import "moment/locale/id";

export default function DashboardSiswaGuruAdmin() {
  const [role, setRole] = useState("");
  const [dataDashboard, setDataDashboard] = useState({});
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [alertStatus, setAlertStatus] = useState("");
  const [pengumuman, setPengumuman] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const roleId = localStorage.getItem("roleId");
    if (roleId == 1) {
      setRole("admin");
    } else if (roleId == 2) {
      setRole("guru");
    } else if (roleId == 3) {
      setRole("siswa");
    }
    getPengumuman();
    getData();
  }, []);

  const getData = async () => {
    try {
      const result = await getDataDashboard({});

      if (result.status == 200) {
        setDataDashboard(result.data);
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
  };

  const getPengumuman = async () => {
    try {
      const result = await getListPengumuman({
        limit: 100,
        page: 1,
        search: "",
      });

      if (result.status == 200) {
        setPengumuman(result.data);
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

  const renderRingakasan = () => {
    if (role == "guru") {
      return (
        <div className="grid grid-cols-4 gap-4 my-4">
          <div
            style={{ backgroundColor: "#d6c9bcff" }}
            className="flex flex-col w-full bg-blue-50 shadow-md rounded-md p-4"
          >
            <span className="text-xl">Jumlah Kelas</span>
            <span className="font-bold text-xl">
              {dataDashboard?.jumlahKelas}
            </span>
          </div>
          <div
            style={{ backgroundColor: "#d6c9bcff" }}
            className="flex flex-col w-full bg-blue-50 shadow-md rounded-md p-4"
          >
            <span className="text-xl">Jumlah Materi</span>
            <span className="font-bold text-xl">
              {dataDashboard?.jumlahMateri}
            </span>
          </div>
          <div
            style={{ backgroundColor: "#d6c9bcff" }}
            className="flex flex-col w-full bg-blue-50 shadow-md rounded-md p-4"
          >
            <span className="text-xl">Jumlah Tugas</span>
            <span className="font-bold text-xl">
              {dataDashboard?.jumlahTugas}
            </span>
          </div>
          <div
            style={{ backgroundColor: "#d6c9bcff" }}
            className="flex flex-col w-full bg-blue-50 shadow-md rounded-md p-4"
          >
            <span className="text-xl">Jumlah Tugas Aktif</span>
            <span className="font-bold text-xl">
              {dataDashboard?.jumlahTugasAktif}
            </span>
          </div>
        </div>
      );
    }

    if (role == "siswa") {
      return (
        <div className="grid grid-cols-4 gap-4 my-4">
          <div
            style={{ backgroundColor: "#d6c9bcff" }}
            className="flex flex-col w-full bg-blue-50 shadow-md rounded-md p-4"
          >
            <span className="text-xl">Jumlah Materi</span>
            <span className="font-bold text-xl">
              {dataDashboard?.jumlahMateri}
            </span>
          </div>
          <div
            style={{ backgroundColor: "#d6c9bcff" }}
            className="flex flex-col w-full bg-blue-50 shadow-md rounded-md p-4"
          >
            <span className="text-xl">Jumlah Tugas</span>
            <span className="font-bold text-xl">
              {dataDashboard?.jumlahTugas}
            </span>
          </div>
          <div
            style={{ backgroundColor: "#d6c9bcff" }}
            className="flex flex-col w-full bg-blue-50 shadow-md rounded-md p-4"
          >
            <span className="text-xl">Tugas Dikumpulkan</span>
            <span className="font-bold text-xl">
              {dataDashboard?.jumlahTugasDikumpulkan}
            </span>
          </div>
          <div
            style={{ backgroundColor: "#d6c9bcff" }}
            className="flex flex-col w-full bg-blue-50 shadow-md rounded-md p-4"
          >
            <span className="text-lg">Tugas Belum Dikumpulkan</span>
            <span className="font-bold text-xl">
              {dataDashboard?.JumlahTugasBelumDikumpulkan}
            </span>
          </div>
        </div>
      );
    }

    if (role == "admin") {
      return (
        <div className="grid grid-cols-3 gap-4 my-4">
          <div
            style={{ backgroundColor: "#d6c9bcff" }}
            className="flex flex-col w-full bg-blue-50 shadow-md rounded-md p-4"
          >
            <span className="text-xl">Jumlah Kelas</span>
            <span className="font-bold text-xl">
              {dataDashboard?.jumlahKelas}
            </span>
          </div>
          <div
            style={{ backgroundColor: "#d6c9bcff" }}
            className="flex flex-col w-full bg-blue-50 shadow-md rounded-md p-4"
          >
            <span className="text-xl">Jumlah Guru</span>
            <span className="font-bold text-xl">
              {dataDashboard?.jumlahGuru}
            </span>
          </div>
          <div
            style={{ backgroundColor: "#d6c9bcff" }}
            className="flex flex-col w-full bg-blue-50 shadow-md rounded-md p-4"
          >
            <span className="text-xl">Jumlah Siswa</span>
            <span className="font-bold text-xl">
              {dataDashboard?.jumlahSiswa}
            </span>
          </div>
        </div>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex w-full h-full justify-center items-center">
        <CircularProgress size={46} />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <Box p={4}>
        <Typography variant="h4" gutterBottom>
          Dashboard {role.charAt(0).toUpperCase() + role.slice(1)}
        </Typography>

        {renderRingakasan()}

        {/* Tugas Aktif (Guru & Siswa) */}
        {role !== "admin" && (
          <div className="flex flex-col  w-full mt-6">
            {dataDashboard.listTugas?.length > 0 ? (
              <>
                <Typography variant="h6" gutterBottom>
                  Tugas Aktif{" "}
                  {role == "siswa" ? (
                    <span>({dataDashboard?.jumlahTugasAktif})</span>
                  ) : (
                    ""
                  )}
                </Typography>
                <TableContainer component={Paper}>
                  <Table className="bg-blue-50">
                    <TableHead>
                      <TableRow>
                        <TableCell>Judul</TableCell>
                        <TableCell>Mata Pelajaran</TableCell>
                        <TableCell>Tanggal Selesai</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dataDashboard.listTugas?.map((tugas, index) => (
                        <TableRow key={index}>
                          <TableCell>{tugas.judul}</TableCell>
                          <TableCell>{tugas.nama_mp}</TableCell>
                          <TableCell>
                            {moment(tugas.tanggal_selesai).format(
                              "DD MMMM YYYY HH:mm:ss"
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            ) : (
              <div className="flex w-full justify-center mt-8">
                <span className="text-lg">Tidak ada tugas aktif</span>
              </div>
            )}
          </div>
        )}

        {/* Pengumuman - SEMUA role */}
        <div className="flex flex-col w-full gap-4 mt-8">
          <span className="text-xl font-bold">Pengumuman</span>
          {pengumuman.length > 0 ? (
            pengumuman
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .map((data) => {
                const isNew =
                  (new Date() - new Date(data.created_at)) / (1000 * 60 * 60) <
                  24; // < 24 jam

                return (
                  <div
                    key={data.id}
                    className="flex flex-col w-full bg-blue-50 p-4 border border-gray-200 rounded-lg relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">
                        {data.judul}
                      </span>
                      {isNew && (
                        <span className="text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded-full">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-base mt-2">{data.isi}</p>
                    <span className="text-xs text-gray-600 mt-2">
                      {moment(data.created_at).format("DD MMMM YYYY HH:mm:ss")}
                    </span>
                  </div>
                );
              })
          ) : (
            <div className="flex w-full justify-center mt-8">
              <span className="text-lg">Belum ada pengumuman</span>
            </div>
          )}
        </div>

        {/* Snackbar untuk notifikasi */}
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
      </Box>
    </div>
  );
}
