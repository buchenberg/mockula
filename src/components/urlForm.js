import React from 'react';
import { Field, reduxForm } from 'redux-form';


const UrlForm = props => {
    const { handleSubmit, pristine, reset, submitting } = props;
    return (
        <form className="nav navbar-form navbar-right" onSubmit={handleSubmit}>
            <div className="form-group">
                <Field
                    className="form-control"
                    name="swaggerUrl"
                    component="input"
                    type="text"
                    placeholder="Swagger URL"
                />
            </div>
            {/* <div className="form-group">
                <input type="text" className="form-control" placeholder="Swagger URL"></input>
            </div> */}
            <button type="submit" className="btn btn-default">Load</button>
        </form>
    );
};

export default reduxForm({
    form: 'simple', // a unique identifier for this form
})(UrlForm);
