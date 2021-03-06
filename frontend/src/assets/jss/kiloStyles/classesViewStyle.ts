import { makeStyles, createStyles } from '@material-ui/core/styles';
import { defaultFont } from 'assets/jss/material-dashboard-react';

const classesViewStyle = makeStyles(() =>
createStyles({
  spinnerWrap: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'calc(100vh - 123px)',
  },
  cardTitle: {
    margin: '10px 0 0 0',
    ...defaultFont,
    fontFamily: 'cursive',
  },
  noPadding: {
    [`@media (max-width: 600px)`]: {
      padding: '20px 0',
    },
  },
  nextMonthButton: {
    margin: 0,
    position: 'absolute',
    top: '10px',
    right: 0,
  },
}));

export default classesViewStyle;