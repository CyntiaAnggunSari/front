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
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Autocomplete from "@mui/material/Autocomplete";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { redirect } from "next/navigation";
import { savePeriode } from "@/app/actions/periode";

export default function AddGuruPage() {
  const [open, setOpen] = useState(false);
  const [alertStatus, setAlertStatus] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [semester, setSemester] = useState("");
  const [formState, formAction] = useActionState(savePeriode, {
    status: 0,
    message: "",
  });

  useEffect(() => {
    if (formState.status == 201) {
      setOpen(true);
      setMessage(formState.message);
      setAlertStatus("success");
      resetHandler();
    } else if (formState.status == 500) {
      setOpen(true);
      setMessage(formState.message);
      setAlertStatus("error");
    }
    setIsLoading(false);
  }, [formState]);

  const resetHandler = () => {
    setSemester("");
  };

  const backHandler = () => {
    return redirect("/dashboard/periode");
  };

  return (
    <div className="flex flex-col w-full p-4">
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/dashboard">
          Dashboard
        </Link>
        <Link underline="hover" color="inherit" href="/dashboard/periode">
          Periode
        </Link>
        <Typography>Add</Typography>
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
                <FormControl>
                  <label htmlFor="semester">Semester</label>
                  <RadioGroup
                    row
                    name="row-radio-buttons-group"
                    id="semester"
                  >
                    <FormControlLabel
                      value="Ganjil"
                      control={
                        <Radio
                          checked={semester == "Ganjil" ? true : false}
                          onChange={() => setSemester("Ganjil")}
                        />
                      }
                      name="semester"
                      label="Ganjil"
                    />
                    <FormControlLabel
                      value="Genap"
                      control={
                        <Radio
                          checked={semester == "Genap" ? true : false}
                          onChange={() => setSemester("Genap")}
                        />
                      }
                      name="semester"
                      label="Genap"
                    />
                  </RadioGroup>
                </FormControl>
                <FormControl fullWidth>
                  <FormLabel htmlFor="alamat">Tahun</FormLabel>
                  <TextField
                    id="tahun"
                    name="tahun"
                    variant="outlined"
                    fullWidth
                    size="small"
                    type="text"
                    placeholder="contoh: 2024/2025"
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
