import React from "react";
import './Header.css';


const Header = ({ onAdd, onDelete, onLogout }) => {
  return (
    <header style={{ display: "flex", justifyContent: "space-between", padding: "10px", backgroundColor: "#f4f4f4" }}>
      <h1>Proficy Dashboard</h1>
      <div>
        <button onClick={onAdd} style={{ marginRight: "10px" }}>Add Machine</button>
        <button onClick={onDelete} style={{ marginRight: "10px" }}>Delete Machine</button>
        <button onClick={onLogout}>Logout</button>
      </div>
    </header>
  );
};

export default Header;
