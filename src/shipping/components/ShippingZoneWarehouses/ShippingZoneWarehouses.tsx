import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import React from "react";
import { useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import { FetchMoreProps, SearchProps } from "@saleor/types";
import { FormChange } from "@saleor/hooks/useForm";
import MultiAutocompleteSelectField, {
  MultiAutocompleteChoiceType
} from "@saleor/components/MultiAutocompleteSelectField";

interface ShippingZoneWarehousesFormData {
  warehouses: string[];
}
interface ShippingZonewWarehousesProps extends FetchMoreProps, SearchProps {
  data: ShippingZoneWarehousesFormData;
  displayValue: MultiAutocompleteChoiceType[];
  warehouses: MultiAutocompleteChoiceType[];
  onChange: FormChange;
  onWarehouseAdd: () => void;
}

export const ShippingZoneWarehouses: React.FC<ShippingZonewWarehousesProps> = props => {
  const {
    data,
    displayValue,
    hasMore,
    loading,
    warehouses,
    onChange,
    onFetchMore,
    onSearchChange,
    onWarehouseAdd
  } = props;
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Warehouse",
          description: "section header"
        })}
      />
      <CardContent>
        <MultiAutocompleteSelectField
          add={{
            label: intl.formatMessage({
              defaultMessage: "Add New Warehouse",
              description: "button"
            }),
            onClick: onWarehouseAdd
          }}
          choices={warehouses}
          displayValues={displayValue}
          fetchChoices={onSearchChange}
          hasMore={hasMore}
          helperText={intl.formatMessage({
            defaultMessage:
              "Select warehouse from which you will ship products for this shipping zone. This warehouse address will also be used to calculate taxes."
          })}
          label={intl.formatMessage({
            defaultMessage: "Warehouse"
          })}
          loading={loading}
          name="warehouse"
          onChange={onChange}
          onFetchMore={onFetchMore}
          placeholder={intl.formatMessage({
            defaultMessage: "Select Warehouse",
            description: "input placeholder"
          })}
          value={data.warehouses}
        />
      </CardContent>
    </Card>
  );
};
ShippingZoneWarehouses.displayName = "ShippingZoneWarehouses";
export default ShippingZoneWarehouses;
