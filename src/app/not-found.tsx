import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        padding: "120px 20px",
        textAlign: "center",
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F4F2EC",
        color: "#101010",
      }}
    >
      <h2 style={{ fontSize: "3.5rem", fontWeight: "900", marginBottom: "12px" }}>
        404
      </h2>
      <p style={{ fontSize: "1.2rem", color: "#555552", marginBottom: "28px" }}>
        Page Not Found
      </p>
      <Link
        href="/"
        style={{
          background: "#101010",
          color: "#FFFFFF",
          padding: "12px 26px",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: "700",
          fontSize: "0.95rem",
        }}
      >
        Return Home
      </Link>
    </div>
  );
}
