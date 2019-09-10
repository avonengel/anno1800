/* eslint-disable react/jsx-no-duplicate-props */
import * as React from "react";
import {Avatar, Card, CardContent, CardHeader, createStyles, Divider, Grid, InputAdornment, TextField, Theme, Tooltip, Typography, WithStyles, withStyles} from "@material-ui/core";
import {RootState} from "../redux/store";
import {getProductStateById} from "../redux/selectors";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {ProductState} from "../redux/production/types";
import {params} from '../data/params_2019-04-17_full'
import {Error, GetApp, Publish, Warning} from "@material-ui/icons";
import {ALL_FACTORIES, Factory, ProductAsset} from "../data/assets";
import {getProduction} from "../redux/production/reducers";
import createCachedSelector from "re-reselect";
import {PRODUCTS} from "../data/productAssets";
import {updateFactoryCount, updateFactoryProductivity} from "../redux/production/actions";


const styles = (theme: Theme) => createStyles({
    card: {
        padding: theme.spacing(1)
    }
});

interface OwnProps {
    product: ProductAsset,
    islandId: number,
}

const producingFactoriesByProductId = new Map(PRODUCTS.map(product => [product.guid, ALL_FACTORIES.filter(factory => factory.output === product.guid)]));

export const relevantFactoryStatesById = createCachedSelector(
    (state: RootState, props: OwnProps) => state.factories[props.islandId],
    (_state: RootState, props: OwnProps) => props.product.guid,
    (islandFactoryStates, productId: number) => {
        const producingFactories = producingFactoriesByProductId.get(productId) || [];
        return new Map(producingFactories.map(f => [f.guid, islandFactoryStates[f.guid]]));
    }
)(
    (_state: any, props: OwnProps) => props.product.guid
);


const mapStateToProps = (state: RootState, ownProps: OwnProps) => {
    return {
        productState: getProductStateById(state, ownProps.islandId, ownProps.product.guid),
        factories: producingFactoriesByProductId.get(ownProps.product.guid) || [],
        factoryStatesById: relevantFactoryStatesById(state, ownProps),
    };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
    return {
        onBuildingCountChange: (factoryId: number, count: number) => {
            dispatch(updateFactoryCount(props.islandId, factoryId, count));
        },
        onProductivityChange: (factoryId:number, productivity: number) => {
            dispatch(updateFactoryProductivity(props.islandId, factoryId, productivity));
        }
    };
};
type Props = OwnProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & WithStyles<typeof styles>;

function getPopulationConsumption(productState: ProductState | undefined) {
    if (productState === undefined) {
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


function getIconData(productId: number) {
    for (let product of params.products) {
        if (product.guid === productId) {
            if (!!product.icon) {
                return product.icon;
            }
            return null;
        }
    }
    return null;
}

class ProductCard extends React.Component<Props> {

    render() {
        const {productState, product} = this.props;
        const productName = product.name;
        const iconData = getIconData(product.guid);
        const production = (productState && getProduction(productState)) || 0;
        const consumption = (productState && getConsumption(productState)) || 0;
        let warnIcon = null;
        if (production + 10e-5 < consumption) {
            warnIcon = <Error fontSize={"large"} color={"error"}/>
        } else if (production * 0.9 < consumption && getPopulationConsumption(productState) > 0) {
            warnIcon = <Warning fontSize={"large"}/>;
        }
        return (
            <Card>
                <CardHeader
                    avatar={
                        iconData && <Avatar alt={productName} src={iconData}/>
                    }
                    title={productName}
                    action={warnIcon}/>
                <CardContent>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <Tooltip title={"Production in t/min"}>
                                <div>
                                    <GetApp/> {production.toFixed(2) || 0}
                                </div>
                            </Tooltip>
                        </Grid>

                        <Grid item xs={6}>
                            <Tooltip title={"Consumption in t/min"}>
                                <div>
                                    <Publish/> {consumption.toFixed(2) || 0}
                                </div>
                            </Tooltip>
                        </Grid>
                    </Grid>

                    {this.props.factories.map((f) => this.renderFactoryFragment(f))}
                </CardContent>
            </Card>);
    }

    private renderFactoryFragment(f: Factory) {
        const factoryState = this.props.factoryStatesById.get(f.guid) || {productivity:1, buildingCount:0};
        const productivity = factoryState.productivity ? (factoryState.productivity * 100).toFixed(0) : 100;
        const perfectProductivity = (this.computePerfectProductivity(f) * 100).toFixed(1);
        const buildingCount = factoryState.buildingCount ? factoryState.buildingCount : 0;
        return (<React.Fragment key={f.name}>
            <Divider/>
            <Typography gutterBottom variant={"subtitle2"}>
                {f.name}
            </Typography>
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <Tooltip title={`Required with ${productivity} % productivity: ${this.computeMinimumRequiredCount(f)}`}>
                        <TextField label={"count"} type={"number"} inputProps={{min: 0}}
                            // style={{width: "5em"}}
                                   value={buildingCount}
                                   onChange={(event) => this.props.onBuildingCountChange(f.guid, Number(event.target.value))}/>
                    </Tooltip>
                </Grid>

                <Grid item xs={6}>
                    <Tooltip title={`Required with ${buildingCount} buildings: ${perfectProductivity} %`}>
                        <div>
                            <TextField label={"productivity"} type={"number"} inputProps={{min: 0}}
                                       // style={{width: "5em"}}
                                       value={productivity}
                                       onChange={(event) => this.props.onProductivityChange(f.guid, Number(event.target.value) / 100)}
                                       InputProps={{
                                           endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                       }}/>                        </div>
                    </Tooltip>
                </Grid>
            </Grid>
        </React.Fragment>);
    }

    private computePerfectProductivity(f: Factory) {
        const factoryState = this.props.factoryStatesById.get(f.guid) || {productivity:1, buildingCount:0};
        const {productState} = this.props;
        if (!productState) {
            return 0;
        }
        const consumption = getConsumption(productState);
        let cycleTime = f.cycleTime;
        const productionPerMinutePerBuilding = (60 / cycleTime);
        let buildingCount = 1;
        if (!!factoryState) {
            buildingCount = factoryState.buildingCount || 1;
            if (buildingCount === 0) {
                buildingCount = 1;
            }
        }
        return consumption / productionPerMinutePerBuilding / buildingCount;
    }

    private computeMinimumRequiredCount(f: Factory) {
        const factoryState = this.props.factoryStatesById.get(f.guid) || {productivity:1, buildingCount:0};
        const {productState} = this.props;
        if (!productState) {
            return 0;
        }
        const consumption = getConsumption(productState);
        let cycleTime = f.cycleTime;
        let productivity = factoryState ? factoryState.productivity : 1;
        const productionPerMinutePerBuilding = (60 / cycleTime) * productivity;
        return Math.ceil(consumption / productionPerMinutePerBuilding);
    }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ProductCard));