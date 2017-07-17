import React from "react";

import Footer from "./Footer";
import Header from "./Header";
import Body from "./Body";

export default class Layout extends React.Component {

    render() {
        return (
            <div>
                <Header />
                <div className="container-fluid text-center">
                    <div className="row content">
                        <div className="col-md-12 text-left">
                                <Body />
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        );
    }
}