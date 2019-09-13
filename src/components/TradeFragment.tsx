/* eslint-disable react/jsx-no-duplicate-props */
import * as React from "react";
import {RootState} from "../redux/store";
import {createStyles, TextField, withStyles, WithStyles} from "@material-ui/core";
import {connect} from "react-redux";
import {Dispatch} from "redux";
import {GetApp, Publish} from "@material-ui/icons";
import {updateTonsPerMinute} from "../redux/trade/actions";

interface OwnProps {
    islandId: number;
    tradeId: number;
}

function getOtherIslandName(state: RootState, tradeId: number, thisIslandId: number) {
    const trade = state.trades.tradesById[tradeId];
    let islandState = state.island.islandsById[trade.fromIslandId];
    if (trade.fromIslandId === thisIslandId) {
        islandState = state.island.islandsById[trade.toIslandId];
    }
    return islandState ? islandState.name : "";
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => {
    return {
        trade: state.trades.tradesById[ownProps.tradeId],
        otherIslandName: getOtherIslandName(state, ownProps.tradeId, ownProps.islandId),
    };
};
const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
    return {
        updateTonsPerMinute: (tonsPerMinute: number) => dispatch(updateTonsPerMinute(props.tradeId, tonsPerMinute)),
    };
};

const styles = () => createStyles({
    container: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        alignItems: "center"
    }
});

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & WithStyles<typeof styles>;


class TradeFragment extends React.Component<Props> {
    render() {
        const {classes, trade, islandId, otherIslandName} = this.props;
        return (<React.Fragment>
            <div className={classes.container}>
                {trade.fromIslandId === islandId && <Publish/>}
                {trade.toIslandId === islandId && <GetApp/>}
                <TextField type={"number"} inputProps={{min: 0, step: "any"}} style={{flexGrow: 1, flexBasis: "4em"}}
                           value={trade.tonsPerMinute}
                           label={otherIslandName}
                           onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.onTonsPerMinuteChange(e)}/>
            </div>
        </React.Fragment>);
    }

    private onTonsPerMinuteChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.props.updateTonsPerMinute(event.target.valueAsNumber);
    }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(TradeFragment));
