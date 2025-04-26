// ==UserScript==
// @name Clean up lobste.rs
// @description lobste.rs is the least horrible of the doomscrolling sites, but it is not quite ideal (too many posts, you can continue to the next page, ...)
// @match *://lobste.rs/*
// @run-at document-end
// @grant none
// ==/UserScript==
function executeQuery(selector, context) {
    if (context === undefined || context === null) {
        context = document;
    }

    if (typeof (selector) == 'string') {
        // console.info(`Cleaning querySelector ${selector}`);
        const result = context.querySelectorAll(selector);
        return Array.from(result);
    } else if (Array.isArray(selector)) {
        return selector.flatMap(s => executeQuery(s, context));
    } else if (selector instanceof Object && selector['type'] == 'xpath') {
        const { query } = selector;
        // console.info(`Cleaning XPath ${query}`);
        const result = context.evaluate(query, context, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        let resultArr = [];
        for (let i = 0; i < result.snapshotLength; i++) {
            resultArr.push(result.snapshotItem(i));
        }
        return resultArr;
    }
}

function q(selector, then) {
    const queryResult = executeQuery(selector);
    queryResult.forEach(then);
}

function removeElements(selector, context) {
    q(selector, e => e.remove());
}

function cleanup() {
    // Disable "next" button
    q('.morelink', (e) => e.setAttribute('style', 'pointer-events: none; color: #738491; user-select: none;'));
}

function submissions() {
    return Array.from(document.querySelectorAll('.stories .story'));
}

function limitPosts(maxNumberOfPosts) {
    const posts = submissions();
    const tooMany = posts.slice(maxNumberOfPosts);
    tooMany.forEach(e => e.remove());
}

cleanup();
limitPosts(5);
