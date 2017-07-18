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

export default class Body extends React.Component {

    constructor(props) {
        super(props);
        this.cachedSwagger = localStorage.getItem('swagger');
        this.cachedSwaggerUrl = localStorage.getItem('swaggerUrl');
        this.loadForms = this.loadForms.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleFileDownload = this.handleFileDownload.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleLoadSwagger = this.handleLoadSwagger.bind(this);
        this.state = {
            requestURL: 'https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v2.0/json/uber.json',
            swagger: {},
            loadable: true,
            downloadable: false,
            forms: null
        };
    }

    componentDidMount() {
        const self = this;
    };

    handleSubmit(values, dispatch, props) {
        var pathArray = props.formKey.split('|');
        this.state.swagger.paths[`${pathArray[0]}`][`${pathArray[1]}`][`${pathArray[2]}`][`${pathArray[3]}`]['schema']['example'] = values;
        localStorage.setItem('swagger', JSON.stringify(this.state.swagger, null, 2));
    }

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
                        var forms = [
                            
                        ];
                        self.setState({
                            downloadable: true
                        });
                        
                        forms.push(
                            <h1>{result.info.title}</h1>
                        )
                        forms.push(
                            <button className={
                            self.state.downloadable ? 'btn btn-default pull-right' : 'fade hidden'
                        } type="button" onClick={self.handleFileDownload}><span className="glyphicon glyphicon-download" /> Download Swagger</button>
                        )
                        var pathIdx = 0;
                        self.state.swagger = result;
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
                                    var jsonPath = `${pathKey}.${opKey}.${respIdx}`
                                    var key = `${pathIdx}-${opIdx}-${respIdx}`
                                    var response = responses[responseKey];
                                    var jsonPath = `${pathKey}|${opKey}|responses|${responseKey}`
                                    if (response.schema) {
                                        var headingKey = `heading-${key}`
                                        var panelKey = `panel-${key}`
                                        forms.push(
                                            <div>
                                                <div className="panel panel-default" key={panelKey}>
                                                    <div className="panel-heading" role="tab" key={headingKey}>
                                                        <h4 className="panel-title">
                                                            {responseKey}
                                                            <a className="pull-right" role="button" data-toggle="collapse" data-parent={'#' + panelKey} href={'#collapse-' + panelKey} aria-expanded="true" aria-controls={'collapse-' + panelKey}>
                                                                <span className="glyphicon glyphicon-edit" aria-hidden="true"></span>
                                                            </a>
                                                        </h4>
                                                    </div>
                                                    <div key={'collapse-' + panelKey} className="panel-collapse collapse" role="tabpanel" aria-labelledby={headingKey}>
                                                        <div className="panel-body">  
                                                            <Provider store={store} key={'provider-' + key}>
                                                                <Liform schema={response.schema} onSubmit={self.handleSubmit} formKey={jsonPath} />
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
                            loadable: false,
                            forms: forms
                        });
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

    handleFileDownload(event) {
        const swaggerDownload = JSON.stringify(
            JSON.parse(
                localStorage.getItem('swagger')
            ),
            null,
            2
        )
        FileDownload(swaggerDownload, 'swagger.json')
    }

    handleLoadSwagger(event) {
        this.loadForms(this.state.requestURL);
        event.preventDefault();
    }

    render() {
        return (
            <div className="col-lg-10">
                <button className="btn btn-default" type="button" data-toggle="modal" data-target="#myModal">Launch modal</button>
                <div className="input-group">
                    <input type="text" className="form-control" id="swaggerUrl" ref="swaggerUrl" value={this.state.requestURL} onChange={this.handleChange} placeholder="Swagger URL" />
                    <div className="input-group-btn">
                        <button className="btn btn-default" type="button" onClick={this.handleLoadSwagger}><span className="glyphicon glyphicon-upload" />{
                            this.state.loadable ? ' Load Swagger' : ' Reload Swagger'
                        }</button>
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