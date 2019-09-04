import React from 'react';
import {connect} from "react-redux";
import {RootState} from "../redux/store";
import IconButton from "@material-ui/core/IconButton";
import {GetApp} from "@material-ui/icons"

const mapStateToProps = (state: RootState) => ({
    state: state,
});

type Props = ReturnType<typeof mapStateToProps>;

class App extends React.Component<Props> {

    handleDownloadState() {
        // @ts-ignore _persist does not exist on RootState, but is injected by redux-persist into the state
        const {_persist: _, ...exported} = this.props.state;
        const data = new Blob([JSON.stringify(exported)], {type: 'text/json'});
        const objectURL = window.URL.createObjectURL(data);
        // createElement seems hacky, but works..
        const tempLink = document.createElement('a');
        tempLink.href = objectURL;
        tempLink.setAttribute('download', 'anno1800.json');
        tempLink.click();
    }

    render() {
        return (
            <React.Fragment>
                <IconButton
                    color="inherit"
                    aria-label="Download State"
                    onClick={this.handleDownloadState.bind(this)}
                    edge="end">
                    <GetApp/>
                </IconButton>
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps)(App);
