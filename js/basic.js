
var COLUMN_WIDTH = 250, NUM_COLUMNS = 0, MARGIN = 15, ColumnsHeightArray, LeftOffSet = 100, DEFAULT_RSS_URL='http://www.engadget.com/rss.xml' ;
var itemsArray = [];
var OFFSET = 1;

var ServerAppURL = 'EventListener.php', ServerEvent = 'event', ServerEventValue = 'LoadRss';

var randomHexHelperArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

function RssItem(t, l, d, pD, a) {
	this.title = t;
	this.link = l;
	this.description = d;
	this.pubDate = pD;
	this.author = a;
}

$(document).ready(function() {
	setupPage();
	addDataToPage();
	$(window).scroll(function(){
		if ($(window).scrollTop() == $(document).height() - $(window).height()){
			OFFSET++;
			addDataToPage();
		}
	}); 
});

function setupPage() {
	NUM_COLUMNS = Math.floor(($('#feedContainer').width())/(COLUMN_WIDTH + (MARGIN * 2)));
	ColumnsHeightArray = new Array(NUM_COLUMNS);
	for ( var c = 0; c< ColumnsHeightArray.length; c++) {ColumnsHeightArray[c] = MARGIN;} 
}

function addDataToPage(){

	var rssURL = getQueryString('url');
	if(rssURL == null || rssURL == '') {
		rssURL = DEFAULT_RSS_URL;
	}
	getItemsFromServer(rssURL);
}
// Arranges items in to columns, adding item to the column with least height
function arrangeItemsIntoColumns(item) {
		var itemWrapper = document.createElement('div');
		itemWrapper.className = 'item';
		var itemTitle = document.createElement('div');
		itemTitle.className = 'title';
		itemTitle.innerHTML = item.title[0];
		var itemAuthor = document.createElement('div');
		itemAuthor.className = 'author';
		if(item.author[0])
			itemAuthor.innerHTML = item.author[0];
		var itemDate = document.createElement('div');
		itemDate.className = 'date';
		itemDate.innerHTML = item.pubDate[0];

		var itemDesc = document.createElement('div');
		itemDesc.className = 'desc';
		itemDesc.innerHTML = item.description[0];
		
		itemWrapper.appendChild(itemTitle);
		itemWrapper.appendChild(itemAuthor);
		itemWrapper.appendChild(itemDate);
		itemWrapper.appendChild(itemDesc);

		$(itemWrapper).live('click', function() {
			window.open(item.link[0],'_blank');
		});
		
		var minValueOfColumn = Array.min(ColumnsHeightArray);
		var minIndex = $.inArray(minValueOfColumn, ColumnsHeightArray);
		var itemLeftPosition = MARGIN+(minIndex*(COLUMN_WIDTH+MARGIN))+LeftOffSet;
		var randomColor = '#'+randomHexHelperArray[Math.floor((Math.random()*15))]+randomHexHelperArray[Math.floor((Math.random()*15))]
		+randomHexHelperArray[Math.floor((Math.random()*15))]+randomHexHelperArray[Math.floor((Math.random()*15))]
		+randomHexHelperArray[Math.floor((Math.random()*15))]+randomHexHelperArray[Math.floor((Math.random()*15))];
		$(itemWrapper).css ({
			'left' : itemLeftPosition+'px',
			'top'  : minValueOfColumn+'px',
			'background' : randomColor
		});
		if(	item.title[0].indexOf('Podcast') <0)
		{
			$('#feedContainer').append(itemWrapper);
			$(itemWrapper).fadeIn(1300);
			ColumnsHeightArray[minIndex] += minIndex+$(itemWrapper).height()+MARGIN;
		}
}

function arrangeItemsIntoColumnsJQT(items) {
	var markup = '<div class="item"><div class="title">${title[0]}</div><div class="author">${author[0]}</div><div class="date">${pubDate[0]}</div><div class="desc">${description[0]}</div></div>';

	/* Compile markup string as a named template */
	$.template( "itemTemplate", markup );

	/* Render the named template */
	$.tmpl( "itemTemplate", items ).appendTo( "#feedContainer" );
}

// Iterate over XML nodes and arrange them in to columns
function arrangeXMLItems(){
	$xml.find("item").each(function() {
		var $this = $(this),
			item = {
				title: $.trim($this.find("title").text()),
				link: $.trim($this.find("link").text()),
				description: $.trim($this.find("description").text()),
				pubDate: $.trim($this.find("pubDate").text()),
				author: $.trim($this.find("author").text())
		};
		arrangeItemsIntoColumns(item);
	});
}

// Function to get the query string value for the given parameter
function getQueryString(param) {
	  var result = {}, queryString = location.search.substring(1),
	      re = /([^&=]+)=([^&]*)/g, m;

	  while (m = re.exec(queryString)) {
	    result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
	  }

	  return result[param];
}
// Get Items from an xml file
function getItemsFromFile(path) {
	$.get(path, function(data) {
	    var $xml = $(data);
	    arrangeXMLItems($xml);
	},
	'xml');
}

// Get Items via ajax call 
function getItemsFromServer(rssURL) {
	$.get(ServerAppURL + '?' + ServerEvent + '=' + ServerEventValue + '&rssURL='+rssURL+'&offset='+OFFSET,function(data) {
			var items = eval(data);
			 without templating solution
			for(i in items) {
				arrangeItemsIntoColumns(items[i]);
			}
			
			//arrangeItemsIntoColumnsJQT(items);
		},'json');
}

//Function to get the Min value in Array
Array.min = function(array) {
 return Math.min.apply(Math, array);
};