// ==UserScript==
// @name Clean up Phoronix
// @description Phoronix has a horrible comment section every damn time
// @match *://*.phoronix.com/*
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

function cleanup() {
    q({ type: 'xpath', query: '//article//a[contains(text(), "Comments")]' },  (e) => e.setAttribute('style', 'pointer-events: none; color: #738491; user-select: none;'));
}

cleanup();
