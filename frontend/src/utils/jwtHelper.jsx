// export const isTokenExpired = (accessToken) => {
//     try {
//       // Decode the accessToken payload
//       const decoded = JSON.parse(atob(accessToken.split(".")[1])); // Decode the base64 payload
//       const currentTime = Date.now() / 1000; // Current time in seconds

//       // Check if the accessToken is expired
//       return decoded.exp < currentTime;
//     } catch (error) {
//       console.error("Error decoding accessToken:", error);
//       return true; // Assume the accessToken is expired if decoding fails
//     }
//   };
