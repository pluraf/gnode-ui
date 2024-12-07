import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EncryptionService {
  private staticKey = 'asadsfjskdhfe7r84utirjgf21637827';
  constructor() {}

  async encrypt(text: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    // Generate a key from a passphrase (this can be customized)
    const key = await this.getKeyFromPassword(this.staticKey);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const encryptedData = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      data,
    );

    // Convert encrypted data to base64 string
    return this.arrayBufferToBase64(encryptedData);
  }

  private async getKeyFromPassword(password: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    const keyBuffer = passwordBuffer.slice(0, 32);
    return await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt'],
    );
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const byteArray = new Uint8Array(buffer);
    return btoa(String.fromCharCode(...byteArray));
  }
}
