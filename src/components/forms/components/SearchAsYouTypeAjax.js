import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'underscore';
import memoize from 'memoize-one';
import ReactTooltip from 'react-tooltip';

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
        this.hasBeenOpened = false;
        this.onLoadData = debounce(this.onLoadData.bind(this), 500, false);
        this.constructFetchURL = this.constructFetchURL.bind(this);
        this.onTextInputChange = this.onTextInputChange.bind(this);
        this.onDropdownSelect = this.onDropdownSelect.bind(this);
        this.onToggleOpen = this.onToggleOpen.bind(this);

        this.memoized = {
            filterOptions : memoize(SearchAsYouTypeAjax.filterOptions)
        };
    }

    componentDidUpdate(pastProps, pastState){
        // this.totalCount++;
        const { results: pastResults } = pastState;
        const { results } = this.state;
        if (results !== pastResults) {
            ReactTooltip.rebuild();
        }
    }

    onToggleOpen(isOpen){
        // On first open only, start a load
        if (!isOpen) return false;
        if (this.hasBeenOpened) return false;
        this.onLoadData();
        this.hasBeenOpened = true;
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
        const { baseHref = SearchAsYouTypeAjax.defaultProps.baseHref, fieldsToRequest = [] } = this.props;
        const { currentTextValue } = this.state;

        const commonFields = SearchAsYouTypeAjax.defaultProps.fieldsToRequest;

        const requestHref = (
            `${baseHref}${currentTextValue ? "&q=" + encodeURIComponent(currentTextValue) : ""}&limit=100&` +
            commonFields.concat(fieldsToRequest).map(function(field){
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
                            <i className="fas icon-warning icon" /> { error }
                        </em>
                        { optionsHeader }
                    </React.Fragment>
                );
            }
        }

        return (
            <SearchSelectionMenu {...passProps} {...{ optionsHeader, currentTextValue }}
                options={results}
                onToggleOpen={this.onToggleOpen}
                onTextInputChange={this.onTextInputChange}
                onDropdownSelect={this.onDropdownSelect}/>
        );
    }
}
SearchAsYouTypeAjax.propTypes = {
    value: PropTypes.any,
    allowCustomValue: PropTypes.bool,
    onChange: PropTypes.func,
    baseHref: function(props, propName, componentName) {
        const regex = "^/search/?type=(.+)?$";
        if (props[propName] && !props[propName].match(regex)) {
            return new Error(`Invalid prop '${propName}' supplied to ${componentName}. Validation failed.`);
        }
    },
    fieldsToRequest: PropTypes.arrayOf(PropTypes.string)
};
SearchAsYouTypeAjax.defaultProps = {
    "optionRenderFunction" : function(result){
        const { display_title: title, "@id" : atID, description } = result;
        return (
            <div data-tip={description} key={atID}>
                <h5 className="text-300">{ title }</h5>
                <h6 className="text-mono text-400">{ atID }</h6>
            </div>
        );
    },
    "titleRenderFunction": function(result){
        return result.display_title;
    },
    "baseHref" : "/search/?type=Item",
    "fieldsToRequest" : ["@id", "display_title", "description"] // additional fields aside from @id, display_title, and description; all already included
};


export function SubmissionViewSearchAsYouTypeAjax(props){ // Another higher-order-component
    const { onChange : onChangeProp, value, itemTypeProp } = props;
    function onChange(resultItem){ // Should probably be a method on class, or similar approach so that doesn't get re-instantiated on each render
        return onChangeProp(resultItem['@id']);
    }
    const itemType = itemType || itemTypeProp || "Item"; // "some logic based on SubmissionView props if itemType not already available"
    const baseHref = "/search/?type=" + itemType;

    const optionRenderFunction = (
        optionCustomizationsByType[itemType] && optionCustomizationsByType[itemType].render ? optionCustomizationsByType[itemType].render : null
    ) || SearchAsYouTypeAjax.defaultProps.optionRenderFunction;

    const fieldsToRequest = (
        optionCustomizationsByType[itemType] && optionCustomizationsByType[itemType].fieldsToRequest ? optionCustomizationsByType[itemType].fieldsToRequest : null
    ) || SearchAsYouTypeAjax.defaultProps.fieldsToRequest;

    return (
        <SearchAsYouTypeAjax {...{ value, onChange, baseHref, optionRenderFunction, fieldsToRequest }}
            titleRenderFunction={submissionViewTitleRenderFunction} />
    );
}

function submissionViewTitleRenderFunction(resultAtID){
    return resultAtID;
}

function sexToIcon(sex, showTip) {
    sex = sex.toLowerCase();
    if (sex && typeof sex === "string"){
        if (sex === "f"){
            sex = <i className="icon icon-fw icon-venus fas" data-tip={showTip ? "Sex: Female" : ""} />;
        } else if (sex === "m"){
            sex = <i className="icon icon-fw icon-mars fas" data-tip={showTip ? "Sex: Male" : ""} />;
        } else if (sex === "u"){
            sex = <i className="icon icon-fw icon-genderless fas" data-tip={showTip ? "Sex: Unknown" : ""} />;
        } else {
            sex = <i className="icon icon-fw icon-question fas" data-tip={showTip ? "Sex: N/A" : ""} />;
        }
    }
    return sex;
}

export const optionCustomizationsByType = {
    "Institution" : {
        "render" : function(result){
            const { display_title: title, "@id" : atID, description } = result;
            return (
                <div data-tip={description} key={atID}>
                    <h5 className="text-300">{ title }</h5>
                    <h6 className="text-mono text-400">{ atID }</h6>
                </div>
            );
        },
        "fieldsToRequest" : []
    },
    "Individual" : {
        "render" : function(result) {
            const { display_title: title, "@id" : atID, description,
                sex = null, age = null, aliases = [] } = result;
            return ( // need to better align right col, and adjust relative widths
                <div data-tip={description} key={atID} className="d-flex">
                    <div className="col">
                        <h5 className="text-300">{ title }</h5>
                        <h6 className="text-mono text-400">{ aliases }</h6>
                    </div>
                    <div className="col">
                        <h5 className="text-300">Age: { age || "N/A"}</h5>
                        <h6 className="text-mono text-400"> Sex: { sexToIcon(sex, false) } </h6>
                    </div>
                </div>
            );
        },
        "fieldsToRequest" : ['sex', 'age', 'aliases', 'description']
    },
    "Cohort" : {
        "render" : function(result) {
            const { display_title: title, "@id" : atID, description, accession } = result;
            return (
                <div data-tip={description} key={atID}>
                    <h5 className="text-300">{ title }</h5>
                    <h6 className="text-mono text-400">{ accession }</h6>
                </div>
            );
        },
        "fieldsToRequest" : ['accession', 'status', 'date_created']
    },
    "User" : {
        "render" : function(result) {
            const { display_title: title, "@id" : atID, description,
                email, role, first_name, last_name } = result;
            return (
                <div data-tip={description} key={atID}>
                    <h5 className="text-300 w-100">{ title } ({ first_name } { last_name })</h5>
                    <h6 className="text-mono text-400">{ email }</h6>
                </div>
            );
        },
        "fieldsToRequest" : ['email', 'role', 'first_name', 'last_name', 'submits_for']
    },
    "Document" : {
        "render" : function(result) {
            const { display_title: title, "@id" : atID, description,
                status, date_created, submitted_by } = result;
            return (
                <div data-tip={description} key={atID}>
                    <h5 className="text-300">{ title }</h5>
                    <h6 className="text-mono text-400">{ atID }</h6>
                </div>
            );
        },
        "fieldsToRequest" : ['status', 'description', 'date_created', 'submitted_by']
    },
    "Project" : {
        "render" : function(result) {
            const { display_title: title, "@id" : atID, description,
                status, date_created, submitted_by } = result;
            return (
                <div data-tip={description} key={atID}>
                    <h5 className="text-300">{ title }</h5>
                    <h6 className="text-mono text-400">{ atID }</h6>
                    <h7 className="text-mono text-400">{ submitted_by.display_title }</h7>
                </div>
            );
        },
        "fieldsToRequest" : ['status', 'description', 'date_created', 'submitted_by']
    },
    // "Disorder" : { // todo: currently not in use on cgap
    //     "render" : function(result){
    //         const { display_title: title, "@id" : atID, description } = result;
    //         return (
    //             <div data-tip={description} key={atID}>
    //                 <h5 className="text-300">{ title }</h5>
    //                 <h6 className="text-mono text-400">{ atID }</h6>
    //             </div>
    //         );
    //     },
    //     "fieldsToRequest" : []
    // },
    "Phenotype" : {
        "render" : function(result){
            const { display_title: title, "@id" : atID, description, hpo_id } = result;
            return (
                <div data-tip={description} key={atID}>
                    <h5 className="text-300">{ title }</h5>
                    <h6 className="text-mono text-400">{ hpo_id }</h6>
                </div>
            );
        },
        "fieldsToRequest" : ["hpo_id"]
    }
};
