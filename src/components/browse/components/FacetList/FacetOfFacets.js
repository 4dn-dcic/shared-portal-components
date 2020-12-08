'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import Collapse from 'react-bootstrap/esm/Collapse';
import Fade from 'react-bootstrap/esm/Fade';

/**
 * Used to render individual facet fields and their available terms in FacetList.
 */
export class FacetOfFacets extends React.PureComponent {


    static anyFacetsHaveSelection(renderedFacets){
        for (let facetIdx = 0; facetIdx < renderedFacets.length; facetIdx++){
            const renderedFacet = renderedFacets[facetIdx]; // We have rendered facets as `props.facets`
            const { anyTermsSelected: anySelected } = renderedFacet.props;
            if (anySelected) {
                return true;
            }
        }
        return false;
    }

    constructor(props){
        super(props);
        this.handleOpenToggleClick = this.handleOpenToggleClick.bind(this);
        this.memoized = {
            anyFacetsHaveSelection: memoize(FacetOfFacets.anyFacetsHaveSelection)
        };
    }

    handleOpenToggleClick(e) {
        e.preventDefault();
        const { onToggleOpen, title: groupTitle, facetOpen = false } = this.props;
        onToggleOpen("group:" + groupTitle, !facetOpen);
    }

    render() {
        const { title, children: renderedFacets, tooltip: propTip, facetOpen, openFacets = {} } = this.props;
        const anySelections = this.memoized.anyFacetsHaveSelection(renderedFacets);

        let tooltip = propTip || "Group of facets containing "; // We'll append to this in .map loop below if !propTip.

        // Ensure all facets within group are not "static single terms".
        // Pass in facetOpen prop.
        const extendedFacets = React.Children.map(renderedFacets, function(renderedFacet, i){
            const { facet : { field, title: childTitle } } = renderedFacet.props;
            if (!propTip) {
                tooltip += (i === 0 ? "" : ", ") + childTitle;
            }
            return React.cloneElement(renderedFacet, { isStatic: false, facetOpen: openFacets[field] });
        });

        return (
            <div className={"facet" + (facetOpen || anySelections ? ' open' : ' closed')} data-group={title}>
                <h5 className="facet-title" onClick={this.handleOpenToggleClick}>
                    <span className="expand-toggle col-auto px-0">
                        <i className={"icon icon-fw icon-" + (anySelections ? "dot-circle far" : (facetOpen ? "minus fas" : "plus fas"))}/>
                    </span>
                    <div className="col px-0 line-height-1">
                        <span data-tip={tooltip} data-place="right">{ title }</span>
                    </div>
                    <Fade in={!facetOpen && !anySelections}>
                        <span className={"closed-terms-count col-auto px-0" + (anySelections ? " some-selected" : "")} data-place="right"
                            data-tip={`Group of ${extendedFacets.length} facets ${ anySelections ? " with at least 1 having a selection." : ""}`}>
                            <i className="icon fas icon-layer-group" />
                        </span>
                    </Fade>
                </h5>
                <Collapse in={facetOpen || anySelections}>
                    <div className="facet-group-list-container">
                        { extendedFacets }
                    </div>
                </Collapse>
            </div>
        );
    }
}
FacetOfFacets.propTypes = {
    'defaultGroupOpen'          : PropTypes.bool,
    'facets'                    : PropTypes.arrayOf(PropTypes.element),
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