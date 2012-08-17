# Content-aggregator

php based RSS aggregator

### Welcome to Content Aggregator

This is a simple php application to fetch contents from your favorite RSS based content provider.
Right now the default url is Engadget, but any rss feed can be loaded by providing it as a value of url parameter in the query string.
e.g. ?url=<a href="http://feeds.gawker.com/gizmodo/full">http://feeds.gawker.com/gizmodo/full</a> 
This would get results from Gizmodo

## Currently in progress 

* Better templating solution using mustache.js or dust.js
* In place (within page) content viewing.

## Roadmap

* Offer a catalog of different categories of rss feeds available for user to choose from.
* Offer different layouts for the feed display to choose from.
* Background and text color schemes and options( lights-on/lights-off )
* User accounts
* User favorite items and lists
* Saving content on the server instead of fetching on the fly.
* Preference to include feed images/videos etc. or have text only feed.
* Tabs for different feeds at once



