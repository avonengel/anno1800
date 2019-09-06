import * as React from "react";
import {Avatar, Card, CardContent, CardHeader, createStyles, FormControlLabel, Switch, Theme, WithStyles, withStyles} from "@material-ui/core";
import {RootState} from "../redux/store";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {params} from '../data/params_2019-04-17_full'
import {PublicService} from "../data/assets";

const styles = (theme: Theme) => createStyles({
    card: {
        padding: theme.spacing(1)
    }
});

interface OwnProps extends WithStyles<typeof styles> {
    publicService: PublicService,
    islandId: number,
}

const mapStateToProps = (state: RootState, reactProps: OwnProps) => {
    return {
        // factoryState: getFactoryStateById(state, reactProps.islandId, reactProps.factory.guid),
        // outputProductState
    };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
    return {
        // onBuildingCountChange: (count: number) => {
        //     dispatch(updateFactoryCount(props.islandId, props.factory.guid, count));
        // },
        // onProductivityChange: (productivity: number) => {
        //     dispatch(updateFactoryProductivity(props.islandId, props.factory.guid, productivity));
        // }
    };
};
type Props = OwnProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

function getIconData(name: string) {
    for (let factory of params.factories) {
        if (factory.name === name) {
            if (!!factory.icon) {
                return factory.icon;
            }
            return null;
        }
    }
    return null;
}

class PublicServiceCard extends React.Component<Props> {

    render() {
        // const {factoryState, outputProductState} = this.props;
        const iconData = getIconData(this.props.publicService.name);
        return (
            <Card>
                <CardHeader
                    avatar={
                        iconData && <Avatar alt={this.props.publicService.name} src={iconData} />
                    }
                    title={this.props.publicService.name}
                    // titleTypographyProps={{component: 'h6', variant: 'h6'}}
                />
                <CardContent>
                    <FormControlLabel
                        control={
                            <Switch
                                // checked={state.checkedB}
                                onChange={() => this.handleEnabledToggle()}
                                value="checkedB"
                                color="primary"
                            />
                        }
                        label="Enable"
                    />
                </CardContent>
            </Card>);
    }

    private handleEnabledToggle() {

    }

}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(PublicServiceCard));