// ==UserScript==
// @name         enable physical remote controller to control Heimao TV
// @namespace    http://your-namespace.com/
// @version      0.21
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
        let currentTab = 'anthology-tab';
        let currentSlideIndex = 0;
        let currentAnthologyIndex = 0;

        function updateFocus() {
            $('.episode-focus').removeClass('episode-focus');
            if (currentTab === 'anthology-tab') {
                $('.vod-playerUrl.swiper-slide').eq(currentSlideIndex).addClass('episode-focus');
            } else {
                $('.anthology-list-play li').eq(currentAnthologyIndex).addClass('episode-focus');
            }
        }

        $(document).on('keydown', function(e) {
            console.log(e.which)
            switch(e.which) {
                case 38: // Up arrow
                case 40: // Down arrow
                    currentTab = (currentTab === 'anthology-tab') ? 'anthology-list' : 'anthology-tab';
                    break;
                case 37: // Left arrow
                    if (currentTab === 'anthology-tab') {
                        currentSlideIndex = (currentSlideIndex - 1 + $('.vod-playerUrl .swiper-slide').length) % $('.vod-playerUrl .swiper-slide').length;
                    } else {
                        currentAnthologyIndex = (currentAnthologyIndex - 1 + $('.anthology-list-play li').length) % $('.anthology-list-play li').length;
                    }
                    break;
                case 39: // Right arrow
                    if (currentTab === 'anthology-tab') {
                        currentSlideIndex = (currentSlideIndex + 1) % $('.vod-playerUrl .swiper-slide').length;
                    } else {
                        currentAnthologyIndex = (currentAnthologyIndex + 1) % $('.anthology-list-play li').length;
                    }
                    break;
                case 13: // Enter key
                    if (currentTab === 'anthology-tab') {
                        $('.vod-playerUrl .swiper-slide').eq(currentSlideIndex).click();
                    } else {
                        window.location.href = $('.anthology-list-play li.episode-focus a').attr('href');
                    }
                    break;
                case 179: // Play or Pause
                    $('.art-control-playAndPause .art-icon-play').click()
                    //$('.art-control-playAndPause .art-icon-pause').click()
                    break;
                default:
                    return;
            }
            e.preventDefault();
            updateFocus();
        });

        $('<style>')
            .prop('type', 'text/css')
            .html(`
                .episode-focus {
                    outline: 2px solid #ff0000 !important;
                    box-shadow: 0 0 10px #ff0000 !important;
                }
            `)
            .appendTo('head');

        updateFocus();
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