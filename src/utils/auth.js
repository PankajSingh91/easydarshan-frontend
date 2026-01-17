export const saveToken = (token) => {
  localStorage.setItem("ed_token", token);
};

export const getToken = () => {
  return localStorage.getItem("ed_token");
};

export const clearToken = () => {
  localStorage.removeItem("ed_token");
};

export const isLoggedIn = () => {
  return !!getToken();
};
