# Content-aggregator

php based RSS aggregator

### Welcome to Content Aggregator

This is a simple php application to fetch contents from your favorite RSS based content provider.
Right now the default url is Engadget, but any rss feed can be loaded by providing it as a value of url parameter in the query string.

e.g. ?url=http://feeds.gawker.com/gizmodo/full 
This would get results from Gizmodo.</p>

Take a look at the working example at 
<a href="http://50.116.61.85/content-agg/">Engadget feed</a>
<a href="http://50.116.61.85/content-agg?url=http://feeds.gawker.com/gizmodo/full">Gizmodo Feed</a>

## Currently in progress 

* Better templating solution using mustache.js or dust.js -- currently using jquery templating.
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



