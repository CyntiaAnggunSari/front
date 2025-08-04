"use server";

import "../../envConfig";
import { decrypt } from "../lib/session";
import { cookies } from "next/headers";

export async function getListAdmin(payload) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();
  console.log(session?.userId);
  
  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");

  const res = await fetch(`${process.env.BACKEND_URL}/admin/list`, {
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

export async function saveAdmin(prevState, formData) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();
  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");
  const data = {
    nip: formData.get("nip"),
    nama: formData.get("nama"),
    jenis_kelamin: formData.get("jenisKelamin"),
    alamat: formData.get("alamat"),
    agama: formData.get("agama"),
    no_hp: formData.get("noHp"),
    password: formData.get("password"),
  };

  const res = await fetch(`${process.env.BACKEND_URL}/admin/add`, {
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

export async function getDetailAdmin(payload) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();
  console.log(session?.userId);
  
  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");

  const res = await fetch(`${process.env.BACKEND_URL}/admin/detail`, {
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

export async function updateAdmin(prevState, formData) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();
  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");
  const data = {
    nip: formData.get("nip"),
    nama: formData.get("nama"),
    jenis_kelamin: formData.get("jenisKelamin"),
    alamat: formData.get("alamat"),
    agama: formData.get("agama"),
    no_hp: formData.get("noHp"),
    password: formData.get("password"),
  };

  const res = await fetch(`${process.env.BACKEND_URL}/admin/update`, {
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

export async function deleteAdmin(payload) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();
  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");

  const res = await fetch(`${process.env.BACKEND_URL}/admin/delete`, {
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