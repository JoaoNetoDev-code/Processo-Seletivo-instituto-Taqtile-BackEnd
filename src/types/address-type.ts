import { AddressModel } from '../model/address-model';

export type createAddresstype = {
  createAddress: AddressModel;
};

export type getAllAddressType = {
  getAllAddress: AddressModel[];
};

export type getAllAddressInUserType = {
  getAllAddressInUser: AddressModel[];
};
