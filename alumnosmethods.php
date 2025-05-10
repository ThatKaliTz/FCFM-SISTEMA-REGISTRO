<?php
    require_once "connection.php";
    function QueryAlumnos($matricula, $nombre, $primerap, $segundoap, $perfil, $estatus, $baneados = 0) {
        // Si la matrícula está vacía, la asignamos como null
        $matricula = empty($matricula) ? null : $matricula;
        
        // Obtener la conexión a la base de datos
        $mysqli = getConnection();
    
        // Preparar la llamada al procedimiento almacenado
        $stmt = $mysqli->prepare("CALL QueryUsuario(50, ?, ?, ?, ?, ?, ?, ?)");
    
        // Asociar los parámetros
        $stmt->bind_param("isssiii", $matricula, $nombre, $primerap, $segundoap, $perfil, $estatus, $baneados);
    
        // Ejecutar la consulta
        $stmt->execute();
    
        // Obtener el resultado
        $result = $stmt->get_result();
    
        // Cerrar la declaración y la conexión
        $stmt->close();
        $mysqli->close();
    
        // Procesar los resultados y devolverlos como un array
        $alumnos = [];
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $alumnos[] = $row;
            }
        }
    
        return $alumnos;
    }   
    function QueryUsuariosEncargados(){
        $mysqli = getConnection();
        $stmt = $mysqli->prepare("call QueryUsuariosEncargados()");
        // $stmt->bind_param("isssi", $matricula, $nombre, $primerap, $segundoap, $perfil);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();
        $mysqli->close();
        $usuariosEncargados = [];
        if($result->num_rows > 0){
            while($row = $result->fetch_assoc()){
                $usuariosEncargados[] = $row;
            }
        }
        return $usuariosEncargados;
    }
    function MatriculaExistente($matricula){
        $mysqli = getConnection();
        $stmt = $mysqli->prepare("call GetUsuarioMatricula(?)");
        $stmt->bind_param("i", $matricula);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();
        $mysqli->close();
        return ($result->num_rows > 0); /// SI RETORNA FILAS, ES QUE YA EXISTE
    }
    function AddAlumno($matricula, $nombre, $primerap, $segundoap, $correo, $perfil){
        $contraseña = password_hash($matricula, PASSWORD_DEFAULT);
        $mysqli = getConnection();
        $stmt = $mysqli->prepare("call AddUsuario(?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("isssssi", $matricula, $nombre, $primerap, $segundoap, $correo, $contraseña, $perfil);
        $success = $stmt->execute();
        $stmt->close();
        $mysqli->close();
        return $success;
    }
    function EditAlumno($id, $nombre, $primerap, $segundoap, $correo, $perfil){
        $mysqli = getConnection();
        $stmt = $mysqli->prepare("call EditUsuario(?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("issssi", $id, $nombre, $primerap, $segundoap, $correo, $perfil);
        $success = $stmt->execute();
        $stmt->close();
        $mysqli->close();
        return $success;
    }

    function BanAlumno($id, $motivoBaneo){
        $mysqli = getConnection();
        $stmt = $mysqli->prepare("call BanUsuario(?, ?)");
        $stmt->bind_param("is", $id, $motivoBaneo);
        $success = $stmt->execute();
        $stmt->close();
        $mysqli->close();
        return $success;
    }

    function DesbanAlumno($id, $motivoDesbaneo){
        $mysqli = getConnection();
        $stmt = $mysqli->prepare("call DesbanUsuario(?, ?, ?)");
        $Admin = $_SESSION["user"]["Id"];
        $stmt->bind_param("iss", $id, $Admin, $motivoDesbaneo,);
        $success = $stmt->execute();
        $stmt->close();
        $mysqli->close();
        return $success;
    }

    function ChangeContraseña($id, $contraseña){
        $contraseña = password_hash($contraseña, PASSWORD_DEFAULT);
        $mysqli = getConnection();
        $stmt = $mysqli->prepare("call EditContraseña(?, ?)");
        $stmt->bind_param("is", $id, $contraseña);
        $success = $stmt->execute();
        $stmt->close();
        $mysqli->close();
        return $success;
    }
    function ChangeCorreo($id, $correo){
        $mysqli = getConnection();
        $stmt = $mysqli->prepare("call EditCorreo(?, ?)");
        $stmt->bind_param("is", $id, $correo);
        $success = $stmt->execute();
        $stmt->close();
        $mysqli->close();
        return $success;
    }
    function DeleteAlumno($id){
        $mysqli = getConnection();
        $stmt = $mysqli->prepare("call DeleteUsuario(?)");
        $stmt->bind_param("i", $id);
        $success = $stmt->execute();
        $stmt->close();
        $mysqli->close();
        return $success;
    }
    function GetNombreCompleto($nombre, $formato){
        $nom = "";
        $primerap = "";
        $segundoap = "";
        $nombreCompleto = explode(" ", $nombre);
        if(count($nombreCompleto) >= 3){

            $articulos = ["DE", "LA", "DEL", "LOS"]; //Palabras no consideradas como apellidos por si solas ej. de, la, para apellidos como "de la Peña"
            if($formato == 2){
                /*$primerap = $nombreCompleto[count($nombreCompleto) - 1];
                $segundoap = $nombreCompleto[count($nombreCompleto) - 2];
                $nom = trim(str_replace($primerap, "", $nombre));
                $nom = trim(str_replace($segundoap, "", $nom));*/
                $segundoApellidoIndex = 0;
                $nombreIndex = 0;
                if(in_array($nombreCompleto[count($nombreCompleto) - 2], $articulos)){
                    //$nombreCompleto[count($nombreCompleto) - 1] = $nombreCompleto[count($nombreCompleto) - 1] . 'xx';
                    if(in_array($nombreCompleto[count($nombreCompleto) - 3], $articulos)){
                        //$nombreCompleto[count($nombreCompleto) - 1] = $nombreCompleto[count($nombreCompleto) - 1] . 'yy';
                        //el apellido tiene 2 articulos
                        $segundoap = $nombreCompleto[count($nombreCompleto) - 3] . ' ' . $nombreCompleto[count($nombreCompleto) - 2] . ' ' . $nombreCompleto[count($nombreCompleto) - 1];
                        $segundoApellidoIndex = 4;
                    }else{
                        //$nombreCompleto[count($nombreCompleto) - 1] = $nombreCompleto[count($nombreCompleto) - 1] . 'zz';
                        $segundoap = $nombreCompleto[count($nombreCompleto) - 2] . ' ' . $nombreCompleto[count($nombreCompleto) - 1];
                        $segundoApellidoIndex = 3;
                    }
                    //el apellido solo tiene un articulo
                }else{
                    //$nombreCompleto[count($nombreCompleto) - 1] = $nombreCompleto[count($nombreCompleto) - 1] . 'aa';
                    //$nombreCompleto[count($nombreCompleto) - 1] = $nombreCompleto[count($nombreCompleto) - 1] . $nombreCompleto[count($nombreCompleto) - 2];

                    $segundoap = $nombreCompleto[count($nombreCompleto) - 1];
                    $segundoApellidoIndex = 2;

                }

                if(count($nombreCompleto) > $segundoApellidoIndex){
                    if(in_array($nombreCompleto[count($nombreCompleto) - $segundoApellidoIndex - 1], $articulos)){
                        if(in_array($nombreCompleto[count($nombreCompleto) - $segundoApellidoIndex - 2], $articulos)){
                            $primerap = $nombreCompleto[count($nombreCompleto) - $segundoApellidoIndex - 2] . ' ' . $nombreCompleto[count($nombreCompleto) - $segundoApellidoIndex - 1] . ' ' .$nombreCompleto[count($nombreCompleto) - $segundoApellidoIndex];
                            $nombreIndex = $segundoApellidoIndex + 2;
                        }else{
                            $primerap =$nombreCompleto[count($nombreCompleto) - $segundoApellidoIndex - 1] . ' ' .$nombreCompleto[count($nombreCompleto) - $segundoApellidoIndex];
                            $nombreIndex = $segundoApellidoIndex + 1;
                        }
                    }else{
                        $primerap = $nombreCompleto[count($nombreCompleto) - $segundoApellidoIndex];
                        $nombreIndex = $segundoApellidoIndex;
                    }
                }

                $i = 0;
                $nombr = "";
                if(count($nombreCompleto) - $nombreIndex >= 0){
                    while($i < count($nombreCompleto) - $nombreIndex){
                        $nombr = $nombr . ' ' .$nombreCompleto[$i];
                        $i++;
                    }
                }
                $nom = trim($nombr);
                //$primerap = $nombreCompleto[count($nombreCompleto) - 1];
                //$segundoap = $nombreCompleto[count($nombreCompleto) - 2];
                //$nom = trim(str_replace($primerap, "", $nombre));
                //$nom = trim(str_replace($segundoap, "", $nom));
            }else{
                $segundoApellidoIndex = 0;
                $nombreIndex = 0;
                if(in_array($nombreCompleto[0], $articulos)){
                    if(in_array($nombreCompleto[1], $articulos)){
                        //el apellido tiene 2 articulos
                        $primerap = $nombreCompleto[0] . ' ' . $nombreCompleto[1] . ' ' . $nombreCompleto[2];
                        $segundoApellidoIndex =3;
                    }else{
                        //Tiene un articulo
                        $primerap = $nombreCompleto[0] . ' ' . $nombreCompleto[1];
                        $segundoApellidoIndex = 2;
                    }
                }else{
                    //Ningun articulo
                    $primerap = $nombreCompleto[0];
                    $segundoApellidoIndex = 1;

                }

                if(count($nombreCompleto) > $segundoApellidoIndex){
                    if(in_array($nombreCompleto[$segundoApellidoIndex], $articulos)){
                        if(in_array($nombreCompleto[$segundoApellidoIndex + 1], $articulos)){
                            $segundoap = $nombreCompleto[$segundoApellidoIndex] . ' ' . $nombreCompleto[$segundoApellidoIndex + 1] . ' ' .$nombreCompleto[$segundoApellidoIndex + 2];
                            $nombreIndex = $segundoApellidoIndex + 3;
                        }else{
                            $segundoap =$nombreCompleto[$segundoApellidoIndex] . ' ' .$nombreCompleto[$segundoApellidoIndex + 1];
                            $nombreIndex = $segundoApellidoIndex + 2;
                        }
                    }else{
                        $segundoap = $nombreCompleto[$segundoApellidoIndex];
                        $nombreIndex = $segundoApellidoIndex + 1;
                    }
                }

                $i = $nombreIndex;
                $nombr = "";
                while($i < count($nombreCompleto)){
                    $nombr = $nombr .  ' ' . $nombreCompleto[$i];
                    $i++;
                }
                $nom = trim($nombr);

                //$primerap = $nombreCompleto[count($nombreCompleto) - 1];
                //$segundoap = $nombreCompleto[count($nombreCompleto) - 2];
                //$nom = trim(str_replace($primerap, "", $nombre));
                //$nom = trim(str_replace($segundoap, "", $nom));
            }
        }
        else if(count($nombreCompleto) == 2){
            $primerap = $nombreCompleto[count($nombreCompleto) - 1];
            $nom = trim(str_replace($primerap, "", $nombre));
        }
        else{
            $nom = $nombreCompleto[0];
        }
        return [$nom, $primerap, $segundoap];
    }
    ///Nombre de la materia, Dia (Lunes, Martes, etc.), Hora inicio (formato 24hrs), Hora fin (formato 24hrs)
    
    //Se agrego la variable formato para identificar el formato de los nombres de alumnos (ej. Nombre Apellidos o Apellidos Nombre)
    function ImportAlumnos($alumnos, $formato){
        $errores = [];
        $sinerrores = [];
        for($i = 0; $i < count($alumnos); $i++){
            $alumno = $alumnos[$i];
            $matricula = trim($alumno[0]); ///Matricula
            $nom = trim(strtoupper($alumno[1]));
            $nombreCompleto = GetNombreCompleto($nom, $formato); ///Nombre completo del alumno
            $nombre = $nombreCompleto[0]; ///Nombre
            $primerap = $nombreCompleto[1]; ///Primer ap
            $segundoap = $nombreCompleto[2]; ///Segundo ap
            $correo = "";
            $perfil = 4;
            if(MatriculaExistente($matricula)){
                $errores[] = "La matrícula " . $matricula . " ya se encuentra registrada, verificar información del alumno " . $nom;
                UpdateNombre($matricula, $nombre, $primerap, $segundoap);
            }
            else{
                if(!AddAlumno($matricula, $nombre, $primerap, $segundoap, $correo, $perfil)){
                    $errores[] = "Error al agregar alumno " . $nom . " con la matrícula " . $matricula;
                }
                else{
                    $sinerrores[] = "Se agregó el alumno " . $nom . " con la matrícula " . $matricula;
                }
            }
        }
        $final[] = "Se guardaron " . count($sinerrores) . " de " . (count($errores) + count($sinerrores));
        return array_merge($final, array_merge($errores, $sinerrores));
    }
    function GetUsuarioPorMatricula($matricula){
        $mysqli = getConnection();
        $stmt = $mysqli->prepare("call GetUsuarioMatricula(?)");
        $stmt->bind_param("i", $matricula);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();
        $mysqli->close();
        $usuario = null;
        if($result->num_rows > 0){
            while($row = $result->fetch_assoc()){
                $usuario = $row;
                break;
            }
        }
        return $usuario;
    }
    function UpdateNombre($matricula, $nombre, $primerap, $segundoap){

        $usuario = GetUsuarioPorMatricula($matricula);
        
        $mysqli = getConnection();
        $stmt = $mysqli->prepare("call ActualizarNombreUsuario(?,?,?,?)");
        $stmt->bind_param("isss", $usuario["Id"], $nombre, $primerap, $segundoap);
        $success = $stmt->execute();
        $stmt->close();
        $mysqli->close();
        return $success;
    }
?>