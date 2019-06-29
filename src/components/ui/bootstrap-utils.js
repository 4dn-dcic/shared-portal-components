/**
 * Safe chained function
 *
 * Will only create a new function if needed,
 * otherwise will pass back existing functions or null.
 *
 * @param {function} functions to chain
 * @returns {function|null}
 */
export function createChainedFunction(...funcs) {
    return funcs
        .filter((f) => f != null)
        .reduce((acc, f) => {
            if (typeof f !== 'function') {
                throw new Error(
                    'Invalid Argument Type, must only provide functions, undefined, or null.',
                );
            }

            if (acc === null) return f;

            return function chainedFunction(...args) {
                // eslint-disable-next-line no-invalid-this
                acc.apply(this, args);
                // eslint-disable-next-line no-invalid-this
                f.apply(this, args);
            };
        }, null);
}