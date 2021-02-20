import * as React from "react";
import { ICardProps } from "./ICardProps"; 
require("../../assets/applicationStyle.css");
export class Card extends React.Component<ICardProps, {}>{
    public render(): React.ReactElement<ICardProps> {
        return (
            <div className="card shadow mb-4">
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between instructList-header">
                    <h6 className="m-0 font-weight-bold text-primary">{this.props.heading}
                        <div><small>{this.props.subHeading}</small></div>
                    </h6>

                    <div className="dropdown no-arrow">
                        
                        {/* <a className="dropdown-toggle" href="#" role="button">See All</a> */}
                    </div>
                </div>
                <div className="card-body">
                    {this.props.children}
                </div>
            </div>
        );
    }
}