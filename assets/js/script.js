ordineAlfabeticoCognome= function (a,b){
    //ordina in ordine alfabetico in base al cognome dell'oggetto
    if (a.cognome < b.cognome) return -1; 
    if (a.cognome > b.cognome) return 1;
    return 0;
}

numeroIntValido = function(num, Classe){
    //controllo che il numero sia valido, considerando pure gli studenti rimossi
    var x=0;
    for (e of Classe) if (e.valorePredefinito(Classe)===-1) x++;
    if (num>0&&num<=(Classe.length-x)) return num;
    return 0;
}

CambiaPosizione= function(studente,Classe){
    //se ho già cliccato, scambio
    if (click1) {
        click1=false;

        for (var i=0;i<gruppi.length;i++){
            for (var j=0;j<gruppi[i].length;j++){
                if (gruppi[i][j]===studente) {
                    IndiceStudente2=[i,j];
                    document.getElementsByTagName("li")[i].childNodes[j+1].style.backgroundColor = "abcdef";
                }
            }
        }

        var studenteAppoggio=gruppi[IndiceStudente1[0]][IndiceStudente1[1]];
        gruppi[IndiceStudente1[0]][IndiceStudente1[1]]=gruppi[IndiceStudente2[0]][IndiceStudente2[1]];
        gruppi[IndiceStudente2[0]][IndiceStudente2[1]]=studenteAppoggio;

        for (gruppo of gruppi) gruppo.sort(ordineAlfabeticoCognome);
        setTimeout(function(){stampaGruppi(gruppi,1,Classe)}, 150);
    }

    //se non ho già cliccato, evidenzio il primo
    else{
        click1=true;
        for (var i=0;i<gruppi.length;i++){
            for (var j=0;j<gruppi[i].length;j++){
                if (gruppi[i][j]===studente) {
                    IndiceStudente1=[i,j];
                    document.getElementsByTagName("li")[i].childNodes[j+1].style.backgroundColor = "abcdef";
                }
            }
        }
    }
}

creaGruppi= function(elencoDinamico,numeroInt,Classe,tipo){
    var length=elencoDinamico.length;

    //rimuove gli studenti da ElencoDinamico
    for (var i=0;i<elencoDinamico.length;i++){
        var g=elencoDinamico[i].valorePredefinito(Classe);
        if (g<0) length--;
    }

    var scarto=length%numeroInt;
    var NumStudenti=parseInt(length/numeroInt);

    //genera i gruppi vuoti
    for (var i=0;i<numeroInt;i++){
        if (tipo){
            if (i<scarto) numeroStudenti=NumStudenti+1;
            else numeroStudenti=NumStudenti;
        }else{
            numeroStudenti=1;
        }
        var gruppo=[];
        gruppo.length=numeroStudenti;
        gruppi.push(gruppo);
    }
    
    if (tipo){
        //aggiunge gli studenti ai gruppi pre-determinati
        for (var i=0;i<elencoDinamico.length;i++){
            var g=elencoDinamico[i].valorePredefinito(Classe);
            if (g>0 && g-1<gruppi.length){
                for (j=0;j<gruppi[g-1].length;j++){
                    if (gruppi[g-1][j]===undefined) {
                    gruppi[g-1][j]=elencoDinamico[i];
                    break;
                    }
                }
            }
        }
    }
    

    //rimuove gli studenti da non inserire a caso
    var t=0
    var elencoSupporto=Object.assign([], elencoDinamico);
    for (var x=0;x<elencoSupporto.length;x++){
        var g=elencoSupporto[x].valorePredefinito(Classe);
        if (tipo){
            if (g!=0){
                elencoDinamico.splice(t,1);
                t--;
            }  
        }else{
            if (g<0){
                elencoDinamico.splice(t,1);
                t--;
            } 
        }
        t++;
    }

    //riempio i gruppi
    for (var i=0;i<gruppi.length;i++){
        for (var j=0;j<gruppi[i].length;j++){
            if (gruppi[i][j]===undefined){
                var StudenteIndice=Math.floor(Math.random() * elencoDinamico.length);
                gruppi[i][j]=elencoDinamico.splice(StudenteIndice,1)[0];
            }
        }
        gruppi[i].sort(ordineAlfabeticoCognome);
    }

    //ritorno l'array coi gruppi
    return gruppi;
}

stampaGruppi= function(gruppi,tipo){
    //elimino il contenuto di form
    var form=document.getElementsByTagName("form")[0];
    form.innerHTML=``;

    //creo section
    var section=document.getElementById("out");
    if (tipo){
        section.innerHTML=`
        <h2>Gruppi estratti:</h2>
        <ol id="outgruppo"></ol>
        `;
    }else{
        if (gruppi.length===1){
            section.innerHTML=`
            <h2>Studente estratto:</h2>
            <ol id="outgruppo"></ol>
        `;
        }else {
            section.innerHTML=`
            <h2>Studenti estratti:</h2>
            <ol id="outgruppo"></ol>
        `;
        }
    }
    
    //stampo i gruppi
    var out=document.getElementById("outgruppo");
    for (var i=0;i<gruppi.length;i++){
        var li=document.createElement("li");
        if (tipo){
            var h3=document.createElement("h3")
            h3.innerHTML="Gruppo "+(i+1)+ ":";
            li.appendChild(h3);
        }
        for (e of gruppi[i]) li.appendChild(e.toHTMLout(tipo));
        out.appendChild(li);
    }

    //creo il bottone nel footer
    var footer= document.getElementsByTagName("footer")[0];
    footer.innerHTML=``;
    var buttonReset=document.createElement("button");
    buttonReset.innerHTML= "Estrai nuovamente";
    buttonReset.onclick = () => window.location.reload();
    footer.appendChild(buttonReset);  
}

stampaInizio= function(Classe){
    //stampa l'elenco di studenti da cui selezionare i gruppi predefiniti
    var out=document.getElementById("inizio");
    for (e of Classe) out.appendChild(e.toHTMLinizio());
}

controllaGruppi = function (gruppi){
    //verifica che i gruppi siano del tutto riempiti, quindi che l'ultimo elemento dell'ultimo gruppo non sia undefined
    if (gruppi[gruppi.length-1][gruppi[gruppi.length-1].length-1]===undefined) return false;
    return true;
}

generaGruppi = function(Classe,tipo){
    //quello che succede a cliccare il bottone "Crea gruppi"
    numeroInt= numeroIntValido(parseInt(document.getElementsByTagName("input")[0].value),Classe);
    if (!numeroInt) alert("Numero di gruppi non valido.");
    else{
        elencoDinamico=Object.assign([], Classe);
        var gruppi=creaGruppi(elencoDinamico,numeroInt, Classe,tipo);
        if (controllaGruppi(gruppi)) stampaGruppi(gruppi,tipo,Classe);
        else alert("Troppe persone in un gruppo o gruppo non esistente");
    }
}

//definisco l'oggetto studente
function studente (nome,cognome){
    this.nome=nome;
    this.cognome=cognome;
    this.toHTMLout = function (type){
        //crea il tag dello studente nella stampa dei gruppi
        var p = document.createElement("p");
        p.innerHTML = this.nome + " " + this.cognome;
        if (type) p.onclick = () => CambiaPosizione(this);
        return p;
    }
    this.toHTMLinizio = function (){
        //crea il tag dell'elenco iniziale
        var div = document.createElement("div");

        var input = document.createElement("input");
        input.type= "number";
        input.className= "rimuovi";

        var p = document.createElement("p");
        p.innerHTML = this.nome + " " + this.cognome;
        
        div.appendChild(input);
        div.appendChild(p);
        return div;
    }
    this.valorePredefinito = function (Classe){
        //legge il valore che gli do nell'elenco iniziale 
        var daRimuovere= document.getElementsByClassName("rimuovi");
        for (var i=0;i<Classe.length;i++){
            if (Classe[i]==this) {
                var valore=document.getElementsByClassName("rimuovi")[i].value;
                if (valore=="") valore=0;
                return parseInt(valore);
            }
        }
        return 0;
    }
}

//creo la classe classe
var quarta_asa = [
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
    new studente('Gabriele', 'Pennati'),
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
    new studente('Alice', 'Volonté')
].sort(ordineAlfabeticoCognome);

//variabili globali che servono nella funzione CambiaPosizione()
var click1=false;
var IndiceStudente1=[];
var IndiceStudente2=[];
var gruppi=[];

//previene che premendo invio si ricarichi la pagina, ma anzi, fa come se si cliccasse sul bottone
var form = document.getElementsByTagName("form")[0];
form.onsubmit = (event) => { event.preventDefault() }

//cosa succede quando clicco sui bottoni
document.getElementsByClassName("button0")[0].onclick = () => generaGruppi(quarta_asa,0,true);
document.getElementsByClassName("button0")[1].onclick = () => generaGruppi(quarta_asa,1,true);

//metto come valore predefinito al numero di gruppi 1
document.getElementsByTagName("input")[0].valueAsNumber = 1; 

//stampo l'elenco iniziale
stampaInizio(quarta_asa);