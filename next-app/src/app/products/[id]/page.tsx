import React from "react";
import { notFound } from "next/navigation";
import AddToCartButton from "./AddToCartButton";

async function getProduct(id: string) {
  const res = await fetch(`https://errix-originals.onrender.com/api/products`);
  if (!res.ok) return null;
  const products = await res.json();
  return products.find((p: any) => String(p.id) === id) || null;
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) return notFound();

  return (
    <main style={{ maxWidth: 800, margin: "4rem auto", padding: 24, background: "rgba(255,255,255,0.05)", borderRadius: 16 }}>
      <a href="/products" style={{ color: "#fff", textDecoration: "underline", marginBottom: 24, display: "inline-block" }}>
        <i className="fas fa-arrow-left"></i> Back to Products
      </a>
      <div style={{ display: "flex", gap: 32, alignItems: "center", flexWrap: "wrap" }}>
        <img
          src={product.image && product.image.startsWith("http") ? product.image : `https://errix-originals.onrender.com/uploads/${product.image}`}
          alt={product.name}
          style={{ width: 280, height: 280, objectFit: "cover", borderRadius: 16 }}
        />
        <div>
          <h1 style={{ fontSize: "2.5rem", color: "#fff", marginBottom: 16 }}>{product.name}</h1>
          <p style={{ fontSize: "1.5rem", color: "#fff", fontWeight: 700, marginBottom: 16 }}>₦{product.price}</p>
          <p style={{ color: "#fff", marginBottom: 24 }}>{product.description}</p>
          <AddToCartButton id={product.id} name={product.name} price={product.price} image={product.image} />
        </div>
      </div>
    </main>
  );
} 