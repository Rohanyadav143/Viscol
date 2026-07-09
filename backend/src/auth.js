import crypto from "crypto";

export const SESSION_COOKIE = "cv_session";
export const SESSION_DURATION_DAYS = 30;
export const SESSION_DURATION_MS = SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000;

export const createSessionToken = () => crypto.randomBytes(32).toString("base64url");

export const getCookieValue = (req, name) => {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;

  const match = cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
};

export const getSessionToken = (req) => getCookieValue(req, SESSION_COOKIE);

export const setSessionCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: SESSION_DURATION_MS,
    path: "/",
  });
};

export const clearSessionCookie = (res) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie(SESSION_COOKIE, {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    path: "/",
  });
};
