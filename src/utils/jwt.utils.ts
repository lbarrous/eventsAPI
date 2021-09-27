import jwt from 'jsonwebtoken';

const getPrivateKey = () => (process.env.PRIVATE_KEY as string).replace(/\\n/g, '\n');

export function sign(object: Object, options?: jwt.SignOptions | undefined) {
  const privateKey = getPrivateKey();
  return jwt.sign(object, privateKey, options);
}

export function decode(token: string) {
  try {
    const privateKey = getPrivateKey();
    const decoded = jwt.verify(token, privateKey);

    return { valid: true, expired: false, decoded };
  } catch (error) {
    return {
      valid: false,
      // We will use expired to see if we should reissue another token
      // @ts-ignore
      expired: error.message === 'jwt expired',
      decoded: null,
    };
  }
}
