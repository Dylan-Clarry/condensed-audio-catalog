let buildMovieCard = content => {
	console.log(content);
	let card = `
		<div class="grid-card">
			<div class="photo">
				<img src="./assets/imgs/${content.img}" alt="${content.img}">
			</div><!-- /photo -->

			<div class="movie-info">
				<h3>${content.name}</h3>
				<p>Episodes: ${content.episodes}</p>
				<p>Audio Language: ${content.language}</p>
				<p>Download <a href="${content.link}" target="_blank">here</a></p>
			</div><!-- /movie-info -->
		</div><!-- /grid-card -->
	`;
	return card;
}

function chooseRandomImage(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

function chooseDifferentRandomImage(name, arr) {
	let index = Math.floor(Math.random() * arr.length)
	let val = arr[index];
	let valCheck = "img" + val.split('img')[1].split(/(\d+)/)[1];
	let nameCheck = "img" + name.split('img')[2].split(/(\d+)/)[1];

	if(nameCheck !== valCheck) {
		return val;
	} else if(arr[index + 1]) {
		return arr[index + 1];
	} else {
		return arr[index - 1];
	}
}

function searchCatalogByName(name, catalog) {
	for(let i = 0; i < catalog.length; i++) {
		let catalogName = catalog[i].name;
		if(name === catalogName) {
			return catalog[i];
		}
	}
	return -1;
}

function changeImages(arr, catalog) {
	for(let i = 0; i < arr.length; i++) {
		let card = arr[i];
		let catalogItem = searchCatalogByName(card.id, catalog);

		// if number of images for given show is only 1 don't change
		if(catalogItem.imgs.length > 1) {
			let cardImg = card.getElementsByTagName('img')[0];
			let currImg = cardImg.src;
			let newImg = chooseDifferentRandomImage(currImg, catalogItem.imgs);
			
			let fadeTime = 750; // change aswell in main.css .switch-img
			cardImg.classList.add('switch-img-out');
			setTimeout(function() {
				cardImg.classList.remove('switch-img-out');
			}, fadeTime);

			//cardImg.src = "./assets/imgs/" + newImg;
			cardImg.src = `${catalogItem.imgfolder}/${newImg}`;
			cardImg.classList.add('switch-img-in');
			setTimeout(function() {
				cardImg.classList.remove('switch-img-in');
			}, fadeTime);
		}
	}
}

function shuffleArr(arr) {
	for(let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * i);
		const temp = arr[i];
		arr[i] = arr[j];
		arr[j] = temp;
	}
	return arr;
}

function chooseNRandom(arr, n) {
	let shuffled = shuffleArr(arr);
	let doubleShuffle = shuffleArr(shuffled)
	let randomArr = doubleShuffle.slice(0, n);
	return randomArr;
}

function buildModal(showObj) {
	let modal = document.getElementById('modal');
	let modalContent = `
			<button class="modal-close-btn" id="close-btn"><i class="fa fa-times" title="关"></i></button>
			<div class="backdrop-img">
				<img src="${showObj.imgfolder}/backdrop.webp" alt="./assets/backdrops/default.jpg" onerror="this.onerror=null;this.src='./assets/imgs/default-backdrop.webp';">
			</div><!-- /photo -->

			<h1 class="modal-header">${showObj.name}</h1>
			<div class="show-info">
				<h1>${showObj.engname}</h1>
				<p>Audio Language: ${showObj.language}</p>
				<div class="show-seasons">
		`;
	seasons = showObj.seasons;
	console.log('seasons', seasons)
	for(let i = 0; i < seasons.length; i++) {
		season = seasons[i];
		modalContent += `
				<div class="show-season">
					<div class="season-details">
						<h3>第${i + 1}季</h3>
						<p>Episodes: ${season.episodes}</p>
						<p>Size: ${season.size}</p>
					</div><!-- /season-details -->

					<div class="season-downloads">
						<p><u><a href="${season.link}" target="_blank">Condensed Audio</a></u></p>
						<p><u><a href="${season.subslink}" target="_blank">Subtitle Files</a></u></p>
					</div><!-- /season-details -->
				</div><!-- /show-season -->
		`;
	}
	modalContent += `
				</div><!-- /show-seasons -->
			</div><!-- /show-info -->
	`;
	console.log(modalContent);
	modal.innerHTML = modalContent;

	document.getElementById('overlay').classList.add('is-visible');
	document.getElementById('modal').classList.add('is-visible');

	document.getElementById('close-btn').addEventListener('click', function() {
		document.getElementById('overlay').classList.remove('is-visible');
		document.getElementById('modal').classList.remove('is-visible');
	});

	let doc = document.documentElement;
	let scrollPos = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
	console.log(scrollPos);
	modal.style.marginTop = scrollPos.toString() + "px";
}

function addDisplayCardListeners(catalog) {
	let currDisplayCards = document.getElementsByClassName('display-card');
	for(let i = 0; i < currDisplayCards.length; i++) {
		let name = currDisplayCards[i].id
		currDisplayCards[i].addEventListener("click", _ => {
			console.log("hi", name);
			let showObj = searchCatalogByName(name, catalog);
			console.log("showObj:", showObj);
			buildModal(showObj);
		});
	}
}

function buildDisplayCard(content) {
	let card = `
		<div id="${content.name}" class="grid-card display-card">
	`;

	if(content.imgs.length > 0) {
		let img = chooseRandomImage(content.imgs);
		card += `
			<div class="photo">
				<img src="${content.imgfolder}/${img}" alt="${img}">
			</div><!-- /photo -->
		`;
	} else {
		card += `
			<div class="photo">
				<img src="./assets/imgs/default-poster.jpg" alt="default-poster.jpg">
			</div><!-- /photo -->
		`;
	}

	card += `
			<h3><span class="pseudo-a-tag">${content.name}</span></h3>
			<h4>${content.engname}</h4>
		</div><!-- /grid-card -->
	`;
	return card;
}

function buildCardContent(contentArr, buildFunc) {
	let content = '';
	for(let i = 0; i < contentArr.length; i++) {
		content += buildFunc(contentArr[i]);
	}
	return content;
}

function renderScreen(newCategory, contentElement, buildDisplayFunc) {

	// global var, be mindful of state!!
	currCategory = newCategory;

	let currContent = buildCardContent(newCategory, buildDisplayFunc);
	contentElement.innerHTML = currContent;

	// add modal events to display cards
	addDisplayCardListeners(newCategory);
	document.getElementById('overlay').addEventListener('click', function() {
	  document.getElementById('overlay').classList.remove('is-visible');
	  document.getElementById('modal').classList.remove('is-visible');
	});
}

function preloadImage(url) {
	let img = new Image();
	img.src = url;
}

function preloadCatalogImages(catalog) {
	console.log(catalog);
	let shows = catalog.shows;
	let movies = catalog.movies;
	let imgs = [];
	if(shows) {
		console.log("shows");
		for(i = 0; i < shows.length; i++) {
			let currShow = shows[i];
			for(j = 0; j < currShow.imgs.length; j++) {
				imgs.push(currShow.imgfolder + '/' + currShow.imgs[j]);
			}
		}
	}

	if(movies) {
		console.log("movies");
		for(i = 0; i < movies.length; i++) {
			let currMovie = movies[i];
			for(j = 0; j < currMovie.imgs.length; j++) {
				imgs.push(currMovie.imgfolder + '/' + currMovie.imgs[j]);
			}
		}
	}

	for(i = 0; i < imgs.length; i++) {
		console.log("img:", imgs[i]);
		preloadImage(imgs[i]);
	}
}

// ==================================================
// main events
// ==================================================

// get content elements
let content = document.getElementById('content');
let contentGrid = content.getElementsByClassName('grid')[0];

// preload images to browser
preloadCatalogImages(catalog.chinese);

// get chinese shows and movies
let chineseShows = catalog.chinese.shows;
let chineseMovies = catalog.chinese.movies;
let currCategory = chineseShows;

// categories event listeners
let showCategory = document.getElementById('shows-category');
showCategory.addEventListener('click', _ => {
	renderScreen(chineseShows, contentGrid, buildDisplayCard);
});
console.log(showCategory);

let movieCategory = document.getElementById('movies-category');
movieCategory.addEventListener('click', _ => {
	renderScreen(chineseMovies, contentGrid, buildDisplayCard)
});
console.log(movieCategory);

// build content to screen
renderScreen(chineseShows, contentGrid, buildDisplayCard);

// change posters event listener
const interval = setInterval(function() {
	let displayCards = Array.from(document.getElementsByClassName('display-card'));
	let selectedDisplayCards = chooseNRandom(displayCards, 1);
	changeImages(selectedDisplayCards, currCategory);
}, 2500);










