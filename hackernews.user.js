// ==UserScript==
// @name Clean up Hackernews
// @description Hackernews is still a bit distracting.
// @match *://news.ycombinator.com/*
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
    q(selector, e => e.remove(), context);
}

function submissions() {
    return Array.from(document.querySelectorAll('tbody .athing'));
}

function submissionTitle(submission) {
    return submission.querySelector('.titleline a').innerText;
}

function deleteSubmission(sub) {
    const trContext = sub.nextElementSibling;
    const trSpacer = trContext.nextElementSibling;
    sub.remove();
    trContext.remove();
    trSpacer.remove();
}

/// Note that this does not work on `news.ycombinator.com/jobs`, since that uses other element classes. Which is quite perfect :)
function removeHiringPosts() {
    submissions().filter(s => submissionTitle(s).toLowerCase().includes("is hiring"));
}

function limitPosts(maxNumberOfPosts) {
    const posts = submissions();
    const tooMany = posts.slice(maxNumberOfPosts);
    tooMany.forEach(deleteSubmission);
}

function cleanupCommon() {
    // Delete footer
    const footerTr = Array.from(document.querySelectorAll('tr'));
    const footer = footerTr.slice(footerTr.length - 2);
    footer.forEach(e => e.remove());
}

function disableLink(linkElement) {
    linkElement.setAttribute('style', 'pointer-events: none; color: #738491; user-select: none;');
}

function cleanupMainpage() {
    cleanupCommon();
    // Disable "next" button
    q('.morelink', disableLink);
    // Disable top-left "Hacker News" image + logo (why would they be clickable? this just goes in circles)
    q(['.hnname', 'td[bgcolor="#ff6600"] a:has(img)'], disableLink);

    removeHiringPosts();
    limitPosts(5);    
}

function cleanupItem() {
    // /item?id=... (a submission discussion section)
    cleanupCommon();

    removeElements('tr:has(td[bgcolor="#ff6600"])');
}

if (unsafeWindow.location.pathname === '/item') {
    cleanupItem();
} else {
    cleanupMainpage();
}
