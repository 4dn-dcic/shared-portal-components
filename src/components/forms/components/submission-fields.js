'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import ReactTooltip from 'react-tooltip';
import { InputGroup, FormControl, DropdownItem, DropdownButton } from 'react-bootstrap';

import { Fade } from './../../ui/Fade';
import { Checkbox } from './Checkbox';
import { ajax, console, object, valueTransforms } from './../../util';
import { Alerts } from './../../ui/Alerts';
import { BasicStaticSectionBody } from './../../static-pages/BasicStaticSectionBody';
import { Line as ProgressBar } from 'rc-progress';
import { LinkToSelector } from './LinkToSelector';
import { SearchAsYouTypeLocal } from './SearchAsYouTypeLocal';


/**
 * Individual component for each type of field. Contains the appropriate input
 * if it is a simple number/text/enum, or generates a child component for
 * attachment, linked object, array, object, and file fields. Contains delete
 * logic for the field as well (deleting is done by setting value to null).
 *
 * @todo Possibly rename both this class and the containing file to be `SubmissionViewField` or `SubmissionField`.
 */
export class BuildField extends React.PureComponent {

    /**
     * Gets the (interal) field type from a schema for a field.
     * Possible return values include 'attachment', 'linked object', 'enum', 'text', 'html', 'code', 'boolean', 'number', 'integer', etc.
     *
     * @todo Handle date formats, other things, etc.
     *
     * @param {{ 'type' : string }} fieldSchema - Schema definition for this property. Should be same as `app.state.schemas[CurrentItemType].properties[currentField]`.
     * @returns {string} Type of field that will be created, according to schema.
     */
    static fieldTypeFromFieldSchema(fieldSchema){
        let fieldType = fieldSchema.type ? fieldSchema.type : "text";
        // transform some types...
        if (fieldType === 'string'){
            fieldType = 'text';
            if (typeof fieldSchema.formInput === 'string'){
                if (['textarea', 'html', 'code'].indexOf(fieldSchema.formInput) > -1){
                    return fieldSchema.formInput;
                }
            }
        }
        // check if this is an enum
        if (fieldSchema.enum || fieldSchema.suggested_enum){ // not sure why this is here if suggested_enum doesn't even appear when is a field with that type
            fieldType = 'enum';
        }
        // handle a linkTo object on the the top level
        if (fieldSchema.linkTo){
            fieldType = 'linked object';
        } else if (fieldSchema.attachment && fieldSchema.attachment === true){
            fieldType = 'attachment';
        }
        return fieldType;
    }

    constructor(props){
        super(props);
        _.bindAll(this,
            'displayField', 'handleDropdownButtonToggle', 'handleAliasChange',
            'handleEnumChange', 'buildSuggestedEnumEntry', 'submitSuggestedEnumVal',
            'handleChange', 'handleAliasChange', 'deleteField', 'pushArrayValue',
            'commonRowProps', 'labelTypeDescriptor', 'wrapWithLabel', 'wrapWithNoLabel'
        );
        this.state = {
            'dropdownOpen' : false
        };

        this.inputElementRef = React.createRef();
    }

    componentDidMount(){
        ReactTooltip.rebuild();
    }

    handleDropdownButtonToggle(isOpen, evt){
        this.setState(function({ dropdownOpen }){
            if (isOpen === dropdownOpen) return null;
            return { 'dropdownOpen' : isOpen };
        });
    }

    /**
     * Renders out an input field (or more fields of itself via more advanced input field component, e.g. for arrays).
     *
     * @param {string} [fieldType=this.props.fieldType] Type of input field to render, if different from `props.fieldType`.
     * @returns {JSX.Element} A JSX `<input>` element, a Bootstrap input element component, or custom React component which will render input fields.
     */
    displayField(fieldType){
        const { field, value, disabled, enumValues, suggestedEnumValues, currentSubmittingUser, roundTwo, currType, currContext, fieldType : propFieldType } = this.props;
        fieldType = fieldType || propFieldType;
        const inputProps = {
            'key'       :        field,
            'id'                : 'field_for_' + field,
            'disabled'          : disabled || false,
            'ref'               : this.inputElementRef,
            'value'             : (typeof value === 'number' ? value || 0 : value || ''),
            'onChange'          : this.handleChange,
            'name'              : field,
            'placeholder'       : "No value",
            'data-field-type'   : fieldType
        };

        // Unique per-type overrides

        if (currType === 'StaticSection' && field === 'body'){
            // Static section preview
            const filetype = currContext && currContext.options && currContext.options.filetype;
            if (filetype === 'md' || filetype === 'html'){
                return <PreviewField {...this.props} {...{ filetype, fieldType }} onChange={this.handleChange} />;
            }
        }

        // Common field types
        switch(fieldType){
            case 'text' :
                if (field === 'aliases'){
                    return (
                        <div className="input-wrapper">
                            <AliasInputField {...inputProps} onAliasChange={this.handleAliasChange} currentSubmittingUser={currentSubmittingUser} />
                        </div>
                    );
                }
                return <input {...inputProps} type="text" className="form-control" inputMode="latin"/>;
            case 'textarea':
                return <textarea {...inputProps} type="text" inputMode="latin" rows={4} className="form-control mb-08 mt-08" />;
            case 'html':
            case 'code':
                return <textarea {...inputProps} type="text" inputMode="latin" rows={8} wrap="off" className="form-control text-small mb-08 mt-08" style={{ 'fontFamily' : "Source Code Pro, monospace", 'fontSize' : 'small' }} />;
            case 'integer'          : return <FormControl type="number" {...inputProps} step={1} />;
            case 'number'           : return <FormControl type="number" {...inputProps} />;
            case 'boolean'          : return (
                <Checkbox {..._.omit(inputProps, 'value', 'placeholder')} checked={!!(value)}>
                    <span style={{ 'verticalAlign' : 'middle', 'textTransform' : 'capitalize' }}>
                        { typeof value === 'boolean' ? value + '' : null }
                    </span>
                </Checkbox>
            );
            case 'enum'             : return (
                <span className="input-wrapper">
                    <DropdownButton title={value || <span className="text-300">No value</span>}
                        onToggle={this.handleDropdownButtonToggle} variant="outline-dark"
                        onSelect={this.submitEnumVal}>
                        {
                            enumValues.map((val)=>
                                <DropdownItem key={val} title={val || ''} eventKey={val}>
                                    {val || ''}
                                </DropdownItem>
                            )
                        }
                    </DropdownButton>
                </span>
            );
            // var myFilter = new RegExp("^(" + value +  ")(.+)", "i")
            case 'suggested_enum'   : return (
                <span className="input-wrapper">
                    
                    <SearchAsYouTypeLocal searchList={suggestedEnumValues} value={value}
                        filterMethod="includes" onChange={this.handleEnumChange} maxResults={3}/>
                    {/* <DropdownButton title={value || <span className="text-300">No value</span>}
                        onToggle={this.handleDropdownButtonToggle} variant="outline-dark">
                        {_.map(suggestedEnumValues, (val) => this.buildSuggestedEnumEntry(val))}
                    </DropdownButton> */}
                </span>
            );
            case 'linked object'    : return <LinkedObj key="linked-item" {...this.props}/>;
            case 'array'            : return <ArrayField {...this.props} pushArrayValue={this.pushArrayValue} value={value || null} roundTwo={roundTwo} />;
            case 'object'           : return <ObjectField {...this.props} />;
            case 'attachment'       : return <div style={{ 'display':'inline' }}><AttachmentInput {...this.props}/></div>;
            case 'file upload'      : return <S3FileInput {...this.props} />;
        }
        // Fallback
        return <div>No field for this case yet.</div>;
    }

    buildSuggestedEnumEntry(val) {
        return (
            <DropdownItem key={val} title={val || ''} eventKey={val} onSelect={this.submitSuggestedEnumVal}>
                {val || ''}
            </DropdownItem>
        );
    }

    submitSuggestedEnumVal(eventKey) {
        const { modifyNewContext, nestedField, fieldType, linkType, arrayIdx, schema } = this.props;

        //eventKey's type is always string, convert it to the proper type defined in schema
        let value = eventKey;
        if (schema && schema.type && (typeof schema.type === 'string')) {
            if (schema.type === 'integer') {
                value = parseInt(eventKey);
            } else if (schema.type === 'float') {
                value = parseFloat(eventKey);
            } else if (schema.type === 'number') {
                value = Number(eventKey);
            } else if (schema.type === 'boolean') {
                value = (eventKey === 'true');
            } else {
                //todo: define other conversion types
            }
        }

        modifyNewContext(nestedField, value, fieldType, linkType, arrayIdx);
    }

    handleEnumChange(eventKey){
        const { modifyNewContext, nestedField, fieldType, linkType, arrayIdx, schema } = this.props;

        //eventKey's type is always string, convert it to the proper type defined in schema
        let value = eventKey;
        if (schema && schema.type && (typeof schema.type === 'string')) {
            if (schema.type === 'integer') {
                value = parseInt(eventKey);
            } else if (schema.type === 'float') {
                value = parseFloat(eventKey);
            } else if (schema.type === 'number') {
                value = Number(eventKey);
            } else if (schema.type === 'boolean') {
                value = (eventKey === 'true');
            } else {
                //todo: define other conversion types
            }
        }

        modifyNewContext(nestedField, value, fieldType, linkType, arrayIdx);
    }

    handleChange(e){
        const { fieldType, modifyNewContext, nestedField, linkType, arrayIdx } = this.props;
        const inputElement = e && e.target ? e.target : this.inputElementRef.current;
        let currValue = inputElement.value;
        if (fieldType === 'boolean'){
            currValue = inputElement.checked;
        } else if (fieldType === 'integer'){
            currValue = parseInt(currValue);
            if (isNaN(currValue)){
                currValue = null;
            }
        } else if (fieldType === 'number'){
            currValue = parseFloat(currValue);
            if (isNaN(currValue)){
                currValue = null;
            }
        }
        //console.log('VAL', this.props.nestedField, currValue, this.props.fieldType, this.props.value, this.props.arrayIdx);
        modifyNewContext(nestedField, currValue, fieldType, linkType, arrayIdx);
    }

    handleAliasChange(currValue){
        const { fieldType, modifyNewContext, nestedField, linkType, arrayIdx } = this.props;
        modifyNewContext(nestedField, currValue, fieldType, linkType, arrayIdx);
    }

    // call modifyNewContext from parent to delete the value in the field
    deleteField(e){
        const { fieldType, modifyNewContext, nestedField, linkType, arrayIdx } = this.props;
        e.preventDefault();
        modifyNewContext(nestedField, null, fieldType, linkType, arrayIdx);
    }

    // this needs to live in BuildField for styling purposes
    pushArrayValue(e){
        const { fieldType, value, schema, modifyNewContext, nestedField, linkType, arrayIdx } = this.props;
        e && e.preventDefault();
        if (fieldType !== 'array') {
            return;
        }
        const valueCopy = value ? value.slice() : [];
        if (schema.items && schema.items.type === 'object'){
            // initialize with empty obj in only this case
            valueCopy.push({});
        }else{
            valueCopy.push(null);
        }
        modifyNewContext(nestedField, valueCopy, fieldType, linkType, arrayIdx);
    }

    /**
     * Returns an object representing `props` which would be common to any type of input field
     * element which this component renders.
     *
     * @returns {{ 'className': string, 'data-field-type': string, 'data-field-name': string, 'style': Object.<string|number> }} Object of props and values.
     */
    commonRowProps(){
        const { isArray, fieldType, field } = this.props;
        const { dropdownOpen } = this.state;
        return {
            'className' : (
                "field-row" +
                (dropdownOpen ? ' active-submission-row' : '') +
                (isArray ? ' in-array-field clearfix row'  : '')
            ),
            'data-field-type' : fieldType,
            'data-field-name' : field,
            'style' : { 'overflow' : 'visible' }
        };
    }

    /**
     * Returns a `<div>` JSX element with 'Required' label/text, if `props.required` is true or truthy.
     */
    labelTypeDescriptor(){
        const { required } = this.props;
        return <div className="field-descriptor">{ required ? <span style={{ 'color':'#a94442' }}> Required</span> : null }</div>;
    }

    /** @ignore */
    wrapWithLabel(){
        var { fieldTip, title, fieldType, schema } = this.props;
        return(
            <div {...this.commonRowProps()}>
                <div className="row">
                    <div className="col-12 col-md-4">
                        <h5 className="submission-field-title text-ellipsis-container">
                            { this.labelTypeDescriptor() }
                            { fieldTip ?
                                <InfoIcon className="mr-07" title={title} fieldType={fieldType} schema={schema}>{ fieldTip }</InfoIcon>
                                : null}
                            <span>{ title }</span>
                        </h5>
                    </div>
                    <div className="col-12 col-md-8">
                        <div className="row field-container">
                            { Array.prototype.slice.call(arguments) }
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /** @ignore */
    wrapWithNoLabel(){
        return <div {...this.commonRowProps()}>{ Array.prototype.slice.call(arguments) }</div>;
    }

    /**
     * Renders out input for this field. Performs this recursively (through adding own component down in render tree)
     * if necessary re: data structure.
     *
     * @todo Come up with a schema based solution for code below?
     * @private
     * @returns {JSX.Element} Appropriate element/markup for this field.
     */
    render(){
        const { value, isArray, field, fieldType, arrayIdx, isLastItemInArray, fieldBeingSelected, nestedField, fieldBeingSelectedArrayIdx } = this.props;
        const cannot_delete       = ['filename']; // hardcoded fields you can't delete
        let showDelete          = false;
        let disableDelete       = false;
        let extClass            = '';

        // Don't show delete button unless:
        // not in hardcoded cannot delete list AND is not an object or
        // non-empty array element (individual values get deleted)
        if(!_.contains(cannot_delete, field) && fieldType !== 'array'){
            showDelete = true;
        }

        // if there is no value in the field and non-array, hide delete button
        if (isValueNull(value) && !isArray) {
            showDelete = false;
        }

        let wrapFunc = this.wrapWithLabel;
        const excludeRemoveButton = (fieldType === 'array' || fieldType === 'file upload'); // In case we render our own w/ dif functionality lower down.
        const fieldToDisplay = this.displayField(fieldType);  // The rendered field.

        if (isArray) {
            // array items don't need fieldnames/tooltips
            wrapFunc = this.wrapWithNoLabel;

            if (isLastItemInArray && isValueNull(value)){
                showDelete = false;
                if (Array.isArray(arrayIdx) && arrayIdx[0] !== 0){
                    extClass += " last-item-empty";
                }
            } else if (fieldType === 'object') {
                // if we've got an object that's inside inside an array, only allow
                // the array to be deleted if ALL individual fields are null
                if (!isValueNull(value)){
                    disableDelete = true;
                }
                //var valueCopy = this.props.value ? JSON.parse(JSON.stringify(this.props.value)) : {};
                //var nullItems = _.filter( _.keys(valueCopy), isValueNull);
                //if( _.keys(valueCopy).length !== nullItems.length){
                //    showDelete = false;
                //}
            }
        } else if (fieldType === 'object') {
            showDelete = false;
        }

        if (fieldType === 'linked object' && LinkedObj.isInSelectionField(fieldBeingSelected, nestedField, arrayIdx, fieldBeingSelectedArrayIdx)){
            extClass += ' in-selection-field';
        }

        return wrapFunc(
            <React.Fragment>
                <div className={'field-column col' + extClass}>{ fieldToDisplay }</div>
                { excludeRemoveButton ? null : <SquareButton show={showDelete} disabled={disableDelete} tip={isArray ? 'Remove Item' : 'Clear Value'} onClick={this.deleteField} /> }
            </React.Fragment>
        );
    }
}



const SquareButton = React.memo(function SquareButton(props){
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



//var linkedObjChildWindow = null; // Global var

/** Case for a linked object. */
class LinkedObj extends React.PureComponent {

    /**
     * @param {Object} props - Props passed from LinkedObj or BuildField.
     * @param {string} props.nestedField - Field of LinkedObj
     * @param {number[]|null} props.arrayIdx - Array index (if any) of this item, if any.
     * @param {string} props.fieldBeingSelected - Field currently selected for linkedTo item selection.
     * @param {number[]|null} props.fieldBeingSelectedArrayIdx - Array index (if any) of currently selected for linkedTo item selection.
     * @returns {boolean} Whether is currently selected field/item or not.
     */
    static isInSelectionField(fieldBeingSelected, nestedField, arrayIdx, fieldBeingSelectedArrayIdx){
        //if (!props) return false;
        //const { fieldBeingSelected, nestedField, arrayIdx, fieldBeingSelectedArrayIdx } = props;

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
        this.updateContext = this.updateContext.bind(this);
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

    componentDidMount(){
        this.updateContext();
    }

    componentDidUpdate(pastProps){
        this.updateContext();
        ReactTooltip.rebuild();
    }

    /**
     * Mechanism for changing value of linked object in parent context
     * from {number} keyIdx to {string} path of newly submitted object.
     */
    updateContext(){
        var { keyComplete, value, linkType, arrayIdx, nestedField, modifyNewContext } = this.props;
        if (keyComplete[value] && !isNaN(value)) {
            modifyNewContext(nestedField, keyComplete[value], 'finished linked object', linkType, arrayIdx);
            ReactTooltip.rebuild();
        }
    }


    setSubmissionStateToLinkedToItem(e){
        e.preventDefault();
        e.stopPropagation();
        var intKey = parseInt(this.props.value);
        if (isNaN(intKey)) throw new Error('Expected an integer for props.value, received', this.props.value);
        this.props.setSubmissionState('currKey', intKey);
    }

    handleStartSelectItem(e){
        e.preventDefault();
        if (!window) return;

        const { schema, nestedField, currType, linkType, arrayIdx, selectObj, selectCancel } = this.props;
        const itemType = schema.linkTo;

        selectObj(itemType, nestedField, arrayIdx);
    }

    /**
     * Handles drop event for the (temporarily-existing-while-dragging-over) window drop receiver element.
     * Grabs @ID of Item from evt.dataTransfer, attempting to grab from 'text/4dn-item-id', 'text/4dn-item-json', or 'text/plain'.
     * @see Notes and inline comments for handleChildFourFrontSelectionClick re isValidAtId.
     */
    handleFinishSelectItem(items){
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

        const invalidTitle = "Invalid Item Selected";
        if (_.every(atIds, function (atId) {
            const isValidAtId = object.isValidAtIDFormat(atId);
            return atId && isValidAtId;
        })) {
            Alerts.deQueue({ 'title': invalidTitle });
            selectComplete(atIds);
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
        e.preventDefault();
        const { fieldBeingSelected, selectCancel, modifyNewContext, nestedField, linkType, arrayIdx, schema } = this.props;
        if (fieldBeingSelected !== null) selectCancel();
        modifyNewContext(nestedField, null, 'new linked object', linkType, arrayIdx, schema.linkTo);
    }

    handleAcceptTypedID(evt){
        console.log(evt);
        if (!this || !this.state || !this.state.textInputValue){
            throw new Error('Invalid @id format.');
        }
        const atIds = [this.state.textInputValue];
        this.props.selectComplete(atIds);
    }

    handleTextInputChange(evt){
        this.setState({ 'textInputValue' : evt.target.value });
    }

    childWindowAlert(){
        const { schema, nestedField, isMultiSelect } = this.props;
        const itemType = schema && schema.linkTo;
        const prettyTitle = schema && ((schema.parentSchema && schema.parentSchema.title) || schema.title);
        const message = null;
        // const message = (
        //     <div>
        //         { !isMultiSelect?
        //             <p className="mb-0">
        //                 Please either select an Item below and click <em>Apply</em> or <em>drag and drop</em> an Item (row) from this window into the submissions window.
        //             </p>
        //             :
        //             <p className="mb-0">
        //                 Please select the Item(s) you would like and then press <em>Apply</em> below.
        //             </p>
        //         }
        //         <p className="mb-0">You may use facets on the left-hand side to narrow down results.</p>
        //     </div>
        // );
        return {
            title: 'Selecting ' + itemType + ' for field ' + (prettyTitle ? prettyTitle + ' ("' + nestedField + '")' : '"' + nestedField + '"'),
            message,
            style: 'info'
        };
    }

    renderSelectInputField(){
        const { value, selectCancel, schema, currType, nestedField, isMultiSelect } = this.props;
        const { textInputValue } = this.state;
        const canShowAcceptTypedInput = typeof textInputValue === 'string' && textInputValue.length > 3;
        const extClass = !canShowAcceptTypedInput && textInputValue ? ' has-error' : '';
        const itemType = schema.linkTo;
        const prettyTitle = schema && ((schema.parentSchema && schema.parentSchema.title) || schema.title);
        const dropMessage = "Drop " + (itemType || "Item") + " for field '" + (prettyTitle || nestedField) +  "'";
        let searchURL = '/search/?currentAction=' + (isMultiSelect ? 'multiselect' : 'selection') + '&type=' + itemType;

        // check if we have any schema flags that will affect the searchUrl
        if (schema.ff_flag && schema.ff_flag.startsWith('filter:')) {
            // the field to facet on could be set dynamically
            if (schema.ff_flag == "filter:valid_item_types"){
                searchURL += '&valid_item_types=' + currType;
            }
        }

        return (
            <React.Fragment>
                <div className="linked-object-text-input-container row flexrow">
                    <div className="field-column col">
                        <input onChange={this.handleTextInputChange} className={"form-control" + extClass} inputMode="latin" type="text" placeholder="Drag & drop Item from the search view or type in a valid @ID." value={this.state.textInputValue} onDrop={this.handleDrop} />
                    </div>
                    { canShowAcceptTypedInput ?
                        <SquareButton show onClick={this.handleAcceptTypedID} icon="check fas"
                            bsStyle="success" tip="Accept typed identifier and look it up in database." />
                        : null }
                    <SquareButton show onClick={selectCancel} tip="Cancel selection" style={{ 'marginRight' : 9 }} />
                </div>
                <LinkToSelector isSelecting onSelect={this.handleFinishSelectItem} onCloseChildWindow={selectCancel}
                    childWindowAlert={this.childWindowAlert} dropMessage={dropMessage} searchURL={searchURL} />
            </React.Fragment>
        );
    }

    renderEmptyField(){
        return (
            <div className="linked-object-buttons-container">
                <button type="button" className="btn btn-outline-dark select-create-linked-item-button" onClick={this.handleStartSelectItem}>
                    <i className="icon icon-fw icon-search fas"/> Select existing
                </button>
                <button type="button" className="btn btn-outline-dark select-create-linked-item-button" onClick={this.handleCreateNewItemClick}>
                    <i className="icon icon-fw icon-file far"/> Create new
                </button>
            </div>
        );
    }

    render(){
        const { value, keyDisplay, keyComplete, fieldBeingSelected, nestedField, arrayIdx, fieldBeingSelectedArrayIdx } = this.props;
        const isSelecting = LinkedObj.isInSelectionField(fieldBeingSelected, nestedField, arrayIdx, fieldBeingSelectedArrayIdx);

        if (isSelecting){
            return this.renderSelectInputField();
        }

        // object chosen or being created
        if (value){
            const thisDisplay = keyDisplay[value] ? keyDisplay[value] + " (<code>" + value + "</code>)"
                : "<code>" + value + "</code>";
            if (isNaN(value)) {
                const tip = thisDisplay + " is already in the database";
                return(
                    <div className="submitted-linked-object-display-container text-ellipsis-container">
                        <i className="icon icon-fw icon-hdd far mr-05" />
                        <a href={value} target="_blank" rel="noopener noreferrer" data-tip={tip} data-html>
                            { keyDisplay[value] || value }
                        </a>
                        <i className="icon icon-fw icon-external-link-alt ml-05 fas"/>
                    </div>
                );
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
                            <i className="icon icon-fw icon-sticky-note far" />&nbsp;&nbsp;
                            <a href="#" onClick={this.setSubmissionStateToLinkedToItem} data-tip="Continue editing/submitting">{ thisDisplay }</a>
                            &nbsp;<i style={{ 'fontSize' : '0.85rem' }} className="icon icon-fw icon-pencil ml-05 fas"/>
                        </div>
                    );
                }
            }
        } else {
            // nothing chosen/created yet
            return this.renderEmptyField();
        }
    }
}



const PreviewField = React.memo(function PreviewField(props){
    const { value, filetype, field, onChange } = props;
    const preview = value && (
        <React.Fragment>
            <h6 className="mt-1 text-600">Preview:</h6>
            <hr className="mb-1 mt-05" />
            <BasicStaticSectionBody content={value || ''} filetype={filetype} />
        </React.Fragment>
    );
    return (
        <div className="preview-field-container mt-08 mb-08">
            <FormControl onChange={onChange} id={"field_for_" + field} name={field} value={value} type="text" inputMode="latin" as="textarea" rows={8}
                wrap="off" style={{ 'fontFamily' : "Source Code Pro, monospace", 'fontSize' : 'small' }} />
            { preview }
        </div>
    );
});


/**
 * Display fields that are arrays. To do this, make a BuildField for each
 * object in the value and use a custom render method. initiateArrayField is
 * unique to ArrayField, since it needs to update the arrayIdx
 */
class ArrayField extends React.Component{

    static typeOfItems(itemSchema){
        var fieldType = itemSchema.type ? itemSchema.type : "text";
        // transform some types...
        if (fieldType === 'string'){
            fieldType = 'text';
        }
        // check if this is an enum
        if(itemSchema.enum){
            fieldType = 'enum';
        }
        if (itemSchema.suggested_enum) {
            fieldType = 'suggested_enum';
        }
        // handle a linkTo object on the the top level
        if(itemSchema.linkTo){
            fieldType = 'linked object';
        }
        return fieldType;
    }

    static shouldPushArrayValue(currentArr, field = null){
        if (!currentArr ||
            (
                Array.isArray(currentArr) && (
                    currentArr.length === 0 || !isValueNull(currentArr[currentArr.length - 1])
                )
            )
        ){
            return true;
        }
        return false;
    }

    constructor(props){
        super(props);
        _.bindAll(this, 'initiateArrayField', 'generateAddButton');
    }

    /**
     * If empty array, add initial 'null' element. On Mount & Update.
     */
    componentDidMount(){
        const { value, field, pushArrayValue } = this.props;
        if (ArrayField.shouldPushArrayValue(value, field)){
            pushArrayValue();
        }
    }

    componentDidUpdate(prevProps, prevState){ // We can't do a comparison of props.value here because parent property mutates yet stays part of same obj.
        const { value, field, pushArrayValue, modifyNewContext, nestedField, schema, linkType } = this.props;
        if (ArrayField.shouldPushArrayValue(value, field)){
            pushArrayValue();
        } else {
            if (Array.isArray(value) && value.length >= 2){
                if (isValueNull(value[value.length - 1]) && isValueNull(value[value.length - 2])){
                    modifyNewContext(nestedField, null, ArrayField.typeOfItems(schema.items || {}), linkType, [value.length - 2]);
                }
            }
        }
    }

    initiateArrayField(arrayInfo, index, allItems){
        const { arrayIdx : propArrayIdx, schema } = this.props;
        // use arrayIdx as stand-in value for field
        const [ inArrValue, fieldSchema, arrayIdx ] = arrayInfo;
        const value = inArrValue || null;

        let fieldTip = fieldSchema.description || null;
        if (fieldSchema.comment){
            fieldTip = fieldTip ? fieldTip + ' ' + fieldSchema.comment : fieldSchema.comment;
        }
        const title = fieldSchema.title || 'Item';
        const fieldType = ArrayField.typeOfItems(fieldSchema);
        const enumValues = fieldSchema.enum ? (fieldSchema.enum || []) : []; // check if this is an enum
        const suggestedEnumValues = fieldSchema.suggested_enum ? (fieldSchema.suggested_enum || []) : [];

        let arrayIdxList;
        if (propArrayIdx){
            arrayIdxList = propArrayIdx.slice();
        }else{
            arrayIdxList = [];
        }
        arrayIdxList.push(arrayIdx);
        const childFieldSchema = _.extend({}, fieldSchema, { 'parentSchema' : schema });
        return(
            <div key={arrayIdx} className={"array-field-container " + (arrayIdx % 2 === 0 ? 'even' : 'odd')} data-field-type={fieldType}>
                <BuildField
                    {...{ value, fieldTip, fieldType, title, enumValues, suggestedEnumValues }}
                    { ..._.pick(this.props, 'field', 'modifyNewContext', 'linkType', 'selectObj', 'selectComplete', 'selectCancel',
                        'nestedField', 'keyDisplay', 'keyComplete', 'setSubmissionState', 'fieldBeingSelected', 'fieldBeingSelectedArrayIdx',
                        'updateUpload', 'upload', 'uploadStatus', 'md5Progress', 'currentSubmittingUser', 'roundTwo', 'currType' ) }
                    isArray={true} isLastItemInArray={allItems.length - 1 === index} arrayIdx={arrayIdxList}
                    schema={childFieldSchema} disabled={false} required={false} key={arrayIdx} isMultiSelect={true} />
            </div>
        );
    }

    generateAddButton(){
        const { value : values = [], pushArrayValue } = this.props;

        return (
            <div className="add-array-item-button-container">
                <button type="button" className={"btn btn-outline-dark btn-" + (values.length > 0 ? "sm" : "md")} onClick={pushArrayValue}>
                    <i className="icon icon-fw fas icon-plus"/> Add
                </button>
            </div>
        );
    }

    render(){
        const { schema : propSchema, value : propValue } = this.props;
        const schema = propSchema.items || {};
        const values = propValue || [];
        const valuesToRender = _.map( values.length === 0 ? [null] : values , function(v,i){ return [v, schema, i]; });
        const showAddButton = !isValueNull(values[valuesToRender.length - 1]);

        return(
            <div className="list-of-array-items">
                { valuesToRender.map(this.initiateArrayField) }
                { showAddButton ? this.generateAddButton() : null }
            </div>
        );
    }
}



/**
 * Builds a field that represents a sub-object. Essentially serves to hold
 * and coordinate BuildFields that correspond to the fields within the subfield.
 */
class ObjectField extends React.PureComponent {

    componentDidMount(){
        const { value, modifyNewContext, nestedField, linkType, arrayIdx } = this.props;
        // initialize with empty dictionary
        const initVal = value || {};
        modifyNewContext(nestedField, initVal, 'object', linkType, arrayIdx);
    }

    componentDidUpdate(pastProps){
        const { value: parentObject } = this.props;
        if (pastProps.value !== parentObject){
            console.log('CHANGED', pastProps.value , parentObject);
        }
    }

    includeField = (schema, field) => {
        if (!schema) return null;
        var schemaVal = object.getNestedProperty(schema, ['properties', field], true);
        if (!schemaVal) return null;
        // check to see if this field should be excluded based on exclude_from status
        if (schemaVal.exclude_from && (_.contains(schemaVal.exclude_from,'FFedit-create') || schemaVal.exclude_from == 'FFedit-create')){
            return null;
        }
        if (schemaVal.exclude_from && (_.contains(schemaVal.exclude_from,'FF-calculate') || schemaVal.exclude_from == 'FF-calculate')){
            return null;
        }
        // check to see if this field is a calculated val
        if (schemaVal.calculatedProperty && schemaVal.calculatedProperty === true){
            return null;
        }
        // check to see if permission == import items
        if (schemaVal.permission && schemaVal.permission == "import_items"){
            return null;
        }
        return schemaVal;
    }

    render(){
        const { schema: objectSchema, value: parentObject, nestedField: propNestedField, isMultiSelect } = this.props;
        const allFieldsInSchema = objectSchema['properties'] ? _.keys(objectSchema['properties']) : [];
        const fieldsToBuild = _.filter(_.map(allFieldsInSchema, (f)=>{ // List of [field, fieldSchema] pairs.
            const fieldSchemaToUseOrNull = this.includeField(objectSchema, f);
            return (fieldSchemaToUseOrNull && [f, fieldSchemaToUseOrNull]) || null;
        }));

        const passProps = _.pick(this.props, 'modifyNewContext', 'linkType', 'setSubmissionState',
            'selectObj', 'selectComplete', 'selectCancel', 'arrayIdx', 'keyDisplay', 'keyComplete', 'currType',
            'updateUpload', 'upload', 'uploadStatus', 'md5Progress', 'fieldBeingSelected', 'fieldBeingSelectedArrayIdx'
        );

        const builtFields = fieldsToBuild.map(function([ field, fieldSchema ]){
            let fieldTip = fieldSchema.description ? fieldSchema.description : null;
            if (fieldSchema.comment){
                fieldTip = fieldTip ? fieldTip + ' ' + fieldSchema.comment : fieldSchema.comment;
            }
            const fieldType = BuildField.fieldTypeFromFieldSchema(fieldSchema);
            const title = fieldSchema.title || field;
            let fieldValue;
            if (parentObject) {
                fieldValue = parentObject[field];
            } else {
                fieldValue = null;
            }
            let enumValues = [];
            // check if this is an enum
            if (fieldType === 'enum'){
                enumValues = fieldSchema.enum || fieldSchema.suggested_enum || [];
            }
            // format field as <this_field>.<next_field> so top level modification
            // happens correctly
            const nestedField = propNestedField + '.' + field;
            return (
                <BuildField { ...passProps} { ...{ field, fieldType, fieldTip, enumValues, nestedField, title } }
                    value={fieldValue} key={field} schema={fieldSchema} disabled={false} required={false} isArray={false} isMultiSelect={isMultiSelect || false} />
            );
        });

        return <div className="object-field-container">{ builtFields }</div>;
    }
}



/**
 * For version 1. A simple local file upload that gets the name, type,
 * size, and b64 encoded stream in the form of a data url. Upon successful
 * upload, adds this information to NewContext
 */
class AttachmentInput extends React.Component{

    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    acceptedTypes(){
        const { schema } = this.props;
        // hardcoded back-up
        let types = object.getNestedProperty(schema, ['properties', 'type', 'enum'], true);
        if(!types){
            // generic backup types
            types = [
                "application/pdf",
                "application/zip",
                "application/msword",
                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "text/plain",
                "text/tab-separated-values",
                "image/jpeg",
                "image/tiff",
                "image/gif",
                "text/html",
                "image/png",
                "image/svs",
                "text/autosql"
            ];
        }
        return(types.toString());
    }

    handleChange(e){
        var attachment_props = {};
        var file = e.target.files[0];
        if(!file){
            this.props.modifyNewContext(this.props.nestedField, null, 'attachment', this.props.linkType, this.props.arrayIdx);
            return;
        }
        attachment_props.type = file.type;
        if(file.size) {attachment_props.size = file.size;}
        if(file.name) {attachment_props.download = file.name;}
        var fileReader = new window.FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onloadend = function (e) {
            if(e.target.result){
                attachment_props.href = e.target.result;
            }else{
                alert('There was a problem reading the given file.');
                return;
            }

        }.bind(this);
        this.props.modifyNewContext(this.props.nestedField, attachment_props, 'attachment', this.props.linkType, this.props.arrayIdx);
    }

    render(){
        const { value, field } = this.props;
        let attach_title;
        if (value && value.download){
            attach_title = value.download;
        } else {
            attach_title = "No file chosen";
        }
        const labelStyle = {
            'paddingRight':'5px',
            'paddingLeft':'5px'
        };

        // Is type=submit below correct?
        return(
            <div style={{ 'display': 'inherit' }}>
                <input id={"field_for_" + field} type="file" onChange={this.handleChange} style={{ 'display':'none' }} accept={this.acceptedTypes()}/>
                <button type="submit" className="btn btn-outline-dark">
                    <label className="text-400 mb-0" htmlFor={"field_for_" + field} style={labelStyle}>
                        { attach_title }
                    </label>
                </button>
            </div>
        );
    }
}



/**
 * Input for an s3 file upload. Context value set is local value of the filename.
 * Also updates this.state.file for the overall component. Runs file uploads
 * async using the upload_manager passed down in props.
 */
class S3FileInput extends React.Component{

    constructor(props){
        super(props);
        _.bindAll(this, 'modifyFile', 'handleChange', 'handleAsyncUpload', 'modifyRunningUploads',
            'cancelUpload', 'deleteField');
        this.state = {
            'percentDone': null,
            'sizeUploaded': null,
            'newFile': false,
            'status': null
        };
    }

    componentDidUpdate(pastProps){
        const { upload, uploadStatus } = this.props; // todo: rename upload to uploadManager?
        const { upload: pastUpload, uploadStatus: pastUploadStatus } = pastProps;
        if (upload !== null && pastUpload === null){
            this.handleAsyncUpload(upload);
        }
        if (uploadStatus !== pastUploadStatus){
            this.setState({ 'status': uploadStatus });
        }
    }

    modifyFile(val){
        this.props.setSubmissionState('file', val);
        if(val !== null){
            this.setState({
                'newFile': true,
                'status': null
            });
        }else{
            this.setState({
                'newFile': false,
                'status': null
            });
        }
    }

    /**
     * Handle file selection. Store the file in SubmissionView state and change
     * the filename context using modifyNewContext
     */
    handleChange(e){
        const { modifyNewContext, nestedField, linkType, arrayIdx, currContext } = this.props;
        const file = e.target.files[0];

        if (!file) return; // No file was chosen.

        const filename = file.name ? file.name : "unknown";

        // check Extensions
        let fileFormat = currContext.file_format;
        if(!fileFormat.startsWith('/')){
            fileFormat = '/' + fileFormat;
        }
        var extensions = [];
        ajax.promise(fileFormat + '?frame=object').then((response) => {
            if (response['file_format'] && response['@id']){
                extensions = response.standard_file_extension ? [response.standard_file_extension] : [];
                if(response.other_allowed_extensions){
                    extensions = extensions.concat(response.other_allowed_extensions);
                }
                // Fail if "other" extension is not used and a valid extension is not provided
                if (extensions.indexOf("other") === -1 && !_.any(extensions, function(ext){return filename.endsWith(ext);})){
                    alert('File extension error! Please enter a file with one of the following extensions: ' + extensions.join(', '));
                    return;
                }

                modifyNewContext(nestedField, filename, 'file upload', linkType, arrayIdx);
                // calling modifyFile changes the 'file' state of top level component
                this.modifyFile(file);
            }else{
                alert('Internal file extension conflict.');
                return;
            }
        });
    }

    /**
     * Handle the async file upload which is coordinated by the file_manager held
     * in this.props.upload. Call this.props.updateUpload on failure or completion.
     */
    handleAsyncUpload(upload_manager){
        if (upload_manager === null){
            return;
        }
        upload_manager.on('httpUploadProgress',
            (evt) => {
                const percentage = Math.round((evt.loaded * 100) / evt.total);
                this.modifyRunningUploads(percentage, evt.total);
            })
            .send((err, data) => {
                if (err){
                    this.modifyRunningUploads(null, null);
                    this.props.updateUpload(null, false, true);
                    alert("File upload failed!");
                } else {
                    this.modifyRunningUploads(null, null);
                    // this will finish roundTwo for the file
                    this.props.updateUpload(null, true);
                }
            });
    }

    /*
    Set state to reflect new upload percentage and size complete for the given upload
    */
    modifyRunningUploads(percentage, size){
        this.setState({
            'percentDone': percentage,
            'sizeUploaded': size
        });
    }

    cancelUpload(e){
        e.preventDefault();
        if(this.state.percentDone === null || this.props.upload === null){
            return;
        }
        this.props.upload.abort();
    }

    deleteField(e){
        e.preventDefault();
        this.props.modifyNewContext(this.props.nestedField, null, 'file upload', this.props.linkType, this.props.arrayIdx);
        this.modifyFile(null);
    }

    render(){
        const { value, md5Progress, upload, field } = this.props;
        const { newFile, percentDone, sizeUploaded, status } = this.state;
        let statusTip = status;
        let showDelete = false;
        let filename_text = "No file chosen";
        if (value){
            if(newFile){
                if (md5Progress === null && upload === null){
                    showDelete = true;
                }
                filename_text = value;
            } else {
                statusTip = 'Previous file: ' + value;
            }
        }
        const disableFile = md5Progress !== null || upload !== null;
        return(
            <div>
                <div>
                    <input id={"field_for_" + field} type="file" onChange={this.handleChange} disabled={disableFile} style={{ 'display':'none' }} />
                    <button type="submit" disabled={disableFile} style={{ 'padding':'0px' }} className="btn btn-outline-dark">
                        <label className="text-400" htmlFor={"field_for_" + field}
                            style={{ 'paddingRight':'12px','paddingTop':'6px','paddingBottom':'6px','paddingLeft':'12px','marginBottom':'0px' }}>
                            { filename_text }
                        </label>
                    </button>
                    <Fade in={showDelete}>
                        <div className="pull-right">
                            <button type="button" className="btn btn-danger" disabled={!showDelete} onClick={this.deleteField} tabIndex={2}>
                                <i className="icon icon-fw icon-times fas"/>
                            </button>
                        </div>
                    </Fade>
                </div>
                {statusTip ?
                    <div style={{ 'color':'#a94442', 'paddingTop':'10px' }}>
                        {statusTip}
                    </div>
                    :
                    null
                }
                { md5Progress ?
                    <div style={{ 'paddingTop':'10px' }}>
                        <i className="icon icon-spin icon-circle-o-notch" style={{ 'opacity': '0.5' }}></i>
                        <span style={{ 'paddingLeft': '10px' }}>
                            {'Calculating MD5... ' +  md5Progress + '%'}
                        </span>
                    </div>
                    :
                    null
                }
                { percentDone !== null ?
                    <div className="row" style={{ 'paddingTop':'10px' }}>
                        <div className="col-3 col-sm-3 pull-left">
                            <a href="" style={{ 'color':'#a94442', 'paddingLeft':'10px' }} onClick={this.cancelUpload} title="Cancel">
                                {'Cancel upload'}
                            </a>
                        </div>
                        <div className="col-9 col-sm-9 pull-right">
                            <div>
                                <div className="pull-left">{ percentDone + "% complete"}</div>
                                <div className="pull-right">{"Total size: " + sizeUploaded}</div>
                            </div>
                            <ProgressBar percent={percentDone} strokeWidth="1" strokeColor="#388a92" />
                        </div>
                    </div>
                    :
                    null
                }
            </div>
        );
    }
}



/**
 * Accepts a 'value' prop (which should contain a colon, at minimum) and present two fields for modifying its two parts.
 *
 * First part is name of a "submits_for" lab, second part is any custom string identifier.
 * Present a drop-down for submit_for lab selection, and text input box for identifier.
 * On change of either inputs, calls 'onAliasChange' function callback, passing the new modified value (including colon) as parameter.
 */
export class AliasInputField extends React.Component {

    static emailToString(email){
        return email.replace('@', "_at_");
    }

    static getInitialSubmitsForFirstPart(submitter){
        const submits_for_list = (submitter && Array.isArray(submitter.submits_for) && submitter.submits_for.length > 0 && submitter.submits_for) || null;
        const primaryLab = (submitter && submitter.lab) || null;
        const primaryLabID = primaryLab && object.itemUtil.atId(primaryLab);

        if (!submits_for_list){ // Fallback to using submitter ID.
            return AliasInputField.emailToString(submitter.email);
        }

        if (primaryLabID && primaryLab.name && _.map(submits_for_list, object.itemUtil.atId).indexOf(primaryLabID) > -1) {
            return primaryLab.name;
        } else {
            return submits_for_list[0].name;
        }
    }

    static propTypes = {
        'value' : PropTypes.string.isRequired,
        'onAliasChange' : PropTypes.func.isRequired,
        'currentSubmittingUser' : PropTypes.shape({
            'submits_for' : PropTypes.arrayOf(PropTypes.shape({
                'name' : PropTypes.string,
                'display_title' : PropTypes.string
            }))
        }).isRequired,
        'errorMessage' : PropTypes.string, // String or null
        'isValid': PropTypes.bool
    };

    static defaultProps = {
        'value' : ':'
    };

    static splitInTwo(str){
        var parts = (str || ':').split(':');
        if (parts.length > 2){
            return [ parts[0], parts.slice(1).join(':') ];
        }
        return parts;
    }

    constructor(props){
        super(props);
        _.bindAll(this, 'onAliasSecondPartChange', 'onAliasFirstPartChange', 'onAliasFirstPartChangeTyped',
            'getInitialSubmitsForPart', 'finalizeAliasPartsChange'
        );
    }

    getInitialSubmitsForPart(){
        const { currentSubmittingUser } = this.props;
        return AliasInputField.getInitialSubmitsForFirstPart(currentSubmittingUser);
    }

    finalizeAliasPartsChange(aliasParts){
        const { onAliasChange } = this.props;
        // Also check to see if need to add first or second part, e.g. if original value passed in was '' or null.
        if (!aliasParts[0] || aliasParts[0] === '') {
            aliasParts[0] = this.getInitialSubmitsForPart();
        }
        if (aliasParts.length === 1){
            aliasParts[1] = '';
        }
        onAliasChange(aliasParts.join(':'));
    }

    onAliasFirstPartChangeTyped(evt){
        var newValue = evt.target.value || '';
        return this.onAliasFirstPartChange(newValue, evt);
    }

    onAliasFirstPartChange(evtKey, e){
        const { value } = this.props;
        e.preventDefault();
        const firstPartOfAlias = evtKey;
        const aliasParts = AliasInputField.splitInTwo(value);
        aliasParts[0] = firstPartOfAlias;
        this.finalizeAliasPartsChange(aliasParts);
    }

    onAliasSecondPartChange(e){
        const { value } = this.props;
        e.preventDefault();
        const secondPartOfAlias = e.target.value;
        const aliasParts = AliasInputField.splitInTwo(value);
        aliasParts[1] = secondPartOfAlias;
        this.finalizeAliasPartsChange(aliasParts);
    }

    render(){
        const { currentSubmittingUser, errorMessage, withinModal, value, isValid, showErrorMsg } = this.props;
        const parts = AliasInputField.splitInTwo(value);
        const submits_for_list = (currentSubmittingUser && Array.isArray(currentSubmittingUser.submits_for) && currentSubmittingUser.submits_for.length > 0 && currentSubmittingUser.submits_for) || null;
        const initialDefaultFirstPartValue = this.getInitialSubmitsForPart();
        const currFirstPartValue = (parts.length > 1 && parts[0]) || initialDefaultFirstPartValue;
        // const userEmailAsPrefix = AliasInputField.emailToString(currentSubmittingUser.email); // TODO - maybe have as dropdown option
        let firstPartSelect;

        if (currentSubmittingUser && Array.isArray(currentSubmittingUser.groups) && currentSubmittingUser.groups.indexOf('admin') > -1){
            // Render an ordinary input box for admins (can specify any lab).
            firstPartSelect = (
                <input type="text" inputMode="latin" id="firstPartSelect" value={currFirstPartValue || ''}
                    placeholder={"Lab (default: " + initialDefaultFirstPartValue + ")"} onChange={this.onAliasFirstPartChangeTyped}
                    style={{ 'paddingRight' : 8, 'borderRight' : 'none' }}
                    className={"form-control" + (errorMessage ? " is-invalid" : isValid ? " is-valid" : "")} />
            );
        } else if (submits_for_list && submits_for_list.length > 1){
            firstPartSelect = (
                <DropdownButton className={"alias-lab-select form-control alias-first-part-input" + (errorMessage ? " is-invalid" : "") }
                    id="firstPartSelect" variant="light"
                    onSelect={this.onAliasFirstPartChange} as={InputGroup.Prepend}
                    title={(parts.length > 1 && (
                        <span className="text-400 d-flex justify-content-between align-items-center">
                            <small>Lab:&nbsp;</small>
                            <span className="text-ellipsis-container" style={{ maxWidth : '80%' }}>
                                { ((parts[0] !== '' && parts[0]) || this.getInitialSubmitsForPart()) }
                            </span>
                        </span>
                    )) || 'Select a Lab'}>
                    {_.map(submits_for_list, (lab) =>
                        <DropdownItem key={lab.name} eventKey={lab.name}>
                            <span className="text-500">{ lab.name }</span> ({ lab.display_title })
                        </DropdownItem>
                    )}
                </DropdownButton>
            );
        } else { // Only 1 submits_for lab or 0 submits_for -- fallback to staticy thingy
            firstPartSelect = (
                <InputGroup.Prepend className="alias-lab-single-option">
                    <span className="input-group-text">
                        { currFirstPartValue }
                    </span>
                </InputGroup.Prepend>
            );
        }

        const outerClassName = "mb-0 alias-input-field form-group has-feedback" + (errorMessage? " is-invalid has-error" : isValid ? " is-valid" : "");
        return (
            <div className={outerClassName}>
                <div className="input-group">
                    { firstPartSelect }
                    <div className="input-group-prepend input-group-append input-group-addon colon-separator">
                        <span className="input-group-text">:</span>
                    </div>
                    <input type="text" id="aliasInput" inputMode="latin" value={parts[1] || ''}
                        autoFocus={withinModal && !parts[1] ? true : false} placeholder="Type in a new identifier"
                        onChange={this.onAliasSecondPartChange} className={"form-control" + (errorMessage ? " is-invalid" : isValid ? " is-valid" : "")} />
                </div>
                { showErrorMsg && errorMessage ? <div className="invalid-feedback d-block text-right">{ errorMessage }</div> : null }
            </div>
        );
    }

}


export class AliasInputFieldValidated extends React.PureComponent {

    static defaultProps = {
        errorValue: "ERROR",
        skipValidateAliases: [],
        rejectAliases: []
    };

    constructor(props){
        super(props);
        this.doValidateAlias = this.doValidateAlias.bind(this);
        this.onAliasChange = this.onAliasChange.bind(this);
        this.request = null;
        this.state = {
            value: props.value || AliasInputField.defaultProps.value,
            isValid: null,
            errorMessage: null
        };
    }

    doValidateAlias(alias){
        const { onAliasChange, errorValue } = this.props;
        if (this.request){
            this.request.abort();
            this.request = null;
        }
        let currReq = null;
        const cb = (res) => {
            if (!this.request || (this.request && this.request !== currReq)) {
                // A newer request has been launched, cancel this
                // to prevent accidental overwrites or something.
                return;
            }
            this.request = null;
            if (res.code !== 404){
                // Not valid - something exists already.
                onAliasChange(errorValue);
                this.setState({ errorMessage: "Alias " + alias + " already exists", isValid: false });
                return;
            }
            onAliasChange(alias);
            this.setState({ isValid: true, errorMessage: null });
        };

        currReq = this.request = ajax.load("/" + alias, cb, 'GET', cb);
    }

    onAliasChange(nextAlias){
        const { onAliasChange, errorValue, skipValidateAliases = [], rejectAliases = [] } = this.props;

        this.request && this.request.abort();
        this.request = null;

        this.setState({ value: nextAlias }, ()=>{
            const { value } = this.state;
            const [ firstPart, secondPart ] = value.split(':');
            if (!firstPart || !secondPart){
                onAliasChange(null);
                this.setState({ errorMessage: "Part of alias is blank. Will be excluded." });
                return;
            }
            const passedRegex = (new RegExp('^\\S+:\\S+$')).test(value);
            if (!passedRegex){
                onAliasChange(errorValue);
                this.setState({ errorMessage: "Aliases must be formatted as: <text>:<text> (e.g. dcic-lab:42)." });
                return;
            }
            if (rejectAliases.length > 0 && rejectAliases.indexOf(nextAlias) > -1){
                // Presume is saved in database as this, skip validation.
                onAliasChange("ERROR");
                this.setState({ errorMessage: "Alias rejected, make sure is not used already." });
                return;
            }
            if (skipValidateAliases.length > 0 && skipValidateAliases.indexOf(nextAlias) > -1){
                // Presume is saved in database as this, skip validation.
                onAliasChange(nextAlias);
                this.setState({ errorMessage: null });
                return;
            }
            this.doValidateAlias(value);
        });
    }

    render(){
        return <AliasInputField {...this.props} {...this.state} onAliasChange={this.onAliasChange} />;
    }
}



class InfoIcon extends React.PureComponent {

    fieldTypeDescriptor(){
        const { fieldType, schema } = this.props;
        if (typeof fieldType !== 'string' || fieldType.length === 0) return null;

        let type = valueTransforms.capitalizeSentence(fieldType === 'array' ? ArrayField.typeOfItems(schema.items) : fieldType);
        if (fieldType === 'array'){
            type = type + ' <span class="array-indicator">[]</span>';
        }
        return type;

    }

    render() {
        const { children, title, fieldType, className } = this.props;
        if (!children || typeof children !== 'string') return null;
        let tip = children;
        if (typeof title === 'string' && title.length > 0){
            tip = '<h5 class="mt-03 mb-05 text-600">' + title + '</h5>' + tip;
        }
        if (typeof fieldType === 'string' && fieldType.length > 0){
            tip += '<h6 class="mt-07 text-300">Field Type: <span class="text-400">' + this.fieldTypeDescriptor() + '</span></h6>';
        }
        return (
            <i className={"icon icon-info-circle fas" + (className? ' ' + className : '')} data-tip={tip} data-html/>
        );
    }
}



export function isValueNull(value){
    if (value === null) return true;
    if (typeof value === 'undefined') return true;
    if (typeof value === 'number') return false;
    if (value === '') return true;
    if (Array.isArray(value)){
        if (value.length === 0) return true;
        else if (_.every(value, isValueNull)) {
            return true;
        }
        else return false;
    }
    if (typeof value === 'object'){
        var keys = _.keys(value);
        if (keys.length === 0) return true;
        else if ( _.every(keys, function(k){ return isValueNull(value[k]); }) ) return true;
    }
    return false;
}
