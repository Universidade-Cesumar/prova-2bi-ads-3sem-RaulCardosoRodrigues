const API_URL = 'https://6a317ba17bc5e1c61265ce3c.mockapi.io/projeto';

let allItems = [];

function showToast(msg, type = 'ok') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `show ${type}`;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.className = ''; }, 3000);
}

function getQuantidade(item) {
  return Number(item.quantidade ?? item.amount ?? 0);
}

function getNome(item) {
  return item.nome || item.name || '—';
}

function validarRetirada(estoqueAtual, quantidadeRetirada) {
  const estoque = Number(estoqueAtual);
  const retirada = Number(quantidadeRetirada);

  if (isNaN(estoque) || isNaN(retirada)) return false;
  if (retirada <= 0) return false;
  if (retirada > estoque) return false;

  return true;
}

function updateStats(items) {
  document.getElementById('total-itens').textContent  = items.length;
  document.getElementById('stat-zerado').textContent = items.filter(i => getQuantidade(i) === 0).length;
  document.getElementById('stat-qty').textContent    = items.reduce((s, i) => s + getQuantidade(i), 0);
}

function renderRows(items) {
  const tbody = document.getElementById('lista-materiais');

  if (!items.length) {
    tbody.innerHTML = `<tr><td colspan="4"><div class="state-msg">Nenhum material encontrado.</div></td></tr>`;
    return;
  }

  tbody.innerHTML = items.map(item => {
    const qty = getQuantidade(item);
    const badgeClass = qty === 0 ? 'badge zero' : 'badge';

    return `<tr>
      <td>${getNome(item)}</td>
      <td><span class="${badgeClass}">${qty} un.</span></td>
      <td>#${item.id}</td>
      <td class="acoes">
        <button class="btn-baixar" onclick="baixarMaterial('${item.id}')">Baixar</button>
        <button class="btn-excluir" onclick="excluirMaterial('${item.id}')">Excluir</button>
      </td>
    </tr>`;
  }).join('');
}

async function loadMateriais() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    allItems = await res.json();
    renderRows(allItems);
    updateStats(allItems);
  } catch (err) {
    document.getElementById('lista-materiais').innerHTML =
      `<tr><td colspan="4"><div class="state-msg" style="color:var(--danger)">Erro ao carregar dados.</div></td></tr>`;
  }
}

async function cadastrarMaterial() {
  const nomeEl = document.getElementById('input-nome');
  const qtdEl  = document.getElementById('input-quantidade');
  const btn    = document.getElementById('btn-cadastrar');

  const nome = nomeEl.value.trim();
  const quantidade = parseInt(qtdEl.value, 10);

  if (!nome) { showToast('Informe o nome do material.', 'err'); nomeEl.focus(); return; }
  if (isNaN(quantidade) || quantidade < 0) { showToast('Informe uma quantidade válida.', 'err'); qtdEl.focus(); return; }

  btn.disabled = true;
  btn.textContent = 'Salvando…';

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, quantidade })
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const novo = await res.json();
    allItems.push(novo);
    renderRows(allItems);
    updateStats(allItems);

    nomeEl.value = '';
    qtdEl.value  = '';
    showToast(`"${nome}" cadastrado com sucesso.`, 'ok');
  } catch (err) {
    showToast('Erro ao cadastrar. Tente novamente.', 'err');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Cadastrar';
  }
}

async function baixarMaterial(id) {
  const item = allItems.find(i => String(i.id) === String(id));
  const input = document.getElementById('input-retirada');
  const retirada = parseInt(input.value, 10);

  if (!item) return;

  const estoqueAtual = getQuantidade(item);

  if (!validarRetirada(estoqueAtual, retirada)) {
    showToast('Quantidade de retirada inválida.', 'err');
    input.focus();
    return;
  }

  const novaQuantidade = estoqueAtual - retirada;

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: getNome(item),
        quantidade: novaQuantidade
      })
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const atualizado = await res.json();
    allItems = allItems.map(i => String(i.id) === String(id) ? atualizado : i);
    renderRows(allItems);
    updateStats(allItems);

    input.value = '';
    showToast('Baixa realizada com sucesso.', 'ok');
  } catch (err) {
    showToast('Erro ao fazer a baixa.', 'err');
  }
}

async function excluirMaterial(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    allItems = allItems.filter(i => String(i.id) !== String(id));
    renderRows(allItems);
    updateStats(allItems);
    showToast('Material excluído.', 'ok');
  } catch (err) {
    showToast('Erro ao excluir material.', 'err');
  }
}

document.getElementById('btn-cadastrar').addEventListener('click', cadastrarMaterial);

document.getElementById('input-busca').addEventListener('input', function () {
  const q = this.value.toLowerCase();
  const filtered = q ? allItems.filter(i => getNome(i).toLowerCase().includes(q)) : allItems;
  renderRows(filtered);
});

loadMateriais();
