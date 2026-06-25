/**
 * jQuery wrapper for Bootstrap Pickadate.
 */

"use strict";

(function($, window) {
    const pluginName = "jqueryBootstrapPickadate";
    const dataKey = "bootstrapPickadate";

    if (!$ || !window || !window.bsPickadate) {
        return;
    }

    const methods = {
        instance: function() {
            return this;
        },
        value: function(value) {
            if (value === undefined) {
                return this.value();
            }

            this.value(value);
            return this.input;
        },
        clear: function() {
            this.clear();
            return this.input;
        },
        today: function() {
            this.today();
            return this.input;
        },
        open: function() {
            this.open();
            return this.input;
        },
        close: function() {
            this.close();
            return this.input;
        },
        setMin: function(value) {
            this.setMin(value);
            return this.input;
        },
        setMax: function(value) {
            this.setMax(value);
            return this.input;
        },
        refresh: function() {
            this.refresh();
            return this.input;
        },
        refreshLocale: function(locale) {
            this.refreshLocale(locale);
            return this.input;
        },
        destroy: function() {
            const input = this.destroy();

            $(input).removeData(dataKey);
            return input;
        }
    };

    function initialise(element, options) {
        const input = $(element);
        let instance = input.data(dataKey) || element.bsPickadate || null;

        if (instance && options && options.force === true) {
            instance.destroy();
            input.removeData(dataKey);
            instance = null;
        }

        if (!instance) {
            instance = new window.bsPickadate(element, options || {});
            input.data(dataKey, instance);
        }

        return instance;
    }

    $.fn[pluginName] = function(methodOrOptions) {
        const args = Array.prototype.slice.call(arguments, 1);
        let returnValue = this;

        this.each(function() {
            const element = this;
            const input = $(element);
            let instance = input.data(dataKey) || element.bsPickadate || null;

            if (typeof methodOrOptions === "string") {
                if (methodOrOptions !== "destroy" && !instance) {
                    instance = initialise(element, {});
                }

                if (!instance || !methods[methodOrOptions]) {
                    return;
                }

                const methodResult = methods[methodOrOptions].apply(instance, args);

                if (methodResult !== undefined && methodOrOptions === "value" && args.length === 0) {
                    returnValue = methodResult;
                    return false;
                }

                if (methodResult !== undefined && methodOrOptions === "instance") {
                    returnValue = methodResult;
                    return false;
                }

                return;
            }

            initialise(element, $.extend({}, $.fn[pluginName].defaults, methodOrOptions || {}));
        });

        return returnValue;
    };

    $.fn[pluginName].defaults = {
        force: false
    };
})(window.jQuery, window);

// END OF FILE
