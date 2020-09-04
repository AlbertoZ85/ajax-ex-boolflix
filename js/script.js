// Milestone 1:
// Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere completamente o parzialmente il nome di un film. Possiamo, cliccando il bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.
// Vogliamo dopo con la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato:
// 1. Titolo
// 2. Titolo Originale
// 3. Lingua
// 4. Voto

// Milestone 2:
// Trasformiamo il voto da 1 a 10 decimale in un numero intero da 1 a 5, così da permetterci di stampare a schermo un numero di stelle piene che vanno da 1 a 5, lasciando le restanti vuote (troviamo le icone in FontAwesome).
// Arrotondiamo sempre per eccesso all’unità successiva, non gestiamo icone mezze piene (o mezze vuote :P)
// Trasformiamo poi la stringa statica della lingua in una vera e propria bandiera della nazione corrispondente, gestendo il caso in cui non abbiamo la bandiera della nazione ritornata dall’API (le flag non ci sono in FontAwesome).
// Allarghiamo poi la ricerca anche alle serie tv. Con la stessa azione di ricerca dovremo prendere sia i film che corrispondono alla query, sia le serie tv, stando attenti ad avere alla fine dei valori simili (le serie e i film hanno campi nel JSON di risposta diversi, simili ma non sempre identici)
// Qui un esempio di chiamata per le serie tv:
// https://api.themoviedb.org/3/search/tv?api_key=e99307154c6dfb0b4750f6603256716d&language=it_IT&query=scrubs

$(document).ready(function () {
    $('#search-input').focus();
    // Al click del tasto 'search' invoco la funzione 'init'
    $('#search-btn').click(init);
    // Premendo 'invio' invoco la funzione 'init'
    $('#search-input').keydown(function () {
        if (event.which == 13 || event.keyCode == 13) {
            init();
        }
    });
});

// *** FUNCTIONS *** //
// Inizializzazione di ricerca e stampa dei risultati
function init() {
    // Memorizzazione del valore dell'input
    var userQuery = $('#search-input').val();
    // Reset del campo di input
    $('#search-input').val('');
    // Svuoto i contenitori dei risultati prima di ogni nuova ricerca
    $('[id$="covers"]').empty();
    $('#search-input').focus();
    // Invoco le funzioni che effettuano ricerca e stampa del titolo richiesto nelle varie categorie
    query(userQuery, 'movie');
    query(userQuery, 'tv');
}

// Ricerca dei film e stampa sul DOM dei risultati con la function 'listPrint'
function query(input, type) {
    if (input.trim()) {
        // Chiamata AJAX per effettuare la ricerca e stampare sul DOM i risultati con HB
        $.ajax({
            url: `https://api.themoviedb.org/3/search/${type}`,
            method: 'GET',
            data: {
                api_key: '5735ba8aa714f2161c6a9f7f267223ef',
                language: 'it-IT',
                query: input
            },
            success: function (obj) {
                if (obj.total_results > 0) {
                    listPrint(obj, type)
                } else {
                    $(`#${type}-covers`).append('Non ci sono risultati');
                }
            },
            error: function () {
                alert('Errore');
            }
        });
    } else {
        $('#search-input').val('').focus();
    }
}

// Stampa dei risultati in base al tipo (movie, tv...)
function listPrint(obj, type) {
    var source = $('#item-template').html();
    var template = Handlebars.compile(source);

    for (var i = 0; i < obj.total_results; i++) {
        var thisResult = obj.results[i];

        var sample = {
            'title': thisResult.title || thisResult.name,
            'original_title': thisResult.original_title || thisResult.original_name,
            'flags': flags(thisResult.original_language),
            'language': thisResult.original_language.toUpperCase(),
            'vote': [thisResult.vote_average, stars(thisResult.vote_average)],
            'type': type == 'movie' ? 'Film' : 'Serie TV'
        };

        var html = template(sample);
        $(`#${type}-heading`).show();
        $(`#${type}-covers`).append(html);
    }
}

// Calcolo del voto e conversione in stelle
function stars(num) {
    var blankStar = '<i class="far fa-star"></i>';
    var voteStar = '<i class="fas fa-star"></i>';
    var stars = Math.round(num / 2);

    // Metodo repeat() ritorna una nuova stringa con un numero specificato di copie
    return voteStar.repeat(stars) + blankStar.repeat(5 - stars);

    // Oppure con un ciclo for
    // var star = '';
    // var resto = num % 2;
    // var vote = Math.floor(num / 2);
    // for (var i = 1; i <= 5; i++) {
    //     if (i <= vote) {
    //         star += '<i class="fas fa-star"></i>';
    //     } else if (resto != 0) {
    //         star += '<i class="fas fa-star-half-alt"></i>';
    //         resto = 0;
    //     } else {
    //       star += '<i class="far fa-star"></i>';
    //     }
    // return star;
}

// Gestione della visualizzazione della lingua tramite bandiere (se disponibili)
function flags(str) {
    switch (str) {
        case 'it':
            return ['it'];
        case 'de':
            return ['de'];
        case 'ja':
            return ['ja'];
        case 'en':
            return ['uk', 'us'];
        case 'fr':
            return ['fr', 'ca'];
        case 'es':
            return ['es', 'ar'];
        case 'pt':
            return ['pt', 'br'];
        default:
            return str;
    }
}

// Controllo sul typeof di 'language' per i blocchi if-else di HB
Handlebars.registerHelper('isNotString', function (value) {
    return typeof (value) != 'string';
});
