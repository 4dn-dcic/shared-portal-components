import React from 'react';
import DropdownButton from 'react-bootstrap/esm/DropdownButton';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';
import { ajax, console } from './../../util';


export class LinkToDropdown extends React.PureComponent {

    static defaultProps = {
        'searchURL': "/search/?type=Project",
        'selectedID': null,
        'selectedTitle': null,
        'searchAsYouType': null,

        /**
         * Example function to use.
         * Once selected, selectedTitle and selectedID should be passed back down to
         * this component.
         *
         * @param {*} itemID - The "@id" of selected item.
         * @param {*} itemJson - JSON/context of selected item. Will only contain limited subset of fields, e.g. type and title.
         */
        'onSelect' : function(itemJson, itemID){
            console.info("Selected!", itemID, itemJson);
        }
    };

    static fieldsToRequest = [
        '@id', 'display_title'
    ];

    constructor(props){
        super(props);
        this.loadViableOptions = this.loadViableOptions.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
        this.state = {
            loading: true,
            optionResults: null,
            error: null,
            typedSearchQuery: ""
        };

        this.searchCache = new Map();
    }

    componentDidMount(){
        // Todo, call from componentDidUpdate if session has changed
        // _IF_ is possible this is needed (e.g. anonymous users could select things)
        this.loadViableOptions();
    }

    loadViableOptions(){
        const { searchURL: searchURLBase } = this.props;

        const requestHref = (
            searchURLBase + "&limit=1000&" +
            LinkToDropdown.fieldsToRequest.map(function(field){
                return "field=" + encodeURIComponent(field);
            }).join('&')
        );
        const cb = (response) => {
            if (!response || Object.keys(response).length === 0) {
                this.setState({ loading: false, error: "Could not get valid options, check network and try again." });
                return;
            }
            if (response.total === 0) {
                this.setState({ loading: false, error: "No valid options found." });
                return;
            }
            this.setState({
                loading: false,
                error: null,
                optionResults: response['@graph']
            });
        };

        this.setState({ loading: true }, ()=>{
            ajax.load(requestHref, cb, 'GET', cb);
        });
    }

    handleSelect(itemID){
        const { onSelect } = this.props;
        const { optionResults = [] } = this.state;
        const optionsLen = optionResults.length;
        let selectedItem = null;

        for (let i = 0; i < optionsLen; i++){
            if (optionResults[i]['@id'] === itemID){
                selectedItem = optionResults[i];
                break;
            }
        }

        if (selectedItem === null) {
            throw new Error("Couldn't find ID in resultlist - " + itemID);
        }

        onSelect(selectedItem, itemID);
    }

    handleSearchTextChange(evt){
        const typedSearchQuery = evt.target.value;
        this.setState({ typedSearchQuery });
    }

    render(){
        const { error, optionResults, loading, typedSearchQuery } = this.state;
        const {
            variant = "outline-dark",
            selectedTitle = null,
            selectedID = null,
            className: propClsName = null,
            searchAsYouType = (optionResults && optionResults.length > 8)
        } = this.props;

        let title;
        let disabled = false;
        let filteredOptions = optionResults;
        let renderedOptions = null;
        if (loading){
            title = <i className="icon icon-fw icon-spin icon-circle-notch fas" />;
            disabled = true;
        } else if (error || !Array.isArray(optionResults)) {
            title = <span className="error">{ error }</span>;
            disabled = true;
        } else {

            if (optionResults.length === 1 && selectedID === optionResults[0]['@id']){
                disabled = true;
            } else {
                if (searchAsYouType && typedSearchQuery){
                    const cachedResults = this.searchCache.get(typedSearchQuery);
                    if (cachedResults){
                        filteredOptions = cachedResults;
                    } else {
                        const regexTest = new RegExp(typedSearchQuery, "i");
                        filteredOptions = optionResults.filter(function(selectableItem){
                            const { display_title, '@id' : itemID } = selectableItem;
                            return regexTest.test(display_title) || regexTest.test(itemID);
                        });
                        if (this.searchCache.size >= 100) {
                            for (const [ key, val ] of this.searchCache){
                                this.searchCache.delete(key);
                                break; // Just need to delete first (oldest) val.
                            }
                        }
                        this.searchCache.set(typedSearchQuery, filteredOptions);
                    }
                }

                renderedOptions = filteredOptions.map(function(selectableItem){
                    const { display_title, '@id' : itemID } = selectableItem;
                    return (
                        <DropdownItem className="selectable-item-option" key={itemID} eventKey={itemID}
                            active={selectedID === itemID}>
                            <div className="row">
                                <div className="col">
                                    <span className="text-600 d-block">{ display_title }</span>
                                </div>
                                <div className="col-auto d-none d-md-inline-block">
                                    <i className="icon icon-fw icon-link fas small me-05"/>
                                    <span className="font-monospace small">{ itemID }</span>
                                </div>
                            </div>
                        </DropdownItem>
                    );
                });
            }

            title = selectedTitle || "Select...";
        }

        const className = "linkto-dropdown" + (propClsName ? " " + propClsName : "");

        return (
            <DropdownButton {...{ variant, title, disabled, className }} onSelect={this.handleSelect}>
                { searchAsYouType ?
                    <div className="search-as-you-type-container">
                        <input type="text" className="form-control" value={typedSearchQuery}
                            onChange={this.handleSearchTextChange} placeholder="Search..." />
                    </div>
                    : null }
                { renderedOptions }
            </DropdownButton>
        );
    }

}
