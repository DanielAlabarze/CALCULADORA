// Selección de elementos del DOM
const display = document.getElementById("display"); // Display principal para mostrar el número actual
const display2 = document.querySelector("#display2"); // Display secundario para mostrar el operador y el número previo
const buttons = document.querySelectorAll("button"); // Todos los botones de la calculadora
const contenedorSpeaker = document.querySelector(".contenedorSpeaker"); // Botón de toggle de audio
const speaker = document.querySelector(".speaker"); // Elemento del icono de audio (para visualización)
const audio = document.querySelector(".botonAudio"); // Elemento de audio que se reproduce en cada clic

// Variables de estado para los operandos y operador
let currentOperand = "0"; // Operando actual, inicialmente "0"
let previousOperand = ""; // Operando previo, inicialmente vacío
let operator = ""; // Operador seleccionado, inicialmente vacío

// Inicialización del display con "0"
updateDisplay();

// Función para alternar el signo del operando actual
function toggleSign() {
  if (currentOperand !== "0") {
    currentOperand = (parseFloat(currentOperand) * -1).toString(); // Cambia el signo
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
      calculate(); // Calcula el resultado
    } else if (value === "C") {
      clear(); // Limpia el display y resetea los operandos
    } else if (value === "«") {
      deleteLastDigit(); // Elimina el último dígito
    } else if (value === "+/-") {
      toggleSign(); // Alterna el signo del operando actual
    } else if (isOperator(value)) {
      handleOperator(value); // Maneja la selección de operadores
    } else {
      appendNumber(value); // Agrega un número al operando actual
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
    audio.pause(); // Pausa el audio después de 100ms
    audio.currentTime = 0; // Reinicia el audio al inicio
  }, 80);
}

// Función para agregar un número al operando actual
function appendNumber(number) {
  // Evita múltiples ceros iniciales
  if (number === "0" && currentOperand === "0") return;

  // Si el usuario intenta ingresar un punto sin un número inicial, coloca "0."
  if (number === "." && (currentOperand === "" || currentOperand === "0")) {
    currentOperand = "0.";
    return;
  }

  // Evita múltiples puntos decimales en el mismo número
  if (number === "." && currentOperand.includes(".")) return;

  // Reemplaza "0" con el nuevo número, o agrega el número normalmente
  if (currentOperand === "0" && number !== ".") {
    currentOperand = number;
  } else {
    currentOperand += number;
  }
}

// Función para eliminar el último dígito del operando actual
function deleteLastDigit() {
  if (currentOperand.length > 0) {
    currentOperand = currentOperand.slice(0, -1); // Elimina el último carácter
  }
  if (currentOperand.length === 0) {
    currentOperand = "0"; // Restaura "0" si el operando está vacío
  }
}

// Función para manejar la selección de un operador
function handleOperator(op) {
  if (currentOperand === "") return; // Ignora si no hay operando actual
  if (previousOperand !== "") calculate(); // Calcula si ya hay un operando previo
  operator = op; // Asigna el operador seleccionado
  previousOperand = currentOperand; // Guarda el operando actual como previo
  currentOperand = ""; // Resetea el operando actual para el siguiente número
}


// Función para realizar el cálculo según el operador seleccionado
function calculate() {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  let result;

  // Validación de división por cero
  if (operator === "/" && current === 0) {
    Swal.fire({
      icon: "error",
      title: "ERROR",
      text: "No es posible la División por cero ",
      background: "black",
      color : "white",
      width: "230px",
    });

    clear();
    return;
  }

  // Realiza el cálculo según el operador seleccionado
  switch (operator) {
    case "+":
      result = prev + current;
      break;
    case "-":
      result = prev - current;
      break;
    case "*":
      result = prev * current;
      break;
    case "/":
      result = prev / current;
      break;
    case "%":
      result = prev + (prev * current) / 100;
      break;
    case "^":
      result = Math.pow(prev, current);
      break;
    case "√":
      result = Math.sqrt(prev);
      break;
    default:
      return;
  }

  // Actualiza los valores de los operandos y el display
  currentOperand = result.toString();
  previousOperand = "";
  operator = "";
  updateDisplay();
}

// Función para limpiar el display y restablecer valores
function clear() {
  currentOperand = "0";
  previousOperand = "";
  operator = "";
  updateDisplay();
}

// Función para ajustar el tamaño de fuente del display según el número de caracteres
function cambiarTamañoFuenteDisplay() {
  if (currentOperand.length > 10 && currentOperand.length < 15) {
    display.style.fontSize = "2rem";
  } else if (currentOperand.length > 14) {
    display.style.fontSize = "1rem";
  } else {
    display.style.fontSize = "2.8rem"; // Tamaño por defecto
  }
}

// Función para actualizar el contenido del display principal y secundario
function updateDisplay() {
  display.value = formatearNumero(currentOperand); // Muestra el operando actual formateado
  display2.value =
    previousOperand + " " + operator + " " + formatearNumero(currentOperand); // Muestra el operador y el operando previo
  cambiarTamañoFuenteDisplay();
}

// Verifica si el valor es un operador
function isOperator(value) {
  return ["+", "-", "*", "/", "%", "^", "√", "«"].includes(value);
}

// Formatea el número con separadores de miles y coma decimal
function formatearNumero(number) {
  if (number === "") return "";

  let numeroString = number.toString();
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
