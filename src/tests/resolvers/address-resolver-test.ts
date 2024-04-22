export const createAddress = `
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
