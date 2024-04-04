import { sign, verify } from 'jsonwebtoken';
import envRequestVariables from './request-variables';
import { CustomError } from '../exceptionsClass/exceptions-not-found-user';

interface IPayload {
  id: number;
  name: string;
}

const variables = envRequestVariables();

const verifyToken = (token: string) => {
  try {
    return verify(token, variables.JWT_SECRET);
  } catch (err) {
    throw new CustomError(`Erro ao realizar o decode: ${err}`, 401, 'Por favor realize login novamente.');
  }
};

const signToken = (payload: IPayload) => {
  const expiresIn = 3600;
  const exp = Math.floor(Date.now() / 1000) + expiresIn;

  try {
    return sign({ ...payload, exp }, variables.JWT_SECRET);
  } catch (err) {
    throw new Error(`Erro ao realizar o encode: ${err}`);
  }
};

export default { signToken, verifyToken };
