// Demonstração inicial: os produtos abaixo são fictícios.
 // Depois, esta lista poderá ser substituída pelos dados do backend/banco de dados.
const products = [
  { id: 1, name: "Hidratante corporal", info: "Natura SPA · Corpo · Baunilha · 200 ml", stock: 8 },
  { id: 2, name: "Body splash", info: "Cuidados pessoais · Floral · 200 ml", stock: 12 },
  { id: 3, name: "Sabonete líquido", info: "Corpo · Erva-doce · 250 ml", stock: 5 }
];

let movementType = "entrada";
const productSelect = document.getElementById("product");
const quantityInput = document.getElementById("quantity");
const dateInput = document.getElementById("date");
const feedback = document.getElementById("feedback");
const history = [];

function loadProducts() {
  productSelect.innerHTML = products.map(p =>
    `<option value="${p.id}">${p.name}</option>`
  ).join("");
  updatePreview();
}

function selectedProduct() {
  return products.find(p => p.id === Number(productSelect.value));
}

function updatePreview() {
  const product = selectedProduct();
  if (!product) return;
  const quantity = Math.max(0, Number(quantityInput.value) || 0);
  const result = movementType === "entrada"
    ? product.stock + quantity
    : product.stock - quantity;

  document.getElementById("productName").textContent = product.name;
  document.getElementById("productInfo").textContent = product.info;
  document.getElementById("currentStock").textContent = product.stock;
  document.getElementById("movementAmount").textContent = quantity;
  document.getElementById("newStock").textContent = result;
  document.getElementById("stockHint").textContent =
    movementType === "saida" && quantity > product.stock
      ? "Atenção: a quantidade de saída é maior que o estoque disponível."
      : "A quantidade será atualizada após registrar a movimentação.";
  document.getElementById("newStock").style.color =
    result < 0 ? "#b4233d" : "var(--wine)";
}

function setMovementType(type) {
  movementType = type;
  document.getElementById("entryTab").classList.toggle("selected", type === "entrada");
  document.getElementById("exitTab").classList.toggle("selected", type === "saida");
  feedback.textContent = "";
  feedback.className = "feedback";
  updatePreview();
}

function renderHistory() {
  const body = document.getElementById("historyBody");
  document.getElementById("historyCount").textContent =
    `${history.length} ${history.length === 1 ? "registro" : "registros"}`;

  if (!history.length) {
    body.innerHTML = '<tr><td colspan="5" class="empty">Nenhuma movimentação registrada ainda.</td></tr>';
    return;
  }

  body.innerHTML = history.map(item => `
    <tr>
      <td>${item.date}</td>
      <td>${item.product}</td>
      <td class="${item.type === "Entrada" ? "type-in" : "type-out"}">${item.type}</td>
      <td>${item.quantity} un.</td>
      <td>${item.notes || "—"}</td>
    </tr>
  `).join("");
}

document.getElementById("entryTab").addEventListener("click", () => setMovementType("entrada"));
document.getElementById("exitTab").addEventListener("click", () => setMovementType("saida"));
productSelect.addEventListener("change", updatePreview);
quantityInput.addEventListener("input", updatePreview);

document.getElementById("movementForm").addEventListener("submit", event => {
  event.preventDefault();
  const product = selectedProduct();
  const quantity = Number(quantityInput.value);
  const date = dateInput.value;

  if (!product || !Number.isInteger(quantity) || quantity <= 0 || !date) {
    showFeedback("Preencha os campos obrigatórios com valores válidos.", "error");
    return;
  }

  if (movementType === "saida" && quantity > product.stock) {
    showFeedback("Não é possível registrar a saída: estoque insuficiente.", "error");
    return;
  }

  product.stock += movementType === "entrada" ? quantity : -quantity;
  history.unshift({
    date: date.split("-").reverse().join("/"),
    product: product.name,
    type: movementType === "entrada" ? "Entrada" : "Saída",
    quantity,
    notes: document.getElementById("notes").value.trim()
  });

  showFeedback("Movimentação registrada e estoque atualizado!", "success");
  quantityInput.value = "";
  document.getElementById("notes").value = "";
  updatePreview();
  renderHistory();
});

function showFeedback(message, type) {
  feedback.textContent = message;
  feedback.className = `feedback ${type}`;
}

dateInput.value = new Date().toISOString().slice(0, 10);
loadProducts();
renderHistory();
