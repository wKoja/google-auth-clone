function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
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

export async function computeTOTP(secret: string): Promise<string> {
  const timeStep = 30;
  const currentTime = Math.floor(Date.now() / 1000);
  const counter = Math.floor(currentTime / timeStep);

  const counterBytes = intToBytes(counter);

  const hmac = await createHmac(secret, counterBytes);
  const otp = truncate(hmac) % 1_000_000;

  return otp.toString().padStart(6, '0');
}
