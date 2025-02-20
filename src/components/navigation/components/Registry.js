import _ from 'underscore';


/**
 * A registry of views to text and possibly sub-text strings.
 * Used to register an Item view to be the renderer for a given Item type[/action], for example.
 *
 * Copied over from ENCODE.
 */
export default class Registry {
    constructor(options) {
        // May provide custom providedBy and fallback functions
        this.views = {};
        _.extend(this, options);
    }

    providedBy(obj) {
        return obj['@type'] || [];
    }

    register(view, for_, name) {
        name = name || '';
        let views = this.views[name];
        if (!views) {
            this.views[name] = views = {};
        }
        views[for_] = view;
    }

    unregister(for_, name) {
        const views = this.views[name || ''];
        if (!views) {
            return;
        }
        delete views[for_];
    }

    lookup(obj, name) {
        const views = this.views[name || ''];
        if (!views) {
            return this.fallback(obj, name);
        }

        const provided = this.providedBy(obj);
        let bestMatch = null;
        for (let i = 0, len = provided.length; i < len; i++) {
            const view = views[provided[i]];
            if (view) {
                bestMatch = view;
            }
        }
        return bestMatch || this.fallback(obj, name);
    }

    getAll(name) {
        const views = this.views[name || ''];
        return views || {};
    }

    fallback(obj, name) {
        return;
    }
}
