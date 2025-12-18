document.addEventListener('DOMContentLoaded', function() {
    // Elementos do menu lateral
    const navTitles = document.querySelectorAll('.nav-title');
    const navItems = document.querySelectorAll('.nav-item');
    
    // Elementos de conteúdo
    const contentSections = document.querySelectorAll('.content-section');
    const welcomeMessage = document.getElementById('welcome');
    const mainContent = document.querySelector('.content');
    const mainContainer = document.querySelector('.main-container');
    const sidebar = document.querySelector('.sidebar');
    
    // Histórico de navegação
    let navigationHistory = [];
    let currentState = 'index';
    
    // Inicialização: expandir primeira seção e marcar primeiro item como ativo
    initializeNavigation();
    
    // Configurar eventos de navegação
    setupNavigationEvents();
    
    // Configurar efeitos hover para cards
    setupCardHoverEffects();
    
    // Função de inicialização
    function initializeNavigation() {
        // Expandir primeira seção (Organograma)
        const firstNavSection = document.getElementById('organograma-nav');
        if (firstNavSection) {
            firstNavSection.classList.add('expanded');
            // Atualizar seta
            const firstArrow = document.querySelector('[data-section="organograma"] .arrow');
            if (firstArrow) {
                firstArrow.textContent = '▲';
            }
        }
        
        // Marcar primeiro título como ativo
        const firstNavTitle = document.querySelector('[data-section="organograma"]');
        if (firstNavTitle) {
            firstNavTitle.classList.add('active');
        }
        
        // Mostrar conteúdo da primeira seção
        const firstNavItem = document.querySelector('.nav-item.active');
        if (firstNavItem) {
            const firstContentId = firstNavItem.getAttribute('data-content');
            showContent(firstContentId);
        }
    }
    
    // Configurar eventos de navegação
    function setupNavigationEvents() {
        // Event listeners para os títulos das seções (expandir/recolher)
        navTitles.forEach(title => {
            title.addEventListener('click', function() {
                handleNavTitleClick(this);
            });
        });
        
        // Event listeners para os itens de navegação
        navItems.forEach(item => {
            item.addEventListener('click', function(event) {
                handleNavItemClick(this, event);
            });
        });
    }
    
    // Configurar efeitos hover para cards
    function setupCardHoverEffects() {
        // Adicionar efeitos de hover dinâmicos
        const cards = document.querySelectorAll('.department-card, .doc-card, .principle-card, .policy-item');
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s ease';
            });
            
            card.addEventListener('mouseleave', function() {
                // Reset para a transição padrão
                this.style.transition = '';
            });
        });
    }
    
    // Manipular clique nos títulos das seções
    function handleNavTitleClick(titleElement) {
        const section = titleElement.getAttribute('data-section');
        const content = document.getElementById(section + '-nav');
        
        // Verificar se a seção já está expandida
        const isExpanded = content.classList.contains('expanded');
        
        // Fechar todas as outras seções
        closeAllSections();
        
        // Se não estava expandida, expandir esta
        if (!isExpanded) {
            content.classList.add('expanded');
            
            // Atualizar seta
            const arrow = titleElement.querySelector('.arrow');
            if (arrow) {
                arrow.textContent = '▲';
            }
            
            // Atualizar estado ativo
            navTitles.forEach(t => t.classList.remove('active'));
            titleElement.classList.add('active');
        } else {
            // Se já estava expandida, apenas marcar como ativa
            navTitles.forEach(t => t.classList.remove('active'));
            titleElement.classList.add('active');
        }
    }
    
    // Manipular clique nos itens de navegação
    function handleNavItemClick(itemElement, event) {
        const contentId = itemElement.getAttribute('data-content');
        
        // Salvar estado atual no histórico
        saveCurrentState();
        
        showContent(contentId);
        
        // Atualizar itens de navegação ativos
        navItems.forEach(item => {
            item.classList.remove('active');
        });
        
        // Marcar o item clicado como ativo
        itemElement.classList.add('active');
        
        // Garantir que a seção pai esteja expandida
        const parentSection = itemElement.closest('.nav-content');
        const sectionId = parentSection.id.replace('-nav', '');
        const navTitle = document.querySelector(`[data-section="${sectionId}"]`);
        
        if (navTitle && !parentSection.classList.contains('expanded')) {
            closeAllSections();
            parentSection.classList.add('expanded');
            const arrow = navTitle.querySelector('.arrow');
            if (arrow) arrow.textContent = '▲';
            navTitle.classList.add('active');
        }
    }
    
    // Função para mostrar conteúdo baseado no item selecionado
    function showContent(contentId) {
        // Esconder mensagem de boas-vindas
        if (welcomeMessage) {
            welcomeMessage.style.display = 'none';
        }
        
        // Esconder todas as seções de conteúdo
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Mostrar a seção de conteúdo correspondente
        const targetSection = document.getElementById(contentId + '-content');
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Adicionar animação de entrada
            targetSection.style.animation = 'fadeIn 0.5s';
            
            // Rolar suavemente para o topo da seção
            setTimeout(() => {
                targetSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start',
                    inline: 'nearest'
                });
            }, 100);
        }
    }
    
    // Salvar estado atual no histórico
    function saveCurrentState() {
        const state = {
            activeSection: document.querySelector('.content-section.active')?.id,
            scrollPosition: window.scrollY,
            activeNavItem: document.querySelector('.nav-item.active')?.getAttribute('data-content'),
            sidebarHTML: sidebar.innerHTML
        };
        
        if (state.activeSection) {
            navigationHistory.push(state);
            currentState = 'content';
        }
    }
    
    // Fechar todas as seções exceto a especificada
    function closeAllSections() {
        const allSections = ['organograma', 'processos', 'conduta'];
        
        allSections.forEach(section => {
            const content = document.getElementById(section + '-nav');
            if (content) {
                content.classList.remove('expanded');
                
                // Atualizar seta
                const title = document.querySelector(`[data-section="${section}"]`);
                if (title) {
                    const arrow = title.querySelector('.arrow');
                    if (arrow) arrow.textContent = '▼';
                    title.classList.remove('active');
                }
            }
        });
    }
    
    // Adicionar efeitos de clique para documentos
    const docCards = document.querySelectorAll('.doc-card');
    docCards.forEach(card => {
        card.addEventListener('click', function() {
            // Adicionar efeito de clique
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
            
            // Verificar qual documento foi clicado
            const title = this.querySelector('h4').textContent;
            console.log(`Abrindo documento: ${title}`);
            
            // Salvar estado atual no histórico
            saveCurrentState();
            
            // Abrir o documento na mesma página
            if (title === 'Política de Admissão') {
                openDocumentPage('Política de Admissão', 'politica_admissao');
            } 
            else if (title === 'Avaliação de Desempenho') {
                openDocumentPage('Avaliação de Desempenho', 'avaliacao_desempenho');
            }
            else if (title === 'Procedimentos Orçamentários') {
                openDocumentPage('Procedimentos Orçamentários', 'procedimentos_orcamentarios');
            }
            else if (title === 'Política de Investimentos') {
                openDocumentPage('Política de Investimentos', 'politica_investimentos');
            }
            // Para outros documentos, usar sistema genérico
            else {
                openGenericDocument(title);
            }
        });
    });
    
    // Função para abrir página de documento
    function openDocumentPage(docTitle, docType) {
        // Criar ou atualizar a página de documento
        const docPage = createDocumentPage(docTitle, docType);
        
        // Ocultar conteúdo principal
        mainContent.style.display = 'none';
        
        // Atualizar sidebar para modo documento
        updateSidebarForDocument(docTitle, docType);
        
        // Adicionar página ao conteúdo principal
        if (!document.getElementById('document-page')) {
            mainContainer.appendChild(docPage);
        }
        
        currentState = 'document';
        
        // Rolar para o topo
        window.scrollTo(0, 0);
    }
    
    // Criar página de documento
    function createDocumentPage(title, type) {
        let docPage = document.getElementById('document-page');
        
        if (!docPage) {
            docPage = document.createElement('div');
            docPage.id = 'document-page';
            docPage.className = 'document-page';
            docPage.style.cssText = `
                flex: 1;
                padding: 40px;
                background-color: #ffffff;
                overflow-y: auto;
                height: calc(100vh - 180px);
            `;
        }
        
        // Conteúdo baseado no tipo de documento
        let content = '';
        
        if (type === 'politica_admissao') {
            content = `
                <div class="documento-container">
                    <div class="documento-header">
                        <h1>Política de Admissão</h1>
                        <p>Procedimentos para contratação e integração de novos colaboradores.</p>
                        <span class="doc-tag">DOCUMENTO OFICIAL</span>
                    </div>
                    
                    <div class="documento-conteudo">
                        <h3>Objetivo</h3>
                        <p>Estabelecer diretrizes e procedimentos para o processo de admissão de novos colaboradores, garantindo a seleção adequada e integração eficaz na empresa.</p>
                        
                        <h3>Documento Oficial</h3>
                        <p>Abaixo está a imagem do documento oficial da Política de Admissão:</p>
                        
                        <div class="documento-imagem">
                            <img src="politica_admissao.jpg" alt="Política de Admissão - Documento Oficial">
                            <p style="margin-top: 15px; color: #666666; font-style: italic;">
                                Documento oficial da Política de Admissão
                            </p>
                        </div>
                        
                        <h3>Processo de Admissão</h3>
                        <ul>
                            <li>Recebimento e análise de currículos</li>
                            <li>Triagem inicial por Recursos Humanos</li>
                            <li>Entrevista com RH e gestor da área</li>
                            <li>Avaliação técnica específica (quando aplicável)</li>
                            <li>Check-up médico admissionais</li>
                            <li>Análise documental e referências</li>
                            <li>Proposta formal de contratação</li>  
                            <li>Contratação e integração</li>
                        </ul>
                        
                        <div class="documento-info">
                            <p><strong>Documento:</strong> Política de Admissão</p>
                            <p><strong>Departamento:</strong> Recursos Humanos</p>
                            <p><strong>Código do Documento:</strong> RH-ADM-001</p>
                        </div>
                    </div>
                </div>
            `;
        } else if (type === 'avaliacao_desempenho') {
            content = `
                <div class="documento-container">
                    <div class="documento-header">
                        <h1>Avaliação de Desempenho</h1>
                        <p>Sistema de avaliação e acompanhamento do desempenho dos colaboradores.</p>
                        <span class="doc-tag">DOCUMENTO OFICIAL</span>
                    </div>
                    
                    <div class="documento-conteudo">
                        <h3>Objetivo</h3>
                        <p>Estabelecer diretrizes e procedimentos para o sistema de avaliação de desempenho, visando o desenvolvimento contínuo dos colaboradores e alinhamento com os objetivos estratégicos da empresa.</p>
                        
                        <h3>Documento Oficial</h3>
                        <p>Abaixo está a imagem do documento oficial da Avaliação de Desempenho:</p>
                        
                        <div class="documento-imagem">
                            <img src="avaliacao_desempenho.jpg" alt="Avaliação de Desempenho - Documento Oficial">
                            <p style="margin-top: 15px; color: #666666; font-style: italic;">
                                Documento oficial da Avaliação de Desempenho
                            </p>
                        </div>
                        
                        <h3>Processo de Avaliação de Desempenho</h3>
                        <ul>
                            <li>Definição de metas e objetivos trimestrais</li>
                            <li>Acompanhamento contínuo das atividades</li>
                            <li>Avaliação formal trimestral</li>
                            <li>Feedback estruturado entre gestor e colaborador</li>
                            <li>Plano de Desenvolvimento Individual (PDI)</li>
                            <li>Análise de competências técnicas e comportamentais</li>
                            <li>Definição de ações de desenvolvimento</li>  
                            <li>Acompanhamento do plano de desenvolvimento</li>
                        </ul>
                        
                        <h3>Critérios de Avaliação</h3>
                        <ul>
                            <li><strong>Competências Técnicas:</strong> Conhecimento específico da função</li>
                            <li><strong>Produtividade:</strong> Quantidade e qualidade do trabalho</li>
                            <li><strong>Atitude:</strong> Comportamento e relacionamento interpessoal</li>
                            <li><strong>Iniciativa:</strong> Proatividade e busca por melhorias</li>
                            <li><strong>Trabalho em Equipe:</strong> Colaboração e apoio aos colegas</li>
                            <li><strong>Cumprimento de Prazos:</strong> Pontualidade nas entregas</li>
                            <li><strong>Adaptabilidade:</strong> Capacidade de lidar com mudanças</li>
                            <li><strong>Alinhamento com Valores:</strong> Adesão aos princípios da empresa</li>
                        </ul>
                        
                        <div class="documento-info">
                            <p><strong>Documento:</strong> Política de Avaliação de Desempenho</p>
                            <p><strong>Departamento:</strong> Recursos Humanos</p>
                            <p><strong>Código do Documento:</strong> RH-AVD-001</p>
                        </div>
                    </div>
                </div>
            `;
        } else if (type === 'procedimentos_orcamentarios') {
            content = `
                <div class="documento-container">
                    <div class="documento-header">
                        <h1>Procedimentos Orçamentários</h1>
                        <p>Processo para elaboração e acompanhamento do orçamento empresarial.</p>
                        <span class="doc-tag">DOCUMENTO OFICIAL</span>
                    </div>
                    
                    <div class="documento-conteudo">
                        <h3>Objetivo</h3>
                        <p>Estabelecer o processo de planejamento, elaboração, execução e controle do orçamento da empresa, garantindo o uso eficiente dos recursos financeiros e alinhamento com os objetivos estratégicos.</p>
                        
                        <h3>Documento Oficial</h3>
                        <p>Abaixo está a imagem do documento oficial dos Procedimentos Orçamentários:</p>
                        
                        <div class="documento-imagem">
                            <img src="procedimentos_orcamentarios.jpg" alt="Procedimentos Orçamentários - Documento Oficial">
                            <p style="margin-top: 15px; color: #666666; font-style: italic;">
                                Documento oficial dos Procedimentos Orçamentários
                            </p>
                        </div>
                        
                        <h3>Como Funciona</h3>
                        <p>O processo orçamentário na nossa empresa é uma ferramenta de planejamento financeiro que envolve todos os departamentos. Ele transforma os objetivos estratégicos em planos financeiros concretos, permitindo o acompanhamento e controle das atividades empresariais.</p>
                        
                        <h3>Passo a Passo do Processo</h3>
                        <ul>
                            <li><strong>1. Definição de Diretrizes:</strong> A diretoria estabelece as metas e orientações gerais para o próximo ano.</li>
                            <li><strong>2. Elaboração Departamental:</strong> Cada departamento prepara sua proposta orçamentária com base nas diretrizes.</li>
                            <li><strong>3. Consolidação:</strong> O departamento financeiro reúne todas as propostas em um orçamento único.</li>
                            <li><strong>4. Análise e Ajustes:</strong> O orçamento consolidado é analisado e ajustado conforme necessário.</li>
                            <li><strong>5. Aprovação:</strong> O orçamento final é submetido à aprovação da diretoria.</li>
                            <li><strong>6. Execução:</strong> Implementação do orçamento aprovado ao longo do ano.</li>
                            <li><strong>7. Acompanhamento:</strong> Monitoramento mensal das receitas e despesas.</li>
                            <li><strong>8. Revisões:</strong> Ajustes periódicos baseados em mudanças nas condições de mercado.</li>
                        </ul>
                        
                        <h3>Princípios Básicos</h3>
                        <ul>
                            <li>Todos os departamentos participam do processo</li>
                            <li>O orçamento deve refletir a realidade operacional</li>
                            <li>Flexibilidade para ajustes quando necessário</li>
                            <li>Transparência em todas as etapas</li>
                            <li>Alinhamento total com a estratégia da empresa</li>
                        </ul>
                        
                        <div class="documento-info">
                            <p><strong>Documento:</strong> Procedimentos Orçamentários</p>
                            <p><strong>Departamento:</strong> Financeiro</p>
                            <p><strong>Vigência:</strong> Anual</p>
                            <p><strong>Código do Documento:</strong> FIN-ORC-001</p>
                            <p><strong>Responsável:</strong> Departamento Financeiro</p>
                        </div>
                    </div>
                </div>
            `;
        } else if (type === 'politica_investimentos') {
            content = `
                <div class="documento-container">
                    <div class="documento-header">
                        <h1>Política de Investimentos</h1>
                        <p>Diretrizes para aplicação de recursos financeiros da empresa.</p>
                        <span class="doc-tag">DOCUMENTO OFICIAL</span>
                    </div>
                    
                    <div class="documento-conteudo">
                        <h3>Objetivo</h3>
                        <p>Estabelecer critérios e procedimentos para a aplicação dos recursos financeiros da empresa, buscando equilíbrio entre rentabilidade, segurança e liquidez.</p>
                        
                        <h3>Documento Oficial</h3>
                        <p>Abaixo está a imagem do documento oficial da Política de Investimentos:</p>
                        
                        <div class="documento-imagem">
                            <img src="politica_investimentos.jpg" alt="Política de Investimentos - Documento Oficial">
                            <p style="margin-top: 15px; color: #666666; font-style: italic;">
                                Documento oficial da Política de Investimentos
                            </p>
                        </div>
                        
                        <h3>Como Funciona</h3>
                        <p>Nossa política de investimentos define como os recursos financeiros disponíveis são aplicados para gerar retorno enquanto mantemos a segurança do capital e liquidez para nossas operações.</p>
                        
                        <h3>Princípios da Política</h3>
                        <ul>
                            <li><strong>Preservação do Capital:</strong> Segurança é prioridade sobre retorno elevado</li>
                            <li><strong>Liquidez Adequada:</strong> Manter recursos disponíveis para necessidades operacionais</li>
                            <li><strong>Diversificação:</strong> Distribuir recursos em diferentes tipos de investimentos</li>
                            <li><strong>Rentabilidade Consistente:</strong> Buscar retornos estáveis ao longo do tempo</li>
                            <li><strong>Conformidade Legal:</strong> Respeitar todas as normas e regulamentos aplicáveis</li>
                        </ul>
                        
                        <h3>Tipos de Investimentos Utilizados</h3>
                        <ul>
                            <li><strong>Renda Fixa:</strong> Aplicações com retorno predefinido e menor risco</li>
                            <li><strong>Fundos Conservadores:</strong> Investimentos coletivos com gestão profissional</li>
                            <li><strong>Títulos Públicos:</strong> Aplicações em títulos governamentais</li>
                            <li><strong>CDBs:</strong> Certificados de Depósito Bancário</li>
                            <li><strong>LCIs/LCAs:</strong> Títulos de crédito imobiliário e agronegócio</li>
                        </ul>
                        
                        <h3>Processo de Decisão</h3>
                        <ul>
                            <li><strong>1. Análise de Necessidades:</strong> Identificar quanto pode ser investido e por quanto tempo</li>
                            <li><strong>2. Avaliação de Opções:</strong> Estudar diferentes alternativas de investimento</li>
                            <li><strong>3. Análise de Riscos:</strong> Avaliar os riscos associados a cada opção</li>
                            <li><strong>4. Tomada de Decisão:</strong> Decidir onde aplicar os recursos</li>
                            <li><strong>5. Monitoramento:</strong> Acompanhar o desempenho dos investimentos</li>
                            <li><strong>6. Revisão:</strong> Reavaliar periodicamente as aplicações</li>
                        </ul>
                        
                        <h3>Responsabilidades</h3>
                        <ul>
                            <li><strong>Diretoria Financeira:</strong> Definição das diretrizes gerais</li>
                            <li><strong>Comitê de Investimentos:</strong> Análise e aprovação das aplicações</li>
                            <li><strong>Tesouraria:</strong> Execução das operações de investimento</li>
                            <li><strong>Controladoria:</strong> Controle e registro das operações</li>
                        </ul>
                        
                        <div class="documento-info">
                            <p><strong>Documento:</strong> Política de Investimentos</p>
                            <p><strong>Departamento:</strong> Financeiro</p>
                            <p><strong>Vigência:</strong> Vigente</p>
                            <p><strong>Código do Documento:</strong> FIN-INV-001</p>
                            <p><strong>Responsável:</strong> Comitê de Investimentos</p>
                        </div>
                    </div>
                </div>
            `;
        } else {
            content = `
                <div class="documento-container">
                    <div class="documento-header">
                        <h1>${title}</h1>
                        <p>Documento em desenvolvimento.</p>
                        <span class="doc-tag">EM DESENVOLVIMENTO</span>
                    </div>
                    
                    <div class="documento-conteudo">
                        <h3>Informação</h3>
                        <p>Este documento está em fase de desenvolvimento. Em breve estará disponível com todas as informações necessárias.</p>
                        
                        <div class="documento-info">
                            <p><strong>Documento:</strong> ${title}</p>
                            <p><strong>Status:</strong> Em desenvolvimento</p>
                            <p><strong>Previsão de Conclusão:</strong> Em breve</p>
                        </div>
                    </div>
                </div>
            `;
        }
        
        docPage.innerHTML = content;
        return docPage;
    }
    
    // Atualizar sidebar para modo documento
    function updateSidebarForDocument(docTitle, docType) {
        // Salvar sidebar atual se ainda não estiver em modo documento
        if (!sidebar.classList.contains('document-mode')) {
            const currentSidebarState = {
                html: sidebar.innerHTML,
                isDocumentMode: false
            };
            navigationHistory.push(currentSidebarState);
        }
        
        // Determinar departamento baseado no tipo de documento
        let departamento = 'Recursos Humanos';
        let codigoDocumento = '';
        
        if (docType === 'procedimentos_orcamentarios' || docType === 'politica_investimentos') {
            departamento = 'Financeiro';
            if (docType === 'procedimentos_orcamentarios') codigoDocumento = 'FIN-ORC-001';
            if (docType === 'politica_investimentos') codigoDocumento = 'FIN-INV-001';
        } else if (docType === 'politica_admissao') {
            codigoDocumento = 'RH-ADM-001';
        } else if (docType === 'avaliacao_desempenho') {
            codigoDocumento = 'RH-AVD-001';
        }
        
        // Atualizar sidebar para modo documento
        sidebar.innerHTML = `
            <div class="sidebar-document-mode">
                <div class="document-nav-header">
                    <h2>DOCUMENTO</h2>
                    <div class="document-info">
                        <div class="document-icon">📄</div>
                        <h3>${docTitle}</h3>
                        <p>Visualizando documento oficial</p>
                    </div>
                </div>
                
                <div class="document-nav-section">
                    <div class="document-nav-title">
                        <span class="document-nav-icon">📋</span>
                        Informações do Documento
                    </div>
                    <div class="document-nav-content">
                        <div class="document-info-item">
                            <strong>Status:</strong> <span class="status-active">Ativo</span>
                        </div>
                        <div class="document-info-item">
                            <strong>Departamento:</strong> ${departamento}
                        </div>
                        ${codigoDocumento ? `<div class="document-info-item">
                            <strong>Código:</strong> ${codigoDocumento}
                        </div>` : ''}
                        <div class="document-info-item">
                            <strong>Última Revisão:</strong> Dezembro 2025
                        </div>
                    </div>
                </div>
                
                <div class="sidebar-footer">
                    <button class="back-to-intranet-btn">
                        <span class="back-icon">←</span>
                        Voltar para Intranet
                    </button>
                    <div class="document-version">
                        v1.0 • Documento Oficial
                    </div>
                </div>
            </div>
        `;
        
        sidebar.classList.add('document-mode');
        
        // Adicionar evento ao botão de voltar
        const backButton = sidebar.querySelector('.back-to-intranet-btn');
        if (backButton) {
            backButton.addEventListener('click', goBackToDashboard);
        }
        
        // Adicionar eventos aos botões de ação
        const printBtn = sidebar.querySelector('.print-btn');
        if (printBtn) {
            printBtn.addEventListener('click', function() {
                window.print();
            });
        }
        
        const downloadBtn = sidebar.querySelector('.download-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', function() {
                alert('Função de download será implementada em breve.');
            });
        }
    }
    
    // Função para voltar ao dashboard
    function goBackToDashboard() {
        // Remover página de documento
        const docPage = document.getElementById('document-page');
        if (docPage) {
            docPage.remove();
        }
        
        // Remover classe de modo documento
        sidebar.classList.remove('document-mode');
        
        // Restaurar sidebar anterior
        if (navigationHistory.length > 0) {
            const previousState = navigationHistory.pop();
            if (previousState.html) {
                sidebar.innerHTML = previousState.html;
                
                // Reconfigurar eventos da sidebar
                const restoredNavTitles = sidebar.querySelectorAll('.nav-title');
                const restoredNavItems = sidebar.querySelectorAll('.nav-item');
                
                restoredNavTitles.forEach(title => {
                    title.addEventListener('click', function() {
                        handleNavTitleClick(this);
                    });
                });
                
                restoredNavItems.forEach(item => {
                    item.addEventListener('click', function(event) {
                        handleNavItemClick(this, event);
                    });
                });
            }
        }
        
        // Mostrar conteúdo principal
        mainContent.style.display = 'block';
        
        // Restaurar estado anterior se houver histórico
        if (navigationHistory.length > 0) {
            const previousState = navigationHistory[navigationHistory.length - 1];
            if (previousState.activeSection) {
                restoreState(previousState);
                // Remover este estado do histórico após restaurar
                navigationHistory.pop();
            }
        }
        
        currentState = 'content';
        
        // Rolar para a posição anterior
        if (navigationHistory.length > 0) {
            const lastState = navigationHistory[navigationHistory.length - 1];
            if (lastState.scrollPosition) {
                setTimeout(() => {
                    window.scrollTo(0, lastState.scrollPosition);
                }, 100);
            }
        }
    }
    
    // Restaurar estado anterior
    function restoreState(state) {
        if (state.activeSection) {
            // Mostrar seção ativa
            contentSections.forEach(section => {
                section.classList.remove('active');
            });
            const targetSection = document.getElementById(state.activeSection);
            if (targetSection) {
                targetSection.classList.add('active');
            }
            
            // Restaurar item de navegação ativo
            if (state.activeNavItem) {
                const navItems = sidebar.querySelectorAll('.nav-item');
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('data-content') === state.activeNavItem.replace('-content', '')) {
                        item.classList.add('active');
                    }
                });
            }
        }
    }
    
    // Abrir documento genérico (para documentos não implementados)
    function openGenericDocument(title) {
        openDocumentPage(title, 'generic');
    }
    
    // Adicionar botão de voltar ao topo
    const backToTopButton = document.createElement('button');
    backToTopButton.textContent = '↑';
    backToTopButton.className = 'back-to-top';
    backToTopButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background-color: #000000;
        color: #ffffff;
        border: 3px solid #ffffff;
        border-radius: 0;
        font-size: 24px;
        font-weight: bold;
        cursor: pointer;
        display: none;
        z-index: 100;
        transition: all 0.3s;
    `;
    
    document.body.appendChild(backToTopButton);
    
    // Mostrar/ocultar botão ao rolar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
        }
    });
    
    // Adicionar funcionalidade ao botão
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Adicionar efeito de hover ao botão
    backToTopButton.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#ffffff';
        this.style.color = '#000000';
        this.style.borderColor = '#000000';
        this.style.transform = 'scale(1.1)';
    });
    
    backToTopButton.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '#000000';
        this.style.color = '#ffffff';
        this.style.borderColor = '#ffffff';
        this.style.transform = 'scale(1)';
    });
    
    // Adicionar data atual ao footer
    const currentDate = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = currentDate.toLocaleDateString('pt-BR', options);
    
    const dateElement = document.createElement('p');
    dateElement.textContent = `Última atualização: ${dateString}`;
    dateElement.style.cssText = `
        font-size: 12px;
        color: #cccccc;
        margin-top: 10px;
    `;
    
    const footer = document.querySelector('.footer');
    if (footer) {
        footer.appendChild(dateElement);
    }
    
    // Adicionar funcionalidade de impressão (Ctrl+P)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            alert('Use o botão de impressão do navegador para imprimir esta página.');
        }
    });
    
    // Adicionar suporte para botão voltar do navegador
    window.addEventListener('popstate', function() {
        if (currentState === 'document') {
            goBackToDashboard();
        }
    });
});