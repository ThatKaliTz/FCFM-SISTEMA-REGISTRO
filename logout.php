<?php
    header("Content-Type: application/json; charset=UTF-8");
    require_once "response.php";
    session_start();
    unset($_SESSION["user"]);
    die(json_encode(new Response(false, "")));
?>