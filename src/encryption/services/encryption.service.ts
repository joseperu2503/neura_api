import { Injectable } from '@nestjs/common';
import { EncryptionStrategy } from '../interfaces/encryption-strategy.interface';
import { AesEncryptionStrategy } from '../strategies/aes-encryption.strategy';

@Injectable()
export class EncryptionService {
  private readonly encryptionKey: string = process.env.ENCRYPTION_KEY;
  private strategy: EncryptionStrategy;

  constructor() {
    this.strategy = new AesEncryptionStrategy();
  }

  encrypt<T>(value: T): Record<string, string> {
    return this.strategy.encrypt(value, this.encryptionKey);
  }

  decrypt<T>(value: Record<string, string>): T {
    return this.strategy.decrypt(value, this.encryptionKey);
  }
}
