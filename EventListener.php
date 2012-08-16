
<?php
include_once('config.php');
$event = $_REQUEST['event'];
new EventListener($event);
?>