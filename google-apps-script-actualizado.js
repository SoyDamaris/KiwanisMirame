/**
 * Google Apps Script actualizado para MÍRAME PANAMÁ - Formulario de Registro
 * Este script maneja las peticiones POST del formulario web y guarda los datos en Google Sheets
 * Versión actualizada con los nuevos campos del formulario
 */

/**
 * Función doGet para manejar peticiones GET al script
 * Requerida para que el script funcione correctamente
 */
function doGet(e) {
  try {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Script de MÍRAME PANAMÁ funcionando correctamente',
        timestamp: new Date().toISOString(),
        version: '2.0'
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

function doPost(e) {
  try {
    // Obtener los datos del formulario
    const data = JSON.parse(e.postData.contents);
    
    // Validar que los datos requeridos estén presentes
    const requiredFields = ['cidParticipante', 'primerNombre', 'primerApellido', 'fechaNacimiento', 'provincia', 'distrito', 'corregimiento', 'celular', 'email'];
    const missingFields = requiredFields.filter(field => !data[field] || data[field].trim() === '');
    
    if (missingFields.length > 0) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: 'Campos requeridos faltantes: ' + missingFields.join(', ')
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Obtener la hoja de cálculo activa
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Si es la primera vez, agregar encabezados
    if (sheet.getLastRow() === 0) {
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
        'IP Address',
        'User Agent'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Formatear encabezados
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#2563eb');
      headerRange.setFontColor('#ffffff');
      headerRange.setHorizontalAlignment('center');
    }
    
    // Preparar los datos para insertar
    const timestamp = new Date();
    // Usar la zona horaria de Panamá (UTC-5)
    const panamaTime = new Date(timestamp.getTime() - (5 * 60 * 60 * 1000));
    const userIP = e.parameter?.ip || 'N/A';
    const userAgent = e.parameter?.userAgent || 'N/A';
    
    const rowData = [
      data.cidParticipante,
      data.primerNombre,
      data.primerApellido,
      data.fechaNacimiento,
      data.provincia,
      data.distrito,
      data.corregimiento,
      data.celular,
      data.email,
      panamaTime,
      userIP,
      userAgent
    ];
    
    // Verificar si ya existe un registro con la misma C.I. y email
    const lastRow = sheet.getLastRow();
    let isDuplicate = false;
    
    if (lastRow > 1) {
      for (let i = 2; i <= lastRow; i++) {
        const existingCID = sheet.getRange(i, 1).getValue();
        const existingEmail = sheet.getRange(i, 9).getValue();
        
        if (existingCID === data.cidParticipante && existingEmail === data.email) {
          isDuplicate = true;
          break;
        }
      }
    }
    
    if (isDuplicate) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: 'Ya existe un registro con esta C.I. y email'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Insertar los datos en la hoja
    const newRow = sheet.getLastRow() + 1;
    sheet.getRange(newRow, 1, 1, rowData.length).setValues([rowData]);
    
    // Formatear la nueva fila
    const dataRange = sheet.getRange(newRow, 1, 1, rowData.length);
    dataRange.setBorder(true, true, true, true, true, true);
    
    // Alternar colores de fila para mejor legibilidad
    if (newRow % 2 === 0) {
      dataRange.setBackground('#f8fafc');
    }
    
    // Auto-ajustar el ancho de las columnas
    sheet.autoResizeColumns(1, rowData.length);
    
    // Crear una copia de seguridad en una hoja separada (opcional)
    createBackup(data, timestamp);
    
    // Respuesta de éxito
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Registro guardado exitosamente',
        rowNumber: newRow,
        timestamp: timestamp.toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Log del error para debugging
    console.error('Error en doPost:', error);
    
    // Respuesta de error
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: 'Error interno del servidor: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Función para crear una copia de seguridad de los datos
 * Opcional: Crea una hoja separada con copias de seguridad diarias
 */
function createBackup(data, timestamp) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const today = Utilities.formatDate(timestamp, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    const backupSheetName = 'Backup_' + today;
    
    let backupSheet = spreadsheet.getSheetByName(backupSheetName);
    
    // Si no existe la hoja de backup para hoy, crearla
    if (!backupSheet) {
      backupSheet = spreadsheet.insertSheet(backupSheetName);
      
      // Agregar encabezados
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
        'Timestamp Original',
        'Timestamp Backup'
      ];
      backupSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Formatear encabezados
      const headerRange = backupSheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#dc2626');
      headerRange.setFontColor('#ffffff');
    }
    
    // Agregar datos de backup
    const backupData = [
      data.cidParticipante,
      data.primerNombre,
      data.primerApellido,
      data.fechaNacimiento,
      data.provincia,
      data.distrito,
      data.corregimiento,
      data.celular,
      data.email,
      timestamp,
      new Date()
    ];
    
    const newRow = backupSheet.getLastRow() + 1;
    backupSheet.getRange(newRow, 1, 1, backupData.length).setValues([backupData]);
    
  } catch (error) {
    console.error('Error creando backup:', error);
    // No lanzar error para no interrumpir el proceso principal
  }
}

/**
 * Función para limpiar backups antiguos (ejecutar periódicamente)
 * Elimina hojas de backup más antiguas que 30 días
 */
function cleanupOldBackups() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = spreadsheet.getSheets();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    sheets.forEach(sheet => {
      const sheetName = sheet.getName();
      if (sheetName.startsWith('Backup_')) {
        const dateStr = sheetName.replace('Backup_', '');
        const backupDate = new Date(dateStr);
        
        if (backupDate < thirtyDaysAgo) {
          spreadsheet.deleteSheet(sheet);
          console.log('Hoja de backup eliminada:', sheetName);
        }
      }
    });
  } catch (error) {
    console.error('Error limpiando backups:', error);
  }
}

/**
 * Función para obtener estadísticas del formulario
 * Útil para dashboard o reportes
 */
function getFormStats() {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
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
    
    // Contar registros por período
    for (let i = 2; i <= lastRow; i++) {
      const timestamp = sheet.getRange(i, 10).getValue(); // Columna J (timestamp)
      
      if (timestamp >= startOfDay) registrosHoy++;
      if (timestamp >= startOfWeek) registrosEstaSemana++;
      if (timestamp >= startOfMonth) registrosEsteMes++;
    }
    
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
 * Función para exportar datos a CSV
 * Útil para análisis externos
 */
function exportToCSV() {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    let csvContent = '';
    data.forEach(row => {
      csvContent += row.join(',') + '\n';
    });
    
    const blob = Utilities.newBlob(csvContent, 'text/csv', 'registros_mirame_panama.csv');
    
    return {
      success: true,
      csvContent: csvContent,
      fileName: 'registros_mirame_panama.csv'
    };
    
  } catch (error) {
    console.error('Error exportando CSV:', error);
    return { success: false, error: error.toString() };
  }
}

/**
 * Función para limpiar datos duplicados en la hoja principal
 * Ejecuta esta función para eliminar registros duplicados
 */
function limpiarDuplicados() {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
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
      const cid = row[0]; // C.I.-Participante
      const email = row[8]; // Email
      const key = `${cid}-${email}`;
      
      if (!seen.has(key)) {
        seen.add(key);
        uniqueData.push(row);
      } else {
        duplicatesRemoved++;
      }
    }
    
    // Limpiar la hoja y escribir datos únicos
    sheet.clear();
    sheet.getRange(1, 1, uniqueData.length, uniqueData[0].length).setValues(uniqueData);
    
    // Restaurar formato de encabezados
    const headerRange = sheet.getRange(1, 1, 1, uniqueData[0].length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#2563eb');
    headerRange.setFontColor('#ffffff');
    headerRange.setHorizontalAlignment('center');
    
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
 * Llama a esta función para probar la conexión
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
      email: 'prueba@miramepanama.com',
      timestamp: new Date().toLocaleString('es-PA')
    };
    
    // Simular la función doPost
    const mockEvent = {
      postData: {
        contents: JSON.stringify(testData)
      },
      parameter: {
        ip: '127.0.0.1',
        userAgent: 'Test Connection'
      }
    };
    
    const result = doPost(mockEvent);
    console.log('Prueba de conexión exitosa:', result.getContent());
    
    return {
      success: true,
      message: 'Script funcionando correctamente'
    };
    
  } catch (error) {
    console.error('Error en prueba de conexión:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}
