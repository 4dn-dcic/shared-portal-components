import React from 'react';

export function IndeterminateCheckbox (props) {
    const { indeterminate = false, ...passProps } = props;
    // See https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
    const callbackRef = function(el){
        if (el) {
            el.indeterminate = (indeterminate === true);
        }
    };
    return <input type="checkbox" {...passProps} ref={callbackRef} />;
}
