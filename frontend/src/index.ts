import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import page from 'page';

import { VisaoAvisoEmDOM } from './Aviso/VisaoAvisoEmDOM';
import { VisaoAuthEmDOM } from './Auth/VisaoAuthEmDOM';
import { ServicoAuth } from './Auth/ServicoAuth';
import { ServicoAviso } from './Aviso/ServicoAviso'; 
import { ControladoraTV } from './Aviso/ControladoraTv';

const visaoAviso = new VisaoAvisoEmDOM();
const controladoraTV = new ControladoraTV(visaoAviso);
const visaoAuth = new VisaoAuthEmDOM();

page('/', async () => {
    controladoraTV.iniciar();
});

page('/login', () => {
    visaoAuth.mostrarLogin();
});

page('/cadastro-avisos', async (ctx, next) => {
    controladoraTV.parar();

    if (!ServicoAuth.estaLogado()) {
        const sessaoValida = await ServicoAuth.verificarSessao();
        if (!sessaoValida) {
            page.redirect('/login');
            return;
        }
    }
    const avisos = await ServicoAviso.listarAvisos(false);
    visaoAviso.mostrarListagemECadastro(avisos);
});

page();