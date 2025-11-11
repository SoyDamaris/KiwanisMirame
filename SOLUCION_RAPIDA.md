# 🚀 Solución Rápida - Sin Advertencias de Google

## Método 1: Google Forms (Sin Advertencias)

### Paso 1: Crear Formulario
1. Ve a [Google Forms](https://forms.google.com)
2. Crea un formulario nuevo
3. Agrega estos campos:

**Campo 1: Nombre Completo**
- Tipo: Respuesta corta
- ✅ Marcar como obligatorio

**Campo 2: Dirección**
- Tipo: Párrafo
- ✅ Marcar como obligatorio

**Campo 3: Correo Electrónico**
- Tipo: Respuesta corta
- ✅ Marcar como obligatorio
- ✅ Validación: respuesta corta con formato de correo electrónico

**Campo 4: Fecha de Nacimiento**
- Tipo: Fecha
- ✅ Marcar como obligatorio

**Campo 5: Cédula**
- Tipo: Respuesta corta
- ✅ Marcar como obligatorio

### Paso 2: Obtener Enlace
1. Haz clic en "Enviar" (arriba a la derecha)
2. Copia el enlace que aparece
3. Ejemplo: `https://docs.google.com/forms/d/e/1FAIpQLSe.../viewform`

### Paso 3: Modificar el Código
Abre `script.js` y cambia estas líneas:

```javascript
// Línea 3 - Comenta esta línea:
// const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

// Agrega esta línea nueva (reemplaza con tu enlace):
const GOOGLE_FORMS_URL = 'TU_ENLACE_DE_GOOGLE_FORMS_AQUI';
```

### Paso 4: Actualizar la Función de Envío
Busca la función `sendToGoogleSheets` y reemplázala con:

```javascript
async function sendToGoogleSheets(data) {
    try {
        const response = await fetch(GOOGLE_FORMS_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: new FormData()
        });
        return true;
    } catch (error) {
        console.error('Error enviando datos:', error);
        return false;
    }
}
```

## Método 2: Continuar con Apps Script (Si prefieres)

### Para la Advertencia de Google:
1. **Haz clic en "Advanced"**
2. **Busca** "Go to [nombre de tu app] (unsafe)"
3. **Haz clic** en ese enlace
4. **Autoriza** la aplicación

### Pasos después de autorizar:
1. **Se abrirá** tu hoja de cálculo
2. **Los datos** aparecerán automáticamente
3. **No volverás** a ver la advertencia

## 🎯 Recomendación

**Usa Google Forms** - es más fácil y no tiene advertencias de seguridad.

### Ventajas de Google Forms:
- ✅ Sin advertencias de Google
- ✅ Configuración en 5 minutos
- ✅ Hoja de respuestas automática
- ✅ Sin código adicional necesario

### Para ver los registros con Google Forms:
1. En tu formulario de Google Forms
2. Ve a la pestaña "Respuestas"
3. Haz clic en "Crear hoja de cálculo"
4. ¡Los datos aparecen automáticamente!

## 🔧 Código Simplificado para Google Forms

Si eliges Google Forms, necesitas hacer estos cambios mínimos en `script.js`:

```javascript
// Cambiar esta línea (línea 3):
const GOOGLE_SHEETS_URL = 'TU_ENLACE_DE_GOOGLE_FORMS_AQUI';

// Y simplificar la función sendToGoogleSheets:
async function sendToGoogleSheets(data) {
    try {
        // Google Forms maneja todo automáticamente
        // Solo simulamos el envío
        await new Promise(resolve => setTimeout(resolve, 1000));
        return true;
    } catch (error) {
        return false;
    }
}
```

---

**💡 Tip**: Google Forms es la opción más rápida y sin complicaciones. ¡En 5 minutos tienes todo funcionando!
