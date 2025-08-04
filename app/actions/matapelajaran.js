"use server";

import "../../envConfig";
import { decrypt } from "../lib/session";
import { cookies } from "next/headers";

export async function getListMatapelajaran(payload) {
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

export async function getListMateriMatapelajaranGuru(payload) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();

  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");

  const res = await fetch(`${process.env.BACKEND_URL}/mata_pelajaran/guru`, {
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

export async function getListTugasMatapelajaranGuru(payload) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();

  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");

  const res = await fetch(`${process.env.BACKEND_URL}/mata_pelajaran/guru`, {
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
export async function saveMatapelajaran(prevState, formData) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();
  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");
  const data = {
    nama_mp: formData.get("nama_mp"),
    id_mapel: formData.get("id_mapel"),
    guru_mp: formData.get("guru_mp"),
    id_guru: formData.get("id_guru"),
    id_kelas: formData.get("id_kelas"),
  };

  const res = await fetch(`${process.env.BACKEND_URL}/mata_pelajaran/add`, {
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

export async function getListMatapelajaranSiswa(payload) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();

  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");

  const res = await fetch(`${process.env.BACKEND_URL}/mata_pelajaran/kelas`, {
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

export async function getListKelasSiswa(payload) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();

  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");

  const res = await fetch(`${process.env.BACKEND_URL}/kelas_siswa/list`, {
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

export async function getMatapelajaran(payload) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();

  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");

  const res = await fetch(`${process.env.BACKEND_URL}/mata_pelajaran/get`, {
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

export async function deleteMatapelajaran(payload) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();
  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");

  const res = await fetch(`${process.env.BACKEND_URL}/mata_pelajaran/delete`, {
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
export async function getListMatapelajaranByGuruIdPeriode(payload) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();

  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");

  const res = await fetch(`${process.env.BACKEND_URL}/mata_pelajaran/list/listunique`, {
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

export async function getListMapel(payload) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();

  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");

  const res = await fetch(`${process.env.BACKEND_URL}/mata_pelajaran/list/mapel`, {
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

export async function deleteMapel(payload) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();
  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");

  const res = await fetch(`${process.env.BACKEND_URL}/mata_pelajaran/delete/mapel`, {
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

export async function saveMapel(prevState, formData) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();
  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");
  const data = {
    nama_mapel: formData.get("nama_mapel"),
  };

  const res = await fetch(`${process.env.BACKEND_URL}/mata_pelajaran/add/mapel`, {
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

export async function getDetailMapel(payload) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();
  console.log(session?.userId);
  
  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");

  const res = await fetch(`${process.env.BACKEND_URL}/mata_pelajaran/detail`, {
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

export async function updateMapel(prevState, formData) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();
  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");
  const data = {
    id: formData.get("id"),
    nama_mapel: formData.get("nama_mapel"),
  };
  const res = await fetch(`${process.env.BACKEND_URL}/mata_pelajaran/update`, {
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