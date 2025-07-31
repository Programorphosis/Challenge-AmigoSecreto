// El principal objetivo de este desafío es fortalecer tus habilidades en lógica de programación. Aquí deberás desarrollar la lógica para resolver el problema.
const nombres = [];
const nombresDisponibles = []; // Lista de nombres disponibles para sorteo
const asignaciones = {}; // Registro de asignaciones realizadas

// Seleccionar elementos HTML una sola vez
const elementos = {
    inputNombre: document.getElementById('amigo'),
    inputSortear: document.getElementById('nombreSortear'),
    listaAmigos: document.getElementById('listaAmigos'),
    resultado: document.getElementById('resultado'),
    toastContainer: document.getElementById('toast-container'),
    botonSortear: document.querySelector('.button-draw')
};

// Función para agregar nombres a la lista
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
    
    // Mostrar mensaje de éxito
    mostrarToast(`✅ ${nombre} agregado exitosamente`, 'success');
    
    // Habilitar/deshabilitar botón de sortear según la cantidad de nombres
    if (nombres.length >= 2) {
        elementos.botonSortear.disabled = false;
    } else {
        elementos.botonSortear.disabled = true;
    }
};

// Función para mostrar toasts
const mostrarToast = (mensaje, tipo = 'info') => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;
    
    const icono = tipo === 'error' ? '❌' : tipo === 'success' ? '✅' : 'ℹ️';
    
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
    elementos.listaAmigos.innerHTML = '';
    nombres.forEach(nombre => {
        const li = document.createElement('li');
        li.textContent = nombre;
        li.className = 'nombre-item';
        elementos.listaAmigos.appendChild(li);
    });
};

// Función para sortear amigo secreto individual
const sortearAmigo = () => {
    // Validar que haya al menos 2 nombres en la lista
    if (nombres.length < 2) {
        mostrarToast('Necesitas al menos 2 nombres para realizar el sorteo.', 'error');
        return;
    }
    
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
    }
};

// Función para mostrar el resultado del sorteo
const mostrarResultado = (persona, amigoSecreto) => {
    elementos.resultado.innerHTML = '';
    const resultadoDiv = document.createElement('div');
    resultadoDiv.className = 'resultado-sorteo';
    resultadoDiv.innerHTML = `
        <h3>¡Amigo Secreto Asignado!</h3>
        <p><strong>${persona}</strong>, tu amigo secreto es: <strong>${amigoSecreto}</strong></p>
        <p class="nota">Nota: Esta información es confidencial. ¡No la compartas!</p>
    `;
    elementos.resultado.appendChild(resultadoDiv);
};

// Función para reiniciar el sorteo
const reiniciarSorteo = () => {
    nombresDisponibles.length = 0;
    nombresDisponibles.push(...nombres);
    Object.keys(asignaciones).forEach(key => delete asignaciones[key]);
    elementos.resultado.innerHTML = '';
    
    // Actualizar estado del botón según la cantidad de nombres
    if (nombres.length >= 2) {
        elementos.botonSortear.disabled = false;
    } else {
        elementos.botonSortear.disabled = true;
    }
    
    mostrarToast('Sorteo reiniciado. Puedes volver a asignar amigos secretos.', 'success');
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Deshabilitar botón de sortear inicialmente
    elementos.botonSortear.disabled = true;
    
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
});
