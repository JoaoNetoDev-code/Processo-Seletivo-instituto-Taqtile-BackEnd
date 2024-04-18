export const getUserQuery = `
query($limit: Float!, $page: Float!) {
  getUsers(limit: $limit, page: $page) {
    id,
    name,
    email,
    birthDate
  }
}`;

export const createUserMutation = `
mutation($userData: CreateUserInput!) {
  createUser(userData: $userData) {
    id
    name
    email
    birthDate
  }
}`;

export const deleteUserMutation = `
mutation($deleteUserId: Float!) {
  deleteUser(id: $deleteUserId)
}`;

export const updateUserMutation = `
mutation($userData: UpdatedUserInput!, $updateUserId: Float!) {
  updateUser(userData: $userData, id: $updateUserId) {
    id 
    name
    email
    birthDate
  }
}`;

export const loginMutation = `
mutation($loginUser: LoginUserInput!) {
  login(LoginUser: $loginUser) {
    user {
      id
      name
      email
      birthDate
    },
    token
  }
}`;

export const findUserForIdQuery = `
query($getUserByIdId: Float!) {
  getUserById(id: $getUserByIdId) {
    id
    name
    email
    birthDate
  }
}`;
