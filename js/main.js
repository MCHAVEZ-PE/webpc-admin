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
    getIdCuenta = null,
    logoff = null,
    buscarEnTabla = null,
    getData = null;
$("document").ready(function () {
    var idCuenta;

    formaterFecha = function (date) {
        // 2020-05-16 23:44:55
        var data = date.split(" ");
        var dia = data[0].split("-");

        return dia[0] + "/" + dia[1] + "/" + dia[2] + " " + data[1];
    }

    function getCellValue(tr, idx) {
        return tr.children[idx].innerText || tr.children[idx].textContent;
    }
    logoff = function () {
        console.log("saliste");
        // en observacion

        var data = new FormData();
        data.append("logoff", "1");
        var obj = {
            method: 'POST',
            body: data
        };
        post(URL + "/Login", obj)
            .then(function (response) {
                console.log(response);
                if (response.mensaje == "Session Cerrada") {
                    console.log("saliste")
                    window.location.href = window.location.origin + "/Login";
                } else {
                    console.log("sigues en la session ")

                }
            })
    }

    function comparer(idx, asc) {
        return function (a, b) {
            return function (v1, v2) {
                return v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2);
            }(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));
        }
    };
    document.querySelectorAll("th").forEach(function (th) {
        th.addEventListener("click", function () {
            // tbody
            const table = th.closest("table").children[1];
            console.log(th.parentNode.children)
            // get trs
            Array.from(table.querySelectorAll('tr:nth-child(n)'))

                .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
                .forEach(tr => table.appendChild(tr));


        })
    })
    if (window.location.pathname == "/admin/Login" || window.location.pathname == "/") {
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
                        window.location.href = window.location.origin + "/ListarOperaciones";
                    }
                })
        }
    }
    if (window.location.pathname == "/admin/ListarOperaciones") {
        activarOperacion = function (event) {
            document.getElementById("bg-spinner").style.visibility = "visible"
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
                    listarOperaciones();
                    document.getElementById("bg-spinner").style.visibility = "hidden"
                })
        }
        eliminarOperacion = function (event) {
            var id = JSON.parse(sessionStorage.getItem("ID"));
            console.log(id.correo);

            document.getElementById("bg-spinner").style.visibility = "visible"
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
                    sessionStorage.removeItem("ID");

                    listarOperaciones();

                    document.getElementById("bg-spinner").style.visibility = "hidden"
                })
        }
        listarOperaciones = function () {
            var obj = {
                method: 'POST'
                // body:form
            }
            $("#tbody").empty();
            post(URL + "/Admin", obj)
                .then(function (response) {
                    console.log(response)
                    if (response.mensaje == "No hay elementos registrados") {
                        console.log(response.mensaje);
                    } else {

                        var data = response;
                        var tbody = document.getElementById("tbody");
                        // get count of data  and loop

                        // for (let i = 0; i < data.length; i++) {
                        //     const element = array[i];
                            
                        // }

                        data.forEach(function (element) {
                            var tr = document.createElement("tr");
                            tr.setAttribute("id", element.idOperaciones);
                            tr.insertCell(0).innerText = element.idOperaciones;       
                            tr.insertCell(1).innerText = element.tipo;
                            tr.insertCell(2).innerText = element.usuario;
                            tr.insertCell(3).innerText = formaterFecha(element.feOperacion);
                            tr.insertCell(4).innerText = element.correo;
                            tr.insertCell(5).innerText = element.telefono;
                            tr.insertCell(6).innerText = element.nuCuenta;
                            tr.insertCell(7).innerText = element.numeroCuenta;
                            tr.insertCell(8).innerText = element.tc;
                            tr.insertCell(9).innerText = element.notificaciones;
                            tr.insertCell(10).innerText = element.montoEnviado;
                            tr.insertCell(11).innerText = element.montoRecivido;
                            tr.insertCell(12).innerText = element.cci;
                            tr.insertCell(13).innerHTML = `<div class='d-flex'>
                    <a title='Activar Operacion'  onclick='activarOperacion(this);'  class="btn btn-light"><i class="fa fa-retweet" aria-hidden="true"></i></a>
                    <a  title='Eliminar Cuenta' data-toggle='modal' data-target='#alertaEliminacion' onclick='getIdCuenta(this);' class="btn btn-light"><i class="fa fa-trash-o"
                    aria-hidden="true"></i></a>
                    </div>`;
                            tbody.appendChild(tr);
                        })
                    }
                    // var lista = tbody.getElementsByTagName("tr").length;
                    //pagination
                    // var redire = Math.ceil(lista / 5);
                    // console.log(lista);

                    // for (let i = 0; i < redire.length; i++) {
                        // const element = array[i];

                    // }
                })

        }
        listarOperaciones();
    }
    if (window.location.pathname == "/admin/Empresa") {
        listarCuentas = function () {
            $("#tbody").empty();
            get(URL + "/CuentaEmpresa")
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
        getData = function () {
            var banco = document.getElementById("selectBaco");
            get(URL + "/Banco")
                .then(function (response) {
                    console.log(response)
                    var data = response;

                    data.map((element) => {
                        var options = document.createElement("option");
                        options.value = element.coBanco;
                        options.appendChild(document.createTextNode(element.nombre));
                        banco.appendChild(options);

                    })
                })
        }
        getData();
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
            post(URL + "/CuentaEmpresa", obj)
                .then(function (response) {
                    console.log(response)
                    alert(response.mensaje)
                    listarCuentas();
                })
            limpiarCampos();
        }
        eliminarCuenta = function (event) {
            document.getElementById("bg-spinner").style.visibility = "visible";

            var id = JSON.parse(sessionStorage.getItem("ID"));
            var form = new FormData();
            $("#tbody").empty();
            form.append("idEliminar", id.id);
            obj = {
                method: 'POST',
                body: form
            }
            post(URL + "/CuentaEmpresa", obj)
                .then(function (response) {
                    console.log(response)
                    // alert(response.mensaje)
                    $('#alertaEliminacion').modal('hide');
                    listarCuentas();
                    sessionStorage.removeItem("ID");
                    document.getElementById("bg-spinner").style.visibility = "hidden"

                })
        }
        editarCuenta = function (e) {

            document.getElementById("bg-spinner").style.visibility = "visible"
            var bank = null;
            flag = true;
            // debugger;
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
            post(URL + "/CuentaEmpresa", obj)
                .then(function (response) {
                    console.log(response);
                    var data = response;

                    // document.getElementById("alias").value = data.alias;
                    document.getElementById("selectMoneda").value = data.moneda;
                    switch (data.noCuenta) {
                        case "BCP":
                            bank = "1"
                            break;
                        case "Interbank":
                            bank = "2"
                            break;
                        case "Scotiabank":
                            bank = "3"
                            break;
                    }
                    document.getElementById("selectBaco").value = bank;

                    document.getElementById("nCuenta").value = data.nuCuenta;
                    document.getElementById("CCI").value = data.cciEmpresa;
                    // debugger;
                    // selectDepartamento(data.coDepartamento);
                    document.getElementById("bg-spinner").style.visibility = "hidden"
                    // flag = false;
                    // idCuenta = null;

                })

        }
        limpiarCampos = function () {
            document.getElementById("selectMoneda").children[0].selected = true;
            document.getElementById("selectBaco").children[0].selected = true;
            document.getElementById("nCuenta").value = "";
            document.getElementById("CCI").value = "";
            document.getElementById("subidaimg") = "";
            document.getElementById("subidaimg").value = "";
        }
        subirImagen = function () {
            var img = document.getElementById("subidaimg");
            // console.log(img.files[0])
            // debugger;
            var form = new FormData();
            form.append("SubirImg", 1);
            form.append("Imagen", img.files[0]);
            if (img.files.length >= 1) {

                var obj = {
                    method: 'POST',
                    body: form
                }
                post(URL + "/Admin", obj)
                    .then(function (response) {
                        console.log(response)
                        alert(response.mensaje);
                      limpiarCampos();
                    })
            }
            else{
                alert("Por favor agregar una imagen")
            }
        }

    }
    if (window.location.pathname == "/Promociones") {
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

                })
        }
        guardarPromocion = function () {

            var precio = document.getElementById("precio").value;

            var descripcion = document.getElementById("descripcion").value;
            debugger;
            if (idCuenta == null || idCuenta == undefined) {
                alert("No se ha actualizado ninguna información");
                return;
            }
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
                    alert(response.mensaje);
                    limpiarCampos();
                    listarPromociones();

                    $("#nav-addnewAccount").removeClass("active");
                    $("#nav-profile-tab").removeClass("active")
                    $("#nav-listAccount").addClass("active show");
                    $("#nav-listAccount-tab").addClass("active show");
                    // debugger;
                    idCuenta = null;
                })
        }
        limpiarCampos = function () {
            $("#precio").val("");
            $("#descripcion").val("");
        }
    }
    getIdCuenta = function (e) {
        var obj = {};
        var id = e.parentElement.parentElement.parentElement.getAttribute("id");
        if (document.title == "Lista de Operaciones") {
            var correo = e.parentElement.parentElement.parentElement.children[2].innerText;
            obj.correo = correo;
        }
        //  console.log(correo);
        obj.id = id;

        sessionStorage.setItem("ID", JSON.stringify(obj));
    }
    buscarEnTabla = function () {
        var entrada = document.getElementById("entrada").value;
        var tbody = document.getElementById("dataTable").children[1];
        var trs = tbody.getElementsByTagName("tr");
        var cell;
        for (let i = 0; i < trs.length; i++) {
            trs[i].style.display = 'none';
            var tds = trs[i].getElementsByTagName("td");
            for (let j = 0; j < tds.length; j++) {
                cell = tds[j];
                if (cell.innerText.toUpperCase().indexOf(entrada.toUpperCase()) > -1) {
                    trs[i].style.display = '';
                    break;
                }

            }

        }

    }
})