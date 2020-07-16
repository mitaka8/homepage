let config = {};
let main;
let keyInput;
function setIntervalI(f, t) {
	f();
	return setInterval(f,t);
}
/** @return {Promise} */
function getElementsFromRSS(resource) {
	return fetch('https://aphilian.nl/rss.php?r=' + encodeURIComponent(resource)).then(r => r.text()).then(res => {
		parser = new DOMParser();
		xmlDoc = parser.parseFromString(res, "text/xml");
		let rssElem = xmlDoc.children[0];
		return Array.prototype.map.call(rssElem.children[0].children, item => {
			if (item.children.length === 0) return null;
			return {
				title: item.children[0].textContent,
				link: item.children[1].textContent,
			}
		}).filter(x => x !== null);
	})
}
function h(tag, attributes = {}, children = []) {
	let element = document.createElement(tag);
	
	for(let key in attributes) {
		if (!Object.hasOwnProperty.call(attributes, key)) continue;
		element.setAttribute(key, attributes[key]);
	}
	
	children.forEach(child => {
		// Skip over empties
		if (typeof child === "undefined" || child === null) return; 
			if (typeof child === "string") {
			let childText = document.createTextNode(child);
			element.appendChild(childText);
			return;
		}
			element.appendChild(child)
	});
	return element;
}
function widget(w) {
	switch (w.widget) {
		case 'clock':
			let clockText = h('h2', {}, ['']);
			let dateText = h('p', {}, ['']);
			let days = [
				h('span', {'class': 'badge bg-dark'}, ['mon']),
				h('span', {'class': 'badge bg-dark'}, ['tue']),
				h('span', {'class': 'badge bg-dark'}, ['wed']),
				h('span', {'class': 'badge bg-dark'}, ['thu']),
				h('span', {'class': 'badge bg-dark'}, ['fri']),
				h('span', {'class': 'badge bg-dark'}, ['sat']),
				h('span', {'class': 'badge bg-dark'}, ['sun'])
			];
			let element = h("div", {'class': 'card bg-dark widget-clock'}, [
				h('div', {'class': 'card-body'}, [
					h('div', {'class': 'row no-gutters'}, [
						h('div', {'class': 'col-8'}, [
							clockText,
							dateText,
						]),
						h('div', {'class': 'col-4 col-count-2'}, days),
					])
				]),
			]);
			setIntervalI(() => {
				let hours = (new Date).getHours().toString().padStart(2, "0");
				let minutes = (new Date).getMinutes().toString().padStart(2, "0");
				if (clockText.firstChild.nodeValue !== `${hours}:${minutes}`) {
					clockText.firstChild.nodeValue = `${hours}:${minutes}`
				}
				
			}, 3000);
			setIntervalI(() => {
				let d = new Date();
				let year = d.getFullYear().toString();
				let month = (d.getMonth() + 1).toString().padStart(2, "0");
				let date = d.getDate().toString().padStart(2, "0");
				let day = d.getDay()-1;
				days.forEach(x=>{x.classList.remove('bg-light');x.classList.add('bg-dark')});
				days[day].classList.replace('bg-dark', 'bg-light');
				if (dateText.firstChild.nodeValue !== `${year}-${month}-${date}`) {
					dateText.firstChild.nodeValue = `${year}-${month}-${date}`;
				}
			},180000);
			return element;
		case 'buienradar':
			return h('div', {'class': 'card widget-buienradar'}, [
				h('div', {'class': 'card-header'}, ['Weather Report by ', h('a', {'href': 'https://buienradar.nl/', 'target': '_blank', 'rel': 'nofollow'}, ['Buienradar']), '.']),
				h('img', {'class': 'card-img','src': 'https://api.buienradar.nl/image/1.0/RadarMapNL?w=256&h=256'}, [])
			]);
				
		case 'knmi':
			return h('div', {'class': 'card widget-knmi'}, [
				h('div', {'class': 'card-header'}, ['Weather Report by ', h('a', {'href': 'https://knmi.nl/', 'target': '_blank', 'rel': 'nofollow'}, ['KNMI']), '.']),
				h('img', {'class': 'card-img', 'title': 'Weather by KNMI', 'src': 'https://cdn.knmi.nl/knmi/map/general/weather-map.gif'}, [])
			]);
		case 'rss':
			let list = h('div', {'class': 'list-group list-group-flush'}, []);
			let updateLinks = () => {
				getElementsFromRSS(w.resource).then(links => {
					
					while (list.firstChild) {
						list.removeChild(list.firstChild);
					}
					links.slice(0,5).forEach(link => {
						list.appendChild(h('a', {'class':'list-group-item', 'href': link.link, 'rel': 'nofollow', 'target': '_blank'}, [link.title]));
					});
				});
			}
			setIntervalI(updateLinks, 3000000);
			return h('div', {'class': 'card widget-rss'}, [
				h('div', {'class': 'card-header'}, [w.title]),
				list,
			]);
		default:
			return h('div', {'class': 'card'}, [h('div', {'class': 'card-body text-white bg-danger'}, ['Unknown Widget Type: ' + name])])

	}
}

function list(l) {
	return h(
		'div', 
		{'class': 'card' + (Array.isArray(l.classes) ? (' ' + l.classes.join(' ')) : ""), 'id': typeof l.title === "string" ? "list-"+l.title.toLowerCase().replace(/\s\.\_\\\//g, "-") : undefined}, [
		h('div', {'class': 'card-body'}, [
		h('h3', {'class': 'card-title mb-0' + (typeof l.color === "string" ? " text-" + l.color : "") }, [
			typeof l.icon === 'string' ? h('i', {'class': 'material-icons tiny'}, [l.icon]) : null,
					typeof l.icon === 'string' ? " ": null,
					l.title
				]),
			]),
			h('div', {'class': 'list-group list-group-flush'}, l.links.map(link => {
				if (typeof link.shortcutKey === "string") {
					Mousetrap.bind(link.shortcutKey, () => open(link.href, "", "noopener"));
				}
				
				return h('a', {'class':'list-group-item d-flex justify-content-between align-items-center' + (typeof link.color === "string" ? "text-" + link.color : ''), 'rel': 'noopener', 'target':'_blank', 'href': link.href, 'title': link.title }, [
					link.title,  
					" ",
					h('div', {}, [
						typeof link.shortcutKey === "string" ? h('kbd', {'class':'d-none d-sm-inline'}, [link.shortcutKey]) : null,
						" ",

						typeof link.icon === 'string' ? h('i', {'class': 'material-icons tiny' + (typeof link.color === "string" ? " text-" + link.color : '')}, [link.icon]) : null
					]),
				])
			})),
		]
	)
}

function renderMain() {
	while (main.firstChild) {
		main.removeChild(main.firstChild);
	}
	config.links.forEach(element => {
		switch (element.type) {
			case 'widget':
				main.appendChild(widget(element));
				break;
			case undefined:
			default:
				main.appendChild(list(element));
		}
	});
	if(typeof config.title === "string") {
		document.title = config.title;
		document.getElementById('document-title').firstChild.nodeValue = config.title;
	}
	if (typeof config.wallpaper === "string") {
		document.body.style.backgroundImage = `url("${config.wallpaper}")`;
	}


	if (typeof config.style === "string") {
		let style = document.getElementById('custom-style');

		while (style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(config.style));
	}
}

		
function setup() {
	main = document.getElementById('main');
	keyInput = document.getElementById('key-input');
	if(location.hash !== "" && location.hash.length === 129) {
		localStorage.setItem('links-id', location.hash.substr(1));
	}

	let linkId = localStorage.getItem('links-id');
	if (linkId === null || linkId === "") {
		linkId = "";
		config = {"title": "My Homepage", "links": [{"type":"widget", "widget": "knmi"}]};
		renderMain();
	} else {
		if (localStorage.getItem('config-' + linkId) !== null) {
			config = JSON.parse(localStorage.getItem('config-' + linkId));
			renderMain();
		} else {
			fetch('config/' + linkId + '.json')
			.then(res => res.json()).then(c => {
				config = c;
				renderMain();
				localStorage.setItem('config-' + linkId, JSON.stringify(c));
			}).catch(e => {
				errorHandler(e);
			});
		}
	}

	let input = document.getElementById('search-input');

	let searchModal = document.getElementById('search-modal');

	// Input set ID
	keyInput.addEventListener("change", ev => {
		localStorage.setItem('links-id', ev.target.value);
		location.reload();
	});

	keyInput.value = localStorage.getItem("links-id");

	Mousetrap(input).bind('enter', () => {
		open('https://duckduckgo.com/?q=' + input.value.replace(/\s/g, '+'), '', 'noopener');
		input.value = "";
		searchModal.classList.add('hidden');
	});
	Mousetrap(input).bind('escape', () => {
		input.value = "";
		searchModal.classList.add('hidden');
		Mousetrap.unbind('escape');
	});

	Mousetrap.bind(typeof config.searchKey === "string" ? config.searchKey : '\\', () => {
		searchModal.classList.remove('hidden');
		input.focus();
	});
}
function errorHandler(err) {
	main.appendChild(h('h', {'class': 'col'}, [h('div', {'class': 'alert alert-danger'}, [err.toString()])]))
	console.error(err);
}

document.addEventListener('readystatechange', () => {
	if (document.readyState !== 'complete') return;
	setup();
});

