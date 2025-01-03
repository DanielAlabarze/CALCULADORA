// Selección de elementos del DOM
const display = document.getElementById("display"); // Display principal para mostrar el número actual
const display2 = document.querySelector("#display2"); // Display secundario para mostrar el operador y el número previo
const buttons = document.querySelectorAll("button"); // Todos los botones de la calculadora
const contenedorSpeaker = document.querySelector(".contenedorSpeaker"); // Botón de toggle de audio
const speaker = document.querySelector(".speaker"); // Elemento del icono de audio (para visualización)
const audio = document.querySelector(".botonAudio"); // Elemento de audio que se reproduce en cada clic

// Variables de estado para los operandos y operador
let operadorActual = "0"; // Operando actual, inicialmente "0"
let operadorPrevio = ""; // Operando previo, inicialmente vacío
let operador = ""; // Operador seleccionado, inicialmente vacío

// Inicialización del display con "0"
updateDisplay();

// Función para alternar el signo del operando actual
function toggleSign() {
  if (operadorActual !== "0") {
    operadorActual = (parseFloat(operadorActual) * -1).toString(); // Cambia el signo
    updateDisplay();
  }
}

// Estado inicial de audio desactivado
let audioActivo = false;

// Evento para activar/desactivar el sonido al presionar el botón `contenedorSpeaker`
contenedorSpeaker.addEventListener("click", () => {
  audioActivo = !audioActivo; // Cambia el estado de audio
  contenedorSpeaker.style.backgroundColor = audioActivo ? "green" : "red"; // Cambia el color de fondo
});

// Añade un evento de clic a cada botón de la calculadora
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.textContent;

    // Ejecuta diferentes acciones según el botón presionado
    if (value === "=") {
      calculate(); // Calcula el resultadoado
    } else if (value === "C") {
      clear(); // Limpia el display y resetea los operandos
    } else if (value === "«") {
      borrarUltimoDigito(); // Elimina el último dígito
    } else if (value === "+/-") {
      toggleSign(); // Alterna el signo del operando actual
    } else if (isoperador(value)) {
      handleoperador(value); // Maneja la selección de operadores
    } else {
      appendnumero(value); // Agrega un número al operando actual
    }

    updateDisplay(); // Actualiza el display con los nuevos valores

    // Reproduce el sonido si el audio está activo
    if (audioActivo) {
      reproducirAudio();
    }
  });
});

// Función para reproducir el audio
function reproducirAudio() {
  audio.play(); // Reproduce el sonido
  setTimeout(() => {
    audio.pause(); // Pausa el audio después de 80ms
    audio.currentTime = 0; // Reinicia el audio al inicio
  }, 80);
}

// Función para agregar un número al operando actual
function appendnumero(numero) {
  // Evita múltiples ceros iniciales
  if (numero === "0" && operadorActual === "0") return;

  // Si el usuario intenta ingresar un punto sin un número inicial, coloca "0."
  if (numero === "." && (operadorActual === "" || operadorActual === "0")) {
    operadorActual = "0.";
    return;
  }

  // Evita múltiples puntos decimales en el mismo número
  if (numero === "." && operadorActual.includes(".")) return;

  // Reemplaza "0" con el nuevo número, o agrega el número normalmente
  if (operadorActual === "0" && numero !== ".") {
    operadorActual = numero;
  } else {
    operadorActual += numero;
  }
}

// Función para eliminar el último dígito del operando actual
function borrarUltimoDigito() {
  if (operadorActual.length > 0) {
    operadorActual = operadorActual.slice(0, -1); // Elimina el último carácter
  }
  if (operadorActual.length === 0) {
    operadorActual = "0"; // Restaura "0" si el operando está vacío
  }
}

// Función para manejar la selección de un operador
function handleoperador(op) {
  if (operadorActual === "") return; // Ignora si no hay operando actual
  if (operadorPrevio !== "") calculate(); // Calcula si ya hay un operando previo
  operador = op; // Asigna el operador seleccionado
  operadorPrevio = operadorActual; // Guarda el operando actual como previo
  operadorActual = ""; // Resetea el operando actual para el siguiente número
}

// Función para realizar el cálculo según el operador seleccionado
function calculate() {
  const prev = parseFloat(operadorPrevio);
  const current = parseFloat(operadorActual);
  let resultado;

  // Validación de división por cero
  if (operador === "/" && current === 0) {
    Swal.fire({
      icon: "error",
      title: "ERROR",
      text: "No es posible la División por cero ",
      background: "black",
      color: "white",
      width: "200px",
    
    });

    clear();
    return;
  }

  // Broma 1 -----------------------------------------------------
  if (prev === 2 && operador === "*" && current === 3) {
    Swal.fire({
      icon: "warning",
      title: "2 x 3",
      text: "Llueve",
      background: "black",
      color: "white",
      width: "200px",
    });
  }
  //-----------------------------------------------------------------
  //Broma 2
  if (prev === 5 && operador === "*" && current === 1) {
    Swal.fire({
      icon: "info",
      title: "5 x 1",
      text: "No va a quedar ninguno",
      background: "black",
      color: "white",
      width: "200px",
    });
  }

  //--------------------------------------------------------------------
  //Broma 3
  if (prev === 2 && operador === "+" && current === 2) {
    Swal.fire({
      icon: "question",
      title: "2 + 2",
      text: "Hace falta que te ayude con ese calculo?",
      background: "black",
      color: "white",
      width: "200px",
    });
  }

  //--------------------------------------------------------------------

  // Realiza el cálculo según el operador seleccionado
  switch (operador) {
    case "+":
      resultado = prev + current;
      break;
    case "-":
      resultado = prev - current;
      break;
    case "*":
      resultado = prev * current;
      break;
    case "/":
      resultado = prev / current;
      break;
    case "%":
      resultado = prev + (prev * current) / 100;
      break;
    case "^":
      resultado = Math.pow(prev, current);
      break;
    case "√":
      resultado = Math.sqrt(prev);
      break;

    default:
      return;
  }

  // Actualiza los valores de los operandos y el display
  operadorActual = resultado.toString();
  operadorPrevio = "";
  operador = "";
  updateDisplay();
}

// Función para limpiar el display y restablecer valores
function clear() {
  operadorActual = "0";
  operadorPrevio = "";
  operador = "";
  updateDisplay();
}

// Función para ajustar el tamaño de fuente del display según el número de caracteres
function cambiarTamañoFuenteDisplay() {
  if (operadorActual.length > 10 && operadorActual.length < 15) {
    display.style.fontSize = "2rem";
  } else if (operadorActual.length > 14) {
    display.style.fontSize = "1rem";
  } else {
    display.style.fontSize = "2.8rem"; // Tamaño por defecto
  }
}

// Función para actualizar el contenido del display principal y secundario
function updateDisplay() {
  display.value = formatearNumero(operadorActual); // Muestra el operando actual formateado
  display2.value =
    operadorPrevio + " " + operador + " " + formatearNumero(operadorActual); // Muestra el operador y el operando previo
  cambiarTamañoFuenteDisplay();
}

// Verifica si el valor es un operador
function isoperador(value) {
  return ["+", "-", "*", "/", "%", "^", "√", "«"].includes(value);
}

// Formatea el número con separadores de miles y coma decimal
function formatearNumero(numero) {
  if (numero === "") return "";

  let numeroString = numero.toString();
  let partes = numeroString.split(".");
  let parteEntera = partes[0];
  let parteDecimal = partes[1] || "";

  function formatearParteEntera(parteEntera) {
    return parteEntera.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  return (
    formatearParteEntera(parteEntera) + (parteDecimal ? "," + parteDecimal : "")
  );
}
