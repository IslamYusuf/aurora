import { createTheme } from "@material-ui/core/styles";
import purple from '@material-ui/core/colors/purple';

export default createTheme({
    typography: {
      // Tell Material-UI what's the font-size on the html element is.
      htmlFontSize: '62.5%',
    },
    palette: {
      primary: purple,
    },
});