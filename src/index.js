import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import UrlForm from './urlForm';
import registerServiceWorker from './registerServiceWorker';
import { createStore, combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { Provider } from 'react-redux';
import Liform from 'liform-react';
import "isomorphic-fetch";
import * as SwaggerParser from 'swagger-parser/dist/swagger-parser';



const reducer = combineReducers({
    form: formReducer
})

var requestURL = 'http://petstore.swagger.io/v2/swagger.json';

var request = new Request(requestURL, {});


const store = (window.devToolsExtension ? window.devToolsExtension()(createStore) : createStore)(reducer)

const showResults = values => {
     window.alert(`You submitted:\n\n${JSON.stringify(values, null, 2)}`)
}

const someShit = values => {
   window.alert(`You submitted:\n\nsome shit`)
}

const dest = document.getElementById('root');
const urlFormDiv = document.getElementById('swaggerUrlForm');


ReactDOM.render(
  <Provider store={store}>
      <UrlForm onSubmit={showResults}/>
  </Provider>,
  urlFormDiv
);

const getSwagger = function () {
    fetch(request)
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            console.log(json);
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
                    ReactDOM.render(
                        <div>{forms}</div>,
                        dest
                    )
                });
        });

}

getSwagger()


registerServiceWorker();
