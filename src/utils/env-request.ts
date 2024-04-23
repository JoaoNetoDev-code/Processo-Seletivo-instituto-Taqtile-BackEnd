import dotenv, { DotenvConfigOutput } from 'dotenv';

const envRequest = (): DotenvConfigOutput => {
  const env = process.env.NODE_ENV === 'dev' ? '.env' : '.env.test';

  if (['dev', 'test'].includes(process.env.NODE_ENV)) {
    return dotenv.config({ path: env });
  }
  return dotenv.config({ path: '.env' });
};

export default envRequest;
