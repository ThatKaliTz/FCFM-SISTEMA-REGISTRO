<?php
    require_once "connection.php";
    function QueryPerfiles($nombre){
        $mysqli = getConnection();
        $stmt = $mysqli->prepare("call QueryPerfil(10, ?)");
        $stmt->bind_param("s", $nombre);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();
        $mysqli->close();
        $perfiles = [];
        if($result->num_rows > 0){
            while($row = $result->fetch_assoc()){
                $perfiles[] = $row;
            }
        }
        return $perfiles;
    }
    function AddPerfil($nombre){
        $mysqli = getConnection();
        $stmt = $mysqli->prepare("call AddPerfil(?)");
        $stmt->bind_param("s", $nombre);
        $success = $stmt->execute();
        $stmt->close();
        $mysqli->close();
        return $success;
    }
    function EditPerfil($id, $nombre){
        $mysqli = getConnection();
        $stmt = $mysqli->prepare("call EditPerfil(?, ?)");
        $stmt->bind_param("is", $id, $nombre);
        $success = $stmt->execute();
        $stmt->close();
        $mysqli->close();
        return $success;
    }
    function DeletePerfil($id){
        $mysqli = getConnection();
        $stmt = $mysqli->prepare("call DeletePerfil(?)");
        $stmt->bind_param("i", $id);
        $success = $stmt->execute();
        $stmt->close();
        $mysqli->close();
        return $success;
    }
?>