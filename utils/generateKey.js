import cryptoRandomString from "crypto-random-string";

export const generateRandomKey = () => {
  return cryptoRandomString({ length: 15, type: "alphanumeric" })
    .toUpperCase()
    .replace(/(.{4})/g, "$1-")
    .slice(0, -1);
};

export const generatePrefixKey = (prefix) => {
  const suffix = cryptoRandomString({ length: 8, type: "alphanumeric" }).toUpperCase();
  return `${prefix.toUpperCase()}-${suffix}`;
};