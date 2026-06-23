/**
 * jquery-bootstrap-select
 *
 * jQuery wrapper and extended rendering layer for bootstrap-select.
 *
 * This version provides the wrapper bridge and local paged mode with stable dropdown placement.
 * Paged mode keeps a full option source in memory and rebuilds the underlying
 * bootstrap-select instance with only the current page of options.
 *
 * @author Gianluca Giacometti
 */

"use strict";

(function($) {

    const pluginName = "jqueryBootstrapSelect"
    const dataKey = pluginName

    const defaults = {
        huge: false,
        pageSize: 50,
        renderMode: "normal", // normal, paged, remote
        destroyBootstrapSelect: true,
        remote: {
            url: null,
            method: "GET",
            minLength: 0,
            delay: 250,
            data: null,
            map: null
        },
        pagedListMaxHeight: "300px",
        classes: {
            pager: "jquery-bootstrap-select-pager",
            pagerTop: "jquery-bootstrap-select-pager-top",
            pagerBottom: "jquery-bootstrap-select-pager-bottom",
            pagerButton: "jquery-bootstrap-select-pager-button",
            pagerStatus: "jquery-bootstrap-select-pager-status",
            pagePrevious: "jquery-bootstrap-select-page-previous",
            pageNext: "jquery-bootstrap-select-page-next"
        }
    }

    const allowedRenderModes = ["normal", "paged", "remote"]

    class jqueryBootstrapSelect {

        constructor(element, options = {}) {
            this.element = element
            this.$element = $(element)
            this.id = this.element.id
            this.options = this.#buildOptions(options)
            this.instance = null
            this.createdBootstrapSelect = false
            this.currentPage = 0
            this.totalPages = 0
            this.sourceOptions = []
            this.filteredOptions = []
            this.selectedValues = []
            this.remoteTimer = null
            this.initialised = false

            this.#init()
        }

        #init() {
            this.#ensureElement()
            this.#readSourceOptions()

            if (this.options.renderMode == "paged") {
                this.#destroyExistingBootstrapSelect()
                this.#renderNativePage()
            }

            this.#ensureBootstrapSelect()
            this.#bindEvents()
            this.#applyRenderMode()
            this.#closeDropdown()
            window.setTimeout(() => {
                this.#closeDropdown()
            }, 0)

            this.initialised = true
        }

        #buildOptions(options) {
            let dataOptions = this.#readDataOptions()
            let merged = $.extend(true, {}, defaults, dataOptions, options)

            if (!allowedRenderModes.includes(merged.renderMode)) {
                merged.renderMode = defaults.renderMode
            }

            if (!Number.isInteger(merged.pageSize) || merged.pageSize <= 0) {
                merged.pageSize = defaults.pageSize
            }

            return merged
        }

        #readDataOptions() {
            let renderMode = this.element.dataset.bsSelectRenderMode || defaults.renderMode
            let pageSize = parseInt(this.element.dataset.bsSelectPageSize || defaults.pageSize)
            let huge = this.element.dataset.bsSelectHuge == "true"

            if (huge && renderMode == "normal") {
                renderMode = "paged"
            }

            return {
                huge: huge,
                pageSize: pageSize,
                renderMode: renderMode
            }
        }

        #ensureElement() {
            if (!this.id) {
                throw new TypeError("jquery-bootstrap-select requires the SELECT element to have an id")
            }

            if (this.element.tagName !== "SELECT") {
                throw new TypeError("jquery-bootstrap-select can only be attached to SELECT elements")
            }
        }

        #ensureBootstrapSelect() {
            if (typeof bsSelect !== "function") {
                throw new TypeError("jquery-bootstrap-select requires bootstrap-select to be loaded first")
            }

            if (typeof FORM === "undefined" || !FORM.select) {
                throw new TypeError("jquery-bootstrap-select requires the global FORM.select registry from bootstrap-select")
            }

            if (!FORM.select[this.id]) {
                FORM.select[this.id] = new bsSelect(this.id, this.#createSequence())
                this.createdBootstrapSelect = true
            }

            this.instance = FORM.select[this.id]
        }

        #destroyExistingBootstrapSelect() {
            if (typeof FORM === "undefined" || !FORM.select || !FORM.select[this.id]) {
                return
            }

            if (typeof FORM.select[this.id].destroy === "function") {
                FORM.select[this.id].destroy()
            }

            delete FORM.select[this.id]
            this.instance = null
            this.createdBootstrapSelect = false
        }

        #createSequence() {
            return "" + Date.now() + Math.floor(Math.random() * 1000)
        }

        #readSourceOptions() {
            if (this.sourceOptions.length) {
                return
            }

            this.sourceOptions = [...this.element.querySelectorAll("option")].map(option => option.cloneNode(true))
            this.filteredOptions = this.sourceOptions
            this.selectedValues = this.#readSelectedValues(this.sourceOptions)
            this.totalPages = this.#calculateTotalPages()
        }

        #readSelectedValues(options) {
            return options.filter(option => option.selected).map(option => option.value)
        }

        #syncSelectedValuesFromNative() {
            this.selectedValues = [...this.element.selectedOptions].map(option => option.value)

            if (!this.element.multiple && !this.selectedValues.length && this.element.value !== "") {
                this.selectedValues = [this.element.value]
            }
        }

        #bindEvents() {
            this.$element.off("." + pluginName)
            this.$element.on("change." + pluginName, () => {
                this.#onNativeChange()
            })
        }

        #applyRenderMode() {
            if (this.options.renderMode == "normal") {
                this.#enableNormalMode()
            }
            else if (this.options.renderMode == "paged") {
                this.#enablePagedMode()
            }
            else if (this.options.renderMode == "remote") {
                this.#enableRemoteMode()
            }
        }

        #enableNormalMode() {
            // Normal mode delegates completely to bootstrap-select.
        }

        #enablePagedMode() {
            this.#renderPager()
            this.#bindSearchInput()
        }

        #enableRemoteMode() {
            this.currentPage = 0
            this.#renderRemotePlaceholder()
            this.#renderPager()
        }

        #calculateTotalPages() {
            return Math.max(1, Math.ceil(this.filteredOptions.length / this.options.pageSize))
        }

        #getPageSlice() {
            let start = this.currentPage * this.options.pageSize
            let end = start + this.options.pageSize

            return this.filteredOptions.slice(start, end)
        }

        #renderNativePage() {
            if (this.options.renderMode != "paged") {
                return
            }

            this.totalPages = this.#calculateTotalPages()

            if (this.currentPage >= this.totalPages) {
                this.currentPage = this.totalPages - 1
            }

            if (this.currentPage < 0) {
                this.currentPage = 0
            }

            let pageOptions = this.#getPageSlice()

            this.element.innerHTML = ""

            for (let option of pageOptions) {
                let clone = option.cloneNode(true)
                clone.selected = this.selectedValues.includes(clone.value)
                this.element.appendChild(clone)
            }
        }

        #rebuildBootstrapSelect(dropdownState = null, keepDropdownOpen = false) {
            if (this.options.renderMode != "paged") {
                return this
            }

            this.#destroyExistingBootstrapSelect()
            this.#renderNativePage()
            this.#ensureBootstrapSelect()
            this.#bindEvents()
            this.#renderPager()
            this.#bindSearchInput()
            this.#restoreDropdownState(dropdownState, keepDropdownOpen)

            return this
        }

        #renderPager() {
            if (!this.instance || this.options.renderMode != "paged") {
                return
            }

            this.#removePager()

            let list = this.#getListElement()

            if (!list) {
                return
            }

            this.#applyPagedFrame(list)

            if (this.totalPages <= 1) {
                return
            }

            let topPager = this.#createPager("top")
            let bottomPager = this.#createPager("bottom")

            list.before(topPager)
            list.after(bottomPager)

            this.#updatePager()
        }

        #createPager(position) {
            let pager = document.createElement("div")
            pager.className = this.options.classes.pager + " " + (position == "top" ? this.options.classes.pagerTop : this.options.classes.pagerBottom) + " d-flex align-items-center gap-2 px-2 py-2"
            pager.dataset.jqueryBootstrapSelectId = this.id
            pager.dataset.jqueryBootstrapSelectPagerPosition = position

            if (position == "top") {
                pager.classList.add("border-bottom")
            }
            else {
                pager.classList.add("border-top")
            }

            let previous = document.createElement("button")
            previous.type = "button"
            previous.className = this.options.classes.pagerButton + " " + this.options.classes.pagePrevious + " btn btn-sm btn-outline-secondary"
            previous.textContent = "Previous"

            let next = document.createElement("button")
            next.type = "button"
            next.className = this.options.classes.pagerButton + " " + this.options.classes.pageNext + " btn btn-sm btn-outline-secondary"
            next.textContent = "Next"

            let status = document.createElement("span")
            status.className = this.options.classes.pagerStatus + " small text-muted"

            pager.appendChild(previous)
            pager.appendChild(next)
            pager.appendChild(status)

            pager.addEventListener("mousedown", event => {
                event.preventDefault()
                event.stopPropagation()
            })

            previous.addEventListener("click", event => {
                event.preventDefault()
                event.stopPropagation()
                this.previousPage()
            })

            next.addEventListener("click", event => {
                event.preventDefault()
                event.stopPropagation()
                this.nextPage()
            })

            return pager
        }

        #applyPagedFrame(list) {
            if (!list || !this.options.pagedListMaxHeight) {
                return
            }

            list.style.maxHeight = this.options.pagedListMaxHeight
            list.style.overflowY = "auto"
        }

        #updatePager() {
            this.totalPages = this.#calculateTotalPages()

            let pagers = this.#getPagerElements()

            if (!pagers.length) {
                return
            }

            for (let pager of pagers) {
                let previous = pager.querySelector("." + this.options.classes.pagePrevious)
                let next = pager.querySelector("." + this.options.classes.pageNext)
                let status = pager.querySelector("." + this.options.classes.pagerStatus)

                if (previous) {
                    previous.disabled = this.currentPage <= 0
                }

                if (next) {
                    next.disabled = this.currentPage >= this.totalPages - 1
                }

                if (status) {
                    status.textContent = "Page " + (this.currentPage + 1) + " / " + this.totalPages
                }
            }
        }

        #bindSearchInput() {
            let search = this.#getSearchInputElement()

            if (!search) {
                return
            }

            search.removeEventListener("input", this.boundSearchHandler)

            this.boundSearchHandler = event => {
                this.filter(event.target.value)
            }

            search.addEventListener("input", this.boundSearchHandler)
        }

        #getListElement() {
            if (!this.instance || !this.instance.seq) {
                return null
            }

            return document.querySelector("#select-option-list-" + this.instance.seq)
        }

        #getPagerElements() {
            if (!this.instance || !this.instance.seq) {
                return []
            }

            return [...document.querySelectorAll('[data-jquery-bootstrap-select-id="' + this.id + '"]')]
        }

        #getSearchInputElement() {
            if (!this.instance || !this.instance.seq) {
                return null
            }

            return document.querySelector("#select-search-input-" + this.instance.seq)
        }

        #renderRemotePlaceholder() {
            // Remote mode will be implemented after local paged mode is stable.
        }

        #captureDropdownState() {
            let state = {
                open: false,
                placement: "",
                style: "",
                className: ""
            }

            if (!this.instance || !this.instance.seq) {
                return state
            }

            let dropdown = document.querySelector("#select-dropdown-wrapper-" + this.instance.seq)

            if (!dropdown) {
                return state
            }

            state.open = dropdown.classList.contains("show")
            state.placement = dropdown.getAttribute("data-popper-placement") || ""
            state.style = dropdown.getAttribute("style") || ""
            state.className = dropdown.className

            return state
        }

        #restoreDropdownState(state, keepOpen = false) {
            if (!state || !keepOpen || !state.open || !this.instance || !this.instance.seq) {
                this.#closeDropdown()
                return
            }

            let dropdown = document.querySelector("#select-dropdown-wrapper-" + this.instance.seq)
            let input = document.querySelector("#select-input-" + this.instance.seq)
            let inputWrapper = document.querySelector("#select-input-wrapper-" + this.instance.seq)

            if (dropdown) {
                if (state.className) {
                    dropdown.className = state.className
                }

                dropdown.classList.add("show")

                if (state.placement) {
                    dropdown.setAttribute("data-popper-placement", state.placement)
                }

                if (state.style) {
                    dropdown.setAttribute("style", state.style)
                }
            }

            if (input) {
                input.setAttribute("aria-expanded", "true")
            }

            if (inputWrapper) {
                inputWrapper.classList.add("show")
            }
        }

        #openDropdown() {
            this.#restoreDropdownState({ open: true }, true)
        }

        #closeDropdown() {
            if (!this.instance || !this.instance.seq) {
                return
            }

            let dropdown = document.querySelector("#select-dropdown-wrapper-" + this.instance.seq)
            let input = document.querySelector("#select-input-" + this.instance.seq)
            let inputWrapper = document.querySelector("#select-input-wrapper-" + this.instance.seq)

            if (dropdown) {
                dropdown.classList.remove("show")
                dropdown.removeAttribute("data-popper-placement")
                dropdown.style.removeProperty("position")
                dropdown.style.removeProperty("inset")
                dropdown.style.removeProperty("margin")
                dropdown.style.removeProperty("transform")
            }

            if (input) {
                input.setAttribute("aria-expanded", "false")
            }

            if (inputWrapper) {
                inputWrapper.classList.remove("show")
            }
        }

        #goToPage(page) {
            page = parseInt(page)

            if (!Number.isInteger(page)) {
                return this
            }

            this.#syncSelectedValuesFromNative()
            this.totalPages = this.#calculateTotalPages()

            if (page < 0) {
                page = 0
            }

            if (page >= this.totalPages) {
                page = this.totalPages - 1
            }

            let dropdownState = this.#captureDropdownState()

            this.currentPage = page
            this.#rebuildBootstrapSelect(dropdownState, true)

            return this
        }

        #previousPage() {
            return this.#goToPage(this.currentPage - 1)
        }

        #nextPage() {
            return this.#goToPage(this.currentPage + 1)
        }

        #filterLocalOptions(search = "") {
            search = String(search).trim().toLowerCase()
            this.#syncSelectedValuesFromNative()

            if (!search.length) {
                this.filteredOptions = this.sourceOptions
            }
            else {
                this.filteredOptions = this.sourceOptions.filter(option => {
                    return option.text.toLowerCase().includes(search) || option.value.toLowerCase().includes(search)
                })
            }

            let dropdownState = this.#captureDropdownState()

            this.currentPage = 0
            this.#rebuildBootstrapSelect(dropdownState, dropdownState.open)

            return this
        }

        #requestRemoteOptions(search = "") {
            // Placeholder: debounce and request remote results.
            void search

            return this
        }

        #handleRemoteResponse(response) {
            // Placeholder: normalize remote response and update native SELECT / rendered page.
            void response

            return this
        }

        #onNativeChange() {
            this.#syncSelectedValuesFromNative()
        }

        refresh() {
            this.sourceOptions = []
            this.#readSourceOptions()

            if (this.options.renderMode == "paged") {
                this.#rebuildBootstrapSelect()
            }

            return this
        }

        destroy() {
            this.$element.off("." + pluginName)
            this.#removePager()

            if (this.options.destroyBootstrapSelect && this.createdBootstrapSelect && this.instance && typeof this.instance.destroy === "function") {
                this.instance.destroy()
                delete FORM.select[this.id]
            }

            this.$element.removeData(dataKey)
            this.initialised = false

            return this
        }

        value(values, parameters) {
            if (!this.instance || typeof this.instance.value !== "function") {
                return undefined
            }

            if (values === undefined) {
                return this.instance.value()
            }

            this.instance.value(values, parameters)
            this.#syncSelectedValuesFromNative()

            return this
        }

        sort(parameters) {
            if (this.options.renderMode == "paged") {
                this.sourceOptions.sort((a, b) => a.text.localeCompare(b.text))
                this.filteredOptions = this.filteredOptions.sort((a, b) => a.text.localeCompare(b.text))
                this.#rebuildBootstrapSelect()

                return this
            }

            if (this.instance && typeof this.instance.sort === "function") {
                this.instance.sort(parameters)
            }

            return this
        }

        insert(options, parent) {
            if (this.options.renderMode == "paged") {
                console.warn("jquery-bootstrap-select insert() is not implemented for paged mode yet")
                void options
                void parent

                return this
            }

            if (this.instance && typeof this.instance.insert === "function") {
                this.instance.insert(options, parent)
                this.refresh()
            }

            return this
        }

        remove(parameters) {
            if (this.options.renderMode == "paged") {
                console.warn("jquery-bootstrap-select remove() is not implemented for paged mode yet")
                void parameters

                return this
            }

            if (this.instance && typeof this.instance.remove === "function") {
                this.instance.remove(parameters)
                this.refresh()
            }

            return this
        }

        disabled(status) {
            if (this.instance && typeof this.instance.disabled === "function") {
                this.instance.disabled(status)
            }

            return this
        }

        readonly(status) {
            if (this.instance && typeof this.instance.readonly === "function") {
                this.instance.readonly(status)
            }

            return this
        }

        mode() {
            return this.options.renderMode
        }

        isHuge() {
            return this.options.huge
        }

        pageSize() {
            return this.options.pageSize
        }

        currentPageNumber() {
            return this.currentPage + 1
        }

        pages() {
            return this.totalPages
        }

        previousPage() {
            return this.#previousPage()
        }

        nextPage() {
            return this.#nextPage()
        }

        filter(search = "") {
            if (this.options.renderMode == "remote") {
                return this.#requestRemoteOptions(search)
            }

            return this.#filterLocalOptions(search)
        }

        #removePager() {
            for (let pager of this.#getPagerElements()) {
                pager.remove()
            }
        }

    }

    function isPlainObject(value) {
        return !!(value && Object.getPrototypeOf(value) === Object.prototype)
    }

    $.fn[pluginName] = function(methodOrOptions, ...args) {
        let returnValue = this

        this.each(function() {
            let $element = $(this)
            let instance = $element.data(dataKey)

            if (!instance) {
                let options = isPlainObject(methodOrOptions) ? methodOrOptions : {}
                instance = new jqueryBootstrapSelect(this, options)
                $element.data(dataKey, instance)
            }

            if (typeof methodOrOptions === "string") {
                if (typeof instance[methodOrOptions] !== "function") {
                    throw new TypeError("Unknown jquery-bootstrap-select method: " + methodOrOptions)
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

    $.fn[pluginName].Constructor = jqueryBootstrapSelect
    $.fn[pluginName].defaults = defaults

})(jQuery);

// END OF FILE
