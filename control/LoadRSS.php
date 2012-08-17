<?php
class LoadRSS {
	
	var $rssURL;
	var $PAGE_SIZE = 10;
	function __construct($url = "") {
		$this->rssURL = $url;
	}
	
	function loadURL () {
		$content = file_get_contents($this->rssURL);
		$rss = new SimpleXMLElement($content, LIBXML_NOCDATA);
		$rssDataArray = array();
		$offset = $_REQUEST['offset'];
		$offset -=1;
		$offset *= $this->PAGE_SIZE;
		$size = 0;
		$currentIndex = 0;
		foreach($rss->channel->item as $item) {
			$itemData = array(
				'title'=>$item->title[0],
				'link'=>$item->link[0],
				'description'=>$item->description[0],
				'author'=>$item->author[0],
				'pubDate'=>$item->pubDate[0]
			);
			if(($currentIndex >= $offset) && ($currentIndex < ($offset + $this->PAGE_SIZE))){
				array_push($rssDataArray, $itemData);
				$size++;
			}
			if($size > $this->PAGE_SIZE) {
				break;
			}
			$currentIndex++;
		}
		
		return json_encode($rssDataArray);
	}
}

?>
