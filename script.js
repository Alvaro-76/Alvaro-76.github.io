// script.js - COMPLETO con todas las funcionalidades
// Incluye: smooth scroll, navegación activa, botones de copiar con distinción de tipos

document.addEventListener('DOMContentLoaded', function() {
    // =============================================
    // 1. CONFIGURACIÓN INICIAL Y ESTILOS DINÁMICOS
    // =============================================
    
    // Añadir estilos necesarios para las animaciones y mensajes
    const style = document.createElement('style');
    style.innerHTML = `
        /* Estilos para mensajes temporales de copiado */
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
        
        /* Estilo para enlace activo en navegación */
        .main-nav a.active {
            background-color: var(--primary-color);
            color: var(--dark-bg);
            font-weight: bold;
        }
        
        /* Mejoras para el botón copiar */
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
        
        /* Ajuste responsive para móviles */
        @media (max-width: 768px) {
            .copy-button {
                top: 40px;
                right: 5px;
                padding: 4px 10px;
                font-size: 0.7em;
            }
            
            .copy-button span {
                display: none; /* En móvil solo mostramos icono */
            }
        }
        
        @media (max-width: 480px) {
            .copy-button {
                top: 35px;
                padding: 3px 8px;
            }
        }
    `;
    document.head.appendChild(style);

    // =============================================
    // 2. SMOOTH SCROLL PARA NAVEGACIÓN
    // =============================================
    
    const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Ajuste para header fijo
                    behavior: 'smooth'
                });
            }
        });
    });

    // =============================================
    // 3. RESALTAR SECCIÓN ACTIVA EN NAVEGACIÓN
    // =============================================
    
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavLink() {
        let scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.main-nav a[href="#${sectionId}"]`);
            
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavLink);
    
    // =============================================
    // 4. FUNCIÓN PARA MOSTRAR MENSAJES TEMPORALES
    // =============================================
    
    function showTemporaryMessage(block, message, type = 'info') {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'copy-message';
        msgDiv.textContent = message;
        
        // Color del borde según tipo de mensaje
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
    
    // =============================================
    // 5. FUNCIÓN DE FALLBACK PARA COPIAR (NAVEGADORES ANTIGUOS)
    // =============================================
    
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
            
            // Feedback visual
            const originalHTML = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i> <span>¡Copiado!</span>';
            button.classList.add('copied');
            
            // Mensaje según tipo de bloque
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
    
    // =============================================
    // 6. FUNCIÓN PRINCIPAL: AÑADIR BOTONES DE COPIAR
    // =============================================
    
    function setupCopyButtons() {
        // Seleccionar TODOS los bloques de código
        const codeBlocks = document.querySelectorAll('.code-block');
        
        codeBlocks.forEach((block) => {
            // Evitar duplicar botones
            if (block.querySelector('.copy-button')) return;
            
            const preElement = block.querySelector('pre');
            if (!preElement) return;
            
            // Crear botón de copiar
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-button';
            copyButton.innerHTML = '<i class="fas fa-copy"></i> <span>Copiar</span>';
            
            // Identificar tipo de bloque para analytics (opcional)
            let blockType = 'default';
            if (block.classList.contains('complete')) blockType = 'complete';
            else if (block.classList.contains('snippet')) blockType = 'snippet';
            else if (block.classList.contains('warning-code')) blockType = 'warning';
            
            copyButton.setAttribute('data-code-type', blockType);
            
            // Asegurar que el contenedor tiene posición relativa
            if (window.getComputedStyle(block).position === 'static') {
                block.style.position = 'relative';
            }
            
            block.appendChild(copyButton);
            
            // Evento de copiar
            copyButton.addEventListener('click', async function(e) {
                e.stopPropagation();
                
                // Obtener el texto del código, limpiando espacios innecesarios
                let codeText = preElement.textContent || preElement.innerText;
                
                // Eliminar líneas en blanco al inicio y final (opcional)
                codeText = codeText.trim();
                
                try {
                    // Intentar con la API moderna del portapapeles
                    if (navigator.clipboard && window.isSecureContext) {
                        await navigator.clipboard.writeText(codeText);
                        
                        // Feedback visual de éxito
                        const originalHTML = copyButton.innerHTML;
                        copyButton.innerHTML = '<i class="fas fa-check"></i> <span>¡Copiado!</span>';
                        copyButton.classList.add('copied');
                        
                        // Mostrar mensaje contextual según el tipo
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
                        // Fallback para navegadores sin API moderna
                        fallbackCopy(codeText, copyButton, block);
                    }
                    
                } catch (err) {
                    console.warn('Error con clipboard API, usando fallback:', err);
                    fallbackCopy(codeText, copyButton, block);
                }
            });
            
            // Añadir tooltip sutil (opcional)
            copyButton.title = 'Copiar código al portapapeles';
        });
    }
    
    // =============================================
    // 7. FUNCIÓN PARA DROPDOWN MENU (si existe)
    // =============================================
    
    function setupDropdownMenus() {
        const dropdowns = document.querySelectorAll('.dropdown');
        
        dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('a');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            if (!link || !menu) return;
            
            // Para escritorio: hover
            dropdown.addEventListener('mouseenter', () => {
                menu.style.display = 'block';
            });
            
            dropdown.addEventListener('mouseleave', () => {
                menu.style.display = 'none';
            });
            
            // Para móviles: click
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    const isVisible = menu.style.display === 'block';
                    menu.style.display = isVisible ? 'none' : 'block';
                }
            });
        });
    }
    
    // =============================================
    // 8. INICIALIZAR TODAS LAS FUNCIONES
    // =============================================
    
    // Ejecutar setup principal
    setupCopyButtons();
    setupDropdownMenus();
    
    // Re-ejecutar setup de botones si el contenido cambia dinámicamente (útil para SPAs)
    // Si usas navegación por AJAX, puedes llamar a setupCopyButtons() después de cargar nuevo contenido
    
    // =============================================
    // 9. PEQUEÑA INTERACCIÓN ADICIONAL
    // =============================================
    
    // Clic en advertencias (opcional)
    const warningBoxes = document.querySelectorAll('.info-box.warning');
    warningBoxes.forEach(box => {
        box.addEventListener('click', () => {
            console.log('Usuario hizo clic en una advertencia importante');
        });
    });
    
    console.log('✅ Script cargado completamente. Funcionalidades activas:');
    console.log('   - Smooth scroll');
    console.log('   - Navegación activa');
    console.log('   - Botones de copiar con distinción de tipos');
    console.log('   - Dropdown menus');
    console.log('   - Mensajes contextuales');
});

// =============================================
// 10. FUNCIÓN GLOBAL PARA COPIAR (si se necesita llamar manualmente)
// =============================================

window.copyCodeManually = function(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        const text = element.textContent || element.innerText;
        navigator.clipboard.writeText(text).then(() => {
            alert('¡Código copiado!');
        }).catch(() => {
            alert('Error al copiar');
        });
    }
};