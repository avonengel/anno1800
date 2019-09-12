import * as React from "react";
import {
    Avatar,
    Card,
    CardContent,
    CardHeader,
    createStyles,
    Divider,
    Grid,
    Theme,
    Tooltip,
    Typography,
    WithStyles,
    withStyles
} from "@material-ui/core";
import {RootState} from "../redux/store";
import {getProductStateById} from "../redux/selectors";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {ProductState} from "../redux/production/types";
import {params} from '../data/params_2019-04-17_full'
import {Add, Error, Remove, Warning} from "@material-ui/icons";
import {ALL_FACTORIES, getFactoryById, ProductAsset, Region} from "../data/assets";
import {getProduction} from "../redux/production/reducers";
import {PRODUCTS} from "../data/productAssets";
import {updateFactoryCount, updateFactoryProductivity} from "../redux/production/actions";
import FactoryFragment from "./FactoryFragment";
import TradeFragment from "./TradeFragment";


const styles = (theme: Theme) => createStyles({
    card: {
        padding: theme.spacing(1)
    },
    divider: {
        margin: theme.spacing(1, 0, 1, 0)
    }
});

interface OwnProps {
    product: ProductAsset;
    islandId: number;
    region: Region | undefined;
}

const producingFactoriesByProductId = new Map(PRODUCTS.map(product => [product.guid, ALL_FACTORIES.filter(factory => factory.output === product.guid)]));

const mapStateToProps = (state: RootState, ownProps: OwnProps) => {
    return {
        productState: getProductStateById(state, ownProps.islandId, ownProps.product.guid),
    };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
    return {
        onBuildingCountChange: (factoryId: number, count: number) => {
            dispatch(updateFactoryCount(props.islandId, factoryId, count));
        },
        onProductivityChange: (factoryId: number, productivity: number) => {
            dispatch(updateFactoryProductivity(props.islandId, factoryId, productivity));
        }
    };
};
type Props =
    OwnProps
    & ReturnType<typeof mapStateToProps>
    & ReturnType<typeof mapDispatchToProps>
    & WithStyles<typeof styles>;

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

function getConsumption(productState: ProductState | undefined): number {
    if (!productState) {
        return 0;
    }
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

class ProductCard extends React.PureComponent<Props> {

    render() {
        const {productState, product, classes} = this.props;
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
        const factories = producingFactoriesByProductId.get(this.props.product.guid) || [];
        const tradeIds = this.getTradeIds();
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
                                    <Add style={{verticalAlign: "middle"}}/> {production.toFixed(2) || 0}
                                </div>
                            </Tooltip>
                        </Grid>

                        <Grid item xs={6}>
                            <Tooltip title={this.consumptionTooltipText()}>
                                <div>
                                    <Remove style={{verticalAlign: "middle"}}/> {consumption.toFixed(2) || 0}
                                </div>
                            </Tooltip>
                        </Grid>
                    </Grid>

                    {factories
                        .filter(f => !this.props.region || f.associatedRegions.indexOf(this.props.region) >= 0)
                        .map((f) => <FactoryFragment islandId={this.props.islandId} factoryId={f.guid}
                                                     consumption={getConsumption(productState)}/>)}

                    {tradeIds.length > 0 &&
                    <React.Fragment>
                        <Divider className={classes.divider}/>
                        <Typography gutterBottom variant={"subtitle2"}>
                            Trade
                        </Typography>
                        {tradeIds.map(id => <TradeFragment islandId={this.props.islandId} tradeId={id} key={id}/>)}
                    </React.Fragment>
                    }
                </CardContent>
            </Card>);
    }

    private consumptionTooltipText() {
        const {productState} = this.props;
        if (!productState) {
            return "Consumption in t/min";
        }
        const populationLevels = [];
        for (let level in productState.populationConsumers) {
            if (productState.populationConsumers[level] > 0) {
                populationLevels.push(level);
            }
        }
        const factoryIds: number[] = [];
        for (let factoryId in productState.factoryConsumers) {
            if (productState.factoryConsumers[factoryId] > 0) {
                factoryIds.push(Number(factoryId));
            }
        }
        const tradeIds: number[] = [];
        for (let tradeId in productState.exports) {
            if (productState.exports[tradeId] > 0) {
                tradeIds.push(Number(tradeId));
            }
        }
        return (<React.Fragment>
            Consumption in t/min:<br/>
            {populationLevels.map((value, index) => <React.Fragment>
                {index > 0 && <br/>}
                {productState.populationConsumers[value].toFixed(2)} {value}
            </React.Fragment>)}
            {factoryIds.map((value, index) => <React.Fragment>
                {index > 0 && <br/>}
                {productState.factoryConsumers[value].toFixed(2)} {getFactoryById(value).name}
            </React.Fragment>)}
        </React.Fragment>);
    }

    private getTradeIds() {
        const {productState} = this.props;
        const tradeIds: number[] = [];
        if (productState) {
            for (let tradeId in productState.imports) {
                tradeIds.push(Number(tradeId));
            }
            for (let tradeId in productState.exports) {
                tradeIds.push(Number(tradeId));
            }
        }
        return tradeIds;
    }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ProductCard));