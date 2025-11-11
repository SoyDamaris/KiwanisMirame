/**
 * ============================================
 * GOOGLE APPS SCRIPT - KIWANIS MÍRAME PANAMÁ
 * Formulario de Registro - Conexión con Google Sheets
 * ============================================
 * 
 * INSTRUCCIONES DE INSTALACIÓN:
 * 1. Abre tu hoja de cálculo de Google Sheets
 * 2. Ve a Extensiones > Apps Script
 * 3. Pega este código completo en el editor
 * 4. Guarda el proyecto (Ctrl+S o Cmd+S)
 * 5. Despliega > Nueva implementación
 * 6. Selecciona tipo: Aplicación web
 * 7. Ejecutar como: Yo
 * 8. Quién tiene acceso: Cualquiera
 * 9. Haz clic en "Desplegar"
 * 10. Copia la URL de la aplicación web y úsala en tu formulario HTML
 * 
 * IMPORTANTE: Asegúrate de que la hoja de cálculo esté vinculada al script
 */

/**
 * ID de la hoja de cálculo (OPCIONAL - Si no se especifica, usa la hoja activa)
 * Para obtener el ID: mira la URL de tu hoja de cálculo
 * Ejemplo: https://docs.google.com/spreadsheets/d/ID_AQUI/edit
 */
const SPREADSHEET_ID = ''; // Déjalo vacío para usar la hoja activa

/**
 * Nombre de la hoja donde se guardarán los datos
 */
const SHEET_NAME = 'Registros'; // Puedes cambiar este nombre

/**
 * Función principal para manejar peticiones GET
 * Útil para verificar que el script está funcionando
 */
function doGet(e) {
  try {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Script de KIWANIS MÍRAME PANAMÁ funcionando correctamente',
        timestamp: new Date().toISOString(),
        version: '3.0',
        fecha: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss')
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: 'Error en doGet: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Función principal para manejar peticiones POST del formulario
 * Esta función recibe los datos del formulario y los guarda en Google Sheets
 */
function doPost(e) {
  try {
    // Obtener los datos del formulario
    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseError) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: 'Error al procesar los datos: ' + parseError.toString()
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Validar que los datos requeridos estén presentes
    const requiredFields = [
      'cidParticipante', 
      'primerNombre', 
      'primerApellido', 
      'fechaNacimiento', 
      'provincia', 
      'distrito', 
      'corregimiento', 
      'celular', 
      'email'
    ];
    
    const missingFields = requiredFields.filter(field => !data[field] || data[field].toString().trim() === '');
    
    if (missingFields.length > 0) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: 'Campos requeridos faltantes: ' + missingFields.join(', ')
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: 'El formato del email no es válido'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Obtener la hoja de cálculo
    let spreadsheet;
    if (SPREADSHEET_ID) {
      spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    } else {
      spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    }
    
    // Obtener o crear la hoja de trabajo
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
    }
    
    // Si es la primera vez, crear los encabezados
    if (sheet.getLastRow() === 0) {
      createHeaders(sheet);
    }
    
    // Verificar duplicados antes de insertar
    const isDuplicate = checkDuplicate(sheet, data.cidParticipante, data.email);
    if (isDuplicate) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: 'Ya existe un registro con esta Cédula y Email'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Preparar los datos para insertar
    const timestamp = new Date();
    const timeZone = Session.getScriptTimeZone();
    const formattedDate = Utilities.formatDate(timestamp, timeZone, 'dd/MM/yyyy HH:mm:ss');
    
    const rowData = [
      data.cidParticipante.toString().trim(),
      capitalizeWords(data.primerNombre.toString().trim()),
      capitalizeWords(data.primerApellido.toString().trim()),
      formatDate(data.fechaNacimiento),
      data.provincia.toString().trim(),
      capitalizeWords(data.distrito.toString().trim()),
      capitalizeWords(data.corregimiento.toString().trim()),
      data.celular.toString().trim(),
      data.email.toString().trim().toLowerCase(),
      formattedDate,
      timestamp // Para ordenamiento y filtros
    ];
    
    // Insertar los datos en la hoja
    const newRow = sheet.getLastRow() + 1;
    sheet.getRange(newRow, 1, 1, rowData.length).setValues([rowData]);
    
    // Formatear la nueva fila
    formatDataRow(sheet, newRow, rowData.length);
    
    // Auto-ajustar el ancho de las columnas
    sheet.autoResizeColumns(1, rowData.length);
    
    // Congelar la primera fila (encabezados)
    sheet.setFrozenRows(1);
    
    // Aplicar filtros a los encabezados si no existen
    if (sheet.getFilter() === null && sheet.getLastRow() > 1) {
      sheet.getRange(1, 1, sheet.getLastRow(), rowData.length).createFilter();
    }
    
    // Respuesta de éxito
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Registro guardado exitosamente en la base de datos',
        rowNumber: newRow,
        timestamp: formattedDate,
        data: {
          cidParticipante: data.cidParticipante,
          nombre: data.primerNombre + ' ' + data.primerApellido
        }
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Log del error para debugging
    console.error('Error en doPost:', error);
    console.error('Stack trace:', error.stack);
    
    // Respuesta de error
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: 'Error interno del servidor: ' + error.toString(),
        message: 'Por favor, intenta nuevamente o contacta al administrador'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Función para crear los encabezados de la hoja
 */
function createHeaders(sheet) {
  const headers = [
    'C.I.-Participante',
    'Primer Nombre',
    'Primer Apellido',
    'Fecha de Nacimiento',
    'Provincia',
    'Distrito',
    'Corregimiento',
    'Celular',
    'Email',
    'Fecha y Hora de Registro',
    'Timestamp (Ordenamiento)'
  ];
  
  // Insertar encabezados
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Formatear encabezados
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#2563eb');
  headerRange.setFontColor('#ffffff');
  headerRange.setHorizontalAlignment('center');
  headerRange.setVerticalAlignment('middle');
  headerRange.setFontSize(11);
  
  // Ajustar altura de la fila de encabezados
  sheet.setRowHeight(1, 35);
  
  // Aplicar bordes
  headerRange.setBorder(true, true, true, true, true, true, '#ffffff', SpreadsheetApp.BorderStyle.SOLID);
}

/**
 * Función para formatear las filas de datos
 */
function formatDataRow(sheet, row, numColumns) {
  const dataRange = sheet.getRange(row, 1, 1, numColumns);
  
  // Aplicar bordes
  dataRange.setBorder(true, true, true, true, true, true, '#e5e7eb', SpreadsheetApp.BorderStyle.SOLID);
  
  // Alternar colores de fila para mejor legibilidad
  if (row % 2 === 0) {
    dataRange.setBackground('#f8fafc');
  } else {
    dataRange.setBackground('#ffffff');
  }
  
  // Alinear texto
  sheet.getRange(row, 1, 1, numColumns).setVerticalAlignment('middle');
  
  // Formato específico para columnas
  // Columna de fecha de nacimiento (columna 4)
  sheet.getRange(row, 4).setNumberFormat('dd/MM/yyyy');
  
  // Columna de timestamp (columna 11) - ocultar esta columna
  sheet.getRange(row, 11).setNumberFormat('yyyy-MM-dd HH:mm:ss');
  if (row === 2) {
    sheet.hideColumns(11);
  }
}

/**
 * Función para verificar duplicados
 */
function checkDuplicate(sheet, cidParticipante, email) {
  const lastRow = sheet.getLastRow();
  
  if (lastRow <= 1) {
    return false; // No hay datos, no puede haber duplicados
  }
  
  // Obtener todos los datos de una vez (más eficiente)
  const cidColumn = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  const emailColumn = sheet.getRange(2, 9, lastRow - 1, 1).getValues();
  
  for (let i = 0; i < cidColumn.length; i++) {
    const existingCID = cidColumn[i][0].toString().trim();
    const existingEmail = emailColumn[i][0].toString().trim().toLowerCase();
    
    if (existingCID === cidParticipante.toString().trim() && 
        existingEmail === email.toString().trim().toLowerCase()) {
      return true;
    }
  }
  
  return false;
}

/**
 * Función para capitalizar palabras (primera letra mayúscula)
 */
function capitalizeWords(str) {
  if (!str) return '';
  
  return str.split(' ')
    .map(word => {
      if (word.length === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

/**
 * Función para formatear fecha
 */
function formatDate(dateString) {
  try {
    if (!dateString) return '';
    
    // Si ya está en formato correcto, devolverlo
    if (dateString.includes('/')) {
      return dateString;
    }
    
    // Convertir de formato YYYY-MM-DD a DD/MM/YYYY
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString; // Devolver original si no se puede parsear
    }
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    return dateString; // Devolver original en caso de error
  }
}

/**
 * ============================================
 * FUNCIONES ADICIONALES ÚTILES
 * ============================================
 */

/**
 * Función para obtener estadísticas del formulario
 * Ejecuta esta función desde el editor de Apps Script para ver estadísticas
 */
function getFormStats() {
  try {
    let spreadsheet;
    if (SPREADSHEET_ID) {
      spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    } else {
      spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    }
    
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      return {
        totalRegistros: 0,
        message: 'No se encontró la hoja de registros'
      };
    }
    
    const lastRow = sheet.getLastRow();
    
    if (lastRow <= 1) {
      return {
        totalRegistros: 0,
        registrosHoy: 0,
        registrosEstaSemana: 0,
        registrosEsteMes: 0
      };
    }
    
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    let registrosHoy = 0;
    let registrosEstaSemana = 0;
    let registrosEsteMes = 0;
    
    // Obtener timestamps de una vez
    const timestamps = sheet.getRange(2, 11, lastRow - 1, 1).getValues();
    
    timestamps.forEach(row => {
      const timestamp = row[0];
      if (timestamp instanceof Date) {
        if (timestamp >= startOfDay) registrosHoy++;
        if (timestamp >= startOfWeek) registrosEstaSemana++;
        if (timestamp >= startOfMonth) registrosEsteMes++;
      }
    });
    
    return {
      totalRegistros: lastRow - 1,
      registrosHoy: registrosHoy,
      registrosEstaSemana: registrosEstaSemana,
      registrosEsteMes: registrosEsteMes,
      ultimaActualizacion: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    return { error: error.toString() };
  }
}

/**
 * Función para limpiar datos duplicados
 * Ejecuta esta función desde el editor de Apps Script
 */
function limpiarDuplicados() {
  try {
    let spreadsheet;
    if (SPREADSHEET_ID) {
      spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    } else {
      spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    }
    
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      return {
        success: false,
        message: 'No se encontró la hoja de registros'
      };
    }
    
    const lastRow = sheet.getLastRow();
    
    if (lastRow <= 2) {
      return {
        success: true,
        message: 'No hay suficientes datos para verificar duplicados'
      };
    }
    
    const data = sheet.getDataRange().getValues();
    const uniqueData = [];
    const seen = new Set();
    let duplicatesRemoved = 0;
    
    // Agregar encabezados
    uniqueData.push(data[0]);
    
    // Procesar datos (empezando desde la fila 2)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const cid = row[0] ? row[0].toString().trim() : '';
      const email = row[8] ? row[8].toString().trim().toLowerCase() : '';
      const key = `${cid}-${email}`;
      
      if (!seen.has(key) && cid && email) {
        seen.add(key);
        uniqueData.push(row);
      } else if (cid && email) {
        duplicatesRemoved++;
      }
    }
    
    // Limpiar la hoja y escribir datos únicos
    sheet.clear();
    if (uniqueData.length > 0) {
      sheet.getRange(1, 1, uniqueData.length, uniqueData[0].length).setValues(uniqueData);
      
      // Restaurar formato de encabezados
      createHeaders(sheet);
      
      // Restaurar formato de datos
      for (let i = 2; i <= uniqueData.length; i++) {
        formatDataRow(sheet, i, uniqueData[0].length);
      }
    }
    
    return {
      success: true,
      message: `Se eliminaron ${duplicatesRemoved} registros duplicados`,
      duplicatesRemoved: duplicatesRemoved,
      totalRecords: uniqueData.length - 1
    };
    
  } catch (error) {
    console.error('Error limpiando duplicados:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Función de prueba para verificar que el script funciona
 * Ejecuta esta función desde el editor de Apps Script
 */
function testConnection() {
  try {
    const testData = {
      cidParticipante: '1-2345-678',
      primerNombre: 'Prueba',
      primerApellido: 'Conexión',
      fechaNacimiento: '1990-01-01',
      provincia: 'Panamá',
      distrito: 'San Miguelito',
      corregimiento: 'Villa Lucre',
      celular: '6000-0000',
      email: 'prueba@test.com',
      timestamp: new Date().toLocaleString('es-PA')
    };
    
    // Simular la función doPost
    const mockEvent = {
      postData: {
        contents: JSON.stringify(testData)
      },
      parameter: {}
    };
    
    const result = doPost(mockEvent);
    const response = JSON.parse(result.getContent());
    
    console.log('Prueba de conexión:', response);
    
    return {
      success: response.success,
      message: response.success ? 'Script funcionando correctamente' : response.error
    };
    
  } catch (error) {
    console.error('Error en prueba de conexión:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Función para organizar y formatear toda la hoja
 * Ejecuta esta función para aplicar formato a todos los registros existentes
 */
function organizarHoja() {
  try {
    let spreadsheet;
    if (SPREADSHEET_ID) {
      spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    } else {
      spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    }
    
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      return {
        success: false,
        message: 'No se encontró la hoja de registros'
      };
    }
    
    const lastRow = sheet.getLastRow();
    if (lastRow === 0) {
      createHeaders(sheet);
      return {
        success: true,
        message: 'Se crearon los encabezados'
      };
    }
    
    // Asegurar que los encabezados estén formateados
    createHeaders(sheet);
    
    // Formatear todas las filas de datos
    const numColumns = sheet.getLastColumn();
    for (let i = 2; i <= lastRow; i++) {
      formatDataRow(sheet, i, numColumns);
    }
    
    // Aplicar filtros
    if (sheet.getFilter() === null && lastRow > 1) {
      sheet.getRange(1, 1, lastRow, numColumns).createFilter();
    }
    
    // Congelar primera fila
    sheet.setFrozenRows(1);
    
    // Ocultar columna de timestamp
    sheet.hideColumns(11);
    
    // Auto-ajustar columnas
    sheet.autoResizeColumns(1, numColumns);
    
    return {
      success: true,
      message: 'Hoja organizada exitosamente',
      totalRows: lastRow - 1
    };
    
  } catch (error) {
    console.error('Error organizando hoja:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

