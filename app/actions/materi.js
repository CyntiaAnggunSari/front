"use server";

import "../../envConfig";
import { decrypt } from "../lib/session";
import { cookies } from "next/headers";

export async function getListMateri(payload) {
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

export async function getListMateriGuru(payload) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();

  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");

  const res = await fetch(`${process.env.BACKEND_URL}/materi/guru`, {
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

  const res = await fetch(`${process.env.BACKEND_URL}/materi/guru`, {
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

export async function saveMateri(prevState, formData) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();
  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");
  const data = {
    judul: formData.get("judul"),
    deskripsi: formData.get("deskripsi"),
    filename: formData.get("fileName"),
    fileMateri: formData.get("fileMateri"),
    mapel: JSON.parse(formData.get("mapel")),
    matapelajaran_id: formData.get("matapelajaran_id"),
  };
  const res = await fetch(`${process.env.BACKEND_URL}/materi/add`, {
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

export async function getMateriById(payload) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();

  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");

  const res = await fetch(`${process.env.BACKEND_URL}/materi/detail`, {
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

export async function getListMateriByKelas(payload) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();

  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");

  const res = await fetch(`${process.env.BACKEND_URL}/materi/kelas`, {
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

export async function deleteMateri(payload) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();

  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");

  const res = await fetch(`${process.env.BACKEND_URL}/materi/delete`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(payload),
  });

  const json = await res.json();

  if (!res.ok) {
    return { status: 500, message: "Terjadi kesalahan jaringan", data: {} };
  }

  if (json.statusCode == 200) {
    return { status: 200, message: json.message, data: json.data };
  }

  return { status: json.statusCode, message: json.message, data: {} };
}
