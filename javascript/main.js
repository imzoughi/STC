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
    picturefill();
    bootstrapModule.init();
    mainNav.init();
    matchHeight.init();
    trakingMap.init();
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

        $('.section-states div[class^="col-"] .box-content').matchHeight({
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

/* =trakingMap */
var trakingMap = function () {
    function _init() {

        //////////////////////////////////////////////////////////////////////////////////////////////
        //Here, a jQRangeSlider is used to filter GeoJSON data dynamically based on a numerical
        //property (year). The GeoJSON data are created with a quasi-normal spatial distribution,
        //filtered, then displayed as circle markers on a Leaflet map.
        //////////////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////////////
        //setting up the map//
        //////////////////////////////////////////////////////////////////////////////////////////////

        // set center coordinates
        var centerlat = 24.64015;
        var centerlon = 46.70357;

        // set default zoom level
        var zoomLevel = 14;

        // initialize map
        var map = L.map('traking-map_id').setView([centerlat,centerlon], zoomLevel);

        // set source for map tiles
        ATTR = '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a> | ' +
            '&copy; <a href="http://cartodb.com/attributions">CartoDB</a>';

        CDB_URL = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';

        // add tiles to map
        L.tileLayer(CDB_URL, {attribution: ATTR}).addTo(map);

        //add zoom control with your options
        L.control.zoom({
            position: 'topright'
        }).addTo(map);

        //////////////////////////////////////////////////////////////////////////////////////////////
        //creating the data//
        //////////////////////////////////////////////////////////////////////////////////////////////

        //initialize
        var dotlayer;
        var dots;
        var dotcount = 200;

        var gdotlayer;
        var gdots;
        var gdotcount = 75;

        //cheapo normrand function
        function normish(mean, range) {
            var num_out = ((Math.random() + Math.random() + Math.random() + Math.random() - 2) / 2) * range + mean;
            return num_out;
        }

        //create geojson data with random ~normal distribution
        function make_dots() {

            dots = {
                type: "FeatureCollection",
                features: []
            };

            for(var i=0;i<dotcount;++i) {

                //set up random variables
                x = normish(0, 1);
                y = normish(0, 1);

                //create points randomly distributed about center coordinates
                var g = {
                    "type": "Point",
                    "coordinates": [ ((x*0.1) + centerlon), ((y*0.1) + centerlat)]
                };

                //create feature properties, with year roughly proportional to distance from center coordinates
                var p = {
                    "id" : i,
                    "popup": "blue_dot_" + i,
                    "year": parseInt( (Math.sqrt(x*x + y*y))*100*(1 - Math.random()/2) + 1900 )
                };

                //create features with proper geojson structure
                dots.features.push({
                    "geometry" : g,
                    "type": "Feature",
                    "properties": p
                });
            }
        }

        //create a second set of geojson data slightly displaced from the first
        function make_gdots() {

            gdots = {
                type: "FeatureCollection",
                features: []
            };

            for(var i=0;i<gdotcount;++i) {

                x = normish(0, 1, 1);
                y = normish(0, 1, 1);

                //more tightly-clustered points, displaced slightly to the east
                var g = {
                    "type": "Point",
                    "coordinates": [ ((x*0.05) + centerlon + 0.05), ((y*0.05) + centerlat)]
                };

                var p = {
                    "id" : i,
                    "popup": "green_dot_" + i,
                    "year": parseInt( (Math.sqrt(x*x + y*y))*100*(1 - Math.random()/2) + 1900 )
                };

                gdots.features.push({
                    "geometry" : g,
                    "type": "Feature",
                    "properties": p
                });
            }
        }

        make_dots();
        make_gdots();

        //////////////////////////////////////////////////////////////////////////////////////////////
        //setting up the aesthetic stuff//
        //////////////////////////////////////////////////////////////////////////////////////////////

        //define styles for circle markers
        var dotStyleDefault = {
            radius: 5,
            fillColor: "#703081",
            color: "#000",
            weight: 0,
            opacity: 1,
            fillOpacity: 0.9
        };

        var dotStyleHighlight = {
            radius: 6,
            fillColor: "#703081",
            color: "#FFF",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.9
        };

        var gdotStyleDefault = {
            radius: 5,
            fillColor: "#da3e7b",
            color: "#FFF",
            weight: 0,
            opacity: 1,
            fillOpacity: 0.9
        };

        var gdotStyleHighlight = {
            radius: 6,
            fillColor: "#da3e7b",
            color: "#FFF",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.9
        };

        //functions to attach styles and popups to the marker layer
        function highlightDot(e) {
            var layer = e.target;

            layer.setStyle(dotStyleHighlight);

            if (!L.Browser.ie && !L.Browser.opera) {
                layer.bringToFront();
            }
        }

        function resetDotHighlight(e) {
            var layer = e.target;
            layer.setStyle(dotStyleDefault);
        }

        function onEachDot(feature, layer) {
            layer.on({
                mouseover: highlightDot,
                mouseout: resetDotHighlight
            });
            layer.bindPopup('<table style="width:150px"><tbody><tr><td><div><b>name:</b></div></td><td><div>'+feature.properties.popup+'</div></td></tr><tr class><td><div><b>year:</b></div></td><td><div>'+feature.properties.year+'</div></td></tr></tbody></table>');
        }

        function highlightGdot(e) {
            var layer = e.target;

            layer.setStyle(gdotStyleHighlight);

            if (!L.Browser.ie && !L.Browser.opera) {
                layer.bringToFront();
            }
        }

        function resetGdotHighlight(e) {
            var layer = e.target;
            layer.setStyle(gdotStyleDefault);
        }

        function onEachGdot(feature, layer) {
            layer.on({
                mouseover: highlightGdot,
                mouseout: resetGdotHighlight
            });
            layer.bindPopup('<table style="width:150px"><tbody><tr><td><div><b>name:</b></div></td><td><div>'+feature.properties.popup+'</div></td></tr><tr class><td><div><b>year:</b></div></td><td><div>'+feature.properties.year+'</div></td></tr></tbody></table>');
        }

        //////////////////////////////////////////////////////////////////////////////////////////////
        //displaying the data on the map//
        //////////////////////////////////////////////////////////////////////////////////////////////

        //create marker layer and display it on the map
        dotlayer = L.geoJson(dots, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, dotStyleDefault);
            },
            onEachFeature: onEachDot
        }).addTo(map);

        gdotlayer = L.geoJson(gdots, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, gdotStyleDefault);
            },
            onEachFeature: onEachGdot
        }).addTo(map);

        //add layer controls/legend
        var overlayMaps = {
            '<i class="icon-location-pin"></i> Locate': dotlayer,
            '<i class="icon-plane"></i> Trips': gdotlayer
        };

        layerbox = L.control.layers(null, overlayMaps, {collapsed: false, position: 'topleft'}).addTo(map);

        //////////////////////////////////////////////////////////////////////////////////////////////
        //filtering the data//
        //////////////////////////////////////////////////////////////////////////////////////////////

        // //create slider to filter by date
        // $("#dotSlider").rangeSlider({
        //     bounds:{
        //         min: 1900,
        //         max: 2000
        //     },
        //     defaultValues:{
        //         min: 1900,
        //         max: 2000
        //     },
        //     step: 1,
        //     arrows:false,
        //
        // });
        //
        // //filter markers each time the slider is changed
        // $("#dotSlider").bind("valuesChanging", function(e, data){
        //
        //     //remove existing layer and control
        //     if (map.hasLayer(dotlayer)) {
        //         map.removeLayer(dotlayer);
        //         map.removeControl(layerbox);
        //     }
        //     else {
        //         map.removeLayer(newdotlayer);
        //         map.removeControl(newlayerbox);
        //     }
        //
        //     //filter the data
        //     newdotlayer = dotFilter(data.values.min, data.values.max);
        //
        //     //add the filtered data and new control to the map
        //     newdotlayer.addTo(map);
        //
        //     var newoverlayMaps = {
        //         '<div class="dotLegend dotColor"></div> The Blue Dots': newdotlayer,
        //         '<div class="dotLegend gdotColor"></div> The Green Dots': gdotlayer
        //     };
        //
        //     newlayerbox = L.control.layers(null, newoverlayMaps, {collapsed: false}).addTo(map);
        // });

        //function returning a layer with all features between minYear and maxYear
        function dotFilter(minYear, maxYear) {
            filteredDots = L.geoJson([dots], {
                onEachFeature: onEachDot,
                filter: function(feature, layer) {
                    return feature.properties.year >= minYear && feature.properties.year <= maxYear;
                },
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, dotStyleDefault);
                }
            });
            return filteredDots;
        }

        //////////////////////////////////////////////////////////////////////////////////////////////
        //One problem here is that filtering the data moves the filtered layer down to the bottom of
        //the layer control box, which can be annoying. Another problem is that this is a pretty slow
        //way to filter things. Replacing "valuesChanging" with "valuesChanged" in the slider filter
        //binding can alleviate this, but then it's much less fun to play around with the slider.
        //////////////////////////////////////////////////////////////////////////////////////////////


    }

    return {
        init: _init
    };
}();

