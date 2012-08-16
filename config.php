<?php 

function __autoload($classname) { 
	if(file_exists("control/" . $classname . ".php"))   
	{
		include_once("control/" . $classname . ".php");
	}
	else if(file_exists("model/" . $classname . ".php"))
	{
		include_once("model/" . $classname . ".php");
	}
	else if(file_exists($classname . ".php"))
	{
		include_once($classname . ".php");
	}
    
} 

?>