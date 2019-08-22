import * as React from "react";
import {Grid, IconButton, Typography, Zoom} from "@material-ui/core";
import {connect} from "react-redux";
import {getIslandById, getProductStateById} from "../redux/selectors";
import {RootState} from "../redux/store";
import PopulationCard from "./PopulationCard";
import {Dispatch} from "redux";
import {Visibility, VisibilityOff} from "@material-ui/icons";
import {updateHouseCount, updatePopulation} from "../redux/islands/actions";
import {getPopulationLevelByName, POPULATION_LEVELS} from "../data/populations";
import {ALL_FACTORIES, FactoryRaw} from "../data/factories";
import FactoryCard from "./FactoryCard";
import TradeCard from "./TradeCard";

interface ReactProps {
    islandId: number;
}

const mapStateToProps = (state: RootState, reactProps: ReactProps) => {
    return {
        island: getIslandById(state, reactProps.islandId),
        factoriesToShow: factoriesToShow(state, reactProps),
    };
};

function factoriesToShow(state: Readonly<RootState>, props: ReactProps) {
    const populationStates = state.island.islandsById[props.islandId].population;
    const factoriesToShow: FactoryRaw[] = [];
    factoryLoop: for (const factory of ALL_FACTORIES) {
        if (state.factories && state.factories[props.islandId]
            && state.factories[props.islandId][factory.ID]
            && state.factories[props.islandId][factory.ID].buildingCount > 0) {
            factoriesToShow.push(factory);
            continue;
        }

        if (!!populationStates) {
            for (let level in populationStates) {
                if (populationStates[level].population > 0) {
                    const populationLevel = getPopulationLevelByName(level);
                    if (!populationLevel) {
                        continue;
                    }
                    const needed = populationLevel.Inputs.find(input => factory.Outputs.find(output => output.ProductID === input.ProductID));
                    if (needed) {
                        factoriesToShow.push(factory);
                        continue factoryLoop;
                    }
                }
            }
        }
        // also show factories for things that are consumed by factories
        for (let output of factory.Outputs) {
            const productState = getProductStateById(state, props.islandId, output.ProductID);

            if (!!productState) {
                let consumptionPerMinute = 0;
                for (let factoryId in productState.factoryConsumers) {
                    consumptionPerMinute += productState.factoryConsumers[factoryId];
                }
                if (consumptionPerMinute) {
                    factoriesToShow.push(factory);
                    continue factoryLoop;
                }
            }
        }
    }
    return factoriesToShow;
}

const mapDispatchToProps = (dispatch: Dispatch, props: ReactProps) => {
    return {
        onHouseChange: (level: string, houses: number) => {
            dispatch(updateHouseCount(props.islandId, level, houses));
        },
        onPopulationChange: (level: string, population: number) => {
            dispatch(updatePopulation(props.islandId, level, population));
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

    render() {
        const {island} = this.props;
        const populationCards = POPULATION_LEVELS.map((level) =>
            <PopulationCard key={level} level={level} houses={island.population[level].houses}
                            population={island.population[level].population}
                            onHouseChange={this.createOnHouseChange(level)}
                            onPopulationChange={this.createOnPopulationChange(level)}/>);
        return <React.Fragment>
            <Typography variant="h3" align={"center"} gutterBottom>{island.name}</Typography>
            <Grid container spacing={1}>
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
            <Grid container spacing={1}>
                {ALL_FACTORIES.map((factory) =>
                    <Zoom key={factory.ID} in={this.shouldShow(factory)} mountOnEnter={true} unmountOnExit={true}>
                        <Grid item xs={6} md={3} lg={2}>
                            <FactoryCard factory={factory} islandId={island.id}/>
                        </Grid>
                    </Zoom>)}
            </Grid>
            <Typography component="div" align={"center"} variant="h5">Trade</Typography>
            <TradeCard tradeId={1}/>
        </React.Fragment>;
    }

    private toggleVisibility() {
        this.setState({showAll: !this.state.showAll});
    }

    private shouldShow(factory: FactoryRaw): boolean {

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

export default connect(mapStateToProps, mapDispatchToProps)(IslandComponent);
