/** Transform e.g. 'info' to 'info fas' if fas|fab|far missing. */
export function standardizeUserIconString() {
  var iconStr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var defaultStyle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "fas";
  var icon = iconStr; // Add " fas" if fas|fab|far not present in icon.

  if (typeof icon === "string") {
    var iconParts = icon.split(" ");
    var iconPartsLen = iconParts.length;
    if (iconPartsLen === 0) icon = null;
    if (iconPartsLen === 1) icon += " " + defaultStyle;

    if (iconPartsLen > 1) {
      if (iconParts.indexOf("far") === -1 && iconParts.indexOf("fas") === -1 && iconParts.indexOf("fab") === -1) {
        icon += " " + defaultStyle;
      }
    }
  }

  return icon;
}