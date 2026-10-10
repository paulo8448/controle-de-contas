let modoSelecao = false;

function alternarModoSelecao(btnAlternar, btnAcaoInferior, labelVisor, tituloCol3, tituloCol4, renderCallback) {
    modoSelecao = !modoSelecao;
    if (modoSelecao) {
        btnAlternar.innerText = "✅";
        btnAcaoInferior.innerText = "🗑";
        btnAcaoInferior.classList.add('modo-lixeira');
        labelVisor.innerText = "Total Selecionadas";
        tituloCol3.innerText = "editar";
        tituloCol4.innerText = "selecionar";
    } else {
        btnAlternar.innerText = "📋";
        btnAcaoInferior.innerText = "+";
        btnAcaoInferior.classList.remove('modo-lixeira');
        labelVisor.innerText = "Total em Dívidas";
        tituloCol3.innerText = "parcelas";
        tituloCol4.innerText = "pago";
    }
    renderCallback();
    return modoSelecao;
}

function obterModoSelecao() {
    return modoSelecao;
}

function definirModoSelecao(status) {
    modoSelecao = status;
}

async function executarExclusaoSelecionada(urlApi, mostrarLoadingCallback, esconderLoadingCallback, recarregarCallback) {
    const checkboxes = document.querySelectorAll('.checkbox-selecao:checked');
    if (checkboxes.length === 0) {
        alert("Selecione ao menos uma dívida para apagar.");
        return;
    }

    if (!confirm(`Deseja apagar ${checkboxes.length} dívida(s) selecionada(s)?`)) return;

    let idsParaApagar = [];
    checkboxes.forEach(cb => {
        idsParaApagar.push(cb.getAttribute('data-id'));
    });

    mostrarLoadingCallback("Apagando registos...");

    try {
        await fetch(urlApi, {
            method: "POST", mode: "no-cors",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({ acao: "excluir", ids: idsParaApagar })
        });

        definirModoSelecao(false);
        document.getElementById('btn-alternar-modo').innerText = "📋";
        const btnInferior = document.getElementById('btn-acao-inferior');
        btnInferior.innerText = "+";
        btnInferior.classList.remove('modo-lixeira');

        setTimeout(() => recarregarCallback("Atualizando dados..."), 1200);
    } catch (err) {
        esconderLoadingCallback();
        alert("Erro ao excluir.");
    }
}