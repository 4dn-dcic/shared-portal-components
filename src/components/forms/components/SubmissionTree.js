import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import ReactTooltip from 'react-tooltip';
import Collapse from 'react-bootstrap/esm/Collapse';


// Create a custom tree to represent object hierarchy in front end submission.
// Each leaf is clickable and will bring you to a view of the new object
export class SubmissionTree extends React.PureComponent {

    static propTypes = {
        'hierarchy'         : PropTypes.object.isRequired,
        'keyValid'          : PropTypes.object.isRequired,
        'keyTypes'          : PropTypes.object.isRequired,
        'keyDisplay'        : PropTypes.object.isRequired,
        'keyComplete'       : PropTypes.object.isRequired,
        'currKey'           : PropTypes.number.isRequired,
        'keyLinkBookmarks'  : PropTypes.object.isRequired,
        'keyLinks'          : PropTypes.object.isRequired,
        'setSubmissionState': PropTypes.func.isRequired,
        'schemas'           : PropTypes.object,
    };

    componentDidMount(){
        ReactTooltip.rebuild();
    }

    render() {
        const infoTip = '<h5>This panel is for navigating between objects in the creation process</h5> Click on Item/dependency titles to navigate around and edit each individually. Dependencies must be submitted before their parent can be.';
        const { keyIdx, ...others } = this.props;
        return(
            <div className="submission-view-navigation-tree">
                <h4 className="form-section-heading mb-08">Navigation <InfoIcon>{infoTip}</InfoIcon></h4>
                <SubmissionLeaf {...others} keyIdx={0} open />
            </div>
        );
    }
}

/*
Generate an entry in SubmissionTree that corresponds to an object. When clicked
on, either change the currKey to that object's key if a custom object, or
open that object's page in a new tab if a pre-existing or submitted object.
*/
class SubmissionLeaf extends React.PureComponent {

    static defaultProps = {
        'depth' : 0
    };

    constructor(props){
        super(props);
        this.handleClick = _.throttle(this.handleClick.bind(this), 500, { 'trailing' : false });
        this.generateAllPlaceholders = this.generateAllPlaceholders.bind(this);
        this.placeholderSortFxn = this.placeholderSortFxn.bind(this);
        this.generateChild = this.generateChild.bind(this);
        this.state = { 'open' : typeof props.open === 'boolean' ? props.open : true };
    }

    generateChild(childKey){
        if (!isNaN(childKey)) childKey = parseInt(childKey);
        const { hierarchy, keyIdx, depth } = this.props;

        // replace key and hierarchy in props
        return <SubmissionLeaf {...this.props} key={childKey} keyIdx={childKey} hierarchy={hierarchy[keyIdx]} open depth={depth + 1} />;
    }

    placeholderSortFxn(fieldA, fieldB){
        const { schemas, keyTypes, keyIdx } = this.props;
        const itemSchema = schemas[keyTypes[keyIdx]];
        if (!itemSchema) return 0;
        const [ fieldABase ] = fieldA.split('.');
        const [ fieldBBase ] = fieldB.split('.');

        if (Array.isArray(itemSchema.required)){
            if (_.contains(itemSchema.required, fieldA)) return -1;
            if (_.contains(itemSchema.required, fieldB)) return 1;
            if (_.contains(itemSchema.required, fieldABase)) return -1;
            if (_.contains(itemSchema.required, fieldBBase)) return -1;
        }

        const fieldASchema = itemSchema.properties[fieldABase];
        const fieldBSchema = itemSchema.properties[fieldBBase];

        if ((fieldASchema.lookup || 750) > (fieldBSchema.lookup || 750)) return -1;
        if ((fieldASchema.lookup || 750) < (fieldBSchema.lookup || 750)) return 1;

        return 0;
    }

    /**
     * Generate placeholders in the SubmissionTree for every linkTo name and
     * create a SubmissionLeaf for each child object under its corresponding
     * placholder.
     *
     * @returns {JSX.Element} Visible leaf/branch-representing element.
     */
    generateAllPlaceholders(){
        const { keyIdx, keyLinkBookmarks } = this.props;
        const fieldsWithLinkTosToShow = keyLinkBookmarks[keyIdx].sort(this.placeholderSortFxn);
        return _.map(fieldsWithLinkTosToShow, (field) => <SubmissionProperty {...this.props} field={field} key={field} /> );
    }

    /** Open a new tab on click or change the currKey of submissionView to that of props.keyIdx */
    handleClick(e){
        const { setSubmissionState, keyIdx, keyValid, keyComplete } = this.props;
        e.preventDefault();

        // if key is not a number (i.e. path), the object is not a custom one.
        // format the leaf as the following if pre-existing obj or submitted
        // custom object.
        if (isNaN(keyIdx) || (keyValid[keyIdx] === 4 && keyComplete[keyIdx])){
            const win = window.open(isNaN(keyIdx) ? keyIdx : keyComplete[keyIdx], '_blank');
            if (win){
                win.focus();
            } else {
                alert('Object page popup blocked!');
            }
            return;
        }

        setSubmissionState('currKey', keyIdx);
    }

    render() {
        const { keyValid, keyIdx, keyDisplay, keyComplete, hierarchy, currKey, depth } = this.props;

        let placeholders;
        if (!isNaN(keyIdx)/* || typeof _.invert(keyComplete)[keyIdx] !== 'undefined' */) {
            placeholders = this.generateAllPlaceholders();
        } else if (typeof _.invert(keyComplete)[keyIdx] !== 'undefined') {
            placeholders = [];
        } else {
            // must be a submitted object - plot directly
            placeholders = _.keys(hierarchy[keyIdx]).map(this.generateChild);
        }

        const titleText = keyDisplay[keyIdx] || keyIdx;
        let iconClass;
        let extIcon;
        let statusClass = null;
        let isCurrentlySelected = false;
        let tip = null;

        // if key is not a number (i.e. path), the object is not a custom one.
        // format the leaf as the following if pre-existing obj or submitted
        // custom object.
        if (isNaN(keyIdx) || (keyValid[keyIdx] === 4 && keyComplete[keyIdx])){
            statusClass = 'existing-item';
            iconClass = "icon-hdd far";
            tip = "Successfully submitted or pre-existing item; already exists in the database.<br>Click to view this item/dependency in new tab/window.";
            extIcon = <i className="icon icon-external-link-alt fas" />;

        } else {
            switch (keyValid[keyIdx]){
                case 0:
                    statusClass = 'not-complete';
                    iconClass = "icon-stop-circle far";
                    tip = "Has incomplete children, cannot yet be validated.";
                    break;
                case 1:
                    statusClass = 'complete-not-validated';
                    iconClass = "icon-circle far";
                    tip = "All children are complete, can be validated.";
                    break;
                case 2:
                    statusClass = 'failed-validation';
                    iconClass = "icon-times fas";
                    tip = "Validation failed. Fix fields and try again.";
                    break;
                case 3:
                    statusClass = 'validated';
                    iconClass = "icon-check fas";
                    tip = "Validation passed, ready for submission.";
                    break;
                default:
                    statusClass = 'status-not-determined';
                    break;
            }
        }

        const icon = <i className={"icon indicator-icon " + iconClass}/>;

        if (keyIdx === currKey){ // We're currently on this Item
            isCurrentlySelected = true;
            extIcon = <i className="icon icon-pencil pull-right fas" data-tip="Item which you are currently editing." />;
        }

        return (
            <div className={"submission-nav-leaf linked-item-title leaf-depth-" + (depth) + (isCurrentlySelected ? ' active' : '')}>
                <div className={"clearfix inner-title " + statusClass} onClick={this.handleClick} data-tip={tip} data-html>
                    { icon }
                    <span className="title-text">{titleText}</span>
                    { extIcon }
                </div>
                { placeholders && placeholders.length > 0 ?
                    <div className="list-of-properties">{ placeholders }</div>
                    : null }
            </div>
        );
    }
}

class SubmissionProperty extends React.Component {

    constructor(props){
        super(props);
        this.handleToggle = _.throttle(this.handleToggle.bind(this), 500, { 'trailing' : false });
        this.generateChild = this.generateChild.bind(this);
        this.state = { 'open' : typeof props.open === 'boolean' ? props.open : true };
    }

    handleToggle(e){
        e.preventDefault();
        e.stopPropagation();
        this.setState(function({ open }){
            return { "open" : !open };
        });
    }

    generateChild(childKey){
        const { keyIdx, depth, hierarchy } = this.props;
        if (!isNaN(childKey)) childKey = parseInt(childKey);

        // replace key and hierarchy in props
        return <SubmissionLeaf {...this.props} key={childKey} keyIdx={childKey} hierarchy={hierarchy[keyIdx]} open depth={depth + 1} />;
    }

    render(){
        const { field, schemas, keyTypes, keyIdx, hierarchy, keyLinks, depth } = this.props;
        const { open } = this.state;

        // Item currently being edited
        const itemSchema = schemas[keyTypes[keyIdx]];
        if (!itemSchema) return null;

        const isRequired = Array.isArray(itemSchema.required) && _.contains(itemSchema.required, field);
        const [ fieldBase ] = field.split('.');
        const fieldSchema = itemSchema.properties[fieldBase];
        const bookmark = (fieldSchema && fieldSchema.title) || fieldSchemaLinkToType(fieldSchema);

        const children = _.map(
            _.filter(_.keys(hierarchy[keyIdx]), function(childKey){
                return keyLinks[childKey] === field;
            }),
            this.generateChild
        );

        const noChildren = children.length === 0;

        return(
            <div key={bookmark} className={"submission-nav-leaf linked-item-type-name leaf-depth-" + depth + (isRequired ? ' is-required' : '') + (!noChildren ? ' has-children' : '' )}>
                <div className={"clearfix inner-title" + (!noChildren ? ' clickable' : '')} onClick={!noChildren ? this.handleToggle : undefined}>
                    <i className={"icon property-expand-icon fas icon-" + (open ? 'minus' : 'plus')}/>
                    <span>{ children.length } { bookmark || field }</span>
                </div>
                { !noChildren ?
                    <Collapse in={open}><div className="children-container">{ children }</div></Collapse>
                    : null }
            </div>
        );
    }

}




function InfoIcon({ children, className }){
    if (!children) return null;
    return (
        <i style={{ "marginLeft":"6px", 'fontSize':'0.8em' }} className={"icon fas icon-info-circle" + (className ? ' ' + className : '')}
            data-place="right" data-html={true} data-tip={children}/>
    );
}


/**
 * Function to recursively find whether a schema for a field contains a linkTo to
 * another Item within its nested structure.
 *
 * @param {{ title: string, type: string, linkTo: string }} json - A schema for a field.
 * @param {boolean} [getProperty=false] - Unused? What is this supposed to do?
 * @returns {string|null} The `@type` of the linkTo Item referenced in the field schema, if any, else null.
 */
export function fieldSchemaLinkToType(json, getProperty=false){
    var currKeys = _.keys(json), key, value;

    for (var i = 0; i < currKeys.length; i++){
        key = currKeys[i];
        value = json[key];
        if (key === 'linkTo') {
            return value;
        } else if (value !== null && typeof value === 'object'){
            var test = fieldSchemaLinkToType(value);
            if (test !== null) {
                return test;
            }
        }
    }
}

/**
 * Returns list of recursed/nested keys from fieldSchema which contains linkTo, or true if direct linkTo on fieldSchema itself.
 *
 * @param {{ 'title':string, 'type':string, 'linkTo':string }} json - Schema for a field.
 * @returns {string[]|boolean} True if current field is linkTo, else field keys which contain nested linkTos.
 */
export function fieldSchemaLinkToPath(json){
    var jsonKeys = _.keys(json), key;
    for (var i = 0; i < jsonKeys.length; i++){
        key = jsonKeys[i];
        if (key === 'linkTo') {
            return true;
        } else if (json[key] !== null && typeof json[key] === 'object') {
            var test = fieldSchemaLinkToPath(json[key]);
            if (test === true){
                return [key];
            } else if (Array.isArray(test)){
                return [key].concat(test);
            } else {
                continue;
            }
        }
    }
}
