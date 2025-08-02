import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuth } from "../utils/auth";
import '../styles/UpdateBarang.css';

function UpdateBarang() {
  const { kode_barang } = useParams();
  const navigate = useNavigate();
  const { token } = getAuth();

  const [barang, setBarang] = useState({
    nama_barang: "",
    stock: "",
    harga: "",
  });

  useEffect(() => {
    fetch(`http://localhost:3000/api/barang/${kode_barang}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const b = data.data[0];
        setBarang({
          nama_barang: b.nama_barang || "",
          stock: b.stock || "",
          harga: b.harga || "",
        });
      });
  }, [kode_barang, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBarang((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updateData = {kode_barang:kode_barang};
    if (barang.nama_barang) updateData.nama_barang = barang.nama_barang;
    if (barang.stock) updateData.stock = parseInt(barang.stock);
    if (barang.harga) updateData.harga = parseInt(barang.harga);
    console.log(updateData);

    fetch(`http://localhost:3000/api/barang/`, {
      method: "PATCH", // gunakan PATCH karena bisa sebagian field
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        alert("✅ " + data.data); // alert berhasil
        navigate("/"); // redirect ke halaman utama
      })
      .catch((err) => {
        alert(" Gagal update barang");
        console.error(err);
      });
  };

    return (
    <div className="update-container">
      <div className="update-card">
        <h2 className="update-title">Update Barang {kode_barang}</h2>
        <form className="update-form" onSubmit={handleSubmit}>
          <input
            name="nama_barang"
            value={barang.nama_barang}
            onChange={handleChange}
            placeholder="Nama Barang"
            className="update-input"
          />
          <input
            name="stock"
            value={barang.stock}
            onChange={handleChange}
            placeholder="Stock"
            type="number"
            className="update-input"
          />
          <input
            name="harga"
            value={barang.harga}
            onChange={handleChange}
            placeholder="Harga"
            type="number"
            className="update-input"
          />
          <button type="submit" className="update-button">Update</button>
        </form>
        <button onClick={()=>{
          navigate("/");
        }} className="cancel-button">cancel</button>
      </div>
    </div>
  );
}


export default UpdateBarang;
