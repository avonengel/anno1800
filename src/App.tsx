import React from 'react';
import './App.css';
import {
    AppBar,
    Container,
    createStyles,
    CssBaseline,
    Drawer,
    List,
    ListItem,
    ListItemText,
    makeStyles,
    Theme,
    Toolbar,
    Typography
} from "@material-ui/core";
import {ThemeProvider} from '@material-ui/styles';
import theme from "./theme";
import {connect} from "react-redux";
import IslandComponent from "./components/IslandComponent";
import {RootState} from "./redux/store";
import {Dispatch} from "redux";
import {selectIsland} from "./redux/islands/actions";

const drawerWidth = 240;

const styles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
        },
        toolbar: theme.mixins.toolbar,
        container: {
            paddingTop: theme.spacing(5)
        }
    }));

const mapStateToProps = (state: RootState) => ({
    islandIds: state.island.islandIds,
    islandsById: state.island.islandsById
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        onIslandSelected: (islandId: number) => {
            dispatch(selectIsland(islandId));
        },
    };
};
type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const App: React.FC<Props> = props => {
    const classes = styles();

    const selectIsland = (islandId: number) => props.onIslandSelected(islandId);

    return <React.Fragment>
        <CssBaseline/>
        <ThemeProvider theme={theme}>
            <div className={classes.root}>
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="h6" noWrap>
                            Anno 1800 Companion
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer
                    className={classes.drawer}
                    variant="permanent"
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <div className={classes.toolbar}/>
                    <List>
                        {props.islandIds.map((islandId) => (
                            <ListItem button key={islandId}>
                                <ListItemText primary={props.islandsById[islandId].name}
                                              onClick={() => selectIsland(islandId)}/>
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
                <main className={classes.content}>
                    <div className={classes.toolbar}/>
                    <Container className={classes.container}>
                        {
                            props.islandIds.map((id) => <IslandComponent key={id} islandId={id}/>)
                        }
                    </Container>
                </main>
            </div>
        </ThemeProvider>
    </React.Fragment>;
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
