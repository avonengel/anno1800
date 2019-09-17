/* eslint-disable react/jsx-no-duplicate-props */
import * as React from "react";
import {getFactoryStateById} from "../redux/selectors";
import {createStyles, Divider, Grid, InputAdornment, TextField, Theme, Tooltip, Typography, withStyles, WithStyles} from "@material-ui/core";
import {connect} from "react-redux";
import {getFactoryById} from "../data/assets";
import {Dispatch} from "redux";
import {updateFactoryCount, updateFactoryProductivity} from "../redux/production/actions";
import {RootState} from "../redux/root-state";

interface OwnProps {
    islandId: number;
    factoryId: number;
    consumption: number;
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => {
    return {
        factoryState: getFactoryStateById(state, ownProps.islandId, ownProps.factoryId),
    };
};
const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
    return {
        onBuildingCountChange: (count: number) => {
            dispatch(updateFactoryCount(props.islandId, props.factoryId, count));
        },
        onProductivityChange: (productivity: number) => {
            dispatch(updateFactoryProductivity(props.islandId, props.factoryId, productivity));
        }
    };
};

const styles = (theme: Theme) => createStyles({
    divider: {
        margin: theme.spacing(1, 0, 1, 0)
    }
});

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & WithStyles<typeof styles>;


class FactoryFragment extends React.Component<Props> {
    render() {
        const f = getFactoryById(this.props.factoryId);
        const factoryState = this.props.factoryState || {productivity: 1, buildingCount: 0};
        const productivity = factoryState.productivity ? (factoryState.productivity * 100).toFixed(0) : 100;
        const perfectProductivity = (this.computePerfectProductivity() * 100).toFixed(1);
        const buildingCount = factoryState.buildingCount ? factoryState.buildingCount : 0;
        return (<React.Fragment>
            <Divider className={this.props.classes.divider}/>
            <Typography gutterBottom variant={"subtitle2"}>
                {f.name}
            </Typography>
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <Tooltip title={`Required with ${productivity} % productivity: ${this.computeMinimumRequiredCount()}`}>
                        <TextField label={"count"} type={"number"} inputProps={{min: 0, step: 1}}
                                   value={buildingCount}
                                   onChange={(event) => this.props.onBuildingCountChange(Number(event.target.value))}/>
                    </Tooltip>
                </Grid>

                <Grid item xs={6}>
                    <Tooltip title={`Required with ${buildingCount} buildings: ${perfectProductivity} %`}>
                        <div>
                            <TextField label={"productivity"} type={"number"} inputProps={{min: 0}}
                                       value={productivity}
                                       onChange={(event) => this.props.onProductivityChange(Number(event.target.value) / 100)}
                                       InputProps={{
                                           endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                       }}/>
                        </div>
                    </Tooltip>
                </Grid>
            </Grid>
        </React.Fragment>);
    }

    private computePerfectProductivity() {
        const f = getFactoryById(this.props.factoryId);
        const factoryState = this.props.factoryState || {productivity: 1, buildingCount: 0};
        const consumption = this.props.consumption;
        let cycleTime = f.cycleTime;
        const productionPerMinutePerBuilding = (60 / cycleTime);
        let buildingCount = factoryState.buildingCount || 1;
        if (buildingCount === 0) {
            buildingCount = 1;
        }
        return consumption / productionPerMinutePerBuilding / buildingCount;
    }

    private computeMinimumRequiredCount() {
        const f = getFactoryById(this.props.factoryId);
        const factoryState = this.props.factoryState || {productivity: 1, buildingCount: 0};
        const consumption = this.props.consumption;
        let cycleTime = f.cycleTime;
        let productivity = factoryState ? factoryState.productivity : 1;
        const productionPerMinutePerBuilding = (60 / cycleTime) * productivity;
        return Math.ceil(consumption / productionPerMinutePerBuilding);
    }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(FactoryFragment));
