import * as React from "react";
import {Card, CardContent, CardHeader, createStyles, TextField, Theme, WithStyles, withStyles} from "@material-ui/core";
import {FactoryRaw} from "../data/factories";


const styles = (theme: Theme) => createStyles({
    card: {
        padding: theme.spacing(1)
    }
});

interface Props extends WithStyles<typeof styles> {
    factory: FactoryRaw;
}

class FactoryCard extends React.Component<Props> {

    render() {
        const {classes} = this.props;
        return (
            <Card>
                <CardHeader title={this.props.factory.Name} titleTypographyProps={{component: 'h4'}}/>
                <CardContent>
                    <table>
                        <tr>
                            <td>
                                Have
                            </td>
                            <td>
                                Need
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <TextField type={"number"} inputProps={{min: 0}} style={{width: "4em"}}/>
                            </td>
                            <td>
                                100%
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <TextField type={"number"} inputProps={{min: 0}} style={{width: "4em"}}/>
                            </td>
                            <td>
                                0
                            </td>
                        </tr>
                    </table>
                </CardContent>
            </Card>);
    }
}

export default withStyles(styles)(FactoryCard);