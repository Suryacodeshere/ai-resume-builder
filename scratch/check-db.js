import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from Backend directory
dotenv.config({ path: path.join(__dirname, "../Backend/.env") });

const mongoUri = process.env.MONGODB_URI;
console.log("URI:", mongoUri ? "Defined" : "Undefined");

try {
  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB");
  
  // Define Schema inline to match
  const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: { type: String, select: true }
  });
  
  const User = mongoose.model("User", userSchema);
  
  const user = await User.findOne({ email: "labubuindiaonline@gmail.com" });
  if (user) {
    console.log("User found in database:", {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      passwordHash: user.password
    });
    
    // Test if 'bluestar7566' matches this hash
    const match = await bcrypt.compare("bluestar7566", user.password);
    console.log("Does 'bluestar7566' match the database hash?:", match);
  } else {
    console.log("User not found!");
  }
} catch (error) {
  console.error("Database connection error:", error);
} finally {
  await mongoose.disconnect();
}
