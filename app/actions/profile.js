"use server";

import "../../envConfig";
import { decrypt } from "../lib/session";
import { cookies } from "next/headers";

export async function getDetail() {
  try {
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);
    const headers = new Headers();
    headers.append("Authorization", session?.userId);
    headers.append("Content-Type", "application/json");

    const res = await fetch(`${process.env.BACKEND_URL}/profil/detail`, {
      method: "POST",
      headers,
      body: JSON.stringify({}),
    });

    const json = await res.json();

    if (!res.ok) {
      return {
        status: res.status,
        message: "Terjadi kesalahan jaringan",
        data: {},
      };
    }

    return {
      status: json.statusCode || res.status,
      message: json.message || "Gagal memuat data",
      data: json.data || {},
    };
  } catch (error) {
    return { status: 500, message: "Terjadi kesalahan internal", data: {} };
  }
}

export async function updatePassword(payload) {
  try {
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);
    const headers = new Headers();
    headers.append("Authorization", session?.userId);
    headers.append("Content-Type", "application/json");
    const res = await fetch(`${process.env.BACKEND_URL}/profil/update`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
      return { status: 500, message: "Terjadi kesalahan jaringan", data: [] };
    }

    return { status: json.statusCode, message: json.message };

  } catch (error) {
    return { status: 500, message: "Terjadi kesalahan internal", data: {} };
  }
}
