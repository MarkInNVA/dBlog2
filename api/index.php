<?php

require 'Slim/Slim.php';

$app = new Slim();

$app->get('/photos', 'getPhotos');
$app->get('/photos/:id',	'getPhoto');
$app->get('/photos/search/:query', 'findByName');
$app->post('/photos', 'addPhoto');
$app->put('/photos/:id', 'updatePhoto');
$app->delete('/photos/:id',	'deletePhoto');

$app->get('/markup', 'getMarkups');
$app->get('/markup/:id',	'getMarkup');
$app->get('/markupLoc/:id',    'getMarkupLoc');
$app->get('/markup/search/:query', 'findMarkupByName');
$app->post('/markup', 'addMarkup');
$app->put('/markup/:id', 'updateMarkup');
$app->delete('/markup/:id',	'deleteMarkup');


$app->get('/comment', 'getComments');
$app->get('/comment/:id',	'getComment');
$app->get('/comment/search/:query', 'findComments');
// $app->post('/comment', 'addComment');
// $app->put('/comment/:id', 'updateComment');
// $app->delete('/comment/:id',	'deleteComment');


$app->run();

function getPhotos() {
	$sql = 'select * FROM photos ORDER BY "Name"';
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$wines = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		// echo '{"wine": ' . json_encode($wines) . '}';
		echo json_encode($wines);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
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
	$dbhost="igsaaaegaser003.er.usgs.gov";
//    $dbhost="localhost";
	$dbuser="loader";
	$dbpass="loader";
    $dbname="opPhotos";
//    $dbname="db1";
	$dbh = new PDO("pgsql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}

function getMarkups() {
	$sql = 'select * FROM photo_markup ORDER BY id';
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$wines = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		// echo '{"wine": ' . json_encode($wines) . '}';
		echo json_encode($wines);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}
// , unnest(loc)
// function getMarkup($id) {
    // $sql = "SELECT id, fk_photos, x, y, size, label, color FROM photo_markup WHERE id=:id";
    // try {
        // $db = getConnection();
        // $stmt = $db->query($sql);  
        // $markups = $stmt->fetchAll(PDO::FETCH_OBJ);
        // $db = null;
        // // echo '{"wine": ' . json_encode($wines) . '}';
        // echo json_encode($markups);
    // } catch(PDOException $e) {
        // echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    // }}

function getMarkup($id) {
	$sql = "SELECT id, fk_photos, x, y, size, label, color, loc FROM photo_markup WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$photo = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($photo); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}



//getMarkupLoc
function getMarkupLoc($id) {
   // $sql = "SELECT array_to_json(loc2)  FROM photo_markup WHERE id=:id";
    $sql = "SELECT  x,y  FROM loc where fk_id = :id order by id";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);  
        $stmt->bindParam("id", $id);
        $stmt->execute();
        $photo = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
 //       echo $photo; 
        echo json_encode($photo); 
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }
}

function addMarkup() {
//	error_log('addMarkup\n', 3, 'php.log');
	$request = Slim::getInstance()->request();
	$photo_markup = json_decode($request->getBody());
	$sql = "INSERT INTO photo_markup (fk_photos, x, y, size, label, color) VALUES (:fk_photos, :x, :y, :size, :label, :color)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam(':fk_photos', $photo_markup->fk_photos);
		$stmt->bindParam(':x', $photo_markup->x);
		$stmt->bindParam("y", $photo_markup->y);
		$stmt->bindParam("size", $photo_markup->size);
		$stmt->bindParam("label", $photo_markup->label);
		$stmt->bindParam("color", $photo_markup->color);
		$stmt->execute();
		$photo_markup->id = $db->lastInsertId();
		$db = null;
		echo json_encode($photo_markup); 
	} catch(PDOException $e) {
//		error_log($e->getMessage(), 3, 'php.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function updateMarkup($id) {
	$request = Slim::getInstance()->request();
	$body = $request->getBody();
	$photo = json_decode($body);
	$sql = "UPDATE photo_markup SET name=:name, grapes=:grapes, country=:country, region=:region, year=:year, description=:description WHERE id=:id";
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

function deleteMarkup($id) {
	$sql = "DELETE FROM photo_markup WHERE id=:id";
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

function findMarkupByName($query) {
	$sql = "SELECT * FROM photo_markup WHERE fk_photos = :query ORDER BY id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$query = $query;  
		$stmt->bindParam("query", $query);
		$stmt->execute();
		$markups = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($markups);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

// $app->get('/comment', 'getComments');
// $app->get('/comment/:id',	'getComment');
// $app->get('/comment/search/:query', 'findComments');

function getComments() {
	$sql = 'select * FROM photo_comments ORDER BY id';
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$comments = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($comments);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}


function getComment($id) {
	$sql = "SELECT * FROM photo_comments WHERE id=:id";
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


function findComments($query) {

	$sql = "SELECT * FROM photo_comments WHERE fk_photos = :query ORDER BY id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$query = $query;  
		$stmt->bindParam("query", $query);
		$stmt->execute();
		$comments = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($comments);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}




?>