ordineAlfabeticoCognome= function (a,b){
    if (a.cognome < b.cognome) return -1; 
    if (a.cognome > b.cognome) return 1;
    return 0;
}

numeroIntValido = function(num){
    if (num>0&&num<=studenti_quarta_asa.length) return num;
    return 0;
}

CambiaPosizione= function(studente){
    if (click1) {
        click1=false;

        for (i=0;i<gruppi.length;i++){
            for (j=0;j<gruppi[i].length;j++){
                if (gruppi[i][j]===studente) {
                    IndiceStudente2=[i,j];
                    document.getElementsByTagName("li")[i].childNodes[j+1].style.backgroundColor = "abcdef";
                }
            }
        }

        studenteAppoggio=gruppi[IndiceStudente1[0]][IndiceStudente1[1]];
        gruppi[IndiceStudente1[0]][IndiceStudente1[1]]=gruppi[IndiceStudente2[0]][IndiceStudente2[1]];
        gruppi[IndiceStudente2[0]][IndiceStudente2[1]]=studenteAppoggio;

        for (gruppo of gruppi) 
        gruppo.sort(ordineAlfabeticoCognome);
        setTimeout(function(){stampaGruppi(gruppi,"out")}, 150);
    }

    else{
        click1=true;
        for (i=0;i<gruppi.length;i++){
            for (j=0;j<gruppi[i].length;j++){
                if (gruppi[i][j]===studente) {
                    IndiceStudente1=[i,j];
                    document.getElementsByTagName("li")[i].childNodes[j+1].style.backgroundColor = "abcdef";
                }
            }
        }
    }
}

creaGruppi= function(elencoDinamico,numeroInt){
    scarto=elencoDinamico.length%numeroInt;
    NumStudenti=parseInt(elencoDinamico.length/numeroInt);
    gruppi=[]
    for (i=0;i<numeroInt;i++){
        if (i<scarto) numeroStudenti=NumStudenti+1;
        else numeroStudenti=NumStudenti;
        gruppo=[];
        for (j=0;j<numeroStudenti;j++){
            StudenteIndice=Math.floor(Math.random() * elencoDinamico.length);
            gruppo.push(elencoDinamico.splice(StudenteIndice,1)[0]);
        }
        gruppo.sort(ordineAlfabeticoCognome);
        gruppi.push(gruppo);
    }
    return gruppi;
    //provo magari a togliere tutta la parte deglia arrotondamenti che dovrebbe essere superflua
}

stampaGruppi= function(gruppi,id){
    form=document.getElementsByTagName("form")[0];
    form.innerHTML=``;

    section=document.getElementsByTagName("section")[0];
    section.innerHTML=`
    <h2>I gruppi sono:</h2>
    <ol id="out"></ol>
    `;

    buttonReset=document.createElement("button");
    buttonReset.innerHTML= "Estrai nuovamente";
    buttonReset.onclick = () => window.location.reload();
    footer= document.getElementsByTagName("footer")[0];
    footer.innerHTML=``;
    footer.appendChild(buttonReset);
    
    out=document.getElementById("out");
    for (i=0;i<gruppi.length;i++){
        li=document.createElement("li");
        h3=document.createElement("h3")
        h3.innerHTML="Gruppo "+(i+1)+ ":";
        li.appendChild(h3);
        for (e of gruppi[i]) li.appendChild(e.toHTMLout());
        out.appendChild(li);
    }
}

generaStudente = function(){
    numeroInt= numeroIntValido(parseInt(document.getElementsByTagName("input")[0].value));
    if (!numeroInt) alert("Numero di interrogazioni non valido.");
    else{
        elencoDinamico=Object.assign([], quarta_asa.elencoStudenti);
        gruppi=creaGruppi(elencoDinamico,numeroInt);
        stampaGruppi(gruppi);
    }
}


var form = document.getElementsByTagName("form")[0];
form.onsubmit = (event) => { event.preventDefault() }

click1=false;
IndiceStudente1=[];
IndiceStudente2=[];



/*Copia questo nella console quando sono alla pagina di base
elencoDinamico=Object.assign([], quarta_asa.elencoStudenti);
        gruppi=creaGruppi(elencoDinamico,1);
        stampaGruppi(gruppi,"ElencoRimuovi");
*/


//queste sono già specificate nell'html per questioni di comodità nel ricaricare la pagina
//button=document.getElementsByTagName("button")[0];
//button.onclick = () => generaStudente();

/*
studenti da escludere dal sorteggio
studenti già in un determinato gruppo
le date (specifico i giorni della settimana, e da quali giorni partono le interrogazioni)
*/

//elencoCognomi=document.getElementsByTagName("input")[1].value.split(' ').join('').split(",");
//cognomeValido = cognomiValidi(elencoCognomi);
//if (!cognomeValido==0) alert("Hai sbagliato a scrivere "+elencoCognomi[cognomeValido-1]+"? (Il cognome in posizione "+cognomeValido+")");

function classe (indirizzo, elencoStudenti){
    this.indirizzo = indirizzo;
    this.elencoStudenti = elencoStudenti;
}

function studente (nome,cognome){
    this.nome=nome;
    this.cognome=cognome;
    this.toHTMLout = function (){
        p = document.createElement("p");
        p.innerHTML = this.nome + " " + this.cognome;
        p.onclick = () => CambiaPosizione(this);
        return p;
    }
}

var studenti_quarta_asa = [
    new studente('Gabriele', 'Baietta'),
    new studente('Alessia', 'Bala'),
    new studente('Filippo', 'Beretta'),
    new studente('Vittorio', 'Canestrari'),
    new studente('Emanuele', 'Cattaneo'),
    new studente('Luisa', 'Crecchi'),
    new studente('Samira', 'El Ayyane'),
    new studente('Elia', 'Fumagalli'),
    new studente('Leonardo', 'Gementi'),
    new studente('Simon', 'Groet'),
    new studente('Alice', 'Monticelli'),
    new studente('Arianna', 'Olmo'),
    new studente('Gabirele', 'Pennati'),
    new studente('Leonardo', 'Perano'),
    new studente('Gabriele', 'Perego'),
    new studente('Greta', 'Perseghin'),
    new studente('Verena', 'Roncalli'),
    new studente('Giulia', 'Rossi'),
    new studente('Alessandro', 'Sironi'),
    new studente('Elena', 'Spinelli'),
    new studente('Matteo', 'Valnegri'),
    new studente('Francesca', 'Valsecchi'),
    new studente('Francesco', 'Vannucchi'),
    new studente('Alessandro', 'Ventura'),
    new studente('Alice', 'Volonte')
]

studenti_quarta_asa.sort(ordineAlfabeticoCognome);
var quarta_asa = new classe("4ASA", studenti_quarta_asa);