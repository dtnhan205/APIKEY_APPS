import mongoose from "mongoose";

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  token: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

const PackageModel = mongoose.model("Package", packageSchema);
export { PackageModel as Package };
export default PackageModel;