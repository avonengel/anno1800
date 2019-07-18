import * as React from "react";
import {Grid, Typography} from "@material-ui/core";
import {connect} from "react-redux";
import {getIslandById} from "../redux/selectors";
import {Island, PopulationLevels} from "../redux/islands/types";
import {State} from "../redux/store";
import PopulationCard from "./PopulationCard";

interface ReactProps {
    islandId: number;
}

interface StateProps {
    island: Island;
}

class IslandComponent extends React.Component<StateProps & ReactProps> {

    render() {
        const {island} = this.props;
        const populationCards = PopulationLevels.map((level) =>
            <PopulationCard key={level} level={level} houses={island.population[level]}/>);
        return <>
            <Typography variant="h3">{island.name}</Typography>
            <Grid container spacing={1}>
                {populationCards.map((card) =>
                    (<Grid item xs={6} sm={2} key={card.props.level}>
                    {card}
                </Grid>))}
            </Grid>
        </>;
    }
}

const mapStateToProps = (state: State, reactProps: ReactProps) => {
    return {
        island: {...getIslandById(state, reactProps.islandId)},
    };
};

export default connect(mapStateToProps)(IslandComponent);
