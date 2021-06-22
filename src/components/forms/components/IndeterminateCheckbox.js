import React from 'react';
import _ from 'underscore';

export class IndeterminateCheckbox extends React.PureComponent {

    constructor(props){
        super(props);
        this.setIndeterminateOnRef = this.setIndeterminateOnRef.bind(this);
        this.checkboxRef = React.createRef();
    }

    componentDidMount(){
        const { indeterminate } = this.props;
        // Can be skipped if not set to true.
        if (indeterminate === true){
            this.setIndeterminateOnRef();
        }
    }

    componentDidUpdate({ indeterminate: pastIndeterminate }){
        const { indeterminate } = this.props;
        if (pastIndeterminate !== indeterminate){
            this.setIndeterminateOnRef();
        }
    }

    setIndeterminateOnRef(){
        const { indeterminate } = this.props;
        if (this.checkboxRef.current){
            this.checkboxRef.current.indeterminate = indeterminate;
        }
    }

    render(){
        const { indeterminate, ...passProps } = this.props;
        return <input type="checkbox" {...passProps} ref={this.checkboxRef} />;
    }
}
