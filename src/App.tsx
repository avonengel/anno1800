import React from 'react';
import './App.css';
import {
    AppBar,
    Container,
    createStyles,
    CssBaseline,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemText,
    TextField,
    Toolbar,
    Typography, withStyles,
    WithStyles
} from "@material-ui/core";
import {ThemeProvider} from '@material-ui/styles';
import theme from "./theme";
import {connect} from "react-redux";
import IslandComponent from "./components/IslandComponent";
import {RootState} from "./redux/store";
import {Dispatch} from "redux";
import {createIsland, selectIsland} from "./redux/islands/actions";

const drawerWidth = 240;

const styles = createStyles({
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
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: "100%",
    },
});
interface OwnProps extends WithStyles<typeof styles> {
}

const mapStateToProps = (state: RootState) => ({
    islandIds: state.island.islandIds,
    islandsById: state.island.islandsById,
    selectedIsland: state.selectedIsland
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        onIslandSelected: (islandId: number) => {
            dispatch(selectIsland(islandId));
        },
        onCreateIsland: (name: string) => {
            dispatch(createIsland(name));
        },
    };
};
type Props = OwnProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

interface OwnState {
    name: string;
}

class App extends React.Component<Props, OwnState> {

    constructor(props: Props) {
        super(props);
        this.state = {name:""}
    }

    selectIsland(islandId: number) {

        this.props.onIslandSelected(islandId);
    }


    handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        this.setState({name: ""});
        this.props.onCreateIsland(this.state.name);
    }

    handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState(
            {
                name: event.target.value
            }
        )
    }

    render() {
        const {classes, islandIds, islandsById} = this.props;
        return (<React.Fragment>
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
                        }}>
                        <div className={classes.toolbar}/>
                        <List component={"nav"}>
                            {islandIds.map((islandId) => (
                                <ListItem button key={islandId}>
                                    <ListItemText primary={islandsById[islandId].name}
                                                  onClick={() => this.selectIsland(islandId)}/>
                                </ListItem>
                            ))}
                            <form onSubmit={this.handleSubmit.bind(this)}>
                                <TextField
                                    id="create-island"
                                    // label="Create new Island"
                                    placeholder={"New Island"}
                                    className={classes.textField}
                                    // helperText="Some important text"
                                    margin="normal"
                                    value={this.state.name}
                                    onChange={this.handleOnChange.bind(this)}
                                />
                            </form>
                            <Divider/>
                        </List>
                    </Drawer>
                    <main className={classes.content}>
                        <div className={classes.toolbar}/>
                        <Container className={classes.container}>
                            <IslandComponent islandId={this.props.selectedIsland}/>
                        </Container>
                    </main>
                </div>
            </ThemeProvider>
        </React.Fragment>);
    }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(App));
