# 📝 Instrucciones para Actualizar Google Apps Script con el Nuevo Campo

## ✅ Resumen de Cambios

Se agregó el campo **"¿Cómo quieres participar?"** con las opciones:
- **Socio**
- **Voluntariado**

Este campo ahora aparece en:
- ✅ El formulario HTML (index.html)
- ✅ Las validaciones JavaScript (script-simple.js)
- ✅ Google Apps Script (google-apps-script-codigo-actualizado.js)

---

## 🚀 Pasos para Actualizar tu Google Apps Script

### **Opción 1: Si NO tienes registros aún (Hoja vacía)**

1. Abre tu **Google Sheets**
2. Ve a **Extensiones** → **Apps Script**
3. Selecciona TODO el código actual (Ctrl + A)
4. Elimínalo
5. Copia TODO el contenido del archivo `google-apps-script-codigo-actualizado.js`
6. Pégalo en el editor de Apps Script
7. Guarda (Ctrl + S)
8. **¡Listo!** Los nuevos registros incluirán el campo automáticamente

### **Opción 2: Si YA tienes registros (Hoja con datos)**

1. **Actualiza el código:**
   - Abre tu **Google Sheets**
   - Ve a **Extensiones** → **Apps Script**
   - Selecciona TODO el código actual (Ctrl + A)
   - Elimínalo
   - Copia TODO el contenido del archivo `google-apps-script-codigo-actualizado.js`
   - Pégalo en el editor de Apps Script
   - Guarda (Ctrl + S)

2. **Agrega la nueva columna a tus datos existentes:**
   - En el editor de Apps Script, busca el menú desplegable arriba
   - Selecciona la función: `actualizarHojaConNuevaColumna`
   - Haz clic en el botón **▶️ Ejecutar**
   - Autoriza los permisos si te lo pide
   - Revisa los **Logs** en la parte inferior
   - Deberías ver: `✅ Nueva columna agregada exitosamente`

3. **Verifica en Google Sheets:**
   - Vuelve a tu Google Sheets
   - Deberías ver la nueva columna **"¿Cómo quieres participar?"** entre "Email" y "Fecha y Hora de Registro"
   - La columna estará vacía para registros antiguos (eso es normal)
   - Los nuevos registros incluirán el valor seleccionado

---

## 📊 Estructura de la Base de Datos Actualizada

Las columnas ahora son (en orden):

1. C.I.-Participante
2. Primer Nombre
3. Primer Apellido
4. Fecha de Nacimiento
5. Provincia
6. Distrito
7. Corregimiento
8. Celular
9. Email
10. **¿Cómo quieres participar?** ⬅️ **NUEVO**
11. Fecha y Hora de Registro
12. Timestamp (Ordenamiento) - *oculta*

---

## ✅ Verificación

Después de actualizar:

1. **Prueba el formulario:**
   - Abre tu formulario HTML
   - Completa el formulario
   - En el campo "¿Cómo quieres participar?" selecciona "Socio" o "Voluntariado"
   - Envía el formulario

2. **Verifica en Google Sheets:**
   - Abre tu Google Sheets
   - Busca el nuevo registro
   - La columna 10 debe tener "Socio" o "Voluntariado"

---

## ⚠️ Notas Importantes

- **Registros antiguos**: Si ya tienes registros, la nueva columna estará vacía para esos registros. Esto es normal y esperado.
- **Nuevos registros**: Todos los registros nuevos incluirán el campo "¿Cómo quieres participar?"
- **Campo obligatorio**: El campo es obligatorio, todos los nuevos registros deben seleccionar "Socio" o "Voluntariado"

---

## 🔧 Función de Actualización Automática

La función `actualizarHojaConNuevaColumna()` hace lo siguiente:

- ✅ Verifica si la columna ya existe (si existe, no hace nada)
- ✅ Inserta la nueva columna en la posición correcta (después de Email)
- ✅ Formatea el encabezado igual que los demás
- ✅ Formatea las filas vacías con el mismo estilo
- ✅ Ajusta el ancho de la columna automáticamente

**No afecta tus datos existentes**, solo agrega la nueva columna.

---

## 🆘 Solución de Problemas

### **Error: "No se encontró la hoja de registros"**
- Verifica que el nombre de tu hoja sea exactamente `Registros`
- Si es diferente, cambia la constante `SHEET_NAME` en el código

### **Error: "No se pudo abrir la hoja de cálculo"**
- Verifica que el script esté vinculado al spreadsheet correcto
- Si usas `SPREADSHEET_ID`, verifica que sea correcto

### **La columna no aparece después de ejecutar la función**
- Revisa los logs en el editor de Apps Script
- Verifica que la función se ejecutó sin errores
- Recarga tu Google Sheets (F5)

### **Los nuevos registros no guardan el campo**
- Verifica que actualizaste TODO el código de Google Apps Script
- Verifica que la URL de tu formulario HTML apunte al script correcto
- Revisa la consola del navegador (F12) para ver errores

---

**Última actualización**: Noviembre 2025

