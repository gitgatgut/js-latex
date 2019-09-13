'use strict';

class MJEditor {
    constructor(editor) {
        this.editor = editor;
        this.output = document.getElementById('output');
        this.directlink = document.getElementById('directlink');
        this.setup();
    }
    setup() { 
        let tex = '';
        try {
            const url = new URL(window.location.href);
            tex = url.searchParams.get("tex") || '';
        } catch (URIError) {
            tex = '';
        }
        if (!tex && window.localStorage.mathJax) {
            tex = window.localStorage.mathJax;
        }
        this.editor.setValue(tex);
        this.editor.refresh();    
        $('.resizable').resizable();
        $('.CodeMirror').keyup(() => {
            window.localStorage.mathJax = this.editor.getValue();
            this.format();
            this.makeLink();
        });
        $('#download').click(() => {
            this.downloadSvg();
        });
        this.editor.focus();
    }
    makeLink() {
        const url = new URL(window.location.href);
        const tex = this.editor.getValue();
        const href = url.pathname + '?tex=' + encodeURIComponent(tex);
        this.directlink.href = href;
    }
    format() {
        let tex = this.editor.getValue().trim();
        tex = tex.split('\n').map((s)=>'$$'+s+'$$').join('\n');
        this.output.innerHTML = tex;
        MathJax.texReset();
        MathJax.typesetClear();
        MathJax.typesetPromise([output]).catch(function (err) {
            this.output.innerHTML = '';
            this.output.appendChild(document.createTextNode(err.message));
            console.error(err);
        });
    }
    downloadSvg() {
        const svg = document.getElementsByTagName('svg')[0].parentNode.innerHTML;
        const blob = new Blob([svg]);
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'equation.svg';
        a.click();
    }
}
window.onload = () => {
    const myTextarea = document.getElementById('input');
    const editor = CodeMirror.fromTextArea(myTextarea, {
        lineNumbers: true,
        lineWrapping: true,
        mode: 'stex',
        theme: 'zenburn'
    });
    var mjeditor = new MJEditor(editor);
    mjeditor.format();
    mjeditor.makeLink();
};