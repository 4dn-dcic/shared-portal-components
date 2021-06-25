import React from 'react';
import { IndeterminateCheckbox } from './IndeterminateCheckbox';

/** Emulates React-Bootstrap 0.32.4 Checkbox for backwards compatibility */

export const Checkbox = React.memo(function Checkbox(props){
    const {
        className,
        children,
        labelClassName = "mb-0",
        title,
        inputClassName = "mr-08 align-middle",
        indeterminate = false,
        ...passProps
    } = props;
    const { disabled } = passProps;
    const cls = (
        "checkbox checkbox-with-label" +
        (disabled ? " disabled" : "") +
        (className ? " " + className : "")
    );

    const checkboxElement = indeterminate ?
        // We assume that we can never receive a props.indeterminate here unless also providing
        // a boolean `props.checked` for fully controlled input element. Hence uncontrolled
        // <input> shouldn't ever lose its uncontrolled state by changing to IndeterminateCheckbox.
        <IndeterminateCheckbox className={inputClassName} {...passProps} indeterminate />
        : <input type="checkbox" className={inputClassName} {...passProps} />;

    return (
        <div className={cls}>
            <label title={title} className={labelClassName}>
                { checkboxElement }
                { children }
            </label>
        </div>
    );
});
