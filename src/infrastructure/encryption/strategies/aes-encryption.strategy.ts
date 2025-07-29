import * as CryptoJS from 'crypto-js';
import { EncryptionStrategy } from '../interfaces/encryption-strategy.interface';

export class AesEncryptionStrategy implements EncryptionStrategy {
  private static CryptoJSAesJson = {
    stringify: (cipherParams: any) => {
      const j: any = {
        ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64),
      };
      if (cipherParams.iv) j.iv = cipherParams.iv.toString();
      if (cipherParams.salt) j.s = cipherParams.salt.toString();
      return JSON.stringify(j);
    },
    parse: (jsonStr: any) => {
      const j = JSON.parse(jsonStr);
      const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Base64.parse(j.ct),
      });
      if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv);
      if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s);
      return cipherParams;
    },
  };

  encrypt<T>(value: T, key: string): Record<string, string> {
    return JSON.parse(
      CryptoJS.AES.encrypt(JSON.stringify(value), key, {
        format: AesEncryptionStrategy.CryptoJSAesJson,
      }).toString(),
    );
  }

  decrypt<T>(value: object, key: string): T {
    return JSON.parse(
      CryptoJS.AES.decrypt(JSON.stringify(value), key, {
        format: AesEncryptionStrategy.CryptoJSAesJson,
      }).toString(CryptoJS.enc.Utf8),
    );
  }
}
