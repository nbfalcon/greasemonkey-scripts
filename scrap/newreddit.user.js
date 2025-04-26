// ==UserScript==
// @name Reddit/Hackernews/etc. enhancements (doomscrolling, enshittification)
// @match https://www.reddit.com/*
// @run-at document-idle
// ==/UserScript==
function removeElements(selector) {
    if (typeof(selector) == 'string') {
        console.info(`Cleaning querySelector ${selector}`);
        document.querySelectorAll(selector).forEach(element => element.remove());
    } else if (selector instanceof Object && selector['type'] == 'xpath') {
        const { query } = selector;
        console.info(`Cleaning XPath ${query}`);
        const result = document.evaluate(query, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0; i < result.snapshotLength; i++) {
            result.snapshotItem(i).remove();
        }
    }
}

const BLOCKLIST = [
    'aside[aria-label = "Related Posts Section"]',
    'div.mt-md',
    { type: 'xpath', query: '//h6[contains(text(),"Trending")] | //h6[contains(text(),"Trending")]/following-sibling::*' },
    '#left-sidebar-container',
];

function cleanup() {
    BLOCKLIST.forEach(removeElements);
}

// Document is idle
cleanup();
