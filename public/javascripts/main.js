$(document).ready(function() {
    $('.torrentSubmit').click(function(e) {
        e.preventDefault()
        var magnetLink = $('.magnet')[0].value;
        $.ajax({
                method: "POST",
                url: "/getTorrents",
                data: { magnetLink: magnetLink }
            })
            .done(function(msg) {
                alert("Downloading Torrent: " + msg);
            });
    })
})