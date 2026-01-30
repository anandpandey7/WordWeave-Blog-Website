import { jwtDecode } from "jwt-decode";

type JWTPayload = {
  id: string;
  exp: number;
};

export function getLoggedInUserId(): string | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<JWTPayload>(token);
    return decoded.id;
  } catch {
    return null;
  }
}
