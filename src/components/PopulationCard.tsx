import * as React from "react";
import {Card, createStyles, Grid, TextField, Theme, Typography, WithStyles, withStyles} from "@material-ui/core";
import {selectIconByName} from "../data/icons";

interface Props {
    level: string;
    houses: number;
    population: number;
    onHouseChange: (houses: number) => void
    onPopulationChange: (population: number) => void
}

const styles = (theme: Theme) => createStyles({
    card: {
        padding: theme.spacing(1)
    }
});

class PopulationCard extends React.Component<Props & WithStyles<typeof styles>> {

    render() {
        const {classes, level, houses, population} = this.props;
        return (
            <Card className={classes.card}>
                <Typography variant={"caption"} color="textSecondary" gutterBottom>
                    {level}
                </Typography>
                <Grid container spacing={1} alignItems={"flex-end"} direction={"row"} wrap={"nowrap"}>
                    <Grid item>
                        <img src={selectIconByName('residence')} alt={""} height={"36px"}/>
                    </Grid>
                    <Grid item>
                        <TextField label={"Houses"} type={"number"} value={houses}
                                   inputProps={{min: 0}}
                                   onChange={this.onHouseChange.bind(this)}/>
                    </Grid>
                </Grid>
                <Grid container spacing={1} alignItems={"flex-end"} direction={"row"} wrap={"nowrap"}>
                    <Grid item>
                        <img src={selectIconByName('population')} alt={""} height={"36px"}/>
                    </Grid>
                    <Grid item>
                        <TextField label={"Workforce"} type={"number"} value={population}
                                   inputProps={{min: 0}}
                                   onChange={this.onPopulationChange.bind(this)}/>
                    </Grid>
                </Grid>
            </Card>);
    }

    private onHouseChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.props.onHouseChange(event.target.valueAsNumber);
    }

    private onPopulationChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.props.onPopulationChange(event.target.valueAsNumber);
    }
}

export default withStyles(styles)(PopulationCard);