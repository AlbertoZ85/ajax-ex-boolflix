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
                    $(`#${type}-covers`).css('display', 'block').append(`Non ci sono risultati nella categoria "${type}"`);
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
            'type': type == 'movie' ? 'Film' : 'Serie TV',
            'poster': poster(thisResult.poster_path),
            'overview': thisResult.overview.substring(0, 200) + '[...]'
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

// Gestione della visualizzazione del poster (se presente)
function poster(data) {
    var noPosterImg = 'https://i1.wp.com/cinemaome.com/wp-content/uploads/2015/10/cinema-pellicola-film3.jpg?fit=810%2C506';
    var urlRoot = 'https://image.tmdb.org/t/p/w342';
    return data == null ? noPosterImg : urlRoot + data;
}