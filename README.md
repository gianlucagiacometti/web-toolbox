# web-toolbox

This is a set of tools for web developers written with two concepts in mind: a gadget should do at least what it is supposed to do and, at the same time, it should do no more that what it is supposed to do.
In other words, keep it as simple as possible.

I, of course, used jQuery. I consider jQuery the most powerful javascript library ever, and I have never felt the need to re-invent the wheel.

I also appreciate Bootstrap, Bootstrap Icons and Font Awesome (free version), and I consider them not only very useful web designing tools, but also the very basis of modern web design.
Therefore, I conformed the layouts to the Bootstrap standards and I designed all my tools for an optional use of the two icon sets.

## Install
```
composer require gianlucagiacometti/web-toolbox
```
or
```
git clone https://github.com/gianlucagiacometti/web-toolbox.git
```
and include the CSS and JS files in your web page

## Tools

## jquery-toast

I decided to write a simple function on purpose. No need for a jQuery plugin, at least so far.

### Usage

```
toast(type, options)
```
or, since the function returns a jQuery object:
```
var MyToast = toast(type, options)
```
### Basic usage examples

```
toast("success", { title: "Toast personalised title", text: "Toast success message" }
```
```
toast("error", { text: "Toast error message", hasBootstrapIcons: true }
```
```
toast("warning", { text: "Toast warning message", hasFontAwesome: true }
```
### Toast type

*type* can be any string.

If the type value is one of the following: "success", "info", "warning" or "error", a default colour is automatically set for the title, the header background, and, if there is one, the header icon.
These default colours correspond to the equivalent Bootstrap colours for the same message types.

### Toast options

```
var options = {
    position:                // String
    closeIcon:               // Boolean
    autoClose:               // Integer
    autoRemove:              // Boolean
    transitionType:          // String
    maxStackMembers:         // Integer
    title:                   // String
    titleAlign:              // String
    titleColor:              // String
    titleBackgroundColor:    // String
    iconClass:               // String
    text:                    // String
    textAlign:               // String
    textColor:               // String
    textBackgroundColor:     // String
    hasBootstrapIcons:       // Boolean
    hasFontAwesome:          // Boolean
    beforeShow:              // Function
    afterShown:              // Function
    beforeHide:              // Function
    afterHidden:             // Function
}

```
### Option details

```
position: "bottom-right"
// Action: sets the toast position
// Default: "bottom-right"
// Accepted values: "bottom-right", "bottom-centre", "bottom-center", "bottom-left", "top-left", "top-centre", "top-center", "top-right", "mid-centre", "mid-center" or an object like { top: "top value", right: "right value", bottom: "bottom value", left: "left value" } 

closeIcon: true
// Action: sets the close button either visible or hidden
// Default: true
// Accepted values: either true or false
// Note: any non boolean value defaults to false

autoClose: 3000
// Action: sets the timeout for the toast to close automatically
// Default: 3000 (3 seconds)
// Accepted values: any integer (timeout values in milliseconds)
// Note: any non integer value defaults to 3000

```



