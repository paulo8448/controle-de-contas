// Verifica se o usuário está logado
if (localStorage.getItem("autenticado") !== "true") { 
    window.location.href = "login.html"; 
}

// Configurações Principais
const URL_API = "https://script.google.com/macros/s/AKfycbwp5vyLY2Sp7lplFW00cnfz7KJD6kvbJA1e6FMH4umkKn0H4InqBINty-uosYXHtfw/exec";
let contasGlobais = [];
let contasDoMes = []; 

// Variáveis de Data
let dataAtualVisualizacao = new Date();
let mesVisualizacao = dataAtualVisualizacao.getMonth() + 1; 
let anoVisualizacao = dataAtualVisualizacao.getFullYear();
const nomesMeses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

// --- LÓGICA DO MENU POP-UP DE DATAS (CALENDÁRIO ANIMADO) ---
const modalCalendario = document.getElementById('modal-calendario');
const popupCalendario = document.getElementById('popup-calendario');
const tituloAnoPopup = document.getElementById('titulo-ano-popup');
const grelhaMeses = document.getElementById('grelha-meses');
const grelhaAnos = document.getElementById('grelha-anos');

let anoPopupAtual = anoVisualizacao; 
let modoPopup = 'meses'; 

function atualizarVisorMes() {
    document.getElementById('mes-titulo').innerText = `${nomesMeses[mesVisualizacao - 1]} ${anoVisualizacao}`;
    renderizarLista();
}

document.getElementById('mes-titulo').addEventListener('click', () => {
    if (modalCalendario.classList.contains('ativo')) {
        fecharPopUpCalendario();
    } else {
        anoPopupAtual = anoVisualizacao;
        abrirVistaMeses();
        modalCalendario.classList.add('ativo');
    }
});

document.getElementById('btn-fechar-calendario').addEventListener('click', fecharPopUpCalendario);

modalCalendario.addEventListener('click', (e) => {
    if (e.target === modalCalendario) fecharPopUpCalendario();
});

function fecharPopUpCalendario() {
    modalCalendario.classList.remove('ativo');
}

function abrirVistaMeses() {
    modoPopup = 'meses';
    tituloAnoPopup.innerText = anoPopupAtual;
    grelhaAnos.style.display = 'none';
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

function abrirVistaAnos() {
    modoPopup = 'anos';
    let decadaInicio = Math.floor(anoPopupAtual / 10) * 10;
    tituloAnoPopup.innerText = `${decadaInicio} - ${decadaInicio + 9}`;
    
    grelhaMeses.style.display = 'none';
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

tituloAnoPopup.addEventListener('click', () => {
    if (modoPopup === 'meses') abrirVistaAnos();
    else abrirVistaMeses();
});

document.getElementById('btn-ano-ant').addEventListener('click', () => {
    if (modoPopup === 'meses') { anoPopupAtual--; abrirVistaMeses(); } 
    else { anoPopupAtual -= 10; abrirVistaAnos(); }
});

document.getElementById('btn-ano-prox').addEventListener('click', () => {
    if (modoPopup === 'meses') { anoPopupAtual++; abrirVistaMeses(); } 
    else { anoPopupAtual += 10; abrirVistaAnos(); }
});

// Lógica das setas laterais (no header)
document.getElementById('btn-mes-ant').addEventListener('click', () => {
    mesVisualizacao--;
    if (mesVisualizacao < 1) { mesVisualizacao = 12; anoVisualizacao--; }
    atualizarVisorMes();
});

document.getElementById('btn-mes-prox').addEventListener('click', () => {
    mesVisualizacao++;
    if (mesVisualizacao > 12) { mesVisualizacao = 1; anoVisualizacao++; }
    atualizarVisorMes();
});

// --- FUNÇÕES GERAIS E MODAL ---
function mostrarLoading(mensagem = "Atualizando dados...") {
    document.getElementById('loading-mensagem').innerText = mensagem;
    document.getElementById('modal-loading').classList.add('ativo');
}

function esconderLoading() {
    document.getElementById('modal-loading').classList.remove('ativo');
}

document.getElementById('btn-sair').addEventListener('click', () => {
    localStorage.removeItem("autenticado");
    window.location.href = "login.html";
});

function inicializarEventosModal() {
    const modalFormDivida = document.getElementById('modal-form-divida');

    document.getElementById('btn-fechar-form-divida').addEventListener('click', () => modalFormDivida.classList.remove('ativo'));
    document.getElementById('btn-salvar-divida').addEventListener('click', salvarDividaOuEdicao);

    const inputParcelas = document.getElementById('input-parcelas');
    if(inputParcelas){
        document.getElementById('btn-diminuir-parcela').addEventListener('click', () => {
            let valor = parseInt(inputParcelas.value) || 1;
            if (valor > 1) inputParcelas.value = valor - 1;
        });
        
        document.getElementById('btn-aumentar-parcela').addEventListener('click', () => {
            let valor = parseInt(inputParcelas.value) || 1;
            inputParcelas.value = valor + 1;
        });

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

// BOTÕES INFERIORES
const btnAlternarModo = document.getElementById('btn-alternar-modo');
const btnAcaoInferior = document.getElementById('btn-acao-inferior');

if (btnAlternarModo) {
    btnAlternarModo.addEventListener('click', () => {
        alternarModoSelecao(
            btnAlternarModo, 
            btnAcaoInferior, 
            document.getElementById('label-visor'),
            document.getElementById('titulo-coluna-3'),
            document.getElementById('titulo-coluna-4'),
            renderizarLista
        );
    });
}

if (btnAcaoInferior) {
    btnAcaoInferior.addEventListener('click', () => {
        if (obterModoSelecao()) {
            executarExclusaoSelecionada(URL_API, mostrarLoading, esconderLoading, carregarDados);
        } else {
            abrirFormularioCriar();
        }
    });
}

function abrirFormularioCriar() {
    document.getElementById('modal-titulo-divida').innerText = "Nova Dívida";
    document.getElementById('edit-id').value = '';
    document.getElementById('input-descricao').value = '';
    document.getElementById('input-valor').value = '';
    
    document.getElementById('select-mes').value = String(mesVisualizacao).padStart(2, '0');
    document.getElementById('select-ano').value = String(anoVisualizacao);
    document.getElementById('input-parcelas').value = '1';
    
    const modalFormDivida = document.getElementById('modal-form-divida');
    if(modalFormDivida) modalFormDivida.classList.add('ativo');
}

function abrirFormularioEditar(id) {
    const conta = contasGlobais.find(c => String(c['ID'] || c['id'] || c['Id']) === String(id));
    if (!conta) return;

    document.getElementById('modal-titulo-divida').innerText = "Editar Dívida";
    
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
    document.getElementById('modal-form-divida').classList.add('ativo');
}

async function salvarDividaOuEdicao() {
    const idEditando = document.getElementById('edit-id').value;
    const descricao = document.getElementById('input-descricao').value;
    const valor = document.getElementById('input-valor').value;
    const data = `${document.getElementById('select-mes').value}/${document.getElementById('select-ano').value}`;
    const parcelas = document.getElementById('input-parcelas').value;

    if (!descricao || !valor) { alert("Preencha a descrição e o valor!"); return; }

    document.getElementById('modal-form-divida').classList.remove('ativo');
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
    if (checkbox.checked) linha.classList.add('linha-selecionada');
    else linha.classList.remove('linha-selecionada');
    atualizarSomaTotal();
}

async function carregarDados(mensagem = "A carregar dados...") {
    mostrarLoading(mensagem);
    try {
        const resposta = await fetch(URL_API, { redirect: "follow" });
        contasGlobais = await resposta.json();
        renderizarLista();
        esconderLoading();
    } catch (erro) {
        console.error(erro);
        esconderLoading();
        document.getElementById('mes-titulo').innerText = '〈 erro 〉';
    }
}

function renderizarLista() {
    const listaHTML = document.getElementById('lista-contas');
    listaHTML.innerHTML = ''; 
    let modoAtual = obterModoSelecao();
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
    
    if (typeof atualizarPreviaProximoMes === 'function') {
        atualizarPreviaProximoMes();
    }
}

function atualizarSomaTotal() {
    let soma = 0;

    if (obterModoSelecao()) {
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

    document.getElementById('txt-total-geral').innerText = soma.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// --- FUNÇÃO PARA CALCULAR A PRÉVIA DO MÊS SEGUINTE ---
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
        listaHtmlPrevia = `<div style="opacity: 0.6; font-style: italic; padding: 5px 0;">sem contas registadas</div>`;
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

// INICIALIZAÇÃO DIRETA
inicializarEventosModal();
atualizarVisorMes();
carregarDados("A carregar dados...");