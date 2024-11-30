"use strict"

function toast(type, options) {

	var defaults = {
		position: "bottom-right",
		closeIcon: true,
		autoClose: 3000,
		autoRemove: true,
		transitionType: "fade",
		maxStackMembers: 5,
		title: "",
		titleAlign: "left",
		titleColor: "",
		titleDefaultColor: "#495057",
		titleBackgroundColor: "",
		titleDefaultBackgroundColor: "#E2E3E5",
		iconClass: "",
		text: "",
		textAlign: "left",
		textColor: "",
		textDefaultColor: "#495057",
		textBackgroundColor: "",
		textDefaultBackgroundColor: "#FCFCFD",
		hasBootstrapIcons: true,
		hasFontAwesome: false,
		beforeShow: function() {},
		afterShown: function() {},
		beforeHide: function() {},
		afterHidden: function() {}
	},

	settings = $.extend( {}, defaults, options ),

	random = Math.floor(Math.random() * Date.now()).toString(16),

	positions = ["bottom-right", "bottom-center", "bottom-left", "top-left", "top-center", "top-right", "mid-center"],

	iconClasses = {
		'bi': {
			'success': "bi bi-check-lg",
			'info': "bi bi-info-circle",
			'warning': "bi bi-exclamation-triangle",
			'error': "bi bi-x-square"
		},
		'fa': {
			'success': "fa-solid fa-check",
			'info': "fa-solid fa-circle-info",
			'warning': "fa-solid fa-triangle-exclamation",
			'error': "fa-regular fa-rectangle-xmark"
		}
	},

	textColors = {
		'success': "var(--bs-success-text-emphasis, #198754)",
		'info': "var(--bs-info-text-emphasis, #0DCAF0)",
		'warning': "var(--bs-warning-text-emphasis, #332701)",
		'error': "var(--bs-danger-text-emphasis, #DC3545)"
	},

	backgroundColors = {
		'success': "var(--bs-success-bg-subtle, #198754)",
		'info': "var(--bs-info-bg-subtle, #0DCAF0)",
		'warning': "var(--bs-warning-bg-subtle, #332701)",
		'error': "var(--bs-danger-bg-subtle, #DC3545)"
	},

	container = $('#jquery-toast-container'),

	toastElement = $('#jquery-toast-' + random),

	show = function() {

		var content = "",
		headerStyle = "",
		bodyStyle = "",
		toastElement = toastElement || $("<div></div>", {
			id: "jquery-toast-" + random,
			class: "jquery-toast"
		}).data('id', random)

		type = type.toLowerCase()
		if (!settings.title.length) {
			settings.title = type.charAt(0).toUpperCase() + type.substr(1)
		}

		if (typeof settings.closeIcon != "boolean") {
			settings.closeIcon = false
		}
		if (typeof settings.autoRemove != "boolean") {
			settings.autoremove = false
		}
		if (typeof settings.hasBootstrapIcons != "boolean") {
			settings.hasBootstrapIcons = false
		}
		if (typeof settings.hasFontAwesome != "boolean") {
			settings.hasFontAwesome = false
		}

		if (!container.length) {
			container = $("<div></div>", {
				id: "jquery-toast-container",
				class: "jquery-toast-container",
				role: "alert",
				'aria-live': "polite"
			})
			$('body').append(container)
		}
		else if (!settings.maxStackMembers || isNaN(parseInt(settings.maxStackMembers))) {
			container.empty()
		}

		if (settings.titleColor.length > 0) {
			headerStyle += "color: " + settings.titleColor + "; border-color: " + settings.titleColor + ";"
		}
		else if (textColors[type]) {
			headerStyle += "color: " + textColors[type] + "; border-color: " + textColors[type] + ";"
		}
		else {
			headerStyle += "color: " + settings.titleDefaultColor + "; border-color: " + settings.titleDefaultColor + ";"
		}
		if (settings.titleBackgroundColor.length > 0) {
			headerStyle += " background-color: " + settings.titleBackgroundColor + ";"
		}
		else if (backgroundColors[type]) {
			headerStyle += " background-color: " + backgroundColors[type] + ";"
		}
		else {
			headerStyle += " background-color: " + settings.titleDefaultBackgroundColor + ";"
		}
		headerStyle = " style=\"" + headerStyle + "\""
		content += "<div id=\"jquery-toast-header-" + random + "\" class=\"jquery-toast-header\"" + headerStyle + ">"

		if (settings.textColor.length > 0) {
			bodyStyle += "color: " + settings.textColor + "; border-color: " + settings.textColor + ";"
		}
		else {
			bodyStyle += "color: " + settings.textDefaultColor + ";"
			if (textColors[type]) {
				bodyStyle += "background-color: " + settings.textDefaultColor + ";"
			}
		}
		if (settings.textBackgroundColor.length > 0) {
			bodyStyle += "background-color: " + settings.textBackgroundColor + ";"
		}
		else {
			bodyStyle += "background-color: " + settings.textDefaultBackgroundColor + ";"
		}
		bodyStyle = " style=\"" + bodyStyle + "\""

		if (settings.iconClass.length > 0) {
			content += "<div id=\"jquery-toast-header-icon-" + random + "\" class=\"jquery-toast-header-icon\"><i class=\"" + settings.iconClass + "\"></i></div>"
		}
		else if (settings.hasBootstrapIcons && iconClasses.bi[type]) {
			content += "<div id=\"jquery-toast-header-icon-" + random + "\" class=\"jquery-toast-header-icon\"><i class=\"" + iconClasses.bi[type] + "\"></i></div>"
		}
		else if (settings.hasFontAwesome && iconClasses.fa[type]) {
			content += "<div id=\"jquery-toast-header-icon-" + random + "\" class=\"jquery-toast-header-icon\"><i class=\"" + iconClasses.fa[type] + "\"></i></div>"
		}

		if (settings.closeIcon) {
			content += "<span id=\"jquery-toast-close-icon-" + random + "\" class=\"jquery-toast-close-icon\">&#xD7;</span>"
		}

		content +="<div id=\"jquery-toast-header-title-" + random + "\" class=\"jquery-toast-header-title\">" + settings.title + "</div>"
		content += "</div>"

		content += "<div id=\"jquery-toast-body-" + random + "\" class=\"jquery-toast-body\"" + bodyStyle + ">"
		if (settings.text instanceof Array) {
			content += "<ul id=\"jquery-toast-body-list-" + random + "\" class=\"jquery-toast-body-list\">"
			for (let i = 0; i < settings.text.length; i++) {
				content += "<li id=\"jquery-toast-body-list-item-" + random + "-" + i + "\" class=\"jquery-toast-body-list-item\" data-id=\"" + i + "\">" + settings.text[i] + "</li>"
			}
			content += "</ul>"
		}
		else {
			content += settings.text;
		}
		content += "</div>"

		toastElement.html(content).hide()

		container.find('.jquery-toast:hidden').remove()

		container.append(toastElement)

		if (settings.maxStackMembers && !isNaN(parseInt(settings.maxStackMembers))) {
			let toasts = container.find('.jquery-toast').length - settings.maxStackMembers;
			if (toasts > 0) {
				container.find('.jquery-toast').slice(0, toasts).remove()
			}
		}

		if ((typeof settings.position == 'string') && ($.inArray(settings.position, positions) !== -1)) {
			switch (settings.position) {
				case "bottom-centre":
				case "bottom-center":
					container.css({
						left: $(window).outerWidth() > 576 ? $(window).outerWidth()/2 - container.outerWidth()/2 : "auto",
						bottom: $(window).outerWidth() > 576 ? 12 : 2
					})
					break;
				case "bottom-left":
					container.css({
						left: $(window).outerWidth() > 576 ? 12 : 2,
						bottom: $(window).outerWidth() > 576 ? 12 : 2
					})
					break;
				case "top-left":
					container.css({
						left: $(window).outerWidth() > 576 ? 12 : 2,
						top: $(window).outerWidth() > 576 ? 12 : 2
					})
					break;
				case "top-centre":
				case "top-center":
					container.css({
						left: $(window).outerWidth() > 576 ? $(window).outerWidth()/2 - container.outerWidth()/2 : "auto",
						top: $(window).outerWidth() > 576 ? 12 : 2
					})
					break;
				case "top-right":
					container.css({
						right: $(window).outerWidth() > 576 ? 20 : 12,
						top: $(window).outerWidth() > 576 ? 12 : 2
					})
					break;
				case "mid-centre":
				case "mid-center":
					container.css({
						left: $(window).outerWidth()/2 - container.outerWidth()/2,
						top: $(window).outerHeight()/2 - container.outerHeight()/2
					})
					break;
				default:
					container.css({
						right: $(window).outerWidth() > 576 ? 20 : 12,
						bottom: $(window).outerWidth() > 576 ? 12 : 2
					})
					break;
			}
		}
		else if (typeof settings.position == 'object') {
			container.css({
				top: settings.position.top && settings.position.top != "auto" && !isNaN(parseInt(settings.position.top)) ? settings.position.top : "auto",
				bottom: settings.position.bottom && settings.position.bottom != "auto" && !isNaN(parseInt(settings.position.bottom)) ? settings.position.bottom : "auto",
				left: settings.position.left && settings.position.left != "auto" && !isNaN(parseInt(settings.position.left)) ? settings.position.left : "auto",
				right: settings.position.right && settings.position.right != "auto" && !isNaN(parseInt(settings.position.right)) ? settings.position.right : "auto"
			})
		}
		else {
			container.css({
				right: $(window).outerWidth() > 576 ? 20 : 12,
				bottom: $(window).outerWidth() > 576 ? 12 : 2
			})
		}

		if (typeof settings.beforeShow == 'function') {
			toastElement.on('beforeShow', function() {
				settings.beforeShow(toastElement)
			})
		}

		if (typeof settings.afterShown == 'function') {
			toastElement.on('afterShown', function() {
				settings.afterShown(toastElement)
			})
		}

		if (typeof settings.beforeHide == 'function') {
			toastElement.on('beforeHide', function() {
				settings.beforeHide(toastElement)
			})
		}
		if (typeof settings.afterHidden == 'function') {
			toastElement.on('afterHidden', function() {
				settings.afterHidden(toastElement)
			})
		}

		$("#jquery-toast-close-icon-" + random).on('click', function(e) {
			e.preventDefault()
			close(toastElement)
		})

		toastElement.trigger('beforeShow')

		switch (settings.transitionType.toLowerCase()) {
			case "fade":
				toastElement.fadeIn(500, function() {
					toastElement.trigger('afterShown')
				})
				break
			case "slide":
				toastElement.slideDown(500, function() {
					toastElement.trigger('afterShown')
				})
				break
			default:
				toastElement.show(function() {
					toastElement.trigger('afterShown')
				})
				break
		}

		if (settings.autoClose) {
			window.setTimeout(() => {
				close(toastElement)
			}, settings.autoClose)
		}

	return toastElement

	},

	close = function(toastElement) {
		toastElement.trigger('beforeHide')
		switch (settings.transitionType.toLowerCase()) {
			case "fade":
				toastElement.fadeOut(500, function() {
					toastElement.trigger('afterHidden')
				})
				break
			case "slide":
				toastElement.slideUp(500, function () {
					toastElement.trigger('afterHidden')
				})
				break
			default:
				toastElement.hide(function () {
					toastElement.trigger('afterHidden')
				})
				break
		}
		if (settings.autoRemove) {
			window.setTimeout(() => {
				toastElement.remove()
			}, 505)
		}
	},

	remove = function() {
		toastElement.remove()
	}

	return show()

}

// END OF FILE
