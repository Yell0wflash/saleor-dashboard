import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";

import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { sectionNames } from "@saleor/intl";
import Container from "../../../components/Container";
import PageHeader from "../../../components/PageHeader";
import { ListActions, PageListProps } from "../../../types";
import { AttributeList_attributes_edges_node } from "../../types/AttributeList";
import AttributeList from "../AttributeList/AttributeList";

export interface AttributeListPageProps extends PageListProps, ListActions {
  attributes: AttributeList_attributes_edges_node[];
}

const AttributeListPage: React.FC<AttributeListPageProps> = ({
  onAdd,
  ...listProps
}) => {
  const intl = useIntl();

  return (
    <Container>
      <PageHeader title={intl.formatMessage(sectionNames.attributes)}>
        <Button onClick={onAdd} color="primary" variant="contained">
          <FormattedMessage
            defaultMessage="Create attribute"
            description="button"
          />
        </Button>
      </PageHeader>
      <Card>
        <AttributeList {...listProps} />
      </Card>
    </Container>
  );
};
AttributeListPage.displayName = "AttributeListPage";
export default AttributeListPage;
