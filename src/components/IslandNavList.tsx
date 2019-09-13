import * as React from "react";
import {createStyles, Divider, InputAdornment, List, ListItem, ListItemText, TextField, withStyles, WithStyles} from "@material-ui/core";
import {Add} from "@material-ui/icons";
import {Island} from "../redux/islands/types";
import {RootState} from "../redux/store";
import {Dispatch} from "redux";
import {createIsland, selectIsland} from "../redux/islands/actions";
import {connect} from "react-redux";

interface OwnProps {
    islandIds: number[];
    islandsById: {[islandId: number]: Island};
}

interface State {
    name: string,
}

const mapStateToProps = (state: RootState) => ({
    islandIds: state.island.islandIds,
    islandsById: state.island.islandsById,
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

const styles = createStyles({
    textField: {
        marginLeft: 0,
        marginRight: 0,
    },
});

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & WithStyles<typeof styles>;

class IslandNavList extends React.PureComponent<Props, State> {


    constructor(props: Props, context: any) {
        super(props, context);
        this.state = {
            name: "",
        };
    }

    private handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            name: event.target.value
        });
    }

    handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        this.setState({name: ""});
        this.props.onCreateIsland(this.state.name);
    }

    render() {
        const {islandIds, islandsById, classes} = this.props;
        return <List component={"nav"}>
            {islandIds.map((islandId) => (
                <React.Fragment key={islandId}>
                    <ListItem button>
                        <ListItemText primary={islandsById[islandId].name}
                                      onClick={() => this.props.onIslandSelected(islandId)}/>
                    </ListItem>
                    <Divider/>
                </React.Fragment>
            ))}
            <ListItem>
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <TextField
                        id="create-island"
                        label="Create new Island"
                        placeholder={"new island name"}
                        className={classes.textField}
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
        </List>;
    }
}
export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(IslandNavList));
