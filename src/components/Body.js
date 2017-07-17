import React from "react";
import { createStore, combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { Provider } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import Liform from 'liform-react';
import "isomorphic-fetch";
import * as SwaggerParser from 'swagger-parser/dist/swagger-parser';

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
        this.loadForms = this.loadForms.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            title: 'Uber API',
            requestURL: 'https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v2.0/json/uber.json',
            forms: null
        };
    }

    componentDidMount() {
        const self = this;
        this.loadForms(this.state.requestURL);
    };

    loadForms(requestURL) {
        const self = this;
        const request = new Request(requestURL, {});
        fetch(request)
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                SwaggerParser.dereference(json)
                    .then(function (result) {
                        var forms = [];
                        var pathIdx = 0;
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
                            forms: forms
                        });;
                    });
            });
    };

    handleChange(event) {
        this.setState({ requestURL: event.target.value });
    }

    handleSubmit(event) {
        // alert('A new URL was submitted: ' + this.state.requestURL);
        this.loadForms(this.state.requestURL);
        event.preventDefault();
    }


    render() {
        return (
            <div>
                {
                    this.state && this.state.forms &&
                    <div>
                        <h1>{this.state.title}</h1>
                        <form onSubmit={this.handleSubmit} >
                            <div className="form-group">
                                <label for="swaggerUrl">Swagger URL</label>
                                <input type="text" className="form-control" id="swaggerUrl" ref="swaggerUrl" placeholder="Swagger URL" value={this.state.requestURL} onChange={this.handleChange} />
                            </div>
                            <button type="submit" className="btn btn-success">Load</button>
                        </form >
                        {this.state.forms}
                    </div>
                }
            </div>
        );

    }
}