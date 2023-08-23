
import { UserModel } from "../Database/allModels";

//Validating jwt token for Admin
export const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decodedUserId = UserModel.verifyJwtToken(token);
    if (!decodedUserId) {
      return res.status(401).json({ error: "Session expired. Please log in again." });
    }

    const user = await UserModel.findById(decodedUserId);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admin privileges required." });
    }

    next(); // If user is admin, proceed to the next middleware
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
