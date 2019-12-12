import React from 'react';
import PropTypes from 'prop-types';
import { debounce as _debounce } from 'underscore';

import { ajax } from '../../util/';

// import { SearchSelectionMenu } from './SearchSelectionMenu';

export class SearchAsYouTypeAjax extends React.PureComponent {
    constructor() {
        super(props);
        this.state = {
            results : [],
            currentTextValue : props.value || "",
            loading: true, // starts out by loading base RequestURL
        };

        this.currentRequest = null;
        this.onLoadData = _debounce(this.onLoadData.bind(this), 500);
        this.constructFetchURL = this.constructFetchURL.bind(this);
    }

    constructFetchURL() {
        const { baseRequestURL = "/search/?type=Item" } = this.props;
        const { currentTextValue } = this.state;

        const startQuery = currentTextValue ? `&q=${currentTextValue}` : '';

        return `${baseRequestURL} + ${startQuery} + &field=display_title&field=@id&limit=100`;
    }

    componentDidMount() {
        // send a http request for all items (limit 100), update state with results
        this.onLoadData();
    }

    async onLoadData() {
        this.setState({ loading: true }, () => {
            if (this.currentRequest) {
                this.currentRequest.abort && this.currentRequest.abort();
            }
            const requestInThisScope = this.currentRequest = ajax.load(this.constructFetchURL(), (response) => {
                if (requestInThisScope !== this.currentRequest) {
                    return false; // some other request has been fired and is now set to theis request; cancel it
                }
                this.currentRequest = null;
                this.setState({ loading: false, results: response['@graph'] });
            });
        });
    }

    onTextInputChange(evt){
        const { onChange, allowCustomValue = false } = this.props;
        const { value = null } = evt.target;
        if (allowCustomValue) {
            onChange(value);
            this.onLoadData();
        }
        this.setState({ currentTextValue: value });
    }

    render() {
        return (
            <h1>I am temporary</h1>
            // <SearchSelectionMenu options={filteredOptions}
            //     onTextInputChange={this.onTextInputChange}
            //     onDropdownSelect={this.onDropdownSelect} />
        );
    }
}
SearchAsYouTypeAjax.propTypes = {
    value: PropTypes.string,
    allowCustomValue: PropTypes.bool,
    onChange: PropTypes.func,
    baseRequestURL: function(props, propName, componentName) {
        console.log("attempting to validate baseRequestURL");
        console.log("props: ", props);
        console.log("propName: ", propName);
        const regex = "^/search/?type=(.+)?$";
        if (props[propName] && !props[propName].match(regex)) {
            console.log(props[propName] + " did not validate");
            return new Error(`Invalid prop '${propName}' supplied to ${componentName}. Validation failed.`);
        }
    }
};