import { gql } from "@apollo/client";
import {
  pageBulkRemoveErrorFragment,
  pageErrorFragment,
  pageErrorWithAttributesFragment
} from "@saleor/fragments/errors";
import { pageDetailsFragment } from "@saleor/fragments/pages";
import makeMutation from "@saleor/hooks/makeMutation";

import { TypedMutation } from "../mutations";
import {
  PageBulkPublish,
  PageBulkPublishVariables
} from "./types/PageBulkPublish";
import {
  PageBulkRemove,
  PageBulkRemoveVariables
} from "./types/PageBulkRemove";
import { PageCreate, PageCreateVariables } from "./types/PageCreate";
import { PageRemove, PageRemoveVariables } from "./types/PageRemove";
import { PageUpdate, PageUpdateVariables } from "./types/PageUpdate";

const pageCreate = gql`
  ${pageErrorWithAttributesFragment}
  mutation PageCreate($input: PageCreateInput!) {
    pageCreate(input: $input) {
      errors {
        ...PageErrorWithAttributesFragment
      }
      page {
        id
      }
    }
  }
`;
export const TypedPageCreate = TypedMutation<PageCreate, PageCreateVariables>(
  pageCreate
);

const pageUpdate = gql`
  ${pageDetailsFragment}
  ${pageErrorWithAttributesFragment}
  mutation PageUpdate(
    $id: ID!
    $input: PageInput!
    $firstValues: Int
    $afterValues: String
    $lastValues: Int
    $beforeValues: String
  ) {
    pageUpdate(id: $id, input: $input) {
      errors {
        ...PageErrorWithAttributesFragment
      }
      page {
        ...PageDetailsFragment
      }
    }
  }
`;
export const usePageUpdateMutation = makeMutation<
  PageUpdate,
  PageUpdateVariables
>(pageUpdate);

const pageRemove = gql`
  ${pageErrorFragment}
  mutation PageRemove($id: ID!) {
    pageDelete(id: $id) {
      errors {
        ...PageErrorFragment
      }
    }
  }
`;
export const usePageRemoveMutation = makeMutation<
  PageRemove,
  PageRemoveVariables
>(pageRemove);

const pageBulkPublish = gql`
  mutation PageBulkPublish($ids: [ID]!, $isPublished: Boolean!) {
    pageBulkPublish(ids: $ids, isPublished: $isPublished) {
      errors {
        ...PageBulkPublishErrorFragment
      }
    }
  }
`;
export const TypedPageBulkPublish = TypedMutation<
  PageBulkPublish,
  PageBulkPublishVariables
>(pageBulkPublish);

const pageBulkRemove = gql`
  ${pageBulkRemoveErrorFragment}
  mutation PageBulkRemove($ids: [ID]!) {
    pageBulkDelete(ids: $ids) {
      errors {
        ...PageBulkRemoveErrorFragment
      }
    }
  }
`;
export const TypedPageBulkRemove = TypedMutation<
  PageBulkRemove,
  PageBulkRemoveVariables
>(pageBulkRemove);
