const BASE_URL = "https://ecommerce.routemisr.com/api/v1";

async function parseJsonSafe(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function generateAutoPhone() {
  const suffix = Math.floor(Math.random() * 100000000)
    .toString()
    .padStart(8, "0");
  return `010${suffix}`;
}

export async function registerUser(data) {
  try {
    const response = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
        rePassword: data.rePassword,
        phone: generateAutoPhone(),
      }),
    });

    const result = await parseJsonSafe(response);

    if (!response.ok) {
      throw new Error(result?.message || "Registration failed");
    }

    return result;
  } catch (err) {
    throw new Error(err?.message || "Network error during registration");
  }
}

export async function loginUser(data) {
  try {
    const response = await fetch(`${BASE_URL}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });

    const result = await parseJsonSafe(response);

    if (!response.ok) {
      throw new Error(result?.message || "Login failed");
    }

    return result;
  } catch (err) {
    throw new Error(err?.message || "Network error during login");
  }
}

export async function forgotPassword(email) {
  try {
    const response = await fetch(`${BASE_URL}/auth/forgotPasswords`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const result = await parseJsonSafe(response);

    if (!response.ok) {
      throw new Error(result?.message || "Failed to send reset code");
    }

    return result;
  } catch (err) {
    throw new Error(
      err?.message || "Network error while sending reset code"
    );
  }
}

export async function verifyResetCode(resetCode) {
  try {
    const response = await fetch(`${BASE_URL}/auth/verifyResetCode`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ resetCode }),
    });

    const result = await parseJsonSafe(response);

    if (!response.ok) {
      throw new Error(result?.message || "Invalid reset code");
    }

    return result;
  } catch (err) {
    throw new Error(err?.message || "Network error while verifying code");
  }
}

export async function resetPassword(email, newPassword) {
  try {
    const response = await fetch(`${BASE_URL}/auth/resetPassword`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, newPassword }),
    });

    const result = await parseJsonSafe(response);

    if (!response.ok) {
      throw new Error(result?.message || "Failed to reset password");
    }

    return result;
  } catch (err) {
    throw new Error(err?.message || "Network error while resetting password");
  }
}

export async function changePassword({
  currentPassword,
  password,
  rePassword,
}) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${BASE_URL}/users/changeMyPassword`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token,
      },
      body: JSON.stringify({
        currentPassword,
        password,
        rePassword,
      }),
    });

    const result = await parseJsonSafe(response);

    if (!response.ok) {
      throw new Error(result?.message || "Failed to change password");
    }

    return result;
  } catch (err) {
    throw new Error(err?.message || "Network error while changing password");
  }
}
