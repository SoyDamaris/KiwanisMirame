# 🔄 Actualizar Google Apps Script con Nuevos Campos

## ✅ **URL Actualizada en Todos los Archivos**

He actualizado la URL de Google Apps Script en todos los archivos del proyecto:
- `script.js`
- `script-simple.js` 
- `test.html`
- `diagnostico.html`

**Nueva URL:** `https://script.google.com/macros/s/AKfycbyk1PBlVP-gHHcjRSwykkK3BlZ85F1mi6F6FALnmPrd5-50RdGGAY3dbqkBGKo-PM50oQ/exec`

## 🚀 **Pasos para Actualizar tu Google Apps Script**

### **Paso 1: Actualizar el Código del Script**

1. **Ve a tu Google Apps Script** en [script.google.com](https://script.google.com)
2. **Abre el proyecto** con el ID: `AKfycbyk1PBlVP-gHHcjRSwykkK3BlZ85F1mi6F6FALnmPrd5-50RdGGAY3dbqkBGKo-PM50oQ`
3. **Borra todo el código existente**
4. **Copia y pega** el contenido del archivo `google-apps-script-actualizado.js`
5. **Guarda el proyecto** (Ctrl+S)

### **Paso 2: Verificar la Configuración**

Asegúrate de que el script esté configurado como:
- **Tipo:** Aplicación web
- **Ejecutar como:** Yo
- **Quién tiene acceso:** Cualquiera

### **Paso 3: Probar la Conexión**

1. **Abre `diagnostico.html`** en tu navegador
2. **Haz clic en "Probar Conexión Google Sheets"**
3. **Verifica** que aparezca "✅ Google Sheets funcionando correctamente"

## 📊 **Nuevos Campos que Maneja el Script**

El script actualizado maneja estos campos:

| Campo | Descripción | Validación |
|-------|-------------|------------|
| `cidParticipante` | CID-Participante (X-XXXX-XXXX) | Formato requerido |
| `nombreCompleto` | Nombre Completo | 2-100 caracteres |
| `fechaNacimiento` | Fecha de Nacimiento | Fecha válida |
| `provincia` | Provincia | Selección requerida |
| `distrito` | Distrito | 2-50 caracteres |
| `corregimiento` | Corregimiento | 2-50 caracteres |
| `celular` | Celular (6000-0000) | Formato requerido |
| `email` | Email | Formato de email válido |

## 📋 **Estructura de la Hoja de Cálculo**

El script creará automáticamente estas columnas:

```
A: CID-Participante
B: Nombre Completo  
C: Fecha de Nacimiento
D: Provincia
E: Distrito
F: Corregimiento
G: Celular
H: Email
I: Fecha y Hora de Registro
J: IP Address
K: User Agent
```

## 🧪 **Probar el Formulario**

### **Opción 1: Formulario Principal**
```bash
# Abre en tu navegador:
index.html
```

### **Opción 2: Formulario de Prueba**
```bash
# Abre en tu navegador:
test.html
```

### **Opción 3: Diagnóstico Completo**
```bash
# Abre en tu navegador:
diagnostico.html
```

## 🔧 **Funciones Adicionales del Script**

El script actualizado incluye:

1. **✅ Validación de campos** - Verifica que todos los campos requeridos estén presentes
2. **✅ Formateo automático** - Crea encabezados y formatea las celdas
3. **✅ Sistema de backup** - Crea copias de seguridad diarias
4. **✅ Estadísticas** - Función para obtener estadísticas de registros
5. **✅ Exportación CSV** - Función para exportar datos
6. **✅ Prueba de conexión** - Función para verificar que todo funciona

## 🚨 **Solución de Problemas**

### **Si aparece "Script function not found: doGet"**
- Es **normal** - tu script solo necesita la función `doPost`
- **No afecta** el funcionamiento del formulario

### **Si los datos no llegan a Google Sheets**
1. **Verifica** que el script esté desplegado como "Aplicación web"
2. **Confirma** que el acceso sea "Cualquiera"
3. **Ejecuta** la función `testConnection()` en el script

### **Para probar manualmente el script**
1. **Abre tu Google Apps Script**
2. **Ejecuta** la función `testConnection()`
3. **Revisa** los logs para ver si hay errores

## 📞 **Verificación Final**

Después de actualizar el script:

1. ✅ **Formulario funciona** - Los datos se envían sin errores
2. ✅ **Datos en Google Sheets** - Aparecen en la hoja de cálculo
3. ✅ **Validaciones funcionan** - Los campos se validan correctamente
4. ✅ **Formateo automático** - CID y celular se formatean automáticamente

---

**💡 Tip:** Si tienes problemas, usa `diagnostico.html` para identificar exactamente qué está fallando.
