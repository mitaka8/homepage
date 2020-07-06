<?php
	ini_set('display_errors', 'on');
	if (empty($_GET['r'])) {
		die('Unknown Resource \'\'.  Please provide a resource using ?r=<resource>');
	}
	$url = $_GET['r'];
	if (filter_var($url, FILTER_VALIDATE_URL === false)) {
		die('Invalid Resource.  Please provide a properly encoded url.');
	}

	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_HEADER, false);

	echo curl_exec($ch);
?>
