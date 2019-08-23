/* eslint-disable react/jsx-no-duplicate-props */
import * as React from "react";
import {
    Avatar,
    Card,
    CardContent,
    CardHeader,
    createStyles,
    InputAdornment,
    TextField,
    Theme,
    WithStyles,
    withStyles
} from "@material-ui/core";
import {FactoryRaw} from "../data/factories";
import {RootState} from "../redux/store";
import {getFactoryStateById, getProductStateById} from "../redux/selectors";
import {Dispatch} from "redux";
import {updateFactoryCount, updateFactoryProductivity} from "../redux/production/actions";
import {connect} from "react-redux";
import {ProductState} from "../redux/production/types";
import {params} from '../data/params_2019-04-17_full'


const styles = (theme: Theme) => createStyles({
    card: {
        padding: theme.spacing(1)
    }
});

interface ReactProps extends WithStyles<typeof styles> {
    factory: FactoryRaw,
    islandId: number,
}

const mapStateToProps = (state: RootState, reactProps: ReactProps) => {
    let outputProductState: ProductState | undefined;
    if (reactProps.factory.Outputs.length > 0) {
        outputProductState = getProductStateById(state, reactProps.islandId, reactProps.factory.Outputs[0].ProductID);
    }
    return {
        factoryState: getFactoryStateById(state, reactProps.islandId, reactProps.factory.ID),
        outputProductState
    };
};

const mapDispatchToProps = (dispatch: Dispatch, props: ReactProps) => {
    return {
        onBuildingCountChange: (count: number) => {
            dispatch(updateFactoryCount(props.islandId, props.factory.ID, count));
        },
        onProductivityChange: (productivity: number) => {
            dispatch(updateFactoryProductivity(props.islandId, props.factory.ID, productivity));
        }
    };
};
type Props = ReactProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

function getConsumption(productState: ProductState): number {
    let consumption = 0;
    for (let level in productState.populationConsumers) {
        consumption += productState.populationConsumers[level];
    }
    for (let factoryId in productState.factoryConsumers) {
        consumption += productState.factoryConsumers[factoryId];
    }
    return consumption;
}

function getProduction(productState: ProductState): number {
    let production = 0;
    for (let factoryId in productState.producers) {
        production += productState.producers[factoryId];
    }
    return production;
}


function getIconData(name: string) {
    for (let factory of params.factories) {
        if (factory.name === name) {
            if (!!factory.icon) {
                return factory.icon;
            }
            return null;
        }
    }
    return null;
}

class FactoryCard extends React.Component<Props> {

    render() {
        const {factoryState, outputProductState} = this.props;
        const iconData = getIconData(this.props.factory.Name);
        return (
            <Card>
                <CardHeader
                    avatar={
                        iconData && <Avatar alt={this.props.factory.Name} src={iconData} />
                    }
                    title={this.props.factory.Name}
                            titleTypographyProps={{component: 'h6', variant: 'h6'}}/>
                <CardContent>
                    <table>
                        <tbody>
                        <tr>
                            <td>
                                Have
                            </td>
                            <td>
                                Need
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <TextField label={"count"} type={"number"} inputProps={{min: 0}}
                                           style={{width: "5em"}}
                                           value={factoryState && factoryState.buildingCount ? factoryState.buildingCount : 0}
                                           onChange={this.onBuildingCountChange.bind(this)}/>
                            </td>
                            <td>
                                {(this.computePerfectProductivity() * 100).toFixed(1)}%
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <TextField label={"productivity"} type={"number"} inputProps={{min: 0}}
                                           style={{width: "5em"}}
                                           value={factoryState && factoryState.productivity ? (factoryState.productivity * 100).toFixed(0) : 100}
                                           onChange={this.onProductivityChange.bind(this)}
                                           InputProps={{
                                               endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                           }}/>
                            </td>
                            <td>
                                {"" + this.computeMinimumRequiredCount()}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {outputProductState && getProduction(outputProductState).toFixed(2) || 0} t/min
                            </td>
                            <td>
                                {outputProductState && getConsumption(outputProductState).toFixed(2) || 0} t/min
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </CardContent>
            </Card>);
    }

    private onBuildingCountChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.props.onBuildingCountChange(event.target.valueAsNumber);
    }

    private onProductivityChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.props.onProductivityChange(event.target.valueAsNumber / 100);
    }

    private computePerfectProductivity() {
        const {factoryState, outputProductState} = this.props;
        const outputs = this.props.factory.Outputs;
        const output = outputs[0];
        if (!output) {
            return 0;
        }
        if (!outputProductState) {
            return 0;
        }
        const consumption = getConsumption(outputProductState);
        let cycleTime = this.props.factory.CycleTime;
        if (cycleTime === 0) {
            cycleTime = 30;
        }
        const productionPerMinutePerBuilding = output.Amount * (60 / cycleTime);
        var buildingCount = 1;
        if (!!factoryState) {
            buildingCount = factoryState.buildingCount || 1;
            if (buildingCount === 0) {
                buildingCount = 1;
            }
        }
        return consumption / productionPerMinutePerBuilding / buildingCount;
    }

    private computeMinimumRequiredCount() {
        const outputs = this.props.factory.Outputs;
        const {factoryState, outputProductState} = this.props;
        const output = outputs[0];
        if (!output) {
            return 0;
        }
        if (!outputProductState) {
            return 0;
        }
        const consumption = getConsumption(outputProductState);
        let cycleTime = this.props.factory.CycleTime;
        if (cycleTime === 0) {
            cycleTime = 30;
        }
        let productivity = 1;
        if (!!factoryState) {
            productivity = factoryState.productivity;
        }
        const productionPerMinutePerBuilding = output.Amount * (60 / cycleTime) * productivity;
        return Math.ceil(consumption / productionPerMinutePerBuilding);
    }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(FactoryCard));