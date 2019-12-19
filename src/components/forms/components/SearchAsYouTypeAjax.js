import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'underscore';
import memoize from 'memoize-one';

import { ajax } from './../../util/';
import { valueTransforms } from './../../util';

import { SearchSelectionMenu } from './SearchSelectionMenu';

export class SearchAsYouTypeAjax extends React.PureComponent {

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
        console.log(`running filterOptions with currTextValue of ${currTextValue}`);
        const regexQuery = SearchAsYouTypeAjax.getRegexQuery(currTextValue, filterMethod);
        return allResults.filter(function(optStr){
            return !!(optStr||"".toLowerCase().match(regexQuery));
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            results : [],
            currentTextValue : props.value || "",
            loading: true, // starts out by loading base RequestURL
            error: null,
        };
        // this.totalCount = 0; // todo: remove post-testing
        // this.processedCount = 0; // todo: remove post-testing
        this.currentRequest = null;
        this.onLoadData = debounce(this.onLoadData.bind(this), 500, false);
        this.constructFetchURL = this.constructFetchURL.bind(this);
        this.onTextInputChange = this.onTextInputChange.bind(this);
        this.onDropdownSelect = this.onDropdownSelect.bind(this);

        this.memoized = {
            filterOptions : memoize(SearchAsYouTypeAjax.filterOptions)
        };
    }

    componentDidMount() {
        // this.totalCount++;
        this.onLoadData();
    }

    onTextInputChange(evt){
        const { onChange, allowCustomValue = false } = this.props;
        const { value = null } = evt.target;
        // this.totalCount++;
        // console.log("this is keypress number: ",  this.totalCount);
        if (allowCustomValue) {
            onChange(value);
        }
        this.setState({ currentTextValue: value });
        this.onLoadData(value);
    }

    constructFetchURL() {
        const { baseRequestURL = "/search/?type=Item", fieldsToRequest = ["@id", "display_title"] } = this.props;
        const { currentTextValue } = this.state;

        const requestHref = (
            `${baseRequestURL}${currentTextValue ? "&q="+encodeURIComponent(currentTextValue) : ""}&limit=100&` +
            fieldsToRequest.map(function(field){
                return "field=" + encodeURIComponent(field);
            }).join('&')
        );

        return requestHref;
    }

    onLoadData() {
        this.setState({ loading: true }, () => {
            if (this.currentRequest) {
                // if there's already a request running, abort it
                this.currentRequest.abort && this.currentRequest.abort();
            }

            const requestInThisScope = this.currentRequest = ajax.load(this.constructFetchURL(), (response) => {
                if (requestInThisScope !== this.currentRequest) {
                    return false; // some other request has been fired; cancel this one
                }
                this.currentRequest = null;

                if (!response || Object.keys(response).length === 0) {
                    this.setState({ loading: false, results: [], error: "Could not get a response from server. Check network and try again." });
                    return;
                }

                this.setState({ loading: false, results: response['@graph'], error: null });
            }, "GET", (response, xhr) => {
                const { '@graph' : graph = [], results = [], error = null } = response;
                const { status, statusText } = xhr;

                this.currentRequest = null;

                if (graph.length === 0) {
                    // handle case in which no results found
                    console.log(response);
                    this.setState({ loading: false, results, error: null });
                } else if (error) {
                    // handle more general errors (should we display the actual error message to users?)
                    console.log("Status code " + status + " encountered. " + statusText);
                    this.setState({ loading: false, results, error: error || "Something went wrong while handling this request." });
                }
            });
        });
    }

    onDropdownSelect(result, evt){
        const { onChange } = this.props;
        onChange(result);
    }

    onClickRetry(evt) {
        evt.preventDefault();
        this.onLoadData();
    }

    render() {
        const {
            filterMethod = "startsWith",
            optionsHeader: propOptionsHeader,
            allowCustomValue,
            ...passProps
        } = this.props;
        const { currentTextValue, results = [], loading, error } = this.state;
        let optionsHeader = propOptionsHeader;

        if (loading && !error) {
            optionsHeader = (
                <div className="text-center py-2">
                    <i className="icon icon-spin icon-circle-notch fas"/>
                </div>
            );
        } else {
            if (results.length === 0 && !error) {
                optionsHeader = (
                    <React.Fragment>
                        <em className="d-block text-center px-4 py-1">
                            { allowCustomValue ? "Adding new entry" : "No results found" }
                        </em>
                        { optionsHeader }
                    </React.Fragment>
                );
            } else if (error) {
                optionsHeader = (
                    <React.Fragment>
                        <em className="d-block text-center px-4 py-1">
                            <i className="fas icon-warning icon" />{ error }
                        </em>
                        { optionsHeader }
                    </React.Fragment>
                );
            }
        }

        return (
            <SearchSelectionMenu {...passProps} {...{ optionsHeader, currentTextValue }}
                options={results}
                onTextInputChange={this.onTextInputChange}
                onDropdownSelect={this.onDropdownSelect}/>
        );
    }
}
SearchAsYouTypeAjax.propTypes = {
    value: PropTypes.any,
    allowCustomValue: PropTypes.bool,
    onChange: PropTypes.func,
    baseRequestURL: function(props, propName, componentName) {
        const regex = "^/search/?type=(.+)?$";
        if (props[propName] && !props[propName].match(regex)) {
            return new Error(`Invalid prop '${propName}' supplied to ${componentName}. Validation failed.`);
        }
    },
    fieldsToRequest: PropTypes.arrayOf(PropTypes.string)
};
SearchAsYouTypeAjax.defaultProps = {
    "optionRenderFunction" : function(result){
        return result.display_title;
    },
    "titleRenderFunction": function(result){
        return result.display_title;
    },
    "fieldsToRequest" : ["display_title"]
};


export function SubmissionViewSearchAsYouTypeAjax(props){ // Another higher-order-component

    function onChange(resultItem){ // Should probably be a method on class, or similar approach so that doesn't get re-instantiated on each render
        return props.onChange(resultItem['@id']);
    }
    //const itemType = "some logic based on SubmissionView props if itemType not already available"
    const baseHref = "/search/?type=Item";// todo: + itemType;

    const optionRenderFunction = ( null
    //optionCustomizationsByType[itemType] &&
    //optionCustomizationsByType[itemType].render
    ) || SearchAsYouTypeAjax.defaultProps.optionRenderFunction;

    const fieldsToRequest = ( null
    //optionCustomizationsByType[itemType] &&
    //optionCustomizationsByType[itemType].fieldsToRequest
    ) || SearchAsYouTypeAjax.defaultProps.fieldsToRequest;

    return (
        <SearchAsYouTypeAjax {...{ onChange, baseHref, optionRenderFunction, fieldsToRequest }}
            value={props.value} titleRenderFunction={submissionViewTitleRenderFunction} />
    );
}

function submissionViewTitleRenderFunction(resultAtID){
    console.log('R3', resultAtID);
    return resultAtID;
}

export const optionCustomizationsByType = {
    "Institution" : {
        "render" : function(result){
            const { display_title: title, "@id" : atID } = result;
            return (
                <div>
                    <h5 className="text-300">{ title }</h5>
                    <h6 className="text-mono text-400">{ atID }</h6>
                </div>
            );
        }
    }
};
