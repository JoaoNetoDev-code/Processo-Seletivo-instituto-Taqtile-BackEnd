import { sign, verify } from 'jsonwebtoken';
import { CustomError } from '../exceptionsClass/exceptions-not-found-user';
import timeExpiration from './time-expiration';

interface IPayload {
  id: number;
  name: string;
}

const secret = process.env.JWT_SECRET;

const verifyToken = (token: string) => {
  try {
    return verify(token, secret);
  } catch (err) {
    throw new CustomError(`Erro ao realizar o decode: ${err}`, 401, 'Por favor realize login novamente.');
  }
};

const signToken = (payload: IPayload, rememberMe: boolean) => {
  try {
    return sign({ ...payload, ex: timeExpiration(rememberMe) }, secret);
  } catch (err) {
    throw new Error(`Erro ao realizar o encode: ${err}`);
  }
};

export default { signToken, verifyToken };
