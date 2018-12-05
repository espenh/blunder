import { faChessBoard, faTrophy, faRobot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from "react";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";

export class SideBar extends React.Component {
    public render() {
        const battleLink = (props: any) => <Link to="/battle" {...props} />;
        const vsBotLink = (props: any) => <Link to="/playbot" {...props} />;
        const playgroundLink = (props: any) => <Link to="/" {...props} />;

        return <>
            <div className="sidebar-buttons">
                <Button component={playgroundLink}><FontAwesomeIcon icon={faChessBoard} /></Button>;
                <Button component={vsBotLink}><FontAwesomeIcon icon={faRobot} /></Button>
                <Button component={battleLink}><FontAwesomeIcon icon={faTrophy} /></Button>
            </div>
            <div className="sidebar-header">
                <span>Blunder</span>
            </div>
        </>;
    }
}
