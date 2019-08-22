import * as React from "react";
import {RootState} from "../redux/store";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {Avatar, Card, CardActions, CardContent, CardHeader, createStyles, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Theme, Typography, WithStyles, withStyles} from "@material-ui/core";
import {Delete, Edit} from "@material-ui/icons";
import {params} from '../data/params_2019-04-17_full';
import {getProductById} from "../data/products";
import {updateTradeIslands, updateTradeProduct} from "../redux/trade/actions";

const styles = (theme: Theme) => createStyles({
    card: {
        maxWidth: 345,
    },
    avatar: {
        // backgroundColor: red[500],
    },
    formControl: {
        margin: theme.spacing(1),
    },
});

interface OwnProps extends WithStyles<typeof styles> {
    tradeId: number,
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => {
    return {
        islandState: state.island,
        trade: state.trades[ownProps.tradeId],
        thisIslandId: state.selectedIsland,
    };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
    return {
        updateTradeProduct: (productId: number) => dispatch(updateTradeProduct(props.tradeId, productId)),
        updateTradeIslands: (islandId1: number, islandId2: number) => dispatch(updateTradeIslands(props.tradeId, islandId1, islandId2))
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

    constructor(props: Props) {
        super(props);
    }

    handleChangeProduct(event: React.ChangeEvent<{ name?: string; value: unknown }>) {
        this.props.updateTradeProduct(event.target.value as number);
    }

    handleChangeIsland(event: React.ChangeEvent<{ name?: string; value: unknown }>) {
            if (this.props.trade.islandId1 === this.props.thisIslandId) {
                this.props.updateTradeIslands(this.props.thisIslandId, event.target.value as number);
            } else {
                this.props.updateTradeIslands(event.target.value as number, this.props.thisIslandId);
            }
    }

    render() {
        const {classes, islandState, trade, thisIslandId} = this.props;
        const product = getProductById(trade.productId);
        const otherIslandId = thisIslandId === trade.islandId1 ? trade.islandId2 : trade.islandId1;
        return (
            <Grid container spacing={1}>
                <Grid item xs={3}>
                    <Card className={classes.card}>
                        <CardHeader
                            avatar={
                                <Avatar aria-label={product.Name} className={classes.avatar} src={getIconData(trade.productId)}/>
                            }
                            title="Shrimp and Chorizo Paella"
                        />
                        <CardContent>
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
                                        params.products.map(p => (
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
                                            <MenuItem value={islandId} key={islandId}>{islandState.islandsById[islandId].name}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        </CardContent>
                        <CardActions disableSpacing>
                            <IconButton style={{marginLeft: 'auto'}} aria-label="Delete">
                                <Delete/>
                            </IconButton>
                            <IconButton aria-label="Edit">
                                <Edit/>
                            </IconButton>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(TradeCard));
