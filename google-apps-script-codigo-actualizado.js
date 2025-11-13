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
    console.log('📥 Petición recibida');
    console.log('Tipo de petición:', e.postData ? 'POST con datos' : 'POST sin datos');
    
    // Obtener los datos del formulario
    let data;
    try {
      // Intentar obtener datos de diferentes formas para mayor compatibilidad
      if (e.postData && e.postData.contents) {
        console.log('📝 Datos recibidos en postData.contents');
        data = JSON.parse(e.postData.contents);
      } else if (e.parameter && e.parameter.data) {
        console.log('📝 Datos recibidos en parameter.data');
        data = JSON.parse(e.parameter.data);
      } else if (e.parameter) {
        console.log('📝 Datos recibidos como parámetros individuales');
        // Si los datos vienen como parámetros individuales
        data = {
          cidParticipante: e.parameter.cidParticipante || '',
          primerNombre: e.parameter.primerNombre || '',
          primerApellido: e.parameter.primerApellido || '',
          fechaNacimiento: e.parameter.fechaNacimiento || '',
          provincia: e.parameter.provincia || '',
          distrito: e.parameter.distrito || '',
          corregimiento: e.parameter.corregimiento || '',
          celular: e.parameter.celular || '',
          email: e.parameter.email || '',
          tipoParticipacion: e.parameter.tipoParticipacion || ''
        };
      } else {
        console.error('❌ No se recibieron datos');
        throw new Error('No se recibieron datos en la petición');
      }
      
      console.log('✅ Datos parseados correctamente:', Object.keys(data));
    } catch (parseError) {
      console.error('❌ Error al parsear datos:', parseError);
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: 'Error al procesar los datos: ' + parseError.toString(),
          details: 'Verifica que los datos se envíen en formato JSON'
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
      'email',
      'tipoParticipacion'
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
    try {
      if (SPREADSHEET_ID) {
        console.log('📊 Abriendo hoja por ID:', SPREADSHEET_ID);
        spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
      } else {
        console.log('📊 Usando hoja activa');
        spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      }
      
      if (!spreadsheet) {
        throw new Error('No se pudo abrir la hoja de cálculo');
      }
    } catch (spreadsheetError) {
      console.error('❌ Error al abrir hoja:', spreadsheetError);
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: 'Error al acceder a la hoja de cálculo: ' + spreadsheetError.toString()
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Obtener o crear la hoja de trabajo
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      console.log('📄 Creando nueva hoja:', SHEET_NAME);
      sheet = spreadsheet.insertSheet(SHEET_NAME);
    } else {
      console.log('📄 Usando hoja existente:', SHEET_NAME);
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
      data.tipoParticipacion.toString().trim(),
      formattedDate,
      timestamp // Para ordenamiento y filtros
    ];
    
    // Insertar los datos en la hoja
    try {
      const newRow = sheet.getLastRow() + 1;
      console.log('💾 Insertando datos en la fila:', newRow);
      
      sheet.getRange(newRow, 1, 1, rowData.length).setValues([rowData]);
      console.log('✅ Datos insertados correctamente');
      
      // Formatear la nueva fila
      try {
        formatDataRow(sheet, newRow, rowData.length);
      } catch (formatError) {
        console.warn('⚠️ Error al formatear fila (continuando):', formatError);
      }
      
      // Auto-ajustar el ancho de las columnas
      try {
        sheet.autoResizeColumns(1, rowData.length);
      } catch (resizeError) {
        console.warn('⚠️ Error al ajustar columnas (continuando):', resizeError);
      }
      
      // Congelar la primera fila (encabezados)
      try {
        sheet.setFrozenRows(1);
      } catch (freezeError) {
        console.warn('⚠️ Error al congelar filas (continuando):', freezeError);
      }
      
      // Aplicar filtros a los encabezados si no existen
      try {
        if (sheet.getFilter() === null && sheet.getLastRow() > 1) {
          sheet.getRange(1, 1, sheet.getLastRow(), rowData.length).createFilter();
        }
      } catch (filterError) {
        console.warn('⚠️ Error al crear filtros (continuando):', filterError);
      }
      
      console.log('✅ Proceso completado exitosamente');
      
      // Respuesta de éxito
      const output = ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Registro guardado exitosamente en la base de datos',
        rowNumber: newRow,
        timestamp: formattedDate,
        data: {
          cidParticipante: data.cidParticipante,
          nombre: data.primerNombre + ' ' + data.primerApellido
        }
      }));
      output.setMimeType(ContentService.MimeType.JSON);
      return output;
      
    } catch (insertError) {
      console.error('❌ Error al insertar datos:', insertError);
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: 'Error al guardar en la hoja: ' + insertError.toString()
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
      
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
    '¿Cómo quieres participar?',
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
  
  // Columna de timestamp (columna 12) - ocultar esta columna
  sheet.getRange(row, 12).setNumberFormat('yyyy-MM-dd HH:mm:ss');
  if (row === 2) {
    sheet.hideColumns(12);
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
    const timestamps = sheet.getRange(2, 12, lastRow - 1, 1).getValues();
    
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
    sheet.hideColumns(12);
    
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

/**
 * ============================================
 * FUNCIONES DE BACKUP
 * ============================================
 * Estas funciones permiten crear backups de los datos
 * sin afectar el funcionamiento normal del sistema
 */

/**
 * Función para crear backup en una nueva hoja dentro del mismo spreadsheet
 * Ejecuta esta función desde el editor de Apps Script para crear un backup
 * El backup se guardará en una hoja nueva con nombre: "Backup_Registros_YYYY-MM-DD_HH-MM-SS"
 */
function crearBackupEnHoja() {
  try {
    console.log('🔄 Iniciando backup en hoja...');
    
    // Obtener el spreadsheet
    let spreadsheet;
    if (SPREADSHEET_ID) {
      spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    } else {
      spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    }
    
    if (!spreadsheet) {
      return {
        success: false,
        error: 'No se pudo abrir la hoja de cálculo'
      };
    }
    
    // Obtener la hoja de registros
    const sourceSheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sourceSheet) {
      return {
        success: false,
        error: 'No se encontró la hoja de registros: ' + SHEET_NAME
      };
    }
    
    // Crear nombre para la hoja de backup con fecha y hora
    const now = new Date();
    const timeZone = Session.getScriptTimeZone();
    const dateStr = Utilities.formatDate(now, timeZone, 'yyyy-MM-dd_HH-mm-ss');
    const backupSheetName = `Backup_Registros_${dateStr}`;
    
    // Verificar si la hoja de backup ya existe y eliminarla (por si acaso)
    const existingBackupSheet = spreadsheet.getSheetByName(backupSheetName);
    if (existingBackupSheet) {
      spreadsheet.deleteSheet(existingBackupSheet);
    }
    
    // Copiar toda la hoja de registros
    const backupSheet = sourceSheet.copyTo(spreadsheet);
    backupSheet.setName(backupSheetName);
    
    // Ocultar la hoja de backup para no confundir a los usuarios
    // Puedes comentar esta línea si quieres que sea visible
    // backupSheet.hideSheet();
    
    console.log('✅ Backup creado en hoja:', backupSheetName);
    
    return {
      success: true,
      message: `Backup creado exitosamente en la hoja: ${backupSheetName}`,
      backupSheetName: backupSheetName,
      totalRows: sourceSheet.getLastRow(),
      fecha: Utilities.formatDate(now, timeZone, 'dd/MM/yyyy HH:mm:ss')
    };
    
  } catch (error) {
    console.error('❌ Error creando backup en hoja:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Función para crear backup como archivo CSV en Google Drive
 * Ejecuta esta función desde el editor de Apps Script
 * El archivo se guardará en la raíz de Google Drive o en una carpeta específica
 */
function crearBackupEnDrive() {
  try {
    console.log('🔄 Iniciando backup en Google Drive...');
    
    // Obtener el spreadsheet
    let spreadsheet;
    if (SPREADSHEET_ID) {
      spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    } else {
      spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    }
    
    if (!spreadsheet) {
      return {
        success: false,
        error: 'No se pudo abrir la hoja de cálculo'
      };
    }
    
    // Obtener la hoja de registros
    const sourceSheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sourceSheet) {
      return {
        success: false,
        error: 'No se encontró la hoja de registros: ' + SHEET_NAME
      };
    }
    
    // Obtener todos los datos de la hoja
    const data = sourceSheet.getDataRange().getValues();
    
    if (data.length === 0) {
      return {
        success: false,
        error: 'No hay datos para respaldar'
      };
    }
    
    // Convertir datos a CSV
    const csvContent = data.map(row => {
      return row.map(cell => {
        // Escapar comillas y envolver en comillas si contiene comas o saltos de línea
        const cellValue = cell === null || cell === undefined ? '' : cell.toString();
        if (cellValue.includes(',') || cellValue.includes('"') || cellValue.includes('\n')) {
          return '"' + cellValue.replace(/"/g, '""') + '"';
        }
        return cellValue;
      }).join(',');
    }).join('\n');
    
    // Crear nombre del archivo con fecha y hora
    const now = new Date();
    const timeZone = Session.getScriptTimeZone();
    const dateStr = Utilities.formatDate(now, timeZone, 'yyyy-MM-dd_HH-mm-ss');
    const fileName = `Backup_KIWANIS_Registros_${dateStr}.csv`;
    
    // Crear archivo en Google Drive
    const folder = DriveApp.getRootFolder(); // Guardar en la raíz, puedes cambiar esto
    const file = folder.createFile(fileName, csvContent, MimeType.CSV);
    
    console.log('✅ Backup creado en Drive:', fileName);
    
    return {
      success: true,
      message: `Backup creado exitosamente en Google Drive: ${fileName}`,
      fileName: fileName,
      fileId: file.getId(),
      fileUrl: file.getUrl(),
      totalRows: data.length - 1, // Restar 1 por los encabezados
      fecha: Utilities.formatDate(now, timeZone, 'dd/MM/yyyy HH:mm:ss')
    };
    
  } catch (error) {
    console.error('❌ Error creando backup en Drive:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Función para crear backup completo del spreadsheet en Google Drive
 * Esta función crea una copia completa del archivo de Google Sheets
 */
function crearBackupCompletoDrive() {
  try {
    console.log('🔄 Iniciando backup completo en Google Drive...');
    
    // Obtener el spreadsheet
    let spreadsheet;
    if (SPREADSHEET_ID) {
      spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    } else {
      spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    }
    
    if (!spreadsheet) {
      return {
        success: false,
        error: 'No se pudo abrir la hoja de cálculo'
      };
    }
    
    // Crear nombre del archivo con fecha y hora
    const now = new Date();
    const timeZone = Session.getScriptTimeZone();
    const dateStr = Utilities.formatDate(now, timeZone, 'yyyy-MM-dd_HH-mm-ss');
    const fileName = `Backup_Completo_KIWANIS_${dateStr}`;
    
    // Crear copia del spreadsheet completo
    const folder = DriveApp.getRootFolder(); // Guardar en la raíz, puedes cambiar esto
    const file = DriveApp.getFileById(spreadsheet.getId());
    const backupFile = file.makeCopy(fileName, folder);
    
    console.log('✅ Backup completo creado en Drive:', fileName);
    
    return {
      success: true,
      message: `Backup completo creado exitosamente en Google Drive: ${fileName}`,
      fileName: fileName,
      fileId: backupFile.getId(),
      fileUrl: backupFile.getUrl(),
      fecha: Utilities.formatDate(now, timeZone, 'dd/MM/yyyy HH:mm:ss')
    };
    
  } catch (error) {
    console.error('❌ Error creando backup completo:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Función para crear backup múltiple (hoja + Drive CSV + Drive completo)
 * Ejecuta esta función para crear todos los tipos de backup a la vez
 */
function crearBackupCompleto() {
  try {
    console.log('🔄 Iniciando backup completo (múltiples formatos)...');
    
    const results = {
      backupHoja: null,
      backupCSV: null,
      backupCompleto: null,
      fecha: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss')
    };
    
    // 1. Backup en hoja
    try {
      results.backupHoja = crearBackupEnHoja();
      console.log('✅ Backup en hoja:', results.backupHoja.success ? 'OK' : 'ERROR');
    } catch (e) {
      console.error('❌ Error en backup de hoja:', e);
      results.backupHoja = { success: false, error: e.toString() };
    }
    
    // 2. Backup CSV en Drive
    try {
      results.backupCSV = crearBackupEnDrive();
      console.log('✅ Backup CSV:', results.backupCSV.success ? 'OK' : 'ERROR');
    } catch (e) {
      console.error('❌ Error en backup CSV:', e);
      results.backupCSV = { success: false, error: e.toString() };
    }
    
    // 3. Backup completo en Drive
    try {
      results.backupCompleto = crearBackupCompletoDrive();
      console.log('✅ Backup completo:', results.backupCompleto.success ? 'OK' : 'ERROR');
    } catch (e) {
      console.error('❌ Error en backup completo:', e);
      results.backupCompleto = { success: false, error: e.toString() };
    }
    
    // Contar éxitos
    const successes = [
      results.backupHoja?.success,
      results.backupCSV?.success,
      results.backupCompleto?.success
    ].filter(s => s === true).length;
    
    return {
      success: successes > 0,
      message: `Backup completo: ${successes} de 3 backups creados exitosamente`,
      results: results,
      totalSuccesses: successes
    };
    
  } catch (error) {
    console.error('❌ Error en backup completo:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Función para programar backups automáticos
 * Configura un trigger para ejecutar backups automáticamente
 * Ejemplo: ejecutar backups mensuales el día 1 de cada mes a las 3:00 AM
 */
function configurarBackupAutomatico() {
  try {
    // Eliminar triggers existentes de backup para evitar duplicados
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(trigger => {
      if (trigger.getHandlerFunction() === 'ejecutarBackupAutomatico') {
        ScriptApp.deleteTrigger(trigger);
      }
    });
    
    // Crear trigger para ejecutar backup mensual el día 1 de cada mes a las 3:00 AM
    ScriptApp.newTrigger('ejecutarBackupAutomatico')
      .timeBased()
      .onMonthDay(1) // Día 1 de cada mes
      .atHour(3) // 3:00 AM
      .create();
    
    return {
      success: true,
      message: 'Backup automático configurado: se ejecutará mensualmente el día 1 de cada mes a las 3:00 AM',
      tipo: 'Backup CSV en Drive',
      frecuencia: 'Mensual'
    };
    
  } catch (error) {
    console.error('❌ Error configurando backup automático:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Función que se ejecuta automáticamente por el trigger
 * Esta función se llama desde el trigger programado
 */
function ejecutarBackupAutomatico() {
  try {
    console.log('🔄 Ejecutando backup automático...');
    
    // Por defecto, ejecutar backup CSV (más ligero)
    const result = crearBackupEnDrive();
    
    if (result.success) {
      console.log('✅ Backup automático completado:', result.fileName);
      
      // Opcional: Enviar notificación por email (requiere configuración)
      // enviarNotificacionBackup(result);
      
      return result;
    } else {
      console.error('❌ Error en backup automático:', result.error);
      return result;
    }
    
  } catch (error) {
    console.error('❌ Error ejecutando backup automático:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Función para listar todos los backups existentes
 * Muestra los backups de hojas y archivos de Drive
 */
function listarBackups() {
  try {
    const backups = {
      hojas: [],
      archivosDrive: [],
      fechaConsulta: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss')
    };
    
    // Listar hojas de backup
    let spreadsheet;
    if (SPREADSHEET_ID) {
      spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    } else {
      spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    }
    
    if (spreadsheet) {
      const sheets = spreadsheet.getSheets();
      sheets.forEach(sheet => {
        if (sheet.getName().startsWith('Backup_Registros_')) {
          backups.hojas.push({
            nombre: sheet.getName(),
            totalFilas: sheet.getLastRow() - 1,
            ultimaModificacion: sheet.getParent().getLastRow() ? 'N/A' : 'N/A'
          });
        }
      });
    }
    
    // Listar archivos de backup en Drive
    try {
      const files = DriveApp.getRootFolder().getFiles();
      while (files.hasNext()) {
        const file = files.next();
        const fileName = file.getName();
        
        if (fileName.startsWith('Backup_KIWANIS_') || fileName.startsWith('Backup_Completo_KIWANIS_')) {
          backups.archivosDrive.push({
            nombre: fileName,
            fechaCreacion: Utilities.formatDate(file.getDateCreated(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss'),
            tamaño: file.getSize(),
            url: file.getUrl(),
            id: file.getId()
          });
        }
      }
    } catch (driveError) {
      console.warn('⚠️ Error accediendo a Drive:', driveError);
    }
    
    // Ordenar por nombre (fecha)
    backups.hojas.sort((a, b) => b.nombre.localeCompare(a.nombre));
    backups.archivosDrive.sort((a, b) => b.nombre.localeCompare(a.nombre));
    
    return {
      success: true,
      backups: backups,
      totalHojas: backups.hojas.length,
      totalArchivosDrive: backups.archivosDrive.length
    };
    
  } catch (error) {
    console.error('❌ Error listando backups:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Función para actualizar hojas existentes con la nueva columna "¿Cómo quieres participar?"
 * Ejecuta esta función si ya tienes registros en tu hoja y necesitas agregar la nueva columna
 */
function actualizarHojaConNuevaColumna() {
  try {
    console.log('🔄 Actualizando hoja con nueva columna...');
    
    // Obtener el spreadsheet
    let spreadsheet;
    if (SPREADSHEET_ID) {
      spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    } else {
      spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    }
    
    if (!spreadsheet) {
      return {
        success: false,
        error: 'No se pudo abrir la hoja de cálculo'
      };
    }
    
    // Obtener la hoja de registros
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      return {
        success: false,
        error: 'No se encontró la hoja de registros: ' + SHEET_NAME
      };
    }
    
    const lastRow = sheet.getLastRow();
    const lastColumn = sheet.getLastColumn();
    
    // Si no hay datos, solo crear los encabezados
    if (lastRow === 0 || lastRow === 1) {
      createHeaders(sheet);
      return {
        success: true,
        message: 'Se crearon los encabezados con la nueva columna'
      };
    }
    
    // Verificar si ya existe la columna "¿Cómo quieres participar?"
    const headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
    const columnIndex = headers.indexOf('¿Cómo quieres participar?');
    
    if (columnIndex !== -1) {
      return {
        success: true,
        message: 'La columna "¿Cómo quieres participar?" ya existe en la columna ' + (columnIndex + 1),
        columnIndex: columnIndex + 1
      };
    }
    
    // Insertar la nueva columna después de Email (columna 9)
    // Mover columnas después de Email hacia la derecha
    if (lastColumn >= 9) {
      // Insertar nueva columna en la posición 10 (después de Email)
      sheet.insertColumnAfter(9); // Insertar después de Email (columna 9)
      
      // Establecer el encabezado
      sheet.getRange(1, 10).setValue('¿Cómo quieres participar?');
      
      // Formatear el encabezado
      const headerRange = sheet.getRange(1, 10);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#2563eb');
      headerRange.setFontColor('#ffffff');
      headerRange.setHorizontalAlignment('center');
      headerRange.setVerticalAlignment('middle');
      
      // Formatear las filas de datos vacías
      for (let i = 2; i <= lastRow; i++) {
        const cellRange = sheet.getRange(i, 10);
        if (i % 2 === 0) {
          cellRange.setBackground('#f8fafc');
        } else {
          cellRange.setBackground('#ffffff');
        }
        cellRange.setBorder(true, true, true, true, true, true, '#e5e7eb', SpreadsheetApp.BorderStyle.SOLID);
        cellRange.setVerticalAlignment('middle');
      }
      
      // Ajustar ancho de la nueva columna
      sheet.autoResizeColumns(10, 1);
      
      console.log('✅ Nueva columna agregada exitosamente');
      
      return {
        success: true,
        message: 'Columna "¿Cómo quieres participar?" agregada exitosamente en la columna 10',
        totalRows: lastRow - 1,
        nuevaColumna: 10
      };
    } else {
      // Si no hay suficientes columnas, simplemente agregar al final
      sheet.getRange(1, lastColumn + 1).setValue('¿Cómo quieres participar?');
      return {
        success: true,
        message: 'Columna agregada al final de la hoja',
        nuevaColumna: lastColumn + 1
      };
    }
    
  } catch (error) {
    console.error('❌ Error actualizando hoja:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

