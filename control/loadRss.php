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
			if(($currentIndex >= $offset) && ($currentIndex < ($offset + $this->PAGE_SIZE))){
				$itemData = array(
					'title'=>$item->title,
					'link'=>$item->link,
					'description'=>$item->description,
					'author'=>$item->author,
					'pubDate'=>$item->pubDate
				);
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