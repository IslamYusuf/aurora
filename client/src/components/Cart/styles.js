import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  //toolbar: theme.mixins.toolbar,
  title: {
    marginTop: '1%',
  },
  emptyButton: {
    minWidth: '150px',
    [theme.breakpoints.down('xs')]: {
      marginBottom: '5px',
    },
    [theme.breakpoints.up('xs')]: {
      marginRight: '20px',
    },
  },
  checkoutButton: {
    minWidth: '150px',
  },
  link: {
    textDecoration: 'none',
  },
  cardDetails: {
    display: 'flex',
    marginTop: '2%',
    //marginBottom: '1.5%',
    width: '100%',
    justifyContent: 'space-between',
  },
  media: {
    height: 0,
    paddingTop: '56.25%',
  },
  cardContent: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  cartActions: {
    justifyContent: 'space-between',
  },
  buttons: {
    display: 'flex',
    alignItems: 'center',
  },  
  cartItem: {
    width: '100%',
  },
}));
