ordineAlfabeticoCognome= function (a,b){
    //ordina in ordine alfabetico in base al cognome dell'oggetto
    if (a.cognome < b.cognome) return -1; 
    if (a.cognome > b.cognome) return 1;
    return 0;
}

numeroIntValido = function(num){
    //controllo che il numero sia valido, considerando pure gli studenti rimossi
    x=0;
    for (e of classe) if (e.valorePredefinito()===-1) x++;
    if (num>0&&num<=(classe.length-x)) return num;
    return 0;
}

CambiaPosizione= function(studente){
    //se ho già cliccato, scambio
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

    //se non ho già cliccato, evidenzio il primo
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
    //controllo che non ci siano troppi studenti nella stessa classe pre-inseriti
    length=elencoDinamico.length;

    //rimuove gli studenti da ElencoDinamico
    for (i=0;i<elencoDinamico.length;i++){
        g=elencoDinamico[i].valorePredefinito();
        if (g<0) length--;
    }

    scarto=length%numeroInt;
    NumStudenti=parseInt(length/numeroInt);
    gruppi=[];

    //genera i gruppi vuoti
    for (i=0;i<numeroInt;i++){
        if (i<scarto) numeroStudenti=NumStudenti+1;
        else numeroStudenti=NumStudenti;
        gruppo=[];
        gruppo.length=numeroStudenti;
        gruppi.push(gruppo);
    }
    
    //aggiunge gli studenti ai determinati gruppi
    for (i=0;i<elencoDinamico.length;i++){
        g=elencoDinamico[i].valorePredefinito();
        if (g>0&&g-1<gruppi.length){
            for (j=0;j<gruppi[g-1].length;j++){
                if (gruppi[g-1][j]===undefined) {
                gruppi[g-1][j]=elencoDinamico[i];
                break;
                }
            }
        }
    }

    //rimuove gli studenti da non inserire a caso
    t=0
    elencoSupporto=Object.assign([], elencoDinamico);
    for (x=0;x<elencoSupporto.length;x++){
        g=elencoSupporto[x].valorePredefinito();
        if (g!=0){
            elencoDinamico.splice(t,1);
            t--;
        }
        t++;
    }

    //riempio i gruppi
    for (i=0;i<gruppi.length;i++){
        for (j=0;j<gruppi[i].length;j++){
            if (gruppi[i][j]===undefined){
                StudenteIndice=Math.floor(Math.random() * elencoDinamico.length);
                gruppi[i][j]=elencoDinamico.splice(StudenteIndice,1)[0];
            }
        }
        gruppi[i].sort(ordineAlfabeticoCognome);
    }

    //ritorno l'array coi gruppi
    return gruppi;
}

stampaGruppi= function(gruppi){
    //elimino il contenuto di form
    form=document.getElementsByTagName("form")[0];
    form.innerHTML=``;

    //creo section
    section=document.getElementById("out");
    section.innerHTML=`
    <h2>I gruppi sono:</h2>
    <ol id="outgruppo"></ol>
    `;
    out=document.getElementById("outgruppo");
    for (i=0;i<gruppi.length;i++){
        li=document.createElement("li");
        h3=document.createElement("h3")
        h3.innerHTML="Gruppo "+(i+1)+ ":";
        li.appendChild(h3);
        for (e of gruppi[i]) li.appendChild(e.toHTMLout());
        out.appendChild(li);
    }

    //creo il bottone nel footer
    buttonReset=document.createElement("button");
    buttonReset.innerHTML= "Estrai nuovamente";
    buttonReset.onclick = () => window.location.reload();
    footer= document.getElementsByTagName("footer")[0];
    footer.innerHTML=``;
    footer.appendChild(buttonReset);
    
}

stampaInizio= function(){
    //stampa l'elenco di studenti da cui selezionare i gruppi predefiniti
    out=document.getElementById("inizio");
    for (e of classe) out.appendChild(e.toHTMLinizio());
}

controllaGruppi = function (gruppi){
    //verifica che i gruppi siano del tutto riempiti, quindi che l'ultimo elemento dell'ultimo gruppo non sia undefined
    if (gruppi[gruppi.length-1][gruppi[gruppi.length-1].length-1]===undefined) return false;
    return true;
}

generaGruppi = function(){
    //quello che succede a cliccare il bottone
    numeroInt= numeroIntValido(parseInt(document.getElementsByTagName("input")[0].value));
    if (!numeroInt) alert("Numero di gruppi non valido.");
    else{
        elencoDinamico=Object.assign([], classe);
        gruppi=creaGruppi(elencoDinamico,numeroInt);
        if (controllaGruppi(gruppi)) stampaGruppi(gruppi);
        else alert("Troppe persone in un gruppo o gruppo non esistente");
    }
}

//definisco l'oggetto studente
function studente (nome,cognome){
    this.nome=nome;
    this.cognome=cognome;
    this.toHTMLout = function (){
        //crea il tag dello studente nella stampa dei gruppi
        p = document.createElement("p");
        p.innerHTML = this.nome + " " + this.cognome;
        p.onclick = () => CambiaPosizione(this);
        return p;
    }
    this.toHTMLinizio = function (){
        //crea il tag dell'elenco iniziale
        div = document.createElement("div");

        input = document.createElement("input");
        input.type= "number";
        input.className= "rimuovi";

        p = document.createElement("p");
        p.innerHTML = this.nome + " " + this.cognome;
        
        div.appendChild(input);
        div.appendChild(p);
        return div;
    }
    this.valorePredefinito = function (){
        //legge il valore che gli do nell'elenco iniziale
        daRimuovere= document.getElementsByClassName("rimuovi");
        for (i=0;i<classe.length;i++){
            if (classe[i]==this) {
                valore=document.getElementsByClassName("rimuovi")[i].value;
                if (valore=="") valore=0;
                return parseInt(valore);
            }
        }
        return 0;
    }
}


//creo la classe classe
var classe = [
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
classe.sort(ordineAlfabeticoCognome);

//stampo l'elenco iniziale
stampaInizio();

//previene che premendo invio si ricarichi la pagina, ma anzi, fa come se si cliccasse sul bottone
var form = document.getElementsByTagName("form")[0];
form.onsubmit = (event) => { event.preventDefault() }

//variabili globali che servono nella funzione CambiaPosizione()
click1=false;
IndiceStudente1=[];
IndiceStudente2=[];