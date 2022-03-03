import React, { useMemo } from 'react';

/**
 * Supplies a plain JS object `detailPaneStateCache` and method for updating it
 * `updateDetailPaneStateCache` as props. `detailPaneStateCache` is to be read
 * by certain detail pane components upon being constructed and set as their initial
 * state. Used in LoadAsYouScroll, since those list items get deleted and their state
 * lost.
*/
export function DetailPaneStateCache({ children, ...passProps }){

    /**
     * Plain object used for caching to helps to preserve open states of e.g. Processed & Raw files' sections to iron out jumping as that state is lost that would
     * otherwise be encountered during scrolling due to dismounting/destruction of ResultRow components. `detailPaneFileSectionStateCache` is read in constructor
     * or upon mount by these ResultRows.
     *
     * Runs/memoized only once on mount so that same instance of the `detailPaneFileSectionStateCache` object persists throughout lifeycle of
     * `BrowseTableWithSelectedFilesCheckboxes` component.
     */
    const ownProps = useMemo(function(){
        const detailPaneStateCache = {};
        function updateDetailPaneStateCache(resultID, resultPaneState){
            // Purposely avoid changing reference to avoid re-renders/updates (except when new components initialize)
            if (resultPaneState === null){
                delete detailPaneStateCache[resultID];
            } else {
                detailPaneStateCache[resultID] = resultPaneState;
            }
        }
        return { detailPaneStateCache, updateDetailPaneStateCache };
    }, []);

    const childProps = { ...passProps, ...ownProps };

    return React.Children.map(children, function(c){
        if (!React.isValidElement(c) || typeof c.type === "string") return c;
        return React.cloneElement(c, childProps);
    });

}
