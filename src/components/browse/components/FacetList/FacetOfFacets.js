'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import { Collapse } from './../../../ui/Collapse';
import { Fade } from './../../../ui/Fade';

/**
 * Used to render individual facet fields and their available terms in FacetList.
 *
 * @memberof module:facetlist
 * @class Facet
 * @type {Component}
 */
export class FacetOfFacets extends React.PureComponent {
    constructor(props){
        super(props);
        this.handleOpenToggleClick = this.handleOpenToggleClick.bind(this);
        this.handleExpandListToggleClick = this.handleExpandListToggleClick.bind(this);
        this.state = {
            'facetOpen'     : typeof props.defaultFacetOpen === 'boolean' ? props.defaultFacetOpen : true,
            'facetClosing'  : false,
            'expanded'      : false
        };
    }

    handleOpenToggleClick(e) {
        e.preventDefault();
        this.setState(function({ facetOpen }){
            const willBeOpen = !facetOpen;
            if (willBeOpen) {
                return { 'facetOpen': true };
            } else {
                return { 'facetClosing': true };
            }
        }, ()=>{
            setTimeout(()=>{
                this.setState(function({ facetOpen, facetClosing }){
                    if (facetClosing){
                        return { 'facetOpen' : false, 'facetClosing' : false };
                    }
                    return null;
                });
            }, 350);
        });
    }

    handleExpandListToggleClick(e){
        e.preventDefault();
        this.setState(function({ expanded }){
            return { 'expanded' : !expanded };
        });
    }


    render() {
        const { title, facets, tooltip, areTermsSelected } = this.props;
        const { facetOpen, facetClosing } = this.state;

        return (
            <div className={"facet" + (facetOpen ? ' open' : ' closed') + (facetClosing ? ' closing' : '')} data-field={title}>
                <h5 className="facet-title" onClick={this.handleOpenToggleClick}>
                    <span className="expand-toggle col-auto px-0">
                        <i className={"icon icon-fw fas " + (facetOpen && !facetClosing ? "icon-minus" : "icon-plus")}/>
                    </span>
                    <span className="inline-block col px-0" data-tip={tooltip} data-place="right">{ title }</span>
                    <Fade in={facetClosing || !facetOpen}>
                        <span className={"closed-terms-count col-auto px-0" + (areTermsSelected ? " some-selected" : "")}
                            data-tip={`Nested filters (${facets.length}) ${ areTermsSelected ? " with at least 1 selected." : ""}`}>
                            <i className={"icon fas icon-layer-group" } style={{ opacity: areTermsSelected ? 0.75 : 0.25 }}/>
                        </span>
                    </Fade>
                </h5>
                <Collapse in={facetOpen && !facetClosing}>
                    <div className="ml-2">
                        { facets }
                    </div>
                </Collapse>
            </div>
        );
    }
}
FacetOfFacets.propTypes = {
    'areTermsSelected'          : PropTypes.bool,
    'defaultFacetOpen'          : PropTypes.bool,
    'facets'                    : PropTypes.arrayOf(PropTypes.element),
    'filters'                   : PropTypes.arrayOf(PropTypes.object).isRequired,
    'getTermStatus'             : PropTypes.func.isRequired,
    'href'                      : PropTypes.string.isRequired, // @todo: should this be required?
    'isStatic'                  : PropTypes.bool,
    'itemTypeForSchemas'        : PropTypes.string,
    'mounted'                   : PropTypes.bool,
    'onFilter'                  : PropTypes.func,           // Executed on term click
    'schemas'                   : PropTypes.object,
    'separateSingleTermFacets'  : PropTypes.bool,
    'termTransformFxn'          : PropTypes.func,
    'title'                     : PropTypes.string,
    'extraClassname'            : PropTypes.string
};