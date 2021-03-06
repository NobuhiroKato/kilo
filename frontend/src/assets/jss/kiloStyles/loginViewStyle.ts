import { makeStyles, createStyles } from '@material-ui/core/styles';
import loginBackgroundImg from 'assets/img/login_img.jpg';

const loginViewStyle = makeStyles(() =>
createStyles({
  wrapper: {
    position: 'relative',
    top: '0',
    height: '100vh',
  },
  loginView: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'auto',
    height: '100%',
    maxHeight: '100%',
    backgroundImage: `url(${loginBackgroundImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  cardTitle: {
    textAlign: 'center',
    fontFamily: 'cursive'
  }
}));

export default loginViewStyle;