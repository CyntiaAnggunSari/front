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
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Checkbox from "@mui/material/Checkbox";
import Autocomplete from "@mui/material/Autocomplete";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { redirect } from "next/navigation";
import { saveKelasSiswa } from "@/app/actions/kelas";
import { getListSiswa } from "@/app/actions/siswa";
import { getListKelas } from "@/app/actions/kelas";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function AddKelasSiswaPage() {
  const [open, setOpen] = useState(false);
  const [alertStatus, setAlertStatus] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [dataSiswa, setDataSiswa] = useState([]);
  const [dataSiswaLoading, setDataSiswaLoading] = useState(false);
  const [idSiswa, setIdSiswa] = useState("");
  const [dataKelas, setDataKelas] = useState([]);
  const [dataKelasLoading, setDataKelasLoading] = useState(false);
  const [idKelas, setIdKelas] = useState("");
  const [siswa, setSiswa] = useState("");
  const [kelas, setKelas] = useState("");
  const [formState, formAction] = useActionState(saveKelasSiswa, {
    status: 0,
    message: "",
  });

  const siswaRef = useRef(null);
  const kelasRef = useRef(null);

  useEffect(() => {
      getDataSiswa();
    }, []);

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

  const handleSubmit = (e) => {
  const siswa = idSiswa;
  const kelas = idKelas;

  if ( !siswa || !kelas) {
    e.preventDefault(); // 🚫 stop submit ke server
    setMessage("Semua input wajib diisi");
    setAlertStatus("error");
    setOpen(true);
    setIsLoading(false);
    return;
  }
  setIsLoading(true); // ✅ valid, boleh submit
};

  const getDataSiswa = async () => {
      setDataSiswaLoading(true);
      try {
        const payload = {
          limit: 1000,
          page: 1,
          search: "",
        };
        const listSiswa = await getListSiswa(payload);
  
        if (listSiswa.status == 200) {
          setDataSiswa(listSiswa.data);
        } else {
          setOpen(true);
          setMessage(listSiswa.message);
          setAlertStatus("error");
        }
        setDataSiswaLoading(false);
      } catch (error) {
        setOpen(true);
        setMessage("Terjadi kesalahan");
        setAlertStatus("error");
        setDataSiswaLoading(false);
      }
    };

  const getDataKelas = async (keyword) => {
    setDataKelasLoading(true);
    try {
      const payload = {
        limit: 20,
        page: 1,
        search: keyword,
      };
      const listKelas = await getListKelas(payload);

      if (listKelas.status == 200) {
        setDataKelas(listKelas.data);
      } else {
        setOpen(true);
        setMessage(listKelas.message);
        setAlertStatus("error");
      }
      setDataKelasLoading(false);
    } catch (error) {
      setOpen(true);
      setMessage("Terjadi kesalahan");
      setAlertStatus("error");
      setDataKelasLoading(false);
    }
  };

  const resetHandler = () => {
    siswaRef.current?.click();
    kelasRef.current?.click();
     setIdSiswa("");
  };

  const backHandler = () => {
    return redirect("/dashboard/kelas/kelas_siswa");
  };
  return (
    <div className="flex flex-col w-full p-4">
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/dashboard">
          Dashboard
        </Link>
        <Link underline="hover" color="inherit" href="/dashboard/kelas/kelas_siswa">
          Kelas Siswa
        </Link>
        <Typography>Add</Typography>
      </Breadcrumbs>
      <div className="mt-2 w-full">
        <Card>
          <form action={formAction} onSubmit={handleSubmit}>
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
                  <FormLabel htmlFor="siswa">Siswa</FormLabel>
                  <Autocomplete
                    id="siswa"
                    fullWidth
                    multiple
                    options={dataSiswa}
                    size="small"
                    getOptionLabel={(option) =>
                      `${option.nis} - ${option.nama}`
                    }
                    disableCloseOnSelect
                    renderOption={(props, option, { selected }) =>{
                      const {key, ...optionProps} = props;
                      return(
                        <li key={key} { ...optionProps}>
                          <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                          />
                          { option.nis } - {option.nama}
                        </li>
                      );
                    }}
                    renderInput={(params) => <TextField {...params} />}
                    slotProps={{ clearIndicator: {ref: siswaRef } }}
                    loading={dataSiswaLoading}
                    onChange={(event, value) => {
                      setIdSiswa(JSON.stringify(value));
                    }}
                    />
                  <input type="hidden" name="siswa" value={idSiswa} />
                </FormControl>
                <FormControl fullWidth>
                  <FormLabel htmlFor="kelas"> Kelas</FormLabel>
                  <Autocomplete
                    id="kelas"
                    fullWidth
                    options={dataKelas}
                    size="small"
                    getOptionLabel={(option) =>
                      `${option.id_kelas} - ${option.nama}`
                    }
                    isOptionEqualToValue={(option, value) =>
                      option.value == value.value
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Ketik minimal 1 huruf"
                      />
                    )}
                    slotProps={{ clearIndicator: { ref: kelasRef } }}
                    loading={dataKelasLoading}
                    onInputChange={(event) => getDataKelas(event.target.value)}
                    onChange={(event, value) => {
                      setIdKelas(value ? value.id_kelas : "");
                      setKelas(value ? value.nama : "");
                    }}
                  />
                  <input type="hidden" name="id_kelas" value={idKelas} />
                  <input type="hidden" name="kelas" value={kelas} />
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
