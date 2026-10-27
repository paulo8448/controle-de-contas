// Verifica se o usuário está logado
if (localStorage.getItem("autenticado") !== "true") { 
    window.location.href = "login.html"; 
}

// Configurações Principais
const URL_API = "https://script.google.com/macros/s/AKfycbz11tJcTC3PUO3C10jUn1j2IgGNog9dccl9DohOW3EoJdh1DB2WKGNLouQ0kCMnEUql/exec";
let contasGlobais = [];
let contasDoMes = []; 
let primeiroCarregamento = true;

// Variáveis de Data
let dataAtualVisualizacao = new Date();
let mesVisualizacao = dataAtualVisualizacao.getMonth() + 1; 
let anoVisualizacao = dataAtualVisualizacao.getFullYear();
const nomesMeses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

// --- DADOS DO USUÁRIO E SIDEBAR ---
const nomeUsuarioSalvo = localStorage.getItem("usuario_nome");
const fotoUsuarioSalva = localStorage.getItem("usuario_foto");
const elNomeUsuario = document.getElementById('nome-usuario');
const elImgPerfil = document.getElementById('img-perfil');

if (nomeUsuarioSalvo && elNomeUsuario) elNomeUsuario.innerText = nomeUsuarioSalvo;
if (fotoUsuarioSalva && elImgPerfil) {
    elImgPerfil.src = fotoUsuarioSalva;
    elImgPerfil.style.display = 'block';
} else if (elImgPerfil) {
    elImgPerfil.style.display = 'none'; // Esconde a moldura vazia se não houver foto salva
}

const btnMenu = document.getElementById('btn-menu');
const sidebar = document.getElementById('sidebar');
const overlaySidebar = document.getElementById('overlay-sidebar');

if (btnMenu && sidebar && overlaySidebar) {
    btnMenu.addEventListener('click', () => {
        sidebar.classList.add('ativo');
        overlaySidebar.classList.add('ativo');
    });

    overlaySidebar.addEventListener('click', () => {
        sidebar.classList.remove('ativo');
        overlaySidebar.classList.remove('ativo');
    });
}

const btnSairSidebar = document.getElementById('btn-sair-sidebar');
if (btnSairSidebar) {
    btnSairSidebar.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = "login.html";
    });
}

// --- CALENDÁRIO POP-UP ---
const modalCalendario = document.getElementById('modal-calendario');
const popupCalendario = document.getElementById('popup-calendario');
const tituloAnoPopup = document.getElementById('titulo-ano-popup');
const grelhaMeses = document.getElementById('grelha-meses');
const grelhaAnos = document.getElementById('grelha-anos');

let anoPopupAtual = anoVisualizacao; 
let modoPopup = 'meses'; 

function atualizarVisorMes() {
    const elMesTitulo = document.getElementById('mes-titulo');
    if (elMesTitulo) elMesTitulo.innerText = `${nomesMeses[mesVisualizacao - 1]} ${anoVisualizacao}`;
    renderizarLista();
}

const elMesTitulo = document.getElementById('mes-titulo');
if (elMesTitulo) {
    elMesTitulo.addEventListener('click', () => {
        if (modalCalendario.classList.contains('ativo')) {
            fecharPopUpCalendario();
        } else {
            anoPopupAtual = anoVisualizacao;
            abrirVistaMeses();
            modalCalendario.classList.add('ativo');
        }
    });
}

const btnFecharCal = document.getElementById('btn-fechar-calendario');
if (btnFecharCal) btnFecharCal.addEventListener('click', fecharPopUpCalendario);

if (modalCalendario) {
    modalCalendario.addEventListener('click', (e) => {
        if (e.target === modalCalendario) fecharPopUpCalendario();
    });
}

function fecharPopUpCalendario() {
    if (modalCalendario) modalCalendario.classList.remove('ativo');
}

function abrirVistaMeses() {
    modoPopup = 'meses';
    if (tituloAnoPopup) tituloAnoPopup.innerText = anoPopupAtual;
    if (grelhaAnos) grelhaAnos.style.display = 'none';
    if (grelhaMeses) {
        grelhaMeses.style.display = 'grid';
        grelhaMeses.innerHTML = ''; 

        nomesMeses.forEach((nome, index) => {
            let mesNum = index + 1;
            let btn = document.createElement('button');
            btn.className = 'btn-data-popup';
            btn.innerText = nome.substring(0, 3);
            
            if (mesNum === mesVisualizacao && anoPopupAtual === anoVisualizacao) {
                btn.classList.add('selecionado');
            }

            btn.addEventListener('click', () => {
                mesVisualizacao = mesNum;
                anoVisualizacao = anoPopupAtual;
                atualizarVisorMes();
                fecharPopUpCalendario(); 
            });

            grelhaMeses.appendChild(btn);
        });
    }
}

function abrirVistaAnos() {
    modoPopup = 'anos';
    let decadaInicio = Math.floor(anoPopupAtual / 10) * 10;
    if (tituloAnoPopup) tituloAnoPopup.innerText = `${decadaInicio} - ${decadaInicio + 9}`;
    
    if (grelhaMeses) grelhaMeses.style.display = 'none';
    if (grelhaAnos) {
        grelhaAnos.style.display = 'grid';
        grelhaAnos.innerHTML = '';

        for (let i = 0; i < 12; i++) {
            let anoDesenhado = decadaInicio - 1 + i;
            let btn = document.createElement('button');
            btn.className = 'btn-data-popup';
            btn.innerText = anoDesenhado;
            
            if (i === 0 || i === 11) btn.style.opacity = '0.4';
            if (anoDesenhado === anoPopupAtual) btn.classList.add('selecionado');

            btn.addEventListener('click', () => {
                anoPopupAtual = anoDesenhado;
                grelhaAnos.classList.add('animacao-transicao');
                abrirVistaMeses();
            });

            grelhaAnos.appendChild(btn);
        }
    }
}

if (tituloAnoPopup) {
    tituloAnoPopup.addEventListener('click', () => {
        if (modoPopup === 'meses') abrirVistaAnos();
        else abrirVistaMeses();
    });
}

const btnAnoAnt = document.getElementById('btn-ano-ant');
if (btnAnoAnt) {
    btnAnoAnt.addEventListener('click', () => {
        if (modoPopup === 'meses') { anoPopupAtual--; abrirVistaMeses(); } 
        else { anoPopupAtual -= 10; abrirVistaAnos(); }
    });
}

const btnAnoProx = document.getElementById('btn-ano-prox');
if (btnAnoProx) {
    btnAnoProx.addEventListener('click', () => {
        if (modoPopup === 'meses') { anoPopupAtual++; abrirVistaMeses(); } 
        else { anoPopupAtual += 10; abrirVistaAnos(); }
    });
}

// Setas de navegação de mês
const btnMesAnt = document.getElementById('btn-mes-ant');
if (btnMesAnt) {
    btnMesAnt.addEventListener('click', () => {
        mesVisualizacao--;
        if (mesVisualizacao < 1) { mesVisualizacao = 12; anoVisualizacao--; }
        atualizarVisorMes();
    });
}

const btnMesProx = document.getElementById('btn-mes-prox');
if (btnMesProx) {
    btnMesProx.addEventListener('click', () => {
        mesVisualizacao++;
        if (mesVisualizacao > 12) { mesVisualizacao = 1; anoVisualizacao++; }
        atualizarVisorMes();
    });
}

// --- FUNÇÕES GERAIS E MODAL ---
function mostrarLoading(mensagem = "Atualizando dados...") {
    const elMsg = document.getElementById('loading-mensagem');
    const modalLoad = document.getElementById('modal-loading');
    if (elMsg) elMsg.innerText = mensagem;
    if (modalLoad) modalLoad.classList.add('ativo');
}

function esconderLoading() {
    const modalLoad = document.getElementById('modal-loading');
    if (modalLoad) modalLoad.classList.remove('ativo');
}

function inicializarEventosModal() {
    const modalFormDivida = document.getElementById('modal-form-divida');
    const btnFechar = document.getElementById('btn-fechar-form-divida');
    const btnSalvar = document.getElementById('btn-salvar-divida');

    if (btnFechar && modalFormDivida) btnFechar.addEventListener('click', () => modalFormDivida.classList.remove('ativo'));
    if (btnSalvar) btnSalvar.addEventListener('click', salvarDividaOuEdicao);

    const inputParcelas = document.getElementById('input-parcelas');
    if (inputParcelas) {
        const btnDim = document.getElementById('btn-diminuir-parcela');
        const btnAum = document.getElementById('btn-aumentar-parcela');
        
        if (btnDim) {
            btnDim.addEventListener('click', () => {
                let valor = parseInt(inputParcelas.value) || 1;
                if (valor > 1) inputParcelas.value = valor - 1;
            });
        }
        
        if (btnAum) {
            btnAum.addEventListener('click', () => {
                let valor = parseInt(inputParcelas.value) || 1;
                inputParcelas.value = valor + 1;
            });
        }

        inputParcelas.addEventListener('change', () => {
            let valor = parseInt(inputParcelas.value);
            if (isNaN(valor) || valor < 1) inputParcelas.value = 1;
        });
    }

    ativarEventosRodinhaMouse();
}

function ativarEventosRodinhaMouse() {
    const selectMes = document.getElementById('select-mes');
    const selectAno = document.getElementById('select-ano');

    if (!selectMes || !selectAno) return;

    selectMes.addEventListener('wheel', (e) => {
        e.preventDefault(); 
        let indexAtual = selectMes.selectedIndex;
        if (e.deltaY < 0) {
            indexAtual = (indexAtual - 1 + selectMes.options.length) % selectMes.options.length;
        } else {
            indexAtual = (indexAtual + 1) % selectMes.options.length;
        }
        selectMes.selectedIndex = indexAtual;
    });

    selectAno.addEventListener('wheel', (e) => {
        e.preventDefault();
        let indexAtual = selectAno.selectedIndex;
        if (e.deltaY < 0) {
            if (indexAtual > 0) selectAno.selectedIndex = indexAtual - 1;
        } else {
            if (indexAtual < selectAno.options.length - 1) selectAno.selectedIndex = indexAtual + 1;
        }
    });
}

function atualizarInterfaceBotaoAcao() {
    const checkboxesSelecionados = document.querySelectorAll('.checkbox-selecao:checked');
    const qtdSelecionados = checkboxesSelecionados.length;
    const botoesAcao = document.querySelectorAll('#btn-acao-inferior, #btn-adicionar, .btn-acao-principal');

    botoesAcao.forEach(btn => {
        if (!btn) return;

        if (typeof obterModoSelecao === 'function' && obterModoSelecao()) {
            if (qtdSelecionados > 0) {
                btn.innerHTML = `
                    <svg class="icone-lixeira" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                    <span>excluir selecionadas (${qtdSelecionados})</span>
                `;
                btn.classList.add('modo-excluir');
            } else {
                btn.innerHTML = `
                    <svg class="icone-lixeira" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    <span>excluir dívida</span>
                `;
                btn.classList.add('modo-excluir');
            }
        } else {
            btn.innerHTML = `
                <span style="font-size: 22px; font-weight: bold; color: var(--texto-escuro); width: 28px; height: 28px; border: 2px solid var(--texto-escuro); border-radius: 50%; display: flex; justify-content: center; align-items: center; padding-bottom: 2px; flex-shrink: 0;">+</span>
                <span>adicionar dívida</span>
            `;
            btn.classList.remove('modo-excluir');
        }
    });
}

const btnAlternarModo = document.getElementById('btn-alternar-modo');
const btnAcaoInferior = document.getElementById('btn-acao-inferior');

if (btnAlternarModo) {
    btnAlternarModo.addEventListener('click', () => {
        if (typeof alternarModoSelecao === 'function') {
            alternarModoSelecao(
                btnAlternarModo, 
                btnAcaoInferior, 
                document.getElementById('label-visor'),
                document.getElementById('titulo-coluna-3'),
                document.getElementById('titulo-coluna-4'),
                renderizarLista
            );
        }
        atualizarInterfaceBotaoAcao();
    });
}

if (btnAcaoInferior) {
    btnAcaoInferior.addEventListener('click', () => {
        if (typeof obterModoSelecao === 'function' && obterModoSelecao()) {
            executarExclusaoSelecionada(URL_API, mostrarLoading, esconderLoading, carregarDados);
        } else {
            abrirFormularioCriar();
        }
    });
}

function abrirFormularioCriar() {
    const elTitulo = document.getElementById('modal-titulo-divida');
    if (elTitulo) elTitulo.innerText = "Nova Dívida";
    
    document.getElementById('edit-id').value = '';
    document.getElementById('input-descricao').value = '';
    document.getElementById('input-valor').value = '';
    
    document.getElementById('select-mes').value = String(mesVisualizacao).padStart(2, '0');
    document.getElementById('select-ano').value = String(anoVisualizacao);
    document.getElementById('input-parcelas').value = '1';
    
    const modalFormDivida = document.getElementById('modal-form-divida');
    if (modalFormDivida) modalFormDivida.classList.add('ativo');
}

function abrirFormularioEditar(id) {
    const conta = contasGlobais.find(c => String(c['ID'] || c['id'] || c['Id']) === String(id));
    if (!conta) return;

    const elTitulo = document.getElementById('modal-titulo-divida');
    if (elTitulo) elTitulo.innerText = "Editar Dívida";
    
    let chaveID = Object.keys(conta).find(k => k.toLowerCase() === 'id') || 'ID';
    let chaveDesc = Object.keys(conta).find(k => k.toLowerCase().includes('descri')) || 'Descrição';
    let chaveValor = Object.keys(conta).find(k => k.toLowerCase() === 'valor') || 'Valor';
    let chaveData = Object.keys(conta).find(k => k.toLowerCase() === 'data') || 'Data';
    let chaveTotalParc = Object.keys(conta).find(k => k.toLowerCase().includes('total')) || 'Total de Parcelas';

    document.getElementById('edit-id').value = conta[chaveID];
    document.getElementById('input-descricao').value = conta[chaveDesc];
    document.getElementById('input-valor').value = conta[chaveValor];
    
    let dataStr = String(conta[chaveData]);
    if (dataStr && dataStr !== 'undefined') {
        let numeros = dataStr.match(/\d+/g); 
        if (numeros && numeros.length >= 2) {
            if (numeros[0].length === 4) {
                document.getElementById('select-ano').value = numeros[0];
                document.getElementById('select-mes').value = numeros[1];
            } else if (numeros[2] && numeros[2].length === 4) {
                document.getElementById('select-ano').value = numeros[2];
                document.getElementById('select-mes').value = numeros[1];
            }
        }
    }

    document.getElementById('input-parcelas').value = conta[chaveTotalParc] || 1;
    const modalFormDivida = document.getElementById('modal-form-divida');
    if (modalFormDivida) modalFormDivida.classList.add('ativo');
}

async function salvarDividaOuEdicao() {
    const idEditando = document.getElementById('edit-id').value;
    const descricao = document.getElementById('input-descricao').value;
    const valor = document.getElementById('input-valor').value;
    const data = `${document.getElementById('select-mes').value}/${document.getElementById('select-ano').value}`;
    const parcelas = document.getElementById('input-parcelas').value;

    if (!descricao || !valor) { alert("Preencha a descrição e o valor!"); return; }

    const modalFormDivida = document.getElementById('modal-form-divida');
    if (modalFormDivida) modalFormDivida.classList.remove('ativo');
    
    mostrarLoading("Salvando alteração...");

    const payload = idEditando ? {
        acao: "editar", id: idEditando, descricao, valor, data, parcelas
    } : {
        acao: "inserir", descricao, valor, data, parcelas
    };

    try {
        await fetch(URL_API, {
            method: "POST", mode: "no-cors",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(payload)
        });
        setTimeout(() => carregarDados("Atualizando dados..."), 1200);
    } catch (err) {
        esconderLoading();
        alert("Erro ao salvar.");
    }
}

async function marcarComoPago(idConta) {
    const btn = document.getElementById('btn-' + idConta);
    const linha = document.getElementById('linha-' + idConta);
    if (!btn || !linha) return;

    const jaEstaPago = btn.classList.contains('pago');
    const novoStatus = jaEstaPago ? "Pendente" : "Pago";

    if (jaEstaPago) { 
        btn.classList.remove('pago'); 
        linha.classList.remove('linha-verde'); 
    } else { 
        btn.classList.add('pago'); 
        linha.classList.add('linha-verde'); 
    }

    const contaEncontrada = contasGlobais.find(c => String(c['ID'] || c['id'] || c['Id']) === String(idConta));
    if (contaEncontrada) {
        let chaveStatus = Object.keys(contaEncontrada).find(k => k.toLowerCase() === 'status') || 'Status';
        contaEncontrada[chaveStatus] = novoStatus;
    }

    atualizarSomaTotal();

    try {
        await fetch(URL_API, { 
            method: "POST", mode: "no-cors", 
            headers: { "Content-Type": "text/plain;charset=utf-8" }, 
            body: JSON.stringify({ acao: "atualizar_status", id: idConta, status: novoStatus }) 
        });
    } catch (err) {
        console.error("Erro ao atualizar status na planilha:", err);
    }
}

function selecionarCheckbox(idConta) {
    const linha = document.getElementById('linha-' + idConta);
    const checkbox = document.getElementById('check-' + idConta);
    if (!linha || !checkbox) return;

    if (checkbox.checked) linha.classList.add('linha-selecionada');
    else linha.classList.remove('linha-selecionada');
    
    atualizarSomaTotal();
    atualizarInterfaceBotaoAcao();
}

function configurarMesInicialAutomatico() {
    let hoje = new Date();
    let mes = hoje.getMonth() + 1;
    let ano = hoje.getFullYear();
    let encontrou = false;

    for (let i = 0; i < 12; i++) { 
        let mesFormatado = String(mes).padStart(2, '0');
        let anoFormatado = String(ano);

        let temNaoPaga = contasGlobais.some(conta => {
            let valorData = conta['Data'] || conta['data'] || conta['DATA'];
            if (!valorData) {
                let chave = Object.keys(conta).find(k => k.toLowerCase().includes('data'));
                if (chave) valorData = conta[chave];
            }

            let pertenceAoMes = false;
            if (valorData) {
                let dataStr = String(valorData).trim();
                if (dataStr.includes(`${mesFormatado}/${anoFormatado}`) || 
                    (dataStr.includes(`-${mesFormatado}-`) && dataStr.includes(anoFormatado)) ||
                    dataStr === `${mesFormatado}/${anoFormatado}` || 
                    (dataStr.includes(mesFormatado) && dataStr.includes(anoFormatado))) {
                    pertenceAoMes = true;
                } else if (dataStr.includes('T')) {
                    let d = new Date(dataStr);
                    d.setHours(d.getHours() + 4);
                    if (d.getMonth() + 1 === mes && d.getFullYear() === ano) {
                        pertenceAoMes = true;
                    }
                }
            }

            let status = conta['Status'] || conta['status'] || 'Pendente';
            let naoPaga = (status !== 'Pago' && status !== 'pago');

            return pertenceAoMes && naoPaga;
        });

        if (temNaoPaga) {
            mesVisualizacao = mes;
            anoVisualizacao = ano;
            encontrou = true;
            break;
        }

        mes++;
        if (mes > 12) {
            mes = 1;
            ano++;
        }
    }

    if (!encontrou) {
        mesVisualizacao = hoje.getMonth() + 1;
        anoVisualizacao = hoje.getFullYear();
    }
    
    atualizarVisorMes();
}

async function carregarDados(mensagem = "Carregando dados...") {
    mostrarLoading(mensagem);
    try {
        const resposta = await fetch(URL_API, { redirect: "follow" });
        contasGlobais = await resposta.json();

        if (primeiroCarregamento) {
            configurarMesInicialAutomatico();
            primeiroCarregamento = false;
        } else {
            renderizarLista();
        }

        esconderLoading();
    } catch (erro) {
        console.error(erro);
        esconderLoading();
        const elMesTitulo = document.getElementById('mes-titulo');
        if (elMesTitulo) elMesTitulo.innerText = '〈 erro 〉';
    }
}

function renderizarLista() {
    const listaHTML = document.getElementById('lista-contas');
    if (!listaHTML) return;

    listaHTML.innerHTML = ''; 
    let modoAtual = (typeof obterModoSelecao === 'function') ? obterModoSelecao() : false;
    contasDoMes = [];

    let mesFormatado = String(mesVisualizacao).padStart(2, '0');
    let anoFormatado = String(anoVisualizacao);

    contasGlobais.forEach(conta => {
        let valorData = conta['Data'] || conta['data'] || conta['DATA'];
        if (!valorData) {
            let chave = Object.keys(conta).find(k => k.toLowerCase().includes('data'));
            if (chave) valorData = conta[chave];
        }

        let pertenceAoMes = false;
        if (valorData) {
            let dataStr = String(valorData).trim();
            if (dataStr.includes(`${mesFormatado}/${anoFormatado}`)) {
                pertenceAoMes = true;
            } else if (dataStr.includes(`-${mesFormatado}-`) && dataStr.includes(anoFormatado)) {
                pertenceAoMes = true;
            } else if (dataStr.includes('T')) {
                let d = new Date(dataStr);
                d.setHours(d.getHours() + 4);
                if (d.getMonth() + 1 === mesVisualizacao && d.getFullYear() === anoVisualizacao) {
                    pertenceAoMes = true;
                }
            }
        } else {
            pertenceAoMes = true; 
        }

        if (pertenceAoMes) {
            contasDoMes.push(conta);
        }
    });

    contasDoMes.forEach(conta => {
        let idConta = conta['ID'] || conta['id'] || conta['Id'] || '';
        let descricao = conta['Descrição'] || conta['Descricao'] || conta['descrição'] || 'Sem Nome';
        let valor = conta['Valor'] || conta['valor'] || '0';
        let status = conta['Status'] || conta['status'] || 'Pendente';
        
        let totalParc = parseInt(conta['Total de Parcelas'] || conta['Parcelas'] || 1);
        let parcAtual = parseInt(conta['Parcela Atual'] || conta['parcela atual'] || 1);

        let taPago = (status === 'Pago' || status === 'pago');
        let coluna3Html = '';
        let coluna4Html = '';

        let infoParcela = '';
        if (totalParc > 1) {
            infoParcela = (parcAtual === totalParc) ? 'a última' : `${parcAtual}/${totalParc}`;
        }

        if (modoAtual) {
            coluna3Html = `<button class="btn-editar" onclick="abrirFormularioEditar('${idConta}')">✏️</button>`;
            coluna4Html = `<input type="checkbox" class="checkbox-selecao" id="check-${idConta}" data-id="${idConta}" data-valor="${valor}" onchange="selecionarCheckbox('${idConta}')">`;
        } else {
            coluna3Html = `<span style="font-size: 0.9em; font-style: italic;">${infoParcela}</span>`;
            coluna4Html = `<div class="btn-status ${taPago ? 'pago' : ''}" id="btn-${idConta}" onclick="marcarComoPago('${idConta}')"></div>`;
        }

        let classeFundo = (!modoAtual && taPago) ? 'linha-verde' : '';
        listaHTML.innerHTML += `
            <div class="item ${classeFundo}" id="linha-${idConta}">
                <span>${descricao}</span>
                <span>R$ ${valor}</span>
                ${coluna3Html}
                ${coluna4Html}
            </div>
        `;
    });

    atualizarSomaTotal();
    atualizarInterfaceBotaoAcao();
    
    if (typeof atualizarPreviaProximoMes === 'function') {
        atualizarPreviaProximoMes();
    }
}

function atualizarSomaTotal() {
    let soma = 0;
    let modoAtual = (typeof obterModoSelecao === 'function') ? obterModoSelecao() : false;

    if (modoAtual) {
        const checkboxesSelecionados = document.querySelectorAll('.checkbox-selecao:checked');
        checkboxesSelecionados.forEach(cb => {
            let valorNum = String(cb.getAttribute('data-valor')).replace(',', '.');
            soma += parseFloat(valorNum) || 0;
        });
    } else {
        contasDoMes.forEach(conta => {
            let chaveStatus = Object.keys(conta).find(k => k.toLowerCase() === 'status') || 'Status';
            let chaveValor = Object.keys(conta).find(k => k.toLowerCase() === 'valor') || 'Valor';
            
            let taPago = (conta[chaveStatus] === 'Pago' || conta[chaveStatus] === 'pago');
            if (!taPago) {
                let valorLimpo = String(conta[chaveValor]).replace(',', '.');
                soma += parseFloat(valorLimpo) || 0;
            }
        });
    }

    const txtTotal = document.getElementById('txt-total-geral');
    if (txtTotal) txtTotal.innerText = soma.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function atualizarPreviaProximoMes() {
    let proximoMes = mesVisualizacao + 1;
    let proximoAno = anoVisualizacao;
    if (proximoMes > 12) {
        proximoMes = 1;
        proximoAno++;
    }

    const nomesMesesCurto = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
    const nomesMesesCapitalizado = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    
    let nomeMesAtualStr = nomesMesesCurto[proximoMes - 1];
    let nomeMesCapStr = nomesMesesCapitalizado[proximoMes - 1];

    const labelPrevia = document.querySelector('.visor-previa .visor-label');
    const labelTotalPrevia = document.getElementById('txt-label-total-previa');

    if (labelPrevia) labelPrevia.innerText = `prévia de ${nomeMesAtualStr}`;
    if (labelTotalPrevia) labelTotalPrevia.innerText = `Total ${nomeMesCapStr}`;

    let mesFormatado = String(proximoMes).padStart(2, '0');
    let anoFormatado = String(proximoAno);

    let listaHtmlPrevia = '';
    let somaPrevia = 0;

    let contasProximoMes = contasGlobais.filter(conta => {
        let valorData = conta['Data'] || conta['data'] || conta['DATA'];
        if (!valorData) {
            let chave = Object.keys(conta).find(k => k.toLowerCase().includes('data'));
            if (chave) valorData = conta[chave];
        }
        if (!valorData) return false;

        let dataStr = String(valorData).trim();
        let pertenceAoProximoMes = false;

        if (dataStr.includes(`${mesFormatado}/${anoFormatado}`)) {
            pertenceAoProximoMes = true;
        } else if (dataStr.includes(`-${mesFormatado}-`) && dataStr.includes(anoFormatado)) {
            pertenceAoProximoMes = true;
        } else if (dataStr.includes('T')) {
            let d = new Date(dataStr);
            d.setHours(d.getHours() + 4);
            if (d.getMonth() + 1 === proximoMes && d.getFullYear() === proximoAno) {
                pertenceAoProximoMes = true;
            }
        } else if (dataStr === `${mesFormatado}/${anoFormatado}` || (dataStr.includes(mesFormatado) && dataStr.includes(anoFormatado))) {
            pertenceAoProximoMes = true;
        }

        return pertenceAoProximoMes;
    });

    if (contasProximoMes.length === 0) {
        listaHtmlPrevia = `<div style="opacity: 0.6; font-style: italic; padding: 5px 0;">sem contas registradas</div>`;
    } else {
        contasProximoMes.forEach(conta => {
            let desc = conta['Descrição'] || conta['Descricao'] || conta['descrição'] || 'Sem Nome';
            let valorBruto = conta['Valor'] || conta['valor'] || '0';
            
            let valStr = String(valorBruto).replace('R$', '').trim().replace(',', '.');
            let val = parseFloat(valStr) || 0;
            somaPrevia += val;

            listaHtmlPrevia += `
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px; padding-right: 5px;">
                    <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 130px;">${desc}</span>
                    <span style="font-weight: 500;">R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
            `;
        });
    }

    const containerLista = document.getElementById('lista-previa-proximo-mes');
    const txtTotalPrevia = document.getElementById('txt-total-previa');

    if (containerLista) containerLista.innerHTML = listaHtmlPrevia;
    if (txtTotalPrevia) txtTotalPrevia.innerText = somaPrevia.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// INICIALIZAÇÃO
inicializarEventosModal();
carregarDados("Carregando dados...");