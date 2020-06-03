var URL = "http://localhost/webapi";
listarOperaciones = null,
    formaterFecha = null,
    activarOperacion = null,
    eliminarOperacion = null,
    listarCuentas = null,
    editarCuenta = null,
    limpiarCampos = null,
    editarPromocion = null,
    guardarPromocion = null,
    flag = false,
    login = null,
    subirImagen = null,
    getIdCuenta = null;
$("document").ready(function () {
    var idCuenta;

    formaterFecha = function (date) {
        // 2020-05-16 23:44:55
        var data = date.split(" ");
        var dia = data[0].split("-");

        return dia[0] + "/" + dia[1] + "/" + dia[2] + " " + data[1];
    }
    if (window.location.pathname == "/Login.html") {
        login = function () {
            var user = document.getElementById("usuario").value;
            var pssw = document.getElementById("password").value;
            var form = new FormData();
            form.append("Usuario", user);
            form.append("Clave", pssw);
            var obj = {
                method: 'POST',
                body: form
            }
            post(URL + "/Admin", obj)
                .then(function (response) {
                    console.log(response)
                    if (response.usuario == "admin") {
                        window.location.href = window.location.origin + "/ListarOperaciones.html"
                    }
                })
        }
    }
    if (window.location.pathname == "/ListarOperaciones.html") {
        activarOperacion = function (event) {
            // debugger;
            var id = event.parentElement.parentElement.parentElement.getAttribute("id");
            var form = new FormData();
            form.append("Id", id);
            obj = {
                method: 'POST',
                body: form
            }
            post(URL + "/Admin", obj)
                .then(function (response) {
                    console.log(response)
                    document.getElementById("modalMensaje").innerText = response.mensaje;
                    $('#alertaModificacion').modal('show');
                    // alert(response.mensaje)
                })
        }
        eliminarOperacion = function (event) {
            var id = JSON.parse(sessionStorage.getItem("ID"));
            console.log(id.correo);  
            
            var form = new FormData();
            form.append("DeleteOperacion", id.id);
            form.append("Correo", id.correo);
            obj = {
                method: 'POST',
                body: form
            }
            post(URL + "/Admin", obj)
                .then(function (response) {
                    console.log(response)
                    $("#alertaEliminacion").modal('hide');
                    sessionStorage.removeItem("ID")
                    
                })
        }
        listarOperaciones = function () {
            var obj = {
                method: 'POST'
                // body:form
            }
            post(URL + "/Admin", obj)
                .then(function (response) {
                    if (response.mensaje == "No hay elementos registrados") {
                        console.log(response)
                    } else {

                        var data = response;
                        var tbody = document.getElementById("tbody");

                        data.forEach(function (element) {
                            var tr = document.createElement("tr");
                            tr.setAttribute("id", element.idOperaciones);
                            tr.insertCell(0).innerText = element.usuario;
                            tr.insertCell(1).innerText = element.telefono;
                            tr.insertCell(2).innerText = element.correo;
                            
                            tr.insertCell(3).innerText = formaterFecha(element.feOperacion);
                            tr.insertCell(4).innerText = element.nuCuenta;
                            tr.insertCell(5).innerText = element.numeroCuenta;
                            tr.insertCell(6).innerText = element.tc;
                            tr.insertCell(7).innerText = element.notificaciones;
                            tr.insertCell(8).innerText = element.montoEnviado;
                            tr.insertCell(9).innerText = element.montoRecivido;
                            tr.insertCell(10).innerText = element.cci;
                            tr.insertCell(11).innerHTML = `<div class='d-flex'>
                    <a title='Activar Operacion'  onclick='activarOperacion(this);'  class="btn btn-light"><i class="fa fa-retweet" aria-hidden="true"></i></a>
                    <a  title='Eliminar Cuenta' data-toggle='modal' data-target='#alertaEliminacion' onclick='getIdCuenta(this);' class="btn btn-light"><i class="fa fa-trash-o"
                    aria-hidden="true"></i></a>
                    </div>`;
                            tbody.appendChild(tr);
                        })
                    }
                })

        }
        listarOperaciones();
    }
    if (window.location.pathname == "/Empresa.html") {
        listarCuentas = function () {
            $("#tbody").empty();
            get(URL + "/cuentaEmpresa")
                .then(function (response) {
                    if (response.mensaje == "No hay elementos registrados") {
                        console.log(response)
                    } else {

                        var data = response;
                        var tbody = document.getElementById("tbody");

                        data.forEach(function (element) {
                            var tr = document.createElement("tr");
                            tr.setAttribute("id", element.coCuentaE);
                            tr.insertCell(0).innerText = element.moneda;
                            tr.insertCell(1).innerText = element.noCuenta;
                            tr.insertCell(2).innerText = element.nuCuenta;
                            tr.insertCell(3).innerText = element.cciEmpresa;
                            tr.insertCell(4).innerHTML = `<div class='d-flex'>
                        <a title='Editar Operacion' onclick='editarCuenta(this);' class="btn btn-light"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>
                        <a  title='Eliminar Cuenta'  onclick='getIdCuenta(this);' data-toggle='modal' data-target='#alertaEliminacion'  class="btn btn-light"><i class="fa fa-trash-o"
                        aria-hidden="true"></i></a>
                        </div>`;
                            tbody.appendChild(tr);
                        })
                    }
                })

        }
        listarCuentas();
        guardarCuenta = function () {
            var s1 = document.getElementById("selectMoneda").value;
            var s2 = document.getElementById("selectBaco");
            var s2t = s2.options[s2.selectedIndex].innerText;
            var s3 = document.getElementById("nCuenta").value;
            var s4 = document.getElementById("CCI").value;
            // console.log(s1,s2t,s3,s4);
            var data = new FormData();
            data.append("moneda", s1);
            data.append("noCuenta", s2t);
            data.append("cciEmpresa", s4);

            var obj = {
                method: 'POST',
                body: data
            }
            if (flag) {
                data.append("idCuentaE", idCuenta);
                data.append("nuCuenta1", s3);
            } else {
                data.append("nuCuenta", s3);
            }
            post(URL + "/cuentaEmpresa", obj)
                .then(function (response) {
                    console.log(response)
                    alert(response.mensaje)
                    listarCuentas();
                })
            limpiarCampos();
        }
        eliminarCuenta = function (event) {
            var id = JSON.parse(sessionStorage.getItem("ID"));
            var form = new FormData();
            $("#tbody").empty();
            form.append("idEliminar", id.id);
            obj = {
                method: 'POST',
                body: form
            }
            post(URL + "/cuentaEmpresa", obj)
                .then(function (response) {
                    console.log(response)
                    // alert(response.mensaje)
                    $('#alertaEliminacion').modal('hide');
                    listarCuentas();
                    sessionStorage.removeItem("ID");
                })
        }
        editarCuenta = function (e) {


            flag = true;
            var id = e.parentElement.parentElement.parentElement.getAttribute("id");
            idCuenta = id;
            $("#nav-listAccount-tab").removeClass("active");
            // $("#nav-listAccount-tab").attr("aria-selected", "false");
            $("#nav-listAccount").removeClass("active show");

            $("#nav-profile-tab").addClass("active")
            // $("#nav-profile-tab").attr("aria-selected", "true");
            $("#nav-addnewAccount").addClass("active show");

            var form = new FormData();
            form.append("idCuenta", id);
            var obj = {
                method: 'POST',
                body: form
            }
            post(URL + "/cuentaEmpresa", obj)
                .then(function (response) {
                    console.log(response);
                    var data = response;

                    // document.getElementById("alias").value = data.alias;
                    document.getElementById("selectMoneda").value = data.moneda;

                    document.getElementById("selectBaco").value = data.noCuenta;

                    document.getElementById("nCuenta").value = data.nuCuenta;
                    document.getElementById("CCI").value = data.cciEmpresa;
                    // debugger;
                    // selectDepartamento(data.coDepartamento);
                    flag = false;
                    idCuenta = null;
                })

        }
        limpiarCampos = function () {
            document.getElementById("selectMoneda").children[0].selected = true;
            document.getElementById("selectBaco").children[0].selected = true;
            document.getElementById("nCuenta").value = "";
            document.getElementById("CCI").value = "";
            document.getElementById("subidaimg") = "";
        }
        subirImagen = function () {
            var img = document.getElementById("subidaimg");
            // console.log(img.files[0])
            var form = new FormData();
            form.append("SubirImg", 1);
            form.append("Imagen", img.files[0]);
            if (img.files.files >= 1) {

                var obj = {
                    method: 'POST',
                    body: form
                }
                post(URL + "/Admin", obj)
                    .then(function (response) {
                        console.log(response)
                        alert(response.mensaje);
                        document.getElementById("subidaimg").value = "";
                    })
            }
        }

    }
    if (window.location.pathname == "/Promociones.html") {
        listarPromociones = function () {
            $("#tbody").empty();
            get(URL + "/Admin")
                .then(function (response) {
                    console.log(response)
                    if (response.mensaje == "No hay elementos registrados") {} else {

                        var data = response;
                        var tbody = document.getElementById("tbody");

                        data.forEach(function (element) {
                            var tr = document.createElement("tr");
                            tr.setAttribute("id", element.coPromociones);
                            tr.insertCell(0).innerText = element.nombre;
                            tr.insertCell(1).innerText = element.precio;
                            tr.insertCell(2).innerHTML = `<div class='d-flex'>
                        <a title='Editar Operacion' onclick='editarPromocion(this);' class="btn btn-light"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>
                        <a  title='Eliminar Cuenta' onclick='eliminarPromocion(this);' class="btn btn-light"><i class="fa fa-trash-o"
                        aria-hidden="true"></i></a>
                        </div>`;
                            tbody.appendChild(tr);
                        })
                    }
                })

        }
        listarPromociones();
        editarPromocion = function (e) {
            var id = e.parentElement.parentElement.parentElement.getAttribute("id");
            console.log(id);

            flag = true;
            idCuenta = id;
            $("#nav-listAccount-tab").removeClass("active");
            // $("#nav-listAccount-tab").attr("aria-selected", "false");
            $("#nav-listAccount").removeClass("active show");

            $("#nav-profile-tab").addClass("active")
            // $("#nav-profile-tab").attr("aria-selected", "true");
            $("#nav-addnewAccount").addClass("active show");

            var form = new FormData();
            form.append("idPromocion", id);
            var obj = {
                method: 'POST',
                body: form
            }
            post(URL + "/Promociones", obj)
                .then(function (response) {
                    console.log(response);
                    var data = response;

                    // document.getElementById("alias").value = data.alias;
                    document.getElementById("precio").value = data.precio;

                    document.getElementById("descripcion").value = data.descripcion;
                    // debugger;
                })
        }
        guardarPromocion = function () {

            var precio = document.getElementById("precio").value;

            var descripcion = document.getElementById("descripcion").value;
            var data = new FormData();
            data.append("precio", precio);
            data.append("descripcion", descripcion);
            data.append("coPromocion", idCuenta);
            var obj = {
                method: 'POST',
                body: data
            }
            post(URL + "/Promociones", obj)
                .then(function (response) {
                    // mensaje modificar
                    console.log(response.mensaje);

                    // debugger;
                })
        }
    }
    getIdCuenta = function (e) {
        var obj = {};
        var id = e.parentElement.parentElement.parentElement.getAttribute("id");
        if(document.title =="Lista de Operaciones"){
            var correo= e.parentElement.parentElement.parentElement.children[2].innerText;
            obj.correo = correo;
        }
        //  console.log(correo);
        obj.id=id;

        sessionStorage.setItem("ID", JSON.stringify(obj));
    }
})