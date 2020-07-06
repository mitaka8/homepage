<?php

	$json = $_POST['config'];
	$key = $_POST['key'];
	// validate input
	if(!(is_string($json) && is_string($key) && strlen($json) > 0 && strlen($key) > 0 && json_decode($json) !== false && strlen($key) < 255 && strlen($json) < 8192)) {
		die("Invalid input.  Make sure config is a valid json string and key is a string");
	}
	

	// make sure the config directory exists.
	if (!is_dir('config')) mkdir('config');

	$hash = hash_hmac('sha512', $json, $key);
	$filename = "config/$hash.json";
	echo "$hash";
	if (!file_exists($filename))
	file_put_contents($filename, $json);
