import * as React from "react";
import {RootState} from "../redux/store";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {
    Avatar,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    createStyles,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Theme,
    WithStyles,
    withStyles
} from "@material-ui/core";
import {CompareArrows, Delete} from "@material-ui/icons";
import {params} from '../data/params_2019-04-17_full';
import {getProductById} from "../data/productTypes";
import {deleteTrade, updateTonsPerMinute, updateTradeIslands, updateTradeProduct} from "../redux/trade/actions";
import {PRODUCTS} from "../data/products";

const styles = (theme: Theme) => createStyles({
    card: {
        maxWidth: 345,
    },
    avatar: {
        // backgroundColor: red[500],
    },
    formControl: {
        marginTop: theme.spacing(1),
    },
    buttonIcon: {
        marginRight: theme.spacing(1)
    }
});

interface OwnProps extends WithStyles<typeof styles> {
    tradeId: number,
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => {
    return {
        islandState: state.island,
        trade: state.trades.tradesById[ownProps.tradeId],
        thisIslandId: state.selectedIsland,
    };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
    return {
        updateTradeProduct: (productId: number) => dispatch(updateTradeProduct(props.tradeId, productId)),
        updateTradeIslands: (fromIslandId: number, toIslandId: number) => dispatch(updateTradeIslands(props.tradeId, fromIslandId, toIslandId)),
        updateTonsPerMinute: (tonsPerMinute: number) => dispatch(updateTonsPerMinute(props.tradeId, tonsPerMinute)),
        delete: () => dispatch(deleteTrade(props.tradeId)),
    };
};
type Props = OwnProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

function getIconData(productId: number) {
    for (let product of params.products) {
        if (product.guid === productId) {
            if (!!product.icon) {
                return product.icon;
            }
            return undefined;
        }
    }
    return undefined;
}

class TradeCard extends React.Component<Props> {

    handleChangeProduct(event: React.ChangeEvent<{ name?: string; value: unknown }>) {
        this.props.updateTradeProduct(event.target.value as number);
    }

    handleChangeIsland(event: React.ChangeEvent<{ name?: string; value: unknown }>) {
        if (this.props.trade.fromIslandId === this.props.thisIslandId) {
            this.props.updateTradeIslands(this.props.thisIslandId, event.target.value as number);
        } else {
            this.props.updateTradeIslands(event.target.value as number, this.props.thisIslandId);
        }
    }

    handleImExportToggle(event: React.MouseEvent) {
        const {fromIslandId, toIslandId} = this.props.trade;
        this.props.updateTradeIslands(toIslandId, fromIslandId);
    }

    private onTonsPerMinuteChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.props.updateTonsPerMinute(event.target.valueAsNumber);
    }

    private onDelete(event: React.MouseEvent) {
        this.props.delete();
    }

    private generateTitle(productName: string): string {
        const {fromIslandId, toIslandId} = this.props.trade;
        const fromIsland = this.props.islandState.islandsById[fromIslandId];
        const toIsland = this.props.islandState.islandsById[toIslandId];
        return `${productName} ${fromIsland ? fromIsland.name.substr(0, 3) : '?'} - ${toIsland ? toIsland.name.substr(0, 3) : '?'}`
    }

    render() {
        const {classes, islandState, trade, thisIslandId} = this.props;
        const productName = trade.productId ? getProductById(trade.productId).name : "?";
        const otherIslandId = thisIslandId === trade.fromIslandId ? trade.toIslandId : trade.fromIslandId;
        return (
            <Card className={classes.card}>
                <CardHeader
                    avatar={
                        <Avatar aria-label={productName} className={classes.avatar}
                                src={getIconData(trade.productId)}/>
                    }
                    title={this.generateTitle(productName)}
                />
                <CardContent>
                    <Button variant={"outlined"} size={"medium"}
                            color={"inherit"}
                            onClick={this.handleImExportToggle.bind(this)}>
                        <CompareArrows className={classes.buttonIcon}/>
                        {trade.fromIslandId === thisIslandId ? "Export" : "Import"}
                    </Button>
                    <FormControl className={classes.formControl} fullWidth>
                        <InputLabel htmlFor={"productSelect"}>Product</InputLabel>
                        <Select
                            fullWidth
                            value={trade.productId}
                            onChange={this.handleChangeProduct.bind(this)}
                            inputProps={{
                                name: 'product',
                                id: 'productSelect',
                            }}>
                            {
                                PRODUCTS
                                    .filter(p => p.productCategory && !p.isAbstract)
                                    .sort((a,b) => a.name.localeCompare(b.name))
                                    .map(p => (
                                    <MenuItem value={p.guid} key={p.guid}>{p.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                    <FormControl className={classes.formControl} fullWidth>
                        <InputLabel htmlFor={"islandSelect"}>Island</InputLabel>
                        <Select
                            fullWidth
                            value={otherIslandId}
                            onChange={this.handleChangeIsland.bind(this)}
                            inputProps={{
                                name: 'island',
                                id: 'islandSelect',
                            }}>
                            {
                                islandState.islandIds.filter(islandId => islandId !== thisIslandId).map(islandId => (
                                    <MenuItem value={islandId}
                                              key={islandId}>{islandState.islandsById[islandId].name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                    <FormControl className={classes.formControl} fullWidth>
                        <TextField fullWidth label={"tons / minute"} type={"number"} inputProps={{min: 0}}
                                   value={trade.tonsPerMinute}
                                   onChange={this.onTonsPerMinuteChange.bind(this)}/>
                    </FormControl>
                </CardContent>
                <CardActions disableSpacing>
                    <IconButton style={{marginLeft: 'auto'}} aria-label="Delete" onClick={this.onDelete.bind(this)}>
                        <Delete/>
                    </IconButton>
                </CardActions>
            </Card>
        );
    }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(TradeCard));
