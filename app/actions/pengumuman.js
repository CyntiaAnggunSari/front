"use server";

import "../../envConfig";
import { decrypt } from "../lib/session";
import { cookies } from "next/headers";

export async function getListPengumuman(payload) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();
  console.log(session?.userId);
  
  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");

  const res = await fetch(`${process.env.BACKEND_URL}/pengumuman/list`, {
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

export async function savePengumuman(prevState, formData) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();
  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");
  const data = {
    judul: formData.get("judul"),
    isi: formData.get("isi"),
  };

  console.log(data);

  const res = await fetch(`${process.env.BACKEND_URL}/pengumuman/add`, {
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

export async function getDetailPengumuman(payload) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();
  console.log(session?.userId);
  
  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");

  const res = await fetch(`${process.env.BACKEND_URL}/pengumuman/detail`, {
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

export async function updatePengumuman(prevState, formData) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();
  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");
  const data = {
    id: formData.get("id"),
    judul: formData.get("judul"),
    isi: formData.get("isi"),
  };
  const res = await fetch(`${process.env.BACKEND_URL}/pengumuman/update`, {
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

export async function deletePengumuman(payload) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();
  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");

  const res = await fetch(`${process.env.BACKEND_URL}/pengumuman/delete`, {
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