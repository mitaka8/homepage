		let jsonEditor;
		let jsonEditorKey;
		let jsonEditorUpdateViewButton;
		let jsonEditorSaveButton;

function updateView() {
			let c = JSON.parse(jsonEditor.value);
		}


		function save(config, key) {
			if (key.length === 0) {
				throw new Error("Key can not be 0");
			}
			if (config.length === 0) {
				throw new Error("JSON Config can not be 0");
			}
			
			let fd = new FormData();
			fd.append("config", config);
			fd.append("key", key);

			fetch("/upload.php", {method:"POST", body: fd}).then(res => res.text()).then(key => {
				keyInput.value = key;
				localStorage.setItem('links-id', key);
				location.hash = key;
			});
		}

function setupEditor() {
	jsonEditor = document.getElementById('json-editor');
	jsonEditorUpdateButton = document.getElementById('update');
	jsonEditorKey = document.getElementById('json-editor-key');
	jsonEditorSaveButton = document.getElementById('save');


	
	jsonEditorUpdateButton.addEventListener("click", ev => {
		try {
			config = JSON.parse(jsonEditor.value);
			renderMain();
		} catch(e) {
			errorHandler(e);
		}
	});
	jsonEditorSaveButton.addEventListener("click", ev => {
				try {
					config = JSON.parse(jsonEditor.value);
					save(jsonEditor.value, jsonEditorKey.value);
				} catch(e) {
					errorHandler(e);
				}
	});
	let waitForConfig = setInterval(() => {
		if (typeof config.links !== "undefined") {
			jsonEditor.value = JSON.stringify(config," ", 4);			
			clearInterval(waitForConfig);
		}
	}, 1000);
}
document.addEventListener('readystatechange', () => {
	if (document.readyState !== 'complete') return;
	setupEditor();
});

