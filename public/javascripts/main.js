$(document).ready(function() {
    $('.torrentSubmit').click(function(e) {
        e.preventDefault()
        var magnetLink = $('.magnet')[0].value;
        $.ajax({
                method: "get",
                url: "/getTorrents",
                data: { magnetLink: magnetLink }
            })
            .done(function(msg) {
                var notification = alertify.notify('Downloading Torrent', 'success', 5, function() { console.log('dismissed'); });
            });
    })

    $('.delete').click(function(e) {
        e.preventDefault
        var magnet_hash = $(this).parent().attr("data-hash");
        $.ajax({
                method: "get",
                url: "/delete",
                data: {
                    hash: magnet_hash
                }
            })
            .done(function(msg) {
                alert("Deleted Torrent: " + msg);
            });
    })

    $('.torrentView').click(function(e) {
        e.preventDefault
        $.ajax({
                method: "get",
                url: "/list",
            })
            .done(function(msg) {
                alert("Torrent: " + msg);
            });
    })

    

})
$(function() {
    var socket = io();

    check_for_client_stats();
    check_for_client_errors();

    function check_for_client_stats() {

        setTimeout(function() {

            socket.emit('getStats', (response) => {

                if (response.obj.length > 0 && (window.location.pathname == "/viewTorrents")) {
                    response.obj.forEach(torrent => {
                        var tor = $(`*[data-hash="${torrent.hash}"]`)[0];
                        $(tor).find('#downloadSpeed')[0].textContent = format_bytes(torrent.data.downloadSpeed)
                        $(tor).find('#timeRemaining')[0].textContent = millisToMinutesAndSeconds(torrent.data.timeRemaining)
                        $(tor).find('#progress')[0].textContent = torrent.data.progress
                        $(tor).find('#progressBar').css('width', torrent.data.progress)
                    });
                }
            });
            check_for_client_stats();

        }, 1000);
    }

    function check_for_client_errors() {

        setTimeout(function() {


            socket.emit('error', (response) => {


                if (response.message) {

                    $("#errors").empty();
                    1
                    $("#errors").append('<li class="error">' + message + '</li>');

                }


                check_for_client_errors();

            });

        }, 1000);
    }

});

//
//	Convert bytes to a human readable form
//
function format_bytes(bytes, decimals) {
    //
    //	If the size is 0, then we can stop right away.
    //
    if (bytes == 0) {
        return '0 Byte';
    }

    //
    //	Convert bytes to kilobytes
    //
    var k = 1024;

    //
    //	Set how many position after decimal to show
    //
    var dm = decimals + 1 || 3;

    //
    //	Array with all the possible formats.
    //
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    //
    //
    //
    var i = Math.floor(Math.log(bytes) / Math.log(k));

    //
    //
    //
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}