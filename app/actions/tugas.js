"use server";

import "../../envConfig";
import { decrypt } from "../lib/session";
import { cookies } from "next/headers";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

export async function getListTugas(payload) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();

  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");

  const res = await fetch(`${process.env.BACKEND_URL}/mata_pelajaran/list`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(payload),
  });

  const json = await res.json();

  if (!res.ok) {
    return { status: 500, message: "Terjadi kesalahan jaringan", data: [] };
  }

  if (json.statusCode == 200) {
    return { status: 200, message: json.message, data: json.data };
  }

  return { status: json.statusCode, message: json.message, data: [] };
}

export async function getListTugasGuru(payload) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();

  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");

  const res = await fetch(`${process.env.BACKEND_URL}/tugas/guru`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(payload),
  });

  const json = await res.json();

  if (!res.ok) {
    return { status: 500, message: "Terjadi kesalahan jaringan", data: [] };
  }

  if (json.statusCode == 200) {
    return { status: 200, message: json.message, data: json.data };
  }

  return { status: json.statusCode, message: json.message, data: [] };
}

export async function getListTugasByKelas(payload) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();

  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");

  const res = await fetch(`${process.env.BACKEND_URL}/tugas/kelas`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(payload),
  });

  const json = await res.json();

  if (!res.ok) {
    return { status: 500, message: "Terjadi kesalahan jaringan", data: [] };
  }

  if (json.statusCode == 200) {
    return { status: 200, message: json.message, data: json.data };
  }

  return { status: json.statusCode, message: json.message, data: [] };
}


export async function getListMateriById(payload) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();

  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");

  const res = await fetch(`${process.env.BACKEND_URL}/tugas/guru`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(payload),
  });

  const json = await res.json();

  if (!res.ok) {
    return { status: 500, message: "Terjadi kesalahan jaringan", data: [] };
  }

  if (json.statusCode == 200) {
    return { status: 200, message: json.message, data: json.data };
  }

  return { status: json.statusCode, message: json.message, data: [] };
}

export async function saveTugas(formData) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();
  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");
  dayjs.extend(customParseFormat);

  const data = {
    judul: formData.judul,
    deskripsi: formData.deskripsi,
    filename: formData.fileName,
    fileTugas: formData.fileTugas,
    tanggal_mulai: formData.tanggal_mulai,
    tanggal_berakhir: formData.tanggal_berakhir,
    kelas: formData.kelas,
    mapel: formData.mapel,
    jenis: formData.jenis, // karena payload-nya memang "jenis"
    soal: formData.soal || [],
  };
 const res = await fetch(`${process.env.BACKEND_URL}/tugas/add`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    return { status: 500, message: "Terjadi kesalahan jaringan", data: [] };
  }
 return { status: json.statusCode, message: json.message };
}

export async function getTugasById(payload) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();

  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");

  const res = await fetch(`${process.env.BACKEND_URL}/tugas/detail`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(payload),
  });
 
  const json = await res.json();

  if (!res.ok) {
    return { status: 500, message: "Terjadi kesalahan jaringan", data: [] };
  }

  if (json.statusCode == 200) {
    return { status: 200, message: json.message, data: json.data };
  }

  return { status: json.statusCode, message: json.message, data: [] };
}

export async function saveTugasSiswa(payload) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();
  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");

  const res = await fetch(`${process.env.BACKEND_URL}/tugas/siswa`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(payload),
  });

  const json = await res.json();

  if (!res.ok) {
    return { status: 500, message: "Terjadi kesalahan jaringan", data: [] };
  }

  return { status: json.statusCode, message: json.message };
}

export async function getTugasBySiswa(payload) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();

  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");

  const res = await fetch(`${process.env.BACKEND_URL}/tugas/siswa/detail`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(payload),
  });

  const json = await res.json();

  if (!res.ok) {
    return { status: 500, message: "Terjadi kesalahan jaringan", data: [] };
  }

  if (json.statusCode == 200) {
    return { status: 200, message: json.message, data: json.data };
  }

  return { status: json.statusCode, message: json.message, data: [] };
}

export async function getSoalTugas(payload) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();

  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");

  const res = await fetch(`${process.env.BACKEND_URL}/tugas/soal`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(payload),
  });

  const json = await res.json();

  if (!res.ok) {
    return { status: 500, message: "Terjadi kesalahan jaringan", data: [] };
  }

  if (json.statusCode == 200) {
    return { status: 200, message: json.message, data: json.data };
  }

  return { status: json.statusCode, message: json.message, data: [] };
}


export async function getListTugasSiswa(payload) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();

  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");

  const res = await fetch(`${process.env.BACKEND_URL}/tugas/siswa/list`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(payload),
  });

  const json = await res.json();

  if (!res.ok) {
    return { status: 500, message: "Terjadi kesalahan jaringan", data: [] };
  }

  if (json.statusCode == 200) {
    return { status: 200, message: json.message, data: json.data };
  }

  return { status: json.statusCode, message: json.message, data: [] };
}

export async function saveNilaiTugasSiswa(payload) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();
  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");

  const res = await fetch(`${process.env.BACKEND_URL}/tugas/siswa/nilai`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(payload),
  });

  const json = await res.json();

  if (!res.ok) {
    return { status: 500, message: "Terjadi kesalahan jaringan", data: {} };
  }

  return { status: json.statusCode, message: json.message };
}

export async function saveJawabanTugasSiswa(payload) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();
  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");

  const res = await fetch(`${process.env.BACKEND_URL}/tugas/siswa/jawab`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(payload),
  });

  const json = await res.json();

  if (!res.ok) {
    return { status: 500, message: "Terjadi kesalahan jaringan", data: {} };
  }

  return { status: json.statusCode, message: json.message };
}