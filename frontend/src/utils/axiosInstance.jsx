// import axios from "axios";

// const API_URL = process.env.REACT_APP_API_URL;

// const axiosInstance = axios.create({
//     baseURL: "API_URL/api",
// });

// // Add a request interceptor to attach the token
// axiosInstance.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem("accessToken");
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         } else {
//             console.error("No access token found in localStorage.");
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// export default axiosInstance;
