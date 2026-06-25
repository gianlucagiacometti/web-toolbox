web-toolbox
===========

Version 2.1.5
=============

- Added `jquery-bootstrap-pickadate`, a jQuery wrapper for Bootstrap Pickadate.
- Added jQuery-style initialisation for `input.bootstrap-pickadate` elements.
- Added wrapper methods for refresh, locale refresh, reinitialise, destroy, value, clear, today, open, close, toggle, runtime min/max dates, visible month/year, and calendar navigation.
- Added framework-friendly helper methods for initialising, refreshing, locale-refreshing, destroying, and setting the default locale for pickers inside dynamically injected HTML.
- Added support for same-input interval values through the existing Bootstrap Pickadate API.
- Documented that Bootstrap Pickadate 5.3.x is required when using `jquery-bootstrap-pickadate`.
- Documented that no companion CSS file is required for `jquery-bootstrap-pickadate`.


Version 2.1.4
=============

- Improved `jquery-bootstrap-select` cleanup when reinitialising selects after AJAX page reloads.
- Detected stale `FORM.select` registry entries whose generated Bootstrap Select wrapper is no longer present in the DOM.
- Removed stale registry entries before creating a new select instance.
- Prevented errors caused by calling `destroy()` on already-removed generated select wrappers.


Version 2.1.3
=============

- Added `jquery-bootstrap-select.css` companion stylesheet.
- Improved visual alignment of generated select inputs with Bootstrap form fields.
- Fixed generated select height in outline-style form layouts.
- Kept select labels inside the input area with consistent size and position.
- Added Bootstrap-style select chevron styling for generated select inputs.
- Removed the incorrect pseudo-element fallback caret for the wrapper layout.


Version 2.1.2
=============

- Added `pagedDropdownWidth` option to `jquery-bootstrap-select`.
- Added `data-bs-select-paged-dropdown-width` attribute support.
- Set the default paged dropdown width to `300px`.
- Fixed paged dropdown height after changing pages.


Version 2.1.1 (2026-06-23)
==========================

- Added `jquery-bootstrap-select`, a jQuery wrapper and extended rendering layer for Bootstrap Select.
- Added normal mode, which delegates rendering and behaviour to Bootstrap Select.
- Added local paged mode for large select elements.
- Added support for `data-bs-select-huge`, `data-bs-select-page-size`, and `data-bs-select-render-mode`.
- Added top and bottom pagers for paged selects.
- Added stable dropdown placement while paging.
- Added internal frame scrolling for long paged option lists.
- Added wrapper methods for value, sorting, disabled, readonly, render mode, page size, page count, previous page, next page, and filtering.
- Added Bootstrap Select as a Composer dependency.
- Documented that jQuery 4 is a frontend dependency and is not installed through Composer.


Version 1.1.3
=============

- Fixed bugs in `jquery-toast`.
- Improved README documentation.


Version 1.1.0
=============

- Improved `jquery-toast` settings validation.
- Improved array handling for toast message text.
- Added documentation for escaping untrusted text.
- Improved README documentation.


Version 1.0.1
=============

- Fixed small bugs in `jquery-toast`.


Version 1.0.0
=============

- First release.
- Added `jquery-toast`.
