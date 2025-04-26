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

function disableLink(linkElement) {
    linkElement.setAttribute('style', 'pointer-events: none; color: #738491; user-select: none;');
}
function disableLink2(linkElement) {
    linkElement.setAttribute('style', 'pointer-events: none; user-select: none;' + linkElement.getAttribute('style'));
}

function cleanup() {
    // Disable "next" button
    q('.morelink', disableLink);
    q('#logo', disableLink2);

    if (unsafeWindow.location.pathname.startsWith('/s/')) {
        // For submissions, we also don't want a title bar
        removeElements('#nav');
    }
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
