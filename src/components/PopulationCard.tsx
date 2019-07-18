import * as React from "react";
import {
    Card,
    createStyles,
    InputAdornment,
    TextField,
    Theme,
    Typography,
    WithStyles,
    withStyles
} from "@material-ui/core";
import {selectIconByName} from "../data/icons";

interface Props {
    level: string;
    houses: number;
}

const styles = (theme: Theme) => createStyles({
    card: {
        padding: theme.spacing(1)
    }
});

class PopulationCard extends React.Component<Props & WithStyles<typeof styles>> {

    render() {
        const {classes, level, houses} = this.props;
        return (
            <Card className={classes.card}>
                <Typography variant={"caption"} color="textSecondary" gutterBottom>
                    {level}
                </Typography>
                <TextField label={"Number of Houses"} type={"number"} value={houses} InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <img src={selectIconByName('residence')} alt={""} height={"36px"}/>
                        </InputAdornment>
                    ),
                }}/>
                <TextField label={"Number of Workers"} type={"number"} value={this.computeWorkers(houses)}
                           />
            </Card>);
    }

    private computeWorkers(houses: number) {
        return 0;
    }
}

export default withStyles(styles)(PopulationCard);