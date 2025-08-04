"use client";
import React, { useState } from "react";
import Link from "next/link";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";

export default function KelasPage() {
  return (
    <div className="flex flex-col w-full p-4">
      <Breadcrumbs aria-label="breadcrumb">
        <Typography>Kelas</Typography>
      </Breadcrumbs>
      <div className="mt-2 w-full">
        <div className="flex flex-row w-full justify-center gap-16 mt-16">
          <Link
            href="/dashboard/kelas/kelas"
            className="flex flex-col w-1/4 rounded-lg bg-light-pink overflow-hidden cursor-pointer"
          >
            <div className="flex w-full py-4 justify-center">
              <img src="/icons/mata_pelajaran.svg" alt="kelas" />
            </div>
            <div className="flex bg-black text-white w-full justify-center py-3 text-lg font-bold">
             Kelas
            </div>
          </Link>
          <Link
            href="/dashboard/kelas/kelas_siswa"
            className="flex flex-col w-1/4 rounded-lg bg-light-pink overflow-hidden cursor-pointer"
          >
            <div className="flex w-full py-4 justify-center">
              <img src="/icons/jadwal_pelajaran.svg" alt="kelas_siswa" />
            </div>
            <div className="flex bg-black text-white w-full justify-center py-3 text-lg font-bold">
              Kelas Siswa
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
