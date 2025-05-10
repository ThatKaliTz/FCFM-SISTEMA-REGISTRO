<?php
http_response_code(404);
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error 404 - Página no encontrada</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <div id="wrapper" class="main-wrapper theme09">
        <div class="main-form">
            <div id="login">
                <div class="card-wrapper">
                    <div class="card-container">
                        <div class="card-header text-center">
                            <div class="col-md-12">
                            <h1>Error 404</h1>
                            <h3>Página no encontrada</h3>
                            <hr style="opacity: 0.3" class="bg-white mt-4">                        
                        </div>
                        </div>
                        <div class="card-body">
                            <div class="padder">
                                <div class="grid">
                                    <div class="error-container">
                                        <h5>Lo sentimos, la página que buscas no existe o ha sido movida.</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer">
                            <button id="btnInicio" class="wave">Ir al inicio</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script type="module" src="error.js"></script>
    <script type="module" src="ind.js"></script>
</body>
</html>