const AUTHENTICATION_STORAGE_KEY = 'ImpactAll:Authentication';
const AUTHETICATION_USER_ID = 'ImpactAll:UserId';
const AUTHENTICATION_PASSWORD = 'ImpactAll:ImpactAll:AUTHENTICATION_PASSWORD';
const AUTHENTICATION_EMAIL = 'ImpactAll:AUTHENTICATION_EMAIL';

export function setLoginData(data) {
  return window.localStorage.setItem(AUTHENTICATION_STORAGE_KEY, data);
}

export function getLoginData() {
  return window.localStorage.getItem(AUTHENTICATION_STORAGE_KEY);
}

export function getAuthenticationToken() {
  return window.localStorage.getItem(AUTHENTICATION_STORAGE_KEY);
}

export async function setAuthenticationToken(token) {
  return window.localStorage.setItem(AUTHENTICATION_STORAGE_KEY, token);
}

export async function clearAuthenticationToken() {
  return window.localStorage.removeItem(AUTHENTICATION_STORAGE_KEY);
}

export async function setEmail(email) {
  return window.localStorage.setItem(AUTHENTICATION_EMAIL, email);
}

export async function getEmail() {
  return window.localStorage.getItem(AUTHENTICATION_EMAIL);
}

export async function clearEmail() {
  return window.localStorage.removeItem(AUTHENTICATION_EMAIL);
}

export async function setPassword(password) {
  return window.localStorage.setItem(AUTHENTICATION_PASSWORD, password);
}

export async function getPassword() {
  return window.localStorage.getItem(AUTHENTICATION_PASSWORD);
}

export async function clearPassword() {
  return window.localStorage.removeItem(AUTHENTICATION_PASSWORD);
}
export async function setUserId(userId) {
  return window.localStorage.setItem(AUTHETICATION_USER_ID, userId);
}

export function getUserId() {
  return window.localStorage.getItem(AUTHETICATION_USER_ID);
}

export async function clearUserId() {
  return window.localStorage.removeItem(AUTHETICATION_USER_ID);
}
