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
    // Autofocus input al caricamento della pagina
    $('#search-input').focus();
    // Al click del tasto 'search' invoco la funzione 'searchMovies'
    $('#search-btn').click(movies);

    // Premendo 'invio' invoco la funzione 'searchMovies'
    $('#search-input').keydown(function () {
        if (event.which == 13 || event.keyCode == 13) {
            movies();
        }
    });
});

// *** FUNCTIONS *** //
// Ricerca dei film e stampa sul DOM dei risultati con la function 'printMovies'
function movies() {
    // Memorizzazione del valore dell'input
    var userQuery = $('#search-input').val();
    if (userQuery.trim()) {
        // Reset del campo di input
        $('#search-input').val('');
        // Svuoto il contenitore dei risultati prima di ogni nuova ricerca e ripristino il focus all'input
        $('#results').empty();
        $('#search-input').focus();

        // Chiamata AJAX per effettuare la ricerca e stampare sul DOM i risultati con HB
        $.ajax({
            url: 'https://api.themoviedb.org/3/search/movie',
            method: 'GET',
            data: {
                api_key: '5735ba8aa714f2161c6a9f7f267223ef',
                language: 'it-IT',
                query: userQuery
            },
            success: function (obj) {
                if (obj.total_results > 0) {
                    printMovies(obj)
                } else {
                    $('#results').append('Non ci sono risultati');
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

// Stampa dei risultati (movies)
function printMovies(obj) {
    var source = $('#movie-template').html();
    var template = Handlebars.compile(source);

    for (var i = 0; i < obj.total_results; i++) {
        var thisResult = obj.results[i];

        var sample = {
            'title': thisResult.title,
            'original_title': thisResult.original_title,
            'language': thisResult.original_language.toUpperCase(),
            'vote': [thisResult.vote_average, stars(thisResult.vote_average)]
        };

        var html = template(sample);
        $('#results').append(html);
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
    // var vote = Math.round(num / 2);
    // for (var i = 1; i <= 5; i++) {
    //     if (i <= vote) {
    //         star += '<i class="fas fa-star"></i>';
    //     } else {
    //         star += '<i class="far fa-star"></i>';
    //     }
    // }
    // return star;
}

// Modificando la function: printMovies(obj, type)

// Flags al posto di language, con this.original_language come argomento
// function flags(str) {
    // 1. implementare solo 2 lingue: 'it' 'en'
    // 2. per ciascuna di queste due visualizzare l'immagine opportuna e ritornarla
    // 3. altrimenti ritornare 'it' o 'en'
// }