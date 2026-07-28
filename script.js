/**
 * Central Profissional - Fernando Sanchez
 * Modular Vanilla JS Architecture (JSON-Driven Engine)
 */

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

const App = {
    data: null,

    async init() {
        this.initTheme();
        this.initMobileMenu();
        await this.loadData();
        
        if (this.data) {
            this.renderAll();
            this.initInteractions();
        }
    },

    /* Theme Management */
    initTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    },

    /* Navigation Mobile Toggle */
    initMobileMenu() {
        const toggleBtn = document.getElementById('mobile-toggle');
        const navMenu = document.getElementById('nav-menu');

        toggleBtn.addEventListener('click', () => {
            const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
            toggleBtn.setAttribute('aria-expanded', !expanded);
            navMenu.classList.toggle('is-open');
        });

        // Close on link click
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('is-open');
                toggleBtn.setAttribute('aria-expanded', 'false');
            });
        });
    },

    /* Fetch JSON Engine */
    async loadData() {
        try {
            const response = await fetch('dados.json');
            if (!response.ok) throw new Error('Falha ao carregar dados.json');
            this.data = await response.json();
        } catch (error) {
            console.error('Erro na inicialização dos dados:', error);
        }
    },

    /* Render Orchestrator */
    renderAll() {
        this.renderHistoria();
        this.renderCompetencias();
        this.renderFormacaoECertificacoes();
        this.renderExperiencias();
        this.renderProjetos();
        this.renderPesquisas();
        this.renderEstudosECurso();
        this.renderLivros(this.data.livros);
        this.renderArtigos();
        this.renderRoadmap();
        this.renderContato();
    },

    /* Renderers */
    renderHistoria() {
        const container = document.getElementById('timeline-historia');
        container.innerHTML = this.data.historia.map((item, index) => `
            <div class="timeline-item ${index === 0 ? 'active' : ''}">
                <button class="timeline-header" aria-expanded="${index === 0}">
                    <span class="timeline-year">${item.ano}</span>
                    <span class="timeline-title">${item.titulo}</span>
                </button>
                <div class="timeline-content">
                    <p>${item.descricao}</p>
                </div>
            </div>
        `).join('');
    },

    renderCompetencias() {
        const renderTags = (items, targetId) => {
            document.getElementById(targetId).innerHTML = items
                .map(i => `<li class="tag">${i}</li>`).join('');
        };
        renderTags(this.data.competencias.comprovadas, 'comp-comprovadas');
        renderTags(this.data.competencias.desenvolvimento, 'comp-desenvolvimento');
        renderTags(this.data.competencias.futuras, 'comp-futuras');
    },

    renderFormacaoECertificacoes() {
        const containerFormacao = document.getElementById('container-formacao');
        containerFormacao.innerHTML = this.data.formacao.map(f => `
            <div class="simple-item">
                <span class="card-meta">${f.periodo}</span>
                <h4>${f.curso}</h4>
                <p>${f.instituicao}</p>
            </div>
        `).join('');

        const containerCert = document.getElementById('container-certificacoes');
        containerCert.innerHTML = this.data.certificacoes.map(c => `
            <div class="card">
                <span class="card-meta">${c.status} • ${c.ano}</span>
                <h4>${c.nome}</h4>
                <p class="card-text">${c.emissor}</p>
            </div>
        `).join('');
    },

    renderExperiencias() {
        const container = document.getElementById('container-experiencias');
        container.innerHTML = this.data.experiencias.map(exp => `
            <article class="card exp-card">
                <span class="card-meta">${exp.periodo}</span>
                <h3>${exp.cargo}</h3>
                <p class="card-meta">${exp.empresa}</p>
                <p class="card-text">${exp.descricao}</p>
                <ul class="tag-list">
                    ${exp.tags.map(t => `<li class="tag">${t}</li>`).join('')}
                </ul>
            </article>
        `).join('');
    },

    renderProjetos() {
        const container = document.getElementById('container-projetos');
        container.innerHTML = this.data.projetos.map(p => `
            <article class="card project-card">
                <span class="card-meta">Status: ${p.status}</span>
                <h3>${p.titulo}</h3>
                <p class="card-text">${p.descricao}</p>
                <p class="card-text"><strong>Aprendizados:</strong> ${p.aprendizados}</p>
                <div class="card-foot">
                    <ul class="tag-list">
                        ${p.tecnologias.map(t => `<li class="tag">${t}</li>`).join('')}
                    </ul>
                </div>
            </article>
        `).join('');
    },

    renderPesquisas() {
        const container = document.getElementById('container-pesquisas');
        container.innerHTML = this.data.pesquisas.map(p => `
            <article class="card">
                <span class="card-meta">Fase: ${p.fase}</span>
                <h3>${p.titulo}</h3>
                <p class="card-text">${p.resumo}</p>
            </article>
        `).join('');
    },

    renderEstudosECurso() {
        const containerEstudos = document.getElementById('container-estudos');
        containerEstudos.innerHTML = this.data.estudosAtuais.map(e => `
            <li class="study-item">
                <h4>${e.topico}</h4>
                <p>${e.foco}</p>
            </li>
        `).join('');

        const containerCurso = document.getElementById('container-curso');
        const c = this.data.desenvolvimentoCurso;
        containerCurso.innerHTML = `
            <span class="card-meta">Evolução: ${c.progresso}</span>
            <h3>${c.nome}</h3>
            <p class="card-text">${c.objetivo}</p>
            <p class="card-text"><strong>Status Atual:</strong> ${c.etapaAtual}</p>
        `;
    },

    renderLivros(livrosList) {
        const container = document.getElementById('container-livros');
        container.innerHTML = livrosList.map(b => `
            <div class="book-card">
                <h4 class="book-title">${b.titulo}</h4>
                <span class="book-author">${b.autor}</span>
                <p class="book-note">"${b.insights}"</p>
            </div>
        `).join('');
    },

    renderArtigos() {
        const container = document.getElementById('container-artigos');
        container.innerHTML = this.data.artigos.map(a => `
            <article class="card article-card">
                <span class="card-meta">${a.data}</span>
                <h3>${a.titulo}</h3>
                <p class="card-text">${a.resumo}</p>
            </article>
        `).join('');
    },

    renderRoadmap() {
        const container = document.getElementById('container-roadmap');
        container.innerHTML = this.data.roadmap.map(r => `
            <div class="roadmap-card">
                <span class="roadmap-time">${r.horizonte}</span>
                <h4>${r.objetivo}</h4>
                <p>${r.detalhes}</p>
            </div>
        `).join('');
    },

    renderContato() {
        const container = document.getElementById('container-contato');
        const c = this.data.contato;
        container.innerHTML = `
            <a href="${c.linkedin}" target="_blank" rel="noopener" class="btn btn-secondary">LinkedIn</a>
            <a href="${c.github}" target="_blank" rel="noopener" class="btn btn-secondary">GitHub</a>
            <a href="mailto:${c.email}" class="btn btn-primary">E-mail Direto</a>
            <a href="${c.whatsapp}" target="_blank" rel="noopener" class="btn btn-secondary">WhatsApp</a>
        `;
    },

    /* Interactive Handlers */
    initInteractions() {
        // Accordion for Historia
        const accordionHeaders = document.querySelectorAll('.timeline-header');
        accordionHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const item = header.parentElement;
                const isActive = item.classList.contains('active');
                
                // Close others
                document.querySelectorAll('.timeline-item').forEach(i => i.classList.remove('active'));
                accordionHeaders.forEach(h => h.setAttribute('aria-expanded', 'false'));

                if (!isActive) {
                    item.classList.add('active');
                    header.setAttribute('aria-expanded', 'true');
                }
            });
        });

        // Books Filter
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const cat = btn.getAttribute('data-category');
                if (cat === 'todos') {
                    this.renderLivros(this.data.livros);
                } else {
                    const filtered = this.data.livros.filter(l => l.categoria === cat);
                    this.renderLivros(filtered);
                }
            });
        });
    }
};
