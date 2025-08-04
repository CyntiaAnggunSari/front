"use server";

import "../../envConfig";
import { decrypt } from "../lib/session";
import { cookies } from "next/headers";

export async function getListKelas(payload) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();

  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");

  const res = await fetch(`${process.env.BACKEND_URL}/kelas/list`, {
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

export async function getListKelasByPeriode(payload) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();

  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");

  const res = await fetch(`${process.env.BACKEND_URL}/kelas/listperiode`, {
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

export async function saveKelas(prevState, formData) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();
  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");
  const data = {
    nama: formData.get("nama"),
    wali_kelas: formData.get("wali_kelas"),
    id_guru: formData.get("id_guru"),
  };

  console.log(data);

  const res = await fetch(`${process.env.BACKEND_URL}/kelas/add`, {
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

export async function getDetailKelas(payload) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();
  console.log(session?.userId);

  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");

  const res = await fetch(`${process.env.BACKEND_URL}/kelas/detail`, {
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

export async function deleteKelas(payload) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();

  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");

  const res = await fetch(`${process.env.BACKEND_URL}/kelas/delete`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload), // ✅ kirim sebagai objek { id: ... }
  });

  const contentType = res.headers.get("Content-Type") || "";
  if (!contentType.includes("application/json")) {
    return { status: 500, message: "Respon dari server bukan JSON", data: [] };
  }

  const json = await res.json();

  if (!res.ok) {
    return { status: 500, message: "Terjadi kesalahan jaringan", data: [] };
  }

  return { status: json.statusCode, message: json.message };
}

export async function updateKelas(formData) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  const data = {
    id_kelas: formData.get("id_kelas"),
    nama: formData.get("nama"),
    wali_kelas: formData.get("wali_kelas"),
    id_guru: formData.get("id_guru")
  };

  const res = await fetch(`${process.env.BACKEND_URL}/kelas/update`, {
    method: "POST",
    headers: {
      Authorization: session?.userId,
      "Content-Type": "application/json",
    },
    
    body: JSON.stringify(data),
  });

  const json = await res.json();
  return { status: json.statusCode, message: json.message };
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


export async function saveKelasSiswa(payload) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();
  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");

  console.log("Payload dikirim:", payload);

  const res = await fetch(`${process.env.BACKEND_URL}/kelas_siswa/add`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  console.log("⬅️ Response JSON:", json);

  if (!res.ok) {
    console.error("❌ Error status:", res.status);
    return {
      status: res.status || 500,
      message: json?.message || "Terjadi kesalahan jaringan",
      data: {},
    };
  }

  // ✅ Tambahkan return di sini untuk hasil sukses
  return {
    status: res.status,
    message: json?.message || "Berhasil",
    data: json?.data || {},
  };
}

export async function deleteKelasSiswa(payload) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();
  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");

  const res = await fetch(`${process.env.BACKEND_URL}/kelas_siswa/delete`, {
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

export async function getListKelasByGuru(payload) {
  try {
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);

    if (!session?.userId) {
      return { status: 401, message: "Session tidak valid", data: [] };
    }

    const headers = new Headers();
    headers.append("Authorization", session.userId);
    headers.append("Content-Type", "application/json");

    const res = await fetch(`${process.env.BACKEND_URL}/kelas/guru`, {
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
  } catch (error) {
    return { status: 500, message: "Gagal mengambil data kelas", data: [] };
  }
}

export async function getListKelasByGuruIdPeriode(payload) {
  try {
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);

    if (!session?.userId) {
      return { status: 401, message: "Session tidak valid", data: [] };
    }

    const headers = new Headers();
    headers.append("Authorization", session.userId);
    headers.append("Content-Type", "application/json");

    const res = await fetch(`${process.env.BACKEND_URL}/kelas/guruperiode`, {
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
  } catch (error) {
    return { status: 500, message: "Gagal mengambil data kelas", data: [] };
  }
}

export async function getListKelasBySiswa(payload) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const headers = new Headers();

  headers.append("Authorization", session?.userId);
  headers.append("Content-Type", "application/json");

  const res = await fetch(`${process.env.BACKEND_URL}/kelas/siswa`, {
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
