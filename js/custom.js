/**
 * Custom JavaScript for Transport Department Portal
 * Government of Jharkhand
 */

/* Do not globally swallow errors. Handle failures at the component or request
 * boundary, and keep server-side error responses generic in the web-server config. */

(function($) {
    'use strict';

    $(document).ready(function() {
        // Dropdown hover on desktop (using Bootstrap 5 API)
        if ($(window).width() >= 992) {
            $(document).on('mouseenter', '.morth-nav-row .nav-item.dropdown', function() {
                var toggle = $(this).find('.dropdown-toggle')[0];
                if (toggle) {
                    var dd = bootstrap.Dropdown.getOrCreateInstance(toggle);
                    dd.show();
                }
            }).on('mouseleave', '.morth-nav-row .nav-item.dropdown', function() {
                var toggle = $(this).find('.dropdown-toggle')[0];
                if (toggle) {
                    var dd = bootstrap.Dropdown.getOrCreateInstance(toggle);
                    dd.hide();
                }
            });
        }

        // Smooth scroll ONLY for non-toggle internal anchor links
        $(document).on('click', 'a[href^="#"]:not([data-bs-toggle]):not([role="button"])', function(e) {
            var href = $(this).attr('href');
            if (href && href !== '#' && href.length > 1) {
                var target = $(href);
                if (target.length) {
                    e.preventDefault();
                    $('html, body').stop().animate({
                        scrollTop: target.offset().top - 80
                    }, 400);
                }
            }
        });

        // Universal Accordion Collapse Delegation Fix (Bootstrap 5 compatible)
        $(document).on('click', '[data-bs-toggle="collapse"]:not(.navbar-toggler)', function(e) {
            var targetId = $(this).attr('href') || $(this).attr('data-bs-target');
            if (!targetId || targetId === '#') return;

            var $target = $(targetId);
            if ($target.length) {
                e.preventDefault();
                e.stopPropagation();

                var parentSelector = $(this).attr('data-bs-parent');
                if (parentSelector && $(parentSelector).length) {
                    var $parent = $(parentSelector);
                    // Close other sibling collapse panels inside parent accordion
                    $parent.find('.collapse.show').not($target).each(function() {
                        var bsCollapse = bootstrap.Collapse.getInstance(this);
                        if (bsCollapse) bsCollapse.hide();
                    });
                }

                // Toggle the target collapse
                var bsCollapse = bootstrap.Collapse.getOrCreateInstance($target[0], { toggle: false });
                if ($target.hasClass('show')) {
                    bsCollapse.hide();
                } else {
                    bsCollapse.show();
                }
            }
        });
    });

})(jQuery);

