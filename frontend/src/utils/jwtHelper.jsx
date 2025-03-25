// export const isTokenExpired = (token) => {
//     try {
//       // Decode the token payload
//       const decoded = JSON.parse(atob(token.split(".")[1])); // Decode the base64 payload
//       const currentTime = Date.now() / 1000; // Current time in seconds
  
//       // Check if the token is expired
//       return decoded.exp < currentTime;
//     } catch (error) {
//       console.error("Error decoding token:", error);
//       return true; // Assume the token is expired if decoding fails
//     }
//   };