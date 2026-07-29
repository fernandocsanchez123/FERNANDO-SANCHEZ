document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // 1. TEMA (LIGHT / DARK MODE)
    // ==========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Recupera tema do LocalStorage ou assume 'dark' como padrão
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'dark') {
        htmlElement.classList.add('dark');
    } else {
        htmlElement.classList.remove('dark');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            htmlElement.classList.toggle('dark');
            const isDark = htmlElement.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    // ==========================================================================
    // 2. MENU MOBILE
    // ==========================================================================
    const mobileToggleBtn = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileToggleBtn && navMenu) {
        mobileToggleBtn.addEventListener('click', () => {
            const isExpanded = mobileToggleBtn.getAttribute('aria-expanded') === 'true';
            mobileToggleBtn.setAttribute('aria-expanded', !isExpanded);
            navMenu.style.display = isExpanded ? 'none' : 'block';
        });

        // Fechar menu ao clicar em um link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 868) {
                    navMenu.style.display = 'none';
                    mobileToggleBtn.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // Atualiza o ano no rodapé
    const currentYearEl = document.getElementById('current-year');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // ==========================================================================
    // 3. CARREGAMENTO E RENDERIZAÇÃO DOS DADOS (dados.json)
    // ==========================================================================
    fetch('dados.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao carregar dados.json: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            renderHistória(data.sobre);
            renderCompetencias(data.competencias);
            renderFormacao(data.formacao);
            renderCertificacoes(data.certificacoes);
            renderProjetos(data.projetos);
            renderEstudos(data.estudos);
            renderCurso(data.curso);
            renderLivros(data.livros);
            renderArtigos(data.artigos);
            renderRoadmap(data.roadmap);
            renderContato(data.contato);

            // Inicializar filtro de livros após renderizar
            setupBookFilters();
        })
        .catch(error => {
            console.error('Falha ao inicializar o conteúdo dinâmico:', error);
        });
});

// ==========================================================================
// FUNÇÕES DE RENDERIZAÇÃO
// ==========================================================================

// História (Timeline)
function renderHistória(sobre) {
    const container = document.getElementById('timeline-historia');
    if (!container || !sobre) return;

    container.innerHTML = sobre.map(item => `
        <div class="timeline-item card" style="margin-bottom: 1rem;">
            <span class="card-tag">${item.ano}</span>
            <h3>${item.titulo}</h3>
            <p>${item.descricao}</p>
        </div>
    `).join('');
}

// Competências (Tags)
function renderCompetencias(comp) {
    if (!comp) return;

    const renderTags = (id, list) => {
        const el = document.getElementById(id);
        if (el && list) {
            el.innerHTML = list.map(item => `<li class="tag-item" style="display:inline-block; background: var(--bg-alt); padding: 4px 10px; border-radius: 4px; margin: 2px; font-size: 0.85rem; border: 1px solid var(--border);">${item}</li>`).join('');
        }
    };

    renderTags('comp-comprovadas', comp.comprovadas);
    renderTags('comp-desenvolvimento', comp.desenvolvimento);
    renderTags('comp-futuras', comp.futuras);
}

// Formação Acadêmica
function renderFormacao(formacao) {
    const container = document.getElementById('container-formacao');
    if (!container || !formacao) return;

    container.innerHTML = formacao.map(item => `
        <div class="card" style="margin-bottom: 1rem;">
            <span class="card-tag">${item.periodo} • ${item.status}</span>
            <h3>${item.curso}</h3>
            <p style="margin-bottom: 0;">${item.instituicao}</p>
        </div>
    `).join('');
}

// Certificações
function renderCertificacoes(certificacoes) {
    const container = document.getElementById('container-certificacoes');
    if (!container || !certificacoes) return;

    container.innerHTML = certificacoes.map(item => `
        <div class="card" style="margin-bottom: 1rem;">
            <span class="card-tag">${item.status}</span>
            <h3>${item.nome}</h3>
            <p style="margin-bottom: 0;">${item.emissor}</p>
        </div>
    `).join('');
}

// Projetos
function renderProjetos(projetos) {
    const container = document.getElementById('container-projetos');
    if (!container || !projetos) return;

    container.innerHTML = projetos.map(item => `
        <div class="card">
            <span class="card-tag">${item.categoria}</span>
            <h3>${item.titulo}</h3>
            <p>${item.descricao}</p>
        </div>
    `).join('');
}

// Estudos Atuais
function renderEstudos(estudos) {
    const container = document.getElementById('container-estudos');
    if (!container || !estudos) return;

    container.innerHTML = estudos.map(item => `
        <li style="margin-bottom: 0.75rem; padding-left: 1rem; border-left: 2px solid var(--primary);">
            ${item}
        </li>
    `).join('');
}

// Curso / Método em Desenvolvimento
function renderCurso(curso) {
    const container = document.getElementById('container-curso');
    if (!container || !curso) return;

    container.innerHTML = `
        <span class="card-tag">${curso.status}</span>
        <h3>${curso.titulo}</h3>
        <p>${curso.descricao}</p>
    `;
}

// Livros
function renderLivros(livros) {
    const container = document.getElementById('container-livros');
    if (!container || !livros) return;

    // Preserva itens já estáticos no HTML e adiciona os novos do JSON
    const htmlLivros = livros.map(book => `
        <div class="card book-card" data-category="${book.categoria}">
            <img src="${book.capa}" alt="Capa do livro ${book.titulo}" class="book-cover" onerror="this.src='https://via.placeholder.com/130x190?text=Livro'">
            <div class="book-info">
                <span class="book-category">${book.categoria}</span>
                <h4>${book.titulo}</h4>
                <p class="book-author">${book.autor}</p>
            </div>
        </div>
    `).join('');

    container.innerHTML += htmlLivros;
}

// Filtro de Categoria da Biblioteca
function setupBookFilters() {
    const filterButtons = document.querySelectorAll('#books-filter .filter-btn');
    const bookCards = document.querySelectorAll('#container-livros .book-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');

            bookCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (category === 'todos' || cardCategory === category) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Artigos
function renderArtigos(artigos) {
    const container = document.getElementById('container-artigos');
    if (!container || !artigos) return;

    container.innerHTML = artigos.map(artigo => `
        <div class="card" onclick="window.open('${artigo.link}', '_blank')" style="cursor: pointer;">
            <span class="card-tag">${artigo.data}</span>
            <h3>${artigo.titulo}</h3>
            <p>${artigo.resumo}</p>
            <span class="card-link">Ler artigo em PDF →</span>
        </div>
    `).join('');
}

// Roadmap
function renderRoadmap(roadmap) {
    const container = document.getElementById('container-roadmap');
    if (!container || !roadmap) return;

    container.innerHTML = roadmap.map(item => `
        <div class="card">
            <span class="card-tag">${item.fase}</span>
            <h3>${item.titulo}</h3>
            <p style="margin-bottom: 0;">${item.meta}</p>
        </div>
    `).join('');
}

// Contato
function renderContato(contato) {
    const container = document.getElementById('container-contato');
    if (!container || !contato) return;

    container.innerHTML = `
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-top: 1.5rem;">
            <a href="mailto:${contato.email}" class="btn btn-primary">E-mail Direto</a>
            <a href="${contato.linkedin}" target="_blank" rel="noopener" class="btn btn-secondary">LinkedIn</a>
            <a href="${contato.github}" target="_blank" rel="noopener" class="btn btn-secondary">GitHub</a>
        </div>
    `;
}
