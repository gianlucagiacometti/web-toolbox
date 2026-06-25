/**
 * jquery-bootstrap-pickadate
 *
 * jQuery wrapper for bootstrap-pickadate.
 *
 * The wrapper keeps bootstrap-pickadate as the underlying plain JavaScript
 * component and adds jQuery-style initialisation, safe refresh/destroy calls,
 * and framework-friendly helpers for dynamically injected HTML.
 *
 * @author Gianluca Giacometti
 */

"use strict";

(function($, window, document) {

    const pluginName = "jqueryBootstrapPickadate"
    const dataKey = pluginName
    const componentProperty = "bsPickadate"

    const defaults = {
        destroyBootstrapPickadate: true
    }

    class jqueryBootstrapPickadate {

        constructor(element, options = {}) {
            this.element = element
            this.$element = $(element)
            this.options = $.extend(true, {}, defaults, options)
            this.instance = null
            this.createdBootstrapPickadate = false
            this.initialised = false

            this.#init(options)
        }

        #init(options = {}) {
            this.#ensureElement()
            this.#ensureBootstrapPickadate(options)
            this.initialised = true
        }

        #ensureElement() {
            if (!this.element || this.element.tagName !== "INPUT") {
                throw new TypeError("jquery-bootstrap-pickadate can only be attached to INPUT elements")
            }
        }

        #ensureBootstrapPickadate(options = {}) {
            if (typeof window.bsPickadate !== "function") {
                throw new TypeError("jquery-bootstrap-pickadate requires bootstrap-pickadate to be loaded first")
            }

            if (typeof window.FORM === "undefined" || !window.FORM.pickadate) {
                window.FORM = window.FORM || {}
                window.FORM.pickadate = window.FORM.pickadate || {}
            }

            if (!this.element[componentProperty]) {
                this.instance = new window.bsPickadate(this.element, options)
                this.createdBootstrapPickadate = true
                return
            }

            this.instance = this.element[componentProperty]
        }

        instanceObject() {
            return this.instance
        }

        refresh() {
            if (this.instance && typeof this.instance.refresh === "function") {
                this.instance.refresh()
            }

            return this
        }

        refreshLocale(locale = "current") {
            if (this.instance && typeof this.instance.refreshLocale === "function") {
                this.instance.refreshLocale(locale)
            }

            return this
        }

        reinitialise(options = {}) {
            this.destroy()
            this.options = $.extend(true, {}, defaults, options)
            this.createdBootstrapPickadate = false
            this.#init(options)
            this.$element.data(dataKey, this)

            return this
        }

        destroy() {
            if (this.options.destroyBootstrapPickadate && this.instance && typeof this.instance.destroy === "function") {
                this.instance.destroy()
            }

            this.instance = null
            this.createdBootstrapPickadate = false
            this.initialised = false
            this.$element.removeData(dataKey)

            return this
        }

        value(value) {
            if (!this.instance || typeof this.instance.value !== "function") {
                return value === undefined ? undefined : this
            }

            if (value === undefined) {
                return this.instance.value()
            }

            this.instance.value(value)

            return this
        }

        clear() {
            if (this.instance && typeof this.instance.clear === "function") {
                this.instance.clear()
            }

            return this
        }

        today() {
            if (this.instance && typeof this.instance.today === "function") {
                this.instance.today()
            }

            return this
        }

        open() {
            if (this.instance && typeof this.instance.open === "function") {
                this.instance.open()
            }

            return this
        }

        close() {
            if (this.instance && typeof this.instance.close === "function") {
                this.instance.close()
            }

            return this
        }

        toggle() {
            if (this.instance && typeof this.instance.toggle === "function") {
                this.instance.toggle()
            }

            return this
        }

        setMin(value) {
            if (this.instance && typeof this.instance.setMin === "function") {
                this.instance.setMin(value)
            }

            return this
        }

        setMax(value) {
            if (this.instance && typeof this.instance.setMax === "function") {
                this.instance.setMax(value)
            }

            return this
        }

        setViewMonth(month) {
            if (this.instance && typeof this.instance.setViewMonth === "function") {
                this.instance.setViewMonth(month)
            }

            return this
        }

        setViewYear(year) {
            if (this.instance && typeof this.instance.setViewYear === "function") {
                this.instance.setViewYear(year)
            }

            return this
        }

        moveMonth(delta) {
            if (this.instance && typeof this.instance.moveMonth === "function") {
                this.instance.moveMonth(delta)
            }

            return this
        }

        moveYear(delta) {
            if (this.instance && typeof this.instance.moveYear === "function") {
                this.instance.moveYear(delta)
            }

            return this
        }
    }

    function isPlainObject(value) {
        return !!(value && Object.getPrototypeOf(value) === Object.prototype)
    }

    function findPickadates(container) {
        let root = container || document
        let $root = root instanceof $ ? root : $(root)

        if ($root.is("input.bootstrap-pickadate")) {
            return $root
        }

        return $root.find("input.bootstrap-pickadate")
    }

    $.fn[pluginName] = function(methodOrOptions, ...args) {
        let returnValue = this

        this.each(function() {
            let $element = $(this)
            let instance = $element.data(dataKey)

            if (!instance) {
                let options = isPlainObject(methodOrOptions) ? methodOrOptions : {}
                instance = new jqueryBootstrapPickadate(this, options)
                $element.data(dataKey, instance)
            }

            if (typeof methodOrOptions === "string") {
                if (typeof instance[methodOrOptions] !== "function") {
                    throw new TypeError("Unknown jquery-bootstrap-pickadate method: " + methodOrOptions)
                }

                let result = instance[methodOrOptions](...args)

                if (result !== instance && result !== undefined) {
                    returnValue = result
                    return false
                }
            }
        })

        return returnValue
    }

    $.fn[pluginName].Constructor = jqueryBootstrapPickadate
    $.fn[pluginName].defaults = defaults

    $.jqueryBootstrapPickadate = {
        initialise(container = document, options = {}) {
            return findPickadates(container).jqueryBootstrapPickadate(options)
        },

        refreshAll(container = document) {
            return findPickadates(container).jqueryBootstrapPickadate("refresh")
        },

        refreshLocale(locale = "current", container = document) {
            return findPickadates(container).jqueryBootstrapPickadate("refreshLocale", locale)
        },

        destroyAll(container = document) {
            return findPickadates(container).jqueryBootstrapPickadate("destroy")
        },

        setDefaultLocale(locale) {
            if (typeof window.bsPickadate === "function" && typeof window.bsPickadate.setDefaultLocale === "function") {
                window.bsPickadate.setDefaultLocale(locale)
            }

            return this
        }
    }

})(jQuery, window, document);

// END OF FILE
