// ==UserScript==
// @name Clean up old.reddit.com
// @description old.reddit.com is much better than the new horrible stuff, but it is still slightly distracting
// @match *://old.reddit.com/*
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

function q(selector, then, context) {
    const queryResult = executeQuery(selector, context);
    queryResult.forEach(then);
}

function removeElements(selector, context) {
    q(selector, (e => e.remove()), context);
}

function cleanup() {
    // Cleanup sidebar
    const sidebar = document.querySelector('div.side');
    removeElements('div.spacer:has(div.submit)', sidebar);
    removeElements('div.spacer:has(.premium-banner-outer)', sidebar);
    removeElements('div.spacer:has(.sidecontentbox)', sidebar);
    removeElements('div.spacer:empty', sidebar); // These were already there.

    // Don't doomscroll through subreddits in any case ("next" button is still better than autoscrolling, though)
    q(['.next-button a', '#header-img-a', '.redditname a'], (e) => e.setAttribute('style', 'pointer-events: none; color: #738491; user-select: none;'));

    // I don't need the footer (Copyright, EULA, ...)
    removeElements('.footer-parent');
    // I also don't want to click through subreddits
    removeElements('#sr-header-area');

    // No, I don't want to create an account
    removeElements('.listingsignupbar');
    removeElements('.commentsignupbar');

    // Why is there a "Comments" button if you have the comments section for a post open? It goes in circles (i.e. links to the same site).
    q('ul.tabmenu', tabmenu => {
        if (tabmenu.innerText.toLowerCase() === 'comments') {
            tabmenu.remove();
        }
    });
}

function limitPosts(maxNumberOfPosts) {
    const posts = Array.from(document.querySelectorAll('.linklisting .thing'));
    const tooMany = posts.slice(maxNumberOfPosts);
    tooMany.forEach(e => e.remove());
}

cleanup();
limitPosts(5);
