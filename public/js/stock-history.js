async function loadHistory() {
  const date = document.getElementById("historyDate").value;

  if (!date) {
    alert("Please select date");

    return;
  }

  const response = await fetch(`/api/stock/history/date?date=${date}`);

  const result = await response.json();

  console.log("History:", result);

  if (!result.success) {
    alert("Failed to load history");

    return;
  }

  renderHistory(result.data);
}

function renderHistory(data) {
  const container = document.getElementById("historyContainer");

  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML = `
  
          <div class="alert alert-warning">
  
              No stock entered on this date
  
          </div>
  
      `;

    return;
  }

  data.forEach((category) => {
    let categoryTitle = document.createElement("h4");

    categoryTitle.className = "mt-4 mb-3";

    categoryTitle.innerHTML = `Category: ${category.categoryName}`;

    container.appendChild(categoryTitle);

    let table = document.createElement("table");

    table.className = "table table-bordered";

    let thead = document.createElement("thead");

    let tbody = document.createElement("tbody");

    table.appendChild(thead);

    table.appendChild(tbody);

    // Collect all sizes in this category

    let sizeMap = {};

    category.products.forEach((product) => {
      Object.keys(product.sizes).forEach((size) => {
        if (!sizeMap[size]) {
          sizeMap[size] = true;
        }
      });
    });

    let sizes = Object.keys(sizeMap);

    // Header

    let header = `
  
      <tr>
  
          <th>
              Product
          </th>
  
      `;

    sizes.forEach((size) => {
      header += `
  
          <th>
              ${size}
          </th>
  
        `;
    });

    // Add Total column

    header += `
  
          <th>
              Total
          </th>
  
      `;

    header += "</tr>";

    thead.innerHTML = header;

    // Rows

    category.products.forEach((product) => {
      let total = 0;

      sizes.forEach((size) => {
        total += Number(product.sizes[size] ?? 0);
      });

      let row = `
  
        <tr>
  
            <td>
                ${product.productName}
            </td>
  
        `;

      sizes.forEach((size) => {
        row += `
  
            <td>
                ${product.sizes[size] ?? "-"}
            </td>
  
          `;
      });

      // Product total

      row += `
  
            <td>
                <b>${total}</b>
            </td>
  
        `;

      row += "</tr>";

      tbody.innerHTML += row;
    });

    container.appendChild(table);
  });
}
