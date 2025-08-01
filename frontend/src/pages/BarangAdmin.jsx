import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuth } from "../utils/auth";
import "../styles/Barang.css";

const BarangAdmin = () => {
  const { kode_barang } = useParams();
  const [barang, setBarang] = useState([]);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { token } = getAuth();

  useEffect(() => {
    const { token } = getAuth();
    if (!token) return navigate("/login");

    fetch(`http://localhost:3000/api/barang/${kode_barang}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((resJson) => {
        console.log("API Response:", resJson.data[0]);
        if (resJson && resJson.data) {
          setBarang(resJson.data[0]);
        } else {
          setBarang([]);
        }
      });
  }, [kode_barang, navigate]);

  if (!barang) {
    return (
      <div className="detail-container">
        <p>Memuat data barang...</p>
      </div>
    );
  }

  const handleDelete = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:3000/api/barang/', {
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
        method: 'DELETE',
        body: JSON.stringify({kode_barang}),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      alert('Barang berhasil dihapus!');
      navigate('/'); 

    } catch (err) {
      alert('Barang gagal dihapus!');
      setError(`Gagal hapus barang: ${err.message}`);
    }
  };


return (
    <div>
      <div className="navbar">
        <h2 onClick={()=>{
            navigate("/dashboard")
        }}>Stock Gudang</h2>
        <button
          onClick={() => {
            clearAuth();
            navigate('/login');
          }}
        >
          Logout
        </button>
      </div>
        <div className="detail-container">
            <img src={barang.foto} alt={barang.nama_barang} className="detail-img" />
            <div className="detail-info">
            <h2>{barang.nama_barang}</h2>
            <p><strong>Kode:</strong> {barang.kode_barang}</p>
            <p><strong>Stok:</strong> {barang.stock}</p>
            <p><strong>Harga:</strong> Rp {Number(barang.harga).toLocaleString()}</p>
            <button className="update-btn" onClick={()=>{
                navigate(`/update-barang/${barang.kode_barang}`);
            }}>Edit Item</button>
            <button className="delete-btn" onClick={handleDelete}>Delete Item</button>
            <button className="detail-back-btn" onClick={()=>{
                navigate("/");
            }}>Kembali ke dashboard</button>
            </div>
        </div>
    </div>
);

};

export default BarangAdmin;
