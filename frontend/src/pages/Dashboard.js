import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import './Dashboard.css'

const Dashboard = () => {
  const [machines, setMachines] = useState([]);
  const navigate = useNavigate();

  // Check for token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      fetchMachines(token);
    }
  }, [navigate]);

  const fetchMachines = (token) => {
    axios
      .get("http://localhost:5000/api/machines", {
        headers: { Authorization: token },
      })
      .then((response) => setMachines(response.data))
      .catch((error) => console.error("Failed to fetch machines:", error));
  };

  const handleAddMachine = () => {
    const name = prompt("Enter machine name:");
    const status = prompt("Enter machine status (e.g., active, inactive):");
    if (name && status) {
      const token = localStorage.getItem("token");
      axios
        .post(
          "http://localhost:5000/api/machines",
          { name, status },
          { headers: { Authorization: token } }
        )
        .then(() => fetchMachines(token))
        .catch((error) => console.error("Failed to add machine:", error));
    }
  };

  const handleDeleteMachine = () => {
    const machineId = prompt("Enter the ID of the machine to delete:");
    if (machineId) {
      const token = localStorage.getItem("token");
      axios
        .delete(`http://localhost:5000/api/machines/${machineId}`, {
          headers: { Authorization: token },
        })
        .then(() => fetchMachines(token))
        .catch((error) => console.error("Failed to delete machine:", error));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Export data to PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Proficy Dashboard Machines", 10, 10);

    const tableData = machines.map((machine) => [
      machine._id,
      machine.name,
      machine.status,
      new Date(machine.lastReport).toLocaleString(),
    ]);

    doc.autoTable({
      head: [["ID", "Name", "Status", "Last Report"]],
      body: tableData,
    });

    doc.save("machines.pdf");
  };

  // Export data to Excel
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      machines.map((machine) => ({
        ID: machine._id,
        Name: machine.name,
        Status: machine.status,
        "Last Report": new Date(machine.lastReport).toLocaleString(),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Machines");

    XLSX.writeFile(workbook, "machines.xlsx");
  };

  return (
    <div>
      <Header onAdd={handleAddMachine} onDelete={handleDeleteMachine} onLogout={handleLogout} />
      <div className="dashboard-container">
        <div className="dashboard-buttons">
          <button onClick={downloadPDF}>Download PDF</button>
          <button onClick={downloadExcel}>Download Excel</button>
        </div>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Status</th>
              <th>Last Report</th>
            </tr>
          </thead>
          <tbody>
            {machines.map((machine) => (
              <tr key={machine._id}>
                <td>{machine._id}</td>
                <td>{machine.name}</td>
                <td>{machine.status}</td>
                <td>{new Date(machine.lastReport).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
