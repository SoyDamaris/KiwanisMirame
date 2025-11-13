# 🔄 Guía de Backup - Kiwanis Mírame Panamá

Esta guía explica cómo usar las funciones de backup que se han agregado a tu Google Apps Script. Estas funciones **NO afectan** el funcionamiento normal de tu sistema de registro.

## 📋 Índice

1. [Tipos de Backup Disponibles](#tipos-de-backup-disponibles)
2. [Cómo Usar las Funciones](#cómo-usar-las-funciones)
3. [Backups Automáticos](#backups-automáticos)
4. [Verificar Backups](#verificar-backups)
5. [Recomendaciones](#recomendaciones)

---

## 📦 Tipos de Backup Disponibles

### 1. **Backup en Hoja** (`crearBackupEnHoja`)
- Crea una copia de la hoja "Registros" dentro del mismo Google Sheets
- Nombre: `Backup_Registros_YYYY-MM-DD_HH-MM-SS`
- **Ventaja**: Fácil acceso y visualización
- **Ubicación**: En el mismo archivo de Google Sheets

### 2. **Backup CSV en Drive** (`crearBackupEnDrive`)
- Crea un archivo CSV con todos los datos
- Nombre: `Backup_KIWANIS_Registros_YYYY-MM-DD_HH-MM-SS.csv`
- **Ventaja**: Archivo ligero, fácil de descargar y compatible con Excel
- **Ubicación**: En la raíz de tu Google Drive

### 3. **Backup Completo en Drive** (`crearBackupCompletoDrive`)
- Crea una copia completa del archivo de Google Sheets
- Nombre: `Backup_Completo_KIWANIS_YYYY-MM-DD_HH-MM-SS`
- **Ventaja**: Backup completo con todas las hojas y formato
- **Ubicación**: En la raíz de tu Google Drive

### 4. **Backup Completo (Todos)** (`crearBackupCompleto`)
- Crea los 3 tipos de backup a la vez
- **Ventaja**: Máxima seguridad, múltiples copias
- **Nota**: Tarda más tiempo en ejecutarse

---

## 🚀 Cómo Usar las Funciones

### Paso 1: Acceder al Editor de Google Apps Script

1. Abre tu Google Sheets
2. Ve a **Extensiones** > **Apps Script**
3. El código con las funciones de backup ya está incluido

### Paso 2: Ejecutar una Función de Backup

#### **Opción A: Backup Rápido (CSV en Drive)**
```javascript
// Selecciona la función "crearBackupEnDrive" en el menú desplegable
// Haz clic en el botón "Ejecutar" ▶️
```

#### **Opción B: Backup en Hoja**
```javascript
// Selecciona la función "crearBackupEnHoja" en el menú desplegable
// Haz clic en el botón "Ejecutar" ▶️
```

#### **Opción C: Backup Completo (Recomendado)**
```javascript
// Selecciona la función "crearBackupCompleto" en el menú desplegable
// Haz clic en el botón "Ejecutar" ▶️
```

### Paso 3: Verificar el Resultado

1. Revisa los **Logs** en la parte inferior del editor
2. Busca el mensaje: `✅ Backup creado exitosamente`
3. Los archivos aparecerán en tu Google Drive o en una nueva hoja del spreadsheet

---

## ⏰ Backups Automáticos

### Configurar Backup Automático Mensual

1. En el editor de Apps Script, selecciona la función `configurarBackupAutomatico`
2. Ejecuta la función (clic en ▶️)
3. El backup se ejecutará automáticamente el **día 1 de cada mes a las 3:00 AM**

**Nota**: El backup automático crea archivos CSV en Google Drive para ahorrar espacio.

### Verificar Triggers Configurados

1. En el editor de Apps Script, ve a **Triggers** (Reloj) en el menú izquierdo
2. Verás el trigger configurado: `ejecutarBackupAutomatico`
3. Puedes editarlo o eliminarlo desde ahí

---

## 📊 Verificar Backups

### Listar Todos los Backups

1. Ejecuta la función `listarBackups`
2. Revisa los logs para ver:
   - Número de hojas de backup
   - Número de archivos en Drive
   - Fechas de creación

### Buscar Backups en Google Drive

1. Ve a [Google Drive](https://drive.google.com)
2. Busca archivos que empiecen con:
   - `Backup_KIWANIS_Registros_` (archivos CSV)
   - `Backup_Completo_KIWANIS_` (archivos completos)

### Buscar Backups en Google Sheets

1. Abre tu Google Sheets
2. En la parte inferior, busca hojas que empiecen con:
   - `Backup_Registros_`

---

## 💡 Recomendaciones

### Frecuencia de Backups

- **Mensual**: Configurado automáticamente para el día 1 de cada mes
- **Manual**: Ejecuta backups manualmente cuando lo necesites
- **Antes de cambios importantes**: Antes de modificar la estructura de datos

### Almacenamiento

- Los archivos CSV son más ligeros (ideal para backups frecuentes)
- Los backups completos son más grandes pero más seguros
- Considera mover los backups antiguos a una carpeta específica en Drive

### Organización

1. Crea una carpeta en Google Drive llamada `Backups_KIWANIS`
2. Modifica las funciones para guardar ahí (opcional):
   ```javascript
   // En crearBackupEnDrive() y crearBackupCompletoDrive()
   // Cambia esta línea:
   const folder = DriveApp.getRootFolder();
   // Por:
   const folder = DriveApp.getFoldersByName('Backups_KIWANIS').next();
   ```

### Limpieza de Backups Antiguos

Puedes eliminar manualmente:
- Backups de más de 6 meses (si tienes backups mensuales)
- Mantén al menos los últimos 12 backups mensuales (1 año de respaldos)

---

## 🔧 Funciones Disponibles

| Función | Descripción | Uso |
|---------|-------------|-----|
| `crearBackupEnHoja()` | Backup en nueva hoja del mismo spreadsheet | Rápido, acceso inmediato |
| `crearBackupEnDrive()` | Backup CSV en Google Drive | Ligero, compatible con Excel |
| `crearBackupCompletoDrive()` | Copia completa del spreadsheet en Drive | Completo, incluye formato |
| `crearBackupCompleto()` | Crea los 3 tipos de backup | Máxima seguridad |
| `configurarBackupAutomatico()` | Configura backup mensual automático | Programación |
| `listarBackups()` | Muestra todos los backups existentes | Verificación |

---

## ⚠️ Importante

- **Las funciones de backup NO modifican** tus datos originales
- **Puedes ejecutar backups** en cualquier momento sin riesgo
- **Los backups automáticos** requieren que el script tenga permisos de acceso a Drive
- **Primera ejecución**: Puede pedirte permisos de acceso (autoriza todos los permisos necesarios)

---

## 🆘 Solución de Problemas

### Error: "No se pudo abrir la hoja de cálculo"
- Verifica que el script esté vinculado al spreadsheet correcto
- Si usas `SPREADSHEET_ID`, verifica que sea correcto

### Error: "No se encontró la hoja de registros"
- Verifica que el nombre de la hoja sea exactamente `Registros`
- Puedes cambiar `SHEET_NAME` en el código si es diferente

### Error de Permisos
- La primera vez, otorga todos los permisos solicitados
- Ve a **Triggers** > **Autorización** si es necesario

### Backup Automático No Funciona
- Verifica que el trigger esté configurado en **Triggers**
- Revisa los logs de ejecución en el editor de Apps Script

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en el editor de Apps Script
2. Verifica que todas las funciones existentes sigan funcionando
3. Asegúrate de tener permisos en Google Drive

---

**Última actualización**: Noviembre 2025

