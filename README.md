# Motivation

Doomscrolling was becoming a problem for me; existing extensions, like LeechBlock were not really helpful - it only gives you a time limit *per website*, but doesn't distinguish between productive time and doomscrolling. For example, on reddit, there are often helpful technical posts outlining a solution to a problem you might find while googling. However, I then often got sucked into the "related posts" rabbit hole and lost a lot of time.

The solution is of course to not allow viewing posts directly (e.g. doomscrolling r/linux). I chose to limit the number of posts instead for now.
Furthermore, the related posts needed to be gone (which is why I force old.reddit.com). Finally, I disabled the next button, so that you can actually not doomscroll, but use the sites for finding out information instead only.

# A collection of Violentmonkey scripts to make certain doomscrolling websites less horrible

## new.reddit.com

- It has infinite autoscrolling
- It has a very bright/engaging design
- It puts a focus on the comment section instead of TFA
- Recommended "next" articles

Because of these enshittification/addiction anti-features, old.reddit.com is much better. However, it still has some problems:
- Distracting links to "sign up", "donate", etc.
- A next button, theoretically allowing infinite doomscrolling
- Too many posts per page loaded
- A pointless footer

The reddit script removes all of this:
- Removes all distracting elements
- Limits number of posts to 5 (this prevents spiralling out of control)
- Disables the "next" button

## Hackernews, lobste.rs

Hackernews and lobste.rs are quite nicely designed already. They put the focus on the post and not the comments, don't autoscroll, don't have related posts, etc.

They do still have a "next page" button and some distracting elements (Hackernews footer) though.

## TODO, WishList

- [ ] Have something for YouTube as well? The issue is that I currently also use YouTube for music though, so I need the auto-play...
  I also like listening to talks. In this case, I also want to auto-play. Maybe the solution is to have a list of trusted channels + an RSS feed?
- [ ] Port this to an extension. This would allow for the following features:
  + More maintainable code (the query engine could be shared and not copy-pasted)
  + More maintainable code x2 (e.g. the reddit code is split across two files, oldreddit.user.js and )force_oldreddit.user.js; one of the concerns are in different files).
  + Be less hacky: e.g. we could avoid the flickering before loading a newreddit page (as it loads and the link is replaced). We could instead directly intercept URLs.
  + (Optional) Configuration (e.g. how many posts do you want shown per page?)
