
var DEFAULT_COLUMN_WIDTH = 250, COLUMN_WIDTH = 0, NUM_COLUMNS = 0, MARGIN = 15, ColumnsHeightArray, LeftOffSet = 100, DEFAULT_RSS_URL='http://www.engadget.com/rss.xml', DEFAULT_XML_PATH = 'data/userXML.xml' ;
var ItemsArray = [];
var OFFSET = 1;

var ServerAppURL = 'EventListener.php', ServerEvent = 'event', ServerEventValue = 'LoadRss';

var COLOR_ARRAY = ['#288D9C','#09AA83','#295D41','#D8840D', '#53B047', '#2936ED', '#CE7309', '#B50574', '#5D5EB2', '#6458A9', '#133256', '#07B957', '#6C5832', '#3CC137', '#7007CE', '#3BAA3C','#327980', '#1A9AB4', '#8753E1', '#0A9086', '#783D73', '#C55477', '#3714DB', '#1D0A2E', '#277605', '#2962C9', '#AAADE7', '#0154A4', 
'#014B66', '#C74664', '#0E2E29', '#139A94', '#50904C', '#544086', '#BC6D56', '#6B036A', '#B82383', '#843C6B', '#A916C6', '#985632', '#1D0DE1', '#7D3521', '#A8182A', '#E12204'];

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
	$(window).resize(function(){
		window.location.reload();
	});
});

function setupPage() {
	COLUMN_WIDTH = $('#feedContainer').width()*0.3;
	if(COLUMN_WIDTH < DEFAULT_COLUMN_WIDTH) COLUMN_WIDTH = DEFAULT_COLUMN_WIDTH;
	NUM_COLUMNS = Math.floor(($('#feedContainer').width())/(COLUMN_WIDTH + (MARGIN * 2)));
	ColumnsHeightArray = new Array(NUM_COLUMNS);
	for ( var c = 0; c< ColumnsHeightArray.length; c++) {ColumnsHeightArray[c] = MARGIN;} 
}

function addDataToPage(){

	var rssURL = getQueryString('url');
	if(rssURL == null || rssURL == '') {
		rssURL = DEFAULT_RSS_URL;
	}
	// load items from server
	getItemsFromServer(rssURL);
	// load items from xml ( local path for testing)
	//getItemsFromFile(DEFAULT_XML_PATH);
}

function createPageElement(item) {
	var item = this;
	var itemWrapper = document.createElement('div');
		itemWrapper.className = 'item';
		var itemTitle = document.createElement('div');
		itemTitle.className = 'title';
		itemTitle.innerHTML = item.title;
		var itemAuthor = document.createElement('div');
		itemAuthor.className = 'author';
		if(item.author && item.author)
			itemAuthor.innerHTML = item.author;
		var itemDate = document.createElement('div');
		itemDate.className = 'date';
		itemDate.innerHTML = item.pubDate;

		var itemDesc = document.createElement('div');
		itemDesc.className = 'desc';
		itemDesc.innerHTML = item.description;
		var itemWrapperDiv = document.createElement('div');
		itemWrapperDiv.className = 'itemLink';
		itemWrapperDiv.setAttribute('link', item.link);
		
		itemWrapperDiv.appendChild(itemTitle);
		itemWrapperDiv.appendChild(itemAuthor);
		itemWrapperDiv.appendChild(itemDate);
		itemWrapperDiv.appendChild(itemDesc);
		
		itemWrapper.appendChild(itemWrapperDiv);
		
		return itemWrapper;
}

function createPageElementFromTemplate(item) {
	var item = this;
	var itemWrapper = $.Mustache.render('item-template', item);
		var tempWrapper = document.createElement('div');
		tempWrapper.innerHTML = itemWrapper;
		itemWrapper = $(tempWrapper).find('.item');
		$(itemWrapper).find('.desc').html(htmlDecode($(itemWrapper).find('.desc').html()));
	return itemWrapper;
}

// Arranges items in to columns, adding item to the column with least height
function arrangeItemsIntoColumns(items, useTemplating) {
		var pageItemCreationFunction = 'createPageElement';
		if(useTemplating) {
			$.Mustache.addFromDom();
			pageItemCreationFunction = 'createPageElementFromTemplate';
		}
		for(var i =0; i<items.length;i++) {
			var item = items[i];
			if (typeof (pageItemCreationFunction) != 'undefined'
						&& typeof (window[pageItemCreationFunction]) == 'function') {
					var itemWrapper = window[pageItemCreationFunction].apply(item);
					addItemToThePage(itemWrapper, item);
			}			
		}
}

function arrangeItemsIntoColumnsTemplating(items) {
	
	for(var i = 0; i<items.length;i++) {
		var item = items[i];
		var itemWrapper = createPageElementFromTemplate(item);
		addItemToThePage(itemWrapper, item);
	}
	
}

// Add Item to the page
function addItemToThePage(itemWrapper, item) {
		$(itemWrapper).on('click', function() {
			window.open($(itemWrapper).find('.itemLink').attr('link'),'_blank');
		});
		
		var minValueOfColumn = Array.min(ColumnsHeightArray);
		var minIndex = $.inArray(minValueOfColumn, ColumnsHeightArray);
		var itemLeftPosition = MARGIN+(minIndex*(COLUMN_WIDTH+MARGIN))+LeftOffSet;
		/**
		var randomColor = '#'+randomHexHelperArray[Math.floor((Math.random()*15))]+randomHexHelperArray[Math.floor((Math.random()*15))]
		+randomHexHelperArray[Math.floor((Math.random()*15))]+randomHexHelperArray[Math.floor((Math.random()*15))]
		+randomHexHelperArray[Math.floor((Math.random()*15))]+randomHexHelperArray[Math.floor((Math.random()*15))];
		**/
		var randomColor = COLOR_ARRAY[Math.floor((Math.random()* COLOR_ARRAY.length))];
		$(itemWrapper).css ({
			'left' : itemLeftPosition+'px',
			'top'  : minValueOfColumn+'px',
			'background' : randomColor,
			'width' : COLUMN_WIDTH+'px'
		});
		if(	$(itemWrapper).find('.title').html().indexOf('Podcast') <0)
		{
			$('#feedContainer').append(itemWrapper);
			$(itemWrapper).fadeIn(1300);
			ColumnsHeightArray[minIndex] += minIndex+$(itemWrapper).height()+MARGIN;
		}
}

// Iterate over XML nodes and arrange them in to columns
function arrangeXMLItems(xml){
	var items = [];
	$(xml).find("item").each(function() {
		var $this = $(this),
			item = {
				title: $.trim($this.find("title").text()),
				link: $.trim($this.find("link").text()),
				description: $.trim($this.find("description").text()),
				pubDate: $.trim($this.find("pubDate").text()),
				author: $.trim($this.find("author").text())
		};
		items.push(item);
		/** non templating solution **/
		//arrangeItemsIntoColumns(item);
	});
	/** templating solution **/
	arrangeItemsIntoColumnsTemplating(items);
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
	    var xml = $(data);
	    arrangeXMLItems(xml);
	},
	'xml');
}

// Get Items via ajax call 
function getItemsFromServer(rssURL) {
	$.get(ServerAppURL + '?' + ServerEvent + '=' + ServerEventValue + '&rssURL='+rssURL+'&offset='+OFFSET,function(data) {
			var items = eval(data);
			initData(items);
			arrangeItemsIntoColumns(ItemsArray, false);
		},'json');
}

function initData(items) {
	ItemsArray = [];
	for(var i =0; i<items.length; i++) {
		var item = items[i];
		//ItemsArray.push(new RssItem(item.title[0], item.link[0], item.description[0], item.pubDate[0], item.author[0]));
		ItemsArray.push({title:item.title[0], author : item.author[0], description : item.description[0], pubDate : item.pubDate[0], link : item.link[0]});
	}
}

//Function to get the Min value in Array
Array.min = function(array) {
 return Math.min.apply(Math, array);
};


function htmlDecode(input){
  return input.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
}
