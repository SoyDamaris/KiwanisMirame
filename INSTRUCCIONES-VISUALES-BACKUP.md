# 📍 Dónde Encontrar las Funciones de Backup

Esta guía te muestra **exactamente dónde** encontrar y ejecutar las funciones de backup en Google Apps Script.

---

## 🎯 Paso a Paso: Acceder a las Funciones de Backup

### **Paso 1: Abre tu Google Sheets**

1. Ve a [Google Sheets](https://sheets.google.com)
2. Abre tu hoja de cálculo donde tienes los registros (la que usa el formulario)

### **Paso 2: Accede al Editor de Apps Script**

En tu Google Sheets, ve a:

```
📊 Google Sheets → Extensiones → Apps Script
```

**Ubicación exacta en el menú:**
- En la barra superior, busca **"Extensiones"** (Extensión)
- Haz clic en **"Extensiones"**
- Selecciona **"Apps Script"** (Script de aplicaciones)

### **Paso 3: Ver el Código**

Se abrirá una nueva pestaña con el editor de Apps Script. Verás:

```
📝 Editor de Apps Script
├── 📁 Archivos (izquierda)
├── 📝 Código en el centro
└── ▶️ Botón "Ejecutar" (arriba)
```

### **Paso 4: Buscar las Funciones de Backup**

En el editor de código, las funciones de backup están al **FINAL DEL ARCHIVO**:

```javascript
// Busca estas funciones:
function crearBackupEnHoja()        // Línea ~712
function crearBackupEnDrive()       // Línea ~784
function crearBackupCompletoDrive() // Línea ~869
function crearBackupCompleto()      // Línea ~923
function configurarBackupAutomatico() // Línea ~989
function listarBackups()            // Línea ~1057
```

---

## ▶️ Cómo Ejecutar una Función

### **Método 1: Usando el Menú Desplegable**

1. En la parte superior del editor, verás un menú desplegable que dice:
   ```
   [Ejecutar función] ▼
   ```
   
2. Haz clic en la flecha ▼ para ver todas las funciones disponibles

3. Busca y selecciona una de estas funciones:
   - `crearBackupEnHoja`
   - `crearBackupEnDrive`
   - `crearBackupCompletoDrive`
   - `crearBackupCompleto`
   - `configurarBackupAutomatico`
   - `listarBackups`

4. Haz clic en el botón **▶️ Ejecutar** (icono de play)

5. La primera vez, te pedirá **permisos de autorización**

### **Método 2: Escribir el Nombre Directamente**

1. En el menú desplegable, escribe el nombre de la función, por ejemplo:
   ```
   crearBackupEnDrive
   ```

2. Haz clic en **▶️ Ejecutar**

---

## 🔍 Ubicación Visual de las Funciones en el Código

```
google-apps-script-codigo-actualizado.js
│
├── [Inicio del archivo - líneas 1-697]
│   ├── Configuración
│   ├── doGet()
│   ├── doPost()
│   ├── createHeaders()
│   ├── formatDataRow()
│   └── ... otras funciones ...
│
└── [FUNCIONES DE BACKUP - líneas 699-1125]
    ├── 📌 crearBackupEnHoja()          ← Línea ~712
    ├── 📌 crearBackupEnDrive()         ← Línea ~784
    ├── 📌 crearBackupCompletoDrive()   ← Línea ~869
    ├── 📌 crearBackupCompleto()        ← Línea ~923
    ├── 📌 configurarBackupAutomatico() ← Línea ~989
    ├── 📌 ejecutarBackupAutomatico()   ← Línea ~1025
    └── 📌 listarBackups()              ← Línea ~1057
```

---

## 🎬 Ejemplo Práctico: Crear tu Primer Backup

### **Ejemplo 1: Backup Rápido (CSV en Drive)**

1. ✅ Abre Google Sheets
2. ✅ Extensiones → Apps Script
3. ✅ En el menú desplegable, selecciona: `crearBackupEnDrive`
4. ✅ Haz clic en **▶️ Ejecutar**
5. ✅ Autoriza los permisos (solo la primera vez)
6. ✅ Espera unos segundos
7. ✅ Revisa los **Logs** en la parte inferior
8. ✅ Verás: `✅ Backup creado en Drive: Backup_KIWANIS_Registros_...`

### **Ejemplo 2: Configurar Backup Mensual Automático**

1. ✅ Abre Google Sheets
2. ✅ Extensiones → Apps Script
3. ✅ En el menú desplegable, selecciona: `configurarBackupAutomatico`
4. ✅ Haz clic en **▶️ Ejecutar**
5. ✅ Autoriza los permisos
6. ✅ Verás en los logs: `✅ Backup automático configurado: se ejecutará mensualmente...`

---

## 📊 Ver los Resultados

### **Después de Ejecutar una Función:**

1. **Revisa los Logs** (parte inferior del editor):
   - Busca mensajes como: `✅ Backup creado exitosamente`
   - O errores si algo salió mal

2. **Ver el Resultado en Google Drive:**
   - Ve a [Google Drive](https://drive.google.com)
   - Busca archivos que empiecen con: `Backup_KIWANIS_Registros_`
   - Los backups CSV aparecerán allí

3. **Ver el Resultado en Google Sheets:**
   - Si usaste `crearBackupEnHoja()`
   - Vuelve a tu Google Sheets
   - En la parte inferior, busca una hoja nueva: `Backup_Registros_...`

---

## 🔔 Verificar Triggers (Backups Automáticos)

Para ver si el backup automático está configurado:

1. En el editor de Apps Script, en el menú izquierdo:
   - Busca el ícono de **⏰ Reloj** o **"Triggers"**
   - Haz clic en él

2. Verás una lista de triggers configurados:
   - Busca: `ejecutarBackupAutomatico`
   - Frecuencia: `Mensual el día 1 a las 3:00 AM`

---

## ❓ Preguntas Frecuentes

### **¿Dónde está el botón "Ejecutar"?**
- En la parte superior del editor de Apps Script
- Es un ícono de ▶️ (play/triángulo)
- O presiona `Ctrl + Enter` (Windows) o `Cmd + Enter` (Mac)

### **¿No veo las funciones en el menú desplegable?**
- Asegúrate de haber guardado el código (`Ctrl + S`)
- Recarga la página del editor
- Verifica que el código completo esté pegado

### **¿Cómo sé que el backup se creó?**
- Revisa los **Logs** (parte inferior del editor)
- Busca el mensaje: `✅ Backup creado exitosamente`
- Ve a Google Drive y busca archivos con `Backup_KIWANIS_`

### **¿Dónde se guardan los backups?**
- **CSV**: En la raíz de tu Google Drive
- **Hojas**: En el mismo Google Sheets (nueva hoja)
- **Completos**: En la raíz de tu Google Drive

---

## 🆘 Si No Puedes Encontrar las Funciones

1. **Verifica que el código esté completo:**
   - El archivo debe tener más de 1100 líneas
   - Busca la sección: `FUNCIONES DE BACKUP`

2. **Copia el código actualizado:**
   - Si no encuentras las funciones, copia todo el contenido de `google-apps-script-codigo-actualizado.js`
   - Pégalo en el editor de Apps Script
   - Guarda (`Ctrl + S`)

3. **Revisa el final del archivo:**
   - Usa `Ctrl + End` para ir al final del archivo
   - Deberías ver las funciones de backup ahí

---

## 📸 Ubicación Visual en la Interfaz

```
┌─────────────────────────────────────────────────┐
│  Google Sheets - Tu Archivo                     │
│  [Archivo] [Editar] [Ver] [Insertar] ... [Ext] │
│                            ▲                     │
│                            │                     │
│                    Haz clic aquí                │
└─────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────┐
│  Extensiones                                     │
│  • Apps Script          ← Haz clic aquí         │
│  • Complementos                                 │
│  • Administrar complementos...                  │
└─────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────┐
│  Editor de Apps Script                          │
│  ┌─────────────────────────────────────────┐   │
│  │ [Ejecutar función ▼]  [▶️ Ejecutar]    │   │
│  │                    ▲                     │   │
│  │                    │                     │   │
│  │         Selecciona función aquí         │   │
│  └─────────────────────────────────────────┘   │
│                                                  │
│  [Código aquí...]                                │
│                                                  │
│  ┌─────────────────────────────────────────┐   │
│  │ Logs (abajo)                            │   │
│  │ ✅ Backup creado exitosamente...        │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

---

**Si tienes dudas, revisa los logs después de ejecutar cualquier función.**

