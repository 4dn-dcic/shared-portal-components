
/** Transform e.g. 'info' to 'info fas' if fas|fab|far missing. */
export function standardizeUserIconString(iconStr = null, defaultStyle = "fas"){
    let icon = iconStr;
    // Add " fas" if fas|fab|far not present in icon.
    if (typeof icon === "string") {
        const iconParts = icon.split(" ");
        const iconPartsLen = iconParts.length;
        if (iconPartsLen === 0) icon = null;
        if (iconPartsLen === 1) icon += " " + defaultStyle;
        if (iconPartsLen > 1) {
            if (iconParts.indexOf("far") === -1 &&
                iconParts.indexOf("fas") === -1 &&
                iconParts.indexOf("fab") === -1
            ) {
                icon += " " + defaultStyle;
            }
        }
    }
    return icon;
}
