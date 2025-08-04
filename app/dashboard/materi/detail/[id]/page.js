"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import { getMateriById, deleteMateri } from "@/app/actions/materi";
import moment from "moment";
import { saveAs } from "file-saver";
import { getListTanyaJawab, saveTanyaJawab } from "@/app/actions/tanya_jawab";
import { redirect } from "next/navigation";
import "moment/locale/id";

export default function MateriKelasPage() {
  moment.locale("id");
  const { id } = useParams();
  const [role, setRole] = useState("");
  const [dataMateri, setDataMateri] = useState({});
  const [dataTanyaJawab, setDataTanyaJawab] = useState([]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [alertStatus, setAlertStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [konten, setKonten] = useState("");
  const [parentId, setParentId] = useState("");
  const [openModalTanya, setOpenModalTanya] = useState(false);
  const [openModalJawab, setOpenModalJawab] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openRedirect, setOpenRedirect] = useState(false);
  const [payload, setPayload] = useState({
    limit: 10,
    page: 1,
    search: "",
    id: id,
  });

  useEffect(() => {
    getDataMateri();
  }, [payload]);

  useEffect(() => {
    const roleId = localStorage.getItem("roleId");
    if (roleId == 1) {
      setRole("admin");
    } else if (roleId == 2) {
      setRole("guru");
    } else if (roleId == 3) {
      setRole("siswa");
    }
    getDataMateri();
  }, []);

  useEffect(() => {
    getDataTanyaJawab();
  }, []);

  const getDataMateri = async () => {
    const roleId = localStorage.getItem("roleId");
    try {
      if (roleId == 2) {
        const listMatapelajaran = await getMateriById(payload);

        if (listMatapelajaran.status == 200) {
          setDataMateri(listMatapelajaran.data);
        } else {
          setOpen(true);
          setMessage(listMatapelajaran.message);
          setAlertStatus("error");
        }
      } else if (roleId == 3) {
        const listMatapelajaran = await getMateriById(payload);
        if (listMatapelajaran.status == 200) {
          setDataMateri(listMatapelajaran.data);
        } else {
          setOpen(true);
          setMessage(listMatapelajaran.message);
          setAlertStatus("error");
        }
      }
    } catch (error) {
      setOpen(true);
      setMessage("Terjadi kesalahan");
      setAlertStatus("error");
    }
  };

  const getDataTanyaJawab = async () => {
    try {
      const data = {
        materi_id: id,
      };
      const listTanyaJawab = await getListTanyaJawab(data);

      if (listTanyaJawab.status == 200) {
        setDataTanyaJawab(listTanyaJawab.data);
      } else {
        setDataTanyaJawab([]);
        setOpen(true);
        setMessage(listTanyaJawab.message);
        setAlertStatus("error");
      }
    } catch (error) {
      setDataTanyaJawab([]);
      setOpen(true);
      setMessage("Gagal mendapatkan data tanya & jawab");
      setAlertStatus("error");
    }
  };

  const saveDataPertanyaan = async () => {
    setIsSaveLoading(true);
    try {
      const nama = localStorage.getItem("nama");
      const data = {
        konten: konten,
        nama: nama,
        materi_id: id,
        parent_id: null,
      };
      const result = await saveTanyaJawab(data);

      if (result.status == 201) {
        getDataTanyaJawab();
        setOpen(true);
        setMessage(result.message);
        setAlertStatus("success");
        setKonten("");
      } else {
        setDataTanyaJawab([]);
        setOpen(true);
        setMessage(result.message);
        setAlertStatus("error");
        setKonten("");
      }
      setIsSaveLoading(false);
      setOpenModalTanya(false);
    } catch (error) {
      setDataTanyaJawab([]);
      setOpen(true);
      setMessage("Gagal mengirim pertanyaan");
      setAlertStatus("error");
      setIsSaveLoading(false);
      setOpenModalTanya(false);
      setKonten("");
    }
  };

  const saveDataBalasan = async () => {
    setIsSaveLoading(true);
    try {
      const nama = localStorage.getItem("nama");
      const data = {
        konten: konten,
        nama: nama,
        materi_id: id,
        parent_id: parentId,
      };
      const result = await saveTanyaJawab(data);

      if (result.status == 201) {
        getDataTanyaJawab();
        setOpen(true);
        setMessage(result.message);
        setAlertStatus("success");
        setKonten("");
        setParentId("");
      } else {
        setDataTanyaJawab([]);
        setOpen(true);
        setMessage(result.message);
        setAlertStatus("error");
        setKonten("");
        setParentId("");
      }
      setIsSaveLoading(false);
      setOpenModalJawab(false);
    } catch (error) {
      setDataTanyaJawab([]);
      setOpen(true);
      setMessage("Gagal mengirim balasan");
      setAlertStatus("error");
      setIsSaveLoading(false);
      setOpenModalJawab(false);
      setParentId("");
      setKonten("");
    }
  };

  const download = () => {
    const base64URL = dataMateri.file.split(",")[1];
    const binary = window.atob(base64URL.replace(/\s/g, ""));
    const len = binary.length;
    const buffer = new ArrayBuffer(len);
    const view = new Uint8Array(buffer);
    const filename = dataMateri.filename;

    for (let i = 0; i < len; i += 1) {
      view[i] = binary.charCodeAt(i);
    }

    var file = new File([view], filename, { type: "application/pdf" });
    saveAs(file, filename);
  };

  const deleteHandler = () => {
    setOpenConfirm(true);
  };

  const handleClose = () => {
    setOpenConfirm(false);
  };

  const deleteDataMateri = async () => {
    setIsLoading(true);
    try {
      const data = { id_materi: id };
      const result = await deleteMateri(data);

      if (result.status == 200) {
        setOpenRedirect(true);
        setOpenConfirm(false);
      } else {
        setOpen(true);
        setMessage(result.message);
        setAlertStatus("error");
      }
      setIsLoading(false);
      setOpenConfirm(false);
    } catch (error) {
      setOpen(true);
      setMessage("Terjadi kesalahan");
      setAlertStatus("error");
      setIsLoading(false);
      setOpenConfirm(false);
    }
  };

  const handleRedirect = () => {
    setOpenRedirect(false);
    redirect("/dashboard/materi");
  }

  const handleOpenModalTanya = () => setOpenModalTanya(true);
  const handleCloseModalTanya = () => setOpenModalTanya(false);

  const handleOpenModalJawab = () => setOpenModalJawab(true);
  const handleCloseModalJawab = () => setOpenModalJawab(false);

  return (
    <div className="flex flex-col w-full p-4">
      <Breadcrumbs aria-label="breadcrumb">
        <Typography>Materi</Typography>
      </Breadcrumbs>
      <div className="mt-2 w-full">
        <div className="flex flex-row w-full gap-4">
          <div className="flex w-2/3">
            {dataMateri.file ? (
              <embed
                type="application/pdf"
                src={dataMateri.file}
                className="w-full h-96"
              ></embed>
            ) : null}
          </div>
          <div className="flex flex-col w-1/3 border border-2 border-dark-orange rounded-lg py-4 px-2 justify-between">
            <div className="flex flex-col gap-3">
              <div className="flex flex-row w-full justify-center">
                <span className="font-bold text-lg">{dataMateri.judul}</span>
              </div>
              <div className="flex flex-row w-full justify-center">
                <p className="text-center">{dataMateri.deskripsi}</p>
              </div>
              <div className="flex flex-row">
                <span className="w-40">Matapelajaran</span>
                <span>: {dataMateri.nama_mp}</span>
              </div>
              <div className="flex flex-row">
                <span className="w-40">Kelas</span>
                <span>: {dataMateri.nama_kelas}</span>
              </div>
              <div className="flex flex-row">
                <span className="w-40">Guru</span>
                <span>: {dataMateri.nama_guru}</span>
              </div>
              <div className="flex flex-row">
                <span className="w-40">Tanggal Upload</span>
                <span>
                  : {moment(dataMateri.uploaded_at).format("DD MMMM YYYY")}
                </span>
              </div>
            </div>
            <div
              className="flex w-full justify-center bg-dark-orange text-white py-3 text-lg font-bold rounded-md cursor-pointer"
              onClick={download}
            >
              DOWNLOAD
            </div>
            {role == "guru" && (
              <div
                className="flex w-full justify-center bg-red-800 text-white py-3 text-lg font-bold rounded-md cursor-pointer"
                onClick={deleteHandler}
              >
                HAPUS
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col w-full mt-6">
          <span className="font-bold text-lg text-black">Tanya & Jawab</span>
          {dataTanyaJawab.map((data) => (
            <div className="flex flex-col w-full" key={"tanya_" + data.id}>
              <div className="flex flex-col w-full mt-4">
                <div className="flex flex-row gap-3 items-center">
                  <div className="flex w-10 h-10 rounded-full bg-green text-white font-bold text-xl justify-center items-center uppercase">
                    {data.nama?.slice(0, 2)}
                  </div>
                  <div className="font-bold text-black">{data.nama}</div>
                  <div className="text-sm text-gray-400">
                    {moment(data.created_at).format("DD MMMM YYYY HH:mm:ss")}
                  </div>
                </div>
                <p className="text-black text-base ml-12">{data.konten}</p>
                {data.balasan
                  ? data.balasan?.map((balasan) => (
                      <div
                        className="flex flex-col w-full ml-14 pr-14"
                        key={"jawab_" + balasan.id}
                      >
                        <div className="flex h-6 border-l-2 border-dark-orange ml-5"></div>
                        <div className="flex flex-row gap-3 items-center">
                          <div className="flex w-10 h-10 rounded-full bg-blue-800 text-white font-bold text-xl justify-center items-center uppercase">
                            {balasan.nama?.slice(0, 2)}
                          </div>
                          <div className="font-bold text-black">
                            {balasan.nama}
                          </div>
                          <div className="text-sm text-gray-400">
                            {moment(balasan.created_at).format(
                              "DD MMMM YYYY HH:mm:ss"
                            )}
                          </div>
                        </div>
                        <p className="text-black text-base ml-12">
                          {balasan.konten}
                        </p>
                      </div>
                    ))
                  : null}
                <div
                  className="px-6 py-2 bg-blue-800 text-white rounded-lg w-fit mt-4 cursor-pointer font-bold ml-14"
                  onClick={() => {
                    handleOpenModalJawab();
                    setParentId(data.id);
                  }}
                >
                  Balas
                </div>
              </div>
            </div>
          ))}
          <div
            className="px-6 py-2 bg-green text-white rounded-lg w-fit mt-4 cursor-pointer font-bold"
            onClick={handleOpenModalTanya}
          >
            Tanya
          </div>
        </div>
      </div>
      <Modal
        open={openModalTanya}
        onClose={handleCloseModalTanya}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="flex w-full h-screen justify-center items-center">
          <div className="flex flex-col w-1/2 p-4 bg-white">
            <span>Masukan pertanyaan</span>
            <TextField
              fullWidth
              multiline
              variant="outlined"
              minRows={3}
              placeholder="Ketik pertanyaan di sini"
              onChange={(e) => setKonten(e.target.value)}
            />
            <div className="flex flex-row justify-end gap-3 mt-4">
              <button
                className="focus:outline-none flex w-20 py-2 justify-center border border-blue-800 font-bold text-blue-800 rounded-lg cursor-pointer"
                onClick={handleCloseModalTanya}
              >
                Batal
              </button>
              <button
                className="focus:outline-none flex w-20 py-2 justify-center border border-blue-800 font-bold text-white bg-blue-800 rounded-lg cursor-pointer"
                onClick={saveDataPertanyaan}
                disabled={isSaveLoading}
              >
                {isSaveLoading ? <CircularProgress /> : "Kirim"}
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        open={openModalJawab}
        onClose={handleCloseModalJawab}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="flex w-full h-screen justify-center items-center">
          <div className="flex flex-col w-1/2 p-4 bg-white">
            <span>Masukan jawaban</span>
            <TextField
              fullWidth
              multiline
              variant="outlined"
              minRows={3}
              placeholder="Ketik jawaban di sini"
              onChange={(e) => setKonten(e.target.value)}
            />
            <div className="flex flex-row justify-end gap-3 mt-4">
              <button
                className="focus:outline-none flex w-20 py-2 justify-center border border-blue-800 font-bold text-blue-800 rounded-lg cursor-pointer"
                onClick={handleCloseModalJawab}
              >
                Batal
              </button>
              <button
                className="focus:outline-none flex w-20 py-2 justify-center border border-blue-800 font-bold text-white bg-blue-800 rounded-lg cursor-pointer"
                onClick={saveDataBalasan}
                disabled={isSaveLoading}
              >
                {isSaveLoading ? <CircularProgress /> : "Kirim"}
              </button>
            </div>
          </div>
        </div>
      </Modal>
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
              onClick={deleteDataMateri}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress /> : "Hapus"}
            </button>
          </div>
        </div>
      </Dialog>
      <Dialog onClose={handleRedirect} open={openRedirect}>
        <div className="flex flex-col w-fit p-4">
          <span>Data materi berhasil dihapus, kembali kehalaman utama materi!</span>
          <div className="flex flex-row justify-end gap-3 mt-4">
            <button
              className="focus:outline-none flex w-20 py-2 justify-center bg-soft-blue font-bold text-white rounded-lg cursor-pointer"
              onClick={handleRedirect}
            >
              Oke
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
