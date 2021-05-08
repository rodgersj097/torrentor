jQuery(document).ready(function() {
    jQuery('.torrentSubmit').click(function(e) {
        e.preventDefault()
        var magnetLink = jQuery('.magnet')[0].value;
        jQuery.ajax({
                method: "get",
                url: "/getTorrents",
                data: { magnetLink: magnetLink }
            })
            .done(function(msg) {
                var notification = alertify.notify(msg.msg, msg.status, 10, function() { console.log('dismissed'); });
            });
    })

    jQuery('.delete').click(function(e) {
        e.preventDefault
        var magnet_hash = jQuery(this).parent().attr("data-hash");
        jQuery.ajax({
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

    jQuery('.torrentView').click(function(e) {
            e.preventDefault
            jQuery.ajax({
                    method: "get",
                    url: "/list",
                })
                .done(function(msg) {
                    alert("Torrent: " + msg);
                });
        })
        /*jQuery('#signUp').click(function() {
            var email = jQuery('#email').val()
            var username = jQuery('#username').val()
            var pass = jQuery('#pass').val()
            jQuery.ajax({
                    method: "POST",
                    url: "/users/",
                    dataType: 'json',
                    data: {
                        email: email,
                        username: username,
                        pass: pass
                    }
                })
                .done(function(msg) {
                    if (msg.msg) {
                        var notification = alertify.notify(msg.msg, 'error', 10, function() { console.log('dismissed'); });

                    } else {
                        window.location.href = msg.route
                    }

                })
        })*/



    jQuery('#signIn').click(function() {
        var username = jQuery('#username').val()
        var pass = jQuery('#pass').val()
        jQuery.ajax({
                method: "POST",
                url: "/users/signin",
                dataType: 'json',
                data: {
                    username: username,
                    password: pass
                }
            })
            .done(function(msg) {
                window.location.href = msg.route

            })
    })
    var socket = io();
    $('.torrentSearch').click(function() {
        searchTorrent()
        $('.torrentTable').LoadingOverlay("show")
    })
    $('#searchForm').submit(function(e) {
        e.preventDefault()
        console.log(e)
        if (e.keyCode == 13) {
            searchTorrent();
            $('.torrentTable').LoadingOverlay("show");
        }
    })
})


function searchTorrent() {
    var socket = io();
    var term = $('.searchTerm').val();
    socket.emit('searchTorrent', term, (response) => {
        $('#torrentList').empty()
        response.data.forEach(o => {
            $('.torrentTable').LoadingOverlay("hide");
            $('#torrentList').append(o)
        });
        var downloadButtons = document.querySelectorAll('.download');
        downloadButtons.forEach((button) => {
            button.addEventListener('click', function() {
                var magnetLink = button.dataset.magnet;
                jQuery.ajax({
                        method: "get",
                        url: "/getTorrents",
                        data: { magnetLink: magnetLink }
                    })
                    .done(function(msg) {
                        var notification = alertify.notify(msg.msg, msg.status, 10, function() { console.log('dismissed'); });
                    });
            })
        });
    })
}

jQuery(function() {
    var socket = io();

    check_for_client_stats();
    check_for_client_errors();

    function check_for_client_stats() {

        setTimeout(function() {

            socket.emit('getStats', (response) => {

                if (response.obj.length > 0 && (window.location.pathname == "/viewTorrents")) {
                    response.obj.forEach(torrent => {
                        var tor = jQuery(`*[data-hash="${torrent.hash}"]`)[0];
                        jQuery(tor).find('#downloadSpeed')[0].textContent = format_bytes(torrent.data.downloadSpeed)
                        jQuery(tor).find('#timeRemaining')[0].textContent = millisToMinutesAndSeconds(torrent.data.timeRemaining)
                        jQuery(tor).find('#seedsConnected')[0].textContent = torrent.data.maxPeers
                        jQuery(tor).find('#progress')[0].textContent = torrent.data.progress
                        jQuery(tor).find('#progressBar').css('width', torrent.data.progress)
                        console.log(torrent.data)
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

                    jQuery("#errors").empty();

                    jQuery("#errors").append('<li class="error">' + message + '</li>');

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
    if (minutes > 60) {
        var mh = minutesToHoursMinutes(minutes)
    }
    return (mh !== undefined) ? mh : (minutes + "min : " + (seconds < 10 ? '0' : '') + seconds + 'secs');
}

function minutesToHoursMinutes(min) {
    var num = min
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return rhours + " hour(s) and " + rminutes + " minute(s).";
}