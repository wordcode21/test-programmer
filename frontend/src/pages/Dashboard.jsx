import { useEffect, useState } from "react";
import { getAuth, clearAuth } from "../utils/auth";
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [minStock, setMinStock] = useState("");
  const [sortBy, setSortBy] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const { token } = getAuth();
    if (!token) navigate("/login");

    fetch("http://localhost:3000/api/barang/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson && Array.isArray(resJson.data)) {
          setData(resJson.data);
        } else {
          setData([]);
        }
      });
  }, [navigate]);

  const filteredData = data
    .filter((item) => {
      const nama = item?.nama_barang?.toLowerCase() || "";
      const stok = parseInt(item.stock) || 0;
      const keyword = search.toLowerCase();
      const awalan = filter.toLowerCase();

      return (
        nama.includes(keyword) &&
        nama.startsWith(awalan) &&
        (minStock === "" || stok >= parseInt(minStock))
      );
    })
    .sort((a, b) => {
      if (sortBy === "nama-asc") {
        return a.nama_barang.localeCompare(b.nama_barang);
      } else if (sortBy === "nama-desc") {
        return b.nama_barang.localeCompare(a.nama_barang);
      } else if (sortBy === "stok-asc") {
        return a.stock - b.stock;
      } else if (sortBy === "stok-desc") {
        return b.stock - a.stock;
      }
      return 0;
    });

  return (
    <div>
      <div className="navbar">
        <h2>Stock Gudang</h2>
        <button
          onClick={() => {
            clearAuth();
            navigate('/login');
          }}
        >
          Logout
        </button>
      </div>

      <div className="container">
        <div className="controls">
          <input
            type="text"
            placeholder="Cari barang..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">Semua</option>
            {"abcdefghijklmnopqrstuvwxyz".split("").map((huruf) => (
              <option key={huruf} value={huruf}>
                {huruf.toUpperCase()}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Stok minimal..."
            value={minStock}
            onChange={(e) => setMinStock(e.target.value)}
          />

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="">Sortir</option>
            <option value="nama-asc">Nama A-Z</option>
            <option value="nama-desc">Nama Z-A</option>
            <option value="stok-asc">Stok Terkecil</option>
            <option value="stok-desc">Stok Terbesar</option>
          </select>
        </div>

        {filteredData.length === 0 ? (
          <div className="no-data">
            {data.length === 0 ? "Data barang kosong" : "Tidak ada hasil pencarian"}
          </div>
        ) : (
          <div className="card-list">
            {filteredData.map((item) => (
              <div className="card" key={item.kode_barang} onClick={()=>navigate(`/barang/${item.kode_barang}`)}>
                <img src={item.foto} alt={item.nama_barang} />
                <div className="card-content">
                  <h3>{item.nama_barang}</h3>
                  <p>Stok: {item.stock}</p>
                  <p>Harga: Rp {item.harga.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
