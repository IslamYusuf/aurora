import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
    paper: {
      //marginTop: theme.spacing(1),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      //marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(1, 0, 2),
    },
    container:{
      paddingTop: '0px',
      marginTop: '0px',
    },
    root: {
       //maxWidth: 345, //original width style
      maxWidth: '100%',
      heigth: 0,
    },
    image: {
      maxWidth: '29rem',
      width: '100%',
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    cardActions: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    cardContent: {
      display: 'flex',
      justifyContent: 'space-between',
    },
}));