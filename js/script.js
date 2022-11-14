

$(function () {

	$('.search-btn').click(function (event) {
		var myInput = $('.input-field').val();
		getCharacters(myInput);
	});

	$(document).keydown(function (event) {
		var myInput = $('.search').val();
		if (event.which == 13) {
			event.preventDefault();
			getCharacters(myInput);
		}
	});

	$.ajax({
		url: 'js/characterList.json',
		datatype: 'json',
		success: function (data) {
			var character_data = data.characterList;
			$('.input-field').autocomplete({
				source: character_data
			});
		}
	});

	function getCharacters (inputName) {
		const characterAPI = 'http://gateway.marvel.com/v1/public/characters?ts=1&apikey=1cbdbf48f22a2bf0641e4ea1bc28b03c&hash=861b80eee80b192d1ee3641f0f93c55a';
		$.getJSON(characterAPI, {
			//apikey: '861b80eee80b192d1ee3641f0f93c55a',
			name: inputName
		})
		.done(function (data) {
			try {
				var image = data.data.results[0].thumbnail;
				var characterName = data.data.results[0].name;
				var characterID = data.data.results[0].id;
				//console.log(data);
				$('.error').hide();
				$('.character-image').show();
				$('.character-profile').attr("src", image.path + "." + image.extension);
				$('.character-name').text(characterName);
				getComics(characterID, characterName);
			}
			catch (e) {
				$('.comic').hide();
				$('.character-image').hide();
				$('.comic-container').hide();
				$('.error').show();
				console.log("No such character.");
			}
		});
	}

	function getComics (characterID, characterName) {
		var characterId = characterID;
		var comicsAPI = 'https://gateway.marvel.com/v1/public/characters/' + characterId + '/comics?ts=1&apikey=1cbdbf48f22a2bf0641e4ea1bc28b03c&hash=861b80eee80b192d1ee3641f0f93c55a';
		$.getJSON(comicsAPI, {			
			//apikey: '861b80eee80b192d1ee3641f0f93c55a'
		})
		.done(function (data) {
			var characterNAME = characterName;
			var comics = data.data.results.length;
			//console.log(data);
			$('.comic-copy').show();
			$('.comic-container').show();
			$('.comic-description').text("Here are the most recent comic book titles " + characterNAME + " appears in.");
			$('.comic-container').empty();
			for (var i=0; i < comics; i++) {
				var image = data.data.results[i].thumbnail;
				var comicTitle = data.data.results[i].title;
				$('.comic-container').append("<div class='comic'><img src='" + image.path + "." + image.extension + "' alt='Comic Image' height='324px' width='216px'><p>" + comicTitle + "</p></div>");
			}
		});
	}
});