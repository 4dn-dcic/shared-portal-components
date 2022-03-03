import React, { useMemo, useState, useRef } from 'react';
import memoize from 'memoize-one';
import PropTypes from 'prop-types';
import _ from 'underscore';
import Fade from 'react-bootstrap/esm/Fade';

import Popover from 'react-bootstrap/esm/Popover';


export function FacetListPopoverController (props) {
    const { children } = props;
    // In this state we will store the entirety of the Popover JSX to display
    // to allow flexibility in what to display in Popover contents
    // in case we add more types of Popovers later.
    const [ openPopoverID, setOpenPopoverID ] = useState(null);
    const adjustedChildren = React.Children.map(children, function(child){
        return React.cloneElement(child, { openPopoverID, setOpenPopoverID });
    });
    return (
        <React.Fragment>
            { adjustedChildren }

        </React.Fragment>
    );
}


/**
 * @todo Potentially refactor to use ReactDOM.createPortal along w. semi-opaque dark background that will close this onClick.
 * @todo Alternatively if we don't want the background, could attach event listener to window maybe..
 */
export const ExtendedDescriptionPopoverIcon = React.memo(function ExtendedDescriptionPopoverIcon (props) {
    const { facet, fieldSchema = null, openPopover, setOpenPopover } = props;
    const {
        title: facetTitle,
        field,
        extended_description: facetExtendedDescription = null
    } = facet;
    const {
        title: fieldTitle,
        extended_description: fieldExtendedDescription = null
    } = fieldSchema || {}; // May be null for 'calculated' or 'fake' fields.

    const target = useRef(null);

    const title = facetTitle || fieldTitle || field;
    const extendedDescription = facetExtendedDescription || fieldExtendedDescription;
    const idToUse = "extended_description_for_field_" + field;

    const { id: openPopoverID = null, target: openPoverTarget } = openPopover || {};
    const isOpen = openPopover && ((openPoverTarget === target) || (openPopoverID === idToUse));

    const onIconClick = function(e){
        e.stopPropagation();
        const willOpen = !isOpen;
        function dismissPopover(){
            setOpenPopover(null);
        }
        if (!willOpen) {
            dismissPopover();
        } else {
            setOpenPopover({
                id: idToUse,
                ref: target, // By time icon is clicked, this will be mounted.
                popover: (
                    <Popover>
                        <Popover.Title as="div">
                            <div className="row align-items-center">
                                <div className="col">
                                    <h5 className="text-600 my-0">{ title }</h5>
                                </div>
                                <div className="col-auto clickable" onClick={dismissPopover}>
                                    <i className="icon icon-times fas" />
                                </div>
                            </div>
                        </Popover.Title>
                        <Popover.Content>
                            <div className="popover-content-inner" dangerouslySetInnerHTML={{ __html: extendedDescription }} />
                        </Popover.Content>
                    </Popover>
                )
            });
        }
    };

    if (!extendedDescription) {
        return null;
    }


    // WARNING: extended_description is not sanitized, we control it, but todo: maybe run it through BasicStaticSectionBody or something.
    return (
        <div className="d-inline-block px-1" data-tip={isOpen ? "Click to close" : "Click for more information"} ref={target} onClick={onIconClick}>
            <i className={"icon icon-info-circle fas" + (isOpen ? " text-primary" : " text-secondary")} />
        </div>
    );

});
