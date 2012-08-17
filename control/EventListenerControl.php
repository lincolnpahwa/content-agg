<?php
class EventListenerControl{
	function __construct($event) {
		$this->SelectAction($event);
	}	
	
	function SelectAction($event) {
		switch ($event) 
		{
			case 'LoadRss' : {
				$loadRss = new LoadRSS($_REQUEST['rssURL']);
				echo $loadRss->loadURL();
				break;
			}
		}
	}
}

?>
