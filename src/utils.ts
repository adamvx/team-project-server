import crypto from 'crypto'

export const generateId = (): string => {
  const id = crypto.randomBytes(6).toString('hex');
  const parts = id.match(/.{1,4}/g);
  return parts!.join("-");
}