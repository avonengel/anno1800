import {createMuiTheme} from '@material-ui/core/styles';
import {amber, blue} from "@material-ui/core/colors";

// A custom theme for this app
const theme = createMuiTheme({

    palette: {
        type: "dark",
        primary: blue,
        secondary: amber,
        // primary: {
        //     main: '#c68d5c',
        // },
        // secondary: {
        //     main: '#8e6b49',
        // },
        //     error: {
        //         main: red.A400,
        //     },
        //     background: {
        //         default: '#fff',
        //     },
    },
});

export default theme;