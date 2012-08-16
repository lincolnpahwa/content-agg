<?php
?>

<html>
<head>
<style type="text/css">
body {
	width: 80%;
	height: 600px;
	margin: 10 auto;
	padding: 20px;
	background : #000;
}

#feedContainer {
	width: 100%;
}

#addMore {
	position: absolute;
	top: 10px;
	left: 10px;
}

.item {
	padding: 3px;
	height: auto;
	border: 1px solid #eee;
	position: absolute;
	margin: 15px;
	width: 250px;
	background: #7c7c7c;
	color: #ddd;
	font-size: 14px;
	font-family: Arial, Verdana;
	border-radius: 5px;
	-webkit-transition: all 0.5s ease-in-out;
	-moz-transition: all 0.5s ease-in-out;
	-o-transition: all 0.5s ease-in-out;
	-ms-transition: all 0.5s ease-in-out;
	transition: all 0.5s ease-in-out;
	display : none;
}


.item a {
	text-decoration : none;
	color : #eee;
}

.item:hover {
	background: #7c7c7c;
	color: #fff;
	font-weight : bolder;
	z-index : 10001;
	width : 400px;
	border : 6px solid #fff;
}

.item:hover a{
	font-size : 105%;
	text-decoration : underline;
	color : #fff;
}

.item div.title {
	font-weight: bold;
	border-bottom: 1px solid #eee;
	cursor: pointer;
	color : #fff;
	padding-bottom : 3px;
}

.item div.author {
	font-weight: small;
}
.item div.desc {
	font-size : 80%;
	padding : 5px 0;
	margin : 2px 0;
}

.item div.desc img, .item div.desc object, .item div.desc embed, .item div.desc iframe {
	display : none;
}

</style>
<script type="text/javascript" src=" https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
<script>
var COLUMN_WIDTH = 250, NUM_COLUMNS = 0, MARGIN = 15, ColumnsHeightArray, LeftOffSet = 100 ;
var itemsArray = [];
var OFFSET = 1;

var randomHexHelperArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

function rssObject(t, l, d, pD, a) {
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
//	$.get('data/userXML.xml', function(data) {
//	    var $xml = $(data);
//	    $xml.find("item").each(function() {
//	        var $this = $(this),
//	        	item = {
//	                title: $.trim($this.find("title").text()),
//	                link: $.trim($this.find("link").text()),
//	                description: $.trim($this.find("description").text()),
//	                pubDate: $.trim($this.find("pubDate").text()),
//	                author: $.trim($this.find("author").text())
//	        };
//	        arrangeItemsIntoColumns(item);
//	    });
//	},
//	'xml');
	var rssURL = getQueryString('url');
	if(rssURL == null || rssURL == '') {
		rssURL = 'http://www.engadget.com/rss.xml';
	}
	//http://feeds.gawker.com/gizmodo/full
	$.get('EventListener.php?event=LoadRss&rssURL='+rssURL+'&offset='+OFFSET,function(data) {
			var items = eval(data);
			for(i in items) {
				arrangeItemsIntoColumns(items[i]);
			}
		},'json');
}

function arrangeItemsIntoColumns(item) {
		var itemWrapper = document.createElement('div');
		itemWrapper.className = 'item';
		var itemTitle = document.createElement('div');
		itemTitle.className = 'title';
		itemTitle.innerHTML = item.title[0];
		var itemAuthor = document.createElement('div');
		itemAuthor.className = 'author';
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

function getQueryString(param) {
	  var result = {}, queryString = location.search.substring(1),
	      re = /([^&=]+)=([^&]*)/g, m;

	  while (m = re.exec(queryString)) {
	    result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
	  }

	  return result[param];
	}

//Function to get the Min value in Array
Array.min = function(array) {
 return Math.min.apply(Math, array);
};
/***
//window.onscroll = load_more;
var page = 1; //PAGE NUMBER ALREADY SHOWN

function load_more(){
	var doc_h = document.body.scrollHeight; //DOC HEIGHT
	var win_h = document.body.clientHeight; //WINDOW HEIGHT
	var d = doc_h-win_h; //DIFFERENCE OF DOC & WINDOW HEIGHT
	var yOffset = window.pageYOffset; //WINDOW SCROLLBAR Y OFFSET

	//IF SCROLLBAR OFFSET EQUALS DIFFERENCE
	if(yOffset==d){
	page++; //LOAD THE NEXT PAGE ONE AT A TIME
	addDataToPage();
}
}
***/
</script>

</head>

<body>
<div id="pageContainer">
<div id="feedContainer"></div>
</div>
</body>
</html>
