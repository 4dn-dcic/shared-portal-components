import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { _ } from 'underscore';
import ReactTooltip from 'react-tooltip';

import { Fade } from './../../ui/Fade';

import { ajax, object } from './../../util/';

import { Alerts } from './../../ui/Alerts';

import { LinkToSelector } from './LinkToSelector';
import { SearchSelectionMenu } from './SearchSelectionMenu';

export class SearchAsYouTypeAjax extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            results : [],
            currentTextValue : props.value || "",
            loading: true, // starts out by loading base RequestURL
            error: null,
        };
        this.currentRequest = null;
        this.hasBeenOpened = false;
        this.onLoadData = _.debounce(this.onLoadData.bind(this), 500, false);
        this.constructFetchURL = this.constructFetchURL.bind(this);
        this.onTextInputChange = this.onTextInputChange.bind(this);
        this.onDropdownSelect = this.onDropdownSelect.bind(this);
        this.onToggleOpen = this.onToggleOpen.bind(this);
    }

    componentDidUpdate(pastProps, pastState){
        const { value: pastSelectedID } = pastProps;
        const { value: selectedID } = this.props;
        const { results: pastResults } = pastState;
        const { results } = this.state;
        if (results !== pastResults) {
            ReactTooltip.rebuild();
        }

        if (pastSelectedID !== selectedID){
            this.setState({ currentTextValue : selectedID || "" });
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
        const { value = null } = evt.target;
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
                    console.error("Status code " + status + " encountered. " + statusText);
                    this.setState({ loading: false, results, error: error || "Something went wrong while handling this request." });
                }
            });
        });
    }

    onDropdownSelect(result, evt){
        const { onChange, value, titleRenderFunction } = this.props;
        const { currentTextValue } = this.state;
        if (!titleRenderFunction(currentTextValue)) {
            console.log("title hasn't been registered");
            // if title hasn't been registered, use the old value
            onChange(result, value);
        } else {
            console.log("calling onDropdownSelect", result);
            onChange(result, result['@id']);
        }
    }

    onClickRetry(evt) {
        evt.preventDefault();
        this.onLoadData();
    }

    render() {
        const {
            optionsHeader: propOptionsHeader,
            value,
            keyComplete = {},
            ...leftoverProps
        } = this.props;
        const { currentTextValue, results = [], loading, error } = this.state;
        let optionsHeader = propOptionsHeader;

        const passProps = { ...leftoverProps, keyComplete, value };
        if (loading && !error) {
            optionsHeader = (
                <div className="text-center py-3">
                    <i className="icon icon-spin icon-circle-notch fas"/>
                </div>
            );
        } else {
            if (results.length === 0 && !error) {
                optionsHeader = (
                    <React.Fragment>
                        <em className="d-block text-center px-4 py-3">
                            { "No results found" }
                        </em>
                        { optionsHeader }
                    </React.Fragment>
                );
            } else if (error) {
                optionsHeader = (
                    <React.Fragment>
                        <em className="d-block text-center px-4 py-3">
                            <i className="fas icon-warning icon" /> { error }
                        </em>
                        { optionsHeader }
                    </React.Fragment>
                );
            }
        }

        const intKey = parseInt(value); // if in the middle of editing a custom linked object for this field
        const hideButton = value && !isNaN(value) && !keyComplete[intKey];

        return ( hideButton ? null : (
            <SearchSelectionMenu {...passProps} {...{ optionsHeader, currentTextValue }}
                alignRight={true}
                options={results}
                onToggleOpen={this.onToggleOpen}
                onTextInputChange={this.onTextInputChange}
                onDropdownSelect={this.onDropdownSelect}
            />
        )
        );
    }
}
SearchAsYouTypeAjax.propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func,
    baseHref: function(props, propName, componentName) {
        const regex = "^/search/?type=(.+)?$";
        if (props[propName] && !props[propName].match(regex)) {
            return new Error(`Invalid prop '${propName}' supplied to ${componentName}. Validation failed.`);
        }
    },
    fieldsToRequest: PropTypes.arrayOf(PropTypes.string),
    titleRenderFunction: PropTypes.func
};
SearchAsYouTypeAjax.defaultProps = {
    "optionRenderFunction" : function(result){
        const { display_title: title, "@id" : atID, description } = result;
        return (
            <div data-tip={description} key={atID}>
                <h5 className="text-300 text-ellipsis-container">{ title }</h5>
                <h6 className="text-mono text-400 text-ellipsis-container">{ atID }</h6>
            </div>
        );
    },
    "titleRenderFunction": function(result){
        return result.display_title;
    },
    "baseHref" : "/search/?type=Item",
    "fieldsToRequest" : ["@id", "display_title", "description"] // additional fields aside from @id, display_title, and description; all already included
};

/**
 * A HOC for wrapping SearchAsYouTypeAjax with SubmissionView specific bits, like
 * the LinkedObj component which renders the "Create New" & "Advanced Search" buttons.
 */
export function SubmissionViewSearchAsYouTypeAjax(props){
    const {
        selectComplete,
        nestedField,
        value,
        arrayIdx,
        schema : { linkTo = "Item" },
        itemType = linkTo,
        idToTitleMap = null,
    } = props;

    // Add some logic based on schema.Linkto props if itemType not already available
    const baseHref = "/search/?type=" + linkTo;

    // console.log("idToTitleMap: ", idToTitleMap);

    // Retrieves Item types from SubmissionView props and uses that to pass SAYTAJAX
    // item-specific options for rendering dropdown items with more/different info than default
    const optionRenderFunction = (
        optionCustomizationsByType[itemType] &&
        optionCustomizationsByType[itemType].render ? optionCustomizationsByType[itemType].render : null
    ) || SearchAsYouTypeAjax.defaultProps.optionRenderFunction;

    // Retrieves the appropriate fields based on item type
    const fieldsToRequest = (
        optionCustomizationsByType[itemType] &&
        optionCustomizationsByType[itemType].fieldsToRequest ? optionCustomizationsByType[itemType].fieldsToRequest : null
    ) || SearchAsYouTypeAjax.defaultProps.fieldsToRequest;

    const onChange = useMemo(function(){
        return function(resultItem, valueToReplace){
            console.log("calling SubmissionViewSearchAsYouType onchange", arrayIdx);
            return selectComplete(resultItem['@id'], nestedField, itemType, arrayIdx, resultItem.display_title, valueToReplace);
        };
    }, [ selectComplete, nestedField, itemType, arrayIdx ]);

    // Uses idToTitleMap (similar to SubmissionView.keyDisplay) to keep track of & render display_titles
    // for previously seen objects
    const titleRenderFunction = useMemo(function(){
        return function(resultAtID){
            return idToTitleMap[resultAtID] || resultAtID;
        };
    }, [ idToTitleMap ]);

    return (
        <div className="d-flex flex-wrap">
            <SearchAsYouTypeAjax showTips={true} {...{ value, onChange, baseHref, optionRenderFunction,
                fieldsToRequest, titleRenderFunction, selectComplete }} {...props} />
            <LinkedObj key="linked-item" {...props} {...{ baseHref }} />
        </div>
    );
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
        // "render" is same as default
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
                    <h5 className="text-300 text-ellipsis-container">{ title }</h5>
                    <h6 className="text-mono text-400 text-ellipsis-container">{ accession }</h6>
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
                    <h5 className="text-300 text-ellipsis-container">{ title }</h5>
                    <h6 className="text-mono text-400 text-ellipsis-container">{ atID }</h6>
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
                    <h5 className="text-300 text-ellipsis-container">{ title }</h5>
                    <h6 className="text-mono text-400 text-ellipsis-container">{ atID }</h6>
                </div>
            );
        },
        "fieldsToRequest" : ['status', 'description', 'date_created', 'submitted_by']
    },
    "Phenotype" : {
        "render" : function(result){
            const { display_title: title, "@id" : atID, description, hpo_id } = result;
            return (
                <div data-tip={description} key={atID}>
                    <h5 className="text-300 text-ellipsis-container">{ title }</h5>
                    <h6 className="text-mono text-400">{ hpo_id }</h6>
                </div>
            );
        },
        "fieldsToRequest" : ["hpo_id"]
    }
};

/** Case for a linked object. */
export class LinkedObj extends React.PureComponent {

    /**
     * @param {string} props.nestedField - Field of LinkedObj
     * @param {number[]|null} props.arrayIdx - Array index (if any) of this item, if any.
     * @param {string} props.fieldBeingSelected - Field currently selected for linkedTo item selection.
     * @param {number[]|null} props.fieldBeingSelectedArrayIdx - Array index (if any) of currently selected for linkedTo item selection.
     * @returns {boolean} Whether is currently selected field/item or not.
     */
    static isInSelectionField(fieldBeingSelected, nestedField, arrayIdx, fieldBeingSelectedArrayIdx){
        if (!fieldBeingSelected || fieldBeingSelected !== nestedField){
            return false;
        }

        if (arrayIdx === null && fieldBeingSelectedArrayIdx === null){
            return true;
        }

        if (Array.isArray(arrayIdx) && Array.isArray(fieldBeingSelectedArrayIdx)){
            return _.every(arrayIdx, function(arrIdx, arrIdxIdx){
                return arrIdx === fieldBeingSelectedArrayIdx[arrIdxIdx];
            });
        }

        return false;
    }

    constructor(props){
        super(props);

        this.setSubmissionStateToLinkedToItem = this.setSubmissionStateToLinkedToItem.bind(this);
        this.handleStartSelectItem = this.handleStartSelectItem.bind(this);
        this.handleFinishSelectItem = this.handleFinishSelectItem.bind(this);
        this.handleCreateNewItemClick = this.handleCreateNewItemClick.bind(this);
        this.handleTextInputChange = this.handleTextInputChange.bind(this);
        this.handleAcceptTypedID = this.handleAcceptTypedID.bind(this);
        this.childWindowAlert = this.childWindowAlert.bind(this);

        this.state = {
            'textInputValue' : (typeof props.value === 'string' && props.value) || ''
        };
    }

    componentDidUpdate(){
        ReactTooltip.rebuild();
    }

    setSubmissionStateToLinkedToItem(e){
        const { value, setSubmissionState } = this.props;
        e.preventDefault();
        e.stopPropagation();
        var intKey = parseInt(value);
        if (isNaN(intKey)) throw new Error('Expected an integer for props.value, received', value);
        setSubmissionState('currKey', intKey);
    }

    handleStartSelectItem(e){
        e.preventDefault();
        if (!window) return;

        const { schema, nestedField, arrayIdx, selectObj } = this.props;
        const itemType = schema.linkTo;

        selectObj(itemType, nestedField, arrayIdx);
    }

    /**
     * Handles drop event for the (temporarily-existing-while-dragging-over) window drop receiver element.
     * Grabs @ID of Item from evt.dataTransfer, attempting to grab from 'text/4dn-item-id', 'text/4dn-item-json', or 'text/plain'.
     * @see Notes and inline comments for handleChildFourFrontSelectionClick re isValidAtId.
     */
    handleFinishSelectItem(items){
        // console.log("calling LinkedObj.handleFinishSelectItem with: ", items);
        const { selectComplete, isMultiSelect } = this.props;
        if (!items || !Array.isArray(items) || items.length === 0 || !_.every(items, function (item) { return item.id && typeof item.id === 'string' && item.json; })) {
            return;
        }

        let atIds;
        if (!(isMultiSelect || false)) {
            if (items.length > 1) {
                console.warn('Multiple items selected but we only get a single item, since handler\'s not supporting multiple items!');
            }
            const [{ id: atId, json: itemContext }] = items;
            atIds = [atId];
        }
        else {
            atIds = _.pluck(items, "id");
        }

        // Check validity of item IDs, and handle items with invalid IDs/URLs
        const invalidTitle = "Invalid Item Selected";
        if (_.every(atIds, function (atId) {
            const isValidAtId = object.isValidAtIDFormat(atId);
            return atId && isValidAtId;
        })) {
            Alerts.deQueue({ 'title': invalidTitle });
            selectComplete(atIds); // submit the values
        } else {
            Alerts.queue({
                'title': invalidTitle,
                'message': "You have selected an item or link which doesn't have a valid 4DN ID or URL associated with it. Please try again.",
                'style': 'danger'
            });
            throw new Error('No valid @id available.');
        }
    }

    handleCreateNewItemClick(e){
        // console.log("called LinkedObj.handleNewItemClick");
        e.preventDefault();
        const { fieldBeingSelected, selectCancel, modifyNewContext, nestedField, linkType,
            arrayIdx, schema } = this.props;

        if (fieldBeingSelected !== null) selectCancel();
        modifyNewContext(nestedField, null, 'new linked object', linkType, arrayIdx, schema.linkTo);
    }

    handleAcceptTypedID(evt){
        // console.log(`calling LinkedObj.handleAcceptTypedID(evt=${evt})`);
        const { selectComplete } = this.props;
        const { textInputValue } = this.state;
        if (!this || !this.state || !textInputValue){
            throw new Error('Invalid @id format.');
        }
        const atIds = [textInputValue];
        selectComplete(atIds);
    }

    handleTextInputChange(evt){
        this.setState({ 'textInputValue' : evt.target.value });
    }

    childWindowAlert(){
        const { schema, nestedField, isMultiSelect } = this.props;
        const itemType = schema && schema.linkTo;
        const prettyTitle = schema && ((schema.parentSchema && schema.parentSchema.title) || schema.title);
        const message = (
            <div>
                { !isMultiSelect?
                    <p className="mb-0">
                        Please either select an Item below and click <em>Apply</em> or <em>drag and drop</em> an Item (row) from this window into the submissions window.
                    </p>
                    :
                    <p className="mb-0">
                        Please select the Item(s) you would like and then press <em>Apply</em> below.
                    </p>
                }
                <p className="mb-0">You may use facets on the left-hand side to narrow down results.</p>
            </div>
        );
        return {
            title: 'Selecting ' + itemType + ' for field ' + (prettyTitle ? prettyTitle + ' ("' + nestedField + '")' : '"' + nestedField + '"'),
            message,
            style: 'info'
        };
    }

    renderSelectInputField(){
        const {
            selectCancel,
            schema,
            currType,
            nestedField,
            isMultiSelect,
            baseHref
        } = this.props;

        const itemType = schema.linkTo;
        const prettyTitle = schema && ((schema.parentSchema && schema.parentSchema.title) || schema.title);
        const dropMessage = "Drop " + (itemType || "Item") + " for field '" + (prettyTitle || nestedField) +  "'";

        let searchURL = baseHref + "&currentAction=" + (isMultiSelect ? 'multiselect' : 'selection') + '&type=' + itemType;

        // check if we have any schema flags that will affect the searchUrl
        if (schema.ff_flag && schema.ff_flag.startsWith('filter:')) {
            // the field to facet on could be set dynamically
            if (schema.ff_flag == "filter:valid_item_types"){
                searchURL += '&valid_item_types=' + currType;
            }
        }

        return <LinkToSelector isSelecting onSelect={this.handleFinishSelectItem} onCloseChildWindow={selectCancel}
            childWindowAlert={this.childWindowAlert} dropMessage={dropMessage} searchURL={searchURL} />;
    }


    renderButtons(){
        return (
            <div className="linked-object-buttons-container">
                <button type="button" className="btn btn-outline-secondary adv-search"
                    data-tip="Advanced Search" onClick={this.handleStartSelectItem}>
                    <i className="icon icon-fw icon-search fas"/>
                </button>
                <button type="button" className="btn btn-outline-secondary create-new-obj"
                    data-tip="Create New" onClick={this.handleCreateNewItemClick}>
                    <i className="icon icon-fw icon-file-medical fas"/>
                </button>
            </div>
        );
    }

    render(){
        const { value, keyDisplay = {}, keyComplete, fieldBeingSelected, nestedField, arrayIdx, fieldBeingSelectedArrayIdx } = this.props;
        const isSelecting = LinkedObj.isInSelectionField(fieldBeingSelected, nestedField, arrayIdx, fieldBeingSelectedArrayIdx);

        if (isSelecting){
            return this.renderSelectInputField();
        }

        // object chosen or being created
        if (value){
            const thisDisplay = keyDisplay[value] ? (<>{keyDisplay[value]}<code>{value}</code></ >)
                : (<code>{value}</code>);
            if (isNaN(value)) {
                return this.renderButtons();
            } else {
                // it's a custom object. Either render a link to editing the object
                // or a pop-up link to the object if it's already submitted
                var intKey = parseInt(value);
                // this is a fallback - shouldn't be int because value should be
                // string once the obj is successfully submitted
                if (keyComplete[intKey]){
                    return(
                        <div>
                            <a href={keyComplete[intKey]} target="_blank" rel="noopener noreferrer">{ thisDisplay }</a>
                            <i className="icon icon-fw icon-external-link-alt ml-05 fas"/>
                        </div>
                    );
                } else {
                    return(
                        <div className="incomplete-linked-object-display-container text-ellipsis-container">
                            <i className="icon icon-fw icon-edit far" />&nbsp;&nbsp;
                            <a href="#" onClick={this.setSubmissionStateToLinkedToItem} data-tip="Continue editing/submitting">{ thisDisplay }</a>
                            &nbsp;
                        </div>
                    );
                }
            }
        } else {
            // nothing chosen/created yet
            return this.renderButtons();
        }
    }
}

export const SquareButton = React.memo(function SquareButton(props){
    const { show, disabled, onClick, tip, bsStyle, className, buttonContainerClassName, icon, style } = props;
    const outerCls = "remove-button-container" + (buttonContainerClassName ? ' ' + buttonContainerClassName : '');
    let btnCls = ("btn" + (className ? " " + className : ""));
    if (bsStyle){
        btnCls += " btn-" + bsStyle;
    }
    return (
        <div className={"remove-button-column" + (!show ? ' hidden' : '')} style={style}>
            <Fade in={show}>
                <div className={outerCls}>
                    <button type="button" disabled={disabled || !show} onClick={onClick} data-tip={tip} tabIndex={2} className={btnCls}>
                        <i className={"icon icon-fw icon-" + icon}/>
                    </button>
                </div>
            </Fade>
        </div>
    );
});
SquareButton.defaultProps = {
    'bsStyle' : 'danger',
    'icon' : 'times fas',
    'style' : null
};