export interface EncryptionStrategy {
  encrypt<T>(value: T, key: string): Record<string, string>;
  decrypt<T>(value: Record<string, string>, key: string): T;
}
