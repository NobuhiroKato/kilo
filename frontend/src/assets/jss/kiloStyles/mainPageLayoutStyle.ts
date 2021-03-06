// ##############################
// // // MainPage styles
// #############################

import { Theme, makeStyles, createStyles } from '@material-ui/core';
import {
  container,
  drawerWidth,
  transition,
} from 'assets/jss/material-dashboard-react';

const mainPageLayoutStyle = makeStyles((theme: Theme) =>
createStyles({
  wrapper: {
    position: 'relative',
    top: '0',
    height: '100vh',
  },
  mainPanel: {
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      margin: `0 0 0 ${drawerWidth}px`,
    },
    overflow: 'auto',
    position: 'relative',
    ...transition,
    maxHeight: '100%',
    width: '100%',
    maxWidth: '1200px',
    overflowScrolling: 'touch',
  },
  content: {
    marginTop: '70px',
    padding: '10px 15px',
    minHeight: 'calc(100vh - 123px)',
    [`@media (max-width: 600px)`]: {
      padding: '10px 0',
    },
  },
  container,
  map: {
    marginTop: '70px',
  },
}),
);

export default mainPageLayoutStyle;
