import { makeStyles, createStyles } from '@material-ui/core/styles';
import { defaultFont } from 'assets/jss/material-dashboard-react';

const modalStyle = makeStyles(() => 
createStyles({
  modal: {
    padding: '0 15px',
    ...defaultFont,
    minWidth: '300px',
  },
  modalHeader: {
    display: 'flex',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: 0,
    margin: '0 20px 0 0',
  },
  modalTitle: {
    margin: 0,
  },
  cancelButton: {
    minWidth: '120px',
  },
  submitButton: {
    minWidth: '120px',
    marginLeft: '8px',
  },
  buttonContainer: {
    margin: '8px auto',
    maxHeight: '61px',
    height: '61px',
    padding: 0,
  },
}));

export default modalStyle;