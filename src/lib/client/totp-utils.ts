import * as OTPAuth from 'otpauth';

const TIME_STEP = 30;

export function generateTOTP(label: string | null, secret: string): OTPAuth.TOTP {
  const totp = new OTPAuth.TOTP({
    issuer: 'TotpAuth',
    label: label || `TotpAuth ${Date.now()}`,
    algorithm: 'SHA1',
    digits: 6,
    period: TIME_STEP,
    secret: secret
  });

  return totp;
}

export function computeTimeLeft(creationTime: number) {
  const currentTime = computeNow();
  const elapsedTime = Math.floor(( currentTime - creationTime / 1000 ));
  return TIME_STEP - elapsedTime;
}

async function createHmac(keyData: string, data: Uint8Array): Promise<ArrayBuffer> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(keyData),
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );

  return crypto.subtle.sign('HMAC', key, data);
}

function intToBytes(num: number): Uint8Array {
  const buffer = new ArrayBuffer(8);
  const dataView = new DataView(buffer);
  dataView.setUint32(4, Math.floor(num));
  return new Uint8Array(buffer);
}

function truncate(hash: ArrayBuffer): number {
  const bytes = new Uint8Array(hash);
  const offset = bytes[bytes.length - 1] & 0xf;
  const binary =
    ((bytes[offset] & 0x7f) << 24) |
    ((bytes[offset + 1] & 0xff) << 16) |
    ((bytes[offset + 2] & 0xff) << 8) |
    (bytes[offset + 3] & 0xff);
  return binary;
}

export function computeNow() {
  return Math.floor(Date.now() / 1000);
}

export function progressBar(seconds: number) {
  return Math.floor((seconds / TIME_STEP) * 100);
}

export function computeCounter() {
  const currentTime = computeNow();
  return Math.floor(currentTime / TIME_STEP);
}

export async function computeTOTP(secret: string): Promise<string> {
  const counter = computeCounter();

  const counterBytes = intToBytes(counter);

  const hmac = await createHmac(secret, counterBytes);
  const otp = truncate(hmac) % 1_000_000;

  return otp.toString().padStart(6, '0');
}
