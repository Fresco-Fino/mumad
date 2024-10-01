function customCursor() {

	const cursor        = jQuery(".cursor"),
		body          = jQuery("body"),
		slider        = jQuery(".slider"),
		nav           = jQuery(".nav"),
		fail          = jQuery(".fail"),
		invert        = jQuery(".invert"),
		nav_open_menu = jQuery(".navopen"),
		wwidth        = jQuery(window).width(),
		wheight       = jQuery(window).height();

	function cursorMove() {
		var e, n;
		return (
			body.addClass("cursor-on"),
			cursor.css({
			transform: "matrix(1, 0, 0, 1, " + wwidth / 2 + ", " + wheight / 2 + ")"
			}),
			(e = wheight / 2),
			(n = 0.65 * wwidth / 2),
			n > e ? e : n,
			jQuery(window).on("mousemove", function(e) {
			var n, t;
			if (
				((window.x = e.clientX),
				(window.y = e.clientY),
				cursor.css({ transform: "matrix(1, 0, 0, 1, " + x + ", " + y + ")" }),
				!nav.hasClass("overlay-visible"))
			)
				return (
				(n = Math.floor((x - 60) / 5)),
				(t = Math.floor((y - 60) / 5)),
				n < 20 && t < 20
					? nav_open_menu.addClass("magnetize").css({
						transform: "scale(1.3) translate3d(" + n + "px, " + t + "px, 0)"
					})
					: nav_open_menu.removeClass("magnetize").attr("style", "")
				);
			})
		);
	};

	function cursorBind() {

		var e, n, t;
		if (
			((n = cursor.find("span")).removeClass("link external new"),
			(e = jQuery(".focus")),
			(t = jQuery(".slack")),

			// active cursor
			jQuery(window).on({
				mouseenter: function() {
					return n.removeClass("off");
				},
				mouseleave: function() {
					return n.addClass("off");
				}
			}),

			// links , buttons and inputs
			jQuery("a:not(.link--readmore, .link--viewall, .link--without), button, input, input[type=submit], label").on({
				mouseenter: function() {
				var e;
				return (
					(e = jQuery(this).hasClass("external") ? "link external" : "link"),
					n.addClass(e)
				);
				},
				mouseleave: function() {
				return n.removeClass("link external");
				}
			}),

			jQuery(".link--readmore").on({
				mouseenter: function() {
					var e;
					return (n.addClass('cursor--readmore'));
				},
				mouseleave: function() {
					return n.removeClass("cursor--readmore");
				}
			}),

			jQuery(".link--viewall").on({
				mouseenter: function() {
					var e;
					return (n.addClass('cursor--viewall'));
				},
				mouseleave: function() {
					return n.removeClass("cursor--viewall");
				}
			}),

			jQuery(".link--play").on({
				mouseenter: function() {
					console.log('play enter');
					var e;
					return (n.addClass('cursor--play'));
				},
				mouseleave: function() {
					return n.removeClass("cursor--play");
				}
			}),

			jQuery(".link--pause").on({
				mouseenter: function() {
					var e;
					return (n.addClass('cursor--pause'));
				},
				mouseleave: function() {
					return n.removeClass("cursor--pause");
				}
			}),

			jQuery(".link--drag").on({
				mouseenter: function() {
					var e;
					return (n.addClass('cursor--drag'));
				},
				mouseleave: function() {
					return n.removeClass("cursor--drag");
				}
			}),

			jQuery(".single__intro").on({
				mouseenter: function() {
					var e;
					return (n.removeClass('cursor--play'));
				}
			}),
			

			// // titles
			// jQuery("h1").on({
			// 	mouseenter: function() {
			// 	var e;
			// 	return (
			// 		(e = jQuery(this).hasClass("external") ? "invert external" : "invert"),
			// 		n.addClass(e)
			// 	);
			// 	},
			// 	mouseleave: function() {
			// 	return n.removeClass("invert external");
			// 	}
			// }),

			// drag
			// jQuery(".swiperCarouselWines").on({
			// 	mouseenter: function() {
			// 	var e;
			// 	return (
			// 		(e = jQuery(this).hasClass("external") ? "drag external" : "drag"),
			// 		n.addClass(e)
			// 	);
			// 	},
			// 	mouseleave: function() {
			// 	return n.removeClass("drag external");
			// 	}
			// }),

			e.length &&
			e.find("a").on({
				mouseenter: function() {
				return n.addClass("new");
				},
				mouseleave: function() {
				return n.removeClass("new");
				}
			}),
			slider.length &&
			slider.on({
				mouseenter: function() {
				var e;
				return (
					(e = jQuery(this).hasClass("full") ? "click" : "drag"), n.addClass(e)
				);
				},
				mouseleave: function() {
				return n.removeClass("drag click");
				}
			}),
			t.length &&
			t.on({
				mouseenter: function() {
				return n.addClass("light");
				},
				mouseleave: function() {
				return n.removeClass("light");
				}
			}),
			fail.length)
		)

		return fail.on({
		mouseover: function() {
			return n.addClass("relol");
		},
		mouseleave: function() {
			return n.removeClass("relol");
		}
		});
	};

	// https://stackoverflow.com/a/4819886
	function isTouchDevice() {
		return (('ontouchstart' in window) ||
				(navigator.maxTouchPoints > 0) ||
				(navigator.msMaxTouchPoints > 0));
	}

	const isTouch = isTouchDevice();

	if (!isTouch){
		cursorMove();
		cursorBind();
	}

}

export default customCursor;