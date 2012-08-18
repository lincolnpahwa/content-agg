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
<<<<<<< HEAD:control/loadRss.php
				'title'=>$item->title,
				'link'=>$item->link,
				'description'=>$item->description,
				'author'=>$item->author,
				'pubDate'=>$item->pubDate
=======
				'title'=>$item->title[0],
				'link'=>$item->link[0],
				'description'=>$item->description,
				'author'=>$item->author[0],
				'pubDate'=>$item->pubDate[0]
>>>>>>> cb7a530158c956c39bb2c1563fb437aa4666340e:control/LoadRSS.php
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
