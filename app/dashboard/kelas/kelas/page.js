"use client";
import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import { InputLabel, Select } from "@mui/material";
import { getListTahunPeriode } from "@/app/actions/periode";
import { getListKelas, deleteKelas } from "@/app/actions/kelas";
import { redirect } from "next/navigation";

export default function KelasKelasPage() {
  const [role, setRole] = useState("");
  const [dataKelas, setDataKelas] = useState([]);
  const [open, setOpen] = useState(false);
  const [dataPeriode, setDataPeriode] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const [alertStatus, setAlertStatus] = useState("");
  const [id_kelas, setId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [payload, setPayload] = useState({
    limit: 10,
    page: 1,
    search: "",
    tahun: "",
  });

  useEffect(() => {
    const roleId = localStorage.getItem("roleId");
    if (roleId == 1) setRole("admin");
    getDataPeriode();
  }, []);

  useEffect(() => {
    if (payload.tahun) {
      getDataKelas();
    } else {
      setDataKelas([]); // Kosongkan jika belum pilih periode
    }
  }, [payload]);

  const handleChangePage = (event, newPage) => {
    setPayload({ ...payload, page: newPage + 1 });
  };

  const handleChangeRowsPerPage = (event) => {
    setPayload({ ...payload, limit: event.target.value, page: 1 });
  };

  const searchHandler = (searchValue) => {
    setPayload({ ...payload, page: 1, search: searchValue });
  };

  const viewHandler = (data) => {
    return redirect(
      `/dashboard/kelas/kelas/detailsiswa?search=${data.id_kelas}`
    );
  };

  const editHandler = (data) => {
    return redirect(`/dashboard/kelas/kelas/edit?search=${data.id_kelas}`);
  };

  const createHandler = (data) => {
    return redirect(
      `/dashboard/kelas/kelas/tambahsiswa?search=${data.id_kelas}`
    );
  };

  const deleteHandler = (data) => {
    setId(data.id_kelas);
    setOpenConfirm(true);
  };

  const getDataKelas = async () => {
    if (!payload.tahun) return;
    try {
      const listKelas = await getListKelas(payload);
      if (listKelas.status == 200) {
        setDataKelas(listKelas.data);
      } else {
        setOpen(true);
        setMessage(listKelas.message);
        setAlertStatus("error");
      }
    } catch (error) {
      setOpen(true);
      setMessage("Terjadi kesalahan");
      setAlertStatus("error");
    }
  };

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
      page: 1,
    });
  };

  const deleteDataKelas = async () => {
    setIsLoading(true);
    try {
      const data = { id_kelas };
      const result = await deleteKelas(data);

      if (result.status == 200) {
        getDataKelas();
        setId("");
        setOpen(true);
        setMessage(result.message);
        setAlertStatus("success");
      } else {
        setOpen(true);
        setMessage(result.message);
        setAlertStatus("error");
        setId("");
      }
    } catch (error) {
      setOpen(true);
      setMessage("Terjadi kesalahan");
      setAlertStatus("error");
    } finally {
      setIsLoading(false);
      setOpenConfirm(false);
    }
  };

  const columns = [
    { id: "no", label: "No", align: "center" },
    { id: "nama", label: "Nama" },
    { id: "wali_kelas", label: "Wali Kelas" },
    {
      id: "action",
      label: "Action",
      align: "center",
      cell: (row) => (
        <div className="flex flex-row justify-center items-center gap-2">
          <button
            className="p-2 bg-soft-blue rounded-md text-white"
            onClick={() => viewHandler(row)}
          >
            Lihat
          </button>
          <button
            className="p-2 bg-dark-orange rounded-md text-white"
            onClick={() => editHandler(row)}
          >
            Edit
          </button>
          <button
            className="p-2 bg-red-800 rounded-md text-white"
            onClick={() => deleteHandler(row)}
          >
            Delete
          </button>
          <button
            className="p-2 bg-blue-800 rounded-md text-white"
            onClick={() => createHandler(row)}
          >
            Tambah Siswa
          </button>
        </div>
      ),
    },
  ];

  const handleClose = () => setOpenConfirm(false);
  const backHandler = () => redirect("/dashboard/");

  return (
    <div className="flex flex-col w-full p-4">
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/dashboard">
          Dashboard
        </Link>
        <Typography>Kelas</Typography>
      </Breadcrumbs>

      <div className="mt-2 w-full">
        <button
          className="flex mt-4 px-4 py-2 bg-light-orange text-black w-fit rounded-md mb-4"
          onClick={backHandler}
        >
          Kembali
        </button>

        <Card>
          <CardContent>
            <div className="flex flex-row w-full justify-between items-center gap-2 mb-4">
              <Link href="/dashboard/kelas/kelas/add">
                <button className="bg-green text-white py-3 px-4 rounded-md flex gap-2 items-center">
                  <AddIcon />
                  Tambah Data
                </button>
              </Link>

              <FormControl sx={{ width: 200 }}>
                <InputLabel id="periode-select-label">Tahun Ajaran</InputLabel>
                <Select
                  labelId="periode-select-label"
                  id="periode-select"
                  value={payload.tahun}
                  label="Tahun Ajaran"
                  onChange={(e) => handleChangePeriode(e.target.value)}
                >
                  {dataPeriode.map((data) => (
                    <MenuItem key={data.tahun} value={data.tahun}>
                      {data.tahun}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <div className="flex flex-row gap-2 items-center">
                <span>Search:</span>
                <TextField
                  variant="outlined"
                  size="small"
                  onChange={(event) => searchHandler(event.target.value)}
                />
              </div>
            </div>

            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader>
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
                     {dataKelas.map((row, index) => {
                      const rowWithNo = {
                        ...row,
                        no: (payload.page - 1) * payload.limit + index + 1,
                      };
                      return (
                        <TableRow
                          key={row.nama}
                          hover
                          role="checkbox"
                          tabIndex={-1}
                        >
                          {columns.map((column) => {
                            const value = rowWithNo[column.id];
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {column.cell ? column.cell(rowWithNo) : value}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={dataKelas.length}
                rowsPerPage={payload.limit}
                page={payload.page - 1}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </CardContent>
        </Card>

        <Dialog onClose={handleClose} open={openConfirm}>
          <div className="flex flex-col w-fit p-4">
            <span>Apakah anda yakin menghapus data ini?</span>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={handleClose}
                className="border border-blue-800 text-blue-800 w-20 py-2 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={deleteDataKelas}
                className="bg-blue-800 text-white w-20 py-2 rounded-lg"
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={20} /> : "Hapus"}
              </button>
            </div>
          </div>
        </Dialog>

        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={() => setOpen(false)}
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
    </div>
  );
}
