import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuth } from "../utils/auth";
import "../styles/Barang.css";

const Barang = () => {
  const { kode_barang } = useParams();
  const [barang, setBarang] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const { token } = getAuth();
    if (!token) return navigate("/login");

    fetch(`http://localhost:3000/api/barang/${kode_barang}`, {
      headers: {
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

return (
    <div>
      <div className="navbar">
        <h2 onClick={()=>{
            navigate("/test-programmer/dashboard")
        }}>Stock Gudang</h2>
        <button
          onClick={() => {
            clearAuth();
            navigate('/test-programmer/login');
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
            <button className="detail-back-btn" onClick={()=>{
                navigate("/test-programmer/dashboard");
            }}>Kembali ke dashboard</button>
            </div>
        </div>
    </div>
);

};

export default Barang;
