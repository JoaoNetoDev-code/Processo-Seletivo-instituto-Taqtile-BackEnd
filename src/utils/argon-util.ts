import * as argon2 from 'argon2';

const verifyHashPassword = (hash: string, password: string) => {
  try {
    return argon2.verify(hash, password);
  } catch (err) {
    throw new Error(`Erro ao realizar o decoded: ${err}`);
  }
};

const signHashPassword = (payload: string) => {
  try {
    return argon2.hash(payload);
  } catch (err) {
    throw new Error(`Erro ao realizar o encoded: ${err}`);
  }
};

export default { signHashPassword, verifyHashPassword };
