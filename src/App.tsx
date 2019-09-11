import React from 'react';
import {AppBar, Container, createStyles, CssBaseline, Divider, Drawer, InputAdornment, List, ListItem, ListItemText, TextField, Toolbar, Typography, withStyles, WithStyles} from "@material-ui/core";
import {ThemeProvider} from '@material-ui/styles';
import theme from "./theme";
import {connect} from "react-redux";
import IslandComponent from "./components/IslandComponent";
import {RootState} from "./redux/store";
import {Dispatch} from "redux";
import {createIsland, selectIsland} from "./redux/islands/actions";
import clsx from "clsx";
import IconButton from "@material-ui/core/IconButton";
import {Add, ChevronLeft, ChevronRight, Menu, Publish} from "@material-ui/icons"
import DownloadButton from "./components/DownloadButton";
import {uploadState} from "./redux/actions";

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
    title: {
        flexGrow: 1,
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
        onStateUpload: (state: RootState) => {
            dispatch(uploadState(state));
        }
    };
};
type Props = OwnProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

interface OwnState {
    name: string,
    drawerOpen: boolean,
}

class App extends React.Component<Props, OwnState> {
    private fileInputRef: React.RefObject<HTMLInputElement>;

    constructor(props: Props) {
        super(props);
        this.state = {
            name: "",
            drawerOpen: false,
        };
        this.fileInputRef = React.createRef();
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

    handleStateUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const {files} = event.target;
        if (files && files.length > 0) {
            const file = files.item(0);
            if (file) {
                const reader = new FileReader();
                reader.onload = ((stateUpload) => (e: any) => {stateUpload(JSON.parse(e.target.result))})(this.props.onStateUpload);
                reader.readAsText(file);
            }
        }
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
                                <Typography variant="h6" noWrap className={classes.title}>
                                    Anno 1800 Companion
                                </Typography>
                                <IconButton
                                    color="inherit"
                                    aria-label="Upload State"
                                    onClick={() => {if(this.fileInputRef.current) this.fileInputRef.current.click();} }>
                                    <Publish/>
                                </IconButton>
                                <input type={"file"} ref={this.fileInputRef}
                                       style={{display: "none"}} onChange={this.handleStateUpload.bind(this)}
                                       accept={"application/json"}/>
                                <DownloadButton/>
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
