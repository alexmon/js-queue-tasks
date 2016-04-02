<?php

if (
	isset($_POST['execute']) && 
	$_POST['execute'] == true
) {
	$waitForResponse = rand(1,10);

	sleep($waitForResponse);

	header('Content-type: application/json');

	echo json_encode(
		[
			'success' => true,
			'responseTime' => $waitForResponse
		]
	);
}

