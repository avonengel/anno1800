import React from 'react';
import './App.css';
import {AppBar, Container, createStyles, CssBaseline, makeStyles, Theme, Toolbar, Typography} from "@material-ui/core";
import {ThemeProvider} from '@material-ui/styles';
import theme from "./theme";
import {connect} from "react-redux";
import IslandComponent from "./components/IslandComponent";
import {State} from "./redux/store";

const styles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            paddingTop: theme.spacing(5)
        }
    }));

interface StateProps {
    islandIds: number[];
}


const App: React.FC<StateProps> = (props: StateProps) => {
    const classes = styles();
    return <React.Fragment>
        <CssBaseline/>
        <ThemeProvider theme={theme}>
            <AppBar position="static" color="default">
                <Toolbar>
                    <Typography variant="h6" color="inherit">
                        Anno 1800 Companion
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container className={classes.container}>
                {
                    props.islandIds.map((id) => <IslandComponent key={id} islandId={id}/>)
                }
            </Container>
        </ThemeProvider>
    </React.Fragment>;
};

const mapStateToProps = (state: State): StateProps => {
    return {
        islandIds: state.island.islandIds,
    };
};

export default connect(mapStateToProps)(App);
