import React from "react";
import { createStore, combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { Provider } from 'react-redux';
import Liform from 'liform-react';
import "isomorphic-fetch";
import * as SwaggerParser from 'swagger-parser/dist/swagger-parser';
import * as FileDownload from 'react-file-download';

const reducer = combineReducers({
    form: formReducer
})

const store = (window.devToolsExtension ? window.devToolsExtension()(createStore) : createStore)(reducer)

const showResults = values => {
    window.alert(`You submitted:\n\n${JSON.stringify(values, null, 2)}`)
}

export default class Body extends React.Component {

    constructor(props) {
        super(props);
        this.cachedSwagger = localStorage.getItem('swagger');
        this.cachedSwaggerUrl = localStorage.getItem('swaggerUrl');
        this.loadForms = this.loadForms.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.fileDownload = this.fileDownload.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            requestURL: 'https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v2.0/json/uber.json',
            loadable: true,
            downloadable: false,
            forms: null
        };
    }

    componentDidMount() {
        const self = this;
        // this.loadForms(this.state.requestURL);
    };

    loadForms(requestURL) {
        const self = this;
        const request = new Request(requestURL, {});
        localStorage.setItem('swaggerUrl', requestURL);
        fetch(request)
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                SwaggerParser.dereference(json)
                    .then(function (result) {
                        var forms = [];
                        var pathIdx = 0;
                        localStorage.setItem('swagger', JSON.stringify(result));
                        Object.keys(result.paths).forEach(function (pathKey) {
                            pathIdx++;
                            var path = result.paths[pathKey]
                            var opIdx = 0;
                            forms.push(
                                <h3>{pathKey}</h3>
                            )
                            Object.keys(path).forEach(function (opKey) {
                                opIdx++;
                                var responses = path[opKey].responses
                                var respIdx = 0;
                                forms.push(
                                    <h4>{opKey}</h4>
                                )
                                Object.keys(responses).forEach(function (responseKey) {
                                    respIdx++;
                                    var key = `${pathIdx}-${opIdx}-${respIdx}`
                                    var response = responses[responseKey];
                                    if (response.schema) {
                                        var headingKey = `heading-${key}`
                                        var panelKey = `panel-${key}`
                                        forms.push(
                                            <div>
                                                <div className="panel panel-default" id={panelKey}>
                                                    <div className="panel-heading" role="tab" id={headingKey}>
                                                        <h4 className="panel-title">
                                                            {responseKey}
                                                            <a className="pull-right" role="button" data-toggle="collapse" data-parent={'#' + panelKey} href={'#collapse-' + panelKey} aria-expanded="true" aria-controls={'collapse-' + panelKey}>
                                                                <span className="glyphicon glyphicon-edit" aria-hidden="true"></span>
                                                            </a>
                                                        </h4>
                                                    </div>
                                                    <div id={'collapse-' + panelKey} className="panel-collapse collapse" role="tabpanel" aria-labelledby={headingKey}>
                                                        <div className="panel-body">
                                                            <Provider store={store} id={'provider-' + key}>
                                                                <Liform schema={response.schema} onSubmit={showResults} formKey={'form-' + key} />
                                                            </Provider>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                });
                            });
                        });
                        self.setState({
                            downloadable: true,
                            loadable: false,
                            forms: forms
                        });;
                    });
            });
    };

    handleChange(event) {
        this.setState({
            loadable: true,
            downloadable: false,
            requestURL: event.target.value
        });
    }

    fileDownload(event) {
        const swaggerDownload = JSON.stringify(
            JSON.parse(
                localStorage.getItem('swagger')
            ),
            null,
            2
        )
        window.open(swaggerDownload);
        // FileDownload(swaggerDownload, 'swagger.json')
    }

    handleSubmit(event) {
        const cachedSwgger = localStorage.getItem('swagger');
        this.loadForms(this.state.requestURL);
        event.preventDefault();
    }

    render() {
        return (
            <div className="col-lg-10">
                <div className="input-group">
                    <input type="text" className="form-control" id="swaggerUrl" ref="swaggerUrl" value={this.state.requestURL} onChange={this.handleChange} placeholder="Swagger URL" />
                    <div className="input-group-btn">
                        <button className={
                            this.state.loadable ? 'btn btn-success active' : 'btn btn-danger disabled'
                        } type="button" onClick={this.handleSubmit}>Load</button>
                        <button className={
                            this.state.downloadable ? 'btn btn-success active' : 'btn btn-danger disabled'
                        } type="button" onClick={this.fileDownload}><span className="glyphicon glyphicon-download" /> Download Swagger</button>
                    </div>
                </div>

                {
                    this.state && this.state.forms &&
                    <div>
                        {this.state.forms}
                    </div>
                }
            </div>
        );

    }
}