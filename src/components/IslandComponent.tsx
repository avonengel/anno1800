import * as React from "react";
import {Grid, Typography} from "@material-ui/core";
import {connect} from "react-redux";
import {getIslandById} from "../redux/selectors";
import {AppState} from "../redux/store";
import PopulationCard from "./PopulationCard";
import {Dispatch} from "redux";
import {updateHouseCount} from "../redux/islands/actions";
import {POPULATION_LEVELS} from "../data/populations";
import {ALL_FACTORIES, FactoryRaw} from "../data/factories";
import FactoryCard from "./FactoryCard";

interface ReactProps {
    islandId: number;
}

const mapStateToProps = (state: AppState, reactProps: ReactProps) => {
    return {
        island: {...getIslandById(state, reactProps.islandId)},
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
                        <FactoryCard factory={factory}/>
                    </Grid>))}
            </Grid>
        </>;
    }

    private shouldShow(factory: FactoryRaw) {
        // TODO: implement visibility logic
        return true;
    }

    createOnHouseChange(level: string): (houses: number) => void {
        return (houses: number) => {
            this.props.onHouseChange(level, houses);
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(IslandComponent);
