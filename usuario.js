import {
  initializeApp,
  inputFilter,
  showMessage,
  showYesNoMessage,
  makeRequest,
  createModal,
  loadFile,
  showFormatMessage
} from './utility.js'
import { fillUsuariosEncargados } from './main.js'

const mat = document.getElementById('matricula')
const mmat = document.getElementById('mmatricula')
const mper = document.getElementById('mperfil')
const per = document.getElementById('perfil')
const alumnoGuardar = document.getElementById('AlumnoGuardar')
const alumnoBanear = document.getElementById('AlumnoBaneo')
const alumnoDesbanear = document.getElementById('AlumnoDesbaneo')
const buscarAlumnos = document.getElementById('BuscarAlumnos')
const agregarAlumnos = document.getElementById('AgregarAlumnos')
const btnBuscarAlumno = document.getElementById('btnBuscarAlumno')
const importarAlumnos = document.getElementById('ImportarAlumnos')
const mgmmaestro = document.getElementById('mgmmaestro')

// load
const init = () => {
  inputFilter(mat, value => /^\d*$/.test(value))
  inputFilter(mmat, value => /^\d*$/.test(value))
  fillPerfil(mper, false)
  fillPerfil(per, false)
  fillUsuariosEncargados(mgmmaestro, false)

  alumnoGuardar.onclick = addEditAlumno
  alumnoBanear.onclick = banAlumno
  alumnoDesbanear.onclick = desbanAlumno

  setTimeout(() => {
    queryAlumnos()
  }, 100)

  buscarAlumnos.onclick = queryAlumnos
  agregarAlumnos.onclick = () => prepareAlumno(null, null)
  btnBuscarAlumno.onclick = queryBuscarAlumno
  importarAlumnos.onclick = importAlumnos
}

window.addEventListener('load', init, true)

const fillPerfil = async (item, hasAll) => {
  const nombre = ''
  const response = await makeRequest('perfilescontroller.php', {
    type: 'Query',
    ...{
      nombre
    }
  })
  if (response.data.length > 0) {
    let html = hasAll ? "<option value='T' selected>TODAS</option>" : ''
    response.data.forEach(
      x => (html += `<option value='${x.Id}'>${x.Nombre}</option>`)
    )
    item.innerHTML = html
  }
}

/// PREPARA EL MODAL PARA AGREGAR/EDITAR UN ALUMNO
const prepareAlumno = (Id, alumno) => {
  const tieneId = Id && Id > 0
  const modalAlumno = document.getElementById('ModalAlumno')
  if (modalAlumno) {
    modalAlumno.open = true
    modalAlumno.querySelector("[slot='title']").innerText = tieneId
      ? 'EDITAR'
      : 'AGREGAR'
    const mid = document.getElementById('mid')
    const matricula = document.getElementById('mmatricula')
    const nombre = document.getElementById('mnombre')
    const primerap = document.getElementById('mprimerap')
    const segundoap = document.getElementById('msegundoap')
    const correo = document.getElementById('mcorreo')
    const perfil = document.getElementById('mperfil')
    if (
      mid &&
      matricula &&
      nombre &&
      primerap &&
      segundoap &&
      correo &&
      perfil &&
      alumno
    ) {
      mid.value = Id
      matricula.value = alumno.Matricula
      matricula.setAttribute('disabled', true)
      nombre.value = alumno.Nombre
      primerap.value = alumno.ApPaterno
      segundoap.value = alumno.ApMaterno
      correo.value = alumno.Correo
      perfil.value = alumno.PerfilId
    } else {
      matricula.removeAttribute('disabled')
    }
    modalAlumno.onClose = () => {
      mid.value = ''
      matricula.value = ''
      nombre.value = ''
      primerap.value = ''
      segundoap.value = ''
      correo.value = ''
      perfil.value = '4'
    }
  }
}


const baneoAlumno = (Id) => {
  const modalAlumno = document.getElementById('ModalAlumnoBaneo')
  if (modalAlumno) {
    modalAlumno.open = true
    modalAlumno.querySelector("[slot='title']").innerText = "Banear";
    const mid = document.getElementById('midBaneo')
    const mmotivobaneo = document.getElementById('mmotivobaneo')
    if (
      mid
    ) {
      mid.value = Id
    }
    else {
      matricula.removeAttribute('disabled')
    }
    modalAlumno.onClose = () => {
      mid.value = '',
      mmotivobaneo = ''
    }
  }
}

const desbaneoAlumno = (Id) => {
  const modalAlumno = document.getElementById('ModalAlumnoDesbaneo')
  if (modalAlumno) {
    modalAlumno.open = true
    modalAlumno.querySelector("[slot='title']").innerText = "Desbanear";
    const mid = document.getElementById('midDesbaneo')
    const mmotivobaneo = document.getElementById('mmotivodesbaneo')
    if (
      mid
    ) {
      mid.value = Id
    }
    else {
      matricula.removeAttribute('disabled')
    }
    modalAlumno.onClose = () => {
      mid.value = '',
      mmotivobaneo = ''
    }
  }
}

let usuario_logeado = $('#usuario_logeado').val()

/// ELIMINA UN ALUMNO
const deleteAlumno = async id => {
  const res = await showYesNoMessage(
    'Alumnos',
    'ELIMINAR',
    '¿Esta seguro de querer eliminar el registro?',
    'sm'
  )
  if (res) {
    const modal = createModal(
      'Alumnos',
      'ELIMINANDO...',
      'Espere...',
      'sm',
      false
    )
    modal.open = true
    const response = await makeRequest('alumnoscontroller.php', {
      type: 'Delete',
      ...{
        id
      }
    })
    modal.open = false
    setTimeout(() => {
      modal.remove()
    }, 10)
    if (response.error) {
      await showMessage('Alumnos', 'Error', response.data, true)
    } else {
      await showMessage('Alumnos', 'ELIMINAR', response.data, true)
      await queryAlumnos()
    }
  }
}
/// EJECUTA LA BUSQUEDA DE ALUMNOS
const queryAlumnos = async () => {
  const resultadoAlumnos = document.getElementById('ResultadoAlumnos')
  let matricula = document.getElementById('matricula')
  let nombre = document.getElementById('nombre')
  let primerap = document.getElementById('primerap')
  let segundoap = document.getElementById('segundoap')
  let perfil = document.getElementById('perfil')
  let estatus = document.getElementById('estatus')
  let baneados = document.getElementById('baneados')

  if (resultadoAlumnos && matricula && nombre && primerap && segundoap && perfil && estatus && baneados) {
    matricula = matricula.value.trim()
    nombre = nombre.value.trim()
    primerap = primerap.value.trim()
    segundoap = segundoap.value.trim()
    perfil = perfil.value.trim()
    estatus = estatus.value.trim()
    baneados = baneados.value.trim()

    const modal = createModal(
      'Alumnos',
      'BUSCANDO...',
      'Espere...',
      'sm',
      false
    )
    modal.open = true
    const response = await makeRequest('alumnoscontroller.php', {
      type: 'Query',
      ...{
        matricula,
        nombre,
        primerap,
        segundoap,
        perfil,
        estatus,
        baneados
      }
    })
    modal.open = false
    setTimeout(() => {
      modal.remove()
    }, 10)
    if (response.error) {
      await showMessage('Alumnos', 'Error', response.data, true)
    } else {
      resultadoAlumnos.innerHTML = ''
      if (response.data.length > 0) {
        response.data.forEach(x => {
          const tr = document.createElement('tr')
          const tdeditar = document.createElement('td')
          const banBtn = document.createElement('span')
          const desbanBtn = document.createElement('span')

          if (baneados == 0) {
            banBtn.className = 'icon-block'
            banBtn.setAttribute('title', 'Banear')
          }
          else {
            desbanBtn.className = 'icon-check'
            desbanBtn.setAttribute('title', 'Desbanear')
          }

          const deleteBtn = document.createElement('span')
          deleteBtn.className = 'icon-delete_outline'
          deleteBtn.setAttribute('title', 'Eliminar')
          const editBtn = document.createElement('span')
          editBtn.className = 'icon-create'
          editBtn.setAttribute('title', 'Editar')
          const passBtn = document.createElement('span')
          passBtn.className = 'icon-history'
          passBtn.setAttribute('title', 'Cambiar contraseña')


          //   console.log(usuario_logeado)
          if (x.Id > 1 || usuario_logeado == 1) {
            tdeditar.appendChild(deleteBtn)
            tdeditar.appendChild(editBtn)
            tdeditar.appendChild(passBtn)
            tdeditar.appendChild(banBtn)
            tdeditar.appendChild(desbanBtn)
          }
          const tdmatricula = document.createElement('td')
          tdmatricula.innerText = x.Matricula
          const tdnombre = document.createElement('td')
          tdnombre.innerText = `${x.Nombre} ${x.ApPaterno} ${x.ApMaterno}`
          const tdcorreo = document.createElement('td')
          tdcorreo.innerText = x.Correo
          const tdestatus = document.createElement('td')
          tdestatus.innerText = x.activo == '1' ? 'Activo' : 'Inactivo'
          const tdbaneado = document.createElement('td')
          tdbaneado.innerText = x.baneado == '1' ? 'Baneado' : 'No baneado'
          const tdmotivo = document.createElement('td')
          tdmotivo.innerText = x.motivoBaneo ? x.motivoBaneo : 'No hay baneo para este usuario'
          tr.appendChild(tdeditar)
          tr.appendChild(tdmatricula)
          tr.appendChild(tdnombre)
          tr.appendChild(tdcorreo)
          tr.appendChild(tdestatus)
          tr.appendChild(tdbaneado)
          tr.appendChild(tdmotivo)
          resultadoAlumnos.appendChild(tr)
          deleteBtn.onclick = () => deleteAlumno(x.Id)
          banBtn.onclick = () => baneoAlumno(x.Id)
          desbanBtn.onclick = () => desbaneoAlumno(x.Id)
          editBtn.onclick = () => prepareAlumno(x.Id, x)
          passBtn.onclick = () => restaurarContraseñaAlumno(x.Id, x.Matricula)
        })
      }
    }
  }
}

/// EJECUTA LA BUSQUEDA DE ALUMNO ESPECIFICO
const queryBuscarAlumno = async () => {
  const resultadoAlumnos = document.getElementById('ResultadoBuscarAlumno')
  let matricula = document.getElementById('mgBuscarMatricula')
  let nombre = document.getElementById('mgBuscarNombre')
  let primerap = document.getElementById('mgBuscarApPaterno')
  let segundoap = document.getElementById('mgBuscarApMaterno')
  let perfil = '4'

  btnBuscarAlumno.disabled = true

  if (resultadoAlumnos && matricula && nombre && primerap && segundoap) {
    matricula = matricula.value.trim()
    nombre = nombre.value.trim()
    primerap = primerap.value.trim()
    segundoap = segundoap.value.trim()

    const response = await makeRequest('alumnoscontroller.php', {
      type: 'Query',
      ...{
        matricula,
        nombre,
        primerap,
        segundoap,
        perfil
      }
    })

    if (response.error) {
      btnBuscarAlumno.disabled = false
      await showMessage('Alumnos', 'Error', response.data, true)
    } else {
      resultadoAlumnos.innerHTML = ''
      if (response.data.length > 0) {
        response.data.forEach(x => {
          // fila
          const tr = document.createElement('tr')

          // col matricula
          const tdmatricula = document.createElement('td')
          tdmatricula.innerText = x.Matricula

          // col nombre
          const tdnombre = document.createElement('td')
          tdnombre.innerText = `${x.Nombre} ${x.ApPaterno} ${x.ApMaterno}`

          // col correo
          const tdcorreo = document.createElement('td')
          tdcorreo.innerText = x.Correo

          tr.appendChild(tdmatricula)
          tr.appendChild(tdnombre)
          tr.appendChild(tdcorreo)

          tr.onclick = () => selectAlumno(x)

          resultadoAlumnos.appendChild(tr)
        })

        btnBuscarAlumno.disabled = false
      } else {
        btnBuscarAlumno.disabled = false
      }
    }
  }
}
/// AGREGA/EDITA UN ALUMNO
const addEditAlumno = async () => {
  let id = document.getElementById('mid')
  let matricula = document.getElementById('mmatricula')
  let nombre = document.getElementById('mnombre')
  let primerap = document.getElementById('mprimerap')
  let segundoap = document.getElementById('msegundoap')
  let correo = document.getElementById('mcorreo')
  let perfil = document.getElementById('mperfil')
  const modalAlumno = document.getElementById('ModalAlumno')
  if (
    id &&
    matricula &&
    nombre &&
    primerap &&
    segundoap &&
    correo &&
    perfil &&
    modalAlumno
  ) {
    id = id.value.trim()
    matricula = matricula.value.trim()
    nombre = nombre.value.trim()
    primerap = primerap.value.trim()
    segundoap = segundoap.value.trim()
    correo = correo.value.trim()
    perfil = perfil.value.trim()
    const tieneId = id.length > 0
    let msgError = []
    if (matricula.length <= 0) {
      msgError.push('El alumno debe de contar con matrícula')
    }
    if (nombre.length <= 0) {
      msgError.push('El alumno debe contar con nombre')
    }
    if (primerap.length <= 0) {
      msgError.push('El alumno debe contar con el primer apellido')
    }
    if (perfil.length <= 0) {
      msgError.push('El alumno debe contar con un perfil')
    }
    if (msgError.length > 0) {
      await showMessage('Alumnos', 'Error', msgError, true)
      return
    }
    const modal = createModal(
      'Alumnos',
      'GUARDANDO...',
      'Espere...',
      'sm',
      false
    )
    modal.open = true
    const response = await makeRequest('alumnoscontroller.php', {
      type: tieneId ? 'Edit' : 'Add',
      ...{
        id,
        matricula,
        nombre,
        primerap,
        segundoap,
        correo,
        perfil
      }
    })
    modal.open = false
    setTimeout(() => {
      modal.remove()
    }, 10)
    if (response.error) {
      await showMessage('Alumnos', 'Error', response.data, true)
    } else {
      await showMessage('Alumnos', 'GUARDAR', response.data, true)
      await queryAlumnos()
    }
    modalAlumno.open = false
  }
}


const banAlumno = async () => {
  let id = document.getElementById('midBaneo')
  let mmotivobaneo = document.getElementById('mmotivobaneo')
  const modalAlumno = document.getElementById('ModalAlumnoBaneo')
  if (
    id &&
    mmotivobaneo &&
    modalAlumno
  ) {
    id = id.value.trim()
    mmotivobaneo = mmotivobaneo.value.trim()
    let msgError = []
    if (mmotivobaneo.length <= 0) {
      msgError.push('El baneo debe de contener un motivo')
    }
    if (msgError.length > 0) {
      await showMessage('Alumnos', 'Error', msgError, true)
      return
    }
    const modal = createModal(
      'Alumnos',
      'Baneando...',
      'Espere...',
      'sm',
      false
    )
    modal.open = true
    const response = await makeRequest('alumnoscontroller.php', {
      type: 'Ban',
      ...{
        id,
        mmotivobaneo,
      }
    })
    modal.open = false
    setTimeout(() => {
      modal.remove()
    }, 10)
    if (response.error) {
      await showMessage('Alumnos', 'Error', response.data, true)
    } else {
      await showMessage('Alumnos', 'GUARDAR', response.data, true)
      await queryAlumnos()
    }
    modalAlumno.open = false
  }
}


const desbanAlumno = async () => {
  let id = document.getElementById('midDesbaneo')
  let mmotivodesbaneo = document.getElementById('mmotivodesbaneo')
  const modalAlumno = document.getElementById('ModalAlumnoDesbaneo')
  if (
    id &&
    mmotivodesbaneo &&
    modalAlumno
  ) {
    id = id.value.trim()
    mmotivodesbaneo = mmotivodesbaneo.value.trim()
    let msgError = []
    if (mmotivodesbaneo.length <= 0) {
      msgError.push('El desbaneo debe de contener un motivo')
    }
    if (msgError.length > 0) {
      await showMessage('Alumnos', 'Error', msgError, true)
      return
    }
    const modal = createModal(
      'Alumnos',
      'Desbaneando...',
      'Espere...',
      'sm',
      false
    )
    modal.open = true
    const response = await makeRequest('alumnoscontroller.php', {
      type: 'Desban',
      ...{
        id,
        mmotivodesbaneo,
      }
    })
    modal.open = false
    setTimeout(() => {
      modal.remove()
    }, 10)
    if (response.error) {
      await showMessage('Alumnos', 'Error', response.data, true)
    } else {
      await showMessage('Alumnos', 'GUARDAR', response.data, true)
      await queryAlumnos()
    }
    modalAlumno.open = false
  }
}



const selectAlumno = alumno => {
  const mdlFiltroAlumno = document.getElementById('mdlBuscarAlumno')
  let mgalumno = document.getElementById('mgalumno')

  mgalumno.value = alumno.Matricula

  if (mdlFiltroAlumno) {
    mdlFiltroAlumno.open = false
  }
}

const importAlumnos = async () => {
  const res = await showYesNoMessage(
    'Alumnos',
    'IMPORTACIÓN',
    [
      'Para importar es necesario que el archivo contenga el siguiente formato:',
      `
        <br><table>
                <tbody>
                    <tr>
                        <td>Matrícula</td>
                        <td style="text-align: center;">Nombre completo</td>
                    </tr>
                </tbody>
            </table>
        `,
      '<br><center>¿Cumple con los requisitos?</center>'
    ],
    'sm'
  )

  if (!res) return
  const formato = await showFormatMessage('Alumnos', 'sm')
  if (formato == 0) return
  const file = await loadFile(
    false,
    '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
  )
  if (file) {
    const reader = new FileReader()
    reader.onload = async e => {
      const data = e.target.result
      const workbook = XLSX.read(data, {
        type: 'binary'
      })
      if (workbook.SheetNames.length > 0) {
        const sheetName = workbook.SheetNames[0]
        const XLObjects = XLSX.utils.sheet_to_row_object_array(
          workbook.Sheets[sheetName]
        )
        let alumnos = []
        for (let i = 0; i < XLObjects.length; i++) {
          const objValues = Object.values(XLObjects[i])
          if (objValues.length != 2) {
            await showMessage(
              'Alumnos',
              'Error',
              'El numero de campos no concuerda con los pedidos',
              true
            )
            return
          }
          alumnos.push(objValues)
        }
        const modal = createModal(
          'Alumnos',
          'IMPORTANDO...',
          'Espere...',
          'sm',
          false
        )
        modal.open = true
        const response = await makeRequest('alumnoscontroller.php', {
          type: 'Import',
          formato: formato,
          ...{
            alumnos
          }
        })
        modal.open = false
        setTimeout(() => {
          modal.remove()
        }, 10)
        if (response.error) {
          await showMessage('Alumnos', 'IMPORTAR', response.data, true, 'lg')
        } else {
          await showMessage('Alumnos', 'IMPORTAR', response.data, true)
          await queryAlumnos()
        }
      } else {
        await showMessage(
          'Alumnos',
          'Error',
          'El libro no cuenta con hojas',
          true
        )
      }
    }
    reader.onerror = async ex => {
      await showMessage('Alumnos', 'Error', 'Error al leer archivo', true)
    }
    reader.readAsBinaryString(file)
  }
}

const restaurarContraseñaAlumno = async (id, matricula) => {
  const res = await showYesNoMessage(
    'Alumnos',
    'RESTAURAR',
    '¿Esta seguro de querer restaurar la contraseña del alumno?',
    'sm'
  )
  if (res) {
    const modal = createModal(
      'Alumnos',
      'Actualizando...',
      'Espere...',
      'sm',
      false
    )
    modal.open = true
    const response = await makeRequest('alumnoscontroller.php', {
      type: 'Restaurar',
      ...{
        id,
        matricula
      }
    })
    modal.open = false
    setTimeout(() => {
      modal.remove()
    }, 10)
    if (response.error) {
      await showMessage('Alumnos', 'Error', response.data, true)
    } else {
      await showMessage('Alumnos', 'RESTAURAR', response.data, true)
      await queryAlumnos()
    }
  } else {
    const editPassword = await showYesNoMessage(
      'Alumnos',
      'Editar Contraseña',
      '¿Desea editar la contraseña del alumno?',
      'sm'
    )
    if (editPassword) {
      const newPassword = await showInputDialog(
        'Nueva Contraseña',
        'Ingrese la nueva contraseña:',
        true // Input obligatorio
      )
      const confirmPassword = await showInputDialog(
        'Confirmar Contraseña',
        'Confirme la nueva contraseña:',
        true // Input obligatorio
      )

      if (newPassword !== confirmPassword) {
        await showMessage(
          'Alumnos',
          'Error',
          'Las contraseñas no coinciden. Por favor, inténtelo de nuevo.',
          true
        )
        return // Salir de la función si las contraseñas no coinciden
      }

      // Código para editar la contraseña
      const modal = createModal(
        'Alumnos',
        'Actualizando...',
        'Espere...',
        'sm',
        false
      )
      modal.open = true
      const response = await makeRequest('alumnoscontroller.php', {
        type: 'ChangePasswordForOtherUser',
        id,
        contraseña: newPassword
      })
      modal.open = false
      setTimeout(() => {
        modal.remove()
      }, 10)
      if (response.error) {
        await showMessage('Alumnos', 'Error', response.data, true)
      } else {
        await showMessage(
          'Alumnos',
          'Cambio de Contraseña',
          response.data,
          true
        )
        await queryAlumnos()
      }
    } else {
      // Cancelar operación
      await showMessage(
        'Alumnos',
        'Operación Cancelada',
        'La operación ha sido cancelada.',
        true
      )
    }
  }
}

const showInputDialog = (title, message, required) => {
  return new Promise((resolve, reject) => {
    Swal.fire({
      title: title,
      text: message,
      input: 'text',
      inputAttributes: {
        required: required
      },
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      preConfirm: value => {
        if (!value.trim() && required) {
          Swal.showValidationMessage('Este campo es obligatorio')
        } else {
          return value.trim()
        }
      }
    }).then(result => {
      if (result.isConfirmed) {
        resolve(result.value)
      } else {
        reject('Operación cancelada')
      }
    })
  })
}
