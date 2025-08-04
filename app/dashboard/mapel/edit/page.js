"use client";
import React, { useActionState, useEffect, useState, useRef } from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { redirect } from "next/navigation";
import {updateMapel, getDetailMapel,} from "@/app/actions/matapelajaran";
import { useSearchParams } from "next/navigation";

export default function UpdateMatapelajaranPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  const [dataMapel, setDataMapel] = useState([]);
  const [open, setOpen] = useState(false);
  const [alertStatus, setAlertStatus] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [formState, formAction] = useActionState(updateMapel, {
    status: 0,
    message: "",
  });
  const idRef = useRef(null);

  useEffect(() => {
    if (formState.status == 200) {
      setOpen(true);
      setMessage(formState.message);
      setAlertStatus("success");
      resetHandler();
      getDataMapel();
    } else if (formState.status == 500) {
      setOpen(true);
      setMessage(formState.message);
      setAlertStatus("error");
    }
    setIsLoading(false);
  }, [formState]);

  const resetHandler = () => {
    idRef.current?.focus();
  };

  useEffect(() => {
    const roleId = localStorage.getItem("roleId");
    if (roleId == 1) {
      getDataMapel();
    } else {
      redirect("/404");
    }
  }, []);

  const getDataMapel = async () => {
    try {
      const data = { id: search };
      const result = await getDetailMapel(data);

      if (result.status == 200) {
        setDataMapel(result.data);
      } else {
        setOpen(true);
        setMessage(result.message);
        setAlertStatus("error");
      }
    } catch (error) {
      setOpen(true);
      setMessage("Terjadi kesalahan");
      setAlertStatus("error");
    }
  };

  const backHandler = () => {
    return redirect("/dashboard/mapel");
  };
  return (
    <div className="flex flex-col w-full p-4">
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/dashboard">
          Dashboard
        </Link>
        <Link underline="hover" color="inherit" href="/dashboard/mapel">
          Matapelajaran
        </Link>
        <Typography>Edit</Typography>
      </Breadcrumbs>
      <div className="mt-2 w-full">
        <Card>
          <form action={formAction} onSubmit={() => setIsLoading(true)}>
            <CardContent>
              <div className="flex flex-col w-full p-6 gap-3">
                <button
                  className="focus:outline-none flex px-4 py-2 bg-light-orange text-black w-fit rounded-md mb-4 cursor-pointer"
                  onClick={backHandler}
                  type="button"
                >
                  Kembali
                </button>

                <FormControl fullWidth>
                  <FormLabel htmlFor="id">ID</FormLabel>
                  <TextField
                    id="id"
                    name="id"
                    variant="outlined"
                    fullWidth
                    size="small"
                    type="text"
                    inputRef={idRef}
                    defaultValue={dataMapel.id_mapel}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <FormLabel htmlFor="nama_mapel">Nama Matapelajaran</FormLabel>
                  <TextField
                    id="nama_mapel"
                    name="nama_mapel"
                    variant="outlined"
                    fullWidth
                    size="small"
                    type="text"
                    defaultValue={dataMapel.nama_mapel}
                  />
                </FormControl>
              </div>
            </CardContent>
            <CardActions>
              <div className="flex flex-row w-full px-6 pb-6 justify-end">
                <button
                  type="submit"
                  className="flex justify-center w-40 py-2 bg-soft-blue text-white font-semibold rounded-md cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "SIMPAN"
                  )}
                </button>
              </div>
            </CardActions>
          </form>
        </Card>
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
