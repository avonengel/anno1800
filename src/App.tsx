import React from 'react';
import './App.css';
import {AppBar, CssBaseline, Toolbar, Typography} from "@material-ui/core";
import {ThemeProvider} from '@material-ui/styles';
import theme from "./theme";

const App: React.FC = () => {
    return (
        <React.Fragment>
            <CssBaseline/>
            <ThemeProvider theme={theme}>
                <AppBar position="static" color="default">
                    <Toolbar>
                        <Typography variant="h6" color="inherit">
                            Anno 1800 Companion
                        </Typography>
                    </Toolbar>
                </AppBar>
            </ThemeProvider>
        </React.Fragment>
    );
};

export default App;
