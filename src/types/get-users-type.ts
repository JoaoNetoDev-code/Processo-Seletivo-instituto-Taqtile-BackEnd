import { UserModel } from '../model/user-model';

export type GetUsersType = {
  getUsers: UserModel[];
};

export type CreateUserType = {
  createUser: UserModel;
};

export type DeleteUserType = {
  deleteUser: UserModel;
};

export type findForIdUserType = {
  getUserById: UserModel;
};

export type UpdatedUserType = {
  updateUser: UserModel;
};

export type LoginTypeReturn = {
  login: {
    user: UserModel;
    token: string;
  };
};
