import React from "react";


export default class Header extends React.Component {


    render() {
        return (
            <nav className="navbar navbar-inverse">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#swaggerUrlForm">
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand" href="#">Mockula</a>
                    </div>
                    <div className="collapse navbar-collapse">
                    </div>
                </div>
            </nav>
        );
    }
}