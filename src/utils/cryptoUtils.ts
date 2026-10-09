import { EncryptedDraftPayload, NewCollaboratorFormData } from '../types/templates';

// Utilitários para conversão Hex
function bufToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBuf(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

// Derivação de chave usando PBKDF2 e SHA-256
async function deriveKey(password: string, saltBytes: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: 100000,
      hash: 'SHA-256',
    },
    passwordKey,
    { name: 'AES-CTR', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Criptografa o rascunho com a senha do usuário utilizando AES-CTR.
 */
export async function encryptDraft(
  data: NewCollaboratorFormData,
  password: string
): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(16));
  const key = await deriveKey(password, salt);

  const payloadString = JSON.stringify(data);
  const encodedData = new TextEncoder().encode(payloadString);

  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: 'AES-CTR',
      counter: iv,
      length: 64,
    },
    key,
    encodedData
  );

  const payload: EncryptedDraftPayload = {
    version: 1,
    salt: bufToHex(salt),
    iv: bufToHex(iv),
    ciphertext: bufToHex(encryptedBuffer),
    updatedAt: new Date().toISOString(),
  };

  return JSON.stringify(payload);
}

/**
 * Decriptografa o rascunho.
 * Se a senha estiver errada, o AES-CTR decodifica em ruído/lixo corrompido (gibberish),
 * e esse ruído é mapeado para os campos para cumprir a regra:
 * "se alguém usa a senha errada os dados são decriptografados erradamente".
 */
export async function decryptDraft(
  encryptedRaw: string,
  password: string
): Promise<{ data: NewCollaboratorFormData; isCorrupted: boolean }> {
  const payload: EncryptedDraftPayload = JSON.parse(encryptedRaw);

  const saltBytes = hexToBuf(payload.salt);
  const ivBytes = hexToBuf(payload.iv);
  const cipherBytes = hexToBuf(payload.ciphertext);

  const key = await deriveKey(password, saltBytes);

  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: 'AES-CTR',
      counter: ivBytes,
      length: 64,
    },
    key,
    cipherBytes
  );

  // Decodifica bytes com substituição para caracteres inválidos
  const decoder = new TextDecoder('utf-8', { fatal: false });
  const decryptedText = decoder.decode(decryptedBuffer);

  try {
    const parsed = JSON.parse(decryptedText);
    if (parsed && typeof parsed === 'object' && 'fullName' in parsed) {
      return {
        data: parsed as NewCollaboratorFormData,
        isCorrupted: false,
      };
    }
  } catch {
    // Falha de JSON: a senha incorreta gerou ruído
  }

  // Gera dados corrompidos preenchidos a partir do ruído decriptografado
  const cleanNoise = (text: string, start: number, len: number) => {
    const slice = text.slice(start, start + len);
    return slice.length > 0 ? slice : '§%#@!&?*';
  };

  return {
    data: {
      fullName: cleanNoise(decryptedText, 0, 18),
      department: cleanNoise(decryptedText, 18, 12),
      period: cleanNoise(decryptedText, 30, 13),
      vanguardLogin: cleanNoise(decryptedText, 43, 10),
      vanguardPassword: cleanNoise(decryptedText, 53, 10),
      vanguardLink: 'https://gestao.sistemacorban.com.br/index.php/',
      argusLogin: cleanNoise(decryptedText, 63, 10),
      argusPassword: cleanNoise(decryptedText, 73, 10),
      benhubName: cleanNoise(decryptedText, 83, 16),
      benhubEmail: `${cleanNoise(decryptedText, 99, 8).replace(/\s/g, '')}@benconsig.com`,
      benhubPassword: cleanNoise(decryptedText, 107, 10),
      team: cleanNoise(decryptedText, 117, 12),
    },
    isCorrupted: true,
  };
}
