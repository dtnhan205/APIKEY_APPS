import Package from "../models/Package.js";
import cryptoRandomString from "crypto-random-string";

export const createPackage = async (req, res) => {
  try {
    const { name, description } = req.body;
    const token = "APP_" + cryptoRandomString({ length: 32, type: "alphanumeric" }).toUpperCase();

    const newPkg = await Package.create({
      name,
      token,
      description,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      data: { name: newPkg.name, token: newPkg.token, description: newPkg.description }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPackages = async (req, res) => {
  const packages = await Package.find({ isActive: true }).select("name token description _id");
  res.json({ success: true, data: packages });
};

export const updatePackage = async (req, res) => {
  const { id } = req.params;
  const updated = await Package.findByIdAndUpdate(id, req.body, { new: true });
  res.json({ success: true, data: updated });
};

export const deletePackage = async (req, res) => {
  const { id } = req.params;
  await Package.findByIdAndUpdate(id, { isActive: false });
  res.json({ success: true, message: "Đã khóa package" });
};