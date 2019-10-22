import React from 'react';

/** Emulates React-Bootstrap 0.32.4 Checkbox for backwards compatibility */

export const Checkbox = React.memo(function Checkbox(props){
    const { className, children, labelClassName = "mb-0", title, inputClassName = "mr-08 align-middle", ...passProps } = props;
    const { disabled } = passProps;
    const cls = (
        "checkbox checkbox-with-label" +
        (disabled ? " disabled" : "") +
        (className ? " " + className : "")
    );
    return (
        <div className={cls}>
            <label title={title} className={labelClassName}>
                <input type="checkbox" className={inputClassName} {...passProps} />
                { children }
            </label>
        </div>
    );
});
