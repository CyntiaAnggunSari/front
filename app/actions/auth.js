"use server";

import "../../envConfig";
import { cookies } from 'next/headers'
import { redirect } from "next/navigation";
import { encrypt, decrypt } from "../lib/session";

export async function login(prevState, formData) {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  const data = {
    username: formData.get("username"),
    password: formData.get("password"),
  };
  const res = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  });
  const json = await res.json();

  if (!res.ok) {
    return { message: "Terjadi kesalahan jaringan" };
  }

  if (json.statusCode == 200) {
    const userId = json.data?.accessToken
    
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const session = await encrypt({ userId, expiresAt })
    const cookieStore = await cookies()
  
    cookieStore.set('session', session, {
      httpOnly: true,
      secure: true,
      expires: expiresAt,
      sameSite: 'lax',
      path: '/',
    })
    return { message: "", nama: json.data?.nama, roleId: json.data?.roleId };
  }

  return { message: json.message, nama: "" };
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
  redirect("/login");
}
