import CryptoJS from 'crypto-js';

export const sha256Hash = async (value: string): Promise<string> => {
  return CryptoJS.SHA256(value).toString(CryptoJS.enc.Hex);
};