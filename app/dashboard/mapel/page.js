"use client";
import React, { useState, useEffect, useRef } from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Image from "next/image";
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
import Dialog from "@mui/material/Dialog";
import AddIcon from "@mui/icons-material/Add";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Modal from "@mui/material/Modal";
import CircularProgress from "@mui/material/CircularProgress";
import { redirect } from "next/navigation";
import { getListMapel, deleteMapel } from "@/app/actions/matapelajaran";

export default function MapelPage() {
  const [dataMapel, setDataMapel] = useState([]);
  const [open, setOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [message, setMessage] = useState("");
  const [alertStatus, setAlertStatus] = useState("");
  const [id, setId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [payload, setPayload] = useState({
    limit: 10,
    page: 1,
    search: "",
  });

  const [html2pdf, setHtml2pdf] = useState(null);
  const contentRef = useRef(null);

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

  const viewHandler = (data) => {
    setSelectedData(data);
    setOpenView(true);
  };

  const closeiVewHandler = () => {
    setSelectedData({});
    setOpenView(false);
  };

  const editHandler = (data) => {
    return redirect(`/dashboard/mapel/edit?search=${data.id_mapel}`);
  };

  const deleteHandler = (data) => {
    setId(data.id_mapel);
    setOpenConfirm(true);
  };

  useEffect(() => {
    getDataMapel();
  }, [payload]);

  useEffect(() => {
    import("html2pdf.js").then((module) => {
      setHtml2pdf(() => module.default);
    });
  }, []);

  const getDataMapel = async () => {
    try {
      const listMapel = await getListMapel(payload);

      if (listMapel.status == 200) {
        setDataMapel(listMapel.data);
      } else {
        setOpen(true);
        setMessage(listMapel.message);
        setAlertStatus("error");
      }
    } catch (error) {
      setOpen(true);
      setMessage("Terjadi kesalahan");
      setAlertStatus("error");
    }
  };

  const deleteDataMapel = async () => {
    setIsLoading(true);
    try {
      const result = await deleteMapel({ id });

      if (result.status == 200) {
        getDataMapel();
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

  const columns = [
    { id: "no", label: "No", align: "center" },
    { id: "id_mapel", label: "Id Mapel" },
    { id: "nama_mapel", label: "Nama Matapelajaran" },
    {
      id: "action",
      label: "Action",
      align: "center",
      cell: (row) => {
        return (
          <div className="flex flex-row justify-center items-center gap-2">
            <button
              type="button"
              className="p-2 bg-soft-blue rounded-md text-white cursor-pointer"
              onClick={() => viewHandler(row)}
            >
              Lihat
            </button>
            <button
              type="button"
              className="p-2 bg-dark-orange rounded-md text-white cursor-pointer"
              onClick={() => editHandler(row)}
            >
              Edit
            </button>
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

  const handleClose = () => {
    setOpenConfirm(false);
  };

  return (
    <div className="flex flex-col w-full p-4">
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/dashboard">
          Dashboard
        </Link>
        <Typography>Matapelajaran</Typography>
      </Breadcrumbs>
      <div className="mt-2 w-full">
        <Card>
          <CardContent>
            <div className="flex flex-row w-full justify-between items-center gap-2 mb-4">
              <div className="flex flex-row gap-4">
                <Link href="/dashboard/mapel/add">
                  <button className="focus:outline-none bg-green text-white py-3 px-4 rounded-md gap-2 cursor-pointer">
                    <AddIcon />
                    <span>Tambah Data</span>
                  </button>
                </Link>
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
                    {dataMapel.map((row, index) => {
                      const rowWithNo = {
                        ...row,
                        no: (payload.page - 1) * payload.limit + index + 1,
                      };
                      return (
                        <TableRow
                          key={row.id_mapel}
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
                count={dataMapel.length}
                rowsPerPage={payload.limit}
                page={payload.page - 1}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                slotProps={{
                  actions: {
                    nextButton: {
                      disabled: dataMapel.length < payload.limit,
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
                onClick={deleteDataMapel}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress /> : "Hapus"}
              </button>
            </div>
          </div>
        </Dialog>
        <Modal
          open={openView}
          onClose={closeiVewHandler}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div className="flex w-full h-screen justify-center items-center">
            <div className="flex flex-col w-1/2 p-4 bg-white rounded-md">
              <div className="flex flex-col w-full border boder-gray-400 rounded-md p-4 gap-3">
                <div className="flex flex-row">
                  <div className="w-40">ID Mapelajaran</div>
                  <div>: {selectedData.id_mapel}</div>
                </div>
                <div className="flex flex-row">
                  <div className="w-40">Nama Mapelajaran</div>
                  <div>: {selectedData.nama_mapel}</div>
                </div>
              </div>
              <div className="flex flex-row justify-end gap-3 mt-4">
                <button
                  className="focus:outline-none flex w-20 py-2 justify-center bg-soft-blue font-bold text-white rounded-lg cursor-pointer"
                  onClick={closeiVewHandler}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </Modal>
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
