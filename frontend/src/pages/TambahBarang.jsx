import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { getAuth } from '../utils/auth';
import '../styles/TambahBarang.css';

const TambahBarang = () => {
  const navigate = useNavigate(); 
  const [nama_barang, setNamaBarang] = useState('');
  const { token } = getAuth();
  const [stock, setStock] = useState('');
  const [harga, setHarga] = useState('');
  const [foto, setFoto] = useState(null);
  const [error, setError] = useState('');

    useEffect(() => {
      const { token, role } = getAuth();
      if (!token || !role) {
        navigate('/login');
      }
    }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!nama_barang || !stock || !harga || !foto) {
      setError('Semua field wajib diisi');
      return;
    }

    const formData = new FormData();
    formData.append('nama_barang', nama_barang);
    formData.append('stock', stock);
    formData.append('harga', harga);
    formData.append('foto', foto);

    try {
      const response = await fetch('http://localhost:3000/api/barang/', {
        headers: {
        Authorization: `Bearer ${token}`,
      },
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      alert('Barang berhasil ditambahkan!');
      navigate('/'); 

    } catch (err) {
      setError(`Gagal tambah barang: ${err.message}`);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Tambah Barang</h2>
        {error && <div className="login-error">{error}</div>}
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="login-input"
            placeholder="Nama Barang"
            value={nama_barang}
            onChange={(e) => setNamaBarang(e.target.value)}
            required
          />
          <input
            type="number"
            className="login-input"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
          <input
            type="number"
            className="login-input"
            placeholder="Harga"
            value={harga}
            onChange={(e) => setHarga(e.target.value)}
            required
          />
          <input
            type="file"
            className="login-input"
            accept="image/*"
            onChange={(e) => setFoto(e.target.files[0])}
            required
          />
          <button type="submit" className="login-button">Simpan</button>
        </form>
        <button onClick={()=>{
          navigate("/");
        }} className="cancel-button">cancel</button>
      </div>
    </div>
  );
};

export default TambahBarang;
