import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import { commonMessages } from "@saleor/intl";
import { FormErrors } from "../../../types";
import { CustomerCreatePageFormData } from "../CustomerCreatePage";

const useStyles = makeStyles(
  theme => ({
    root: {
      display: "grid",
      gridColumnGap: theme.spacing(2),
      gridRowGap: theme.spacing(3),
      gridTemplateColumns: "1fr 1fr"
    }
  }),
  { name: "CustomerCreateDetails" }
);

export interface CustomerCreateDetailsProps {
  data: CustomerCreatePageFormData;
  disabled: boolean;
  errors: FormErrors<"customerFirstName" | "customerLastName" | "email">;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const CustomerCreateDetails: React.FC<CustomerCreateDetailsProps> = props => {
  const { data, disabled, errors, onChange } = props;
  const classes = useStyles(props);

  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Customer Overview",
          description: "header"
        })}
      />
      <CardContent>
        <div className={classes.root}>
          <TextField
            disabled={disabled}
            error={!!errors.customerFirstName}
            fullWidth
            name="customerFirstName"
            label={intl.formatMessage(commonMessages.firstName)}
            helperText={errors.customerFirstName}
            type="text"
            value={data.customerFirstName}
            onChange={onChange}
          />
          <TextField
            disabled={disabled}
            error={!!errors.customerLastName}
            fullWidth
            name="customerLastName"
            label={intl.formatMessage(commonMessages.lastName)}
            helperText={errors.customerLastName}
            type="text"
            value={data.customerLastName}
            onChange={onChange}
          />
          <TextField
            disabled={disabled}
            error={!!errors.email}
            fullWidth
            name="email"
            label={intl.formatMessage(commonMessages.email)}
            helperText={errors.email}
            type="email"
            value={data.email}
            onChange={onChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};
CustomerCreateDetails.displayName = "CustomerCreateDetails";
export default CustomerCreateDetails;
