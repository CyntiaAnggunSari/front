"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CoPresentIcon from "@mui/icons-material/CoPresent";
import SchoolIcon from "@mui/icons-material/School";
import LogoutIcon from "@mui/icons-material/Logout";
import SubjectIcon from "@mui/icons-material/Subject";
import HotelClassIcon from "@mui/icons-material/HotelClass";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import TaskIcon from "@mui/icons-material/Task";
import RuleIcon from "@mui/icons-material/Rule";
import CampaignIcon from "@mui/icons-material/Campaign";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { redirect } from "next/navigation";
import {
  Menu,
  MenuItem,
} from "@mui/material";
import { logout } from "../actions/auth";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [namaUser, setNamaUser] = useState("");
  const [listMenu, setListMenu] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClickUser = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  }
  useEffect(() => {
    const nama = localStorage.getItem("nama");
    const role = localStorage.getItem("roleId");
    setNamaUser(nama);
    if (role == 1) {
      const menu = [
        "dashboard",
        "admin",
        "guru",
        "siswa",
        "mapel",
        "matapelajaran",
        "kelas",
        "periode",
        "pengumuman",
      ];
      setListMenu(menu);
    } else if (role == 2) {
      const menu = ["dashboard", "materi", "tugas", "nilai"];
      setListMenu(menu);
    } else if (role == 3) {
      const menu = ["dashboard", "materi", "tugas", "nilai"];
      setListMenu(menu);
    }
  }, []);
  return (
    <main className="flex w-full h-screen flex-row">
      <nav className="w-1/5 bg-light-orange">
        <div className="flex w-full gap-2 items-center bg-white text-black py-3 font-bold border-b-3 border-black mb-2">
          <Image src="/images/logo-sma.png" width={30} height={30} alt="Logo" />
          <span>SMA N 1 SUTERA</span>
        </div>
        {listMenu.includes("dashboard") && (
          <Link href="/dashboard">
            <div
              className={
                pathname == "/dashboard"
                  ? "flex flex-row w-full bg-pink py-3 border-r-3 border-dark-pink gap-2 px-2 cursor-pointer"
                  : "flex flex-row w-full py-3 gap-2 px-2 hover:bg-pink cursor-pointer"
              }
            >
              <DashboardIcon />
              <span>DASHBOARD</span>
            </div>
          </Link>
        )}
        {listMenu.includes("admin") && (
          <Link href="/dashboard/admin">
            <div
              className={
                pathname.includes("/dashboard/admin")
                  ? "flex flex-row w-full bg-pink py-3 border-r-3 border-dark-pink gap-2 px-2 cursor-pointer"
                  : "flex flex-row w-full py-3 gap-2 px-2 hover:bg-pink cursor-pointer"
              }
            >
              <AdminPanelSettingsIcon />
              <span>ADMIN</span>
            </div>
          </Link>
        )}
        {listMenu.includes("guru") && (
          <Link href="/dashboard/guru">
            <div
              className={
                pathname.includes("/dashboard/guru")
                  ? "flex flex-row w-full bg-pink py-3 border-r-3 border-dark-pink gap-2 px-2 cursor-pointer"
                  : "flex flex-row w-full py-3 gap-2 px-2 hover:bg-pink cursor-pointer"
              }
            >
              <CoPresentIcon />
              <span>GURU</span>
            </div>
          </Link>
        )}
        {listMenu.includes("siswa") && (
          <Link href="/dashboard/siswa">
            <div
              className={
                pathname.includes("/dashboard/siswa")
                  ? "flex flex-row w-full bg-pink py-3 border-r-3 border-dark-pink gap-2 px-2 cursor-pointer"
                  : "flex flex-row w-full py-3 gap-2 px-2 hover:bg-pink cursor-pointer"
              }
            >
              <SchoolIcon />
              <span>SISWA</span>
            </div>
          </Link>
        )}
        {listMenu.includes("mapel") && (
          <Link href="/dashboard/mapel">
            <div
              className={
                pathname.includes("/dashboard/mapel")
                  ? "flex flex-row w-full bg-pink py-3 border-r-3 border-dark-pink gap-2 px-2 cursor-pointer"
                  : "flex flex-row w-full py-3 gap-2 px-2 hover:bg-pink cursor-pointer"
              }
            >
              <SubjectIcon />
              <span>MATA PELAJARAN</span>
            </div>
          </Link>
        )}
        {listMenu.includes("matapelajaran") && (
          <Link href="/dashboard/mata_pelajaran">
            <div
              className={
                pathname.includes("/dashboard/mata_pelajaran")
                  ? "flex flex-row w-full bg-pink py-3 border-r-3 border-dark-pink gap-2 px-2 cursor-pointer"
                  : "flex flex-row w-full py-3 gap-2 px-2 hover:bg-pink cursor-pointer"
              }
            >
              <SubjectIcon />
              <span>MATA PELAJARAN GURU</span>
            </div>
          </Link>
        )}
        {listMenu.includes("kelas") && (
          <Link href="/dashboard/kelas/kelas">
            <div
              className={
                pathname.includes("/dashboard/kelas/kelas")
                  ? "flex flex-row w-full bg-pink py-3 border-r-3 border-dark-pink gap-2 px-2 cursor-pointer"
                  : "flex flex-row w-full py-3 gap-2 px-2 hover:bg-pink cursor-pointer"
              }
            >
              <HotelClassIcon />
              <span>KELAS</span>
            </div>
          </Link>
        )}
        {listMenu.includes("materi") && (
          <Link href="/dashboard/materi">
            <div
              className={
                pathname.includes("/dashboard/materi")
                  ? "flex flex-row w-full bg-pink py-3 border-r-3 border-dark-pink gap-2 px-2 cursor-pointer"
                  : "flex flex-row w-full py-3 gap-2 px-2 hover:bg-pink cursor-pointer"
              }
            >
              <AutoStoriesIcon />
              <span>MATERI</span>
            </div>
          </Link>
        )}
        {listMenu.includes("tugas") && (
          <Link href="/dashboard/tugas">
            <div
              className={
                pathname.includes("/dashboard/tugas")
                  ? "flex flex-row w-full bg-pink py-3 border-r-3 border-dark-pink gap-2 px-2 cursor-pointer"
                  : "flex flex-row w-full py-3 gap-2 px-2 hover:bg-pink cursor-pointer"
              }
            >
              <TaskIcon />
              <span>TUGAS</span>
            </div>
          </Link>
        )}
        {listMenu.includes("nilai") && (
          <Link href="/dashboard/nilai">
            <div
              className={
                pathname.includes("/dashboard/nilai")
                  ? "flex flex-row w-full bg-pink py-3 border-r-3 border-dark-pink gap-2 px-2 cursor-pointer"
                  : "flex flex-row w-full py-3 gap-2 px-2 hover:bg-pink cursor-pointer"
              }
            >
              <RuleIcon />
              <span>NILAI</span>
            </div>
          </Link>
        )}
        {listMenu.includes("periode") && (
          <Link href="/dashboard/periode">
            <div
              className={
                pathname.includes("/dashboard/periode")
                  ? "flex flex-row w-full bg-pink py-3 border-r-3 border-dark-pink gap-2 px-2 cursor-pointer"
                  : "flex flex-row w-full py-3 gap-2 px-2 hover:bg-pink cursor-pointer"
              }
            >
              <AccessTimeIcon />
              <span>PERIODE</span>
            </div>
          </Link>
        )}
        {listMenu.includes("pengumuman") && (
          <Link href="/dashboard/pengumuman">
            <div
              className={
                pathname.includes("/dashboard/pengumuman")
                  ? "flex flex-row w-full bg-pink py-3 border-r-3 border-dark-pink gap-2 px-2 cursor-pointer"
                  : "flex flex-row w-full py-3 gap-2 px-2 hover:bg-pink cursor-pointer"
              }
            >
              <CampaignIcon />
              <span>PENGUMUMAN</span>
            </div>
          </Link>
        )}
      </nav>
      <div className="flex flex-col w-4/5 bg-blue">
        <header className="flex w-full bg-dark-orange py-3 justify-end px-4 gap-4">
          <div>
            <NotificationsNoneRoundedIcon />
          </div>
          <div
            className="flex flex-row gap-2 cursor-pointer"
            onClick={handleClickUser}
          >
            <AccountCircleRoundedIcon />
            <span>{namaUser}</span>
          </div>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem
              onClick={() => {
                redirect("/dashboard/profile");
              }}
            >
              Profil
            </MenuItem>
          </Menu>
          <div
            onClick={() => {
              localStorage.clear();
              logout();
            }}
            className="flex flex-row gap-2 cursor-pointer"
          >
            <LogoutIcon />
            <span>Logout</span>
          </div>
        </header>
        <section className="flex flex-col w-full overflow-y-scroll flex-1">
          {children}
        </section>
      </div>
    </main>
  );
}
