var cm = undefined;
var socket = io.connect('http://localhost:3000');
$(document).ready(() => {
    cm = CodeMirror.fromTextArea(document.getElementById('editor'), {
        mode: 'javascript',
        lineNumbers: true,
        theme: 'dracula',
        indentUnit: 4,
        autofocus: true,
        splitLinesAuto: false,
        Tab: function (cm) {
            var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
            cm.replaceSelection(spaces);
        }
    });
});

function sendCode() {
    data = {'code': cm.getValue()};
    socket.emit('ssh', {msg: data});
    $('#output').text('');
}

function clearFields() {
    cm.setValue('');
    cm.clearHistory();
    $('#editor').text('');
}

socket.on('ssh-sc', (data) => {
    console.log(data);
    $('#output').append(data);
});
