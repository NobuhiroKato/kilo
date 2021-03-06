import {
  IconButton,
  SnackbarContent as Snack,
  SvgIcon,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import snackbarContentStyle from 'assets/jss/material-dashboard-react/snackbarContentStyle';
import * as cx from 'classnames';
import * as React from 'react';

type ColorType = 'info' | 'success' | 'warning' | 'danger' | 'primary';

interface Props {
  message: React.ReactNode;

  color?: ColorType;
  close?: boolean;
  icon?: typeof SvgIcon;
}

const SnackbarContent: React.SFC<Props> = props => {
  const { message, color, close, icon } = props;
  const classes = snackbarContentStyle();

  const action = close ? (
    <IconButton
      className={classes.iconButton}
      key="close"
      aria-label="Close"
      color="inherit"
    >
      <Close className={classes.close} />
    </IconButton>
  ) : (
    undefined
  );

  const messageClasses = cx({ [classes.iconMessage]: icon !== undefined });

  return (
    <Snack
      message={
        <div>
          {props.icon && <props.icon className={classes.icon} />}
          <span className={messageClasses}>{message}</span>
        </div>
      }
      classes={{
        root: cx(classes.root, color && classes[color]),
        message: classes.message,
      }}
      action={action}
    />
  );
};

export default SnackbarContent;
