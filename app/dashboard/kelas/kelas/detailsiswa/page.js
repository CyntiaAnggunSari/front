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
import { FormControl } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { getListKelasSiswa, deleteKelasSiswa } from "@/app/actions/kelas";
import { getDetailKelas } from "@/app/actions/kelas";
import { redirect } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function KelasKelasSiswaPage() {
  const [dataKelasSiswa, setDataKelasSiswa] = useState([]);
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [alertStatus, setAlertStatus] = useState("");
  const [id_kelas_siswa, setId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [dataKelas, setDataKelas] = useState({});
  const [payload, setPayload] = useState({
    limit: 10,
    page: 1,
    search: "",
    id_kelas: search || "",
  });

  useEffect(() => {
    if (search) {
      setPayload((prev) => ({
        ...prev,
        id_kelas: search,
      }));
      getDataKelas(); // memanggil detail info kelas juga
    }
  }, [search]);

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

  const deleteDataKelasSiswa = async () => {
    setIsLoading(true);
    try {
      const data = { id_ks: id_kelas_siswa };
      const result = await deleteKelasSiswa(data);
      if (result.status == 200) {
        getDataKelasSiswa();
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

  useEffect(() => {
    getDataKelasSiswa();
  }, [payload]);

  const getDataKelasSiswa = async () => {
    if (!payload.id_kelas) return; // pastikan id_kelas ada
    try {
      const listKelasSiswa = await getListKelasSiswa(payload); // payload sudah termasuk id_kelas
      if (listKelasSiswa.status == 200) {
        setDataKelasSiswa(listKelasSiswa.data);
      } else {
        setOpen(true);
        setMessage(listKelasSiswa.message);
        setAlertStatus("error");
      }
    } catch (error) {
      setOpen(true);
      setMessage("Terjadi kesalahan");
      setAlertStatus("error");
    }
  };

  const getDataKelas = async () => {
    try {
      const data = { id: search };
      const res = await getDetailKelas(data);
      if (res.status === 200) {
        setDataKelas(res.data);
      } else {
        showError(res.message);
      }
    } catch {
      showError("Terjadi kesalahan saat mengambil data kelas.");
    }
  };

  const deleteHandler = (data) => {
    setId(data.id_ks);
    setOpenConfirm(true);
  };

  const handleClose = () => {
    setOpenConfirm(false);
  };

  const columns = [
    { id: "no", label: "No", align: "center" },
    { id: "nis", label: "Nis" },
    { id: "nama_siswa", label: "Siswa" },
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

  const backHandler = () => {
    return redirect("/dashboard/kelas/kelas");
  };

  console.log("📦 Data siswa:", dataKelasSiswa);
  return (
    <div className="flex flex-col w-full p-4">
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/dashboard">
          Dashboard
        </Link>
        <Link underline="hover" color="inherit" href="/dashboard/kelas">
          Kelas
        </Link>
        <Typography>Kelas Siswa</Typography>
      </Breadcrumbs>
      <div className="mt-2 w-full">
        <button
          className="focus:outline-none flex mt-4 px-4 py-2 bg-light-orange text-black w-fit rounded-md mb-4 cursor-pointer"
          onClick={backHandler}
          type="button"
        >
          Kembali
        </button>
        <Card>
          <CardContent>
            <div className="flex flex-row w-full justify-between items-center gap-2 mb-4">
              <div className="flex flex-row gap-2 items-center">
                <span>Search:</span>
                <TextField
                  variant="outlined"
                  size="small"
                  onChange={(event) => searchHandler(event.target.value)}
                />
              </div>
            </div>
            <FormControl fullWidth>
              <div className="flex flex-row">
                <div className="w-40">Nama Kelas</div>
                <div>: {dataKelas.nama}</div>
              </div>
            </FormControl>
            <FormControl fullWidth>
              <div className="flex flex-row">
                <div className="w-40">Wali Kelas</div>
                <div>: {dataKelas.wali_kelas}</div>
              </div>
            </FormControl>
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
                    {dataKelasSiswa.map((row, index) => {
                      const rowWithNo = {
                        ...row,
                        no: (payload.page - 1) * payload.limit + index + 1,
                      };
                      return (
                        <TableRow
                          key={row.id_ks}
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
                count={dataKelasSiswa.length}
                rowsPerPage={payload.limit}
                page={payload.page - 1}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                slotProps={{
                  actions: {
                    nextButton: {
                      disabled: dataKelasSiswa.length < payload.limit,
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
                onClick={deleteDataKelasSiswa}
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
