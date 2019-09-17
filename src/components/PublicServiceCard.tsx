import * as React from "react";
import {Card, CardContent, createStyles, FormControlLabel, Switch, Theme, WithStyles, withStyles} from "@material-ui/core";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {params} from '../data/params_2019-04-17_full'
import {PublicService} from "../data/assets";
import {disablePublicService, enablePublicService} from "../redux/publicservices/actions";
import {RootState} from "../redux/root-state";

const styles = (theme: Theme) => createStyles({
    card: {
        padding: theme.spacing(1)
    }
});

interface OwnProps extends WithStyles<typeof styles> {
    publicService: PublicService,
    islandId: number,
}

function getEnabledFromState(state: RootState, props: OwnProps) {
    if (!state.publicServices.byIslandId[props.islandId]) {
        return false;
    }
    return state.publicServices.byIslandId[props.islandId].enabledPublicServices.includes(props.publicService.guid);
}

const mapStateToProps = (state: RootState, props: OwnProps) => {
    return {
        enabled: getEnabledFromState(state, props),
    };
};

const mapDispatchToProps = (dispatch: Dispatch, props: OwnProps) => {
    return {
        enableService: () => {
            dispatch(enablePublicService(props.islandId, props.publicService.guid));
        },
        disableService: () => {
            dispatch(disablePublicService(props.islandId, props.publicService.guid));
        }
    };
};
type Props = OwnProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

function getIconData(productId: number) {
    for (let product of params.products) {
        if (product.guid === productId) {
            if (!!product.icon) {
                return product.icon;
            }
            return null;
        }
    }
    return null;
}

class PublicServiceCard extends React.Component<Props> {

    render() {
        const {publicService, enabled} = this.props;
        const iconData = getIconData(publicService.output);
        return (
            <Card>
                <CardContent style={{textAlign: "center"}}>
                    {
                        iconData && <img alt={publicService.name} src={iconData}/>
                    }
                    <FormControlLabel
                        style={{display: "block"}}
                        control={<Switch
                            checked={enabled}
                            onChange={() => this.handleEnabledToggle()}
                            value={publicService.name}
                            color="primary"
                        />}
                        label={publicService.name}
                    />
                </CardContent>
            </Card>);
    }

    private handleEnabledToggle() {
        if (this.props.enabled) {
            this.props.disableService();
        } else {
            this.props.enableService();
        }
    }

}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(PublicServiceCard));