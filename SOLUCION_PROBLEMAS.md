# 🔧 Solución de Problemas - Formulario MÍRAME PANAMÁ

## 🚨 Si el formulario no funciona, sigue estos pasos:

### **Paso 1: Diagnóstico Automático**
1. **Abre `diagnostico.html`** en tu navegador
2. **Revisa el estado del sistema** en la parte superior
3. **Ejecuta las pruebas** haciendo clic en los botones
4. **Revisa el log** para ver qué está fallando

### **Paso 2: Prueba el Formulario Simplificado**
1. **Abre `test.html`** en tu navegador
2. **Llena el formulario** con datos de prueba
3. **Envía el formulario** y revisa la consola (F12)
4. **Verifica** si los datos llegan a Google Sheets

### **Paso 3: Verifica la Consola del Navegador**
1. **Abre la consola** (F12 → Console)
2. **Busca errores** en rojo
3. **Revisa los logs** que empiecen con 🚀, ✅, o ❌

## 🔍 Problemas Comunes y Soluciones

### **❌ "Formulario no se envía"**
**Posibles causas:**
- JavaScript no se está cargando
- Error en las validaciones
- Problema con Google Apps Script

**Soluciones:**
1. Abre `diagnostico.html` y ejecuta "Probar Formulario Principal"
2. Si falla, usa `test.html` como alternativa
3. Verifica que `script-simple.js` esté en la misma carpeta

### **❌ "Datos no llegan a Google Sheets"**
**Posibles causas:**
- URL de Google Apps Script incorrecta
- Script no desplegado correctamente
- Problemas de CORS

**Soluciones:**
1. Ejecuta "Probar Conexión Google Sheets" en `diagnostico.html`
2. Verifica que el Google Apps Script esté desplegado como "Aplicación web"
3. Asegúrate de que el acceso sea "Cualquiera"

### **❌ "Campos no se validan"**
**Posibles causas:**
- Event listeners no se están configurando
- IDs de campos incorrectos
- JavaScript con errores

**Soluciones:**
1. Revisa la consola del navegador (F12)
2. Verifica que todos los campos tengan los IDs correctos
3. Usa el formulario de prueba (`test.html`)

### **❌ "Formateo automático no funciona"**
**Posibles causas:**
- Event listeners no configurados
- Campos no encontrados

**Soluciones:**
1. Verifica que los campos existan en el HTML
2. Revisa la consola para errores de JavaScript
3. Usa `script-simple.js` que tiene mejor manejo de errores

## 🛠️ Herramientas de Diagnóstico

### **📁 Archivos Creados:**
1. **`diagnostico.html`** - Herramienta completa de diagnóstico
2. **`test.html`** - Formulario simplificado para pruebas
3. **`script-simple.js`** - JavaScript simplificado y más robusto

### **🎯 Cómo Usar las Herramientas:**

#### **Diagnóstico Completo:**
```bash
# Abre en tu navegador:
diagnostico.html
```

#### **Prueba Rápida:**
```bash
# Abre en tu navegador:
test.html
```

#### **Formulario Principal Mejorado:**
```bash
# Abre en tu navegador:
index.html
```

## 📊 Verificación de Google Sheets

### **Para verificar que los datos llegan:**
1. **Ve a tu hoja de Google Sheets**
2. **Busca una nueva fila** después de enviar el formulario
3. **Verifica** que los datos estén en las columnas correctas

### **Estructura esperada en Google Sheets:**
```
CID-Participante | Nombre Completo | Fecha Nacimiento | Provincia | Distrito | Corregimiento | Celular | Email | Timestamp
```

## 🚀 Pasos de Recuperación

### **Si nada funciona:**
1. **Usa `test.html`** - Es la versión más simple y confiable
2. **Verifica Google Apps Script** - Asegúrate de que esté desplegado
3. **Revisa la consola** - Busca errores específicos
4. **Contacta soporte** - Con los logs del diagnóstico

### **Para restaurar funcionamiento:**
1. **Copia el contenido** de `script-simple.js`
2. **Reemplaza** el contenido de `script.js`
3. **Actualiza** `index.html` para usar `script.js`
4. **Prueba** el formulario

## 📞 Información de Soporte

### **Para obtener ayuda:**
1. **Ejecuta `diagnostico.html`**
2. **Copia todo el log** que aparece
3. **Incluye** la información del estado del sistema
4. **Menciona** qué pruebas fallaron

### **Información útil para soporte:**
- Sistema operativo
- Navegador usado
- Errores de la consola
- Resultados del diagnóstico

---

**💡 Tip:** Siempre usa `diagnostico.html` primero para identificar el problema específico antes de buscar ayuda.
