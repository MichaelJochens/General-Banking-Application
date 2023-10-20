<?php
//POST FUNCTIONS
	$name =  $_POST['name']
	$username =  $_POST['username']
	$email =  $_POST['email']
	$password =  $_POST['password']
	$accountNumber =  $_POST['accountNumber']
	
	//CONNECTION TO DATABASE
	$conn = new mysqli('localhost','root','','');
	if($conn->connect_error){
		die('Connection failed : '.$conn->connect_error)
	}else{
		$stmt = $conn->prepare("insert into registration(name, username, email, password, accountNumber) values(?,?,?,?,?)");
		$stmt->bind_param("ssssi", $name, $username, $email, $password, $accountNumber)
		$stmt->execute();
		echo "Registration successful";
		$stmt->close();
		$conn->close();
	}
?>