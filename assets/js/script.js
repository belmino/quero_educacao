
/* Funções Listeners */

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('Your document is ready!');
    ajax_get('https://testapi.io/api/redealumni/scholarships', carregaDadosApi);
    document.getElementById("close-button").addEventListener("click", modalToggle);
    document.getElementById("btn_cancelar").addEventListener("click", modalToggle);
 });

document.getElementById("sel_cidade").addEventListener("change", function(event){
     console.log(event.target.value);
     montaListaCursos();     
})

document.getElementById("sel_curso").addEventListener("change", function(event){
    console.log(event.target.value);
    montaListaCursos();     
})

document.getElementById("ipt_range_valor").addEventListener("change", function(event){
    console.log(event.target.value);
    montaListaCursos();     
})

document.getElementById("chk_presencial").addEventListener("change", function(event){
    console.log(event.target.value);
    montaListaCursos();     
})

document.getElementById("chk_distancia").addEventListener("change", function(event){
    console.log(event.target.value);
    montaListaCursos();     
})
document.getElementById('btn_adicionar').addEventListener('click', function (event) {
    var inputs = document.getElementById('dv_cursos').getElementsByTagName("input");
    var dados = JSON.parse(localStorage.getItem("opcoes_cursos"));
    var favoritos = JSON.parse(localStorage.getItem("cursos_favoritos"));
    console.log(favoritos);
    
    for(var i = 0; i < inputs.length; i++) {
        if(inputs[i].type == "checkbox") {
            if(inputs[i].checked){
                console.log(dados[inputs[i].value]);
                if(!existeDentroArray(dados[inputs[i].value], favoritos)){
                    favoritos.push(dados[inputs[i].value]);
                }
            }
        }  
    }
    if(JSON.stringify(favoritos) !== localStorage.getItem("cursos_favoritos")){
        localStorage.setItem("cursos_favoritos", JSON.stringify(favoritos));
        montaListaCursos();
        criarCardsFavoritos();
    }
})

/*  Funções utilitárias */

function removerFavoritos(event){
    var pos = event.target.getAttribute("val-pos");
    var favoritos = JSON.parse(localStorage.getItem("cursos_favoritos"));
    favoritos.splice(pos, 1);
    localStorage.setItem("cursos_favoritos", JSON.stringify(favoritos));
    montaListaCursos();
    criarCardsFavoritos();
}

function modalToggle() {
    document.getElementById("modal").classList.toggle("closed");
    document.getElementById("modal-overlay").classList.toggle("closed");
}


function checkboxMarcado(){
    if(existeCheckboxMarcado()){
        document.getElementById('btn_adicionar').className = "btn btn_amarelo";
    }else{
        document.getElementById('btn_adicionar').className = "btn btn_indisponivel";
    }
}

function existeCheckboxMarcado(){
    var inputs = document.getElementById('dv_cursos').getElementsByTagName("input");
    for(var i = 0; i < inputs.length; i++) {
        if(inputs[i].type == "checkbox") {
            if(inputs[i].checked){
                return true;
            }
        }
    }
    return false;
}

function existeDentroArray(elemento, array){
    for (let item of array) {
        if(JSON.stringify(item) === JSON.stringify(elemento)){
            return true;
        }
    }
    return false;
}

function carregaDadosApi(data) {
    var cidades = [], cursos = [], semestres = [];
    data.forEach(function(item){
        if(!cidades.includes(item.campus.city)){
            cidades.push(item.campus.city);
        }
        if(!cursos.includes(item.course.name)){
            cursos.push(item.course.name);
        }
        if(!semestres.includes(item.enrollment_semester)){
            semestres.push(item.enrollment_semester);
        }
    });
    cidades.sort(compare);
    cursos.sort(compare);
    data.sort(compare2);
    
    localStorage.setItem("opcoes_cursos", JSON.stringify(data));

    var sel_cidade = document.getElementById("sel_cidade");
    var option = document.createElement("option");
    option.text = "Todas";
    option.value = "Todas";
    option.selected = true;
    sel_cidade.appendChild(option);
    cidades.forEach(function(item){
        var option = document.createElement("option");
        option.text = item;
        option.value = item;
        sel_cidade.appendChild(option);
    });

    var sel_curso = document.getElementById("sel_curso");
    var option = document.createElement("option");
    option.text = "Todos";
    option.value = "Todos";
    option.selected = true;
    sel_curso.appendChild(option);
    cursos.forEach(function(item){
        var option = document.createElement("option");
        option.text = item;
        option.value = item;
        sel_curso.appendChild(option);
    });

    var nav_semestres = document.getElementById("nav_semestres");
    var anchor = document.createElement("a");
    anchor.className = "semestre ativo";    
    anchor.innerText = "Todos os semestres";
    anchor.setAttribute('val-sem', "todos");
    anchor.addEventListener("click", clickSemestre);
    nav_semestres.appendChild(anchor);
    semestres.forEach(function(item){
        var anchor = document.createElement("a");
        anchor.className = "semestre";    
        var semestre_array = item.split(".");
        anchor.innerText =  semestre_array[1]+"º semestre de "+semestre_array[0];
        anchor.setAttribute('val-sem', item);
        anchor.addEventListener("click", clickSemestre);
        nav_semestres.appendChild(anchor);
    });

    montaListaCursos();

    if (localStorage.getItem("cursos_favoritos") === null) {
        localStorage.setItem("cursos_favoritos", JSON.stringify([]));
    }
    criarCardsFavoritos();
}

function clickSemestre(event){
    var semestre = event.target.getAttribute("val-sem");
    if(event.target.className === "semestre"){
        var nav_semestres = document.getElementById("nav_semestres").getElementsByTagName("a");
        for(var i = 0; i < nav_semestres.length; i++) {
            if(nav_semestres[i].getAttribute("val-sem") === semestre){
                nav_semestres[i].className = "semestre ativo";
            }else{
                nav_semestres[i].className = "semestre";
            }
        }
        criarCardsFavoritos();    
    }
}

function semestreSelecionado(){
    var nav_semestres = document.getElementById("nav_semestres").getElementsByTagName("a");
    for(var i = 0; i < nav_semestres.length; i++) {
        if(nav_semestres[i].className === "semestre ativo"){
            return nav_semestres[i].getAttribute("val-sem");
        }
    }    
}

function montaListaCursos(){
    var dv_cursos = document.getElementById("dv_cursos");
    var favoritos = JSON.parse(localStorage.getItem("cursos_favoritos"));
    var data = JSON.parse(localStorage.getItem("opcoes_cursos"));
    dv_cursos.innerHTML = '';
    var cidade = document.getElementById("sel_cidade").value;
    var curso = document.getElementById("sel_curso").value;
    var valor = document.getElementById("ipt_range_valor").value;
    var presencial = document.getElementById("chk_presencial").checked;
    var distancia = document.getElementById("chk_distancia").checked;
    data.forEach(function(item){
        if(!existeDentroArray(item, favoritos)){
            if(cidade === "Todas" || item.campus.city === cidade){
                if(curso === "Todos" || item.course.name === curso){
                    if(valor >= item.price_with_discount){
                        if((presencial&&distancia)||!(presencial||distancia)){
                            var linha = montaListaCursosLinha(item, data.indexOf(item));  
                            dv_cursos.appendChild(linha);
                        }else{
                            if(presencial && item.course.kind === "Presencial"){
                                var linha = montaListaCursosLinha(item, data.indexOf(item));  
                                dv_cursos.appendChild(linha);
                            }else{
                                if(distancia && item.course.kind === "EaD"){
                                    var linha = montaListaCursosLinha(item, data.indexOf(item));  
                                    dv_cursos.appendChild(linha);
                                } 
                            }
                        }
                    }
                }
            }
        }
    });
}

function montaListaCursosLinha(item, posicao){
    var linha = document.createElement('div');

    linha.className = "linha";
    var chk = document.createElement('input');
    chk.type = "checkbox";
    chk.className = "dv_cursos_checkbox";
    chk.value = posicao;
    chk.addEventListener('change', checkboxMarcado);

    var dv_chk = document.createElement('div');
    dv_chk.className = "celula_checkbox";        
    dv_chk.appendChild(chk);
    linha.appendChild(dv_chk);

    var img = document.createElement('img');
    img.setAttribute('src', item.university.logo_url);
    img.className = "logo_table";      
    var dv_img = document.createElement('div');
    dv_img.className = "celula_logo";      
    dv_img.appendChild(img);          
    linha.appendChild(dv_img);

    var divChild = document.createElement('div');
    divChild.className = "celula_curso";      

    var divCurso = document.createElement('div');
    divCurso.className = "text_main_verde";
    divCurso.innerText = item.course.name;
    var divNivel = document.createElement('div');
    divNivel.className = "text_complement_left";
    divNivel.innerText = item.course.level;
    var divChild = document.createElement('div');
    divChild.className = "celula_curso";      
    divChild.appendChild(divCurso);
    divChild.appendChild(divNivel);
    linha.appendChild(divChild);

    var divChild = document.createElement('div');
    divChild.className = "celula_valor";

    var divCurso = document.createElement('div');
    divCurso.className = "text_main";
    divCurso.innerText = "Bolsa de "+item.discount_percentage+"%"

    var divNivel = document.createElement('div');
    divNivel.className = "text_main";
    divNivel.innerText = "R$ "+item.price_with_discount+"/mês";

    divChild.appendChild(divCurso);
    divChild.appendChild(divNivel);
    linha.appendChild(divChild);

    return linha;
}

function criarCardsFavoritos(){
    
    var dv_favoritos = document.getElementById("favoritos");

    dv_favoritos.innerHTML = '';
    var favoritos = JSON.parse(localStorage.getItem("cursos_favoritos"));

    var card = document.createElement('div');
    card.className = "card";

    var span = document.createElement('span');
    span.className = "fa-stack icone_grande_azul";
    span.id = "open-button";
    var i1 = document.createElement('i');
    i1.className = "fa fa-circle-thin fa-stack-2x";
    var i2 = document.createElement('i');
    i2.className = "fa fa-plus fa-stack-1x";
    span.appendChild(i1);
    span.appendChild(i2);
    span.addEventListener("click", modalToggle);
    card.appendChild(span);
    var titulo = document.createElement('div');
    titulo.className = "text_main";
    titulo.innerText = "Adicionar bolsa";
    card.appendChild(titulo);
    var descricao = document.createElement('div');
    descricao.className = "text_complement";
    descricao.innerText = "Clique para adicionar bolsas de cursos do seu interesse";
    card.appendChild(descricao);
    dv_favoritos.appendChild(card);

    var semestre = semestreSelecionado();

    favoritos.forEach(function(item){

        if( semestre === "todos" || semestre === item.enrollment_semester ){

            var card = document.createElement('div');
            card.className = "card";
    
            var img = document.createElement('img');
            img.setAttribute('src', item.university.logo_url);
            img.setAttribute('alt', item.university.name);
            img.className = "logo_table";          
            card.appendChild(img);
    
            var universidade = document.createElement('div');
            universidade.className = "text_main_v2";
            universidade.innerText = item.university.name;
            card.appendChild(universidade);
    
            var curso = document.createElement('div');
            curso.className = "text_main_v2";
            curso.innerText = item.course.name;
            card.appendChild(curso);
    
            var nota = document.createElement('div');
            nota.className = "text_main_v2";
            nota.innerText = item.university.score;
            card.appendChild(nota);
    
            card.appendChild(document.createElement('hr'));
    
            var modalidade = document.createElement('div');
            modalidade.className = "text_main_v2";
            modalidade.innerText = item.course.kind+" - "+item.course.shift;
            card.appendChild(modalidade);
    
            var inicio = document.createElement('div');
            inicio.className = "text_complement";
            inicio.innerText = "Início das aulas em "+item.start_date;
            card.appendChild(inicio);
    
            card.appendChild(document.createElement('hr'));
    
            var quero_bolsa = document.createElement('div');
            quero_bolsa.className = "text_main_v2";
            if(item.enabled){
                quero_bolsa.innerText = "Mensalidade com o Quero Bolsa";
            }else{
                quero_bolsa.innerText = "Bolsa indisponível";
            }
            card.appendChild(quero_bolsa);
    
            var valor_cheio = document.createElement('div');
            if(item.enabled){
                valor_cheio.className = "text_complement tachado";
                valor_cheio.innerText = "R$ "+item.full_price;
            }else{
                valor_cheio.className = "text_complement";
                valor_cheio.innerText = "Entre em contato com o nosso ";
            }
            card.appendChild(valor_cheio);
    
            var valor_com_desonto = document.createElement('div');
            if(item.enabled){
                valor_com_desonto.className = "text_main_v2";
                valor_com_desonto.innerText = "R$ "+item.price_with_discount;
            }else{
                valor_com_desonto.className = "text_complement";
                valor_com_desonto.innerText = "atendimento para saber mais";
            }
            card.appendChild(valor_com_desonto);
            
            var botoes = document.createElement('div');
            botoes.className = "div_botoes";        
            var btn_excluir = document.createElement('button');
            btn_excluir.className = "btn btn_branco";
            btn_excluir.innerText = "Excluir";
            btn_excluir.addEventListener("click", removerFavoritos);
            btn_excluir.setAttribute('val-pos', favoritos.indexOf(item));
            botoes.appendChild(btn_excluir);
    
            if(item.enabled){
                var btn_oferta = document.createElement('button');
                btn_oferta.className = "btn btn_amarelo";
                btn_oferta.innerText = "Ver oferta";
                botoes.appendChild(btn_oferta);
            }else{
                var btn_indisponivel = document.createElement('button');
                btn_indisponivel.className = "btn btn_indisponivel";
                btn_indisponivel.innerText = "Indisponível";
                botoes.appendChild(btn_indisponivel);
            }
            card.appendChild(botoes);
    
            dv_favoritos.appendChild(card);
        }
    });
}

function compare(a, b){
    return (a<b)?-1:1;
}
function compare2(a, b){
    if(a.university.name<b.university.name){
        return -1;
    }
    if(a.university.name>b.university.name){
        return 1;
    }
    return (a.course.name<b.course.name)?-1:1
}

function ajax_get(url, callback) {
    var xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                var data = JSON.parse(xhr.responseText);
            } catch(err) {
                console.log(err.message + " in " + xhr.responseText);
                return;
            }
            callback(data);
            
        } else {
            console.log('The request failed!');
        }
    };

    xhr.open('GET', url, true);
    xhr.send();
}
