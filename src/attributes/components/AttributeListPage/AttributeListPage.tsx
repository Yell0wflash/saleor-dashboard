import {
  attributeAddUrl,
  AttributeListUrlSortField,
} from "@dashboard/attributes/urls";
import { Backlink } from "@dashboard/components/Backlink";
import { Button } from "@dashboard/components/Button";
import FilterBar from "@dashboard/components/FilterBar";
import { configurationMenuUrl } from "@dashboard/configuration";
import { AttributeFragment } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import { Card } from "@material-ui/core";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import Container from "../../../components/Container";
import PageHeader from "../../../components/PageHeader";
import {
  FilterPageProps,
  ListActions,
  PageListProps,
  SortPage,
  TabPageProps,
} from "../../../types";
import AttributeList from "../AttributeList/AttributeList";
import {
  AttributeFilterKeys,
  AttributeListFilterOpts,
  createFilterStructure,
} from "./filters";

export interface AttributeListPageProps
  extends PageListProps,
    ListActions,
    FilterPageProps<AttributeFilterKeys, AttributeListFilterOpts>,
    SortPage<AttributeListUrlSortField>,
    TabPageProps {
  attributes: AttributeFragment[];
}

const AttributeListPage: React.FC<AttributeListPageProps> = ({
  filterOpts,
  initialSearch,
  onFilterChange,
  onSearchChange,
  currentTab,
  onAll,
  onTabChange,
  onTabDelete,
  onTabSave,
  tabs,
  ...listProps
}) => {
  const intl = useIntl();

  const structure = createFilterStructure(intl, filterOpts);

  return (
    <Container>
      <Backlink href={configurationMenuUrl}>
        <FormattedMessage {...sectionNames.configuration} />
      </Backlink>
      <PageHeader title={intl.formatMessage(sectionNames.attributes)}>
        <Button
          href={attributeAddUrl()}
          variant="primary"
          data-test-id="create-attribute-button"
        >
          <FormattedMessage
            id="IGvQ8k"
            defaultMessage="Create attribute"
            description="button"
          />
        </Button>
      </PageHeader>
      <Card>
        <FilterBar
          allTabLabel={intl.formatMessage({
            id: "dKPMyh",
            defaultMessage: "All Attributes",
            description: "tab name",
          })}
          currentTab={currentTab}
          filterStructure={structure}
          initialSearch={initialSearch}
          searchPlaceholder={intl.formatMessage({
            id: "1div9r",
            defaultMessage: "Search Attribute",
          })}
          tabs={tabs}
          onAll={onAll}
          onFilterChange={onFilterChange}
          onSearchChange={onSearchChange}
          onTabChange={onTabChange}
          onTabDelete={onTabDelete}
          onTabSave={onTabSave}
        />
        <AttributeList {...listProps} />
      </Card>
    </Container>
  );
};
AttributeListPage.displayName = "AttributeListPage";
export default AttributeListPage;
