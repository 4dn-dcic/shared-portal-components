import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import ReactTooltip from 'react-tooltip';
import FormControl from 'react-bootstrap/esm/FormControl';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';
import DropdownButton from 'react-bootstrap/esm/DropdownButton';
import ProgressBar from 'react-bootstrap/esm/ProgressBar';


import Fade from 'react-bootstrap/esm/Fade';
import { Checkbox } from './Checkbox';
import { ajax, console, object, valueTransforms } from './../../util';
import { BasicStaticSectionBody } from './../../static-pages/BasicStaticSectionBody';
import { SearchAsYouTypeLocal } from './SearchAsYouTypeLocal';
import { SubmissionViewSearchAsYouTypeAjax, SquareButton, LinkedObj } from './SearchAsYouTypeAjax';
import { Alerts } from './../../ui/Alerts';
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
        if (Array.isArray(fieldSchema.enum)){ // not sure why this is here if suggested_enum doesn't even appear when is a field with that type
            fieldType = 'enum';
        }
        if (Array.isArray(fieldSchema.suggested_enum)){
            fieldType = "suggested_enum";
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
            'displayField', 'handleDropdownButtonToggle',
            'handleEnumChange', 'submitSuggestedEnumVal',
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
        const { field, value, disabled, enumValues, currentSubmittingUser, roundTwo, currType, currContext, keyDisplay, selectComplete, fieldType : propFieldType } = this.props;
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
                <Checkbox {..._.omit(inputProps, 'value', 'placeholder', 'ref')} checked={!!(value)}>
                    <span style={{ 'verticalAlign' : 'middle', 'textTransform' : 'capitalize' }}>
                        { typeof value === 'boolean' ? value + '' : null }
                    </span>
                </Checkbox>
            );
            case 'enum'             : return (
                <span className="input-wrapper">
                    <SearchAsYouTypeLocal searchList={enumValues} value={value} allowCustomValue={false}
                        filterMethod="includes" onChange={this.handleEnumChange} maxResults={3}/>
                </span>
            );
            case 'suggested_enum'   : return (
                <span className="input-wrapper">
                    <SearchAsYouTypeLocal searchList={enumValues} value={value} allowCustomValue={true}
                        filterMethod="includes" onChange={this.handleEnumChange} maxResults={3}/>
                </span>
            );
            case 'linked object'    : return (
                <div className="input-wrapper">
                    <SubmissionViewSearchAsYouTypeAjax value={value} allowCustomValue={false}
                        {...this.props} idToTitleMap={keyDisplay} />
                </div>
            );
            case 'array'            : return <ArrayField {...this.props} pushArrayValue={this.pushArrayValue} value={value || null} roundTwo={roundTwo} />;
            case 'object'           : return <ObjectField {...this.props} />;
            case 'attachment'       : return <div style={{ 'display':'inline' }}><AttachmentInput {...this.props}/></div>;
            case 'file upload'      : return <S3FileInput {...this.props} />;
        }
        // Fallback
        return <div>No field for this case yet.</div>;
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

    handleDropdownLinkToChange(resultItem){
        modifyNewContext(nestedField, resultItem['@id'], fieldType, linkType, arrayIdx, null, resultItem.display_title);
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
            // initialize with empty obj
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
                        <h5 className="submission-field-title text-truncate">
                            { this.labelTypeDescriptor() }
                            { fieldTip ?
                                <InfoIcon className="me-07" title={title} fieldType={fieldType} schema={schema}>{ fieldTip }</InfoIcon>
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
            <React.Fragment key={field + '.' + (arrayIdx || '')}>
                <div className={'field-column col' + extClass}>{ fieldToDisplay }</div>
                { excludeRemoveButton ? null : <SquareButton show={showDelete} disabled={disableDelete} tip={isArray ? 'Remove Item' : 'Clear Value'} onClick={this.deleteField} /> }
            </React.Fragment>
        );
    }
}



//var linkedObjChildWindow = null; // Global var



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
        let fieldType = itemSchema.type ? itemSchema.type : "text";
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
        const { maxItems } = schema;

        if (ArrayField.shouldPushArrayValue(value, field)){
            if (maxItems && typeof maxItems === "number" && value.length === maxItems) {
                Alerts.queue({
                    'title': "Warning (\"" + linkType + "\")",
                    'message': 'You have reached the limit for the field "' + linkType + '" constrained to "maxItems: ' + maxItems + '".',
                    'style': 'warning'
                });
                return;
            }
            pushArrayValue();
        } else {
            if (Array.isArray(value) && value.length >= 2){
                if (isValueNull(value[value.length - 1]) && isValueNull(value[value.length - 2])) {
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
        const enumValues = fieldSchema.enum || fieldSchema.suggested_enum || []; // check if this is an enum

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
                    {...{ value, fieldTip, fieldType, title, enumValues }}
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
        const showAddButton = (typeof propSchema.maxItems !== "number") && !isValueNull(values[valuesToRender.length - 1]);

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
    };

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
                enumValues = fieldSchema.enum || [];
            } else if (fieldType === "suggested_enum") {
                enumValues = fieldSchema.suggested_enum || [];
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
                        <i className="icon icon-spin icon-circle-notch" style={{ 'opacity': '0.5' }}></i>
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
                            <ProgressBar now={percentDone} animated />
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
                            <span className="text-truncate" style={{ maxWidth : '80%' }}>
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
                <span className="input-group-text">
                    { currFirstPartValue }
                </span>
            );
        }

        const outerClassName = "mb-0 alias-input-field form-group has-feedback" + (errorMessage? " is-invalid has-error" : isValid ? " is-valid" : "");
        return (
            <div className={outerClassName}>
                <div className="input-group">
                    { firstPartSelect }
                    <div className="colon-separator">
                        <span className="input-group-text">:</span>
                    </div>
                    <input type="text" id="aliasInput" inputMode="latin" value={parts[1] || ''}
                        autoFocus={withinModal && !parts[1] ? true : false} placeholder="Type in a new identifier"
                        onChange={this.onAliasSecondPartChange} className={"form-control" + (errorMessage ? " is-invalid" : isValid ? " is-valid" : "")} />
                </div>
                { showErrorMsg && errorMessage ? <div className="invalid-feedback d-block text-end">{ errorMessage }</div> : null }
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
