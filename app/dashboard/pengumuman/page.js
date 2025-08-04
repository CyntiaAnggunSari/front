"use client";
import React, { useState, useEffect } from "react";
import {
  Typography,
  Breadcrumbs,
  Link,
  Card,
  CardContent,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { getListPengumuman, deletePengumuman } from "@/app/actions/pengumuman";
import { useRouter } from "next/navigation";

export default function PengumumanPage() {
  const [dataPengumuman, setDataPengumuman] = useState([]);
  const [open, setOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const [alertStatus, setAlertStatus] = useState("");
  const [id, setId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState("");
  const router = useRouter();

  useEffect(() => {
    const roleId = localStorage.getItem("roleId");

    if (roleId == "1") {
      setRole("admin");
    } else if (roleId == "2") {
      setRole("guru");
    } else if (roleId == "3") {
      setRole("siswa");
    }
   getDataPengumuman();
  }, []);

  const isBaru = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const selisih = now - created;
    return selisih <= 24 * 60 * 60 * 1000; // 24 jam
  };

  const getDataPengumuman = async () => {
    try {
      const list = await getListPengumuman({ limit: 100, page: 1, search: "" });
      if (list.status === 200) {
        const sorted = list.data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setDataPengumuman(sorted);
      } else {
        setOpen(true);
        setAlertStatus("error");
        setMessage(list.message);
      }
    } catch (error) {
      setOpen(true);
      setAlertStatus("error");
      setMessage("Gagal memuat pengumuman");
    }
  };

  const deleteDataPengumuman = async () => {
    setIsLoading(true);
    try {
      const result = await deletePengumuman({ id });
      if (result.status === 200) {
        getDataPengumuman();
        setOpen(true);
        setAlertStatus("success");
        setMessage(result.message);
      } else {
        setOpen(true);
        setAlertStatus("error");
        setMessage(result.message);
      }
    } catch (error) {
      setOpen(true);
      setAlertStatus("error");
      setMessage("Terjadi kesalahan");
    } finally {
      setOpenConfirm(false);
      setIsLoading(false);
    }
  };

  const editHandler = (data) => {
    router.push(`/dashboard/pengumuman/edit?search=${data.id}`);
  };

  const deleteHandler = (data) => {
    setId(data.id);
    setOpenConfirm(true);
  };

  const handleClose = () => setOpenConfirm(false);

  return (
    <div className="flex flex-col w-full p-4">
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/dashboard">
          Dashboard
        </Link>
        <Typography>Pengumuman</Typography>
      </Breadcrumbs>

      {role === "admin" && (
        <div className="flex justify-end my-4">
          <Link href="/dashboard/pengumuman/add">
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2">
              <AddIcon />
              Tambah Pengumuman
            </button>
          </Link>
        </div>
      )}

      {dataPengumuman.length === 0 ? (
        <Typography align="center" sx={{ mt: 4 }}>
          Tidak ada pengumuman.
        </Typography>
      ) : (
        dataPengumuman.map((item) => (
          <Card
            key={item.id}
            sx={{ p: 2, backgroundColor: "#fdfcf5", mb: 3 }}
            variant="outlined"
          >
            <CardContent>
              <Typography variant="h6" align="center" fontWeight="bold">
                Pengumuman{" "}
                {isBaru(item.created_at) && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded ml-2">
                    Baru
                  </span>
                )}
              </Typography>
              <Typography
                variant="body2"
                align="center"
                color="textSecondary"
                sx={{ mt: 1 }}
              >
                {new Date(item.created_at).toLocaleString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
              <hr style={{ margin: "10px 0" }} />
              <Typography variant="body1" align="center">
                {item.isi}
              </Typography>

              {role === "admin" && (
                <div className="flex flex-row justify-center gap-2 mt-4">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                    onClick={() => editHandler(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-md"
                    onClick={() => deleteHandler(item)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}

      <Dialog onClose={handleClose} open={openConfirm}>
        <div className="flex flex-col w-fit p-4">
          <span>Apakah anda yakin ingin menghapus pengumuman ini?</span>
          <div className="flex flex-row justify-end gap-3 mt-4">
            <button
              className="w-20 py-2 border border-blue-800 text-blue-800 rounded-lg"
              onClick={handleClose}
            >
              Batal
            </button>
            <button
              className="w-20 py-2 bg-blue-800 text-white rounded-lg"
              onClick={deleteDataPengumuman}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={20} /> : "Hapus"}
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
