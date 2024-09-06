// ==UserScript==
// @name         enable physical remote controller to control Heimao TV
// @namespace    http://your-namespace.com/
// @updateURL    https://raw.githubusercontent.com/daiqing2009/remote-controller/main/heimaotv.user.js
// @version      0.3.2
// @description  Custom key navigation for Heimao TV
// @match        https://heimaotv.vip/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==

(function() {
    'use strict';
    const isListPage = window.location.href.includes('/vodshow-');
    const isDetailPage = window.location.href.includes('/voddetail-');
    const isPlayerPage = window.location.href.includes('/vodplay-');

    if (isDetailPage) {
        $(document).on('keydown', function(e) {
            switch(e.which) {
                case 13: // Enter key
                    window.location.href = $('.dx .anthology-list-play li:first a').attr('href');
                    break;
            }
            e.preventDefault();
        });
    }else if (isPlayerPage) {
        let index = 0;
        let columns = 0;
        function init() {
            $('<style>')
            .prop('type', 'text/css')
            .html(`
                .episode-focus {
                    outline: 2px solid #ff0000 !important;
                    box-shadow: 0 0 10px #ff0000 !important;
                }
            `)
            .appendTo('head');
            columns = calculateColumns();
            console.log(`Window inited, columns: ${columns}`);
        }

        function updateFocus(index) {
            $('.dx .anthology-list-play li').removeClass('episode-focus');
            $('.dx .anthology-list-play li').eq(index).addClass('episode-focus');
        }

        $(document).on('keydown', function(event) {
            event.preventDefault();
            console.log(`key${event.key} down`);
            let len = $('.anthology-list-play li').length;
            console.log(`current index= ${index} of length=${len}`);
            switch (event.key) {
                case 'ArrowDown':
                    index = Math.min(index + columns, len -1);
                    updateFocus(index);
                    break;
                case 'ArrowUp':
                    index = Math.max(index - columns, 0);
                    updateFocus(index);
                    break;
                case 'ArrowRight':
                    index = Math.min(index + 1, len -1);
                    updateFocus(index);
                    break;
                case 'ArrowLeft':
                    index = Math.max(index - 1, 0);
                    updateFocus(index);
                    break;
                case 'Enter':
                    window.location.href = $('.dx .anthology-list-play li.episode-focus a').attr('href');
                    break;
                case 'Play':
                    $('.art-control-playAndPause .art-icon-play').click()
                    break;
                case 'Pause':
                    $('.art-control-playAndPause .art-icon-pause').click()
                    break;
            }
        });

        function calculateColumns() {
            const maxWidth = 1024;
            const windowWidth = Math.min($('ul.anthology-list-play').innerWidth(), maxWidth);
            const divWidth =$('li.box.border').outerWidth();
            return Math.floor(windowWidth / divWidth);
        }

        $(window).on('resize', () => {
            columns = calculateColumns();
            console.log(`Window resized. Recalculated columns: ${columns}`);
        });

        $(document).ready(init);
    }else {
        let index = 0;
        let columns = 4;

        function init() {
            $('<style>')
                .prop('type', 'text/css')
                .html(`
                .box-focus {
                    outline: 2px solid #ff0000 !important;
                    box-shadow: 0 0 10px #ff0000 !important;
                }
            `)
                .appendTo('head');
            columns = calculateColumns();
        }

        function focusDiv(index){
            $('.public-list-div').removeClass('box-focus');
            $('.public-list-div').eq(index).addClass('box-focus')
        }

        $(document).on('keydown', (event) => {
            event.preventDefault();
            let len = $('.public-list-div').length
            console.log(event.key)
            switch (event.key) {
                case 'ArrowDown':
                    index = Math.min(index + columns, len -1);
                    focusDiv(index);
                    break;
                case 'ArrowUp':
                    index = Math.max(index - columns, 0);
                    focusDiv(index);
                    break;
                case 'ArrowRight':
                    index = Math.min(index + 1, len -1);
                    focusDiv(index);
                    break;
                case 'ArrowLeft':
                    index = Math.max(index - 1, 0);
                    focusDiv(index);
                    break;
                case 'Enter':
                    window.location.href = $('.public-list-div.box-focus a').attr('href');
                    break;
            }
        });

        function calculateColumns() {
            const maxWidth = 2048;
            const windowWidth = Math.min($(window).width(), maxWidth);
            const divWidth =$('.public-list-box:first').outerWidth();
            return Math.floor(windowWidth / divWidth);
        }

        $(window).on('resize', () => {
            columns = calculateColumns();
            console.log(`Window resized. Recalculated columns: ${columns}`);
        });

        $(document).ready(init);
    }

})();