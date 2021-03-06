import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
  orangeCardHeader,
  greenCardHeader,
  redCardHeader,
  blueCardHeader,
  purpleCardHeader,
  roseCardHeader,
  whiteColor,
  defaultFont,
} from "assets/jss/material-dashboard-react";

const cardHeaderStyle = makeStyles(() =>
createStyles({
  cardHeader: {
    padding: "0.75rem 1.25rem",
    marginBottom: "0",
    borderBottom: "none",
    background: "transparent",
    // zIndex: "3 !important",
    "&$cardHeaderPlain,&$cardHeaderIcon,&$orangeCardHeader,&$greenCardHeader,&$redCardHeader,&$blueCardHeader,&$purpleCardHeader,&$roseCardHeader": {
      margin: "0 15px",
      padding: "0",
      position: "relative",
      color: whiteColor
    },
    "&:first-child": {
      borderRadius: "calc(.25rem - 1px) calc(.25rem - 1px) 0 0"
    },
    "&$orangeCardHeader,&$greenCardHeader,&$redCardHeader,&$blueCardHeader,&$purpleCardHeader,&$roseCardHeader": {
      "&:not($cardHeaderIcon)": {
        borderRadius: "3px",
        marginTop: "-20px",
        padding: "15px"
      }
    },
  },
  cardHeaderPlain: {
    marginLeft: "0px !important",
    marginRight: "0px !important"
  },
  cardHeaderIcon: {
    "&$orangeCardHeader,&$greenCardHeader,&$redCardHeader,&$blueCardHeader,&$purpleCardHeader,&$roseCardHeader": {
      background: "transparent",
      boxShadow: "none"
    },
    "& i,& .material-icons": {
      width: "33px",
      height: "33px",
      textAlign: "center",
      lineHeight: "33px"
    },
    "& svg": {
      width: "24px",
      height: "24px",
      textAlign: "center",
      lineHeight: "33px",
      margin: "5px 4px 0px"
    },
    "& h4": {
      margin: '15px 0 0 0',
      ...defaultFont,
    },
  },
  orangeCardHeader: {
    color: whiteColor,
    "&:not($cardHeaderIcon)": {
      ...orangeCardHeader
    }
  },
  greenCardHeader: {
    color: whiteColor,
    "&:not($cardHeaderIcon)": {
      ...greenCardHeader
    }
  },
  redCardHeader: {
    color: whiteColor,
    "&:not($cardHeaderIcon)": {
      ...redCardHeader
    }
  },
  blueCardHeader: {
    color: whiteColor,
    "&:not($cardHeaderIcon)": {
      ...blueCardHeader
    }
  },
  purpleCardHeader: {
    color: whiteColor,
    "&:not($cardHeaderIcon)": {
      ...purpleCardHeader
    }
  },
  roseCardHeader: {
    color: whiteColor,
    "&:not($cardHeaderIcon)": {
      ...roseCardHeader
    }
  }
}));

export default cardHeaderStyle;
