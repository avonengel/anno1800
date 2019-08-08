import * as React from "react";
import {Card, CardContent, CardHeader, createStyles, TextField, Theme, WithStyles, withStyles} from "@material-ui/core";
import {FactoryRaw} from "../data/factories";
import {AppState} from "../redux/store";
import {getFactoryStateById} from "../redux/selectors";
import {Dispatch} from "redux";
import {updateFactoryCount} from "../redux/production/actions";
import {connect} from "react-redux";


const styles = (theme: Theme) => createStyles({
    card: {
        padding: theme.spacing(1)
    }
});

interface ReactProps extends WithStyles<typeof styles> {
    factory: FactoryRaw,
    islandId: number,
}

const mapStateToProps = (state: AppState, reactProps: ReactProps) => {
    return {
        factoryState: {...getFactoryStateById(state, reactProps.islandId, reactProps.factory.ID)},
    };
};

const mapDispatchToProps = (dispatch: Dispatch, props: ReactProps) => {
    return {
        onBuildingCountChange: (count: number) => {
            dispatch(updateFactoryCount(props.islandId, props.factory.ID, count));
        }
    };
};
type Props = ReactProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class FactoryCard extends React.Component<Props> {

    render() {
        const {classes, factoryState} = this.props;
        return (
            <Card>
                <CardHeader title={this.props.factory.Name} titleTypographyProps={{component: 'h4'}}/>
                <CardContent>
                    <table>
                        <tbody>
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
                                    <TextField label={"building count"} type={"number"} inputProps={{min: 0}}
                                               style={{width: "4em"}}
                                               value={factoryState ? factoryState.buildingCount : 0}
                                               onChange={this.onBuildingCountChange.bind(this)}/>
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
                        </tbody>
                    </table>
                </CardContent>
            </Card>);
    }

    private onBuildingCountChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.props.onBuildingCountChange(event.target.valueAsNumber);
    }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(FactoryCard));