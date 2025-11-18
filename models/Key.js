import mongoose from "mongoose";

const keySchema = new mongoose.Schema({
  key: { type: String, unique: true, required: true },
  type: { type: String, enum: ["random", "custom", "prefix"], required: true },
  prefix: { type: String, default: "" },
  package: { type: mongoose.Schema.Types.ObjectId, ref: "Package", required: true },
  duration: { type: Number, required: true },
  durationType: { type: String, enum: ["Giờ", "Ngày", "Tháng", "Năm"], default: "Ngày" },
  multiActivation: { type: Boolean, default: false },
  maxActivations: { type: Number, default: 1 },
  activatedDevices: [{
    deviceId: { type: String, required: true },
    activatedAt: { type: Date, default: Date.now }
  }],
  alias: { type: String, default: "" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  isActive: { type: Boolean, default: true }
});

keySchema.pre("save", function(next) {
  if (this.duration && this.durationType) {
    const now = new Date();
    if (this.durationType === "Giờ") this.expiresAt = new Date(now.getTime() + this.duration * 3600000);
    if (this.durationType === "Ngày") this.expiresAt = new Date(now.getTime() + this.duration * 86400000);
    if (this.durationType === "Tháng") this.expiresAt = new Date(now.setMonth(now.getMonth() + this.duration));
    if (this.durationType === "Năm") this.expiresAt = new Date(now.setFullYear(now.getFullYear() + this.duration));
  }
  next();
});

const KeyModel = mongoose.model("Key", keySchema);
export { KeyModel as Key };
export default KeyModel;