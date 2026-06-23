# web-toolbox

This is a set of tools for web developers written with two concepts in mind: a gadget should do at least what it is supposed to do and, at the same time, it should do no more that what it is supposed to do.
In other words, keep it as simple as possible.

I, of course, use jQuery. I consider jQuery the most powerful JavaScript library ever, and I have never felt the need to re-invent the wheel.

I also appreciate Bootstrap, Bootstrap Icons and Font Awesome Free, and I consider them not only very useful web design tools, but also the very basis of modern web design.
Therefore, I conformed the layouts to the Bootstrap standards and I designed all my tools for an optional use of the two icon sets.

## Requirements

- jQuery 4
- Bootstrap Select 5.3.x

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

## jquery-bootstrap-select

`jquery-bootstrap-select` is a jQuery wrapper and extended rendering layer for Bootstrap Select.

It can be used as a light bridge to Bootstrap Select in normal mode, or as a local paged renderer for very large select elements.

The wrapper does not replace Bootstrap Select. It uses Bootstrap Select underneath and adds jQuery-style initialisation, helper methods, and large-list rendering modes.

### Script order

Load jQuery first, then Bootstrap, then Bootstrap Select, then `jquery-bootstrap-select`.

```html
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
// Default value: 3000 (3 seconds)
// Accepted values: any integer (timeout values in milliseconds) or false
// Note: any non integer value different from boolean false defaults to 3000

autoRemove: true
// Action: removes the toast element from the DOM right after the 'afterHidden' function is called
// Default: true
// Accepted values: either true or false
// Note: any non boolean value defaults to false

transitionType: "fade"
// Action: sets the transition type when the element shows or hides
// Default value: "fade"
// Accepted values: "fade", "slide", "" (the latter meaning that the element is either immediately shown or hidden)
// Note: any value different from "fade" and "slide" defaults to an empty string

maxStackMembers: 5
// Action: sets the maximum number of toast messages visible at the same time
// Default value: 5
// Accepted values: any integer between 1 and 10
// Note: any non integer value or any value outside the accepted interval defaults to 5

headerColor: ""
// Action: sets the color of the toast header elements (icon, title and close icon), and the header border
// Default value: "#495057"
// Accepted values: any CSS color using predefined color names, or RGB, HEX, HSL, RGBA, HSLA values
// Note: any non string value defaults to "#495057", and, if no value is provided, the header color for "success", "info", "warning" and "error" type values is set automatically

headerBackgroundColor: ""
// Action: sets the background color of the toast header
// Default value: "#E2E3E5"
// Accepted values: any CSS color using predefined color names, or RGB, HEX, HSL, RGBA, HSLA values
// Note: any non string value defaults to "#E2E3E5", and, if no value is provided, the header background color for "success", "info", "warning" and "error" type values is set automatically

iconClass: ""
// Action: sets the class of the header icon
// Default value: ""
// Accepted values: any icon font class name available in your project
// Note: if either hasBootstrapIcons or hasFontAwesome are true, the icon class for "success", "info", "warning" and "error" type values is set automatically

title: (optional)
// Action: sets the toast title
// Default value: ""
// Accepted values: any string
// Note: an empty string defaults to the toast type string, with the first letter uppercase

titleAlign: "left"
// Action: sets the text alignment of the toast title
// Default value: "left"
// Accepted values: "left", "centre", "center", "right"
// Note: any non string value and any string different from the accepted values defaults to "left"

bodyTextAlign: "left"
// Action: sets the alignment of the toast body
// Default value: "left"
// Accepted values: "left", "centre", "center", "right"
// Note: any non string value and any string different from the accepted values defaults to "left"

bodyColor: ""
// Action: sets the color of the toast body
// Default value: "#495057"
// Accepted values: any CSS color using predefined color names, or RGB, HEX, HSL, RGBA, HSLA values
// Note: any non string value defaults to "#495057"

bodyBackgroundColor: ""
// Action: sets the background color of the toast body
// Default value: "#FCFCFD"
// Accepted values: any CSS color using predefined color names, or RGB, HEX, HSL, RGBA, HSLA values
// Note: any non string value defaults to "#FCFCFD"

text: ""
// Action: sets the toast message
// Default value: ""
// Accepted values: simple text, array or any HTML script
// Note: if the value is an array, the result will be an unordered list in which any element of the array becomes a list item

hasBootstrapIcons: true
// Action: automatically sets Bootstrap Icons icon classes for "success", "info", "warning" and "error" type values
// Default: true
// Accepted values: either true or false
// Note: any non boolean value defaults to false, and, if both hasBootstrapIcons and hasFontAwesome are set true, hasBootstrapIcons gets priority

hasFontAwesome: false
// Action: automatically sets Font Awesome icon classes for "success", "info", "warning" and "error" type values
// Default: false
// Accepted values: either true or false
// Note: any non boolean value defaults to false, and, if both hasBootstrapIcons and hasFontAwesome are set true, hasBootstrapIcons gets priority

beforeShow: function() {}
// Action: function called before the toast is shown
// Default: empty function
// Accepted values: any function
// Note: the parameter is ignored if it's not a function

afterShown: function() {}
// Action: function called after the toast is shown
// Default: empty function
// Accepted values: any function
// Note: the parameter is ignored if it's not a function

beforeHide: function() {}
// Action: function called before the toast is hidden
// Default: empty function
// Accepted values: any function
// Note: the parameter is ignored if it's not a function

afterHidden: function() {}
// Action: function called after the toast is hidden
// Default: empty function
// Accepted values: any function
// Note: the parameter is ignored if it's not a function
```
