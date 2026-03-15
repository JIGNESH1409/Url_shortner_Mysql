import { verifyToken,refreshTokens } from "../services/auth.service.js";

export const verifyAuthentication = async (req, res, next) => {
  // const token = req.cookies.access_token;
  // if (!token) {
  //   req.user = null;
  //   return next();
  // }

  // try {
  //   const decodedToken = verifyToken(token);
  //   req.user = decodedToken;
  // } catch (error) {
  //   req.user = null;
  // }

  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;

  req.user = null; // Default to null

  if(accessToken){
    try{
      const decodedToken = verifyToken(accessToken);
      req.user = decodedToken;
    }
    catch(error){
      console.error("Access token verification failed:", error.message);
    }
  }

  if(refreshToken && !req.user){
    try{
      const refreshed = await refreshTokens(refreshToken);

      if(refreshed){
        const {newAccessToken, newRefreshToken, userInfo} = refreshed;
        req.user = userInfo;

        // Set new tokens in cookies only when refresh succeeds.
        res.cookie("access_token", newAccessToken)
        res.cookie("refresh_token", newRefreshToken)
      }
    }
    catch(error){
      console.error("Refresh token error:", error.message);
      req.user = null;
    }
  }

  return next();
};

// ✔️ You can add any property to req, but:

// Avoid overwriting existing properties.
// Use req.user for authentication.
// Group custom properties under req.custom if needed.
// Keep the data lightweight.