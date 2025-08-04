"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import FormControl from "@mui/material/FormControl";
import { InputLabel, Select, MenuItem } from "@mui/material";
import { getListTahunPeriode } from "@/app/actions/periode";
import { getListKelasByGuruIdPeriode, getListKelasBySiswa } from "@/app/actions/kelas";

export default function TugasPage() {
  const [role, setRole] = useState("");
  const [dataKelas, setDataKelas] = useState([]);
  const [dataPeriode, setDataPeriode] = useState([]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [alertStatus, setAlertStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [payload, setPayload] = useState({
    limit: 10,
    page: 1,
    search: "",
    tahun: "",
  });

  useEffect(() => {
    const roleId = localStorage.getItem("roleId");
    if (roleId == 1) {
      setRole("admin");
    } else if (roleId == 2) {
      setRole("guru");
    } else if (roleId == 3) {
      setRole("siswa");
    }
    getDataPeriode();
  }, []);

  useEffect(() => {
    if (!payload.id_periode) {
      setDataKelas([]); // Kosongkan kelas jika periode belum dipilih
    }
  }, [payload.id_periode]);

  useEffect(() => {
    getDataKelas();
  }, [payload]);

  const getDataPeriode = async () => {
    try {
      const listPeriode = await getListTahunPeriode();

      if (listPeriode.status == 200) {
        setDataPeriode(listPeriode.data);
        if (listPeriode.data?.length > 0) {
          const lastTahun = listPeriode.data.length - 1;
          setPayload({...payload, tahun: listPeriode.data[lastTahun].tahun});
        }
      } else {
        setOpen(true);
        setMessage(listPeriode.message);
        setAlertStatus("error");
      }
    } catch (error) {
      setOpen(true);
      setMessage("Terjadi kesalahan");
      setAlertStatus("error");
    }
  };

  const handleChangePeriode = (value) => {
    setPayload({
      ...payload,
      tahun: value,
    });
    
  };

  const getDataKelas = async () => {
    if (!payload.tahun) return;
    const roleId = localStorage.getItem("roleId");
    try {
      if (roleId == 2) {
        const listKelas = await getListKelasByGuruIdPeriode(payload);

        if (listKelas.status == 200) {
          setDataKelas(listKelas.data);
        } else {
          setOpen(true);
          setMessage(listKelas.message);
          setAlertStatus("error");
        }
      } else if (roleId == 3) {
        const listKelas = await getListKelasBySiswa(payload);
        console.log(listKelas);
        

        if (listKelas.status == 200) {
          setDataKelas(listKelas.data);
        } else {
          setOpen(true);
          setMessage(listKelas.message);
          setAlertStatus("error");
        }
      }
    } catch (error) {
      setOpen(true);
      setMessage("Terjadi kesalahan");
      setAlertStatus("error");
    }
  };

  const searchHandler = (searchValue) => {
    setPayload({
      ...payload,
      page: 1,
      search: searchValue,
    });
  };

  const renderList = () => {
    if (role == "guru") {
      return (
        <div className="mt-2 w-full">
          <div className="flex flex-row w-full justify-between items-center gap-2 mb-4">
            <div className="flex flex-row gap-4">
            <Link href="/dashboard/tugas/add">
              <button className="focus:outline-none bg-green text-white py-3 px-4 rounded-md gap-2 cursor-pointer">
                <AddIcon />
                <span>Tambah Tugas</span>
              </button>
            </Link>
            <FormControl sx={{ width: 200 }}>
              <InputLabel id="periode-select-label">Periode</InputLabel>
              <Select
                labelId="periode-select-label"
                id="periode-select"
                value={payload.tahun}
                label="Periode"
                onChange={(e) => handleChangePeriode(e.target.value)}
              >
                {dataPeriode.map((data) => (
                  <MenuItem key={data.tahun} value={data.tahun}>
                    {data.tahun}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <span>Search:</span>
              <TextField
                variant="outlined"
                size="small"
                onChange={(event) => searchHandler(event.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 justify-start gap-4 mt-16">
            {dataKelas.map((kelas) => (
              <Link
                key={kelas.id_kelas}
                href={`/dashboard/tugas/${kelas.id_kelas}`}
                className="flex flex-col rounded-lg bg-light-pink overflow-hidden cursor-pointer"
              >
                <div className="flex w-full py-4 justify-center">
                  <img src="/icons/mata_pelajaran.svg" alt="mata pelajaran" />
                </div>
                <div className="flex bg-black text-white w-full justify-center py-3 text-lg font-bold">
                  {kelas.nama}
                </div>
              </Link>
            ))}
          </div>
        </div>
      );
    }

    if (role == "siswa") {
      return (
        <div className="mt-2 w-full">
           <div className="flex flex-row justify-between items-center mb-4">
          <FormControl sx={{ width: 200 }}>
            <InputLabel id="periode-select-label">Periode</InputLabel>
            <Select
              labelId="periode-select-label"
              id="periode-select"
              value={payload.tahun}
              label="Kelas"
              onChange={(e) => handleChangePeriode(e.target.value)}
            >
              {dataPeriode.map((data) => (
                <MenuItem key={data.tahun} value={data.tahun}>
                  {data.tahun}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div className="flex flex-row gap-2 items-center justify-end">
            <span>Search:</span>
            <TextField
              variant="outlined"
              size="small"
              onChange={(event) => searchHandler(event.target.value)}
            />
          </div>
          </div>
          <div className="grid grid-cols-4 justify-start gap-4 mt-16">
            {dataKelas.map((kelas) => (
              <Link
                key={kelas.id_kelas}
                href={`/dashboard/tugas/${kelas.id_kelas}`}
                className="flex flex-col rounded-lg bg-light-pink overflow-hidden cursor-pointer"
              >
                <div className="flex w-full py-4 justify-center">
                  <img src="/icons/mata_pelajaran.svg" alt="mata pelajaran" />
                </div>
                <div className="flex bg-black text-white w-full justify-center py-3 text-lg font-bold">
                  {kelas.nama_kelas}
                </div>
              </Link>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col w-full p-4">
      <Breadcrumbs aria-label="breadcrumb">
        <Typography>Tugas</Typography>
      </Breadcrumbs>
      {renderList()}
    </div>
  );
}
