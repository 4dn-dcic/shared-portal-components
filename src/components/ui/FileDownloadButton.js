import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import memoize from 'memoize-one';
import { isFilenameAnImage } from './../util/file';

/*****************************
 ** Common React Components **
 *****************************/

/** @todo (?) Move to ui folder */
export function FileDownloadButton(props){
    const { href, className, disabled, title, filename, size } = props;
    const cls = "btn download-button" + (disabled ? ' disabled' : '') + (size ? ' btn-' + size : '') + (className ? " " + className : '');
    return (
        <a href={ href } className={cls} download data-tip={filename || null}>
            <i className="icon icon-fw icon-cloud-download"/>{ title ? <span>&nbsp; { title }</span> : null }
        </a>
    );
}
FileDownloadButton.defaultProps = {
    'className' : "btn-block btn-primary",
    'title' : 'Download',
    'disabled' : false,
    'size' : null
};


export const FileDownloadButtonAuto = React.memo(function FileDownloadButtonAuto(props){
    const { result: file, canDownloadStatuses } = props;
    const isDisabled = !FileDownloadButtonAuto.canDownload(file, canDownloadStatuses);
    const passProps = {
        'href' : file.href,
        'filename' : file.filename,
        'disabled' : isDisabled,
        'title' : isDisabled ? 'Not ready to download' : FileDownloadButton.defaultProps.title
    };
    return <FileDownloadButton {...props} {...passProps} />;
});
FileDownloadButtonAuto.canDownload = memoize(function(file, validStatuses = FileDownloadButtonAuto.defaultProps.canDownloadStatuses){
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
FileDownloadButtonAuto.propTypes = {
    'result' : PropTypes.shape({
        'href' : PropTypes.string.isRequired,
        'filename' : PropTypes.string.isRequired,
    }).isRequired,
    'canDownloadStatuses' : PropTypes.arrayOf(PropTypes.string)
};
FileDownloadButtonAuto.defaultProps = {
    'canDownloadStatuses' : [
        'uploaded',
        'released',
        'replaced',
        'submission in progress',
        'released to project',
        'archived'
    ]
};


export const ViewFileButton = React.memo(function ViewFileButton(props){
    const { filename, href, target, title, mimeType, size, className } = props;
    let action = 'View';
    //let extLink = null;
    let preLink = null;

    preLink = <i className="icon icon-fw icon-cloud-download" />;

    const fileNameLower = (filename && filename.length > 0 && filename.toLowerCase()) || '';
    const fileNameLowerEnds = {
        '3' : fileNameLower.slice(-3),
        '4' : fileNameLower.slice(-4),
        '5' : fileNameLower.slice(-5)
    };
    if (isFilenameAnImage(fileNameLowerEnds)){
        action = 'View';
        preLink = <i className="icon icon-fw icon-picture-o" />;
    } else if (fileNameLowerEnds['4'] === '.pdf'){
        action = 'View';
        //if (target === '_blank') extLink = <i className="icon icon-fw icon-external-link"/>;
        preLink = <i className="icon icon-fw icon-file-pdf-o" />;
    } else if (fileNameLowerEnds['3'] === '.gz' || fileNameLowerEnds['4'] === '.zip' || fileNameLowerEnds['4'] === '.tgx'){
        action = 'Download';
    }

    const cls = ("btn" + (size ? " btn-" + size : "") + (className ? " " + className : "") + (bsStyle ? " btn-" + bsStyle : ""));

    return (
        <button type="button" className={cls} download={action === 'Download' ? true : null}
            {..._.omit(props, 'filename', 'title')} title={filename} data-tip={mimeType}>
            <span className={title ? null : "text-400"}>
                { preLink } { action } { title || (filename && <span className="text-600">{ filename }</span>) || 'File' } { extLink }
            </span>
        </button>
    );
});
ViewFileButton.defaultProps = {
    'className' : "text-ellipsis-container mb-1",
    'target' : "_blank",
    'bsStyle' : "primary",
    'href' : null,
    'disabled' : false,
    'title' : null,
    'mimeType' : null,
    'size' : null
};

