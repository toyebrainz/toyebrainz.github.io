<?php
include_once("jtm.php");

$register = new DBRequest();
if (mysqli_num_rows($register->findEmail()) > 0){
	session_start();
	session_destroy();
	Connection::Close($register->conn);
    new ServerResponse(-2, "Email already exist!");
}
else $register->Register();

?>