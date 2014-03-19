/**
 * @fileoverview 
 * @author 
 */
 
if (!Yatay.Msg){ 
	Yatay.Msg = {};
}

// Dialogs Messages
Yatay.Msg.DIALOG_CODE_LABEL = "Código Generado";	
Yatay.Msg.DIALOG_RUN = "Probar";
Yatay.Msg.DIALOG_SAVE = "Guardar";
Yatay.Msg.DIALOG_LOADER_LABEL = "Elige un proyecto!";		
Yatay.Msg.DIALOG_OPEN = "Abrir";
Yatay.Msg.DIALOG_LOCAL_INPUT = "Local";
Yatay.Msg.DIALOG_REMOTE_INPUT = "Servidor";
Yatay.Msg.DIALOG_TXT_REMOTE_INPUT = "Datos almacenados: ";
Yatay.Msg.DIALOG_REMOTE_LOADER = "obtener";
Yatay.Msg.DIALOG_LOADING = "cargando...";
Yatay.Msg.DIALOG_PROJECT = "Proyectos";
Yatay.Msg.DIALOG_BEHAVIOURS = "Comportamientos";
Yatay.Msg.DIALOG_NO_BEHAVIOURS = "no existe ninguno. ";
Yatay.Msg.DIALOG_START = "Comenzar";
Yatay.Msg.DIALOG_PROJMANAGER_LABEL = "Bienvenido a Yatay!";
Yatay.Msg.DIALOG_NEW_PROJ = "Crear nuevo proyecto";
Yatay.Msg.DIALOG_REMOTE_PROJ = "Unirse a un projecto";
Yatay.Msg.DIALOG_TXT_REMOTE_PROJ = "Projectos existentes: ";
Yatay.Msg.DIALOG_PROJ_NAME = "Nombre: ";
Yatay.Msg.DIALOG_NO_PROJS = "no existe ninguno. ";
Yatay.Msg.DIALOG_DELETE_ALL = "Todo";
Yatay.Msg.DIALOG_DELETE_WORKSPACE = "Sólo pizarra";
Yatay.Msg.DIALOG_DELETE_LABEL = "¿Qué deseas borrar?";
Yatay.Msg.DIALOG_MULTISELECT_NONE = "Ninguno selec.";
Yatay.Msg.DIALOG_MULTISELECT_ALL = "Selec. todos";
Yatay.Msg.DIALOG_EDITION_ERROR_TITLE = "Ooops!";
Yatay.Msg.DIALOG_EDITION_ERROR_BTN = "Ver detalle";
Yatay.Msg.DIALOG_EDITION_ERROR_MSG = "Algo esta mal en el código editado. Revísalo!";
Yatay.Msg.DIALOG_NONBXS_BLOCKS_WARN = "Los bloques fuera del bloque principal no son tenidos en cuenta.";	
Yatay.Msg.CANNOT_PARSE_BLOCKS = "Algunos bloques cargados no existen mas. No son comunes y no se pudieron recrear.";

// File saver Messages
Yatay.Msg.FILE_BLOCKS = "bloques";
Yatay.Msg.FILE_CODE = "codigo";

// Tour Messages
Yatay.Msg.TOUR_TOOLBOX_TITLE = '¿Dónde están los bloques?';
Yatay.Msg.TOUR_TOOLBOX_CONTENT = 'Aquí encontrarás todos los bloques, comienza con un bloque de comportamiento!';
Yatay.Msg.TOUR_RBTEST_TITLE = '¿Qué valores dan los sensores?'; 
Yatay.Msg.TOUR_RBTEST_CONTENT = 'Puedes probar y calibrar los sensores y actuadores del robot Butiá.';
Yatay.Msg.TOUR_RUN_TITLE = '¿Quieres ejecutar tus comportamientos?';
Yatay.Msg.TOUR_RUN_CONTENT = 'Comienza la ejecución de tus comportamientos, también puedes depurar!';
Yatay.Msg.TOUR_EDIT_TITLE = '¿Qué código se está generando?';
Yatay.Msg.TOUR_EDIT_CONTENT = 'Puedes editar y probar el código de tus comportamientos.';
Yatay.Msg.TOUR_BXREADY_TITLE = '¿Terminaste de armar tu comportamiento?'; 
Yatay.Msg.TOUR_BXREADY_CONTENT = 'Puedes marcar tu comportamiento como listo y seguir con otro!';
Yatay.Msg.TOUR_NEXT = 'siguiente';
Yatay.Msg.TOUR_PREV = 'anterior';

// Popup Messages 
Yatay.Msg.POPUP_RESULTS_ROBOTINFO = 'Info. del Robot: ';
Yatay.Msg.POPUP_RESULTS_CONSOLE = 'Consola: ';

// Control Messages
Yatay.Msg.CONTROLS_IF_TOOLTIP = "Si la condicion es verdadera se hace lo primero, de lo contrario se hace lo segundo.";
Yatay.Msg.CONTROLS_IF_HELPURL = "";
Yatay.Msg.CONTROLS_IF_MSG_IF = "si";
Yatay.Msg.CONTROLS_IF_MSG_THEN = "entonces";
Yatay.Msg.CONTROLS_IF_MSG_ELSEIF = "sino si";
Yatay.Msg.CONTROLS_IF_MSG_ELSE = "sino";

Yatay.Msg.CONTROL_OPERATION_AND = "y";
Yatay.Msg.CONTROL_OPERATION_OR = "o";
Yatay.Msg.CONTROL_OPERATION_HELPURL = "";
Yatay.Msg.LOGIC_OPERATION_TOOLTIP_AND = "Si se cumplen ambas condiciones, el bloque será verdadero.";
Yatay.Msg.LOGIC_OPERATION_TOOLTIP_OR = "Si se cumple al menos una de las condiciones, el bloque será verdadero.";

Yatay.Msg.CONTROL_NEGATE_HELPURL = "";
Yatay.Msg.CONTROL_NEGATE_TITLE = "no %1";
Yatay.Msg.CONTROL_NEGATE_TOOLTIP = "El bloque es verdadero si se cumple lo opuesto a la condición.";

Yatay.Msg.CONTROL_BOOLEAN_TRUE = "verdadero";
Yatay.Msg.CONTROL_BOOLEAN_FALSE = "falso";
Yatay.Msg.CONTROL_BOOLEAN_HELPURL = "";
Yatay.Msg.CONTROL_BOOLEAN_TOOLTIP = "Un bloque de verdadero o de falso, sirve para comparar o para hacer una condicion siempre verdadera o falsa.";

Yatay.Msg.CONTROL_WHILE = "mientras";
Yatay.Msg.CONTROL_WHILE_TOOLTIP = "Mientras la condición sea verdadera se ejecuta lo que este dentro de este bloque.";

Yatay.Msg.CONTROL_BEHAVIOUR = "nombre";
Yatay.Msg.CONTROL_BEHAVIOUR_PRIORITY = "   prioridad";
Yatay.Msg.CONTROL_BEHAVIOUR_TOOLTIP = "Crea un nuevo comportamiento del robot con el nombre y prioridad elegidas.";
Yatay.Msg.CONTROLS_BEHAVIOUR_ACTION = "acción";
Yatay.Msg.CONTROLS_BEHAVIOUR_CONDITION = "disparador";

Yatay.Msg.CONTROL_SLEEP = "esperar";
Yatay.Msg.CONTROL_SLEEP_TOOLTIP = "El programa espera la cantidad de tiempo ingresada para continuar ejecutando.";

Yatay.Msg.CONTROL_REPEAT = "repetir ";
Yatay.Msg.CONTROL_REPEAT_TIMES = " veces";
Yatay.Msg.CONTROL_REPEAT_TOOLTIP = "Repetir un numero determinado de veces";
Yatay.Msg.CONTROL_TIMES_EXECUTED = "veces ejecutado";

//Variable Messages
Yatay.Msg.VARIABLES_GET_TITLE = "";
Yatay.Msg.VARIABLES_GET_TAIL = "";
Yatay.Msg.VARIABLES_GET_TOOLTIP = "Obtener valor de una variable";
Yatay.Msg.VARIABLES_GET_CREATE_SET = "";
Yatay.Msg.VARIABLES_SET_TITLE = "guardar en";
Yatay.Msg.VARIABLES_SET_TAIL = "";
Yatay.Msg.VARIABLES_PRINT = "imprimir";
Yatay.Msg.COMPLEX_SENSOR_SET_TITLE = "crear sensor ";
Yatay.Msg.COMPLEX_SENSOR_GET_TITLE = "sensor "

//Math Messages 
Yatay.Msg.MATH_CONSTRAIN_HELPURL = "";
Yatay.Msg.MATH_CONSTRAIN_TITLE = "%1 entre %2 y %3";
Yatay.Msg.MATH_CONSTRAIN_TOOLTIP = ""; 
Yatay.Msg.MATH_ROUND_OPERATOR_ROUND = "redondear";
Yatay.Msg.MATH_ROUND_OPERATOR_ROUNDUP = "redondear arriba";
Yatay.Msg.MATH_ROUND_OPERATOR_ROUNDDOWN = "redondear abajo";
Yatay.Msg.MATH_TRIG_TOOLTIP_SIN = "sen";
Yatay.Msg.MATH_TRIG_TOOLTIP_ASIN = "asen";
Yatay.Msg.MATH_SINGLE_TOOLTIP_ROOT = "raiz cuad.";
Yatay.Msg.MATH_SINGLE_TOOLTIP_ABS = "valor abs";
Yatay.Msg.MATH_SINGLE_TOOLTIP_NEG = "opuesto";

//Code comments
Yatay.Msg.CODE_INITIALIZEVARS = "--Inicialización de librerías y atributos:\n";
Yatay.Msg.CODE_COMPETE = "--Competición para poder ejecutar:\n";
Yatay.Msg.CODE_RUN = "--Acción del comportamiento al ejecutar:\n";
Yatay.Msg.CODE_DONE = "--Finalizado, dejo mi lugar de comportamiento activo vacío:\n";
Yatay.Msg.CODE_INIT = "--Registra el comportamiento para que pueda competir:\n";
Yatay.Msg.CODE_RELEASE = "--Función ejecutada al perder el lugar de comportamiento activo:\n";
Yatay.Msg.CODE_WHILE = "--El sleep reviene sobrecargar el sistema con demasiadas repeticiones:\n";


// SVG Behaviours popup
Yatay.Msg.SVG_BEHAVIOURS = '<svg width="128pt" height="32pt"><path fill="#5B8FA6" d=" M 17.37 7.50 C 20.56 7.07 23.79 7.34 27.00 7.30 C 62.28 7.31 97.57 7.32 132.85 7.30 C 133.23 15.87 132.89 24.45 133.03 33.03 C 103.00 33.00 72.98 32.98 42.96 33.03 C 38.77 32.67 36.46 38.03 32.17 37.03 C 29.90 36.01 28.04 34.28 25.80 33.20 C 20.97 32.72 16.10 33.29 11.26 32.82 C 11.35 27.21 11.26 21.59 11.29 15.98 C 10.94 12.15 13.94 8.74 17.37 7.50 Z" /></svg>';
