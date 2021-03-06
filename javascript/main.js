/** ==========================================
 * JS DOCUMENT
 * DESCRIPTION: MAIN JS FILE
 * PROJECT NAME: STC
 * DATE: 14/09/2016
 * AUTHOR: Issam-MZOUGHI
 ============================================ */

/* ========================================== *\
 *  INIT
 \* ========================================== */
$(function () {
    bootstrapModule.init();
    mainNav.init();
    matchHeight.init();
});
/* ========================================== *\
 *  MODULES
 \* ========================================== */

/* =bootstrapModule */
var bootstrapModule = function () {
    function _init() {

        $('[data-toggle="tooltip"]').tooltip();

    }

    return {
        init: _init
    };
}();

/* =mainNav */
var mainNav = function () {
    function _init() {
        //cache DOM elements
        var mainContent = $('.cd-main-content'),
            header = $('.cd-main-header'),
            sidebar = $('.cd-side-nav'),
            sidebarTrigger = $('.cd-nav-trigger'),
            topNavigation = $('.cd-top-nav'),
            searchForm = $('.cd-search'),
            accountInfo = $('');

        //on resize, move search and top nav position according to window width
        var resizing = false;

        moveNavigation();
        $(window).on('resize', function () {
            if (!resizing) {
                if (!window.requestAnimationFrame) {
                    setTimeout(moveNavigation, 300);
                } else {
                    window.requestAnimationFrame(moveNavigation);
                }
                resizing = true;
            }
        });

        //on window scrolling - fix sidebar nav
        var scrolling = false;
        checkScrollbarPosition();
        $(window).on('scroll', function () {
            if (!scrolling) {
                if (!window.requestAnimationFrame) {
                    setTimeout(checkScrollbarPosition, 300);
                } else {
                    window.requestAnimationFrame(checkScrollbarPosition);
                }
                scrolling = true;
            }
        });

        //mobile only - open sidebar when user clicks the hamburger menu
        sidebarTrigger.on('click', function (event) {
            event.preventDefault();
            $([sidebar, sidebarTrigger]).toggleClass('nav-is-visible');
        });

        //click on item and show submenu
        $('.has-children > a').on('click', function (event) {
            var mq = checkMQ(),
                selectedItem = $(this);
            if (mq == 'mobile' || mq == 'tablet') {
                event.preventDefault();
                if (selectedItem.parent('li').hasClass('selected')) {
                    selectedItem.parent('li').removeClass('selected');
                } else {
                    sidebar.find('.has-children.selected').removeClass('selected');
                    accountInfo.removeClass('selected');
                    selectedItem.parent('li').addClass('selected');
                }
            }
        });

        //click on account and show submenu - desktop version only
        accountInfo.children('a').on('click', function (event) {
            var mq = checkMQ(),
                selectedItem = $(this);
            if (mq == 'desktop') {
                event.preventDefault();
                accountInfo.toggleClass('selected');
                sidebar.find('.has-children.selected').removeClass('selected');
            }
        });

        $(document).on('click', function (event) {
            if (!$(event.target).is('.has-children a')) {
                sidebar.find('.has-children.selected').removeClass('selected');
                accountInfo.removeClass('selected');
            }
        });

        //on desktop - differentiate between a user trying to hover over a dropdown item vs trying to navigate into a submenu's contents
        sidebar.children('ul').menuAim({
            activate: function (row) {
                $(row).addClass('hover');
            },
            deactivate: function (row) {
                $(row).removeClass('hover');
            },
            exitMenu: function () {
                sidebar.find('.hover').removeClass('hover');
                return true;
            },
            submenuSelector: ".has-children",
        });

        function checkMQ() {
            //check if mobile or desktop device
            return window.getComputedStyle(document.querySelector('.cd-main-content'), '::before').getPropertyValue('content').replace(/'/g, "").replace(/"/g, "");
        }

        function moveNavigation() {
            var mq = checkMQ();

            if (mq == 'mobile' && topNavigation.parents('.cd-side-nav').length == 0) {
                detachElements();
                topNavigation.prependTo(sidebar);
                searchForm.removeClass('is-hidden').prependTo(sidebar);

            } else if (( mq == 'tablet' || mq == 'desktop') && topNavigation.parents('.cd-side-nav').length > 0) {
                detachElements();
                searchForm.insertAfter(header.find('.cd-logo'));
                topNavigation.appendTo(header.find('.cd-nav'));
            }
            checkSelected(mq);
            resizing = false;
        }

        function detachElements() {
            topNavigation.detach();
            searchForm.detach();
        }

        function checkSelected(mq) {
            //on desktop, remove selected class from items selected on mobile/tablet version
            if (mq == 'desktop') $('.has-children.selected').removeClass('selected');
        }

        function checkScrollbarPosition() {
            var mq = checkMQ();

            if (mq != 'mobile') {
                var sidebarHeight = sidebar.outerHeight(),
                    windowHeight = $(window).height(),
                    mainContentHeight = mainContent.outerHeight(),
                    scrollTop = $(window).scrollTop();

                if (( scrollTop + windowHeight > sidebarHeight ) && ( mainContentHeight - sidebarHeight != 0 )) {
                    sidebar.addClass('is-fixed').css('bottom', 0);
                } else {
                    sidebar.removeClass('is-fixed').attr('style', '');
                }
            }
            scrolling = false;
        }


    }

    return {
        init: _init
    };
}();

/* =matchHeight */
var matchHeight = function () {
    function _init() {

        $('.section-states .row > div[class^="col-"] > .box-content').matchHeight({
            byRow: true,
            property: 'height',
            target: null,
            remove: false
        });

    }

    return {
        init: _init
    };
}();

