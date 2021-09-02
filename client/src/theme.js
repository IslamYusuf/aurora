import { createMuiTheme } from "@material-ui/core/styles";
import purple from '@material-ui/core/colors/purple';

export default createMuiTheme({
    typography: {
      // Tell Material-UI what's the font-size on the html element is.
      htmlFontSize: '62.5%',
    },
    palette: {
      primary: purple,
    },
});