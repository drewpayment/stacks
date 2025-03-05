import { dev } from '$app/environment';
import type { Cookies } from '@sveltejs/kit';
import { AUTH_COOKIE } from './auth';


export function setSessionTokenCookie(cookies: Cookies, token: string, expiresAt: Date, path = '/'): void {
  deleteSessionTokenCookie(cookies);
  if (!dev) {
    // When deployed over HTTPS   
    cookies.set(
      AUTH_COOKIE,
      `${token}; HttpOnly; SameSite=Lax; Expires=${expiresAt.toUTCString()}; Path=/; Secure;`, {
      path,
      expires: expiresAt,
    });
  } else {
    // When deployed over HTTP (localhost)
    cookies.set(
      AUTH_COOKIE,
      `${token}; HttpOnly; SameSite=Lax; Expires=${expiresAt.toUTCString()}; Path=/`, {
      path,
      expires: expiresAt,
    });
  }
}

export function deleteSessionTokenCookie(cookies: Cookies): void {
  if (!dev) {
    // When deployed over HTTPS
    cookies.set(
      AUTH_COOKIE,
      "; HttpOnly; SameSite=Lax; Max-Age=0; Path=/; Secure;", {
      path: '/',
    });
  } else {
    // When deployed over HTTP (localhost)
    cookies.set(
      AUTH_COOKIE,
      "; HttpOnly; SameSite=Lax; Max-Age=0; Path=/", {
      path: '/',
    });
  }
}