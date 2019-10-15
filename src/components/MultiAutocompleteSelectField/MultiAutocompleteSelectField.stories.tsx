import { storiesOf } from "@storybook/react";
import React from "react";

import { countries } from "@saleor/fixtures";
import useMultiAutocomplete from "@saleor/hooks/useMultiAutocomplete";
import CardDecorator from "@saleor/storybook/CardDecorator";
import Decorator from "@saleor/storybook/Decorator";
import { ChoiceProvider } from "@saleor/storybook/mock";
import MultiAutocompleteSelectField, {
  MultiAutocompleteSelectFieldProps
} from "./MultiAutocompleteSelectField";
import MultiAutocompleteSelectFieldContent, {
  MultiAutocompleteSelectFieldContentProps
} from "./MultiAutocompleteSelectFieldContent";

const suggestions = countries.map(c => ({ label: c.name, value: c.code }));

const props: MultiAutocompleteSelectFieldProps = {
  choices: undefined,
  displayValues: [],
  label: "Country",
  loading: false,
  name: "country",
  onChange: () => undefined,
  placeholder: "Select country",
  value: undefined
};

const Story: React.FC<
  Partial<
    MultiAutocompleteSelectFieldProps & {
      enableLoadMore: boolean;
    }
  >
> = storyProps => {
  const { change, data: countries } = useMultiAutocomplete([suggestions[0]]);

  return (
    <ChoiceProvider choices={suggestions}>
      {({ choices, fetchChoices, fetchMore, hasMore, loading }) => (
        <MultiAutocompleteSelectField
          {...props}
          displayValues={countries}
          choices={choices}
          fetchChoices={fetchChoices}
          helperText={`Value: ${countries
            .map(country => country.value)
            .join(", ")}`}
          onChange={event => change(event, choices)}
          value={countries.map(country => country.value)}
          loading={loading}
          hasMore={storyProps.enableLoadMore ? hasMore : false}
          onFetchMore={storyProps.enableLoadMore ? fetchMore : undefined}
          {...storyProps}
        />
      )}
    </ChoiceProvider>
  );
};

const contentProps: MultiAutocompleteSelectFieldContentProps = {
  choices: suggestions.slice(0, 10),
  displayCustomValue: false,
  displayValues: [suggestions[0]],
  getItemProps: () => undefined,
  hasMore: false,
  highlightedIndex: 0,
  inputValue: suggestions[0].label,
  loading: false,
  onFetchMore: () => undefined
};

storiesOf("Generics / Multiple select with autocomplete", module)
  .addDecorator(CardDecorator)
  .addDecorator(Decorator)
  .add("default", () => (
    <MultiAutocompleteSelectFieldContent {...contentProps} />
  ))
  .add("can load more", () => (
    <MultiAutocompleteSelectFieldContent {...contentProps} hasMore={true} />
  ))
  .add("no data", () => (
    <MultiAutocompleteSelectFieldContent {...contentProps} choices={[]} />
  ))
  .add("interactive", () => <Story />)
  .add("interactive with custom option", () => (
    <Story allowCustomValues={true} />
  ))
  .add("interactive with load more", () => <Story enableLoadMore={true} />);
