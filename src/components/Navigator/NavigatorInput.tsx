import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";
import { useIntl } from "react-intl";
import { QuickSearchMode } from "./types";

const useStyles = makeStyles(
  theme => {
    const typography = {
      color: theme.palette.text.primary,
      fontSize: 24,
      lineHeight: 1.33
    };

    return {
      adornment: {
        ...typography,
        color: theme.palette.text.secondary,
        paddingRight: theme.spacing(1)
      },
      input: {
        ...typography,
        background: "transparent",
        border: "none",
        outline: 0,
        padding: 0,
        width: "100%"
      },
      root: {
        background: theme.palette.background.default,
        display: "flex",
        padding: theme.spacing(2, 3)
      }
    };
  },
  {
    name: "NavigatorInput"
  }
);

interface NavigatorInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  mode: QuickSearchMode;
}

const NavigatorInput = React.forwardRef<HTMLInputElement, NavigatorInputProps>(
  (props, ref) => {
    const { mode, ...rest } = props;
    const classes = useStyles(props);
    const intl = useIntl();

    return (
      <div className={classes.root}>
        {mode !== "default" && (
          <span className={classes.adornment}>
            {mode === "orders" ? "#" : ">"}
          </span>
        )}
        <input
          autoFocus
          autoComplete="off"
          className={classes.input}
          placeholder={
            mode === "orders"
              ? intl.formatMessage({
                  defaultMessage: "Order Number",
                  description: "navigator placeholder"
                })
              : mode === "commands"
              ? intl.formatMessage({
                  defaultMessage: "Type Command",
                  description: "navigator placeholder"
                })
              : intl.formatMessage({
                  defaultMessage: "Use Navigator to move through Saleor",
                  description: "navigator placeholder"
                })
          }
          ref={ref}
          {...rest}
        />
      </div>
    );
  }
);

NavigatorInput.displayName = "NavigatorInput";
export default NavigatorInput;
