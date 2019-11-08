'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import ReactTooltip from 'react-tooltip';
import { Collapse } from './../../../ui/Collapse';
import { Fade } from './../../../ui/Fade';

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
        this.handleExpandListToggleClick = this.handleExpandListToggleClick.bind(this);

        this.memoized = {
            anyFacetsHaveSelection: memoize(FacetOfFacets.anyFacetsHaveSelection)
        };

        // Most of this logic (facetOpen/facetClosing at least) is same between this and FacetTermsList.
        // Maybe we could pull it out into reusable controller component. Maybe. Very low priority.
        this.state = {
            'facetOpen'     : typeof props.defaultGroupOpen === 'boolean' ? props.defaultGroupOpen : true,
            'facetClosing'  : false,
            'expanded'      : false
        };
    }

    componentDidUpdate(pastProps, pastState){
        const { facets: renderedFacets, mounted, defaultGroupOpen, isStatic } = this.props;
        const { mounted: pastMounted, defaultGroupOpen: pastDefaultOpen, isStatic: pastStatic } = pastProps;

        this.setState(({ facetOpen: currFacetOpen }) => {
            if (!pastMounted && mounted && typeof defaultGroupOpen === 'boolean' && defaultGroupOpen !== pastDefaultOpen) {
                return { 'facetOpen' : true };
            }
            if (defaultGroupOpen === true && !pastDefaultOpen && !currFacetOpen){
                return { 'facetOpen' : true };
            }
            if (currFacetOpen && isStatic && !pastStatic && !this.memoized.anyFacetsHaveSelection(renderedFacets)){
                return { 'facetOpen' : false };
            }
            return null;
        }, ()=>{
            const { facetOpen } = this.state;
            if (pastState.facetOpen !== facetOpen){
                ReactTooltip.rebuild();
            }
        });
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
        const { title, facets: renderedFacets, filters, tooltip, defaultGroupOpen } = this.props;
        const { facetOpen, facetClosing } = this.state;

        const anySelections = this.memoized.anyFacetsHaveSelection(renderedFacets);

        // Ensure all facets within group are not "static single terms".
        const extendedFacets = React.Children.map(renderedFacets, function(renderedFacet){
            return React.cloneElement(renderedFacet, { isStatic: false });
        });

        return (
            <div className={"facet" + (facetOpen ? ' open' : ' closed') + (facetClosing ? ' closing' : '')} data-field={title}>
                <h5 className="facet-title" onClick={this.handleOpenToggleClick}>
                    <span className="expand-toggle col-auto px-0">
                        <i className={"icon icon-fw fas " + (facetOpen && !facetClosing ? "icon-minus" : "icon-plus")}/>
                    </span>
                    <span className="inline-block col px-0" data-tip={tooltip} data-place="right">{ title }</span>
                    <Fade in={facetClosing || !facetOpen}>
                        <span className={"closed-terms-count col-auto px-0" + (anySelections ? " some-selected" : "")}
                            data-tip={`Nested filters (${extendedFacets.length}) ${ anySelections ? " with at least 1 selected." : ""}`}>
                            <i className={"icon fas icon-layer-group" } style={{ opacity: anySelections ? 0.75 : 0.25 }}/>
                        </span>
                    </Fade>
                </h5>
                <Collapse in={facetOpen && !facetClosing}>
                    <div className="ml-2">
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
    'filters'                    : PropTypes.arrayOf(PropTypes.object).isRequired,
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