import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import memoize from 'memoize-one';
import { isFilenameAnImage } from './../util/file';
import { event as trackEvent } from './../util/analytics';

/*****************************
 ** Common React Components **
 *****************************/

/** @todo (?) Move to ui folder */
export function FileDownloadButton(props){
    const {
        href,
        className = "btn-block btn-primary",
        disabled = false,
        title = "Download",
        filename,
        size = null,
        tooltip,
        onClick
    } = props;
    const cls = "btn download-button" + (disabled ? ' disabled' : '') + (size ? ' btn-' + size : '') + (className ? " " + className : '');

    const button = (
        <a {...{ href, onClick }} className={cls} download data-tip={tooltip || filename || null}>
            <i className="icon icon-fw icon-cloud-download-alt fas" />{title ? <span>&nbsp; {title}</span> : null}
        </a>
    );

    return (disabled && tooltip) ? (
        <span data-tip={tooltip} className="w-100">
            {button}
        </span>
    ) : button;
}


const canDownloadFile = memoize(function(file, validStatuses){
    if (!file || typeof file !== 'object'){
        console.error("Incorrect data type");
        return false;
    }
    if (typeof file.status !== 'string'){
        console.error("No 'status' property on file:", file);
        return false;
    }
    if (validStatuses.indexOf(file.status) > -1){
        return true;
    }
    return false;
});

export const FileDownloadButtonAuto = React.memo(function FileDownloadButtonAuto(props){
    const {
        result: file, onClick = null, disabled: propDisabled = false,
        canDownloadStatuses = [
            'uploaded',
            'released',
            'replaced',
            'submission in progress',
            'released to project',
            'archived'
        ]
    } = props;
    const { href, filename } = file;
    const isDownloadable = canDownloadFile(file, canDownloadStatuses);
    const passProps = {
        onClick, href, filename,
        'disabled': !!propDisabled || !isDownloadable,
        'title': !isDownloadable ? 'Not ready to download' : "Download"
    };
    return <FileDownloadButton {..._.omit(props, 'disabled')} {...passProps} />;
});
FileDownloadButtonAuto.propTypes = {
    'result' : PropTypes.shape({
        'href' : PropTypes.string.isRequired,
        'filename' : PropTypes.string,
    }).isRequired,
    'canDownloadStatuses' : PropTypes.arrayOf(PropTypes.string),
    'onClick' : PropTypes.func,
    'disabled': PropTypes.bool,
    'tooltip': PropTypes.string,
};


export const ViewFileButton = React.memo(function ViewFileButton(props){
    const {
        filename,
        href = null,
        target = "_blank",
        title = null,
        mimeType = null,
        size = null,
        className = "text-truncate mb-1",
        bsStyle,
        variant = "primary",
        onClick: propClick,
        ...passProps
    } = props;
    let action = 'View';
    let extLink = null; // Unsure if really used. Maybe should test href for presence of http[s]:// instd of target="_blank"?
    let preLink = null;

    preLink = <i className="icon icon-fw icon-cloud-download-alt fas" />;

    const fileNameLower = (filename && filename.length > 0 && filename.toLowerCase()) || '';
    const fileNameLowerEnds = {
        '3' : fileNameLower.slice(-3),
        '4' : fileNameLower.slice(-4),
        '5' : fileNameLower.slice(-5)
    };
    if (isFilenameAnImage(fileNameLowerEnds)){
        action = 'View';
        preLink = <i className="icon icon-fw icon-image far" />;
    } else if (fileNameLowerEnds['4'] === '.pdf'){
        action = 'View';
        if (target === '_blank'){
            extLink = <i className="icon icon-fw icon-external-link fas"/>;
        }
        preLink = <i className="icon icon-fw icon-file-pdf far" />;
    } else if (fileNameLowerEnds['3'] === '.gz' || fileNameLowerEnds['4'] === '.zip' || fileNameLowerEnds['4'] === '.tgx' ||
                fileNameLowerEnds['4'] === '.xls' || fileNameLowerEnds['5'] === '.xlsx'){
        action = 'Download';
    }

    function onClick(evt){
        const evtObj = { name: filename, file_size: size || 0 };
        trackEvent("view_file", "ViewFileButton", "Clicked To " + action, null, evtObj);
        if (typeof propClick === "function"){
            propClick();
        }
    }

    const useVariant = bsStyle || variant || "primary";
    const cls = ("btn" + (size ? " btn-" + size : "") + (className ? " " + className : "") + (" btn-" + useVariant));
    const btnProps = { ...passProps, onClick, href, mimeType, target };

    return (
        <a {...btnProps} className={cls} download={action === 'Download' ? filename || true : null} title={filename} data-tip={mimeType}>
            { preLink } { action } { title || (filename && <span className="text-600">{ filename }</span>) || 'File' } { extLink }
        </a>
    );
});

