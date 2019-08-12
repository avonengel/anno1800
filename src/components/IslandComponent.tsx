import * as React from "react";
import {Grid, Typography} from "@material-ui/core";
import {connect} from "react-redux";
import {getIslandById, getProductById} from "../redux/selectors";
import {IRootState} from "../redux/store";
import PopulationCard from "./PopulationCard";
import {Dispatch} from "redux";
import {updateHouseCount} from "../redux/islands/actions";
import {getPopulationLevelByName, POPULATION_LEVELS} from "../data/populations";
import {ALL_FACTORIES, FactoryRaw} from "../data/factories";
import FactoryCard from "./FactoryCard";

interface ReactProps {
    islandId: number;
}

const mapStateToProps = (state: IRootState, reactProps: ReactProps) => {
    return {
        island: getIslandById(state, reactProps.islandId),
        factoriesToShow: factoriesToShow(state, reactProps),
    };
};

function factoriesToShow(state: Readonly<IRootState>, props: ReactProps) {
    const populationStates = state.island.islandsById[props.islandId].population;
    const factoriesToShow: FactoryRaw[] = [];
    for (const factory of ALL_FACTORIES) {

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
                        continue;
                    }
                }
            }
        }
        // also show factories for things that are consumed by factories
        for (let output of factory.Outputs) {
            // FIXME wtf?! why does this only work if productId is supplied as string?! And what's the difference to calling it from the reducer?
            const productState = getProductById(state, props.islandId, output.ProductID);
            if (!!productState) {
                const consumptionPerMinute = productState.factoryConsumers.reduce((sum: number, cons) => sum + cons.consumptionPerMinute, 0);
                if (output.ProductID === 1010197) {
                    console.log(`Wool consumption total: ${consumptionPerMinute}, productState: ${JSON.stringify(productState)}`);
                }
                if (consumptionPerMinute) {
                    factoriesToShow.push(factory);
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
        }
    };
};
type Props = ReactProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class IslandComponent extends React.Component<Props> {

    render() {
        const {island} = this.props;
        const populationCards = POPULATION_LEVELS.map((level) =>
            <PopulationCard key={level} level={level} houses={island.population[level].houses}
                            population={island.population[level].population}
                            onHouseChange={this.createOnHouseChange(level)}/>);
        return <>
            <Typography variant="h3">{island.name}</Typography>
            <Grid container spacing={1}>
                {populationCards.map((card) =>
                    (<Grid item xs={6} sm={2} key={card.props.level}>
                        {card}
                    </Grid>))}
            </Grid>
            <Grid container spacing={1}>
                {ALL_FACTORIES.map((factory) =>
                    this.shouldShow(factory) &&
                    (<Grid item xs={6} sm={2} key={factory.ID}>
                        <FactoryCard factory={factory} islandId={island.id}/>
                    </Grid>))}
            </Grid>
        </>;
    }

    private shouldShow(factory: FactoryRaw): boolean {
        return !!this.props.factoriesToShow.find(f => f === factory);
    }

    createOnHouseChange(level: string): (houses: number) => void {
        return (houses: number) => {
            this.props.onHouseChange(level, houses);
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(IslandComponent);
