import React from "react";


export default class Modal extends React.Component {


    render() {
        return (
            <div className="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title" id="myModalLabel">Load Swagger</h4>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="form-group">
                                    <input type="text" className="form-control" id="swaggerUrl" placeholder="Swagger URL">
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                                <button type="submit" className="btn btn-default">Submit</button>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}