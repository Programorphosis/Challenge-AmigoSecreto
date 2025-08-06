// El principal objetivo de este desafío es fortalecer tus habilidades en lógica de programación. Aquí deberás desarrollar la lógica para resolver el problema.

// ========================================
// FUNCIONALIDAD DE LOCALSTORAGE
// ========================================
// Esta aplicación usa localStorage para:
// 1. Guardar nombres cuando se agregan (función: guardarNombresEnLocalStorage)
// 2. Cargar nombres cuando se abre la página (función: cargarNombresDesdeLocalStorage)
// 3. Borrar nombres cuando se reinicia (función: borrarNombresDeLocalStorage)
//
// El localStorage es una API del navegador que permite guardar datos
// de forma persistente en el navegador del usuario.
// ========================================

const nombres = [];
const nombresDisponibles = []; // Lista de nombres disponibles para sorteo
const asignaciones = {}; // Registro de asignaciones realizadas
let isSorting = false;

// Seleccionar elementos HTML una sola vez
const elementos = {
    inputNombre: document.getElementById('amigo'),
    inputSortear: document.getElementById('nombreSortear'),
    listaAmigos: document.getElementById('listaAmigos'),
    resultado: document.getElementById('resultado'),
    toastContainer: document.getElementById('toast-container'),
    botonSortear: document.querySelector('.button-draw'),
    seccionSorteo: document.querySelector('.sorteo-section'),
    inputAgregarParticipante: document.querySelector('.input-section'),
    buttonStartSorteo: document.querySelector('.button-start-sorteo'),
    buttonRestart : document.querySelector('.button-restart'),
    nombresList : document.querySelector('.name-list'),
};




// ========================================
// FUNCIONES DE LOCALSTORAGE
// ========================================

/**
 * Guarda los nombres en localStorage
 * Esta función se ejecuta cada vez que se agrega un nuevo nombre
 */
const guardarNombresEnLocalStorage = () => {
    try {
        // Convertir el array de nombres a JSON y guardarlo en localStorage
        localStorage.setItem('amigoSecretoNombres', JSON.stringify(nombres));
        console.log('✅ Nombres guardados en localStorage:', nombres);
    } catch (error) {
        console.error('❌ Error al guardar nombres en localStorage:', error);
    }
};

/**
 * Carga los nombres desde localStorage
 * Esta función se ejecuta cuando se carga la página
 */
const cargarNombresDesdeLocalStorage = () => {
    try {
        // Obtener los nombres guardados en localStorage
        const nombresGuardados = localStorage.getItem('amigoSecretoNombres');
        
        if (nombresGuardados) {
            // Convertir el JSON de vuelta a array
            const nombresArray = JSON.parse(nombresGuardados);
            
            // Verificar que sea un array válido
            if (Array.isArray(nombresArray)) {
                // Limpiar los arrays actuales
                nombres.length = 0;
                nombresDisponibles.length = 0;
                
                // Agregar cada nombre a los arrays
                nombresArray.forEach(nombre => {
                    nombres.push(nombre);
                    nombresDisponibles.push(nombre);
                });
                
                // Actualizar la lista visual
                actualizarLista();
                
                // Mostrar/ocultar botón de iniciar sorteo según la cantidad de nombres
                if (nombres.length >= 2) {
                    elementos.buttonStartSorteo.style.display = 'block';
                } else {
                    elementos.buttonStartSorteo.style.display = 'none';
                }
                
                console.log('✅ Nombres cargados desde localStorage:', nombres);
                mostrarToast(`Se cargaron ${nombres.length} nombres guardados`, 'info');
            } else {
                console.warn('⚠️ Los datos en localStorage no son un array válido');
            }
        } else {
            console.log('ℹ️ No hay nombres guardados en localStorage');
        }
    } catch (error) {
        console.error('❌ Error al cargar nombres desde localStorage:', error);
        // Si hay error, limpiar localStorage para evitar problemas futuros
        localStorage.removeItem('amigoSecretoNombres');
    }
};

/**
 * Borra los nombres del localStorage
 * Esta función se ejecuta cuando se reinicia el sorteo
 */
const borrarNombresDeLocalStorage = () => {
    try {
        // Remover los nombres del localStorage
        localStorage.removeItem('amigoSecretoNombres');
        console.log('🗑️ Nombres borrados de localStorage');
    } catch (error) {
        console.error('❌ Error al borrar nombres de localStorage:', error);
    }
};

// Función para agregar nombres a la lsta
const agregarAmigo = () => {
    const nombre = elementos.inputNombre.value.trim();
    
    if (!nombre) {
        mostrarToast('Por favor, ingresa un nombre válido.', 'error');
        return;
    }
    
    if (nombres.includes(nombre)) {
        mostrarToast('El nombre ya existe en la lista.', 'error');
        return;
    }
    
    // Agregar nombre a la lista principal
    nombres.push(nombre);
    nombresDisponibles.push(nombre);
    
    // Limpiar input
    elementos.inputNombre.value = '';
    
    // Actualizar lista visual
    actualizarLista();
    
    // Guardar nombres en localStorage después de agregar
    guardarNombresEnLocalStorage();
    
    // Mostrar mensaje de éxito
    mostrarToast(`${nombre.toUpperCase()} agregado exitosamente`, 'success');
    
    // Mostrar/ocultar botón de iniciar sorteo según la cantidad de nombres
    if (nombres.length >= 2) {
        elementos.buttonStartSorteo.style.display = 'block';
    } else {
        elementos.buttonStartSorteo.style.display = 'none';
    }
};

// Función para mostrar toasts
const mostrarToast = (mensaje, tipo = 'info') => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;
    
    const icono = tipo === 'error' ? '' : tipo === 'success' ? '' : 'ℹ️';
    
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">${icono}</span>
            <span class="toast-message">${mensaje}</span>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    elementos.toastContainer.appendChild(toast);
    
    // Animación de entrada
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Auto-remover después de 4 segundos
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 300);
    }, 4000);
};

// Función para actualizar la lista visual
const actualizarLista = () => {
    if(nombres.length){
        elementos.nombresList.style.display='flex'
    }
    elementos.listaAmigos.innerHTML = '';
    nombres.forEach(nombre => {
        const li = document.createElement('li');
        li.textContent = nombre;
        li.className = 'nombre-item';
        elementos.listaAmigos.appendChild(li);
    });
};
// Función para iiniciar el sorteo (mostrar la sección de sorteo)
const iniciarSorteo = () => {
    if (nombres.length < 2) {
        mostrarToast('Necesitas al menos 2 amigos para jugar.', 'error');
        return;
    }
    if (nombres.length % 2 !== 0) {
        mostrarToast('Necesitas un número par de nombres para poder jugar.', 'error');
        return;
    }
    
    if (isSorting) {
        mostrarToast('El sorteo ya ha sido iniciado.', 'error');
        return;
    }

    // Iniciar el proceso de sorteo
    isSorting = true;
    elementos.seccionSorteo.style.display = 'block';
    elementos.botonSortear.disabled = false;
    elementos.inputSortear.disabled = false;
    elementos.buttonStartSorteo.style.display = 'none'; // Ocultar botón de iniciar
    
    // Ocultar la sección de agregar participantes
    const inputSection = document.querySelector('.input-wrapper');
    const sectionTitle = document.querySelector('.section-title');
    const listaAmigos = document.getElementById('listaAmigos');
    
    if (inputSection) {
        inputSection.style.display = 'none';
    }
    if (sectionTitle) {
        sectionTitle.style.display = 'none';
    }
    if (listaAmigos) {
        listaAmigos.style.display = 'none';
    }
    
    mostrarToast('¡Sorteo iniciado! Ahora puedes asignar amigos secretos.', 'info');
};

// Función para sortear amigo secreto individual
const sortearAmigo = () => {
    // Validar que el sorteo esté iniciado
    if (!isSorting) {
        mostrarToast('Primero debes iniciar el sorteo.', 'error');
        return;
    }
    
    // Validar que haya al menos 2 nombres en la lista
    if (nombres.length < 2) {
        mostrarToast('Necesitas al menos 2 nombres para realizar el sorteo.', 'error');
        return;
    }

    // Validar que el input de sortear tenga un valor
    const nombrePersona = elementos.inputSortear.value.trim();
    
    if (!nombrePersona) {
        mostrarToast('Por favor, ingresa tu nombre para sortear tu amigo secreto.', 'error');
        return;
    }
    
    if (!nombres.includes(nombrePersona)) {
        mostrarToast('Tu nombre no está en la lista. Primero debes agregarlo.', 'error');
        return;
    }
    
    if (asignaciones[nombrePersona]) {
        mostrarToast('Ya tienes un amigo secreto asignado.', 'error');
        return;
    }
    
    // Filtrar nombres disponibles (excluyendo a la persona misma y ya asignados)
    const disponibles = nombresDisponibles.filter(nombre => 
        nombre !== nombrePersona && !Object.values(asignaciones).includes(nombre)
    );
    
    if (disponibles.length === 0) {
        mostrarToast('No hay amigos disponibles para asignar.', 'error');
        return;
    }
    
    // Seleccionar amigo secreto aleatoriamente
    const amigoSecreto = disponibles[Math.floor(Math.random() * disponibles.length)];
    
    // Registrar la asignación
    asignaciones[nombrePersona] = amigoSecreto;
    
    // Eliminar el amigo secreto de la lista disponible
    const index = nombresDisponibles.indexOf(amigoSecreto);
    if (index > -1) {
        nombresDisponibles.splice(index, 1);
    }
    
    // Mostrar resultado
    mostrarResultado(nombrePersona, amigoSecreto);
    
    // Limpiar input
    elementos.inputSortear.value = '';
    
    // Verificar si todos tienen amigo secreto
    if (Object.keys(asignaciones).length === nombres.length) {
        mostrarToast('¡Todos los amigos secretos han sido asignados!', 'success');
        elementos.botonSortear.disabled = true;
        console.log(asignaciones)
        isSorting = false;
    }
 
};

// Función para mostrar el resultado del sorteo
const mostrarResultado = (persona, amigoSecreto) => {
    // Actualizar el contenido del modal
    document.getElementById('resultPerson').textContent = persona;
    document.getElementById('resultAmigo').textContent = amigoSecreto;
    
    // Mostrar el modal
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.style.display = 'flex';
    modalOverlay.style.opacity = '0';
    
    // Animar la entrada del modal
    setTimeout(() => {
        modalOverlay.style.opacity = '1';
    }, 10);
    
    // Enfocar el modal para accesibilidad
    modalOverlay.focus();
    
    // Mostrar mensaje de éxito
    mostrarToast('¡Resultado mostrado en el modal!', 'success');
};
const recargarPagina = (e) => {
    
}

// Función para cerrar el modal
const cerrarModal = () => {
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.style.opacity = '0';
    modalOverlay.style.display = 'none';
    
    setTimeout(() => {
        modalOverlay.style.display = 'none';
    }, 300);
};

// Hacer la función disponible globalmente
window.cerrarModal = cerrarModal;

// Función para reiniciar el sorteo
const reiniciarSorteo = () => {
    // Limpiar todas las listas y asignaciones
    nombres.length = 0;
    nombresDisponibles.length = 0;
    Object.keys(asignaciones).forEach(key => delete asignaciones[key]);
    
    // Limpiar la interfaz
   
    elementos.listaAmigos.innerHTML = '';
    elementos.inputNombre.value = '';
    elementos.inputSortear.value = '';
    
    // Resetear el estado
    isSorting = false;
    elementos.seccionSorteo.style.display = 'none';
    elementos.botonSortear.disabled = true;
    elementos.inputSortear.disabled = true;
    elementos.buttonStartSorteo.style.display = 'none';
    
    // Mostrar la sección de agregar participantes
    const inputSection = document.querySelector('.input-wrapper');
    const sectionTitle = document.querySelector('.section-title');
    const listaAmigos = document.getElementById('listaAmigos');
    
    if (inputSection) {
        inputSection.style.display = 'flex';
    }
    if (sectionTitle) {
        sectionTitle.style.display = 'block';
    }
    if (listaAmigos) {
        listaAmigos.style.display = 'block';
    }
    
    // Borrar nombres del localStorage cuando se reinicia
    borrarNombresDeLocalStorage();
    window.location.reload();
    mostrarToast('Sorteo reiniciado. Puedes volver a agregar participantes.', 'success');
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Configurar estado inicial
    elementos.botonSortear.disabled = true;
    elementos.inputSortear.disabled = true;
    elementos.seccionSorteo.style.display = 'none';
    elementos.buttonStartSorteo.style.display = 'none';
    
    // Cargar nombres guardados en localStorage al iniciar la página
    cargarNombresDesdeLocalStorage();
    
    // Agregar evento Enter al input de agregar
    elementos.inputNombre.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            agregarAmigo();
        }
    });
    
    // Agregar evento Enter al input de sortear
    elementos.inputSortear.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sortearAmigo();
        }
    });
    
    // Event listeners para el modal
    const modalOverlay = document.getElementById('modalOverlay');
    
    // Cerrar modal con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.style.display === 'flex') {
            cerrarModal();
        }
    });
    
    // Cerrar modal haciendo clic fuera
    modalOverlay.addEventListener('click', (e) => {
        if (e.target.id === 'modalOverlay') {
            cerrarModal();
        }
    });
});

// Hacer todas las funciones disponibles globalmente para los onclick del HTML
window.agregarAmigo = agregarAmigo;
window.iniciarSorteo = iniciarSorteo;
window.sortearAmigo = sortearAmigo;
window.reiniciarSorteo = reiniciarSorteo;
