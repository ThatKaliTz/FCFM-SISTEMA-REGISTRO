<?php
    header("Content-Type: application/json; charset=UTF-8");
    require_once "connection.php";
    require_once "response.php";
    $error = !isset($_POST["data"]) || is_null(json_decode($_POST["data"]));
    if($error){
        die(json_encode(new Response(true, "Error al obtener petición")));
    }
    $mysqli = getConnection();
    $data = json_decode($_POST["data"]);
    $stmt = $mysqli->prepare("call Login(?)");
    $stmt->bind_param("i", $data->matricula);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    $mysqli->close();

    // i - integer
    // d - double
    // s - string
    // b - BLOB

    if($result->num_rows > 0){
        $user = $result->fetch_assoc();

        if($user["Baneado"] == 1){

            $motivoBaneo = $user["motivoBaneo"];

            die(json_encode(new Response(true, "Has sido baneado de sistema registro." . "\n Motivo: " . $motivoBaneo)));
        }

        if(password_verify($data->contraseña, $user["Contrasena"])){
            session_start();
            $_SESSION["user"] = $user;
            die(json_encode(new Response(false, "Todo bien")));
        }
        else{
            die(json_encode(new Response(true, "Contraseña incorrecta")));
        }
        // if(!$user["EsAdmin"]){
        //   die(json_encode(new Response(true, "Error"))); 
        // }
        // else{
        //     if(password_verify($data->contraseña, $user["Contraseña"])){
        //         session_start();
        //         $_SESSION["user"] = $user;
        //         die(json_encode(new Response(false, "Todo bien")));
        //     }
        //     else{
        //         die(json_encode(new Response(true, "Contraseña incorrecta")));
        //     }
        // }
    }
    else{
        die(json_encode(new Response(true, "No se encontró el usuario")));
    }
?>