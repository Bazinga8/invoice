let products = [];
let totalAmount = 0;

function addProduct() {
  const name = document.getElementById('productName').value;
  const quantity = parseInt(document.getElementById('productQuantity').value);
  const price = parseFloat(document.getElementById('productPrice').value);

  if (!name || !quantity || !price) {
    alert('يرجى إدخال جميع البيانات');
    return;
  }

  const total = quantity * price;
  products.push({ name, quantity, price, total });
  totalAmount += total;

  updateTable();
  document.getElementById('productName').value = '';
  document.getElementById('productQuantity').value = '';
  document.getElementById('productPrice').value = '';
}

function updateTable() {
  const tbody = document.getElementById('invoiceTable').querySelector('tbody');
  tbody.innerHTML = '';
  products.forEach((product, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${product.name}</td>
      <td>${product.quantity}</td>
      <td>${product.price.toFixed(2)}</td>
      <td>${product.total.toFixed(2)}</td>
      <td class="remove-btn"><span onclick="removeProduct(${index})">حذف</span></td>
    `;
    tbody.appendChild(row);
  });

  document.getElementById('totalAmount').innerText = totalAmount.toFixed(2);
}

function removeProduct(index) {
  totalAmount -= products[index].total;
  products.splice(index, 1);
  updateTable();
}

function generatePDF() {
  const invoiceNumber = document.getElementById('invoiceNumber').value;
  const invoiceDate = document.getElementById('invoiceDate').value;
  const toField = document.getElementById('toField').value;

  if (!invoiceNumber || !invoiceDate || !toField) {
    alert('يرجى إدخال رقم الفاتورة والتاريخ والمستلم');
    return;
  }

  document.getElementById('invoiceNum').innerText = invoiceNumber;
  document.getElementById('invoiceDateDisplay').innerText = invoiceDate;
  document.getElementById('toFieldDisplay').innerText = toField;

  const removeButtons = document.querySelectorAll('.remove-btn');
  const removeHeader = document.querySelector('th:last-child');
  removeButtons.forEach(btn => (btn.style.display = 'none'));
  if (removeHeader) removeHeader.style.display = 'none';

  const element = document.getElementById('invoice');
  html2pdf()
    .from(element)
    .set({
      margin: 0,
      filename: `invoice-${invoiceNumber}.pdf`,
      html2canvas: { scale: 3, scrollY: 0 },
      jsPDF: { format: 'a4', orientation: 'portrait' },
    })
    .save()
    .then(() => {
      removeButtons.forEach(btn => (btn.style.display = 'table-cell'));
      if (removeHeader) removeHeader.style.display = 'table-cell';
    });
}
