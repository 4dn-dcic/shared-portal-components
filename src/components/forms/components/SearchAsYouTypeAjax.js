import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'underscore';

import { ajax } from '../../util/';

import { SearchSelectionMenu } from './SearchSelectionMenu';

export class SearchAsYouTypeAjax extends React.PureComponent {
    constructor() {
        super(props);
        this.state = {
            results : [],
            currentTextValue : this.props.value || "",
        };

        // this.onLoad = _.debounce(this.onLoad.bind(this), 500);
        this.makeFetch = _.debounce(this.makeFetch.bind(this), 500);
    }

    componentDidMount() {
        // send a http request for all items (limit 100), update state with results
        this.makeFetch();
    }

    async makeFetch() {
        const { currentTextValue } = this.state;
        const { baseRequestURL = "/search/?type=Item" } = this.props;
        const response = await ajax.fetch(`${baseRequestURL}&q=${currentTextValue}&field=display_title&field=@id&limit=100`);
        const data = await response.json();
        console.log(JSON.stringify(data));
    }

    // onLoad(evt) {
    //     this.setState({ loading: true }, ()=>{
    //         if (this.currentRequest){
    //             // XMLHttpRequest.abort() is not guaranteed to do anything --
    //             // depends on XHR readyState, (maybe?) browser. But minor optimization
    //             // if browser does something in response to it.
    //             this.currentRequest.abort && this.currentRequest.abort();
    //         }
    //         const requestInThisScope = this.currentRequest = ajax.load(myURL, (response)=>{
    //             if (requestInThisScope !== this.currentRequest) {
    //                 return false; // Some other AJAX request has been fired and is now set
    //                 // to this.currentRequest. Cancel out.
    //             }
    //             this.currentRequest = null;
    //             this.setState({ loading: false, results: response['@graph'] });
    //         });
    //     });
    // }

    onTextInputChange(evt){
        const { onChange, allowCustomValue = false } = this.props;
        const { value = null } = evt.target;
        if (allowCustomValue) {
            onChange(value);
        }
        this.setState({ currentTextValue: value });
    }

    render() {
        return (
            <h1>I am temporary</h1>
            // <SearchSelectionMenu options={filteredOptions}
            //     onTextInputChange={this.onTextInputChange}
            //     onDropdownSelect={this.onDropdownSelect} />
        );
    }
}
SearchAsYouTypeAjax.propTypes = {
    value: PropTypes.string,
    allowCustomValue: PropTypes.bool,
    baseRequestURL: PropTypes.string
};