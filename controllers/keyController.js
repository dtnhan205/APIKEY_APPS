import Key from "../models/Key.js";
import Package from "../models/Package.js";
import { generateRandomKey, generatePrefixKey } from "../utils/generateKey.js";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

export const createKey = async (req, res) => {
  try {
    const {
      quantity = 1,
      keyType,
      customKey,
      prefix,
      packageId,
      duration,
      durationType = "Ngày",
      multiActivation = false,
      maxActivations = 1,
      alias = ""
    } = req.body;

    if (!packageId || !duration || !keyType) return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });

    const pkg = await Package.findById(packageId);
    if (!pkg) return res.status(404).json({ message: "Package không tồn tại" });

    const keys = [];
    for (let i = 0; i < quantity; i++) {
      let finalKey = "";
      if (keyType === "custom" && customKey) finalKey = customKey.trim().toUpperCase();
      else if (keyType === "prefix" && prefix) finalKey = generatePrefixKey(prefix);
      else if (keyType === "random") finalKey = generateRandomKey();
      else return res.status(400).json({ message: "Kiểu key không hợp lệ" });

      const newKey = await Key.create({
        key: finalKey,
        type: keyType,
        prefix: keyType === "prefix" ? prefix : "",
        package: packageId,
        duration: Number(duration),
        durationType,
        multiActivation,
        maxActivations: multiActivation ? Number(maxActivations) : 1,
        alias,
        createdBy: req.user._id
      });

      keys.push({
        key: newKey.key,
        package: pkg.name,
        alias: newKey.alias,
        expiresAt: moment(newKey.expiresAt).format("DD/MM/YYYY HH:mm"),
        maxDevices: newKey.maxActivations
      });
    }
    res.status(201).json({ success: true, count: keys.length, data: keys });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const activateKey = async (req, res) => {
  try {
    const { key, deviceId, appToken } = req.body;
    if (!key || !appToken) return res.status(400).json({ valid: false, message: "Thiếu key hoặc appToken" });

    const pkg = await Package.findOne({ token: appToken, isActive: true });
    if (!pkg) return res.status(403).json({ valid: false, message: "App không hợp lệ" });

    const license = await Key.findOne({ key, package: pkg._id });
    if (!license || !license.isActive) return res.status(404).json({ valid: false, message: "Key không hợp lệ" });

    if (license.expiresAt && new Date() > license.expiresAt) {
      return res.status(400).json({ valid: false, message: "Key đã hết hạn" });
    }

    const clientDeviceId = deviceId || uuidv4();
    const alreadyUsed = license.activatedDevices.some(d => d.deviceId === clientDeviceId);

    if (alreadyUsed) {
      return res.json({
        valid: true,
        package: pkg.name,
        expiresAt: moment(license.expiresAt).format("DD/MM/YYYY HH:mm"),
        message: "Chào mừng quay lại!"
      });
    }

    if (license.activatedDevices.length >= license.maxActivations) {
      return res.status(400).json({
        valid: false,
        message: `Key chỉ dùng được tối đa ${license.maxActivations} thiết bị`
      });
    }

    license.activatedDevices.push({ deviceId: clientDeviceId });
    await license.save();

    res.json({
      valid: true,
      package: pkg.name,
      expiresAt: moment(license.expiresAt).format("DD/MM/YYYY HH:mm"),
      deviceId: clientDeviceId,
      message: "Kích hoạt thành công!"
    });
  } catch (err) {
    res.status(500).json({ valid: false, message: "Lỗi server" });
  }
};

export const getAllKeys = async (req, res) => {
  const keys = await Key.find().populate("package", "name").sort({ createdAt: -1 });
  res.json({ success: true, count: keys.length, data: keys });
};

export const resetKey = async (req, res) => {
  const { id } = req.params;
  await Key.findByIdAndUpdate(id, { activatedDevices: [], isActive: true });
  res.json({ success: true, message: "Reset key thành công" });
};

export const deleteKey = async (req, res) => {
  const { id } = req.params;
  await Key.findByIdAndDelete(id);
  res.json({ success: true, message: "Xóa key thành công" });
};