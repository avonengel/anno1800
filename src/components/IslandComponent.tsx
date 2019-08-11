import * as React from "react";
import {Grid, Typography} from "@material-ui/core";
import {connect} from "react-redux";
import {getIslandById, getProductByIdFromProduct} from "../redux/selectors";
import {AppState} from "../redux/store";
import PopulationCard from "./PopulationCard";
import {Dispatch} from "redux";
import {updateHouseCount} from "../redux/islands/actions";
import {getPopulationLevelByName, POPULATION_LEVELS} from "../data/populations";
import {ALL_FACTORIES, FactoryRaw} from "../data/factories";
import FactoryCard from "./FactoryCard";

interface ReactProps {
    islandId: number;
}

const mapStateToProps = (state: AppState, reactProps: ReactProps) => {
    return {
        island: getIslandById(state, reactProps.islandId),
        products: state.products,
    };
};

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

    private shouldShow(factory: FactoryRaw) : boolean {
        const populationStates = this.props.island.population;
        for (let level in populationStates) {
            if (populationStates[level].population > 0) {
                const populationLevel = getPopulationLevelByName(level);
                if (!populationLevel) {
                    continue;
                }
                const needed = populationLevel.Inputs.find(input => factory.Outputs.find(output => output.ProductID === input.ProductID));
                if(needed) {
                    return true;
                }
            }
        }
        // TODO: also show factories for things that are consumed by factories
        for (let output of factory.Outputs) {
             const productState = getProductByIdFromProduct(this.props.products, this.props.islandId, output.ProductID);
            if (!!productState) {
                if (productState.factoryConsumers.some(cons => output.ProductID === cons.productId)) {
                    return true;
                }
            }
        }
        return false;
    }

    createOnHouseChange(level: string): (houses: number) => void {
        return (houses: number) => {
            this.props.onHouseChange(level, houses);
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(IslandComponent);
