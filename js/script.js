// Milestone 1:
// Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere completamente o parzialmente il nome di un film. Possiamo, cliccando il bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.
// Vogliamo dopo con la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato:
// 1. Titolo
// 2. Titolo Originale
// 3. Lingua
// 4. Voto

$(document).ready(function () {
    $('#search-input').focus();
    // Al click del tasto 'search' invoco la funzione 'searchMovies'
    $('#search-btn').click(searchMovies);

    // Premendo 'invio' invoco la funzione 'searchMovies'
    $('#search-input').keydown(function () {
        if (event.which == 13) {
            searchMovies();
            $(this).blur();
        }
    });
});

// *** FUNCTIONS *** //
// Ricerca dei film e stampa sul DOM dei risultati
function searchMovies() {
    // Memorizzazione del valore dell'input
    var userQuery = $('#search-input').val();
    if (userQuery.trim()) {
        // Reset del campo di input
        $('#search-input').val('');
        // Svuoto il contenitore dei risultati prima di ogni nuova ricerca
        $('#results').empty();

        // Chiamata AJAX per effettuare la ricerca e stampare sul DOM i risultati con HB
        $.ajax({
            url: 'https://api.themoviedb.org/3/search/movie',
            method: 'GET',
            data: {
                api_key: '5735ba8aa714f2161c6a9f7f267223ef',
                query: userQuery,
                language: 'it-IT'
            },
            success: function (obj) {
                var source = $('#movie-template').html();
                var template = Handlebars.compile(source);

                if (obj.total_results > 0) {
                    for (var i = 0; i < obj.total_results; i++) {
                        var thisMovie = obj.results[i];

                        var sample = {
                            title: thisMovie.title,
                            original_title: thisMovie.original_title,
                            language: thisMovie.original_language,
                            vote: thisMovie.vote_average
                        };

                        var html = template(sample);
                        $('#results').append(html);
                    }
                } else {
                    $('#results').append('Non ci sono risultati');
                }
            },
            error: function () {
                alert('Errore');
            }
        });
    } else {
        $('#search-input').val('');
    }
}
