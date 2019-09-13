'use strict';
class MJEditor {
    constructor() {
        this.input = document.getElementById('input');
        this.output = document.getElementById('output');
        this.setup();
    }
    setup() {
        const url = new URL(window.location.href);
        const tex = url.searchParams.get("tex");
        if (tex) {
            console.log(`Have tex ${tex}.`);
            this.input.value = decodeURIComponent(tex);
        } else if (window.localStorage.mathJax) {
            this.input.value = window.localStorage.mathJax;
        }
        $('.resizable').resizable();
        $('#input').keyup(() => {
            window.localStorage.mathJax = this.input.value;
            this.format();
        });
        $('#download').click(() => {
            this.downloadSvg();
        });
    }
    format() {
        let tex = this.input.value.trim();
        tex = tex.split('\n').map((s)=>'$$'+s+'$$').join('\n')
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
    var mjeditor = new MJEditor();
    mjeditor.format();    
};