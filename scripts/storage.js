// ======================================
// STORAGE.JS
// Gerenciamento do LocalStorage
// ======================================

function obterChaveTerritorio() {

    return "territorio_" + territorioAtual.codigo;

}

// ======================================
// Salva o progresso
// ======================================

function salvarStatus(status) {

    localStorage.setItem(

        obterChaveTerritorio(),

        JSON.stringify(status)

    );

}

// ======================================
// Carrega o progresso
// ======================================

function carregarStatus() {

    const dados = localStorage.getItem(

        obterChaveTerritorio()

    );

    if (!dados)
        return {};

    return JSON.parse(dados);

}

// ======================================
// Limpa um território
// ======================================

function limparTerritorio() {

    if (!confirm("Deseja limpar todas as quadras deste território?"))
        return;

    localStorage.removeItem(

        obterChaveTerritorio()

    );

    mostrarMapa();

}