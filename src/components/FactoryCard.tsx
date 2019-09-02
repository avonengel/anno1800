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
import {RootState} from "../redux/store";
import {getFactoryStateById, getProductStateById} from "../redux/selectors";
import {Dispatch} from "redux";
import {updateFactoryCount, updateFactoryProductivity} from "../redux/production/actions";
import {connect} from "react-redux";
import {ProductState} from "../redux/production/types";
import {params} from '../data/params_2019-04-17_full'
import {Error, Warning} from "@material-ui/icons";
import {Factory} from "../data/assets";


const styles = (theme: Theme) => createStyles({
    card: {
        padding: theme.spacing(1)
    }
});

interface ReactProps extends WithStyles<typeof styles> {
    factory: Factory,
    islandId: number,
}

const mapStateToProps = (state: RootState, reactProps: ReactProps) => {
    let outputProductState: ProductState | undefined;
    if (reactProps.factory.output) {
        outputProductState = getProductStateById(state, reactProps.islandId, reactProps.factory.output);
    }
    return {
        factoryState: getFactoryStateById(state, reactProps.islandId, reactProps.factory.guid),
        outputProductState
    };
};

const mapDispatchToProps = (dispatch: Dispatch, props: ReactProps) => {
    return {
        onBuildingCountChange: (count: number) => {
            dispatch(updateFactoryCount(props.islandId, props.factory.guid, count));
        },
        onProductivityChange: (productivity: number) => {
            dispatch(updateFactoryProductivity(props.islandId, props.factory.guid, productivity));
        }
    };
};
type Props = ReactProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

function getPopulationConsumption(productState: ProductState | undefined) {
    if(productState === undefined) {
        return 0;
    }
    let consumption = 0;
    for (let level in productState.populationConsumers) {
        consumption += productState.populationConsumers[level];
    }
    return consumption;
}

function getConsumption(productState: ProductState): number {
    let consumption = 0;
    consumption += getPopulationConsumption(productState);
    for (let factoryId in productState.factoryConsumers) {
        consumption += productState.factoryConsumers[factoryId];
    }
    for (let tradeId in productState.exports) {
        consumption += productState.exports[tradeId];
    }
    return consumption;
}

function getProduction(productState: ProductState): number {
    let production = 0;
    for (let factoryId in productState.producers) {
        production += productState.producers[factoryId];
    }
    for (let tradeId in productState.imports) {
        production += productState.imports[tradeId];
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
        const iconData = getIconData(this.props.factory.name);
        const production = (outputProductState && getProduction(outputProductState)) || 0;
        const consumption = (outputProductState && getConsumption(outputProductState)) || 0;
        let warnIcon = null;
        if (production < consumption) {
            warnIcon = <Error fontSize={"large"} color={"error"}/>
        } else if (production * 0.9 < consumption && getPopulationConsumption(outputProductState) > 0) {
            warnIcon = <Warning fontSize={"large"}/>;
        }
        return (
            <Card>
                <CardHeader
                    avatar={
                        iconData && <Avatar alt={this.props.factory.name} src={iconData} />
                    }
                    title={this.props.factory.name}
                    action={warnIcon}
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
                                {production.toFixed(2) || 0} t/min
                            </td>
                            <td>
                                {consumption.toFixed(2) || 0} t/min
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
        const output = this.props.factory.output;
        if (!output) {
            return 0;
        }
        if (!outputProductState) {
            return 0;
        }
        const consumption = getConsumption(outputProductState);
        let cycleTime = this.props.factory.cycleTime;
        if (!cycleTime) {
            cycleTime = 30;
        }
        const productionPerMinutePerBuilding = (60 / cycleTime);
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
        const {factoryState, outputProductState} = this.props;
        const output =  this.props.factory.output;
        if (!output) {
            return 0;
        }
        if (!outputProductState) {
            return 0;
        }
        const consumption = getConsumption(outputProductState);
        let cycleTime = this.props.factory.cycleTime;
        if (!cycleTime) {
            cycleTime = 30;
        }
        let productivity = 1;
        if (!!factoryState) {
            productivity = factoryState.productivity;
        }
        const productionPerMinutePerBuilding = (60 / cycleTime) * productivity;
        return Math.ceil(consumption / productionPerMinutePerBuilding);
    }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(FactoryCard));