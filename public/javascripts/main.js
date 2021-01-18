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
            var notification = alertify.notify('Downloading Torrent', 'success', 5, function(){  console.log('dismissed'); });
            });
    })

    $('.delete').click(function(e){
        e.preventDefault
        var magnet_hash = $(this).parent().attr("data-hash");
        $.ajax({
            method: "get",
            url: "/delete",
            data:{
                hash: magnet_hash
            }
        })
        .done(function(msg) {
            alert("Deleted Torrent: " + msg);
        });
    })

$('.torrentView').click(function(e){
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

		//
		//	1.	Set the base URL
		//
		var api = "/viewTorrents";

		//
		//	2.	Check every second if there is a new Magnet file in the client
		//
		client_magnet_list();

		//
		//	3.	Get every second the stats of the client, not individual
		//		torrent.
		//
		check_for_client_stats();

		//
		//	4.	Check every second of there is some errors from the client
		//
		check_for_client_errors();

		//	                  _____   _   _          _
		//	                 / ____| | | (_)        | |
		//	  ___    _ __   | |      | |  _    ___  | | __
		//	 / _ \  | '_ \  | |      | | | |  / __| | |/ /
		//	| (_) | | | | | | |____  | | | | | (__  |   <
		//	 \___/  |_| |_|  \_____| |_| |_|  \___| |_|\_\
		//

		//
		//	React each time an element from the example magnet list is clicked.
		//
		$('#demo_magnets').on('click', '.magnet', function() {

			//
			//	1.	Get the Magnet Hash from the LI element that was clicked.
			//
			var magnet = $(this).text();

			//
			//	2.	Remove the place holder of the input tag. If we don't do
			//		this the interface will look like poop.
			//
			$("input").removeAttr('placeholder');

			//
			//	3.	Set the Magnet Hash in the input tag.
			//
			$("input").val(magnet)

			//
			//	4.	Once we select a Magnet Hash we immediately load the
			//		content of the magnet so we can select which file do we
			//		want to play.
			//
			load();

		});

		//
		//	Load the content of the Magnet Hash
		//
		$('#load').click(function() {

			//
			//	1.	Load the content
			//
			load();

		});

		//
		//	React each time a file name is clicked from the Magnet Contents UL
		//
		$('#content').on('click', '.file', function() {

			//
			//	1.	Get the Magnet Hash
			//
			var magnet = $('input').val();

			//
			//	2.	Get the file name that was clicked
			//
			var file_name = $(this).attr("data-name");

			//
			//	3.	Set the proper SRC of the video player
			//
			$('video').attr('src', api + '/stream/' + magnet + "/" + file_name);

		});

		//
		//	React to a delete action so we can remove Magnets from the client.
		//	Not that we need this in such basic example, but I did it because
		//	why not :).
		//
		$('#magnets').on('click', '.delete', function() {

			//
			//	1.	Get the Magnet hash.
			//
			var magnet_hash = $(this).parent().attr("data-hash");

			//
			//	2.	Make the right call to the API to remove the Magnet from
			//		the client.
			//
			$.get(api + "/delete/" + magnet_hash, function(data) {

			});

		});

		//	 _    _          _
		//	| |  | |        | |
		//	| |__| |   ___  | |  _ __     ___   _ __   ___
		//	|  __  |  / _ \ | | | '_ \   / _ \ | '__| / __|
		//	| |  | | |  __/ | | | |_) | |  __/ | |    \__ \
		//	|_|  |_|  \___| |_| | .__/   \___| |_|    |___/
		//	                    | |
		//	                    |_|

		//
		//	Load the content of a Magnet so we can see what files are inside
		//	a Magnet.
		//
		function load()
		{
			//
			//	1.	Disable to loading button
			//
			$('#load').prop('disabled', true);

			//
			//	2.	Clear the UL Magnet Contents before appending new data
			//
			$("#content").empty();

			//
			//	3.	Let the user know what to expect
			//
			$("#content").append('<li>Loading...</li>');

			//
			//	4.	Get Magnet hash from the input field
			//
			var magnet = $('input').val();

			//
			//	5.	React only if there is a Magnet Has
			//
			if(!magnet)
			{
				return console.error("No Magnet Hash");
			}

			//
			//	6.	Make a request to the API to load the contents of a Magnet
			//		Hash
			//
			$.get(api + '/add/' + magnet, function(data) {

				//
				//	1.	Remove the loading message.
				//
				$("#content").empty();

				//
				//	2.	Loop over the server response and list all the file
				//		inside the Magnet Hash.
				//
				$.each(data, function(index, obj) {

					$("#content").append('<li class="file url" data-name="' + obj.name + '"><span class="url">'+ obj.name + '</span> (' + format_bytes(obj.length, 0) + ') <a href="' + api + '/stream/' + magnet + "/" + obj.name + '">SRC</a></li>');
				})

				//
				//	3.	Re-enable the loading button so the user can maybe past
				//		their own Magnet Hash.
				//
				$('#load').prop('disabled', false);

			});

		}

		//
		// 	Get a list of Magnet Hashes that a client has. This method will be
		// 	executed in a loop every n amount of time to make sure the data
		// 	is nice and fresh.
		//
		function client_magnet_list()
		{
			//
			//	1.	Set a timeout that will be executed after n amount of time
			//
			setTimeout(function() {

				//
				//	1.	Make a API request to get the contents of the Client
				//
				$.get(api + '/list', function(data) {

					//
					//	1.	Clear the content of the UL
					//
					$("#magnets").empty();

					//
					//	2.	We populate the UL only if we get data from the
					//		server
					//
					if(data.length > 0)
					{
						//
						//	1.	Loop over the array to list all the Magnet
						//		Hashes.
						//
						$.each(data, function(index, obj) {

							$("#magnets").append('<li data-hash="' + obj.hash + '"><span class="magnet">' + obj.hash + '</span> [<span class="delete url">Delete</span>]</li>');

						});
					}
					else
					{
						//
						//	1.	Display Not Available if no data is present
						//
						$("#magnets").append('<li>N/A</li>');
					}

					//
					//	3.	Restart the timer so we keep on checking if there
					//		are new Magnet Hashes
					//
					client_magnet_list();

				});

			}, 5000)
		}

		//
		//	Make API request every n amount of time to get the status of the
		//	client so we can get a sense if the data is being downloaded or
		//	not.
		//
		function check_for_client_stats()
		{
			//
			//	1.	Set a timeout that will be executed after n amount of time
			//
			setTimeout(function() {

				//
				//	1.	Make a request to the API for fresh data.
				//
				$.get(api + '/stats', function(obj) {
                    if(obj.length > 0 && (window.location.pathname == "/viewTorrents")){
                        obj.forEach(torrent => {
                                var tor =  $(`*[data-hash="${torrent.hash}"]`)[0];
                            $(tor).find('#downloadSpeed')[0].textContent = format_bytes(torrent.data.downloadSpeed)
                            $(tor).find('#timeRemaining')[0].textContent = millisToMinutesAndSeconds(torrent.data.timeRemaining)
                            $(tor).find('#progress')[0].textContent = torrent.data.progress
                            $(tor).find('#progressBar').css('width', torrent.data.progress)
                        });
                    } 

		

				});

				//
				//	2.	Restart the timer so we keep on checking the status of
				//		the client.
				//
				check_for_client_stats();

			}, 5000);
		}

		//
		//	Make API request every n amount of time to see if the client has
		//	some errors worth showing.
		//
		function check_for_client_errors()
		{
			//
			//	1.	Set a timeout that will be executed after N amount of time
			//
			setTimeout(function() {

				//
				//	1.	Make a request to the server for the data
				//
				$.get(api + '/errors', function(message) {

					//
					//	1.	Display the error only if there is anything to show
					//
					if(message)
					{
						//
						//	1.	Clear the content of the UL
						//
						$("#errors").empty();1

						//
						//	2.	Display the error
						//
						$("#errors").append('<li class="error">' + message + '</li>');

					}

					//
					//	2.	Restart the timer so we can update the error
					//		message if there is anything new
					//
					check_for_client_errors();

				});

			}, 5000);
		}

	});

	//
	//	Convert bytes to a human readable form
	//
	function format_bytes(bytes, decimals)
	{
		//
		//	If the size is 0, then we can stop right away.
		//
		if(bytes == 0)
		{
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
