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
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import { InputLabel, Select } from "@mui/material";
import { getListTahunPeriode } from "@/app/actions/periode";
import CircularProgress from "@mui/material/CircularProgress";
import {
  getListMatapelajaran,
  deleteMatapelajaran,
} from "@/app/actions/matapelajaran";

export default function MatapelajaranPage() {
  const [role, setRole] = useState("");
  const [dataMatapelajaran, setDataMatapelajaran] = useState([]);
  const [id_matapelajaran, setId] = useState("");
  const [dataPeriode, setDataPeriode] = useState([]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [alertStatus, setAlertStatus] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [payload, setPayload] = useState({
    limit: 10,
    page: 1,
    search: "",
    tahun: "",
  });

  const handleChangePage = (event, newPage) => {
    setPayload({ ...payload, page: newPage + 1 });
  };

  const handleChangeRowsPerPage = (event) => {
    setPayload({ ...payload, limit: event.target.value, page: 1 });
  };

  const searchHandler = (searchValue) => {
    setPayload({
      ...payload,
      page: 1,
      search: searchValue,
    });
  };

  const deleteHandler = (data) => {
    setId(data.id_mp);
    setOpenConfirm(true);
  };

  useEffect(() => {
    const roleId = localStorage.getItem("roleId");
    if (roleId == 1) {
      setRole("admin");
    }
    getDataPeriode();
  }, []);

  useEffect(() => {
    if (payload.tahun) {
      getDataMatapelajaran();
    } else {
      setDataMatapelajaran([]); // Kosongkan jika belum pilih periode
    }
  }, [payload]);

  const getDataMatapelajaran = async () => {
    if (!payload.tahun) return;
    try {
      const listMatapelajaran = await getListMatapelajaran(payload);
      console.log(listMatapelajaran);

      if (listMatapelajaran.status == 200) {
        setDataMatapelajaran(listMatapelajaran.data);
      } else {
        setOpen(true);
        setMessage(listMatapelajaran.message);
        setAlertStatus("error");
      }
    } catch (error) {
      setOpen(true);
      setMessage("Terjadi kesalahan");
      setAlertStatus("error");
    }
  };
  const deleteDataMatapelajaran = async () => {
    setIsLoading(true);
    try {
      const data = { id_mp: id_matapelajaran };
      const result = await deleteMatapelajaran(data);
      if (result.status == 200) {
        getDataMatapelajaran();
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
      setIsLoading(false);
      setOpenConfirm(false);
    } catch (error) {
      setOpen(true);
      setMessage("Terjadi kesalahan");
      setAlertStatus("error");
      setIsLoading(false);
      setId("");
      setOpenConfirm(false);
    }
  };
  const handleClose = () => {
    setOpenConfirm(false);
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

  const columns = [
    { id: "no", label: "No", align: "center" },
    { id: "nama_mp", label: "Nama Matapelajaran" },
    { id: "guru_mp", label: "Guru Matapelajaran" },
    { id: "nama_kelas", label: "Kelas" },
    {
      id: "action",
      label: "Action",
      align: "center",
      cell: (row) => {
        return (
          <div className="flex flex-row justify-center items-center gap-2">
            <button
              type="button"
              className="p-2 bg-red-800 rounded-md text-white cursor-pointer"
              onClick={() => deleteHandler(row)}
            >
              Delete
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col w-full p-4">
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/dashboard">
          Dashboard
        </Link>
        <Typography>Mata Pelajaran</Typography>
      </Breadcrumbs>
      <div className="mt-2 w-full">
        <Card>
          <CardContent>
            <div className="flex flex-row w-full justify-between items-center gap-2 mb-4">
              <Link href="/dashboard/mata_pelajaran/add">
                <button className="focus:outline-none bg-green text-white py-3 px-4 rounded-md gap-2 cursor-pointer">
                  <AddIcon />
                  <span>Tambah Data</span>
                </button>
              </Link>
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
                      {data.semester} {data.tahun}
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
                    {dataMatapelajaran.map((row, index) => {
                      const rowWithNo = {
                        ...row,
                        no: (payload.page - 1) * payload.limit + index + 1,
                      };
                      return (
                        <TableRow
                          key={row.id_mp}
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
                count={dataMatapelajaran.length}
                rowsPerPage={payload.limit}
                page={payload.page - 1}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                slotProps={{
                  actions: {
                    nextButton: {
                      disabled: dataMatapelajaran.length < payload.limit,
                    },
                    previousButton: {
                      disabled: payload.page < 2,
                    },
                  },
                }}
              />
            </Paper>
          </CardContent>
        </Card>
        <Dialog onClose={handleClose} open={openConfirm}>
          <div className="flex flex-col w-fit p-4">
            <span>Apakah anda yakin menghapus data ini?</span>
            <div className="flex flex-row justify-end gap-3 mt-4">
              <button
                className="focus:outline-none flex w-20 py-2 justify-center border border-blue-800 font-bold text-blue-800 rounded-lg cursor-pointer"
                onClick={handleClose}
              >
                Batal
              </button>
              <button
                className="focus:outline-none flex w-20 py-2 justify-center border border-blue-800 font-bold text-white bg-blue-800 rounded-lg cursor-pointer"
                onClick={deleteDataMatapelajaran}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress /> : "Hapus"}
              </button>
            </div>
          </div>
        </Dialog>
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
