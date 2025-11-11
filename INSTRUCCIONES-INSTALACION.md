# 📋 INSTRUCCIONES DE INSTALACIÓN - KIWANIS MÍRAME PANAMÁ

## 🔧 Configuración de Google Apps Script y Google Sheets

### Paso 1: Crear o Abrir tu Hoja de Cálculo de Google Sheets

1. Ve a [Google Sheets](https://sheets.google.com)
2. Crea una nueva hoja de cálculo o abre una existente
3. **IMPORTANTE**: Anota el nombre de tu hoja de cálculo (lo necesitarás más adelante)

### Paso 2: Configurar Google Apps Script

1. En tu hoja de cálculo, ve a **Extensiones** → **Apps Script**
2. Se abrirá una nueva pestaña con el editor de Apps Script
3. **Borra todo el código que aparezca por defecto**
4. Abre el archivo `google-apps-script-codigo-actualizado.js` de este proyecto
5. **Copia TODO el contenido** del archivo
6. **Pega el código** en el editor de Apps Script
7. Guarda el proyecto:
   - Presiona **Ctrl+S** (Windows) o **Cmd+S** (Mac)
   - O haz clic en el icono de guardar 💾
   - Dale un nombre al proyecto (ej: "Kiwanis Mirame Panama Formulario")

### Paso 3: Configurar el ID de la Hoja de Cálculo (OPCIONAL)

Si quieres usar una hoja de cálculo específica (no la activa):

1. En el editor de Apps Script, busca esta línea:
   ```javascript
   const SPREADSHEET_ID = ''; // Déjalo vacío para usar la hoja activa
   ```

2. Para obtener el ID de tu hoja:
   - Abre tu hoja de cálculo en Google Sheets
   - Mira la URL en la barra de direcciones
   - La URL se ve así: `https://docs.google.com/spreadsheets/d/ID_AQUI/edit`
   - Copia el `ID_AQUI` (es una cadena larga de letras y números)

3. Pega el ID entre las comillas:
   ```javascript
   const SPREADSHEET_ID = 'TU_ID_AQUI';
   ```

   **NOTA**: Si dejas esto vacío `''`, el script usará automáticamente la hoja de cálculo donde está vinculado.

### Paso 4: Desplegar la Aplicación Web

1. En el editor de Apps Script, haz clic en **Desplegar** → **Nueva implementación**
2. Haz clic en el icono de engranaje ⚙️ junto a "Tipo" y selecciona **Aplicación web**
3. Configura los siguientes parámetros:
   - **Descripción**: "Formulario Kiwanis Mirame Panama" (o el nombre que prefieras)
   - **Ejecutar como**: **Yo** (tu cuenta de Google)
   - **Quién tiene acceso**: **Cualquiera** (esto permite que tu formulario web envíe datos)
4. Haz clic en **Desplegar**
5. **IMPORTANTE**: La primera vez, Google te pedirá autorización:
   - Haz clic en **Autorizar acceso**
   - Selecciona tu cuenta de Google
   - Haz clic en **Avanzado** → **Ir a [nombre del proyecto] (no seguro)**
   - Haz clic en **Permitir**
6. **Copia la URL de la aplicación web** que aparece (se ve así: `https://script.google.com/macros/s/.../exec`)
   - **GUARDA ESTA URL**, la necesitarás en el siguiente paso

### Paso 5: Actualizar el Formulario HTML

1. Abre el archivo `script-simple.js` en tu proyecto
2. Busca esta línea al inicio del archivo:
   ```javascript
   const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbyk1PBlVP-gHHcjRSwykkK3BlZ85F1mi6F6FALnmPrd5-50RdGGAY3dbqkBGKo-PM50oQ/exec';
   ```
3. **Reemplaza la URL** con la URL que copiaste en el Paso 4
4. Guarda el archivo

### Paso 6: Probar la Conexión

1. Abre tu formulario HTML en un navegador
2. Completa el formulario con datos de prueba
3. Haz clic en **Enviar Registro**
4. Si todo funciona correctamente:
   - Verás un mensaje de éxito ✅
   - Los datos aparecerán en tu hoja de cálculo de Google Sheets
   - Los datos estarán organizados con encabezados y formato

### Paso 7: Organizar la Hoja de Cálculo (OPCIONAL)

Si ya tienes datos en tu hoja o quieres aplicar formato a todos los registros:

1. Ve al editor de Apps Script
2. En el menú superior, selecciona la función `organizarHoja`
3. Haz clic en el botón **Ejecutar** ▶️
4. Esto aplicará formato, colores alternados y filtros a todos los datos

---

## 📊 Estructura de Datos en Google Sheets

Tu hoja de cálculo tendrá las siguientes columnas:

1. **C.I.-Participante** - Cédula del participante
2. **Primer Nombre** - Primer nombre
3. **Primer Apellido** - Primer apellido
4. **Fecha de Nacimiento** - Fecha de nacimiento (formato DD/MM/YYYY)
5. **Provincia** - Provincia seleccionada
6. **Distrito** - Distrito ingresado
7. **Corregimiento** - Corregimiento ingresado
8. **Celular** - Número de celular
9. **Email** - Correo electrónico
10. **Fecha y Hora de Registro** - Timestamp del registro
11. **Timestamp (Ordenamiento)** - Columna oculta para ordenamiento interno

---

## 🔍 Funciones Adicionales Disponibles

En el editor de Apps Script, puedes ejecutar estas funciones útiles:

### `getFormStats()`
Obtiene estadísticas de los registros:
- Total de registros
- Registros de hoy
- Registros de esta semana
- Registros de este mes

**Cómo usar:**
1. Selecciona `getFormStats` en el menú de funciones
2. Haz clic en **Ejecutar** ▶️
3. Revisa los resultados en el log

### `limpiarDuplicados()`
Elimina registros duplicados basándose en Cédula y Email

**Cómo usar:**
1. Selecciona `limpiarDuplicados` en el menú de funciones
2. Haz clic en **Ejecutar** ▶️
3. Revisa cuántos duplicados se eliminaron

### `testConnection()`
Prueba que el script funciona correctamente enviando datos de prueba

**Cómo usar:**
1. Selecciona `testConnection` en el menú de funciones
2. Haz clic en **Ejecutar** ▶️
3. Revisa los resultados en el log

### `organizarHoja()`
Aplica formato y organización a toda la hoja de cálculo

**Cómo usar:**
1. Selecciona `organizarHoja` en el menú de funciones
2. Haz clic en **Ejecutar** ▶️
3. La hoja se formateará automáticamente

---

## ⚠️ Solución de Problemas

### El formulario no envía datos

1. **Verifica la URL en `script-simple.js`**:
   - Asegúrate de que la URL sea correcta
   - Debe terminar en `/exec`

2. **Verifica los permisos de la aplicación web**:
   - Ve a Apps Script → Desplegar → Gestionar implementaciones
   - Asegúrate de que "Quién tiene acceso" esté configurado como "Cualquiera"

3. **Revisa la consola del navegador**:
   - Presiona F12 en tu navegador
   - Ve a la pestaña "Console"
   - Busca mensajes de error

### Los datos no aparecen en Google Sheets

1. **Verifica que el script esté vinculado a la hoja correcta**:
   - Abre Apps Script desde la hoja de cálculo donde quieres los datos
   - O configura el `SPREADSHEET_ID` correctamente

2. **Verifica los permisos**:
   - Asegúrate de haber autorizado el script cuando lo desplegaste

3. **Revisa los logs de Apps Script**:
   - Ve a Apps Script → Ver → Logs de ejecución
   - Busca errores

### Error "Campos requeridos faltantes"

- Asegúrate de que todos los campos del formulario tengan el atributo `name` correcto
- Verifica que los nombres de los campos coincidan con los esperados por el script

### Error "Ya existe un registro con esta Cédula y Email"

- El sistema previene duplicados
- Si necesitas permitir duplicados, puedes modificar la función `checkDuplicate` en el script

---

## 📝 Notas Importantes

1. **Seguridad**: La URL de tu aplicación web es pública. Cualquiera que tenga la URL puede enviar datos. Considera implementar validaciones adicionales si es necesario.

2. **Límites de Google Apps Script**:
   - 6 minutos de tiempo de ejecución por solicitud
   - 20,000 solicitudes por día (para cuentas gratuitas)
   - Si esperas más tráfico, considera usar una cuenta de Google Workspace

3. **Backup**: Los datos se guardan directamente en Google Sheets. Google Sheets tiene su propio sistema de versiones y respaldo automático.

4. **Actualizaciones**: Si actualizas el código de Apps Script, necesitas crear una **nueva versión** del despliegue:
   - Ve a Desplegar → Gestionar implementaciones
   - Haz clic en el icono de editar (lápiz)
   - Selecciona "Nueva versión"
   - Guarda

---

## ✅ Checklist de Instalación

- [ ] Hoja de cálculo de Google Sheets creada/abierta
- [ ] Código de Apps Script copiado y pegado
- [ ] Proyecto guardado en Apps Script
- [ ] Aplicación web desplegada
- [ ] Permisos autorizados
- [ ] URL de la aplicación web copiada
- [ ] URL actualizada en `script-simple.js`
- [ ] Formulario probado con datos de prueba
- [ ] Datos aparecen correctamente en Google Sheets
- [ ] Formato aplicado a la hoja (opcional)

---

## 🆘 Soporte

Si tienes problemas:

1. Revisa los logs de ejecución en Apps Script
2. Revisa la consola del navegador (F12)
3. Verifica que todos los pasos se hayan completado correctamente
4. Asegúrate de que la URL de la aplicación web sea correcta

---

**¡Listo! Tu formulario ahora está conectado con Google Sheets y los datos se guardarán automáticamente cada vez que alguien complete el formulario.** 🎉

