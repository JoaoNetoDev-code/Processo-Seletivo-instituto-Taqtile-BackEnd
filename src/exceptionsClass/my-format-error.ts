import { GraphQLError } from 'graphql';
import { ApolloError, toApolloError } from 'apollo-server-errors';
import { CustomError } from './exceptions-not-found-user';

interface FormattedError {
  code: number;
  message: string;
  additionalInfo?: string;
}

const formatError = (error: GraphQLError): FormattedError | Error => {
  const { originalError } = error;
  if (originalError instanceof CustomError) {
    const { code, message, additionalInfo } = originalError;
    return { code, message, additionalInfo };
  } else if (originalError instanceof ApolloError) {
    return originalError;
  } else {
    return toApolloError(error);
  }
};

export default formatError;
