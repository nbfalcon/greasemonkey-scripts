// ==UserScript==
// @name Redirect reddit -> old.reddit.com
// @description old.reddit.com is less addictive and enshittified (javascript, infinite scroll, ...)
// @match *://www.reddit.com/*
// @match *://reddit.com/*
// @match *://old.reddit.com/*
// @run-at document-start
// @grant none
// ==/UserScript==

// TODO: this is hacky and the concerns are split across two modules, oldreddit.user.js (for the hot button) and this file...
//   If we migrate this to a proper plugin, there is presumably a way around this.
/// If we are on a subreddit overview site (i.e. old.reddit.com/r/linux/), we want to go to "new" immediately
function forceSubredditNew1(location, stop) {
    const segments = location.pathname.split('/').filter(e => e != "");
    if (segments.length == 2 && segments[0] == "r") {
        if (stop) {
            unsafeWindow.stop();
        }

        // r/linux
        location.pathname = '/r/' + segments[1] + "/new";
    }
}

function forceSubredditNewByDefault() {
    if (unsafeWindow.location.hostname === 'old.reddit.com') {
        forceSubredditNew1(unsafeWindow.location);
    }
}

function forceOldReddit() {
    if (unsafeWindow.location.hostname === 'www.reddit.com' || unsafeWindow.location.hostname === 'reddit.com') {
        let newLocation = new URL(unsafeWindow.location);
        newLocation.hostname = 'old.reddit.com';
        forceSubredditNew1(newLocation);
        
        unsafeWindow.stop();
        unsafeWindow.location = newLocation;
    }
}

forceOldReddit();
forceSubredditNewByDefault();
