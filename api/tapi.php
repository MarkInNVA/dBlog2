<?php

	$sql = 'select * FROM photos order by "Name" ';
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$photos = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		// echo $photos;
		// echo '{"photo": ' . json_encode($photos) . '}';
		echo json_encode($photos);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}


function getPhoto($id) {
	$sql = "SELECT * FROM photos WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$photo = $stmt->fetchObject();  
		$db = null;
		echo json_encode($photo); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function addPhoto() {
	error_log('addPhoto\n', 3, '/var/tmp/php.log');
	$request = Slim::getInstance()->request();
	$photo = json_decode($request->getBody());
	$sql = "INSERT INTO photos (name, grapes, country, region, year, description) VALUES (:name, :grapes, :country, :region, :year, :description)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("name", $photo->name);
//		$stmt->bindParam("grapes", $wine->grapes);
//		$stmt->bindParam("country", $wine->country);
//		$stmt->bindParam("region", $wine->region);
//		$stmt->bindParam("year", $wine->year);
//		$stmt->bindParam("description", $wine->description);
		$stmt->execute();
		$wine->id = $db->lastInsertId();
		$db = null;
		echo json_encode($photo); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, '/var/tmp/php.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function updatePhoto($id) {
	$request = Slim::getInstance()->request();
	$body = $request->getBody();
	$photo = json_decode($body);
	$sql = "UPDATE photos SET name=:name, grapes=:grapes, country=:country, region=:region, year=:year, description=:description WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("name", $photo->name);
//		$stmt->bindParam("grapes", $wine->grapes);
//		$stmt->bindParam("country", $wine->country);
//		$stmt->bindParam("region", $wine->region);
//		$stmt->bindParam("year", $wine->year);
//		$stmt->bindParam("description", $wine->description);
//		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
		echo json_encode($photo); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function deletePhoto($id) {
	$sql = "DELETE FROM photos WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function findByName($query) {
	$sql = "SELECT * FROM photos WHERE UPPER(name) LIKE :query ORDER BY name";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$query = "%".$query."%";  
		$stmt->bindParam("query", $query);
		$stmt->execute();
		$photos = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($photos);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getConnection() {
	$dbhost="igsaaaegaser003";
	$dbuser="loader";
	$dbpass="loader";
	$dbname="opPhotos";
	$dbh = new PDO("pgsql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}

?>