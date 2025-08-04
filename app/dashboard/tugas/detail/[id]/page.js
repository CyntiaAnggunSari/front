"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRef } from "react";
import { useParams } from "next/navigation";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Image from "next/image";
import CircularProgress from "@mui/material/CircularProgress";
import {
  getTugasById,
  saveTugasSiswa,
  getTugasBySiswa,
  getListTugasSiswa,
  saveJawabanTugasSiswa,
} from "@/app/actions/tugas";
import moment from "moment-timezone";
import { saveAs } from "file-saver";
import { useDropzone } from "react-dropzone";
import Dialog from "@mui/material/Dialog";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { redirect } from "next/navigation";
import "moment/locale/id";

export default function TugasDetailPage() {
  moment.locale("id");
  const { id } = useParams();
  const [role, setRole] = useState("");
  const [dataTugas, setDataTugas] = useState({});
  const [dataTugasSiswa, setDataTugasSiswa] = useState({});
  const [dataListTugasSiswa, setDataListTugasSiswa] = useState([]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [alertStatus, setAlertStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);
  const [jawaban, setJawaban] = useState({});
  const [dataSoal, setDataSoal] = useState([]);
  const [payload, setPayload] = useState({
    limit: 10,
    page: 1,
    search: "",
    id_tugas: id,
  });

  useEffect(() => {
    getDataListTugasSiswa();
  }, [payload]);

  useEffect(() => {
    import("html2pdf.js").then((module) => {
      setHtml2pdf(() => module.default);
    });
  }, []);

  useEffect(() => {
    const roleId = localStorage.getItem("roleId");
    if (roleId == 1) {
      setRole("admin");
    } else if (roleId == 2) {
      setRole("guru");
      getDataListTugasSiswa();
    } else if (roleId == 3) {
      setRole("siswa");
      getDataTugasSiswa();
    }
    getDataTugas();
  }, []);

  const getDataTugas = async () => {
    try {
      const data = { id: id };
      const getDataTugas = await getTugasById(data);

      if (getDataTugas.status == 200) {
        setDataTugas(getDataTugas.data);
        if (getDataTugas.data.jenis == "campuran") {
          setDataSoal(getDataTugas.data.soal);
        }
      } else {
        setOpen(true);
        setMessage(getDataTugas.message);
        setAlertStatus("error");
      }
    } catch (error) {
      setOpen(true);
      setMessage("Terjadi kesalahan");
      setAlertStatus("error");
    }
  };

  const [html2pdf, setHtml2pdf] = useState(null);
  const contentRef = useRef(null);

  const handleSubmit = async (e) => {
    try {
      const data = {
        id_tugas: id,
        jawaban: dataSoal,
      };
      const saveTugas = await saveJawabanTugasSiswa(data);

      if (saveTugas.status == 200) {
        setOpen(true);
        setMessage(saveTugas.message);
        setAlertStatus("success");
        getDataTugasSiswa();
      } else {
        setOpen(true);
        setMessage(saveTugas.message);
        setAlertStatus("error");
      }
      setOpenConfirm(false);
    } catch (error) {
      setOpen(true);
      setMessage("Terjadi kesalahan");
      setAlertStatus("error");
      setOpenConfirm(false);
    }
  };

  const isExpired =
    dataTugas?.tanggal_selesai &&
    moment(dataTugas.tanggal_selesai).tz("Asia/Jakarta").isBefore(moment());

  const isStarted =
    dataTugas?.tanggal_mulai &&
    moment(dataTugas.tanggal_mulai).tz("Asia/Jakarta").isSameOrBefore(moment());

  const getDataTugasSiswa = async () => {
    try {
      const data = { id_tugas: id };

      const getDataTugas = await getTugasBySiswa(data);
      console.log(getDataTugas);

      if (getDataTugas.status == 200) {
        setDataTugasSiswa(getDataTugas.data);
        if (getDataTugas.data.file) {
          setFile(getDataTugas.data.file);
        }
      } else {
        setOpen(true);
        setMessage(getDataTugas.message);
        setAlertStatus("error");
      }
    } catch (error) {
     console.log(error);
    }
  };

  const getDataListTugasSiswa = async () => {
    try {
      const listGuru = await getListTugasSiswa(payload);

      if (listGuru.status == 200) {
        setDataListTugasSiswa(listGuru.data);
      } else {
        setOpen(true);
        setMessage(listGuru.message);
        setAlertStatus("error");
      }
    } catch (error) {
      setOpen(true);
      setMessage("Terjadi kesalahan");
      setAlertStatus("error");
    }
  };

  const download = () => {
    const base64URL = dataTugas.file.split(",")[1];
    const binary = window.atob(base64URL.replace(/\s/g, ""));
    const len = binary.length;
    const buffer = new ArrayBuffer(len);
    const view = new Uint8Array(buffer);
    const filename = dataTugas.filename;

    for (let i = 0; i < len; i += 1) {
      view[i] = binary.charCodeAt(i);
    }

    var file = new File([view], filename, { type: "application/pdf" });
    saveAs(file, filename);
  };

  const handleOpen = () => setOpenConfirm(true);
  const handleClose = () => setOpenConfirm(false);

  const uploadTugas = async () => {
    try {
      const data = {
        fileTugas: file,
        filename: fileName,
        id_tugas: id,
      };
      const saveTugas = await saveTugasSiswa(data);

      if (saveTugas.status == 200) {
        setOpen(true);
        setMessage(saveTugas.message);
        setAlertStatus("success");
        getDataTugasSiswa();
      } else {
        setOpen(true);
        setMessage(saveTugas.message);
        setAlertStatus("error");
      }
      setOpenConfirm(false);
    } catch (error) {
      setOpen(true);
      setMessage("Terjadi kesalahan");
      setAlertStatus("error");
      setOpenConfirm(false);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        // Do whatever you want with the file contents
        const base64String = reader.result;
        // console.log(base64String)
        setFile(base64String);
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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
    return redirect(
      `/dashboard/tugas/siswa?tugas=${data.id_tugas}&siswa=${data.id_siswa}`
    );
  };

  const onAnswerHandler = (id, answer) => {
    const newDataSoal = dataSoal.map((value) => {
      if (value.id_soal == id) {
        return { ...value, jawaban: answer };
      }
      return value;
    });

    setDataSoal(newDataSoal);
  };

  const convertToPdf = () => {
    const content = contentRef.current;

    const options = {
      filename: "laporan-guru.pdf",
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
  const columns = [
    { id: "nis", label: "nis" },
    { id: "nama_siswa", label: "Nama" },
    {
      id: "tanggal_upload",
      label: "Tanggal Pengumpulan",
      cell: (row) => moment(row.tanggal_upload).format("DD MMMM YYYY HH:mm:ss"),
    },
    {
      id: "nilai",
      label: "Nilai",
      cell: (row) => {
        if (row.nilai) {
          return row.nilai;
        } else {
          return <span>Belum ada nilai</span>;
        }
      },
    },
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
              Penilaian
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col w-full p-4">
      <Breadcrumbs aria-label="breadcrumb">
        <Typography>Tugas</Typography>
      </Breadcrumbs>
      <div className="mt-2 w-full">
        <div className="flex flex-row w-full gap-4">
          {dataTugas.jenis == "upload" && dataTugas.file ? (
            <div className="flex w-2/3">
              <embed
                type="application/pdf"
                src={dataTugas.file}
                className="w-full h-96"
              ></embed>
            </div>
          ) : null}
          {dataTugas.jenis === "campuran" && role == "guru" ? (
            <div className="flex w-2/3 h-96 overflow-scroll">
              <div className="mt-5">
                <h2 className="text-lg font-bold">Soal Pilihan Ganda</h2>
                {dataTugas.soal
                  ?.filter((soal) => soal.jenis == "pg")
                  .map((soal, index) => (
                    <div key={soal.id_soal} className="mb-4">
                      <p>
                        {index + 1}. {soal.pertanyaan}
                      </p>
                      <div className="flex flex-col w-full gap-2 ml-4">
                        <span>A. {soal.opsi_a}</span>
                        <span>B. {soal.opsi_b}</span>
                        <span>C. {soal.opsi_c}</span>
                        <span>D. {soal.opsi_d}</span>
                      </div>
                    </div>
                  ))}
                <h2 className="text-lg font-bold mt-6">Soal Essay</h2>
                {dataTugas.soal
                  ?.filter((soal) => soal.jenis == "esai")
                  .map((soal, index) => (
                    <div key={soal.id_soal} className="mb-4">
                      <p>
                        {index + 1}. {soal.pertanyaan}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          ) : null}
          <div
            className={`flex flex-col border border-2 border-dark-orange rounded-lg py-4 px-2 justify-between ${
              dataTugas.jenis == "campuran" && role == "siswa"
                ? "w-full"
                : "w-1/3"
            }`}
          >
            <div className="flex flex-col gap-3">
              <div className="flex flex-row w-full justify-center">
                <span className="font-bold text-lg">{dataTugas.judul}</span>
              </div>
              <div className="flex flex-row w-full justify-center">
                <p className="text-center">{dataTugas.deskripsi}</p>
              </div>
              <div className="flex flex-row">
                <span className="w-40">Matapelajaran</span>
                <span>: {dataTugas.nama_mp}</span>
              </div>
              <div className="flex flex-row">
                <span className="w-40">Kelas</span>
                <span>: {dataTugas.nama_kelas}</span>
              </div>
              <div className="flex flex-row">
                <span className="w-40">Guru</span>
                <span>: {dataTugas.nama_guru}</span>
              </div>
              <div className="flex flex-row">
                <span className="w-40">Tanggal Mulai</span>
                <span>
                  :{" "}
                  {dataTugas.tanggal_mulai
                    ? moment(dataTugas.tanggal_mulai).format(
                        "DD MMMM YYYY HH:mm:ss"
                      )
                    : "-"}
                </span>
              </div>
              <div className="flex flex-row">
                <span className="w-40">Tanggal Berakhir</span>
                <span>
                  :{" "}
                  {dataTugas.tanggal_selesai
                    ? moment(dataTugas.tanggal_selesai).format(
                        "DD MMMM YYYY HH:mm:ss"
                      )
                    : "-"}
                </span>
              </div>
              <div className="flex flex-row">
                <span className="w-40">Tanggal Upload</span>
                <span>
                  :{" "}
                  {dataTugas.created_at
                    ? moment(dataTugas.created_at).format(
                        "DD MMMM YYYY HH:mm:ss"
                      )
                    : "-"}
                </span>
              </div>
            </div>
            {dataTugas.jenis == "upload" ? (
              <div
                className="flex w-full justify-center bg-dark-orange text-white py-3 text-lg font-bold rounded-md cursor-pointer"
                onClick={download}
              >
                DOWNLOAD
              </div>
            ) : null}
          </div>
        </div>

        {role == "siswa" ? (
          <div className="flex flex-col w-full mt-6">
            {dataTugas.jenis == "upload" ? (
              <span className="font-bold text-lg text-black">
                Pengumpulan Tugas
              </span>
            ) : null}
            {dataTugas.jenis == "upload" ? (
              <div>
                {moment(dataTugas.tanggal_berakhir)
                  .tz("Asia/Jakarta")
                  .diff(moment(), "seconds") >= 0 ? (
                  <div className="flex flex-col gap-4 w-full">
                    {file == "" ? (
                      <div
                        className="flex flex-col w-full items-center justify-center h-64 border border-2 border-dark-orange border-dashed cursor-pointer mt-6"
                        {...getRootProps()}
                      >
                        <input {...getInputProps()} accept=".pdf" />
                        {isDragActive ? (
                          <p>Upload file di sini</p>
                        ) : (
                          <p>
                            Tarik dan upload file tugas di sini atau klik untuk
                            mencari file tugas
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col w-full">
                        {dataTugasSiswa.file ? (
                          <div className="flex flex-row gap-4 my-4">
                            <span>Tanggal pengumpulan :</span>
                            <span>
                              {moment(dataTugasSiswa.created_at).format(
                                "DD MMMM YYYY HH:mm:ss"
                              )}
                            </span>
                          </div>
                        ) : (
                          <div
                            className="w-fit px-6 py-3 bg-red-800 text-white font-bold rounded-lg my-3 cursor-pointer"
                            onClick={() => setFile("")}
                          >
                            Hapus
                          </div>
                        )}
                        <embed
                          type="application/pdf"
                          src={file}
                          className="w-full"
                          style={{ height: 800 }}
                        ></embed>
                      </div>
                    )}
                    {dataTugasSiswa.file ? null : (
                      <div
                        className={`flex w-full justify-center items-center px-6 py-2 ${
                          !isStarted || file == "" || isExpired
                            ? "bg-gray-400"
                            : "bg-green"
                        } text-white rounded-lg w-fit mt-4 cursor-pointer font-bold`}
                        onClick={
                          !isStarted || file == "" || isExpired
                            ? null
                            : handleOpen
                        }
                      >
                        {!isStarted
                          ? "Tugas belum bisa dikumpulkan"
                          : isExpired
                          ? "Waktu pengumpulan habis"
                          : "Kumpulkan Tugas"}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    Pengumpulan tugas telah berakhir
                  </div>
                )}
              </div>
            ) : null}

            {dataTugas.jenis === "campuran" ? (
              <div className="flex flex-col w-full">
                {dataTugasSiswa.created_at ? (
                  <div className="flex w-full items-center justify-center font-bold">
                    <span>
                      Tugas sudah dikumpulkan pada{" "}
                      {moment(dataTugasSiswa.created_at).format(
                        "DD MMMM YYYY HH:mm:ss"
                      )}
                    </span>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-lg font-bold">Soal Pilihan Ganda</h2>
                    {dataTugas.soal
                      ?.filter((soal) => soal.jenis == "pg")
                      .map((soal, index) => (
                        <div key={soal.id_soal} className="mb-6">
                          <p className="font-semibold">
                            {index + 1}. {soal.pertanyaan}
                          </p>
                          <div className="flex flex-col w-full ml-4">
                            <FormControl>
                              <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                name={`jawaban-${soal.id_soal}`}
                                onChange={(e) =>
                                  onAnswerHandler(soal.id_soal, e.target.value)
                                }
                              >
                                <FormControlLabel
                                  value="A"
                                  control={<Radio />}
                                  label={`A. ${soal.opsi_a}`}
                                />
                                <FormControlLabel
                                  value="B"
                                  control={<Radio />}
                                  label={`B. ${soal.opsi_b}`}
                                />
                                <FormControlLabel
                                  value="C"
                                  control={<Radio />}
                                  label={`C. ${soal.opsi_c}`}
                                />
                                <FormControlLabel
                                  value="D"
                                  control={<Radio />}
                                  label={`D. ${soal.opsi_d}`}
                                />
                              </RadioGroup>
                            </FormControl>
                          </div>
                        </div>
                      ))}
                    <h2 className="text-lg font-bold">Essay</h2>
                    {dataTugas.soal
                      ?.filter((soal) => soal.jenis == "esai")
                      .map((soal, index) => (
                        <div key={soal.id_soal} className="mb-4">
                          <p>
                            {index + 1}. {soal.pertanyaan}
                          </p>
                          <TextField
                            fullWidth
                            multiline
                            variant="outlined"
                            minRows={3}
                            placeholder="Ketik jawaban di sini"
                            name={`jawaban-${soal.id_soal}`}
                            onChange={(e) =>
                              onAnswerHandler(soal.id_soal, e.target.value)
                            }
                          />
                        </div>
                      ))}
                    <button
                      type="button"
                      className={`px-6 py-2 rounded ${
                        !isStarted || isExpired
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-blue-600 text-white cursor-pointer"
                      }`}
                      onClick={!isStarted || isExpired ? null : handleSubmit}
                      disabled={!isStarted || isExpired}
                    >
                      {!isStarted
                        ? "Tugas belum dimulai"
                        : isExpired
                        ? "Waktu pengumpulan habis"
                        : "Kirim Jawaban"}
                    </button>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="flex flex-col w-full mt-6">
            <span className="font-bold text-lg text-black">
              Pengumpulan Tugas
            </span>
            <div className="mt-2 w-full">
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
                          {dataListTugasSiswa.map((row, idx) => {
                            return (
                              <TableRow
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={idx}
                              >
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
                    <TablePagination
                      rowsPerPageOptions={[10, 25, 100]}
                      component="div"
                      count={dataListTugasSiswa.length}
                      rowsPerPage={payload.limit}
                      page={payload.page - 1}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      slotProps={{
                        actions: {
                          nextButton: {
                            disabled: dataListTugasSiswa.length < payload.limit,
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
            </div>
          </div>
        )}
      </div>
      <div className="hidden">
        <div className="flex flex-col w-full p-7" ref={contentRef}>
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
            Laporan Nilai Tugas Siswa
          </div>
          <div className="mb-6">
            <div className="flex flex-row mt-6">
              <div className="flex w-40 text-sm">Guru</div>
              <div className="text-sm">: {dataTugas.nama_guru}</div>
            </div>
             <div className="flex flex-row mt-6">
              <div className="flex w-40 text-sm">Mata Pelajaran</div>
              <div className="text-sm">: {dataTugas.nama_mp}</div>
            </div>
             <div className="flex flex-row mt-6">
              <div className="flex w-40 text-sm">Judul Tugas</div>
              <div className="text-sm">: {dataTugas.judul}</div>
            </div>
             <div className="flex flex-row mt-6">
              <div className="flex w-40 text-sm">Kelas</div>
              <div className="text-sm">: {dataTugas.nama_kelas}</div>
            </div>
              <div className="flex flex-row mt-6">
              <div className="flex w-40 text-sm">Tanggal Mulai</div>{" "}
               <div className="text-sm">:{dataTugas.tanggal_mulai
                ? moment(dataTugas.tanggal_mulai).format(
                    "DD MMMM YYYY HH:mm:ss"
                  )
                : ""}
                </div>
                </div>
           <div className="flex flex-row mt-6">
              <div className="flex w-40 text-sm">Tanggal Selesai</div>{" "}
               <div className="text-sm">:{dataTugas.tanggal_selesai
                ? moment(dataTugas.tanggal_selesai).format(
                    "DD MMMM YYYY HH:mm:ss"
                  )
                : ""}
                </div>
           </div>
          </div>
          <div className="grid grid-cols-3 mt-4 border">
            <div className="flex w-full px-2 py-1 font-bold">NIS</div>
            <div className="flex w-full border-l-1 px-2 py-1 font-bold">
              Nama Siswa
            </div>
            <div className="flex w-full border-l-1 px-2 py-1 font-bold">
              Nilai
            </div>
          </div>
          {dataListTugasSiswa?.map((row, index) => (
            <div key={index} className="grid grid-cols-3 border border-t-0">
              <div className="flex w-full px-2 py-1">{row.nis}</div>
              <div className="flex w-full border-l-1 px-2 py-1">
                {row.nama_siswa}
              </div>
              <div className="flex w-full border-l-1 px-2 py-1">
                {row.nilai !== null ? row.nilai : "Belum dinilai"}
              </div>
            </div>
          ))}

          <div className="text-right font-semibold text-lg">
            Rata-rata Nilai:{" "}
            {(() => {
              const nilaiValid = dataListTugasSiswa
                .filter((s) => s.nilai !== null && !isNaN(s.nilai))
                .map((s) => parseFloat(s.nilai));
              if (nilaiValid.length === 0) return "Belum ada nilai";
              const sum = nilaiValid.reduce((acc, cur) => acc + cur, 0);
              const avg = sum / nilaiValid.length;
              return avg.toFixed(2);
            })()}
          </div>
        </div>
      </div>
      <Dialog onClose={handleClose} open={openConfirm}>
        <div className="flex flex-col w-fit p-4">
          <span>
            Apakah anda yakin mengumpulkan tugas ini? Pastikan tugas yang
            dikumpulkan sudah benar!
          </span>
          <div className="flex flex-row justify-end gap-3 mt-4">
            <button
              className="focus:outline-none flex w-40 py-2 justify-center border border-blue-800 font-bold text-blue-800 rounded-lg cursor-pointer"
              onClick={handleClose}
            >
              Batal
            </button>
            <button
              className="focus:outline-none flex w-40 py-2 justify-center border border-blue-800 font-bold text-white bg-blue-800 rounded-lg cursor-pointer"
              onClick={uploadTugas}
              disabled={isSaveLoading}
            >
              {isSaveLoading ? <CircularProgress /> : "Kumpulkan"}
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
  );
}
