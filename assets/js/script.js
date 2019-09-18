
var modal = document.querySelector("#modal");
var modalOverlay = document.querySelector("#modal-overlay");
var closeButton = document.querySelector("#close-button");
var openButton = document.querySelector("#open-button");

closeButton.addEventListener("click", function() {
    modal.classList.toggle("closed");
    modalOverlay.classList.toggle("closed");
});

openButton.addEventListener("click", function() {
    modal.classList.toggle("closed");
    modalOverlay.classList.toggle("closed");
});

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
            // console.log(data);
            callback(data);
            
        } else {
            console.log('The request failed!');
        }
    };

    xhr.open('GET', url, true);
    xhr.send();
}

ajax_get('https://testapi.io/api/redealumni/scholarships', function(data) {
    var cidades = [], cursos = [];
    data.forEach(function(item){
        if(!cidades.includes(item.campus.city)){
            cidades.push(item.campus.city);
        }
        if(!cursos.includes(item.course.name)){
            cursos.push(item.course.name);
        }
    });
    cidades.sort(compare);
    cursos.sort(compare);
    data.sort(compare2);
    // localStorage.setItem("cidades", JSON.stringify(cidades));
    // localStorage.setItem("cursos", JSON.stringify(cursos));
    localStorage.setItem("dados", JSON.stringify(data));
    var sel_cidade = document.getElementById("sel_cidade");
    var sel_curso = document.getElementById("sel_curso");
    cidades.forEach(function(item){
        var option = document.createElement("option");
        option.text = item;
        option.value = item;
        sel_cidade.appendChild(option);
    });
    cursos.forEach(function(item){
        var option = document.createElement("option");
        option.text = item;
        option.value = item;
        sel_curso.appendChild(option);
    });
    // var tb_curso = document.getElementById("tb_cursos");
    // var tBody = document.createElement('tbody');
    // tb_curso.appendChild(tBody);
    var dv_cursos = document.getElementById("dv_cursos");
    var i =0;
    data.forEach(function(item){
        var linha = document.createElement('div');

        linha.className = "linha";
        var chk = document.createElement('input');
        chk.type = "checkbox";

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
        divCurso.className = "text_main3";
        divCurso.innerText = item.course.name;
        var divNivel = document.createElement('div');
        divNivel.className = "text_complement3";
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
        // divParent.appendChild(divChild);
        linha.appendChild(divChild);

        dv_cursos.appendChild(linha);

    });
});

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

