/**
 * PORTFÓLIO PROFISSIONAL - FERNANDO SANCHEZ
 * Funcionalidades interativas, gestão de Modais e PDFs.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inicialização de componentes se necessário
});

/**
 * Abre modal genérico por ID
 * @param {string} modalId 
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Impede rolagem ao fundo
    }
}

/**
 * Fecha modal genérico por ID
 * @param {string} modalId 
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Reativa rolagem
    }
}

/**
 * Abre visualizador de PDF embutido (Item 10)
 * @param {string} pdfPath 
 */
function openPDF(pdfPath) {
    const pdfModal = document.getElementById('pdf-modal');
    const pdfFrame = document.getElementById('pdf-frame');
    const pdfTitle = document.getElementById('pdf-title');

    if (pdfModal && pdfFrame) {
        // Extrai o nome do arquivo para exibir no cabeçalho
        const fileName = pdfPath.split('/').pop().replace('.pdf', '');
        if (pdfTitle) {
            pdfTitle.textContent = `Documento: ${fileName.toUpperCase()}`;
        }

        pdfFrame.src = pdfPath;
        pdfModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Fecha modal de PDF e limpa o src para economizar memória
 */
function closePDFModal() {
    const pdfModal = document.getElementById('pdf-modal');
    const pdfFrame = document.getElementById('pdf-frame');

    if (pdfModal) {
        pdfModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    if (pdfFrame) {
        pdfFrame.src = '';
    }
}

// Fechamento de modais ao clicar no fundo (Overlay)
window.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Se for o modal de PDF, limpa o iframe
        const pdfFrame = document.getElementById('pdf-frame');
        if (event.target.id === 'pdf-modal' && pdfFrame) {
            pdfFrame.src = '';
        }
    }
});

// Suporte ao botão ESC para fechar modais
window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        const activeModals = document.querySelectorAll('.modal.active');
        activeModals.forEach(modal => {
            modal.classList.remove('active');
            if (modal.id === 'pdf-modal') {
                const pdfFrame = document.getElementById('pdf-frame');
                if (pdfFrame) pdfFrame.src = '';
            }
        });
        document.body.style.overflow = 'auto';
    }
});
