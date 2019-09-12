import * as React from "react";
import {Button, createStyles, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, Grid, IconButton, Input, Theme, Tooltip, Typography, withStyles, WithStyles, Zoom} from "@material-ui/core";
import {getProductStateById, getTradeIdsForIslandId} from "../redux/selectors";
import {RootState} from "../redux/store";
import {Dispatch} from "redux";
import {Add, ChevronLeft, ChevronRight, Delete, Edit, Visibility, VisibilityOff} from "@material-ui/icons";
import {deleteIsland, renameIsland, selectNextIsland, selectPreviousIsland, updateHouseCount, updatePopulation} from "../redux/islands/actions";
import TradeCard from "./TradeCard";
import {addTrade} from "../redux/trade/actions";
import {ALL_PUBLIC_SERVICES, getPopulationLevelByName, NEW_WORLD_POPULATION_LEVELS, OLD_WORLD_POPULATION_LEVELS, POPULATION_LEVELS, ProductAsset, PUBLIC_SERVICES_BY_ID, PublicService, Region} from "../data/assets";
import PopulationCard from "./PopulationCard";
import {connect} from "react-redux";
import PublicServiceCard from "./PublicServiceCard";
import {PRODUCTS} from "../data/productAssets";
import ProductCard from "./ProductCard";


const styles = (theme: Theme) => createStyles({
    tradeContainer: {
        minHeight: "20em",
    },
    addTradeItem: {
        alignSelf: "center",
        textAlign: "center",
    },
    input: {
        margin: theme.spacing(1),
    }
});

interface ReactProps extends WithStyles<typeof styles> {
}

function publicServicesToShow(state: Readonly<RootState>, props: ReactProps) {
    const populationStates = state.island.islandsById[state.selectedIsland].population;
    const servicesToShow: PublicService[] = [];
    PUBLIC_SERVICES_BY_ID.forEach((publicService, publicServiceId) => {
        // TODO introduce public service state
        // if (state.factories && state.factories[props.islandId]
        //     && state.factories[props.islandId][publicServiceId]
        //     && state.factories[props.islandId][publicServiceId].buildingCount > 0) {
        //     servicesToShow.push(publicService);
        //     return;
        // }

        if (!!populationStates) {
            for (let level in populationStates) {
                if (populationStates[level].population > 0) {
                    const populationLevel = getPopulationLevelByName(level);
                    if (!populationLevel) {
                        continue;
                    }
                    const needed = populationLevel.inputs
                        .filter(input => input.noWeightPopulationCount === undefined || input.noWeightPopulationCount < populationStates[level].population)
                        .some(input => publicService.output === input.product);
                    if (needed) {
                        servicesToShow.push(publicService);
                        return;
                    }
                }
            }
        }
    });
    return servicesToShow;
}

function productsToShow(state: Readonly<RootState>, props: ReactProps) {
    const populationStates = state.island.islandsById[state.selectedIsland].population;
    const productsToShow: ProductAsset[] = [];
    PRODUCTS.forEach((product) => {
        if (!!populationStates) {
            for (let level in populationStates) {
                if (populationStates[level].population > 0) {
                    const populationLevel = getPopulationLevelByName(level);
                    if (!populationLevel) {
                        continue;
                    }
                    const needed = populationLevel.inputs
                        .filter(input => input.noWeightPopulationCount === undefined || input.noWeightPopulationCount < populationStates[level].population)
                        .find(input => product.guid === input.product);
                    if (needed) {
                        productsToShow.push(product);
                        return;
                    }
                }
            }
        }
        // also show factories for things that are consumed by factories
        const productState = getProductStateById(state, state.selectedIsland, product.guid);

        if (!!productState) {
            let consumptionPerMinute = 0;
            for (let factoryId in productState.factoryConsumers) {
                consumptionPerMinute += productState.factoryConsumers[factoryId];
            }
            for (let tradeId in productState.exports) {
                consumptionPerMinute += productState.exports[tradeId];
            }
            let productionPerMinute = 0;
            for (let producerId in productState.producers) {
                productionPerMinute += productState.producers[producerId];
            }
            for (let tradeId in productState.imports) {
                productionPerMinute += productState.imports[tradeId];
            }
            if (consumptionPerMinute > 0 || productionPerMinute > 0) {
                productsToShow.push(product);
            }
        }
    });
    return productsToShow;
}

const mapStateToProps = (state: RootState, reactProps: ReactProps) => {
    return {
        islandId: state.selectedIsland,
        island: state.island.islandsById[state.selectedIsland],
        publicServicesToShow: publicServicesToShow(state, reactProps),
        productsToShow: productsToShow(state, reactProps),
        tradeIds: getTradeIdsForIslandId(state, state.selectedIsland),
        hasMultipleIslands: state.island.islandIds.length > 1,
    };
};

const mapDispatchToProps = (dispatch: Dispatch, props: ReactProps) => {
    return {
        onHouseChange: (islandId: number, level: string, houses: number) => {
            dispatch(updateHouseCount(islandId, level, houses));
        },
        onPopulationChange: (islandId: number, level: string, population: number) => {
            dispatch(updatePopulation(islandId, level, population));
        },
        addTrade: (islandId: number, ) => {
            dispatch(addTrade(islandId));
        },
        renameIsland: (islandId: number, name: string) => {
            dispatch(renameIsland(islandId, name));
        },
        deleteIsland: (islandId: number) => {
            dispatch(deleteIsland(islandId));
        },
        selectPreviousIsland: () => {
            dispatch(selectPreviousIsland());
        },
        selectNextIsland: () => {
            dispatch(selectNextIsland());
        },
    };
};
type Props = ReactProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

interface OwnState {
    showAllPublicServices: boolean;
    showAllProducts: boolean;
    isEditingIslandName: boolean;
    islandName: string;
    deleteDialogOpen: boolean;
}

class IslandComponent extends React.Component<Props, OwnState> {

    constructor(props: Readonly<Props>) {
        super(props);
        this.state = {
            showAllPublicServices: false,
            showAllProducts: false,
            isEditingIslandName: false,
            islandName: props.island.name,
            deleteDialogOpen: false,
        };
    }

    private handleAddTrade() {
        this.props.addTrade(this.props.islandId);
    }

    private handleEdit() {
        this.setState({
            isEditingIslandName: !this.state.isEditingIslandName,
            islandName: this.props.island.name,
        });
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<OwnState>, snapshot?: any): void {
        if (this.props.islandId !== prevProps.islandId) {
            this.setState({isEditingIslandName: false});
        }
    }

    private handleNameChange(event: React.FormEvent) {
        event.preventDefault();
        this.props.renameIsland(this.props.islandId, this.state.islandName);
        this.setState({isEditingIslandName: false});
    }

    render() {
        const {island, tradeIds, classes, hasMultipleIslands} = this.props;
        const region = this.determineIslandRegion();
        let populationCards;
        switch (region) {
            case Region.OLD_WORLD:
                populationCards = OLD_WORLD_POPULATION_LEVELS.map((level) => this.renderPopulationCard(level));
                break;
            case Region.NEW_WORLD:
                populationCards = NEW_WORLD_POPULATION_LEVELS.map((level) => this.renderPopulationCard(level));
                break;
            default:
                populationCards = POPULATION_LEVELS.map((level) => this.renderPopulationCard(level));
                break;
        }

        return <React.Fragment>
            {this.renderNameFragment()}
            <div style={{textAlign: "center"}}>
                <IconButton aria-label={"rename island"} onClick={this.handleEdit.bind(this)}>
                    <Edit/>
                </IconButton>
                <Tooltip title={(hasMultipleIslands && "Delete island") || "Cannot delete last island"}><span>
                    <IconButton aria-label={"delete island"} color={"secondary"}
                                onClick={() => this.setState({deleteDialogOpen: true})}
                                disabled={!hasMultipleIslands}>
                        <Delete/>
                    </IconButton>
                </span></Tooltip>
                <Dialog
                    open={this.state.deleteDialogOpen}
                    onClose={() => this.handleDeleteClose(false)}
                    aria-labelledby="delete-dialog-title"
                    aria-describedby="delete-dialog-description"
                >
                    <DialogTitle id="delete-dialog-title">Delete island {island.name}?</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="delete-dialog-description">
                            Are you sure? There is no undo functionality, yet.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant={"contained"} onClick={() => this.handleDeleteClose(false)} color="primary">
                            Cancel
                        </Button>
                        <Button variant={"contained"} onClick={() => this.handleDeleteClose(true)} color="primary"
                                autoFocus>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
            <Grid container spacing={1} justify={"center"}>
                {populationCards.map((card) =>
                    (<Grid item xs={6} md={3} lg={2} key={card.props.level}>
                        {card}
                    </Grid>))}
            </Grid>

            <div style={{textAlign: "center"}}>
                <Typography component="div" variant="h5">Public Services</Typography>
                <IconButton aria-label="toggle visibility" onClick={() => this.toggleVisibility("publicServices")} color={"primary"}>
                    {this.state.showAllPublicServices ? <VisibilityOff/> : <Visibility/>}
                </IconButton>
            </div>
            <Grid container spacing={1} justify={"center"}>
                {ALL_PUBLIC_SERVICES.filter((ps) => region === undefined || ps.associatedRegions.indexOf(region) >= 0)
                    .filter((ps) => ps.output !== undefined)
                    .map((ps) =>
                        <Zoom key={ps.guid} in={this.shouldShowPublicService(ps)} mountOnEnter={true} unmountOnExit={true}>
                            <Grid item xs={6} md={3} lg={2}>
                                <PublicServiceCard publicService={ps} islandId={island.id}/>
                            </Grid>
                        </Zoom>)}
            </Grid>

            <div style={{textAlign: "center"}}>
                <Typography component="div" variant="h5">Products</Typography>
                <IconButton aria-label="toggle visibility" onClick={() => this.toggleVisibility("products")} color={"primary"}>
                    {this.state.showAllProducts ? <VisibilityOff/> : <Visibility/>}
                </IconButton>
            </div>
            <Grid container spacing={1} justify={"center"}>
                {PRODUCTS.filter(p => !p.isAbstract && p.civLevel !== undefined)
                    .map((product) =>
                        <Zoom key={product.guid} in={this.shouldShowProduct(product)} mountOnEnter={true} unmountOnExit={true}>
                            <Grid item xs={6} md={3} lg={2}>
                                <ProductCard product={product} islandId={island.id} region={region}/>
                            </Grid>
                        </Zoom>)}
            </Grid>

            <Typography component="div" align={"center"} variant="h5">Trade</Typography>
            <Grid container spacing={1} justify={"center"} classes={{container: classes.tradeContainer}}>
                {tradeIds.map(tradeId =>
                    <Grid item xs={3} key={tradeId}>
                        <TradeCard tradeId={tradeId}/>
                    </Grid>
                )}
                <Grid item xs={3} classes={{item: classes.addTradeItem}}>
                    <Fab color={"primary"} aria-label={"Add trade"} onClick={this.handleAddTrade.bind(this)}>
                        <Add/>
                    </Fab>
                </Grid>
            </Grid>
        </React.Fragment>
    }

    private determineIslandRegion() {
        const isOldWorld = this.hasPopulation(OLD_WORLD_POPULATION_LEVELS);
        const isNewWorld = this.hasPopulation(NEW_WORLD_POPULATION_LEVELS);
        if (isOldWorld === isNewWorld) {
            return undefined;
        }
        if (isOldWorld) {
            return Region.OLD_WORLD;
        }
        return Region.NEW_WORLD;
    }

    private renderNameFragment() {
        const {classes, island, hasMultipleIslands} = this.props;
        if (this.state.isEditingIslandName) {
            return <form onSubmit={this.handleNameChange.bind(this)}>
                <div style={{textAlign: "center"}}>
                    <Input
                        value={this.state.islandName}
                        className={classes.input}
                        inputProps={{
                            'aria-label': 'new name',
                        }}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => this.setState({islandName: event.target.value})}
                    />
                </div>
            </form>;
        }
        return <Typography variant="h3" align={"center"}>
            <Tooltip
                title={(hasMultipleIslands && "Select previous island") || "There is only one island, cannot select previous one"}>
                <span>
                    <IconButton color={"secondary"} disabled={!hasMultipleIslands}
                                onClick={() => this.props.selectPreviousIsland()}>
                        <ChevronLeft/>
                    </IconButton>
                </span>
            </Tooltip>
            {island.name}
            <Tooltip
                title={(hasMultipleIslands && "Select next island") || "There is only one island, cannot select next one"}>
                <span>
                    <IconButton color={"secondary"} disabled={!hasMultipleIslands}
                                onClick={() => this.props.selectNextIsland()}>
                        <ChevronRight/>
                    </IconButton>
                </span>
            </Tooltip>
        </Typography>;
    }

    private hasPopulation(levelNames: string[]) {
        return levelNames.find(levelName => {
            const populationState = this.props.island.population[levelName];
            return populationState && populationState.population > 0;
        });
    }

    private renderPopulationCard(level: string) {
        return <PopulationCard key={level} level={level} houses={this.props.island.population[level].houses}
                               population={this.props.island.population[level].population}
                               onHouseChange={this.createOnHouseChange(level)}
                               onPopulationChange={this.createOnPopulationChange(level)}/>;
    }

    private toggleVisibility(kind: "publicServices" | "products") {
        if (kind === "publicServices") {
            this.setState({showAllPublicServices: !this.state.showAllPublicServices});
        }
        if (kind === "products") {
            this.setState({showAllProducts: !this.state.showAllProducts});
        }
    }

    private shouldShowPublicService(ps: PublicService): boolean {
        return this.state.showAllPublicServices || this.props.publicServicesToShow.includes(ps);
    }

    private shouldShowProduct(product: ProductAsset): boolean {
        return this.state.showAllProducts || this.props.productsToShow.includes(product);
    }

    createOnHouseChange(level: string): (houses: number) => void {
        return (houses: number) => {
            this.props.onHouseChange(this.props.islandId, level, houses);
        }
    }

    createOnPopulationChange(level: string): (population: number) => void {
        return (population: number) => {
            this.props.onPopulationChange(this.props.islandId, level, population);
        }
    }

    private handleDeleteClose(deleteIsland: boolean) {
        this.setState({deleteDialogOpen: false});
        if (deleteIsland) {
            this.props.deleteIsland(this.props.islandId);
        }
    }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(IslandComponent));
