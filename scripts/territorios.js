// ======================================
// TERRITORIOS.JS
// Lista de Territórios
// ======================================

let territorioAtual = null;

async function carregarListaTerritorios() {

    try {

        const resposta = await fetch("data/territorios.json");

        const territorios = await resposta.json();

        let html = `
            <h2>Territórios</h2>
        `;

        territorios.forEach(territorio => {

            html += `

                <button onclick="abrirTerritorio(${territorio.id})">

                    ${territorio.codigo} - ${territorio.nome}

                </button>

            `;

        });

        document.getElementById("conteudo").innerHTML = html;

    }

    catch (erro) {

        document.getElementById("conteudo").innerHTML = `

            <h2>Erro ao carregar os territórios.</h2>

            <p>${erro}</p>

        `;

        console.error(erro);

    }

}

// ======================================
// Abre um território
// ======================================

async function abrirTerritorio(id){

    const resposta = await fetch("data/territorios.json");

    const territorios = await resposta.json();

    territorioAtual = territorios.find(t => t.id == id);

    if(!territorioAtual){

        alert("Território não encontrado.");

        return;

    }

    mostrarMapa();

}