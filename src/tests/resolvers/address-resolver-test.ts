export const createAddressTest = `
mutation($address: CreateAddressInput!) {
  createAddress(address: $address) {
    id,
    cep,
    city,
    complement,
    neighborhood,
    state,
    street,
    streetNumber,
    userId
  }
}`;

export const getAllAddressTest = `
query($limit: Float!, $page: Float!) {
  getAllAddress(limit: $limit, page: $page) {
    id,
    cep,
    city,
    complement,
    neighborhood,
    state,
    street,
    streetNumber,
    userId
  }
}`;

export const getAllAddressInUserTest = `
query($userId: Float!) {
  getAllAddressInUser(userId: $userId) {
    id,
    cep,
    city,
    complement,
    neighborhood,
    state,
    street,
    streetNumber,
    userId
    }
}`;
