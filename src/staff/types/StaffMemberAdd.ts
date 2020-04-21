/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { StaffCreateInput, AccountErrorCode, PermissionEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: StaffMemberAdd
// ====================================================

export interface StaffMemberAdd_staffCreate_errors {
  __typename: "StaffError";
  code: AccountErrorCode;
  field: string | null;
}

export interface StaffMemberAdd_staffCreate_user_avatar {
  __typename: "Image";
  url: string;
}

export interface StaffMemberAdd_staffCreate_user_permissions {
  __typename: "Permission";
  code: PermissionEnum;
  name: string;
}

export interface StaffMemberAdd_staffCreate_user {
  __typename: "User";
  id: string;
  email: string;
  firstName: string;
  isActive: boolean;
  lastName: string;
  avatar: StaffMemberAdd_staffCreate_user_avatar | null;
  permissions: (StaffMemberAdd_staffCreate_user_permissions | null)[] | null;
}

export interface StaffMemberAdd_staffCreate {
  __typename: "StaffCreate";
  errors: StaffMemberAdd_staffCreate_errors[];
  user: StaffMemberAdd_staffCreate_user | null;
}

export interface StaffMemberAdd {
  staffCreate: StaffMemberAdd_staffCreate | null;
}

export interface StaffMemberAddVariables {
  input: StaffCreateInput;
}
