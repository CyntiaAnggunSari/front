"use client";
import React, { useState, useEffect, useRef } from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Image from "next/image";
import { MenuItem, Select, FormControl } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import { getListKelasByGuru, getListKelasBySiswa } from "@/app/actions/kelas";
import { getListNilaiSiswa } from "@/app/actions/nilai";
import {
  getListMatapelajaranByGuruIdPeriode,
  getMatapelajaran,
} from "@/app/actions/matapelajaran";
import { getListPeriode } from "@/app/actions/periode";
import { getListSiswaByKelas } from "@/app/actions/siswa";

export default function TugasPage() {
  const [role, setRole] = useState("");
  const [dataKelas, setDataKelas] = useState([]);
  const [dataNilai, setDataNilai] = useState([]);
  const [dataPeriode, setDataPeriode] = useState([]);
  const [dataMapel, setDataMapel] = useState([]);
  const [dataSiswa, setDataSiswa] = useState([]);
  const [columns, setColumns] = useState([]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [alertStatus, setAlertStatus] = useState("");
  const [idKelas, setIdKelas] = useState("");
  const [namaKelas, setNamaKelas] = useState("");
  const [namaSiswa, setNamaSiswa] = useState("");
  const [namaMapel, setNamaMapel] = useState("");
  const [periode, setPeriode] = useState("");
  const [payload, setPayload] = useState({
    id_kelas: "",
    id_mapel: "",
    id_periode: "",
    id_siswa: "",
    tahun: "",
  });
  const [payloadMapel, setPayloadMapel] = useState({
    id_kelas: "",
    id_mapel: "",
    tahun: "",
  });

  const [html2pdf, setHtml2pdf] = useState(null);
  const contentRef = useRef(null);

  const moment = require("moment-timezone");

  useEffect(() => {
    const roleId = localStorage.getItem("roleId");
    if (roleId == 1) {
      setRole("admin");
    } else if (roleId == 2) {
      setRole("guru");
    } else if (roleId == 3) {
      setRole("siswa");
      const nama = localStorage.getItem("nama");
      setNamaSiswa(nama);
    }
    getDataKelas();
    getDataPeriode();
  }, []);

  useEffect(() => {
    getDataNilai();
    getDataMapel();
    getDataKelas();
  }, [payload]);

  useEffect(() => {
    getDataMapel();
  }, [payloadMapel]);

  useEffect(() => {
    getDataSiswa();
  }, [idKelas]);

  useEffect(() => {
    import("html2pdf.js").then((module) => {
      setHtml2pdf(() => module.default);
    });
  }, []);

  const getDataNilai = async () => {
    const roleId = localStorage.getItem("roleId");
    try {
      if (roleId == 2) {
        const listNilai = await getListNilaiSiswa(payload);

        if (listNilai.status == 200) {
          if (payload.id_siswa == "") {
            setColumns([
              { id: "siswa", label: "Nama Siswa" },
              { id: "nilai", label: "Nilai Rata - Rata" },
            ]);
          } else {
            setColumns([
              { id: "judul", label: "Judul" },
              { id: "nilai", label: "Nilai" },
            ]);
          }
          setDataNilai(listNilai.data);
        } else {
          setOpen(true);
          setMessage(listNilai.message);
          setAlertStatus("error");
        }
      } else if (roleId == 3) {
        const listNilai = await getListNilaiSiswa(payload);

        if (listNilai.status == 200) {
          if (payload.id_mapel == "") {
            setColumns([
              { id: "matapelajaran", label: "Matapelajaran" },
              { id: "nilai", label: "Nilai Rata - Rata" },
            ]);
          } else {
            setColumns([
              { id: "judul", label: "Judul" },
              { id: "nilai", label: "Nilai" },
            ]);
          }
          setDataNilai(listNilai.data);
        } else {
          setOpen(true);
          setMessage(listNilai.message);
          setAlertStatus("error");
        }
      }
    } catch (error) {
      setOpen(true);
      setMessage("Terjadi kesalahan");
      setAlertStatus("error");
    }
  };

  const getDataKelas = async () => {
    const roleId = localStorage.getItem("roleId");
    try {
      if (roleId == 2) {
        const listKelas = await getListKelasByGuru({
          search: "",
          tahun: payload.tahun,
        });

        if (listKelas.status == 200) {
          setDataKelas(listKelas.data);
        } else {
          setOpen(true);
          setMessage(listKelas.message);
          setAlertStatus("error");
        }
      } else if (roleId == 3) {
        const listKelas = await getListKelasBySiswa({
          search: "",
          tahun: payload.tahun,
        });

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

  const getDataPeriode = async () => {
    try {
      const listPeriode = await getListPeriode({
        limit: 1000,
        page: 1,
        search: "",
      });

      if (listPeriode.status == 200) {
        setDataPeriode(listPeriode.data);
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

  const getDataMapel = async () => {
    const roleId = localStorage.getItem("roleId");
    try {
      if (roleId == 2) {    
        const listMapel = await getListMatapelajaranByGuruIdPeriode(
          payloadMapel
        );

        if (listMapel.status == 200) {
          setDataMapel(listMapel.data);
        } else {
          setOpen(true);
          setMessage(listMapel.message);
          setAlertStatus("error");
        }
      } else if (roleId == 3) {
        const findTahun = dataPeriode.find(
          (value) => payload.id_periode == value.id_periode
        );
        const payloadData = { ...payloadMapel, tahun: findTahun.tahun };
        const listMapel = await getMatapelajaran(payloadData);

        if (listMapel.status == 200) {
          setDataMapel(listMapel.data);
        } else {
          setOpen(true);
          setMessage(listMapel.message);
          setAlertStatus("error");
        }
      }
    } catch (error) {
      setOpen(true);
      setMessage("Terjadi kesalahan");
      setAlertStatus("error");
    }
  };

  const getDataSiswa = async () => {
    try {
      const listSiswa = await getListSiswaByKelas({ id_kelas: idKelas });

      if (listSiswa.status == 200) {
        setDataSiswa(listSiswa.data);
      } else {
        setOpen(true);
        setMessage(listSiswa.message);
        setAlertStatus("error");
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

  const handleChangeKelas = (value) => {
    setPayload({
      ...payload,
      id_kelas: value,
    });
    setPayloadMapel({
      ...payloadMapel,
      id_kelas: value,
    });
    setIdKelas(value);
    const getKelas = dataKelas.find((kelas) => kelas.id_kelas == value);
    if (role == "guru") {
      setNamaKelas(getKelas.nama);
    } else {
      setNamaKelas(getKelas.nama_kelas);
    }
  };

  const handleChangePeriode = (value) => {
    const getPeriode = dataPeriode.find(
      (periode) => periode.id_periode == value
    );
    setPayload({
      ...payload,
      id_periode: value,
      tahun: getPeriode.tahun
    });
    setPayloadMapel({
      ...payloadMapel,
      id_periode: value,
      tahun: getPeriode.tahun
    });
    
    setPeriode(`${getPeriode.semester} ${getPeriode.tahun}`);
  };

  const handleChangeMapel = (value) => {
    setPayload({
      ...payload,
      id_mapel: value,
    });
    const getMapel = dataMapel.find((mapel) => mapel.id_mp == value);
    setNamaMapel(getMapel.nama_mp);
  };

  const handleChangeSiswa = (value) => {
    setPayload({
      ...payload,
      id_siswa: value,
    });
    const getSiswa = dataSiswa.find((siswa) => siswa.id_siswa == value);
    setNamaSiswa(getSiswa.nama);
  };

  const convertToPdf = () => {
    const content = contentRef.current;

    const options = {
      filename: "laporan-nilai.pdf",
      margin: 1,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: {
        unit: "in",
        format: "letter",
        orientation: "portrait",
      },
    };

    html2pdf().set(options).from(content).save();
  };

  const renderList = () => {
    if (role == "guru") {
      return (
        <div className="mt-2 w-full">
          <div className="w-full flex flex-row justify-between items-center rounded-md bg-white shadow-md p-4">
            <div className="flex flex-row gap-2">
              <FormControl sx={{ width: 200 }}>
                <InputLabel id="periode-select-label">Periode</InputLabel>
                <Select
                  labelId="periode-select-label"
                  id="periode-select"
                  value={payload.id_periode}
                  label="Kelas"
                  onChange={(e) => handleChangePeriode(e.target.value)}
                >
                  {dataPeriode.map((data) => (
                    <MenuItem key={data.id_periode} value={data.id_periode}>
                      {data.semester} {data.tahun}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ width: 200 }}>
                <InputLabel id="kelas-select-label">Kelas</InputLabel>
                <Select
                  labelId="kelas-select-label"
                  id="kelas-select"
                  value={payload.id_kelas}
                  label="Kelas"
                  onChange={(e) => handleChangeKelas(e.target.value)}
                >
                  {dataKelas.map((data, index) => (
                    <MenuItem
                      key={`${data.id_kelas}-${index}`}
                      value={data.id_kelas}
                    >
                      {data.nama}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ width: 200 }}>
                <InputLabel id="mapel-select-label">Matapelajaran</InputLabel>
                <Select
                  labelId="mapel-select-label"
                  id="mapel-select"
                  value={payload.id_mapel}
                  label="Kelas"
                  onChange={(e) => handleChangeMapel(e.target.value)}
                >
                  {dataMapel.map((data) => (
                    <MenuItem key={data.id_mp} value={data.id_mp}>
                      {data.nama_mp}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ width: 200 }}>
                <InputLabel id="mapel-select-label">Siswa</InputLabel>
                <Select
                  labelId="mapel-select-label"
                  id="mapel-select"
                  value={payload.id_siswa}
                  label="Kelas"
                  onChange={(e) => handleChangeSiswa(e.target.value)}
                >
                  {dataSiswa.map((data) => (
                    <MenuItem key={data.id_siswa} value={data.id_siswa}>
                      {data.nama}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="flex justify-end items-center">
              <button
                type="button"
                className="px-4 py-3 bg-green text-white font-bold rounded-md cursor-pointer"
                onClick={convertToPdf}
              >
                Cetak Laporan
              </button>
            </div>
          </div>
          <div className="flex flex-row w-full justify-start gap-16 mt-16">
            <Card sx={{ width: "100%" }}>
              <CardContent>
                <Paper sx={{ width: "100%", overflow: "hidden" }}>
                  <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                          {columns.map((column) => (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              style={{ minWidth: column.minWidth }}
                            >
                              {column.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dataNilai.map((row) => {
                          return (
                            <TableRow hover tabIndex={-1} key={row.id}>
                              {columns.map((column) => {
                                const value = row[column.id];
                                return (
                                  <TableCell
                                    key={column.id}
                                    align={column.align}
                                  >
                                    {column.format
                                      ? column.format(value)
                                      : column.cell
                                      ? column.cell(row)
                                      : value}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    if (role == "siswa") {
      return (
        <div className="mt-2 w-full">
          <div className="w-full flex flex-row justify-between items-center rounded-md bg-white shadow-md p-4">
            <div className="flex flex-row gap-2">
              <FormControl sx={{ width: 200 }}>
                <InputLabel id="periode-select-label">Periode</InputLabel>
                <Select
                  labelId="periode-select-label"
                  id="periode-select"
                  value={payload.id_periode}
                  label="Kelas"
                  onChange={(e) => handleChangePeriode(e.target.value)}
                >
                  {dataPeriode.map((data) => (
                    <MenuItem key={data.id_periode} value={data.id_periode}>
                      {data.semester} {data.tahun}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ width: 200 }}>
                <InputLabel id="kelas-select-label">Kelas</InputLabel>
                <Select
                  labelId="kelas-select-label"
                  id="kelas-select"
                  value={payload.id_kelas}
                  label="Kelas"
                  onChange={(e) => handleChangeKelas(e.target.value)}
                >
                  {dataKelas.map((data) => (
                    <MenuItem key={data.id_kelas} value={data.id_kelas}>
                      {data.nama_kelas}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ width: 200 }}>
                <InputLabel id="mapel-select-label">Matapelajaran</InputLabel>
                <Select
                  labelId="mapel-select-label"
                  id="mapel-select"
                  value={payload.id_mapel}
                  label="Kelas"
                  onChange={(e) => handleChangeMapel(e.target.value)}
                >
                  {dataMapel.map((data) => (
                    <MenuItem key={data.id_mp} value={data.id_mp}>
                      {data.nama_mp}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="flex justify-end items-center">
              <button
                type="button"
                className="px-4 py-3 bg-green text-white font-bold rounded-md cursor-pointer"
                onClick={convertToPdf}
              >
                Cetak Laporan
              </button>
            </div>
          </div>
          <div className="flex flex-row w-full justify-start gap-16 mt-16">
            <Card sx={{ width: "100%" }}>
              <CardContent>
                <Paper sx={{ width: "100%", overflow: "hidden" }}>
                  <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                          {columns.map((column) => (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              style={{ minWidth: column.minWidth }}
                            >
                              {column.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dataNilai.map((row) => {
                          return (
                            <TableRow hover tabIndex={-1} key={row.id}>
                              {columns.map((column) => {
                                const value = row[column.id];
                                return (
                                  <TableCell
                                    key={column.id}
                                    align={column.align}
                                  >
                                    {column.format
                                      ? column.format(value)
                                      : column.cell
                                      ? column.cell(row)
                                      : value}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col w-full p-4">
      <Breadcrumbs aria-label="breadcrumb">
        <Typography>Nilai</Typography>
      </Breadcrumbs>
      {renderList()}
      {/* Konten laporan tersembunyi dari tampilan biasa */}
      <div className="hidden">
        <div ref={contentRef}>
          <div className="flex flex-col w-full p-7">
            {/* Header Sekolah */}
            <div className="flex w-full gap-4 items-center bg-white text-black py-3 font-bold border-b-4 border-black mb-2">
              <Image
                src="/images/logo-sma.png"
                width={130}
                height={130}
                alt="Logo"
              />
              <div className="flex flex-col justify-center">
                <span className="font-bold font-serif text-2xl tracking-wide uppercase text-start">
                  SMA NEGERI 1 SUTERA
                </span>
                <h1 className="text-sm font-normal text-center">
                  Jl. Baru Cimpu Surantih Kec. Sutera Kab. Pesisir Selatan
                </h1>
              </div>
            </div>

            <div className="flex font-semibold font-serif text-xl justify-center items-center p-7">
              Laporan Nilai Siswa
            </div>
            <div className="flex flex-row mt-6">
              <div className="flex w-40 text-sm">Periode</div>
              <div className="text-sm">: {periode}</div>
            </div>
            <div className="flex flex-row mt-6">
              <div className="flex w-40 text-sm">Kelas</div>
              <div className="text-sm">: {namaKelas}</div>
            </div>
            {namaMapel != "" && (
              <div className="flex flex-row mt-6">
                <div className="flex w-40 text-sm">Matapelajaran</div>
                <div className="text-sm">: {namaMapel}</div>
              </div>
            )}
            {namaSiswa != "" && (
              <div className="flex flex-row mt-6">
                <div className="flex w-40 text-sm">Nama Siswa</div>
                <div className="text-sm">: {namaSiswa}</div>
              </div>
            )}
            <div className="flex w-full mt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="border border-black p-2">No</th>
                    {columns.map((column) => (
                      <th
                        key={column.id}
                        className="border border-l-0 border-black p-2"
                      >
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataNilai.map((data, index) => (
                    <tr key={data.id}>
                      <td className="border border-t-0 border-black p-2">
                        {index + 1}
                      </td>
                      {columns.map((column) => (
                        <td
                          key={column.id}
                          className="border border-l-0 border-t-0 border-black p-2"
                        >
                          {data[column.id]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Tanda Tangan Kepala Sekolah */}
          <div className="flex justify-end p-7">
            <div className="flex flex-col items-start text-left">
              <span className="font-normal tracking-wide uppercase">
                Surantih, {moment().tz("Asia/Jakarta").format("DD/MM/YYYY")}
              </span>
              <h1 className="font-normal mt-1">Kepala Sekolah</h1>
              <div className="mt-11 w-48 border-b border-black">
                <p className="font-bold mt-1">YULIWARMAN, S.Pd</p>
              </div>
              <p className="text-sm">NIP. 19700722 199512 1 001</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
