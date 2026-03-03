import { useState, useEffect } from "react";
import axios from "axios";
import cookies from "js-cookie";

const API_BASE_URL = "http://localhost:8000/api/v1";

const getAuthConfig = () => {
  const jwtToken = cookies.get("vehicleServiceToken");
  if (!jwtToken) return null;
  return { headers: { Authorization: `Bearer ${jwtToken}` } };
};

export default function InventoryCard() {
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({
    productName: "",
    productNo: "",
    type: "",
    price: "",
    quantity: "",
  });
  const [productUpdate, setProductUpdate] = useState({
    productId: "",
    productName: "",
    productNo: "",
    type: "",
    price: "",
  });
  const [productInc, setProductInc] = useState({ productId: "", quantity: "" });
  const [productDec, setProductDec] = useState({ productId: "", quantity: "" });
  const [productDeleteId, setProductDeleteId] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const resetMessages = () => {
    setActionMessage("");
    setActionError("");
  };

  const refreshProducts = async () => {
    const config = getAuthConfig();
    if (!config) return;
    const res = await axios.get(`${API_BASE_URL}/inventory/allProduct`, config);
    setProducts(res?.data?.data || []);
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  const onAddProduct = async (e) => {
    e.preventDefault();
    resetMessages();
    try {
      const config = getAuthConfig();
      await axios.post(
        `${API_BASE_URL}/inventory/addProduct`,
        {
          productName: productForm.productName,
          productNo: productForm.productNo,
          type: productForm.type,
          price: Number(productForm.price),
          quantity: Number(productForm.quantity),
        },
        config,
      );
      setActionMessage("Product added.");
      setProductForm({
        productName: "",
        productNo: "",
        type: "",
        price: "",
        quantity: "",
      });
      await refreshProducts();
    } catch (err) {
      setActionError(err?.response?.data?.message || "Failed to add product.");
    }
  };

  const onUpdateProduct = async (e) => {
    e.preventDefault();
    resetMessages();
    try {
      const config = getAuthConfig();
      const payload = {};
      if (productUpdate.productName)
        payload.productName = productUpdate.productName;
      if (productUpdate.productNo) payload.productNo = productUpdate.productNo;
      if (productUpdate.type) payload.type = productUpdate.type;
      if (productUpdate.price !== "")
        payload.price = Number(productUpdate.price);
      await axios.patch(
        `${API_BASE_URL}/inventory/updateProduct/${productUpdate.productId}`,
        payload,
        config,
      );
      setActionMessage("Product updated.");
      setProductUpdate({
        productId: "",
        productName: "",
        productNo: "",
        type: "",
        price: "",
      });
      await refreshProducts();
    } catch (err) {
      setActionError(
        err?.response?.data?.message || "Failed to update product.",
      );
    }
  };

  const onIncProductQty = async (e) => {
    e.preventDefault();
    resetMessages();
    try {
      const config = getAuthConfig();
      await axios.patch(
        `${API_BASE_URL}/inventory/incproduct/${productInc.productId}`,
        { quantity: Number(productInc.quantity) },
        config,
      );
      setActionMessage("Quantity increased.");
      setProductInc({ productId: "", quantity: "" });
      await refreshProducts();
    } catch (err) {
      setActionError(
        err?.response?.data?.message || "Failed to increase quantity.",
      );
    }
  };

  const onDecProductQty = async (e) => {
    e.preventDefault();
    resetMessages();
    try {
      const config = getAuthConfig();
      await axios.patch(
        `${API_BASE_URL}/inventory/decproduct/${productDec.productId}`,
        { quantity: Number(productDec.quantity) },
        config,
      );
      setActionMessage("Quantity decreased.");
      setProductDec({ productId: "", quantity: "" });
      await refreshProducts();
    } catch (err) {
      setActionError(
        err?.response?.data?.message || "Failed to decrease quantity.",
      );
    }
  };

  const onDeleteProduct = async (e) => {
    e.preventDefault();
    resetMessages();
    try {
      const config = getAuthConfig();
      await axios.delete(
        `${API_BASE_URL}/inventory/deleteProduct/${productDeleteId}`,
        { ...config },
      );
      setActionMessage("Product deleted.");
      setProductDeleteId("");
      await refreshProducts();
    } catch (err) {
      setActionError(
        err?.response?.data?.message || "Failed to delete product.",
      );
    }
  };

  return (
    <div className="panel">
      {(actionMessage || actionError) && (
        <div className="action-banner">
          {actionMessage && <p className="action-success">{actionMessage}</p>}
          {actionError && <p className="action-error">{actionError}</p>}
        </div>
      )}

      <div className="card">
        <h3>All Products</h3>
        <div className="list">
          {products.length ? (
            products.map((p) => (
              <div className="list-row" key={p._id}>
                <span className="list-title">{p.productName}</span>
                <span className="list-meta">
                  {p.productNo} | {p.type} | ₹{p.price} | Qty: {p.quantity}
                </span>
              </div>
            ))
          ) : (
            <p className="muted">No products found.</p>
          )}
        </div>
        <div className="card-actions">
          <button className="button" type="button" onClick={refreshProducts}>
            Refresh
          </button>
        </div>
      </div>

      <div className="panel-grid">
        <form className="card" onSubmit={onAddProduct}>
          <h3>Add Product</h3>
          <div className="form-row">
            <label>Product Name</label>
            <input
              className="text-input"
              value={productForm.productName}
              onChange={(e) =>
                setProductForm((p) => ({ ...p, productName: e.target.value }))
              }
              required
            />
          </div>
          <div className="form-row">
            <label>Product No</label>
            <input
              className="text-input"
              value={productForm.productNo}
              onChange={(e) =>
                setProductForm((p) => ({ ...p, productNo: e.target.value }))
              }
              required
            />
          </div>
          <div className="form-row">
            <label>Type</label>
            <input
              className="text-input"
              value={productForm.type}
              onChange={(e) =>
                setProductForm((p) => ({ ...p, type: e.target.value }))
              }
              required
            />
          </div>
          <div className="form-row">
            <label>Price</label>
            <input
              className="text-input"
              type="number"
              min="0"
              value={productForm.price}
              onChange={(e) =>
                setProductForm((p) => ({ ...p, price: e.target.value }))
              }
              required
            />
          </div>
          <div className="form-row">
            <label>Quantity</label>
            <input
              className="text-input"
              type="number"
              min="0"
              value={productForm.quantity}
              onChange={(e) =>
                setProductForm((p) => ({ ...p, quantity: e.target.value }))
              }
              required
            />
          </div>
          <button className="button" type="submit">
            Add
          </button>
        </form>

        <form className="card" onSubmit={onUpdateProduct}>
          <h3>Update Product</h3>
          <div className="form-row">
            <label>Select Product</label>
            <select
              className="text-input"
              value={productUpdate.productId}
              onChange={(e) =>
                setProductUpdate((p) => ({ ...p, productId: e.target.value }))
              }
              required
            >
              <option value="">-- select --</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.productName} ({p.productNo})
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <label>Product Name (optional)</label>
            <input
              className="text-input"
              value={productUpdate.productName}
              onChange={(e) =>
                setProductUpdate((p) => ({ ...p, productName: e.target.value }))
              }
            />
          </div>
          <div className="form-row">
            <label>Product No (optional)</label>
            <input
              className="text-input"
              value={productUpdate.productNo}
              onChange={(e) =>
                setProductUpdate((p) => ({ ...p, productNo: e.target.value }))
              }
            />
          </div>
          <div className="form-row">
            <label>Type (optional)</label>
            <input
              className="text-input"
              value={productUpdate.type}
              onChange={(e) =>
                setProductUpdate((p) => ({ ...p, type: e.target.value }))
              }
            />
          </div>
          <div className="form-row">
            <label>Price (optional)</label>
            <input
              className="text-input"
              type="number"
              min="0"
              value={productUpdate.price}
              onChange={(e) =>
                setProductUpdate((p) => ({ ...p, price: e.target.value }))
              }
            />
          </div>
          <button className="button" type="submit">
            Update
          </button>
        </form>

        <form className="card" onSubmit={onIncProductQty}>
          <h3>Increase Quantity</h3>
          <div className="form-row">
            <label>Select Product</label>
            <select
              className="text-input"
              value={productInc.productId}
              onChange={(e) =>
                setProductInc((p) => ({ ...p, productId: e.target.value }))
              }
              required
            >
              <option value="">-- select --</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.productName}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <label>Quantity</label>
            <input
              className="text-input"
              type="number"
              min="1"
              value={productInc.quantity}
              onChange={(e) =>
                setProductInc((p) => ({ ...p, quantity: e.target.value }))
              }
              required
            />
          </div>
          <button className="button" type="submit">
            Increase
          </button>
        </form>

        <form className="card" onSubmit={onDecProductQty}>
          <h3>Decrease Quantity</h3>
          <div className="form-row">
            <label>Select Product</label>
            <select
              className="text-input"
              value={productDec.productId}
              onChange={(e) =>
                setProductDec((p) => ({ ...p, productId: e.target.value }))
              }
              required
            >
              <option value="">-- select --</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.productName}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <label>Quantity</label>
            <input
              className="text-input"
              type="number"
              min="1"
              value={productDec.quantity}
              onChange={(e) =>
                setProductDec((p) => ({ ...p, quantity: e.target.value }))
              }
              required
            />
          </div>
          <button className="button" type="submit">
            Decrease
          </button>
        </form>

        <form
          className="card"
          style={{ borderTop: "3px solid #dc2626" }}
          onSubmit={onDeleteProduct}
        >
          <h3 style={{ color: "#dc2626" }}>Delete Product</h3>
          <div className="form-row">
            <label>Select Product</label>
            <select
              className="text-input"
              value={productDeleteId}
              onChange={(e) => setProductDeleteId(e.target.value)}
              required
            >
              <option value="">-- select --</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.productName} ({p.productNo})
                </option>
              ))}
            </select>
          </div>
          <button className="button danger" type="submit">
            Delete
          </button>
        </form>
      </div>
    </div>
  );
}
