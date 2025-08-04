"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import TextField from "@mui/material/TextField";
import { getListPeriode } from "@/app/actions/periode";
import AddIcon from "@mui/icons-material/Add";
import { MenuItem, InputLabel, Select, FormControl } from "@mui/material";
import { getListTugasGuru, getListTugasByKelas } from "@/app/actions/tugas";

export default function MateriMatapelajaranPage() {
  const { kelas, matapelajaran } = useParams();
  const [role, setRole] = useState("");
  const [dataTugas, setDataTugas] = useState([]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [periode, setPeriode] = useState("");
  const [dataPeriode, setDataPeriode] = useState([]);
  const [alertStatus, setAlertStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [payload, setPayload] = useState({
    limit: 10,
    page: 1,
    search: "",
    kelasId: kelas,
    matapelajaranId: matapelajaran,
    id_periode: "",
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
    getDataTugas();
    getDataPeriode();
  }, []);

  useEffect(() => {
    getDataTugas();
  }, [payload]);

  const getDataPeriode = async () => {
    try {
      const listPeriode = await getListPeriode({
        limit: 10,
        page: 1,
        search: "",
      });

      if (listPeriode.status == 200) {
        setDataPeriode(listPeriode.data);
        if (listPeriode.data?.length > 0) {
          const lastPeriode = listPeriode.data.length - 1;
          setPayload({...payload, id_periode: listPeriode.data[lastPeriode].id_periode});
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
      id_periode: value,
    });
    const getPeriode = dataPeriode.find(
      (periode) => periode.id_periode == value
    );
    if (getPeriode) {
      setPeriode(`${getPeriode.semester} ${getPeriode.tahun}`);
    }
  };

  const getDataTugas = async () => {
    const roleId = localStorage.getItem("roleId");
    try {
      if (roleId == 2) {
        const listTugas = await getListTugasGuru(payload);

        if (listTugas.status == 200) {
          setDataTugas(listTugas.data);
        } else {
          setOpen(true);
          setMessage(listTugas.message);
          setAlertStatus("error");
        }
      } else if (roleId == 3) {
        const listTugas = await getListTugasByKelas(payload);

        if (listTugas.status == 200) {
          setDataTugas(listTugas.data);
        } else {
          setOpen(true);
          setMessage(listTugas.message);
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

  return (
    <div className="flex flex-col w-full p-4">
      <Breadcrumbs aria-label="breadcrumb">
        <Typography>Tugas</Typography>
      </Breadcrumbs>
      <div className="mt-2 w-full">
        <div className="flex flex-row w-full justify-between items-center gap-2 mb-4">
          <div className="flex flex-row gap-4">
            {role == "guru" && (
              <Link href="/dashboard/tugas/add">
                <button className="focus:outline-none bg-green text-white py-3 px-4 rounded-md gap-2 cursor-pointer">
                  <AddIcon />
                  <span>Tambah Tugas</span>
                </button>
              </Link>
            )}
            <FormControl sx={{ width: 200 }}>
              <InputLabel id="periode-select-label">Periode</InputLabel>
              <Select
                labelId="periode-select-label"
                id="periode-select"
                value={payload.id_periode || ""}
                onChange={(e) => handleChangePeriode(e.target.value)}
              >
                {dataPeriode.map((data) => (
                  <MenuItem key={data.id_periode} value={data.id_periode}>
                    {data.semester} {data.tahun}
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
          {dataTugas.map((tugas) => (
            <Link
              key={tugas.id_tugas}
              href={`/dashboard/tugas/detail/${tugas.id_tugas}`}
              className="flex flex-col rounded-lg bg-light-pink overflow-hidden cursor-pointer"
            >
              <div className="flex w-full py-4 justify-center">
                <img src="/icons/mata_pelajaran.svg" alt="mata pelajaran" />
              </div>
              <div className="flex bg-black text-white w-full justify-center py-3 text-lg font-bold">
                {tugas.judul}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
