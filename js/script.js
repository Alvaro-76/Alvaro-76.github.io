// script.js - VERSIÓN COMPLETA (Menú + Botones de copiar)

document.addEventListener('DOMContentLoaded', function() {
    
    // =============================================
    // 1. DETECTAR SI ESTAMOS EN FILE:// (SIN SERVIDOR)
    // =============================================
    
    if (window.location.protocol === 'file:') {
        mostrarErrorModoLocal();
        return;
    }
    
    // =============================================
    // 2. CARGA DE COMPONENTES
    // =============================================
    
    async function cargarComponentes() {
        try {
            // Cargar menú
            const menuResponse = await fetch('includes/menu.html');
            const menuHTML = await menuResponse.text();
            document.getElementById('menu-container').innerHTML = menuHTML;
            
            // Cargar header
            const headerResponse = await fetch('includes/header.html');
            const headerHTML = await headerResponse.text();
            document.getElementById('header-container').innerHTML = headerHTML;
            
            // Cargar footer
            const footerResponse = await fetch('includes/footer.html');
            const footerHTML = await footerResponse.text();
            document.getElementById('footer-container').innerHTML = footerHTML;
            
            // AHORA QUE LOS COMPONENTES ESTÁN CARGADOS, INICIALIZAMOS TODO
            inicializarMenu();
            actualizarInfoPagina();
            
            // ¡IMPORTANTE! Inicializar botones de copiar
            setupCopyButtons();
            
            // También necesitamos reinicializar botones si el contenido cambia
            // (útil para SPAs o si cargas contenido dinámicamente después)
            
        } catch (error) {
            console.error('Error cargando componentes:', error);
            mostrarErrorCarga(error);
        }
    }
    
    // =============================================
    // 3. FUNCIONES DEL MENÚ LATERAL
    // =============================================
    
    function inicializarMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('bookSidebar');
        const sidebarClose = document.getElementById('sidebarClose');
        const body = document.body;
        
        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.add('open');
                body.classList.add('menu-open');
            });
        }
        
        if (sidebarClose) {
            sidebarClose.addEventListener('click', () => {
                sidebar.classList.remove('open');
                body.classList.remove('menu-open');
            });
        }
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (sidebar && sidebar.classList.contains('open') && 
                !sidebar.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                sidebar.classList.remove('open');
                body.classList.remove('menu-open');
            }
        });
        
        // Expandir/colapsar submenús
        const submenuToggles = document.querySelectorAll('.section-title.has-submenu');
        
        submenuToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('data-toggle');
                const submenu = document.getElementById(targetId);
                
                if (submenu) {
                    this.classList.toggle('expanded');
                    submenu.classList.toggle('expanded');
                }
            });
        });
        
        // Marcar página activa
        marcarPaginaActiva();
    }
    
    function marcarPaginaActiva() {
        if (!window.PAGINA_CONFIG) return;
        
        const paginaActual = window.PAGINA_CONFIG.id;
        
        document.querySelectorAll('.section-title, .submenu-item').forEach(el => {
            el.classList.remove('active');
        });
        
        const elementoActivo = document.querySelector(`[data-page="${paginaActual}"]`);
        if (elementoActivo) {
            elementoActivo.classList.add('active');
            
            if (elementoActivo.classList.contains('submenu-item')) {
                const parentSubmenu = elementoActivo.closest('.submenu');
                if (parentSubmenu) {
                    const toggleButton = document.querySelector(`[data-toggle="${parentSubmenu.id}"]`);
                    if (toggleButton) {
                        toggleButton.classList.add('expanded');
                        parentSubmenu.classList.add('expanded');
                    }
                }
            }
        }
    }
    
    function actualizarInfoPagina() {
        if (!window.PAGINA_CONFIG) return;
        
        const tituloElement = document.getElementById('page-title');
        if (tituloElement && window.PAGINA_CONFIG.titulo) {
            tituloElement.textContent = window.PAGINA_CONFIG.titulo;
        }
        
        const subtituloElement = document.getElementById('page-subtitle');
        if (subtituloElement && window.PAGINA_CONFIG.subtitulo) {
            subtituloElement.textContent = window.PAGINA_CONFIG.subtitulo;
        }
        
        if (window.PAGINA_CONFIG.titulo) {
            document.title = `Java Paso a Paso - ${window.PAGINA_CONFIG.titulo}`;
        }
    }
    
    // =============================================
    // 4. FUNCIONES DE BOTONES DE COPIAR (TU CÓDIGO ORIGINAL)
    // =============================================
    
    // Añadir estilos necesarios para los botones de copiar
    function añadirEstilosCopiar() {
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateY(10px); }
                10% { opacity: 1; transform: translateY(0); }
                90% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-10px); }
            }
            
            .copy-message {
                position: absolute;
                bottom: 10px;
                right: 10px;
                background: rgba(0,0,0,0.9);
                color: white;
                padding: 8px 15px;
                border-radius: 20px;
                font-size: 0.8em;
                z-index: 20;
                animation: fadeInOut 2s ease forwards;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                border-left: 3px solid var(--primary-color);
                pointer-events: none;
                font-family: 'Segoe UI', sans-serif;
            }
            
            .copy-button {
                position: absolute;
                top: 45px;
                right: 10px;
                background: linear-gradient(135deg, var(--primary-color), #e07c1b);
                color: white;
                border: none;
                border-radius: 20px;
                padding: 6px 15px;
                font-size: 0.8em;
                font-weight: 500;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                z-index: 10;
                opacity: 0.9;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                border: 1px solid rgba(255,255,255,0.2);
                font-family: 'Segoe UI', sans-serif;
                letter-spacing: 0.3px;
            }
            
            .copy-button:hover {
                opacity: 1;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                background: linear-gradient(135deg, var(--secondary-color), #3a6a8f);
            }
            
            .copy-button:active {
                transform: translateY(0);
            }
            
            .copy-button i {
                font-size: 0.9em;
                transition: transform 0.2s ease;
            }
            
            .copy-button:hover i {
                transform: scale(1.1);
            }
            
            .copy-button.copied {
                background: linear-gradient(135deg, #28a745, #218838);
            }
            
            .code-block {
                position: relative;
            }
            
            .code-block.complete .copy-button,
            .code-block.snippet .copy-button,
            .code-block.warning-code .copy-button {
                top: 45px;
            }
            
            .code-block:not(.complete):not(.snippet):not(.warning-code) .copy-button {
                top: 10px;
            }
            
            @media (max-width: 768px) {
                .copy-button {
                    top: 40px;
                    right: 5px;
                    padding: 4px 10px;
                    font-size: 0.7em;
                }
                
                .copy-button span {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    function showTemporaryMessage(block, message, type = 'info') {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'copy-message';
        msgDiv.textContent = message;
        
        if (type === 'success') {
            msgDiv.style.borderLeftColor = '#28a745';
        } else if (type === 'warning') {
            msgDiv.style.borderLeftColor = '#ffc107';
        } else if (type === 'error') {
            msgDiv.style.borderLeftColor = '#dc3545';
        }
        
        block.appendChild(msgDiv);
        
        setTimeout(() => {
            msgDiv.remove();
        }, 2000);
    }
    
    function fallbackCopy(text, button, block) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        textArea.setSelectionRange(0, 99999);
        
        try {
            document.execCommand('copy');
            
            const originalHTML = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i> <span>¡Copiado!</span>';
            button.classList.add('copied');
            
            if (block.classList.contains('complete')) {
                showTemporaryMessage(block, '✅ Código completo copiado. Pégalo en Eclipse.', 'success');
            } else if (block.classList.contains('snippet')) {
                showTemporaryMessage(block, '📝 Fragmento copiado. Forma parte de un ejemplo.', 'warning');
            } else if (block.classList.contains('warning-code')) {
                showTemporaryMessage(block, '⚠️ Este código contiene errores didácticos.', 'error');
            } else {
                showTemporaryMessage(block, '📋 Código copiado al portapapeles.', 'info');
            }
            
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.classList.remove('copied');
            }, 2000);
            
        } catch (err) {
            console.error('Error al copiar:', err);
            alert('No se pudo copiar el código. Por favor, selecciónalo manualmente.');
        }
        
        document.body.removeChild(textArea);
    }
    
    function setupCopyButtons() {
        console.log('Inicializando botones de copiar...');
        
        const codeBlocks = document.querySelectorAll('.code-block');
        console.log(`Encontrados ${codeBlocks.length} bloques de código`);
        
        codeBlocks.forEach((block) => {
            if (block.querySelector('.copy-button')) return;
            
            const preElement = block.querySelector('pre');
            if (!preElement) return;
            
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-button';
            copyButton.innerHTML = '<i class="fas fa-copy"></i> <span>Copiar</span>';
            
            let blockType = 'default';
            if (block.classList.contains('complete')) blockType = 'complete';
            else if (block.classList.contains('snippet')) blockType = 'snippet';
            else if (block.classList.contains('warning-code')) blockType = 'warning';
            
            copyButton.setAttribute('data-code-type', blockType);
            
            if (window.getComputedStyle(block).position === 'static') {
                block.style.position = 'relative';
            }
            
            block.appendChild(copyButton);
            
            copyButton.addEventListener('click', async function(e) {
                e.stopPropagation();
                
                let codeText = preElement.textContent || preElement.innerText;
                codeText = codeText.trim();
                
                try {
                    if (navigator.clipboard && window.isSecureContext) {
                        await navigator.clipboard.writeText(codeText);
                        
                        const originalHTML = copyButton.innerHTML;
                        copyButton.innerHTML = '<i class="fas fa-check"></i> <span>¡Copiado!</span>';
                        copyButton.classList.add('copied');
                        
                        if (block.classList.contains('complete')) {
                            showTemporaryMessage(block, '✅ Programa completo copiado. Pégalo en Eclipse y ejecuta.', 'success');
                        } else if (block.classList.contains('snippet')) {
                            showTemporaryMessage(block, '📝 Fragmento copiado. Úsalo como referencia.', 'warning');
                        } else if (block.classList.contains('warning-code')) {
                            showTemporaryMessage(block, '⚠️ Este código contiene errores intencionados.', 'error');
                        } else {
                            showTemporaryMessage(block, '📋 Código copiado al portapapeles.', 'info');
                        }
                        
                        setTimeout(() => {
                            copyButton.innerHTML = originalHTML;
                            copyButton.classList.remove('copied');
                        }, 2000);
                    } else {
                        fallbackCopy(codeText, copyButton, block);
                    }
                    
                } catch (err) {
                    console.warn('Error con clipboard API, usando fallback:', err);
                    fallbackCopy(codeText, copyButton, block);
                }
            });
            
            copyButton.title = 'Copiar código al portapapeles';
        });
    }
    
    // =============================================
    // 5. FUNCIONES DE ERROR
    // =============================================
    
    function mostrarErrorModoLocal() {
        const body = document.body;
        const errorHTML = `
            <div style="background: #ffebee; color: #c62828; padding: 30px; margin: 50px auto; max-width: 800px; border-radius: 10px; border-left: 8px solid #c62828; box-shadow: 0 4px 15px rgba(0,0,0,0.1); font-family: 'Segoe UI', sans-serif;">
                <h2 style="margin-top: 0; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-exclamation-triangle"></i> 
                    Error: Modo Local Detectado
                </h2>
                <p>Estás abriendo la página directamente con <code>file://</code>. Los componentes no pueden cargarse.</p>
                <h3>Solución:</h3>
                <p>Abre una terminal en la carpeta del proyecto y ejecuta:</p>
                <code style="background: #1e1e1e; color: #fff; padding: 10px; display: block; border-radius: 5px;">
                    python -m http.server 8000
                </code>
                <p>Luego abre: <a href="http://localhost:8000/index.html" target="_blank">http://localhost:8000/index.html</a></p>
            </div>
        `;
        body.innerHTML = errorHTML;
    }
    
    function mostrarErrorCarga(error) {
        const container = document.createElement('div');
        container.style.cssText = `
            background: #fff3cd; 
            color: #856404; 
            padding: 20px; 
            margin: 20px; 
            border-radius: 5px; 
            border-left: 5px solid #ffc107;
        `;
        container.innerHTML = `
            <h3>Error cargando componentes:</h3>
            <p>${error.message}</p>
            <p>Asegúrate de que los archivos existen en la carpeta "includes/" y que estás usando un servidor web.</p>
        `;
        document.body.insertBefore(container, document.body.firstChild);
    }
    
    // =============================================
    // 6. INICIAR TODO
    // =============================================
    
    // Añadir estilos primero
    añadirEstilosCopiar();
    
    // Cargar componentes y luego inicializar todo
    cargarComponentes();
    
});
