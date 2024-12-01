# web-toolbox

This is a set of tools for web developers written with two concepts in mind: a gadget should do at least what it is supposed to do and, at the same time, it should do no more that what it is supposed to do.
In other words, keep it as simple as possible.

I, of course, used jQuery. I consider jQuery the most powerful javascript library ever, and I have never felt the need to re-invent the wheel.

I also appreciate Bootstrap, Bootstrap-Icons and FontAwesome (free version), and I consider them not only very useful web designing tools, but also the very basis of modern web design.
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
    headerColor:             // String
    headerBackgroundColor:   // String
    iconClass:               // String
    title:                   // String
    titleAlign:              // String
    bodyTextAlign:           // String
    bodyTextColor:           // String
    bodyBackgroundColor:     // String
    text:                    // String
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
// Accepted values: any integer (timeout values in milliseconds)
// Note: any non integer value defaults to 3000

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
// Note: any non string value defaults to "#495057", and, if no value is provided, the header color for "success", "info", "warning" and "error" *type* values is set automatically

headerBackgroundColor: ""
// Action: sets the background color of the toast header
// Default value: "#E2E3E5"
// Accepted values: any CSS color using predefined color names, or RGB, HEX, HSL, RGBA, HSLA values
// Note: any non string value defaults to "#E2E3E5", and, if no value is provided, the header background color for "success", "info", "warning" and "error" *type* values is set automatically

iconClass: ""
// Action: sets the class of the header icon
// Default value: ""
// Accepted values: any icon font class name available in your project 
// Note: if either *hasBootstrapIcons* or *hasFontAwesome* are true, the icon class for "success", "info", "warning" and "error" *type* values is set automatically

title: (optional)
// Action: sets the toast title 
// Default value: ""
// Accepted values: any string
// Note: an empty string defaults to the toast *type* string, with the first letter uppercase

titleAlign: "left"
// Action: sets the text alignement of the toast title 
// Default value: "left"
// Accepted values: "left", "centre", "center", "right"
// Note: any non string value and any string different from the accepted values defaults to "left"

bodyTextAlign: "left"
// Action: sets the alignement of the toast body 
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
// Note: if the value is an array, the result will be an un ordered list in which any element of the array becomes a list item

hasBootstrapIcons: true
// Action: automatically sets Boostrap-Icons icon classes for "success", "info", "warning" and "error" *type* values
// Default: true
// Accepted values: either true or false
// Note: any non boolean value defaults to false, and, if both hasBootstrapIcons and hasFontAwesome are set true, hasBootstrapIcons gets priority

hasFontAwesome: false
// Action: automatically sets FontAwesome icon classes for "success", "info", "warning" and "error" *type* values
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
// Action: function called after the toast is shown
// Default: empty function
// Accepted values: any function
// Note: the parameter is ignored if it's not a function

```



