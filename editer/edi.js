var editor = document.getElementById('editor'),
viewer = document.getElementById('viewer'),
fileChooser = document.getElementById('fileChooser'),
resizer = document.getElementById('resizer');

function preview() {
try {
    var viewerDoc = viewer.contentDocument;
    viewerDoc.open();
    viewerDoc.write(editor.value);
    viewerDoc.close();
} catch (e) { // in case of iframe redirection to a different origin
    viewer.src = 'about:blank';
    setTimeout(preview, 4); // minimum delay
}
}
preview();
editor.oninput = preview;

function createURL() {
var blob = new Blob([editor.value], {
    type: 'text/html'
});
document.getElementById('fileSaver').href = window.URL.createObjectURL(blob);
}
createURL();
editor.onchange = createURL;
fileChooser.onclick = function () { // to empty the fileList so you can rechoose the same file
this.value = '';
};
fileChooser.onchange = function () {
var file = this.files[0],
    reader = new FileReader();
if (file) { // to ensure that there's a file to read so IE11 doesn't run this function on clicking fileChooser before you choose a file
    reader.readAsText(file);
    reader.onload = function () {
        editor.value = this.result;
        preview();
        createURL();
    };
}
};
document.getElementById('viewsToggle').onchange = function () {
document.getElementById('main').classList.toggle('horizontal');
};
resizer.oninput = resizer.onchange = function () { // The onchange property is added to support IE11.
var resizerVal = this.value;
editor.style.webkitFlex = resizerVal;
editor.style.flex = resizerVal;
viewer.style.webkitFlex = 100 - resizerVal;
viewer.style.flex = 100 - resizerVal;
document.getElementById('indicator').textContent = resizerVal + '%';
if (resizerVal == 0) {
    editor.className = 'minSize';
} else {
    editor.className = '';
}
};
document.getElementById('selector').onclick = function () {
editor.select();
};
document.getElementById('resetter').onclick = function () {
if (!editor.value || editor.value != editor.defaultValue && confirm('Are you sure?')) {
    editor.value = editor.defaultValue;
    preview();
    createURL();
}
};
document.getElementById('footerToggle').onclick = function () {
var footerClasses = document.getElementById('footer').classList;
footerClasses.toggle('shown');
if (footerClasses.length) {
    this.value = '▼';
    this.title = 'Hide footer';
} else {
    this.value = '▲';
    this.title = 'Show footer';
}
};