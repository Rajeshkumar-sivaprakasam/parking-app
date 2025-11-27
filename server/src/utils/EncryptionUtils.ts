import CryptoJS from "crypto-js";
import dotenv from "dotenv";

dotenv.config();

const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY || "default-secret-key-change-me";

export class EncryptionUtils {
  static encrypt(text: string): string {
    if (!text) return text;
    return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
  }

  static decrypt(ciphertext: string): string {
    if (!ciphertext) return ciphertext;
    try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
      const originalText = bytes.toString(CryptoJS.enc.Utf8);
      return originalText || ciphertext; // Return original if decryption fails (e.g. already plain)
    } catch (error) {
      return ciphertext;
    }
  }
}
