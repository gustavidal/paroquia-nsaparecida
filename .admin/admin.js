// ===== DEFAULTS =====
const DEFAULTS = {
    eventos: [
        { id: 1, dia: '12', mes: 'Jun', nome: 'Festa Junina da Paróquia', desc: 'A tradicional festa junina com quadrilha, barracas e muita animação.', hora: '18h00', local: 'Igreja Matriz' },
        { id: 2, dia: '29', mes: 'Jun', nome: 'Solenidade de São Pedro e São Paulo', desc: 'Missa solene em honra aos apóstolos Pedro e Paulo.', hora: '19h00', local: 'Igreja Matriz' },
        { id: 3, dia: '12', mes: 'Out', nome: 'Festa de Nossa Senhora Aparecida', desc: 'Solenidade da Padroeira do Brasil, com missa solene, procissão e festa.', hora: '09h00', local: 'Igreja Matriz' },
        { id: 4, dia: '02', mes: 'Nov', nome: 'Dia de Finados — Missa pelos Falecidos', desc: 'Celebração em memória de todos os fiéis defuntos.', hora: '07h00 e 19h00', local: 'Igreja Matriz' },
    ],
    pastorais: [
        { id: 1, icone: '👶', nome: 'Pastoral do Batismo', desc: 'Acolhe e prepara as famílias para o Sacramento do Batismo.', dia: '', hora: '', contato: '' },
        { id: 2, icone: '🍞', nome: 'Pastoral da Eucaristia', desc: 'Promove a adoração eucarística e catequese sobre o sacramento central da vida cristã.', dia: '', hora: '', contato: '' },
        { id: 3, icone: '❤️', nome: 'Pastoral da Caridade', desc: 'Organiza ações de solidariedade às pessoas em situação de vulnerabilidade.', dia: '', hora: '', contato: '' },
        { id: 4, icone: '👨‍👩‍👧', nome: 'Pastoral da Família', desc: 'Acompanha e fortalece as famílias através de encontros e retiros.', dia: '', hora: '', contato: '' },
        { id: 5, icone: '🎶', nome: 'Pastoral da Música Litúrgica', desc: 'Animação das celebrações através do canto e da música a serviço da liturgia.', dia: '', hora: '', contato: '' },
        { id: 6, icone: '📖', nome: 'Pastoral da Catequese', desc: 'Formação cristã de crianças, jovens e adultos.', dia: '', hora: '', contato: '' },
    ],
    comunidades: [
        { id: 1, nome: 'Igreja Matriz — Nossa Senhora Aparecida', desc: 'A sede da paróquia, onde acontecem as principais celebrações.', end: 'Av. Nossa Senhora Aparecida, 68 — Centro', tel: '(11) 4707-2585', resp: '' },
        { id: 2, nome: 'Comunidade São José', desc: 'Comunidade comprometida com a fé e a vida em família.', end: 'Rua São José, s/n — Jandira', tel: '', resp: '' },
        { id: 3, nome: 'Comunidade Santa Teresinha', desc: 'Uma comunidade acolhedora, dedicada à evangelização.', end: 'Rua Santa Teresinha, s/n — Jandira', tel: '', resp: '' },
    ],
    horarios: [
        { id: 1, dias: 'Quartas', hora: '16h00', local: 'Igreja Matriz', obs: 'Missa com novena à Nossa Senhora do Perpétuo Socorro' },
        { id: 2, dias: 'Seg, Ter, Qui e Sex', hora: '19h00', local: 'Igreja Matriz', obs: 'Missa diária' },
        { id: 3, dias: 'Sábados', hora: '19h00', local: 'Igreja Matriz', obs: 'Missa vespertina' },
        { id: 4, dias: 'Domingos', hora: '07h · 9h30 · 19h', local: 'Igreja Matriz', obs: 'Missas dominicais' },
    ],
};

// ===== PERSISTÊNCIA =====
const STORAGE_KEY = 'pascom_state';
const NEXT_ID_KEY  = 'pascom_nextId';

function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    localStorage.setItem(NEXT_ID_KEY, JSON.stringify(nextId));
}

function loadFromStorage() {
    try {
        const saved    = localStorage.getItem(STORAGE_KEY);
        const savedIds = localStorage.getItem(NEXT_ID_KEY);
        if (saved) {
            return {
                state:  JSON.parse(saved),
                nextId: savedIds ? JSON.parse(savedIds) : { eventos: 10, pastorais: 10, comunidades: 10, horarios: 10 },
            };
        }
    } catch (e) {
        console.warn('Erro ao carregar dados salvos:', e);
    }
    return null;
}

// ===== STATE =====
const _stored = loadFromStorage();

let state     = _stored?.state  ?? JSON.parse(JSON.stringify(DEFAULTS));
let nextId    = _stored?.nextId ?? { eventos: 10, pastorais: 10, comunidades: 10, horarios: 10 };
let editingId = { eventos: null, pastorais: null, comunidades: null, horarios: null };
let confirmCallback = null;
let currentSection  = 'eventos';

// ===== DOM HELPERS =====

// Create element with optional classes and text
function el(tag, classes = [], text = '') {
    const e = document.createElement(tag);
    if (classes.length) e.className = classes.join(' ');
    if (text) e.textContent = text;
    return e;
}

// Append multiple children to a parent
function append(parent, ...children) {
    children.forEach(c => { if (c) parent.appendChild(c); });
    return parent;
}

// Clear all children from a container
function clear(container) {
    while (container.firstChild) container.removeChild(container.firstChild);
}

// Create a button with class, label and click handler
function btn(classes, label, onClick) {
    const b = el('button', classes, label);
    b.addEventListener('click', onClick);
    return b;
}

// ===== EMPTY STATE =====
function makeEmptyState(icon, title, subtitle) {
    const wrap  = el('div', ['empty-state']);
    const ico   = el('div', ['es-icon'], icon);
    const h3    = el('h3',  [], title);
    const p     = el('p',   [], subtitle);
    return append(wrap, ico, h3, p);
}

// ===== RENDER =====
function renderAll() {
    renderEventos();
    renderPastorais();
    renderComunidades();
    renderHorarios();
    renderStats();
}

function renderStats() {
    const container = document.getElementById('stats-eventos');
    clear(container);

    const now    = new Date();
    const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    const thisMonth = state.eventos.filter(e => e.mes === months[now.getMonth()]).length;

    const cards = [
        [state.eventos.length,    'Total de eventos'],
        [thisMonth,               'Este mês'],
        [state.comunidades.length,'Comunidades'],
    ];

    cards.forEach(([num, label]) => {
        const card = el('div', ['stat-card']);
        append(card,
            el('div', ['stat-num'],   String(num)),
            el('div', ['stat-label'], label)
        );
        container.appendChild(card);
    });
}

function renderEventos() {
    const container = document.getElementById('list-eventos');
    clear(container);

    if (!state.eventos.length) {
        container.appendChild(makeEmptyState('📅', 'Nenhum evento cadastrado', 'Clique em "+ Novo Evento" para adicionar.'));
        return;
    }

    state.eventos.forEach(ev => {
        // Date badge
        const badge = el('div', ['item-date-badge']);
        append(badge,
            el('div', ['day'],   ev.dia),
            el('div', ['month'], ev.mes)
        );

        // Meta row
        const meta = el('div', ['item-meta']);
        append(meta,
            el('span', [], '🕐 ' + ev.hora),
            el('span', [], '📍 ' + ev.local)
        );

        // Body
        const body = el('div', ['item-body']);
        append(body,
            el('h3', [], ev.nome),
            el('p',  [], ev.desc),
            meta
        );

        // Actions
        const actions = el('div', ['item-actions']);
        append(actions,
            btn(['btn', 'btn-edit'],   'Editar',  () => editEvento(ev.id)),
            btn(['btn', 'btn-danger'], 'Excluir', () => confirmDelete('eventos', ev.id, ev.nome))
        );

        const card = el('div', ['item-card']);
        append(card, badge, body, actions);
        container.appendChild(card);
    });
}

function renderPastorais() {
    const container = document.getElementById('list-pastorais');
    clear(container);

    if (!state.pastorais.length) {
        container.appendChild(makeEmptyState('🤝', 'Nenhuma pastoral cadastrada', 'Clique em "+ Nova Pastoral" para adicionar.'));
        return;
    }

    state.pastorais.forEach(pa => {
        const icon = el('div', ['item-icon'], pa.icone || '🤝');

        const meta = el('div', ['item-meta']);
        if (pa.dia) meta.appendChild(el('span', [], '📆 ' + pa.dia + (pa.hora ? ' · ' + pa.hora : '')));
        if (pa.contato) meta.appendChild(el('span', [], '👤 ' + pa.contato));

        const body = el('div', ['item-body']);
        append(body,
            el('h3', [], pa.nome),
            el('p',  [], pa.desc),
            meta
        );

        const actions = el('div', ['item-actions']);
        append(actions,
            btn(['btn', 'btn-edit'],   'Editar',  () => editPastoral(pa.id)),
            btn(['btn', 'btn-danger'], 'Excluir', () => confirmDelete('pastorais', pa.id, pa.nome))
        );

        const card = el('div', ['item-card']);
        append(card, icon, body, actions);
        container.appendChild(card);
    });
}

function renderComunidades() {
    const container = document.getElementById('list-comunidades');
    clear(container);

    if (!state.comunidades.length) {
        container.appendChild(makeEmptyState('⛪', 'Nenhuma comunidade cadastrada', 'Clique em "+ Nova Comunidade" para adicionar.'));
        return;
    }

    state.comunidades.forEach(co => {
        const icon = el('div', ['item-icon'], '⛪');

        const meta = el('div', ['item-meta']);
        meta.appendChild(el('span', [], '📍 ' + co.end));
        if (co.tel)  meta.appendChild(el('span', [], '📞 ' + co.tel));
        if (co.resp) meta.appendChild(el('span', [], '👤 ' + co.resp));

        const body = el('div', ['item-body']);
        append(body,
            el('h3', [], co.nome),
            el('p',  [], co.desc),
            meta
        );

        const actions = el('div', ['item-actions']);
        append(actions,
            btn(['btn', 'btn-edit'],   'Editar',  () => editComunidade(co.id)),
            btn(['btn', 'btn-danger'], 'Excluir', () => confirmDelete('comunidades', co.id, co.nome))
        );

        const card = el('div', ['item-card']);
        append(card, icon, body, actions);
        container.appendChild(card);
    });
}

function renderHorarios() {
    const container = document.getElementById('list-horarios');
    clear(container);

    if (!state.horarios.length) {
        container.appendChild(makeEmptyState('🕐', 'Nenhum horário cadastrado', 'Clique em "+ Novo Horário" para adicionar.'));
        return;
    }

    state.horarios.forEach(ho => {
        const icon = el('div', ['item-icon'], '🕐');

        const meta = el('div', ['item-meta']);
        append(meta,
            el('span', [], '🕐 ' + ho.hora),
            el('span', [], '📍 ' + ho.local)
        );

        const body = el('div', ['item-body']);
        append(body,
            el('h3', [], ho.dias),
            el('p',  [], (ho.obs || 'Missa') + ' — ' + ho.local),
            meta
        );

        const actions = el('div', ['item-actions']);
        append(actions,
            btn(['btn', 'btn-edit'],   'Editar',  () => editHorario(ho.id)),
            btn(['btn', 'btn-danger'], 'Excluir', () => confirmDelete('horarios', ho.id, ho.dias))
        );

        const card = el('div', ['item-card']);
        append(card, icon, body, actions);
        container.appendChild(card);
    });
}

// ===== NAVIGATION =====
function switchSection(name) {
    currentSection = name;
    document.querySelectorAll('.section-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById('panel-' + name).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => {
        if (n.getAttribute('onclick').includes("'" + name + "'")) n.classList.add('active');
    });
}

// ===== MODAL =====
function openModal(type) {
    clearForm(type);
    editingId[type + 's'] = null;
    const titles = { evento: 'Novo Evento', pastoral: 'Nova Pastoral', comunidade: 'Nova Comunidade', horario: 'Novo Horário' };
    document.getElementById('modal-' + type + '-title').textContent = titles[type];
    document.getElementById('modal-' + type).classList.add('open');
}

function closeModal(type) {
    document.getElementById('modal-' + type).classList.remove('open');
}

function clearForm(type) {
    const ids = {
        evento:    ['ev-dia', 'ev-mes', 'ev-nome', 'ev-desc', 'ev-hora', 'ev-local'],
        pastoral:  ['pa-icone', 'pa-nome', 'pa-desc', 'pa-dia', 'pa-hora', 'pa-contato'],
        comunidade:['co-nome', 'co-desc', 'co-end', 'co-tel', 'co-resp'],
        horario:   ['ho-dias', 'ho-hora', 'ho-local', 'ho-obs'],
    };
    (ids[type] || []).forEach(id => { const e = document.getElementById(id); if (e) e.value = ''; });
}

// ===== SAVE =====
function saveEvento() {
    const nome = v('ev-nome'), dia = v('ev-dia'), mes = v('ev-mes');
    if (!nome || !dia || !mes) { showToast('⚠️ Preencha nome, dia e mês.'); return; }
    const obj = { nome, dia, mes, desc: v('ev-desc'), hora: v('ev-hora'), local: v('ev-local') };
    if (editingId.eventos) {
        const i = state.eventos.findIndex(e => e.id === editingId.eventos);
        state.eventos[i] = { ...state.eventos[i], ...obj };
        showToast('✅ Evento atualizado!');
    } else {
        obj.id = nextId.eventos++;
        state.eventos.push(obj);
        showToast('✅ Evento adicionado!');
    }
    saveToStorage();
    closeModal('evento'); renderEventos(); renderStats();
}

function savePastoral() {
    const nome = v('pa-nome');
    if (!nome) { showToast('⚠️ Preencha o nome da pastoral.'); return; }
    const obj = { nome, icone: v('pa-icone') || '🤝', desc: v('pa-desc'), dia: v('pa-dia'), hora: v('pa-hora'), contato: v('pa-contato') };
    if (editingId.pastorais) {
        const i = state.pastorais.findIndex(p => p.id === editingId.pastorais);
        state.pastorais[i] = { ...state.pastorais[i], ...obj };
        showToast('✅ Pastoral atualizada!');
    } else {
        obj.id = nextId.pastorais++;
        state.pastorais.push(obj);
        showToast('✅ Pastoral adicionada!');
    }
    saveToStorage();
    closeModal('pastoral'); renderPastorais();
}

function saveComunidade() {
    const nome = v('co-nome'), end = v('co-end');
    if (!nome || !end) { showToast('⚠️ Preencha nome e endereço.'); return; }
    const obj = { nome, desc: v('co-desc'), end, tel: v('co-tel'), resp: v('co-resp') };
    if (editingId.comunidades) {
        const i = state.comunidades.findIndex(c => c.id === editingId.comunidades);
        state.comunidades[i] = { ...state.comunidades[i], ...obj };
        showToast('✅ Comunidade atualizada!');
    } else {
        obj.id = nextId.comunidades++;
        state.comunidades.push(obj);
        showToast('✅ Comunidade adicionada!');
    }
    saveToStorage();
    closeModal('comunidade'); renderComunidades(); renderStats();
}

function saveHorario() {
    const dias = v('ho-dias'), hora = v('ho-hora');
    if (!dias || !hora) { showToast('⚠️ Preencha dias e horário.'); return; }
    const obj = { dias, hora, local: v('ho-local'), obs: v('ho-obs') };
    if (editingId.horarios) {
        const i = state.horarios.findIndex(h => h.id === editingId.horarios);
        state.horarios[i] = { ...state.horarios[i], ...obj };
        showToast('✅ Horário atualizado!');
    } else {
        obj.id = nextId.horarios++;
        state.horarios.push(obj);
        showToast('✅ Horário adicionado!');
    }
    saveToStorage();
    closeModal('horario'); renderHorarios();
}

// ===== EDIT =====
function editEvento(id) {
    const ev = state.eventos.find(e => e.id === id); if (!ev) return;
    editingId.eventos = id;
    set('ev-dia', ev.dia); set('ev-mes', ev.mes); set('ev-nome', ev.nome);
    set('ev-desc', ev.desc); set('ev-hora', ev.hora); set('ev-local', ev.local);
    document.getElementById('modal-evento-title').textContent = 'Editar Evento';
    document.getElementById('modal-evento').classList.add('open');
}

function editPastoral(id) {
    const pa = state.pastorais.find(p => p.id === id); if (!pa) return;
    editingId.pastorais = id;
    set('pa-icone', pa.icone); set('pa-nome', pa.nome); set('pa-desc', pa.desc);
    set('pa-dia', pa.dia); set('pa-hora', pa.hora); set('pa-contato', pa.contato);
    document.getElementById('modal-pastoral-title').textContent = 'Editar Pastoral';
    document.getElementById('modal-pastoral').classList.add('open');
}

function editComunidade(id) {
    const co = state.comunidades.find(c => c.id === id); if (!co) return;
    editingId.comunidades = id;
    set('co-nome', co.nome); set('co-desc', co.desc); set('co-end', co.end);
    set('co-tel', co.tel); set('co-resp', co.resp);
    document.getElementById('modal-comunidade-title').textContent = 'Editar Comunidade';
    document.getElementById('modal-comunidade').classList.add('open');
}

function editHorario(id) {
    const ho = state.horarios.find(h => h.id === id); if (!ho) return;
    editingId.horarios = id;
    set('ho-dias', ho.dias); set('ho-hora', ho.hora); set('ho-local', ho.local); set('ho-obs', ho.obs);
    document.getElementById('modal-horario-title').textContent = 'Editar Horário';
    document.getElementById('modal-horario').classList.add('open');
}

// ===== DELETE =====
function confirmDelete(collection, id, nome) {
    document.getElementById('confirm-msg').textContent =
        `Tem certeza que deseja excluir "${nome}"? Esta ação não pode ser desfeita.`;
    document.getElementById('confirm-overlay').classList.add('open');
    confirmCallback = () => {
        state[collection] = state[collection].filter(item => item.id !== id);
        saveToStorage();
        renderAll();
        showToast('🗑️ Item excluído.');
        closeConfirm();
    };
    document.getElementById('confirm-btn').onclick = confirmCallback;
}

function closeConfirm() {
    document.getElementById('confirm-overlay').classList.remove('open');
    confirmCallback = null;
}

// ===== RESET =====
function resetToDefaults() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(NEXT_ID_KEY);
    state  = JSON.parse(JSON.stringify(DEFAULTS));
    nextId = { eventos: 10, pastorais: 10, comunidades: 10, horarios: 10 };
    renderAll();
    showToast('🔄 Dados restaurados ao padrão.');
}

// ===== UTILS =====
function v(id) { return (document.getElementById(id)?.value || '').trim(); }
function set(id, val) { const e = document.getElementById(id); if (e) e.value = val || ''; }

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}

// Fecha modais ao clicar no overlay
['modal-evento', 'modal-pastoral', 'modal-comunidade', 'modal-horario'].forEach(id => {
    document.getElementById(id).addEventListener('click', function (e) {
        if (e.target === this) this.classList.remove('open');
    });
});

document.getElementById('confirm-overlay').addEventListener('click', function (e) {
    if (e.target === this) closeConfirm();
});

// ===== INIT =====
renderAll();
