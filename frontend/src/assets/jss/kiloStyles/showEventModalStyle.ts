import { makeStyles, createStyles } from '@material-ui/core/styles';
import { dangerColor } from 'assets/jss/material-dashboard-react';

const showEventModalStyle = makeStyles(() =>
createStyles({
  usersContainer: {
    listStyle: "circle",
    padding: "0 0 0 30px",
    margin: 0,
    fontSize: "13px",
    maxHeight: "120px",
    overflow: "auto",
  },
  descriptionContainer: {
    minWidth: "0px",
    [`@media (min-width: 500px)`]: {
      minWidth: "500px",
    },
  },
  joinMessage: {
    margin: "20px 0 0 0",
    textAlign: "center",
    color: dangerColor,
  },
}));

export default showEventModalStyle;
