// ======================================
// MAPA.JS
// Parte 1
// ======================================

let mapa;
let camadaTerritorio;
let marcadores = [];

function mostrarMapa() {

    document.getElementById("conteudo").innerHTML = `

        <button onclick="carregarListaTerritorios()">
            ← Voltar
        </button>

        <h2>${territorioAtual.codigo} - ${territorioAtual.nome}</h2>

        <div id="progresso">
            0 / 0 Quadras
        </div>

        <div class="botoesMapa">

            <button onclick="abrirGoogleMaps()">
                📍 Google Maps
            </button>

            <button onclick="abrirWaze()">
                🚗 Waze
            </button>

            <button onclick="limparTerritorio()">
                🔄 Limpar
            </button>

        </div>

        <div id="map"></div>

    `;

    criarMapa();

}

function criarMapa(){

    mapa = L.map("map");

    L.tileLayer(

        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

        {

            attribution:"© OpenStreetMap"

        }

    ).addTo(mapa);

    carregarGeoJSON();

}

async function carregarGeoJSON(){

    const resposta = await fetch(

        "data/geojson/" + territorioAtual.arquivo

    );

    const geojson = await resposta.json();

    const status = carregarStatus();

    let contador = 1;

    camadaTerritorio = L.geoJSON(

        geojson,

        {

            style:function(){

                return{

                    color:"#224ea0",

                    weight:2,

                    fillColor:"rgb(33, 163, 77)",

                    fillOpacity:0.6

                };

            },

            onEachFeature:function(feature,layer){

                const nome = feature.properties.name || "";

    // Ignora o polígono que representa o limite do território
                if(!nome.startsWith("Quadra")){

                    return;

                }

                const numero = nome.replace("Quadra ","");

                layer.nomeQuadra = nome;

                layer.concluida = status[nome] || false;

                const centro = layer.getBounds().getCenter();

                const marcador = L.marker(centro,{

                    icon:L.divIcon({

                        className:"numeroQuadra",

                        html:`<div class="circuloQuadra">${numero}</div>`

                    })

                }).addTo(mapa);

                marcadores.push({

                    layer,
                    marcador

                });

                layer.bindPopup(nome);

                layer.on("click",function(){

                    layer.concluida = !layer.concluida;

                    atualizarVisual(layer,marcador);

                    salvarProgresso();

                    atualizarProgresso();

                });

            }

        }

    ).addTo(mapa);

    mapa.fitBounds(camadaTerritorio.getBounds());

        setTimeout(()=>{

            marcadores.forEach(item=>{

                atualizarVisual(

                    item.layer,
                    item.marcador

                );

            });

            atualizarProgresso();

        },150);

    }

// ======================================
// Atualiza aparência
// ======================================

function atualizarVisual(layer,marcador){

    if(layer.concluida){

        layer.setStyle({

            color:"#666",
            fillColor:"#999"

        });

    }else{

        layer.setStyle({

            color:"#5dd452",
            fillColor:"rgb(33, 163, 77)"

        });

    }

    requestAnimationFrame(()=>{

        const elemento = marcador.getElement();

        if(!elemento) return;

        const circulo =
            elemento.querySelector(".circuloQuadra");

        if(!circulo) return;

        if(layer.concluida){

            circulo.classList.add("concluida");

        }else{

            circulo.classList.remove("concluida");

        }

    });

}

// ======================================
// Salvar progresso
// ======================================

function salvarProgresso(){

    const status = {};

    marcadores.forEach(item=>{

        status[item.layer.nomeQuadra] =
            item.layer.concluida;

    });

    salvarStatus(status);

}

// ======================================
// Atualizar contador
// ======================================

function atualizarProgresso(){

    let total = 0;

    let concluidas = 0;

    marcadores.forEach(item=>{

        total++;

        if(item.layer.concluida){

            concluidas++;

        }

    });

    document.getElementById("progresso").innerHTML =
        `${concluidas} / ${total} quadras`;

}

// ======================================
// Google Maps
// ======================================

function abrirGoogleMaps(){

    const url =
`https://www.google.com/maps/search/?api=1&query=${territorioAtual.latitude},${territorioAtual.longitude}`;

    window.open(url,"_blank");

}

// ======================================
// Waze
// ======================================

function abrirWaze(){

    const url =
`https://www.waze.com/ul?ll=${territorioAtual.latitude},${territorioAtual.longitude}&navigate=yes`;

    window.open(url,"_blank");

}