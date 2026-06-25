# web-toolbox

This is a set of tools for web developers written with two concepts in mind: a gadget should do at least what it is supposed to do and, at the same time, it should do no more that what it is supposed to do.

In other words, keep it as simple as possible.

I, of course, use jQuery. I consider jQuery the most powerful JavaScript library ever, and I have never felt the need to re-invent the wheel.

I also appreciate Bootstrap, Bootstrap Icons and Font Awesome Free, and I consider them not only very useful web design tools, but also the very basis of modern web design.

Therefore, I conformed the layouts to the Bootstrap standards and I designed all my tools for an optional use of the two icon sets.


## Requirements

- jQuery 4
- Bootstrap Select 5.3.x, when using `jquery-bootstrap-select`
- Bootstrap Pickadate 5.3.x, when using `jquery-bootstrap-pickadate`

jQuery is treated as a frontend dependency and is not installed through Composer. Install it with your frontend package manager, for example with Yarn.


## Install

```bash
composer require gianlucagiacometti/web-toolbox
```

or

```bash
git clone https://github.com/gianlucagiacometti/web-toolbox.git
```

Then include the CSS and JS files you need in your web page.


## Tools

- `jquery-toast`
- `jquery-bootstrap-select`
- `jquery-bootstrap-pickadate`


## jquery-bootstrap-select

`jquery-bootstrap-select` is a jQuery wrapper and extended rendering layer for Bootstrap Select.

It can be used as a light bridge to Bootstrap Select in normal mode, or as a local paged renderer for very large select elements.

The wrapper does not replace Bootstrap Select. It uses Bootstrap Select underneath and adds jQuery-style initialisation, helper methods, and large-list rendering modes.


### Script order

Load jQuery first, then Bootstrap, then Bootstrap Select, then `jquery-bootstrap-select`.

```html
<link rel="stylesheet" href="/assets/bootstrap-select/bootstrap-select.css">
<link rel="stylesheet" href="/assets/jquery-bootstrap-select/jquery-bootstrap-select.css">

<script src="/assets/jquery/jquery.min.js"></script>
<script src="/assets/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="/assets/bootstrap-select/bootstrap-select.js"></script>
<script src="/assets/jquery-bootstrap-select/jquery-bootstrap-select.js"></script>
```


### Basic usage

```html
<select id="my-select" class="bootstrap-select">
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
</select>
```

```js
$("#my-select").jqueryBootstrapSelect()
```


### Normal mode

Normal mode delegates rendering and behaviour to Bootstrap Select.

```html
<select
    id="normal-select"
    class="bootstrap-select"
    data-bs-select-render-mode="normal"
>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
</select>
```

```js
$("#normal-select").jqueryBootstrapSelect()
```


### Large local select example

Paged mode keeps the full option source in memory and renders only the current page into Bootstrap Select.

This is useful when the full native select contains many options, but rendering all visual option rows at once would make the dropdown heavy or slow.

```html
<select
    id="country-select"
    class="bootstrap-select searchable"
    data-bs-select-huge="true"
    data-bs-select-page-size="50"
    data-bs-select-render-mode="paged"
    data-bs-select-paged-dropdown-width="300px"
>
    <option value="it" data-bs-select-option-icon-class="fi fi-it">Italy</option>
    <option value="fr" data-bs-select-option-icon-class="fi fi-fr">France</option>
    <option value="de" data-bs-select-option-icon-class="fi fi-de">Germany</option>
    <option value="jp" data-bs-select-option-icon-class="fi fi-jp">Japan</option>
</select>
```

```js
$("#country-select").jqueryBootstrapSelect()
```

Paged mode adds a compact pager above and below the option list:

```text
Previous | Next | Page 2 / 6
```

The dropdown keeps its current placement while paging. If Bootstrap opens the dropdown above the field because the select is near the bottom of the page, the dropdown stays above while moving between pages.

Paged mode also applies a default `300px` dropdown width so large lists do not become unnecessarily wide. You can widen it, narrow it, or disable the fixed width with `data-bs-select-paged-dropdown-width` or the `pagedDropdownWidth` JavaScript option.


### Render modes

| Mode | Description |
|------|-------------|
| `normal` | Delegates rendering and behaviour to Bootstrap Select. |
| `paged` | Keeps the full option source in memory and renders only the current page. |
| `remote` | Reserved for future remote data loading. |


### Data attributes

| Attribute | Description |
|-----------|-------------|
| `data-bs-select-huge="true"` | Enables huge-select handling. If no render mode is provided, paged mode is used. |
| `data-bs-select-page-size="50"` | Sets how many options are rendered per page. |
| `data-bs-select-render-mode="paged"` | Sets the render mode. Accepted values are `normal`, `paged`, and `remote`. |
| `data-bs-select-paged-dropdown-width="300px"` | Sets the dropdown width in paged mode. Use `false` to disable the default fixed width. |


### JavaScript options

Options can also be passed directly when initialising the plugin.

```js
$("#country-select").jqueryBootstrapSelect({
    huge: true,
    pageSize: 50,
    renderMode: "paged",
    pagedListMaxHeight: "300px",
    pagedDropdownWidth: "300px"
})
```

| Option | Default | Description |
|--------|---------|-------------|
| `huge` | `false` | Enables huge-select handling. |
| `pageSize` | `50` | Number of options rendered per page in paged mode. |
| `renderMode` | `"normal"` | Render mode. Accepted values are `normal`, `paged`, and `remote`. |
| `destroyBootstrapSelect` | `true` | Allows the wrapper to destroy and rebuild the underlying Bootstrap Select instance when needed. |
| `pagedListMaxHeight` | `"300px"` | Maximum height of the paged option list before internal scrolling is used. |
| `pagedDropdownWidth` | `"300px"` | Width applied to the dropdown in paged mode. Use `false` to leave the dropdown width untouched. |


### Methods

The plugin follows the usual jQuery plugin style.

```js
$("#country-select").jqueryBootstrapSelect("methodName", argument1, argument2)
```


#### `value()`

Gets the current value.

```js
$("#country-select").jqueryBootstrapSelect("value")
```


#### `value(values, parameters)`

Sets the current value by delegating to Bootstrap Select.

```js
$("#country-select").jqueryBootstrapSelect("value", "it")
```

For multiple selects:

```js
$("#country-select").jqueryBootstrapSelect("value", ["it", "fr"])
```


#### `sort(parameters)`

Sorts the options.

```js
$("#country-select").jqueryBootstrapSelect("sort")
```

In normal mode, sorting is delegated to Bootstrap Select.

In paged mode, the wrapper sorts the local source options and rebuilds the current page.


#### `disabled(status)`

Sets the select as disabled or enabled.

```js
$("#country-select").jqueryBootstrapSelect("disabled", true)
$("#country-select").jqueryBootstrapSelect("disabled", false)
```


#### `readonly(status)`

Sets the select as readonly or not readonly.

```js
$("#country-select").jqueryBootstrapSelect("readonly", true)
$("#country-select").jqueryBootstrapSelect("readonly", false)
```


#### `mode()`

Returns the current render mode.

```js
$("#country-select").jqueryBootstrapSelect("mode")
```


#### `isHuge()`

Returns whether huge-select handling is enabled.

```js
$("#country-select").jqueryBootstrapSelect("isHuge")
```


#### `pageSize()`

Returns the configured page size.

```js
$("#country-select").jqueryBootstrapSelect("pageSize")
```


#### `currentPageNumber()`

Returns the current page number, starting from 1.

```js
$("#country-select").jqueryBootstrapSelect("currentPageNumber")
```


#### `pages()`

Returns the total number of pages.

```js
$("#country-select").jqueryBootstrapSelect("pages")
```


#### `previousPage()`

Moves to the previous page.

```js
$("#country-select").jqueryBootstrapSelect("previousPage")
```


#### `nextPage()`

Moves to the next page.

```js
$("#country-select").jqueryBootstrapSelect("nextPage")
```


#### `filter(search)`

Filters local source options in paged mode and rebuilds the rendered page.

```js
$("#country-select").jqueryBootstrapSelect("filter", "it")
```


### Notes on paged mode

Paged mode is designed for large local lists.

The original options are cloned and kept in memory. Only the current page is written into the native select and rendered by Bootstrap Select.

Current limits:

- `insert()` is not implemented for paged mode yet.
- `remove()` is not implemented for paged mode yet.
- `remote` mode is reserved for future remote data loading.


## jquery-bootstrap-pickadate

`jquery-bootstrap-pickadate` is a jQuery wrapper for Bootstrap Pickadate.

The wrapper does not replace Bootstrap Pickadate. It keeps Bootstrap Pickadate as the underlying plain JavaScript component and adds jQuery-style initialisation, helper methods, safe refresh/destroy calls, and framework-friendly helpers for dynamically injected HTML.

No companion CSS file is required. Styling remains provided by Bootstrap Pickadate.


### Script order

Load jQuery first, then Bootstrap, then Bootstrap Pickadate, then any locale files, then `jquery-bootstrap-pickadate`.

```html
<link rel="stylesheet" href="/assets/bootstrap-pickadate/bootstrap-pickadate.css">

<script src="/assets/jquery/jquery.min.js"></script>
<script src="/assets/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="/assets/bootstrap-pickadate/bootstrap-pickadate.js"></script>
<script src="/assets/bootstrap-pickadate/locales/bootstrap-pickadate.it.js"></script>
<script src="/assets/jquery-bootstrap-pickadate/jquery-bootstrap-pickadate.js"></script>
```


### Basic usage

```html
<input
    id="event-date-display"
    class="form-control bootstrap-pickadate"
    data-bs-pickadate-locale="current"
    data-bs-pickadate-hidden-target="#event-date"
>
<input id="event-date" name="event_date" type="hidden">
```

```js
$("#event-date-display").jqueryBootstrapPickadate()
```


### Same-input interval example

```html
<input
    id="booking-dates-display"
    class="form-control bootstrap-pickadate"
    data-bs-pickadate-mode="interval"
    data-bs-pickadate-locale="current"
    data-bs-pickadate-hidden-target="#booking-interval"
    data-bs-pickadate-hidden-start-target="#booking-start"
    data-bs-pickadate-hidden-end-target="#booking-end"
>
<input id="booking-interval" name="booking_interval" type="hidden">
<input id="booking-start" name="booking_start" type="hidden">
<input id="booking-end" name="booking_end" type="hidden">
```

```js
$("#booking-dates-display").jqueryBootstrapPickadate()
```


### JavaScript options

Options are passed directly to Bootstrap Pickadate when the underlying component is created.

```js
$("#event-date-display").jqueryBootstrapPickadate({
    locale: "current"
})
```

| Option | Default | Description |
|--------|---------|-------------|
| `destroyBootstrapPickadate` | `true` | Allows the wrapper to destroy the underlying Bootstrap Pickadate instance when `destroy()` or `reinitialise()` is called. |


### Methods

The plugin follows the usual jQuery plugin style.

```js
$("#event-date-display").jqueryBootstrapPickadate("methodName", argument1, argument2)
```


#### `instanceObject()`

Returns the underlying Bootstrap Pickadate instance.

```js
$("#event-date-display").jqueryBootstrapPickadate("instanceObject")
```


#### `refresh()`

Refreshes the underlying picker from the current data attributes and state.

```js
$("#event-date-display").jqueryBootstrapPickadate("refresh")
```


#### `refreshLocale(locale)`

Refreshes the picker locale.

```js
$("#event-date-display").jqueryBootstrapPickadate("refreshLocale", "current")
$("#event-date-display").jqueryBootstrapPickadate("refreshLocale", "it")
```


#### `reinitialise(options)`

Destroys and creates the picker again.

```js
$("#event-date-display").jqueryBootstrapPickadate("reinitialise", {
    locale: "current"
})
```


#### `destroy()`

Destroys the underlying picker and removes the jQuery wrapper data.

```js
$("#event-date-display").jqueryBootstrapPickadate("destroy")
```


#### `value()`

Gets the current ISO value.

```js
$("#event-date-display").jqueryBootstrapPickadate("value")
```

For interval mode, the returned value is the combined ISO interval value:

```text
yyyy-mm-dd/yyyy-mm-dd
```


#### `value(value)`

Sets the current value.

```js
$("#event-date-display").jqueryBootstrapPickadate("value", "2026-06-25")
$("#booking-dates-display").jqueryBootstrapPickadate("value", "2026-06-01/2026-06-10")
```


#### `clear()`

Clears the picker value.

```js
$("#event-date-display").jqueryBootstrapPickadate("clear")
```


#### `today()`

Selects today when it is selectable.

```js
$("#event-date-display").jqueryBootstrapPickadate("today")
```


#### `open()`, `close()`, `toggle()`

Controls the picker dropdown.

```js
$("#event-date-display").jqueryBootstrapPickadate("open")
$("#event-date-display").jqueryBootstrapPickadate("close")
$("#event-date-display").jqueryBootstrapPickadate("toggle")
```


#### `setMin(value)` and `setMax(value)`

Sets runtime minimum and maximum selectable dates.

```js
$("#event-date-display").jqueryBootstrapPickadate("setMin", "2026-01-01")
$("#event-date-display").jqueryBootstrapPickadate("setMax", "2026-12-31")
```


#### `setViewMonth(month)` and `setViewYear(year)`

Changes the visible month or year without changing the selected value.

```js
$("#event-date-display").jqueryBootstrapPickadate("setViewMonth", 5)
$("#event-date-display").jqueryBootstrapPickadate("setViewYear", 2026)
```

Month numbers are zero-based, following JavaScript `Date` month indexes.


#### `moveMonth(delta)` and `moveYear(delta)`

Moves the visible calendar view.

```js
$("#event-date-display").jqueryBootstrapPickadate("moveMonth", 1)
$("#event-date-display").jqueryBootstrapPickadate("moveYear", -1)
```


### Framework helpers

The wrapper exposes helper methods for dynamically injected pages, components, and modals.

```js
$.jqueryBootstrapPickadate.initialise(container, {
    locale: "current"
})
```

```js
$.jqueryBootstrapPickadate.refreshAll(container)
$.jqueryBootstrapPickadate.refreshLocale("current", container)
$.jqueryBootstrapPickadate.destroyAll(container)
$.jqueryBootstrapPickadate.setDefaultLocale("it")
```

This is useful after AJAX-rendered HTML has been inserted into the page:

```js
$.jqueryBootstrapPickadate.initialise(document.getElementById("main-content"), {
    locale: "current"
})
```

After a website language change:

```js
$.jqueryBootstrapPickadate.setDefaultLocale("it")
$.jqueryBootstrapPickadate.refreshLocale("current")
```


## jquery-toast

I decided to write a simple function on purpose. No need for a jQuery plugin, at least so far.


### Usage

```js
toast(type, options)
```

or, since the function returns a jQuery object:

```js
var MyToast = toast(type, options)
```


### Basic usage examples

```js
toast("success", { title: "Toast personalised title", text: "Toast success message" })
```

```js
toast("error", { text: "Toast error message", hasBootstrapIcons: true })
```

```js
toast("warning", { text: "Toast warning message", hasFontAwesome: true })
```

NOTE: `hasBootstrapIcons: true` is the default setting.

NOTE: `message` is a synonym of `text`.


### Toast type

`type` can be any string.

If the type value is one of the following: "success", "info", "warning" or "error", a default colour is automatically set for the title, the header background, and, if there is one, the header icon.

These default colours correspond to the equivalent Bootstrap colours for the same message types.


### Escaping untrusted text

`jquery-toast` allows HTML in `title` and `text`.

When you need to display untrusted user input, escape it first:

```js
const escapeHTML = (string) => $("<div>").text(string).html();

toast("info", {
    title: "Message",
    text: escapeHTML(userInput)
});
```


### Toast options

```js
var options = {
    position:                // String
    closeIcon:               // Boolean
    autoClose:               // Integer|false
    autoRemove:              // Boolean
    transitionType:          // String
    maxStackMembers:         // Integer
    headerColor:             // String
    headerBackgroundColor:   // String
    iconClass:               // String
    title:                   // String
    titleAlign:              // String
    bodyTextAlign:           // String
    bodyTextColor:           // String
    bodyBackgroundColor:     // String
    text:                    // String|Array
    hasBootstrapIcons:       // Boolean
    hasFontAwesome:          // Boolean
    beforeShow:              // Function
    afterShown:              // Function
    beforeHide:              // Function
    afterHidden:             // Function
}
```


### Option details

```js
position: "bottom-right"
// Action: sets the toast position
// Default value: "bottom-right"
// Accepted values: "bottom-right", "bottom-centre", "bottom-center", "bottom-left", "top-left", "top-centre", "top-center", "top-right", "mid-centre", "mid-center" or an object like { top: "top value", right: "right value", bottom: "bottom value", left: "left value" }

closeIcon: true
// Action: sets the close button either visible or hidden
// Default value: true
// Accepted values: either true or false
// Note: any non boolean value defaults to false

autoClose: 3000
// Action: sets the timeout for the toast to close automatically
// Default value: 3000
// Accepted values: any integer timeout value in milliseconds or false
// Note: any non integer value different from boolean false defaults to 3000

autoRemove: true
// Action: removes the toast element from the DOM right after the afterHidden function is called
// Default value: true
// Accepted values: either true or false
// Note: any non boolean value defaults to false

transitionType: "fade"
// Action: sets the transition type when the element shows or hides
// Default value: "fade"
// Accepted values: "fade", "slide", or false

maxStackMembers: 5
// Action: sets how many toast messages can be visible at the same time
// Default value: 5
// Accepted values: any positive integer

headerColor: null
// Action: sets the header text colour
// Default value: automatic according to toast type when available

headerBackgroundColor: null
// Action: sets the header background colour
// Default value: automatic according to toast type when available

iconClass: null
// Action: sets a custom icon class
// Default value: automatic according to toast type and icon library options

title: null
// Action: sets the toast title

titleAlign: null
// Action: sets the title text alignment

bodyTextAlign: null
// Action: sets the toast body text alignment

bodyTextColor: null
// Action: sets the toast body text colour

bodyBackgroundColor: null
// Action: sets the toast body background colour

text: null
// Action: sets the toast body text
// Accepted values: string or array

message: null
// Action: synonym of text

hasBootstrapIcons: true
// Action: enables Bootstrap Icons default icons

hasFontAwesome: false
// Action: enables Font Awesome default icons

beforeShow: null
// Action: function called before the toast is shown

afterShown: null
// Action: function called after the toast is shown

beforeHide: null
// Action: function called before the toast is hidden

afterHidden: null
// Action: function called after the toast is hidden
```


### Notes

Use the tools independently. Include only the files you need for the specific page or project.

`jquery-bootstrap-select` requires Bootstrap Select.

`jquery-bootstrap-pickadate` requires Bootstrap Pickadate.

`jquery-toast` only requires jQuery and Bootstrap-compatible markup/styles.
