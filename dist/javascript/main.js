$(function() {
    bootstrapModule.init(), mainNav.init(), matchHeight.init();
});

var bootstrapModule = function() {
    function _init() {
        $('[data-toggle="tooltip"]').tooltip();
    }
    return {
        init: _init
    };
}(), mainNav = function() {
    function _init() {
        function checkMQ() {
            return window.getComputedStyle(document.querySelector(".cd-main-content"), "::before").getPropertyValue("content").replace(/'/g, "").replace(/"/g, "");
        }
        function moveNavigation() {
            var mq = checkMQ();
            "mobile" == mq && 0 == topNavigation.parents(".cd-side-nav").length ? (detachElements(), 
            topNavigation.prependTo(sidebar), searchForm.removeClass("is-hidden").prependTo(sidebar)) : ("tablet" == mq || "desktop" == mq) && topNavigation.parents(".cd-side-nav").length > 0 && (detachElements(), 
            searchForm.insertAfter(header.find(".cd-logo")), topNavigation.appendTo(header.find(".cd-nav"))), 
            checkSelected(mq), resizing = !1;
        }
        function detachElements() {
            topNavigation.detach(), searchForm.detach();
        }
        function checkSelected(mq) {
            "desktop" == mq && $(".has-children.selected").removeClass("selected");
        }
        function checkScrollbarPosition() {
            var mq = checkMQ();
            if ("mobile" != mq) {
                var sidebarHeight = sidebar.outerHeight(), windowHeight = $(window).height(), mainContentHeight = mainContent.outerHeight(), scrollTop = $(window).scrollTop();
                scrollTop + windowHeight > sidebarHeight && mainContentHeight - sidebarHeight != 0 ? sidebar.addClass("is-fixed").css("bottom", 0) : sidebar.removeClass("is-fixed").attr("style", "");
            }
            scrolling = !1;
        }
        var mainContent = $(".cd-main-content"), header = $(".cd-main-header"), sidebar = $(".cd-side-nav"), sidebarTrigger = $(".cd-nav-trigger"), topNavigation = $(".cd-top-nav"), searchForm = $(".cd-search"), accountInfo = $(""), resizing = !1;
        moveNavigation(), $(window).on("resize", function() {
            resizing || (window.requestAnimationFrame ? window.requestAnimationFrame(moveNavigation) : setTimeout(moveNavigation, 300), 
            resizing = !0);
        });
        var scrolling = !1;
        checkScrollbarPosition(), $(window).on("scroll", function() {
            scrolling || (window.requestAnimationFrame ? window.requestAnimationFrame(checkScrollbarPosition) : setTimeout(checkScrollbarPosition, 300), 
            scrolling = !0);
        }), sidebarTrigger.on("click", function(event) {
            event.preventDefault(), $([ sidebar, sidebarTrigger ]).toggleClass("nav-is-visible");
        }), $(".has-children > a").on("click", function(event) {
            var mq = checkMQ(), selectedItem = $(this);
            "mobile" != mq && "tablet" != mq || (event.preventDefault(), selectedItem.parent("li").hasClass("selected") ? selectedItem.parent("li").removeClass("selected") : (sidebar.find(".has-children.selected").removeClass("selected"), 
            accountInfo.removeClass("selected"), selectedItem.parent("li").addClass("selected")));
        }), accountInfo.children("a").on("click", function(event) {
            var mq = checkMQ();
            $(this);
            "desktop" == mq && (event.preventDefault(), accountInfo.toggleClass("selected"), 
            sidebar.find(".has-children.selected").removeClass("selected"));
        }), $(document).on("click", function(event) {
            $(event.target).is(".has-children a") || (sidebar.find(".has-children.selected").removeClass("selected"), 
            accountInfo.removeClass("selected"));
        }), sidebar.children("ul").menuAim({
            activate: function(row) {
                $(row).addClass("hover");
            },
            deactivate: function(row) {
                $(row).removeClass("hover");
            },
            exitMenu: function() {
                return sidebar.find(".hover").removeClass("hover"), !0;
            },
            submenuSelector: ".has-children"
        });
    }
    return {
        init: _init
    };
}(), matchHeight = function() {
    function _init() {
        $('.section-states .row > div[class^="col-"] > .box-content').matchHeight({
            byRow: !0,
            property: "height",
            target: null,
            remove: !1
        });
    }
    return {
        init: _init
    };
}();

$(function() {
    $("#traking-map_id").length > 0 && trakingMap.init();
});

var trakingMap = function() {
    function _init() {
        function normish(mean, range) {
            var num_out = (Math.random() + Math.random() + Math.random() + Math.random() - 2) / 2 * range + mean;
            return num_out;
        }
        function make_dots() {
            dots = {
                type: "FeatureCollection",
                features: []
            };
            for (var i = 0; i < dotcount; ++i) {
                x = normish(0, 1), y = normish(0, 1);
                var g = {
                    type: "Point",
                    coordinates: [ .1 * x + centerlon, .1 * y + centerlat ]
                }, p = {
                    id: i,
                    popup: "blue_dot_" + i,
                    year: parseInt(100 * Math.sqrt(x * x + y * y) * (1 - Math.random() / 2) + 1900)
                };
                dots.features.push({
                    geometry: g,
                    type: "Feature",
                    properties: p
                });
            }
        }
        function make_gdots() {
            gdots = {
                type: "FeatureCollection",
                features: []
            };
            for (var i = 0; i < gdotcount; ++i) {
                x = normish(0, 1, 1), y = normish(0, 1, 1);
                var g = {
                    type: "Point",
                    coordinates: [ .05 * x + centerlon + .05, .05 * y + centerlat ]
                }, p = {
                    id: i,
                    popup: "green_dot_" + i,
                    year: parseInt(100 * Math.sqrt(x * x + y * y) * (1 - Math.random() / 2) + 1900)
                };
                gdots.features.push({
                    geometry: g,
                    type: "Feature",
                    properties: p
                });
            }
        }
        function highlightDot(e) {
            var layer = e.target;
            layer.setStyle(dotStyleHighlight), L.Browser.ie || L.Browser.opera || layer.bringToFront();
        }
        function resetDotHighlight(e) {
            var layer = e.target;
            layer.setStyle(dotStyleDefault);
        }
        function onEachDot(feature, layer) {
            layer.on({
                mouseover: highlightDot,
                mouseout: resetDotHighlight
            }), layer.bindPopup('<table style="width:150px"><tbody><tr><td><div><b>name:</b></div></td><td><div>' + feature.properties.popup + "</div></td></tr><tr class><td><div><b>year:</b></div></td><td><div>" + feature.properties.year + "</div></td></tr></tbody></table>");
        }
        function highlightGdot(e) {
            var layer = e.target;
            layer.setStyle(gdotStyleHighlight), L.Browser.ie || L.Browser.opera || layer.bringToFront();
        }
        function resetGdotHighlight(e) {
            var layer = e.target;
            layer.setStyle(gdotStyleDefault);
        }
        function onEachGdot(feature, layer) {
            layer.on({
                mouseover: highlightGdot,
                mouseout: resetGdotHighlight
            }), layer.bindPopup('<table style="width:150px"><tbody><tr><td><div><b>name:</b></div></td><td><div>' + feature.properties.popup + "</div></td></tr><tr class><td><div><b>year:</b></div></td><td><div>" + feature.properties.year + "</div></td></tr></tbody></table>");
        }
        var centerlat = 24.64015, centerlon = 46.70357, zoomLevel = 14, map = L.map("traking-map_id").setView([ centerlat, centerlon ], zoomLevel);
        ATTR = '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a> | &copy; <a href="http://cartodb.com/attributions">CartoDB</a>', 
        CDB_URL = "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", L.tileLayer(CDB_URL, {
            attribution: ATTR
        }).addTo(map), L.control.zoom({
            position: "topright"
        }).addTo(map);
        var dotlayer, dots, gdotlayer, gdots, dotcount = 200, gdotcount = 75;
        make_dots(), make_gdots();
        var dotStyleDefault = {
            radius: 5,
            fillColor: "#703081",
            color: "#000",
            weight: 0,
            opacity: 1,
            fillOpacity: .9
        }, dotStyleHighlight = {
            radius: 6,
            fillColor: "#703081",
            color: "#FFF",
            weight: 1,
            opacity: 1,
            fillOpacity: .9
        }, gdotStyleDefault = {
            radius: 5,
            fillColor: "#da3e7b",
            color: "#FFF",
            weight: 0,
            opacity: 1,
            fillOpacity: .9
        }, gdotStyleHighlight = {
            radius: 6,
            fillColor: "#da3e7b",
            color: "#FFF",
            weight: 1,
            opacity: 1,
            fillOpacity: .9
        };
        dotlayer = L.geoJson(dots, {
            pointToLayer: function(feature, latlng) {
                return L.circleMarker(latlng, dotStyleDefault);
            },
            onEachFeature: onEachDot
        }).addTo(map), gdotlayer = L.geoJson(gdots, {
            pointToLayer: function(feature, latlng) {
                return L.circleMarker(latlng, gdotStyleDefault);
            },
            onEachFeature: onEachGdot
        }).addTo(map);
        $(".btn-map-screen").on("click", function(e) {
            e.preventDefault();
            var map = $("#traking-map_id"), container = $(".content-wrapper--inner");
            $(map).hasClass("fullscreen") ? ($(map).toggleClass("fullscreen").appendTo(".section-traking-map .box-content--body"), 
            $(container).toggleClass("hidden"), $(this).find("i").removeClass("icon-size-actual").addClass("icon-size-fullscreen")) : ($(map).toggleClass("fullscreen").prependTo(".content-wrapper"), 
            $(container).toggleClass("hidden"), $(this).find("i").removeClass("icon-size-fullscreen").addClass("icon-size-actual"));
        }), $("#btn-locate").on("click", function(e) {
            e.preventDefault(), $(".map-summary").toggleClass("open");
        }), $("#btn-map-summary-close").on("click", function(e) {
            e.preventDefault(), $(".map-summary").toggleClass("open");
        });
    }
    return {
        init: _init
    };
}();