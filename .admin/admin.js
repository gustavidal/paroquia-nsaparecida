// ===== STATE =====
let state = {
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

let nextId = { eventos: 10, pastorais: 10, comunidades: 10, horarios: 10 };
let editingId = { eventos: null, pastorais: null, comunidades: null, horarios: null };
let confirmCallback = null;
let currentSection = 'eventos';

// ===== RENDER =====

function renderAll() {
    renderEventos();
    renderPastorais();
    renderComunidades();
    renderHorarios();
    renderStats();
}

function renderStats() {
    const el = document.getElementById('stats-eventos');
    const now = new Date();
    const month = now.getMonth();
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const thisMonth = state.eventos.filter(e => e.mes === months[month]).length;
    el.innerHTML = `
        <div class="stat-card">
            <div class="stat-num">${state.eventos.length}</div>
            <div class="stat-label">Total de eventos</div>
        </div>
        <div class="stat-card">
            <div class="stat-num">${thisMonth}</div>
            <div class="stat-label">Este mês</div>
        </div>
        <div class="stat-card">
            <div class="stat-num">${state.comunidades.length}</div>
            <div class="stat-label">Comunidades</div>
        </div>
    `;
}

function renderEventos() {
    const el = document.getElementById('list-eventos');
    if (!state.eventos.length) {
        el.innerHTML = emptyState('📅', 'Nenhum evento cadastrado', 'Clique em "+ Novo Evento" para adicionar.');
        return;
    }
    el.innerHTML = state.eventos.map(ev => `
        <div class="item-card">
            <div class="item-date-badge">
                <div class="day">${ev.dia}</div>
                <div class="month">${ev.mes}</div>
            </div>
            <div class="item-body">
                <h3>${ev.nome}</h3>
                <p>${ev.desc}</p>
                <div class="item-meta">
                    <span>🕐 ${ev.hora}</span>
                    <span>📍 ${ev.local}</span>
                </div>
            </div>
            <div class="item-actions">
                <button class="btn btn-edit" onclick="editEvento(${ev.id})">Editar</button>
                <button class="btn btn-danger" onclick="confirmDelete('eventos', ${ev.id}, '${escHtml(ev.nome)}')">Excluir</button>
            </div>
        </div>
    `).join('');
}

function renderPastorais() {
    const el = document.getElementById('list-pastorais');
    if (!state.pastorais.length) {
        el.innerHTML = emptyState('🤝', 'Nenhuma pastoral cadastrada', 'Clique em "+ Nova Pastoral" para adicionar.');
        return;
    }
    el.innerHTML = state.pastorais.map(pa => `
        <div class="item-card">
            <div class="item-icon">${pa.icone || '🤝'}</div>
            <div class="item-body">
                <h3>${pa.nome}</h3>
                <p>${pa.desc}</p>
                <div class="item-meta">
                    ${pa.dia ? `<span>📆 ${pa.dia}${pa.hora ? ' · ' + pa.hora : ''}</span>` : ''}
                    ${pa.contato ? `<span>👤 ${pa.contato}</span>` : ''}
                </div>
            </div>
            <div class="item-actions">
                <button class="btn btn-edit" onclick="editPastoral(${pa.id})">Editar</button>
                <button class="btn btn-danger" onclick="confirmDelete('pastorais', ${pa.id}, '${escHtml(pa.nome)}')">Excluir</button>
            </div>
        </div>
    `).join('');
}

function renderComunidades() {
    const el = document.getElementById('list-comunidades');
    if (!state.comunidades.length) {
        el.innerHTML = emptyState('⛪', 'Nenhuma comunidade cadastrada', 'Clique em "+ Nova Comunidade" para adicionar.');
        return;
    }
    el.innerHTML = state.comunidades.map(co => `
        <div class="item-card">
            <div class="item-icon">⛪</div>
            <div class="item-body">
                <h3>${co.nome}</h3>
                <p>${co.desc}</p>
                <div class="item-meta">
                    <span>📍 ${co.end}</span>
                    ${co.tel ? `<span>📞 ${co.tel}</span>` : ''}
                    ${co.resp ? `<span>👤 ${co.resp}</span>` : ''}
                </div>
            </div>
            <div class="item-actions">
                <button class="btn btn-edit" onclick="editComunidade(${co.id})">Editar</button>
                <button class="btn btn-danger" onclick="confirmDelete('comunidades', ${co.id}, '${escHtml(co.nome)}')">Excluir</button>
            </div>
        </div>
    `).join('');
}

function renderHorarios() {
    const el = document.getElementById('list-horarios');
    if (!state.horarios.length) {
        el.innerHTML = emptyState('🕐', 'Nenhum horário cadastrado', 'Clique em "+ Novo Horário" para adicionar.');
        return;
    }
    el.innerHTML = state.horarios.map(ho => `
        <div class="item-card">
            <div class="item-icon">🕐</div>
            <div class="item-body">
                <h3>${ho.dias}</h3>
                <p>${ho.obs || 'Missa'} — ${ho.local}</p>
                <div class="item-meta">
                    <span>🕐 ${ho.hora}</span>
                    <span>📍 ${ho.local}</span>
                </div>
            </div>
            <div class="item-actions">
                <button class="btn btn-edit" onclick="editHorario(${ho.id})">Editar</button>
                <button class="btn btn-danger" onclick="confirmDelete('horarios', ${ho.id}, '${escHtml(ho.dias)}')">Excluir</button>
            </div>
        </div>
    `).join('');
}

function emptyState(icon, title, subtitle) {
    return `<div class="empty-state"><div class="es-icon">${icon}</div><h3>${title}</h3><p>${subtitle}</p></div>`;
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
    document.getElementById('modal-' + type + '-title').textContent =
        { evento: 'Novo Evento', pastoral: 'Nova Pastoral', comunidade: 'Nova Comunidade', horario: 'Novo Horário' }[type];
    document.getElementById('modal-' + type).classList.add('open');
}

function closeModal(type) {
    document.getElementById('modal-' + type).classList.remove('open');
}

function clearForm(type) {
    const ids = {
        evento: ['ev-dia', 'ev-mes', 'ev-nome', 'ev-desc', 'ev-hora', 'ev-local'],
        pastoral: ['pa-icone', 'pa-nome', 'pa-desc', 'pa-dia', 'pa-hora', 'pa-contato'],
        comunidade: ['co-nome', 'co-desc', 'co-end', 'co-tel', 'co-resp'],
        horario: ['ho-dias', 'ho-hora', 'ho-local', 'ho-obs'],
    };
    (ids[type] || []).forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
}

// ===== SAVE =====

function saveEvento() {
    const nome = v('ev-nome'); const dia = v('ev-dia'); const mes = v('ev-mes');
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
    closeModal('pastoral'); renderPastorais();
}

function saveComunidade() {
    const nome = v('co-nome'); const end = v('co-end');
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
    closeModal('comunidade'); renderComunidades(); renderStats();
}

function saveHorario() {
    const dias = v('ho-dias'); const hora = v('ho-hora');
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
    closeModal('horario'); renderHorarios();
}

// ===== EDIT =====

function editEvento(id) {
    const ev = state.eventos.find(e => e.id === id);
    if (!ev) return;
    editingId.eventos = id;
    set('ev-dia', ev.dia); set('ev-mes', ev.mes); set('ev-nome', ev.nome);
    set('ev-desc', ev.desc); set('ev-hora', ev.hora); set('ev-local', ev.local);
    document.getElementById('modal-evento-title').textContent = 'Editar Evento';
    document.getElementById('modal-evento').classList.add('open');
}

function editPastoral(id) {
    const pa = state.pastorais.find(p => p.id === id);
    if (!pa) return;
    editingId.pastorais = id;
    set('pa-icone', pa.icone); set('pa-nome', pa.nome); set('pa-desc', pa.desc);
    set('pa-dia', pa.dia); set('pa-hora', pa.hora); set('pa-contato', pa.contato);
    document.getElementById('modal-pastoral-title').textContent = 'Editar Pastoral';
    document.getElementById('modal-pastoral').classList.add('open');
}

function editComunidade(id) {
    const co = state.comunidades.find(c => c.id === id);
    if (!co) return;
    editingId.comunidades = id;
    set('co-nome', co.nome); set('co-desc', co.desc); set('co-end', co.end);
    set('co-tel', co.tel); set('co-resp', co.resp);
    document.getElementById('modal-comunidade-title').textContent = 'Editar Comunidade';
    document.getElementById('modal-comunidade').classList.add('open');
}

function editHorario(id) {
    const ho = state.horarios.find(h => h.id === id);
    if (!ho) return;
    editingId.horarios = id;
    set('ho-dias', ho.dias); set('ho-hora', ho.hora); set('ho-local', ho.local); set('ho-obs', ho.obs);
    document.getElementById('modal-horario-title').textContent = 'Editar Horário';
    document.getElementById('modal-horario').classList.add('open');
}

// ===== DELETE =====

function confirmDelete(collection, id, nome) {
    document.getElementById('confirm-msg').textContent = `Tem certeza que deseja excluir "${nome}"? Esta ação não pode ser desfeita.`;
    document.getElementById('confirm-overlay').classList.add('open');
    confirmCallback = () => {
        state[collection] = state[collection].filter(item => item.id !== id);
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

// ===== UTILS =====

function v(id) { return (document.getElementById(id)?.value || '').trim(); }
function set(id, val) { const el = document.getElementById(id); if (el) el.value = val || ''; }
function escHtml(str) { return (str || '').replace(/'/g, "\\'"); }

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}

// Close modals on overlay click
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