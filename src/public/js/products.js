let cartId;

window.addEventListener("load", (event) => {
  const searchParams = new URLSearchParams(window.location.search);
  const page = searchParams.get("page") || null;
  fetch(`/api/products${page ? `?page=${page}` : ""}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  })
    .then((result) => result.json())
    .then((res) => loadProducts(res));
  cartId = localStorage.getItem("cartId");
});

const submitForm = () => {
  const title = document.getElementById("prd_title").value;
  const description = document.getElementById("prd_description").value;
  const price = document.getElementById("prd_price").value;
  const thumbnail = document.getElementById("prd_thumbnail").value;
  const code = document.getElementById("prd_code").value;
  const stock = document.getElementById("prd_stock").value;
  const category = document.getElementById("prd_category").value;
  fetch(`/api/products`, {
    method: "POST",
    body: JSON.stringify({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  }).then(() => location.reload());
};

const loadProducts = (response) => {
  const pagesContainer = document.getElementById("product_pages");
  for (let page = 1; page <= response.totalPages; page++) {
    pagesContainer.innerHTML += `<a href="/products?page=${page}">${page}</a>`;
  }
  const container = document.getElementById("product_container");
  response.docs.forEach((prd) => {
    container.innerHTML += `
        <tr>
        <td>${prd.title}</td>
        <td>${prd.price}</td>
        <td>${prd.status}</td>
        <td>${prd.code}</td>
        <td>${prd.stock}</td>
        <td>${prd.category}</td>
        <td><button onClick="addProduct('${prd._id}')" >add to cart</button>
        <button onClick="deleteProduct('${prd._id}')">delete</button></td>
        </tr>
        `;
  });
};

const addProduct = (prdId) => {
  fetch(`/api/carts/${cartId}/product/${prdId}?amount=1`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  }).then((result) => console.log(result));
};

const deleteProduct = (prdId) => {
  fetch(`/api/products/${prdId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  }).then(() => location.reload());
};
