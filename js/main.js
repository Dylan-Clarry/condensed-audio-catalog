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
			cardImg.src = `${catalogItem.imgfolder}/${newImg}.jpg`;
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
				<img src="${showObj.imgfolder}/backdrop.jpg" alt="./assets/backdrops/default.jpg" onerror="this.onerror=null;this.src='./assets/imgs/default-backdrop.jpg';">
			</div><!-- /photo -->

			<h1 class="modal-header">${showObj.name}</h1>
			<div class="show-info">
				<h1>${showObj.engname}</h1>
				<p>Audio Language: ${showObj.language}</p>
				<div class="show-seasons">
		`;
	seasons = showObj.seasons;
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
	modal.innerHTML = modalContent;

	document.getElementById('overlay').classList.add('is-visible');
	document.getElementById('modal').classList.add('is-visible');

	document.getElementById('close-btn').addEventListener('click', function() {
		document.getElementById('overlay').classList.remove('is-visible');
		document.getElementById('modal').classList.remove('is-visible');
	});

	let doc = document.documentElement;
	let scrollPos = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
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
				<img src="${content.imgfolder}/${img}.jpg" alt="${img}">
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
	console.log("url", img.src);
}

function preloadCatalogImages(catalog) {
	let shows = catalog.shows;
	let movies = catalog.movies;
	let imgs = [];
	if(shows) {
		for(i = 0; i < shows.length; i++) {
			let currShow = shows[i];
			for(j = 0; j < currShow.imgs.length; j++) {
				imgs.push(currShow.imgfolder + '/' + currShow.imgs[j] + '.jpg');
			}
		}
	}
	if(movies) {
		for(i = 0; i < movies.length; i++) {
			let currMovie = movies[i];
			for(j = 0; j < currMovie.imgs.length; j++) {
				imgs.push(currMovie.imgfolder + '/' + currMovie.imgs[j] + '.jpg');
			}
		}
	}
	for(i = 0; i < imgs.length; i++) {
		preloadImage(imgs[i]);
	}
}

function deviceIsMobile() {
	// device detection
	if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
	    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
	    return true;
	}
	return false;
}

// ==================================================
// main events
// ==================================================

// get content elements
let content = document.getElementById('content');
let contentGrid = content.getElementsByClassName('grid')[0];

// preload images to browser
let isMobile = deviceIsMobile();
if(!isMobile) {
	preloadCatalogImages(catalog.chinese);
}

// get chinese shows and movies
let chineseShows = catalog.chinese.shows;
let chineseMovies = catalog.chinese.movies;
let currCategory = chineseShows;

// categories event listeners
let showCategory = document.getElementById('shows-category');
showCategory.addEventListener('click', _ => {
	renderScreen(chineseShows, contentGrid, buildDisplayCard);
});

let movieCategory = document.getElementById('movies-category');
movieCategory.addEventListener('click', _ => {
	renderScreen(chineseMovies, contentGrid, buildDisplayCard)
});

// build content to screen
renderScreen(chineseShows, contentGrid, buildDisplayCard);

// change posters event listener
const interval = setInterval(function() {
	if(!isMobile) {
		let displayCards = Array.from(document.getElementsByClassName('display-card'));
		let selectedDisplayCards = chooseNRandom(displayCards, 1);
		changeImages(selectedDisplayCards, currCategory);
	}
}, 2500);










