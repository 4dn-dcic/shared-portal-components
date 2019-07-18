'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import { Detail } from './../../ui/ItemDetailList';
import { FlexibleDescriptionBox } from './../../ui/FlexibleDescriptionBox';


export class SearchResultDetailPane extends React.PureComponent {

    static propTypes = {
        'result' : PropTypes.shape({
            '@id' : PropTypes.string,
            'display_title' : PropTypes.string,
            'description' : PropTypes.string
        }),
        'popLink' : PropTypes.bool,
        'schemas' : PropTypes.object,
        //'windowWidth' : PropTypes.number.isRequired
    };

    componentDidMount(){
        ReactTooltip.rebuild();
    }

    componentDidUpdate(pastProps, pastState){
        if (this.props.open && !pastProps.open) ReactTooltip.rebuild();
    }

    render (){
        const { result, popLink, schemas } = this.props;
        return (
            <div>
                { !result.description ? null : (
                    <div className="flex-description-container">
                        <h5><i className="icon icon-fw icon-align-left fas"/>&nbsp; Description</h5>
                        <FlexibleDescriptionBox
                            //windowWidth={this.props.windowWidth}
                            description={result.description}
                            fitTo="self"
                            textClassName="text-normal"
                            collapsedHeight="auto"
                            linesOfText={2} />
                        <hr className="desc-separator" />
                    </div>
                )}
                <div className="item-page-detail">
                    <h5 className="text-500"><i className="icon icon-fw icon-list fas"/>&nbsp; Details</h5>
                    <Detail context={result} open={false} popLink={popLink} schemas={schemas}/>
                </div>
            </div>
        );
    }
}
