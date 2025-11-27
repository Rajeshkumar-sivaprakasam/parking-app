import CryptoJS from "crypto-js";

const ENCRYPTION_KEY =
  import.meta.env.VITE_ENCRYPTION_KEY || "default-secret-key-change-me";

export class EncryptionUtils {
  static encrypt(text: string): string {
    if (!text) return text;
    return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
  }

  static decrypt(ciphertext: string): string {
    if (!ciphertext) return ciphertext;
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
