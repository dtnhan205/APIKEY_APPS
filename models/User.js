import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "admin" },
  createdAt: { type: Date, default: Date.now }
});

const UserModel = mongoose.model("User", userSchema);
export { UserModel as User };
export default UserModel;