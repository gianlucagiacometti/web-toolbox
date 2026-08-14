/**
 * jquery-bootstrap-select
 *
 * jQuery wrapper and extended rendering layer for bootstrap-select.
 *
 * This version provides the wrapper bridge and local paged mode with stable
 * dropdown placement and canonical selection handling across every page.
 * Paged mode keeps the complete option source in memory, renders only the
 * current page, and pins off-page selected options invisibly so native form
 * submission and Bootstrap Select state remain correct.
 *
 * @author Gianluca Giacometti
 */

"use strict";

(function($) {

    const pluginName = "jqueryBootstrapSelect"
    const dataKey = pluginName
    const pinnedAttribute = "data-jquery-bootstrap-select-pinned"

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
        pagedDropdownWidth: "300px",
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
            this.defaultSelectedValues = []
            this.searchTerm = ""
            this.allowedValues = null
            this.remoteTimer = null
            this.initialised = false
            this.boundSearchHandler = null
            this.boundSearchClearHandler = null
            this.boundFormResetHandler = null
            this.form = null

            this.#init()
        }

        #init() {
            this.#ensureElement()
            this.#readSourceOptions()

            if (this.options.renderMode == "paged") {
                this.#setInitialPageFromSelection()
                this.#destroyExistingBootstrapSelect()
                this.#renderNativePage()
            }

            this.#ensureBootstrapSelect()
            this.#bindEvents()
            this.#bindFormReset()
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
            let pagedDropdownWidth = this.element.dataset.bsSelectPagedDropdownWidth || defaults.pagedDropdownWidth

            if (huge && renderMode == "normal") {
                renderMode = "paged"
            }

            return {
                huge: huge,
                pageSize: pageSize,
                renderMode: renderMode,
                pagedDropdownWidth: pagedDropdownWidth
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

            if (this.options.renderMode == "paged") {
                this.#hidePinnedOptions()
            }
        }

        #destroyExistingBootstrapSelect() {
            if (typeof FORM === "undefined" || !FORM.select || !FORM.select[this.id]) {
                return
            }

            let instance = FORM.select[this.id]
            let wrapper = instance.seq ? document.querySelector("#select-wrapper-" + instance.seq) : null

            if (!wrapper) {
                delete FORM.select[this.id]
                this.instance = null
                this.createdBootstrapSelect = false
                return
            }

            if (typeof instance.destroy === "function") {
                instance.destroy()
            }

            delete FORM.select[this.id]
            this.instance = null
            this.createdBootstrapSelect = false
        }

        #createSequence() {
            return "" + Date.now() + Math.floor(Math.random() * 1000)
        }

        #cleanSourceOption(option) {
            let selected = option.selected
            let defaultSelected = option.defaultSelected
            let clone = option.cloneNode(true)

            delete clone.dataset.rnd
            clone.removeAttribute(pinnedAttribute)

            clone.defaultSelected = defaultSelected
            clone.selected = selected

            return clone
        }

        #readSourceOptions() {
            if (this.sourceOptions.length) {
                return
            }

            this.sourceOptions = [...this.element.querySelectorAll("option")].map(option => {
                return this.#cleanSourceOption(option)
            })
            this.filteredOptions = [...this.sourceOptions]
            this.selectedValues = this.#readSelectedValues(this.sourceOptions)
            this.defaultSelectedValues = this.sourceOptions
                .filter(option => option.defaultSelected)
                .map(option => option.value)

            if (!this.element.multiple && !this.selectedValues.length) {
                let firstSelected = this.sourceOptions.find(option => option.selected)

                if (firstSelected) {
                    this.selectedValues = [firstSelected.value]
                }
            }

            if (!this.element.multiple && !this.defaultSelectedValues.length) {
                this.defaultSelectedValues = [...this.selectedValues]
            }

            this.#applySelectedValuesToSource()
            this.totalPages = this.#calculateTotalPages()
        }

        #readSelectedValues(options) {
            return options.filter(option => option.selected).map(option => option.value)
        }

        #normaliseValues(values) {
            if (values === undefined || values === null) {
                return []
            }

            if (!Array.isArray(values)) {
                values = [values]
            }

            return [...new Set(values.map(value => String(value)))]
        }

        #applySelectedValuesToSource() {
            let selected = new Set(this.selectedValues)

            for (let option of this.sourceOptions) {
                option.selected = selected.has(option.value)
            }
        }

        #syncSelectedValuesFromNative() {
            if (this.options.renderMode != "paged") {
                this.selectedValues = [...this.element.selectedOptions].map(option => option.value)
                return
            }

            this.selectedValues = [...this.element.selectedOptions].map(option => option.value)

            if (!this.element.multiple && !this.selectedValues.length && this.element.value !== "") {
                this.selectedValues = [this.element.value]
            }

            this.selectedValues = this.#normaliseValues(this.selectedValues)
            this.#applySelectedValuesToSource()
        }

        #bindEvents() {
            this.$element.off("." + pluginName)
            this.$element.on("change." + pluginName, () => {
                this.#onNativeChange()
            })
        }

        #bindFormReset() {
            this.form = this.element.form

            if (!this.form) {
                return
            }

            if (this.boundFormResetHandler) {
                this.form.removeEventListener("reset", this.boundFormResetHandler)
            }

            this.boundFormResetHandler = () => {
                window.setTimeout(() => {
                    if (!this.initialised) {
                        return
                    }

                    if (this.options.renderMode != "paged") {
                        this.#syncSelectedValuesFromNative()
                        return
                    }

                    this.selectedValues = [...this.defaultSelectedValues]
                    this.#limitSelectedValuesToAllowed()
                    this.#applySelectedValuesToSource()
                    this.searchTerm = ""
                    this.filteredOptions = this.#filterSourceOptions(this.searchTerm)
                    this.#setInitialPageFromSelection()
                    this.#rebuildBootstrapSelect()
                }, 0)
            }

            this.form.addEventListener("reset", this.boundFormResetHandler)
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
            this.#hidePinnedOptions()
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

        #findOptionPage(value) {
            let index = this.filteredOptions.findIndex(option => option.value == value)

            return index >= 0 ? Math.floor(index / this.options.pageSize) : -1
        }

        #setInitialPageFromSelection() {
            this.currentPage = 0

            for (let value of this.selectedValues) {
                let page = this.#findOptionPage(value)

                if (page >= 0) {
                    this.currentPage = page
                    break
                }
            }
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
            let pageOptionSet = new Set(pageOptions)
            let renderedOptions = this.sourceOptions.filter(option => {
                return pageOptionSet.has(option) || this.selectedValues.includes(option.value)
            })

            this.element.innerHTML = ""

            for (let option of renderedOptions) {
                let clone = this.#cleanSourceOption(option)
                let pinned = this.selectedValues.includes(option.value)
                    && !pageOptionSet.has(option)

                clone.selected = this.selectedValues.includes(clone.value)

                if (pinned) {
                    clone.setAttribute(pinnedAttribute, "true")
                }

                this.element.appendChild(clone)
            }

            if (!this.selectedValues.length) {
                this.element.selectedIndex = -1
            }
            else if (!this.element.multiple) {
                this.element.value = this.selectedValues[0]
            }
        }

        #restoreFullNativeOptions() {
            if (this.options.renderMode != "paged") {
                return
            }

            this.element.innerHTML = ""

            for (let option of this.sourceOptions) {
                let clone = this.#cleanSourceOption(option)

                clone.selected = this.selectedValues.includes(clone.value)
                this.element.appendChild(clone)
            }

            if (!this.selectedValues.length) {
                this.element.selectedIndex = -1
            }
            else if (!this.element.multiple) {
                this.element.value = this.selectedValues[0]
            }
        }

        #hidePinnedOptions() {
            if (!this.instance || !this.instance.seq || this.options.renderMode != "paged") {
                return
            }

            for (let option of this.element.querySelectorAll("option[" + pinnedAttribute + "]")) {
                let rnd = option.dataset.rnd

                if (!rnd) {
                    continue
                }

                let wrapper = document.querySelector(
                    "#select-option-wrapper-" + this.instance.seq + "-" + rnd
                )

                if (wrapper) {
                    wrapper.classList.add("d-none")
                    wrapper.setAttribute("aria-hidden", "true")
                }
            }
        }

        #rebuildBootstrapSelect(dropdownState = null, keepDropdownOpen = false, focusSearch = false) {
            if (this.options.renderMode != "paged") {
                return this
            }

            this.#destroyExistingBootstrapSelect()
            this.#renderNativePage()
            this.#ensureBootstrapSelect()
            this.#bindEvents()
            this.#renderPager()
            this.#bindSearchInput()
            this.#hidePinnedOptions()
            this.#restoreDropdownState(dropdownState, keepDropdownOpen)
            this.#restoreSearchInput(focusSearch)
            this.#applyPagedFrame()

            window.setTimeout(() => {
                this.#applyPagedFrame()
                this.#restoreSearchInput(focusSearch)
                this.#hidePinnedOptions()
            }, 0)

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

        #applyPagedFrame(list = null) {
            if (!list) {
                list = this.#getListElement()
            }

            if (!list) {
                return
            }

            if (this.options.pagedListMaxHeight) {
                list.style.setProperty("max-height", this.options.pagedListMaxHeight, "important")
                list.style.setProperty("overflow-y", "auto", "important")
            }
            else {
                list.style.removeProperty("max-height")
                list.style.removeProperty("overflow-y")
            }

            let dropdown = list.closest(".select-dropdown-wrapper")

            if (dropdown && this.options.pagedDropdownWidth) {
                dropdown.style.setProperty("width", this.options.pagedDropdownWidth, "important")
                dropdown.style.setProperty("max-width", this.options.pagedDropdownWidth, "important")
            }
            else if (dropdown) {
                dropdown.style.removeProperty("width")
                dropdown.style.removeProperty("max-width")
            }
        }

        #updatePager() {
            this.totalPages = this.#calculateTotalPages()

            let pagers = this.#getPagerElements()

            if (!pagers.length) {
                return            }

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

            if (this.boundSearchHandler) {
                search.removeEventListener("input", this.boundSearchHandler, true)
            }

            this.boundSearchHandler = event => {
                event.stopImmediatePropagation()
                this.filter(event.target.value)
            }

            search.addEventListener("input", this.boundSearchHandler, true)

            let clear = this.#getSearchClearElement()

            if (clear) {
                if (this.boundSearchClearHandler) {
                    clear.removeEventListener("click", this.boundSearchClearHandler, true)
                }

                this.boundSearchClearHandler = event => {
                    event.preventDefault()
                    event.stopImmediatePropagation()
                    this.filter("")
                }

                clear.addEventListener("click", this.boundSearchClearHandler, true)
            }
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

        #getSearchClearElement() {
            if (!this.instance || !this.instance.seq) {
                return null
            }

            return document.querySelector("#select-search-icon-" + this.instance.seq)
        }

        #restoreSearchInput(focus = false) {
            let search = this.#getSearchInputElement()

            if (!search) {
                return
            }

            search.value = this.searchTerm

            if (!focus) {
                return
            }

            search.focus({ preventScroll: true })

            let position = search.value.length
            search.setSelectionRange(position, position)
        }

        #renderRemotePlaceholder() {
            // Remote mode will be implemented after local paged mode is stable.
        }

        #captureDropdownState() {
            let state = {
                open: false
            }

            if (!this.instance || !this.instance.seq) {
                return state
            }

            let dropdown = document.querySelector("#select-dropdown-wrapper-" + this.instance.seq)

            if (!dropdown) {
                return state
            }

            state.open = dropdown.classList.contains("show")

            return state
        }

        #restoreDropdownState(state, keepOpen = false) {
            if (!state || !keepOpen || !state.open || !this.instance || !this.instance.seq) {
                this.#closeDropdown()
                return
            }

            let inputWrapper = document.querySelector("#select-input-wrapper-" + this.instance.seq)

            if (!inputWrapper) {
                this.#closeDropdown()
                return
            }

            bootstrap.Dropdown.getOrCreateInstance(inputWrapper).show()
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

            if (inputWrapper && typeof bootstrap !== "undefined" && bootstrap.Dropdown) {
                let dropdownInstance = bootstrap.Dropdown.getInstance(inputWrapper)

                if (dropdownInstance) {
                    dropdownInstance.hide()
                    return
                }
            }

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
            this.#rebuildBootstrapSelect(dropdownState, true, this.searchTerm.length > 0)

            return this
        }

        #previousPage() {
            return this.#goToPage(this.currentPage - 1)
        }

        #nextPage() {
            return this.#goToPage(this.currentPage + 1)
        }

        #getAllowedSourceOptions() {
            if (this.allowedValues === null) {
                return [...this.sourceOptions]
            }

            return this.sourceOptions.filter(option => {
                return this.allowedValues.has(option.value)
            })
        }

        #limitSelectedValuesToAllowed() {
            if (this.allowedValues === null) {
                return false
            }

            let selectedValues = this.selectedValues.filter(value => {
                return this.allowedValues.has(value)
            })
            let changed = selectedValues.length != this.selectedValues.length

            this.selectedValues = selectedValues

            return changed
        }

        #filterSourceOptions(search = "") {
            let sourceOptions = this.#getAllowedSourceOptions()
            let normalizedSearch = bsSelect.normaliseSearchText(String(search).trim())

            if (!normalizedSearch.length) {
                return sourceOptions
            }

            return sourceOptions.filter(option => {
                return bsSelect.normaliseSearchText(option.text).includes(normalizedSearch)
                    || bsSelect.normaliseSearchText(option.value).includes(normalizedSearch)
            })
        }

        #filterLocalOptions(search = "") {
            this.searchTerm = String(search)
            this.#syncSelectedValuesFromNative()
            this.filteredOptions = this.#filterSourceOptions(this.searchTerm)

            let dropdownState = this.#captureDropdownState()

            this.currentPage = 0
            this.#rebuildBootstrapSelect(dropdownState, dropdownState.open, true)

            return this
        }

        #requestRemoteOptions(search = "") {
            // Placeholder: debounce and request remote results.
            void search

            return this
        }

        #handleRemoteResponse(response) {
            // Placeholder: normalise remote results and update the rendered page.
            void response

            return this
        }

        #onNativeChange() {
            this.#syncSelectedValuesFromNative()
        }

        #dispatchChange() {
            this.element.dispatchEvent(new Event("change", { bubbles: true }))
        }

        #normaliseValueParameters(parameters = {}) {
            return Object.assign({
                swap: true,
                disabled: false
            }, parameters || {})
        }

        #setPagedValue(values, parameters = {}) {
            parameters = this.#normaliseValueParameters(parameters)
            values = this.#normaliseValues(values)

            let availableOptions = this.#getAllowedSourceOptions()

            if (!this.element.multiple) {
                let value = values.length ? values[0] : ""
                let option = availableOptions.find(item => item.value == value)

                if (!option) {
                    return this
                }

                if (option.disabled && !parameters.disabled) {
                    console.warn(
                        "Warning: Trying to select a disabled option; use `.value(value, { disabled: true })` to select disabled options"
                    )
                    return this
                }

                this.selectedValues = [option.value]
                this.#applySelectedValuesToSource()

                let page = this.#findOptionPage(option.value)

                if (page >= 0) {
                    this.currentPage = page
                }

                this.#rebuildBootstrapSelect()
                this.#dispatchChange()

                return this
            }
            let selected = parameters.swap
                ? new Set()
                : new Set(this.selectedValues)

            for (let value of values) {
                let matchingOptions = availableOptions.filter(option => option.value == value)

                for (let option of matchingOptions) {
                    if (option.disabled && !parameters.disabled) {
                        console.warn(
                            "Warning: Trying to select the disabled option with value "
                            + option.value
                            + "; use `.value(value, { disabled: true })` to select disabled options"
                        )
                        continue
                    }

                    selected.add(option.value)
                }
            }

            this.selectedValues = [...selected]
            this.#applySelectedValuesToSource()
            this.#rebuildBootstrapSelect()
            this.#dispatchChange()

            return this
        }

        refresh() {
            if (this.options.renderMode != "paged") {
                if (this.instance && typeof this.instance.refresh === "function") {
                    this.instance.refresh()
                }

                return this
            }

            this.#syncSelectedValuesFromNative()
            this.#applySelectedValuesToSource()

            this.filteredOptions = this.#filterSourceOptions(this.searchTerm)

            this.#rebuildBootstrapSelect()

            return this
        }

        destroy() {
            this.$element.off("." + pluginName)
            this.#removePager()

            if (this.form && this.boundFormResetHandler) {
                this.form.removeEventListener("reset", this.boundFormResetHandler)
            }

            if (this.options.renderMode == "paged") {
                this.#syncSelectedValuesFromNative()
                this.#applySelectedValuesToSource()
                this.#restoreFullNativeOptions()
            }

            if (
                this.options.destroyBootstrapSelect
                && this.createdBootstrapSelect
                && this.instance
                && typeof this.instance.destroy === "function"
            ) {
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
                if (this.options.renderMode == "paged") {
                    return this.element.multiple
                        ? [...this.selectedValues]
                        : (this.selectedValues[0] ?? "")
                }

                return this.instance.value()
            }

            if (this.options.renderMode == "paged") {
                return this.#setPagedValue(values, parameters)
            }

            this.instance.value(values, parameters)
            this.#syncSelectedValuesFromNative()

            return this
        }

        sort(parameters) {
            if (this.options.renderMode == "paged") {
                this.#syncSelectedValuesFromNative()
                this.sourceOptions.sort((first, second) => {
                    return first.text.localeCompare(second.text)
                })

                this.filteredOptions = this.#filterSourceOptions(this.searchTerm)

                this.totalPages = this.#calculateTotalPages()

                if (this.currentPage >= this.totalPages) {
                    this.currentPage = this.totalPages - 1
                }

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

        filterValues(values = null) {
            if (this.options.renderMode != "paged") {
                console.warn("jquery-bootstrap-select filterValues() is only available in paged mode")

                return this
            }

            this.#syncSelectedValuesFromNative()

            this.allowedValues = values === null
                ? null
                : new Set(this.#normaliseValues(values))

            let selectionChanged = this.#limitSelectedValuesToAllowed()

            this.#applySelectedValuesToSource()
            this.filteredOptions = this.#filterSourceOptions(this.searchTerm)
            this.#setInitialPageFromSelection()

            let dropdownState = this.#captureDropdownState()

            this.#rebuildBootstrapSelect(
                dropdownState,
                dropdownState.open,
                this.searchTerm.length > 0
            )

            if (selectionChanged) {
                this.#dispatchChange()
            }

            return this
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
