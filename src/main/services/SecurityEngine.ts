// src/main/services/SecurityEngine.ts
import crypto from 'crypto';
import fs from 'fs';

export const SecurityEngine = {
  encryptData: (data: string, secret: string) => {
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      secret,
      Buffer.alloc(16, 0),
    );
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  },
};
