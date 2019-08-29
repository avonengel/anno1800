import * as React from "react";
import {createStyles, Fab, Grid, IconButton, Theme, Typography, WithStyles, withStyles, Zoom} from "@material-ui/core";
import {connect} from "react-redux";
import {getIslandById, getProductStateById, getTradeIdsForIslandId} from "../redux/selectors";
import {RootState} from "../redux/store";
import PopulationCard from "./PopulationCard";
import {Dispatch} from "redux";
import {Add, Visibility, VisibilityOff} from "@material-ui/icons";
import {updateHouseCount, updatePopulation} from "../redux/islands/actions";
import {
    getPopulationLevelByName,
    NEW_WORLD_POPULATION_LEVELS,
    OLD_WORLD_POPULATION_LEVELS,
    POPULATION_LEVELS
} from "../data/populations";
import FactoryCard from "./FactoryCard";
import TradeCard from "./TradeCard";
import {addTrade} from "../redux/trade/actions";
import {ALL_FACTORIES, FACTORIES_BY_ID, Factory} from "../data/factoryTypes";


const styles = (theme: Theme) => createStyles({
    addTradeItem: {
        alignSelf: "center",
        textAlign: "center"
    },
});

interface ReactProps extends WithStyles<typeof styles> {
    islandId: number;
}

const mapStateToProps = (state: RootState, reactProps: ReactProps) => {
    return {
        island: getIslandById(state, reactProps.islandId),
        factoriesToShow: factoriesToShow(state, reactProps),
        tradeIds: getTradeIdsForIslandId(state, reactProps.islandId),
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
                    const needed = populationLevel.Inputs.find(input => factory.output === input.ProductID);
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
        }
    };
};
type Props = ReactProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

interface OwnState {
    showAll: boolean;
}

class IslandComponent extends React.Component<Props, OwnState> {


    constructor(props: Readonly<Props>) {
        super(props);
        this.state = {
            showAll: false,
        };
    }

    private handleAddTrade() {
        this.props.addTrade();
    }

    render() {
        const {island, tradeIds, classes} = this.props;
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
            <Typography variant="h3" align={"center"} gutterBottom>{island.name}</Typography>
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
        </React.Fragment>;
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
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(IslandComponent));
