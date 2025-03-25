export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token; // Returns true if token exists
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login"; // Redirect to login page
};