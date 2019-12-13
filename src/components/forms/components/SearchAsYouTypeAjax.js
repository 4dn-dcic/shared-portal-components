import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'underscore';
import memoize from 'memoize-one';

import { ajax } from '../../util/';
import { valueTransforms } from './../../util';

import { SearchSelectionMenu } from './SearchSelectionMenu';

export class SearchAsYouTypeAjax extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            results : [],
            currentTextValue : props.value || "",
            loading: true, // starts out by loading base RequestURL
        };
        this.totalCount = 0; // todo: remove post-testing
        this.processedCount = 0; // todo: remove post-testing
        this.currentRequest = null;
        this.onLoadData = debounce(this.onLoadData.bind(this), 500, false);
        this.constructFetchURL = this.constructFetchURL.bind(this);
        this.onTextInputChange = this.onTextInputChange.bind(this);
        this.onDropdownSelect = this.onDropdownSelect.bind(this);

        this.memoized = {
            filterOptions : memoize(SearchAsYouTypeAjax.filterOptions)
        };
    }

    static getRegexQuery(value, filterMethod) {
        switch (filterMethod) {
            case "includes":
                return valueTransforms.escapeRegExp(value.toLowerCase());
            case "startsWith":
            default:
                return "^" + valueTransforms.escapeRegExp(value.toLowerCase()) + "(.+)?$";
        }
    }

    static filterOptions(currTextValue, allResults = [], filterMethod = "startsWith"){
        const regexQuery = SearchAsYouTypeAjax.getRegexQuery(currTextValue, filterMethod);
        return allResults.filter(function(optStr){
            return !!(optStr.toLowerCase().match(regexQuery));
        });
    }

    componentDidMount() {
        const { currentTextValue } = this.state;
        this.onLoadData("");
    }

    constructFetchURL() {
        const { baseRequestURL = "/search/?type=Item" } = this.props;
        const { currentTextValue } = this.state;

        const startQuery = currentTextValue ? `&q=${currentTextValue}` : '';

        return `${baseRequestURL}${startQuery}&field=display_title&field=@id&limit=100`;
    }

    onLoadData(query) {
        this.processedCount++;
        console.log("processing this query: ", query);
        console.log("processed only ", this.processedCount, " out of " , this.totalCount, " requests so far");
        this.setState({ loading: true }, () => {
            if (this.currentRequest) {
                this.currentRequest.abort && this.currentRequest.abort();
            }
            const requestInThisScope = this.currentRequest = ajax.load(this.constructFetchURL(), (response) => {
                if (requestInThisScope !== this.currentRequest) {
                    return false; // some other request has been fired and is now set to theis request; cancel it
                }
                this.currentRequest = null;
                console.log("this is the response: ", response);
                
                this.setState({ loading: false, results: response['@graph'] });
            });
        });
    }

    onTextInputChange(evt){
        const { onChange, allowCustomValue = false } = this.props;
        const { value = null } = evt.target;
        console.log("this is keypress number: ",  this.totalCount);
        if (allowCustomValue) {
            onChange(value);
            this.onLoadData(value);
        }
        this.setState({ currentTextValue: value });
    }

    onDropdownSelect(eventKey, evt){
        const { onChange } = this.props;
        onChange(eventKey);
    }

    render() {
        const {
            filterMethod = "startsWith",
            optionsHeader: propOptionsHeader,

            ...passProps
        } = this.props;
        const { currentTextValue, results, loading } = this.state;
        let filteredOptions;
        let optionsHeader = propOptionsHeader;

        const renderArr = [];
        results.forEach((obj) => renderArr.push(obj.display_title));

        if (loading) { 
            filteredOptions = [];
            optionsHeader = (
                <div className="text-center py-2">
                    <i className="icon icon-spin icon-circle-notch fas"/>
                </div>
            );
        } else {
            filteredOptions = this.memoized.filterOptions(currentTextValue, renderArr, filterMethod);
            if (filteredOptions.length === 0) {
                optionsHeader = (
                    <React.Fragment>
                        <em className="d-block text-center px-4 py-1">Adding new entry</em>
                        { optionsHeader }
                    </React.Fragment>
                );
            }
        }

        return (
            // <button onClick={this.onClick}>Test Me</button>
            // <SearchSelectionMenu
            //     onTextInputChange={this.onTextInputChange}
            //     onDropdownSelect={this.onDropdownSelect}
            //     options={renderArr}
            // />
            <SearchSelectionMenu {...passProps} {...{ optionsHeader, currentTextValue }}
                options={filteredOptions}
                onTextInputChange={this.onTextInputChange}
                onDropdownSelect={this.onDropdownSelect}/>
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