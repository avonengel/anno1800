import * as React from "react";
import {
    Button,
    createStyles,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Fab,
    Grid,
    IconButton,
    Input,
    Theme,
    Tooltip,
    Typography,
    withStyles,
    WithStyles,
    Zoom
} from "@material-ui/core";
import {getIslandById, getProductStateById, getTradeIdsForIslandId} from "../redux/selectors";
import {RootState} from "../redux/store";
import {Dispatch} from "redux";
import {Add, ChevronLeft, ChevronRight, Delete, Edit, Visibility, VisibilityOff} from "@material-ui/icons";
import {
    deleteIsland,
    renameIsland,
    selectNextIsland,
    selectPreviousIsland,
    updateHouseCount,
    updatePopulation
} from "../redux/islands/actions";
import FactoryCard from "./FactoryCard";
import TradeCard from "./TradeCard";
import {addTrade} from "../redux/trade/actions";
import {
    ALL_FACTORIES,
    FACTORIES_BY_ID,
    Factory,
    getPopulationLevelByName,
    NEW_WORLD_POPULATION_LEVELS,
    OLD_WORLD_POPULATION_LEVELS,
    POPULATION_LEVELS
} from "../data/assets";
import PopulationCard from "./PopulationCard";
import {connect} from "react-redux";


const styles = (theme: Theme) => createStyles({
    addTradeItem: {
        alignSelf: "center",
        textAlign: "center",
        minHeight: "10em",
    },
    input: {
        margin: theme.spacing(1),
    }
});

interface ReactProps extends WithStyles<typeof styles> {
    islandId: number;
}

const mapStateToProps = (state: RootState, reactProps: ReactProps) => {
    return {
        island: getIslandById(state, reactProps.islandId),
        factoriesToShow: factoriesToShow(state, reactProps),
        tradeIds: getTradeIdsForIslandId(state, reactProps.islandId),
        hasMultipleIslands: state.island.islandIds.length > 1,
    };
};

function factoriesToShow(state: Readonly<RootState>, props: ReactProps) {
    const populationStates = state.island.islandsById[props.islandId].population;
    const factoriesToShow: Factory[] = [];
    FACTORIES_BY_ID.forEach((factory, factoryId) => {
        if (state.factories && state.factories[props.islandId]
            && state.factories[props.islandId][factoryId]
            && state.factories[props.islandId][factoryId].buildingCount > 0) {
            factoriesToShow.push(factory);
            return;
        }

        if (!!populationStates) {
            for (let level in populationStates) {
                if (populationStates[level].population > 0) {
                    const populationLevel = getPopulationLevelByName(level);
                    if (!populationLevel) {
                        continue;
                    }
                    const needed = populationLevel.inputs
                        .filter(input => input.noWeightPopulationCount === undefined || input.noWeightPopulationCount < populationStates[level].population)
                        .find(input => factory.output === input.product);
                    if (needed) {
                        factoriesToShow.push(factory);
                        return;
                    }
                }
            }
        }
        // also show factories for things that are consumed by factories
        if (factory.output) {
            const productState = getProductStateById(state, props.islandId, factory.output);

            if (!!productState) {
                let consumptionPerMinute = 0;
                for (let factoryId in productState.factoryConsumers) {
                    consumptionPerMinute += productState.factoryConsumers[factoryId];
                }
                for (let tradeId in productState.exports) {
                    consumptionPerMinute += productState.exports[tradeId];
                }
                if (consumptionPerMinute) {
                    factoriesToShow.push(factory);
                }
            }
        }
    });
    return factoriesToShow;
}

const mapDispatchToProps = (dispatch: Dispatch, props: ReactProps) => {
    return {
        onHouseChange: (level: string, houses: number) => {
            dispatch(updateHouseCount(props.islandId, level, houses));
        },
        onPopulationChange: (level: string, population: number) => {
            dispatch(updatePopulation(props.islandId, level, population));
        },
        addTrade: () => {
            dispatch(addTrade(props.islandId));
        },
        renameIsland: (name: string) => {
            dispatch(renameIsland(props.islandId, name));
        },
        deleteIsland: () => {
            dispatch(deleteIsland(props.islandId));
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
    showAll: boolean;
    editName: boolean;
    islandName: string;
    deleteDialogOpen: boolean;
}

class IslandComponent extends React.Component<Props, OwnState> {


    constructor(props: Readonly<Props>) {
        super(props);
        this.state = {
            showAll: false,
            editName: false,
            islandName: props.island.name,
            deleteDialogOpen: false,
        };
    }

    private handleAddTrade() {
        this.props.addTrade();
    }

    private handleEdit() {
        this.setState({editName: !this.state.editName})
    }

    private handleNameChange(event: React.FormEvent) {
        event.preventDefault();
        this.props.renameIsland(this.state.islandName);
        this.setState({editName: false});
    }

    render() {
        const {island, tradeIds, classes, hasMultipleIslands} = this.props;
        const isOldWorld = this.hasPopulation(OLD_WORLD_POPULATION_LEVELS);
        const isNewWorld = this.hasPopulation(NEW_WORLD_POPULATION_LEVELS);
        const populationDecided = isOldWorld !== isNewWorld;
        let populationCards;
        if (populationDecided && isOldWorld) {
            populationCards = OLD_WORLD_POPULATION_LEVELS.map(this.renderPopulationCard.bind(this));
        } else if (populationDecided && isNewWorld) {
            populationCards = NEW_WORLD_POPULATION_LEVELS.map(this.renderPopulationCard.bind(this));
        } else {
            populationCards = POPULATION_LEVELS.map(this.renderPopulationCard.bind(this));
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
                <Typography component="div" variant="h5">Factories</Typography>
                <IconButton aria-label="toggle visibility" onClick={this.toggleVisibility.bind(this)} color={"primary"}>
                    {this.state.showAll ? <VisibilityOff/> : <Visibility/>}
                </IconButton>
            </div>
            <Grid container spacing={1} justify={"center"}>
                {ALL_FACTORIES.filter((factory) => !populationDecided || (isOldWorld && factory.isOldWorld) || (isNewWorld && factory.isNewWorld))
                    .filter((factory) => factory.output !== undefined)
                    .map((factory) =>
                        <Zoom key={factory.guid} in={this.shouldShow(factory)} mountOnEnter={true} unmountOnExit={true}>
                            <Grid item xs={6} md={3} lg={2}>
                                <FactoryCard factory={factory} islandId={island.id}/>
                            </Grid>
                        </Zoom>)}
            </Grid>
            <Typography component="div" align={"center"} variant="h5">Trade</Typography>
            <Grid container spacing={1} justify={"center"}>
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
            ;
    }

    private renderNameFragment() {
        const {classes, island, hasMultipleIslands} = this.props;
        if (this.state.editName) {
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

    private toggleVisibility() {
        this.setState({showAll: !this.state.showAll});
    }

    private shouldShow(factory: Factory): boolean {
        return this.state.showAll || this.props.factoriesToShow.includes(factory);
    }

    createOnHouseChange(level: string): (houses: number) => void {
        return (houses: number) => {
            this.props.onHouseChange(level, houses);
        }
    }

    createOnPopulationChange(level: string): (population: number) => void {
        return (population: number) => {
            this.props.onPopulationChange(level, population);
        }
    }

    private handleDeleteClose(deleteIsland: boolean) {
        this.setState({deleteDialogOpen: false});
        if (deleteIsland) {
            this.props.deleteIsland();
        }
    }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(IslandComponent));
