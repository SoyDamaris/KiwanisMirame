# 📋 Configuración Paso a Paso para Ver los Registros

## 🚀 Método Rápido (Google Forms)

### Paso 1: Crear el Formulario
1. Ve a [Google Forms](https://forms.google.com)
2. Haz clic en "Crear un formulario en blanco"
3. Configura los campos exactamente así:

| Campo | Tipo | Configuración |
|-------|------|---------------|
| Nombre Completo | Respuesta corta | ✅ Obligatorio |
| Dirección | Párrafo | ✅ Obligatorio |
| Correo Electrónico | Respuesta corta | ✅ Obligatorio, validación de email |
| Fecha de Nacimiento | Fecha | ✅ Obligatorio |
| Cédula | Respuesta corta | ✅ Obligatorio |

### Paso 2: Conectar con Google Sheets
1. En tu formulario, haz clic en **"Respuestas"**
2. Haz clic en **"Crear hoja de cálculo"**
3. Se abrirá una nueva hoja de cálculo con todos los registros

### Paso 3: Obtener el Enlace de Envío
1. En tu formulario, haz clic en **"Enviar"**
2. Copia el enlace que aparece
3. Reemplaza la URL en el archivo `script.js`:

```javascript
// En script.js, línea 3, cambia esto:
const GOOGLE_SHEETS_URL = 'TU_ENLACE_AQUI';
```

## 🛠️ Método Avanzado (Google Apps Script)

### Paso 1: Crear Hoja de Cálculo
1. Ve a [Google Sheets](https://sheets.google.com)
2. Crea una nueva hoja de cálculo
3. Nombra las columnas en la fila 1:
   - A1: Nombre Completo
   - B1: Dirección
   - C1: Correo Electrónico
   - D1: Fecha de Nacimiento
   - E1: Cédula
   - F1: Fecha y Hora de Registro

### Paso 2: Configurar Google Apps Script
1. En tu hoja de cálculo, ve a **"Extensiones" → "Apps Script"**
2. Borra todo el código existente
3. Copia y pega el contenido del archivo `google-apps-script.js`
4. Guarda el proyecto (Ctrl+S)

### Paso 3: Desplegar como Aplicación Web
1. Haz clic en **"Implementar" → "Nueva implementación"**
2. Configura así:
   - **Tipo**: Aplicación web
   - **Ejecutar como**: Yo
   - **Quién tiene acceso**: Cualquiera
3. Haz clic en **"Implementar"**
4. **Copia la URL** que aparece

### Paso 4: Actualizar el Código
En `script.js`, reemplaza:
```javascript
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
```

Con tu URL real.

## 📊 Cómo Ver los Registros

### En Google Sheets:
1. **Abre tu hoja de cálculo**
2. **Los datos aparecen en tiempo real** cuando alguien envía el formulario
3. **Cada fila es un registro** nuevo
4. **La última columna** muestra la fecha y hora exacta

### Características Adicionales:
- ✅ **Backup automático** diario (método avanzado)
- ✅ **Estadísticas** de registros por día/semana/mes
- ✅ **Exportación a CSV** para análisis
- ✅ **Formato automático** con colores alternados

## 🔍 Verificación Rápida

Para probar que funciona:
1. Abre `index.html` en tu navegador
2. Llena el formulario con datos de prueba
3. Envía el formulario
4. Ve a tu hoja de Google Sheets
5. ¡Deberías ver los datos aparecer!

## 📱 Acceso desde Móvil

Puedes ver los registros desde cualquier dispositivo:
- **Abre Google Sheets** en tu móvil
- **Busca tu hoja de cálculo**
- **Los datos se sincronizan** automáticamente

## 🚨 Solución de Problemas

### Si no aparecen los datos:
1. **Verifica la URL** en `script.js`
2. **Revisa la consola** del navegador (F12) para errores
3. **Asegúrate** de que el script esté desplegado correctamente
4. **Prueba** con datos simples primero

### Si hay errores de permisos:
1. **Autoriza** el script la primera vez que se ejecute
2. **Verifica** que el acceso sea "Cualquiera" en la implementación
3. **Revisa** los permisos de la hoja de cálculo

---

**💡 Tip**: El método de Google Forms es más fácil para empezar, pero el método de Google Apps Script te da más control y funcionalidades avanzadas.
