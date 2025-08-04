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
import { getListAdmin, deleteAdmin } from "@/app/actions/admin";

export default function AdminPage() {
  const [dataAdmin, setDataAdmin] = useState([]);
  const [open, setOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [message, setMessage] = useState("");
  const [alertStatus, setAlertStatus] = useState("");
  const [nip, setNip] = useState("");
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
    return redirect(`/dashboard/admin/edit?search=${data.nip}`);
  };

  const deleteHandler = (data) => {
    setNip(data.nip);
    setOpenConfirm(true);
  };

  useEffect(() => {
    getDataAdmin();
  }, [payload]);

  useEffect(() => {
    import("html2pdf.js").then((module) => {
      setHtml2pdf(() => module.default);
    });
  }, []);

  const getDataAdmin = async () => {
    try {
      const listAdmin = await getListAdmin(payload);

      if (listAdmin.status == 200) {
        setDataAdmin(listAdmin.data);
      } else {
        setOpen(true);
        setMessage(listAdmin.message);
        setAlertStatus("error");
      }
    } catch (error) {
      setOpen(true);
      setMessage("Terjadi kesalahan");
      setAlertStatus("error");
    }
  };

  const deleteDataAdmin = async () => {
    setIsLoading(true);
    try {
      const data = { nip: nip };
      const result = await deleteAdmin(data);

      if (result.status == 200) {
        getDataAdmin();
        setNip("");
        setOpen(true);
        setMessage(result.message);
        setAlertStatus("success");
      } else {
        setOpen(true);
        setMessage(result.message);
        setAlertStatus("error");
        setNip("");
      }
      setIsLoading(false);
      setOpenConfirm(false);
    } catch (error) {
      setOpen(true);
      setMessage("Terjadi kesalahan");
      setAlertStatus("error");
      setIsLoading(false);
      setNip("");
      setOpenConfirm(false);
    }
  };

  const columns = [
    { id: "no", label: "No" },
    { id: "nip", label: "NIP" },
    { id: "nama", label: "Nama" },
    { id: "jenis_kelamin", label: "Jenis Kelamin" },
    { id: "alamat", label: "Alamat" },
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

  const getTanggalIndonesia = () => {
    const formatter = new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return formatter.format(new Date());
  };

  const convertToPdf = () => {
    const content = contentRef.current;

    const options = {
      filename: "laporan-admin.pdf",
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
  const sortedDataAdmin = [...dataAdmin].sort((a, b) =>
    a.nama.localeCompare(b.nama)
  );

  return (
    <div className="flex flex-col w-full p-4">
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/dashboard">
          Dashboard
        </Link>
        <Typography>Admin</Typography>
      </Breadcrumbs>
      <div className="mt-2 w-full">
        <Card>
          <CardContent>
            <div className="flex flex-row w-full justify-between items-center gap-2 mb-4">
              <div className="flex flex-row gap-4">
                <Link href="/dashboard/admin/add">
                  <button className="focus:outline-none bg-green text-white py-3 px-4 rounded-md gap-2 cursor-pointer">
                    <AddIcon />
                    <span>Tambah Data</span>
                  </button>
                </Link>
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
              <div className="flex flex-row gap-2 items-center">
                <span>Search:</span>
                <TextField
                  variant="outlined"
                  size="small"
                  onChange={(event) => searchHandler(event.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col w-full p-7">
              <Breadcrumbs aria-label="breadcrumb">
                <Typography>Admin</Typography>
              </Breadcrumbs>

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
                          Jl. Baru Cimpu Surantih Kec. Sutera Kab. Pesisir
                          Selatan
                        </h1>
                      </div>
                    </div>

                    {/* Judul */}
                    <div className="flex font-semibold font-serif text-xl justify-center items-center p-7">
                      LAPORAN DATA ADMIN
                    </div>

                    {/* Tabel Data Siswa */}
                    <div className="flex w-full mt-4">
                      <table className="w-full text-sm">
                        <thead>
                          <tr>
                            {columns
                              .filter((column) => column.label !== "Action")
                              .map((column) => (
                                <th
                                  key={column.id}
                                  className="border border-black p-2"
                                >
                                  {column.label}
                                </th>
                              ))}
                          </tr>
                        </thead>
                        <tbody>
                          {[...dataAdmin]
                            .sort((a, b) => a.nama.localeCompare(b.nama))
                            .map((data, index) => {
                              const rowWithNo = { ...data, no: index + 1 }; // tambahkan 'no'
                              return (
                                <tr key={data.nip}>
                                  {columns
                                    .filter(
                                      (column) => column.label !== "Action"
                                    )
                                    .map((column) => (
                                      <td
                                        key={column.id}
                                        className="border border-t-0 border-black p-2"
                                      >
                                        {rowWithNo[column.id]}
                                      </td>
                                    ))}
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Tanda Tangan Kepala Sekolah */}
                  <div className="flex justify-end p-7">
                    <div className="flex flex-col items-start text-left">
                      <span className="font-normal mt-1">
                        Surantih, {getTanggalIndonesia()}
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
                    {sortedDataAdmin.map((row, index) => {
                      const rowWithNo = {
                        ...row,
                        no: (payload.page - 1) * payload.limit + index + 1,
                      };
                      return (
                        <TableRow
                          key={row.nip}
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
                count={dataAdmin.length}
                rowsPerPage={payload.limit}
                page={payload.page - 1}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                slotProps={{
                  actions: {
                    nextButton: {
                      disabled: dataAdmin.length < payload.limit,
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
                onClick={deleteDataAdmin}
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
                  <div className="w-40">NIP</div>
                  <div>: {selectedData.nip}</div>
                </div>
                <div className="flex flex-row">
                  <div className="w-40">Nama</div>
                  <div>: {selectedData.nama}</div>
                </div>
                <div className="flex flex-row">
                  <div className="w-40">Jenis Kelamin</div>
                  <div>: {selectedData.jenis_kelamin}</div>
                </div>
                <div className="flex flex-row">
                  <div className="w-40">Alamat</div>
                  <div>: {selectedData.alamat}</div>
                </div>
                <div className="flex flex-row">
                  <div className="w-40">Agama</div>
                  <div>: {selectedData.agama}</div>
                </div>
                <div className="flex flex-row">
                  <div className="w-40">Nomor HP</div>
                  <div>: {selectedData.no_hp}</div>
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
