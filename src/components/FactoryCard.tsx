import * as React from "react";
import {
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
import {AppState} from "../redux/store";
import {getFactoryStateById, getProductById} from "../redux/selectors";
import {Dispatch} from "redux";
import {updateFactoryCount, updateFactoryProductivity} from "../redux/production/actions";
import {connect} from "react-redux";
import {ProductState} from "../redux/production/types";


const styles = (theme: Theme) => createStyles({
    card: {
        padding: theme.spacing(1)
    }
});

interface ReactProps extends WithStyles<typeof styles> {
    factory: FactoryRaw,
    islandId: number,
}

const mapStateToProps = (state: AppState, reactProps: ReactProps) => {
    const outputProductsById: { [id: number]: Readonly<ProductState> } = {};
    for (let output of reactProps.factory.Outputs) {
        outputProductsById[output.ProductID] = getProductById(state, reactProps.islandId, output.ProductID);
    }
    return {
        factoryState: getFactoryStateById(state, reactProps.islandId, reactProps.factory.ID),
        outputProductsById
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
    productState.populationConsumers.forEach(c => consumption += c.consumptionPerMinute);
    productState.factoryConsumers.forEach(c => consumption += c.consumptionPerMinute);
    return consumption;
}


class FactoryCard extends React.Component<Props> {

    render() {
        const {classes, factoryState} = this.props;
        return (
            <Card>
                <CardHeader title={this.props.factory.Name} titleTypographyProps={{component: 'h4'}}/>
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
                                           value={factoryState && factoryState.productivity ? factoryState.productivity * 100 : 100}
                                           onChange={this.onProductivityChange.bind(this)}
                                           InputProps={{
                                               endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                           }}/>
                            </td>
                            <td>
                                {this.computeMinimumRequiredCount()}
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
        const factoryState = this.props.factoryState;
        const outputs = this.props.factory.Outputs;
        const productState = this.props.outputProductsById[outputs[0].ProductID];
        if (!productState) {
            return 0;
        }
        const consumption = getConsumption(productState);
        let cycleTime = this.props.factory.CycleTime;
        if (cycleTime === 0) {
            cycleTime = 30;
        }
        const productionPerMinutePerBuilding = outputs[0].Amount * (cycleTime / 60);
        var buildingCount = 1;
        if (!!factoryState) {
            buildingCount = factoryState.buildingCount || 1;
            if (buildingCount === 0) {
                buildingCount = 1;
            }
        }
        // FIXME also, values are wrong in general when state was loaded from localstorage
        return consumption / productionPerMinutePerBuilding / buildingCount;
    }

    private computeMinimumRequiredCount() {
        const outputs = this.props.factory.Outputs;
        const factoryState = this.props.factoryState;
        const productState = this.props.outputProductsById[outputs[0].ProductID];
        if (!productState) {
            return 0;
        }
        const consumption = getConsumption(productState);
        let cycleTime = this.props.factory.CycleTime;
        if (cycleTime === 0) {
            cycleTime = 30;
        }
        let productivity = 1;
        if(!!factoryState) {
            productivity = factoryState.productivity;
        }
        const productionPerMinutePerBuilding = outputs[0].Amount * (cycleTime / 60) * productivity;
        return Math.ceil(consumption / productionPerMinutePerBuilding);
    }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(FactoryCard));