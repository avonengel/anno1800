import React from 'react';
import './App.css';
import {
    AppBar,
    Container,
    createStyles,
    CssBaseline,
    Divider,
    Drawer, InputAdornment,
    List,
    ListItem,
    ListItemText,
    TextField,
    Toolbar,
    Typography,
    withStyles,
    WithStyles
} from "@material-ui/core";
import {ThemeProvider} from '@material-ui/styles';
import theme from "./theme";
import {connect} from "react-redux";
import IslandComponent from "./components/IslandComponent";
import {RootState} from "./redux/store";
import {Dispatch} from "redux";
import {createIsland, selectIsland} from "./redux/islands/actions";
import clsx from "clsx";
import IconButton from "@material-ui/core/IconButton";
import {Add, ChevronLeft, ChevronRight, Menu} from "@material-ui/icons"

const drawerWidth = 240;

const styles = createStyles({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(1),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    container: {
        paddingTop: theme.spacing(5)
    },
    textField: {
        marginLeft: 0,
        marginRight: 0,
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
    name: string,
    drawerOpen: boolean,
}

class App extends React.Component<Props, OwnState> {

    constructor(props: Props) {
        super(props);
        this.state = {
            name: "",
            drawerOpen: false,
        };
    }

    handleDrawerOpen() {
        this.setState({drawerOpen: true});
    }

    handleDrawerClose() {
        this.setState({drawerOpen: false});
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
        this.setState({
            name: event.target.value
        });
    }

    render() {
        const {classes, islandIds, islandsById} = this.props;
        return (
            <React.Fragment>
                <CssBaseline/>
                <ThemeProvider theme={theme}>
                    <div className={classes.root}>
                        <CssBaseline/>
                        <AppBar
                            position="fixed"
                            className={clsx(classes.appBar, {
                                [classes.appBarShift]: this.state.drawerOpen,
                            })}
                        >
                            <Toolbar>
                                <IconButton
                                    color="inherit"
                                    aria-label="Open drawer"
                                    onClick={this.handleDrawerOpen.bind(this)}
                                    edge="start"
                                    className={clsx(classes.menuButton, this.state.drawerOpen && classes.hide)}
                                >
                                    <Menu/>
                                </IconButton>
                                <Typography variant="h6" noWrap>
                                    Anno 1800 Companion
                                </Typography>
                            </Toolbar>
                        </AppBar>
                        <Drawer
                            className={classes.drawer}
                            variant="persistent"
                            anchor="left"
                            open={this.state.drawerOpen}
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                        >
                            <div className={classes.drawerHeader}>
                                <IconButton onClick={this.handleDrawerClose.bind(this)}>
                                    {theme.direction === 'ltr' ? <ChevronLeft/> : <ChevronRight/>}
                                </IconButton>
                            </div>
                            <List component={"nav"}>
                                {islandIds.map((islandId) => (
                                    <ListItem button key={islandId}>
                                        <ListItemText primary={islandsById[islandId].name}
                                                      onClick={() => this.selectIsland(islandId)}/>
                                    </ListItem>
                                ))}
                                <ListItem>
                                    <form onSubmit={this.handleSubmit.bind(this)}>
                                        <TextField
                                            id="create-island"
                                            // label="Create new Island"
                                            placeholder={"New Island"}
                                            className={classes.textField}
                                            // helperText="Some important text"
                                            // margin="normal"
                                            value={this.state.name}
                                            onChange={this.handleOnChange.bind(this)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Add/>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </form>
                                </ListItem>
                            </List>
                            <Divider/>
                        </Drawer>
                        <main className={clsx(classes.content, {[classes.contentShift]: this.state.drawerOpen})}>
                            <div className={classes.drawerHeader}/>
                            <Container className={classes.container}>
                                <IslandComponent islandId={this.props.selectedIsland}/>
                            </Container>
                        </main>
                    </div>
                </ThemeProvider>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(App));
