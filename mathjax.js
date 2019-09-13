'use strict';

class MJEditor {
    constructor(editor) {
        this.editor = editor;
        this.output = document.getElementById('output');
        this.directlink = document.getElementById('directlink');
        this.multiline = document.getElementById('multiline');
        this.setup();
    }
    setup() { 
        const url = new URL(window.location.href);
        let ml = null;
        try {
            ml = url.searchParams.get('ml');
            if (ml !== null) {
                ml = ml === 'true';
            }
            console.log('asd '+ml);
        } catch(URIError) {}
        if (ml === null) {
            ml = window.localStorage.multiline === 'true';
        }
        this.multiline.checked = ml;
        let tex = '';
        try {    
            tex = url.searchParams.get('tex') || '';
        } catch(URIError) {
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
        this.multiline.addEventListener('click', () => {
            this.format();
            window.localStorage.multiline = this.multiline.checked;
        });
        this.editor.focus();
    }
    makeLink() {
        const url = new URL(window.location.href);
        const tex = this.editor.getValue();
        const ml = this.multiline.checked;
        const href = url.pathname+`?ml=${ml}&tex=`+encodeURIComponent(tex);
        this.directlink.href = href;
    }
    format() {
        let tex = this.editor.getValue().trim();
        if (!this.multiline.checked) {
            tex = tex.split('\n').map((s)=>'$$'+s+'$$').join('\n');
        } else {
            tex = '$$'+tex+'$$';
        }
        this.output.innerHTML = tex;
        MathJax.texReset();
        MathJax.typesetClear();
        const self = this;
        MathJax.typesetPromise([output]).catch((err) => {
            self.output.innerHTML = '';
            self.output.appendChild(document.createTextNode(err.message));
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