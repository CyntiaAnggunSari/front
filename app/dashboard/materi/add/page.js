"use client";
import React, {
  useActionState,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { redirect } from "next/navigation";
import { saveMateri } from "@/app/actions/materi";
import { getListMatapelajaranByGuruIdPeriode } from "@/app/actions/matapelajaran";
import { useDropzone } from "react-dropzone";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function AddMateriPage() {
  const [open, setOpen] = useState(false);
  const [alertStatus, setAlertStatus] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [dataMatapelajaran, setDataMatapelajaran] = useState([]);
  const [dataMpLoading, setDataMpLoading] = useState(false);
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");
  const [listMp, setListMp] = useState([]);
  const [formState, formAction] = useActionState(saveMateri, {
    status: 0,
    message: "",
  });
  const judulRef = useRef(null);
  const MpRef = useRef(null);

  useEffect(() => {
     getDataMp();
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

  const resetHandler = () => {
    MpRef.current?.click();
    judulRef.current?.focus();
    setFile("");
    setFileName("");
  };

  const getDataMp = async (keyword) => {
      setDataMpLoading(true);
      try {
        const listMp = await getListMatapelajaranByGuruIdPeriode({
          limit: 20,
          page: 1,
          search: keyword,
        });
        if (listMp.status === 200) {
          setDataMatapelajaran(listMp.data);
        } else {
          setMessage(listMp.message);
          setAlertStatus("error");
          setOpen(true);
        }
      } catch (error) {
        setMessage("Terjadi kesalahan saat mengambil data matapelajaran");
        setAlertStatus("error");
        setOpen(true);
      }
      setDataMpLoading(false);
    };
  

  const backHandler = () => {
    return redirect("/dashboard/materi");
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

  return (
    <div className="flex flex-col w-full p-4">
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/dashboard">
          Dashboard
        </Link>
        <Link underline="hover" color="inherit" href="/dashboard/materi">
          Materi
        </Link>
        <Typography>Add</Typography>
      </Breadcrumbs>
      <div className="mt-2 w-full">
        <Card>
          <form
            action={async (formData) => {
              const judul = formData.get("judul")?.trim();
              const deskripsi = formData.get("deskripsi")?.trim();
              const mapel = formData.get("mapel")?.length > 0;
              const fileMateri = formData.get("fileMateri")?.trim();
              const fileName = formData.get("fileName")?.trim();

              if (!judul || !deskripsi || !mapel || !fileMateri || !fileName) {
                setMessage("Semua field wajib diisi");
                setAlertStatus("error");
                setOpen(true);
                setIsLoading(false);
                return;
              }

              setIsLoading(true);
              await formAction(formData);
            }}
          >
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
                  <FormLabel htmlFor="judul">Judul Materi</FormLabel>
                  <TextField
                    id="judul"
                    name="judul"
                    variant="outlined"
                    fullWidth
                    size="small"
                    type="text"
                    inputRef={judulRef}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <FormLabel htmlFor="deskripsi">Deskripsi</FormLabel>
                  <TextField
                    id="deskripsi"
                    name="deskripsi"
                    variant="outlined"
                    fullWidth
                    size="small"
                    type="text"
                    multiline
                    rows={4}
                  />
                </FormControl>
                <Autocomplete
                  multiple
                  options={dataMatapelajaran}
                  value={listMp}
                  getOptionLabel={(opt) =>
                    opt?.nama_mp && opt?.nama
                      ? `${opt.nama_mp} - ${opt.nama}`
                      : ""
                  }
                  isOptionEqualToValue={(option, value) =>
                    option.id_mp === value.id_mp
                  }
                  onChange={(e, value) => {
                    setListMp(value);
                    console.log(value);
                    
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Mata Pelajaran"
                      size="small"
                    />
                  )}
                  loading={dataMpLoading}
                />
                <input type="hidden" value={JSON.stringify(listMp)} name="mapel"/>
                <FormControl fullWidth>
                  <FormLabel htmlFor="upload">Upload File</FormLabel>
                  <div
                    className="flex flex-col w-full items-center justify-center h-64 border border-2 border-dark-orange border-dashed cursor-pointer"
                    {...getRootProps()}
                  >
                    <input {...getInputProps()} accept=".pdf" />
                    {isDragActive ? (
                      <p>Drop the files here ...</p>
                    ) : (
                      <p>
                        Drag and drop some files here, or click to select files
                      </p>
                    )}
                  </div>
                  <input type="hidden" value={file} name="fileMateri" />
                  <input type="hidden" value={fileName} name="fileName" />
                </FormControl>
                {file ? (
                  <embed
                    type="application/pdf"
                    src={file}
                    className="w-full h-96"
                  ></embed>
                ) : null}
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
