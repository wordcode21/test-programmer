const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole');
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require('../db')
const getKodeBarang = require('../middleware/getKodeBarang');
const getDate = require('../middleware/getDate');

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"./uploads");
    },
    filename: function(req,file,cb){
        cb(null,Date.now()+path.extname(file.originalname));
    }
});

const fileFilter = (req,file,cb)=>{
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
      } else {
        return cb(new Error('Only images are allowed'));
      }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});


router.get('/barang', verifyToken, checkRole({allowedRoles: ["admin","user"]}), (req, res) => {
  const query= "select * from barang";
  db.query(query,(err,result)=>{
    if(err){
      res.status(500).json({message: `${err}`});
      return;
    }
    if(result.length>0){
      const baseUrl = "http://localhost:3000/";
      result.forEach(item=>{
        if(item.foto != null){
          item.foto = baseUrl + item.foto;
        };
      })
    }
    res.status(200).json({data:result})
  });
});

router.get('/barang/:kodeBarang', verifyToken, checkRole({allowedRoles: ["admin","user"]}), (req, res) => {
  const kodeBarang = req.params.kodeBarang;
  const query= "select * from barang where kode_barang = ?";
  db.query(query,[kodeBarang],(err,result)=>{
    if(err){
      res.status(500).json({message: `${err}`});
      return;
    }
    if(result.length>0){
      const baseUrl = "http://localhost:3000/";
      result.forEach(item=>{
        if(item.foto != null){
          item.foto = baseUrl + item.foto;
        };
      })
    }
    res.status(200).json({data: result})
  });
});

router.post('/barang',verifyToken,checkRole({allowedRoles: ['admin']}),getKodeBarang,getDate,upload.single("foto"),(req,res)=>{
    if(!req.file){
        return res.status(400).json({status: 400, message: "No file upload or file upload is not an image"});
    }
    let filePath = path.normalize(req.file.path);
    filePath = filePath.replace(/\\/g, '/');
    const { nama_barang, stock, harga} = req.body;
    const kodeBarang = req.kodeBarang;
    const date = req.date;
    if(!nama_barang || !stock || !harga){
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            }
            console.log('File deleted successfully');
        });
        return res.status(400).json({status: 400, message: "All Parameter must be filled"});
    }
    const query = 'insert into barang (kode_barang,nama_barang,stock,harga,foto,created_at,updated_at) values(?,?,?,?,?,?,?)';
    db.query(query,[kodeBarang,nama_barang,parseInt(stock),parseInt(harga),filePath,date,date],(err,result)=>{
      if (err){
        fs.unlink(filePath, (err) => {
          if (err) {
              console.error('Error deleting file:', err);
          }
          console.log('File deleted successfully');
        });
        console.log(err);
        res.status(500).json({message: "Database eror"});
        return;
      };
      res.status(201).json({status: 201, message: 'Product added successfully' });
    })
});

router.patch('/barang',verifyToken,checkRole({allowedRoles: ['admin']}),getDate,(req,res)=>{
  const {kode_barang,stock,harga} = req.body;
  if(!kode_barang){
    return res.status(400).json({status:400, message:"bad request"})
  }
  const stockInt = parseInt(stock);
  const hargaInt = parseInt(harga);
  const date = req.date;
      if(stock && harga){
        const query = "update barang set stock = ?, harga = ?, updated_at=? where kode_barang = ?";
        db.query(query,[stockInt,hargaInt,date,kode_barang],(err,result)=>{
            if(err){
                return res.json({message: err});
            }
            return res.json({status: 200,data: "Stok Berhasil di update"});
        });
    }else if(stock){
        const query = "update barang set stock = ?, updated_at=?  where kode_barang = ?";
        db.query(query,[stockInt,date,kode_barang],(err,result)=>{
            if(err){
                return res.json({message: err});
            }
            return res.json({status: 200,data: "Stok Berhasil di update"});
        });
    }else if(harga){
        const query = "update barang set harga = ?,updated_at=?  where kode_barang = ?";
        db.query(query,[hargaInt,date,kode_barang],(err,result)=>{
            if(err){
                return res.json({message: err});
            }
            return res.json({status: 200,data: "Stok Berhasil di update"});
        });
    }else{
        return res.status(400).json({status: 400, message: "failed to update"})
    }
});

router.delete('/barang',verifyToken,checkRole({allowedRoles: ['admin']}),(req,res)=>{
  const {kode_barang} = req.body;
    const query = "select * from barang where kode_barang = ?";
    const query1 = "delete from  barang where kode_barang = ?";
    db.query(query,[kode_barang],(err,result)=>{
        if(err){
            return res.status(500).json({status: 500, message: err});
        }
        if(result.length === 0){
            return res.status(404).json({status: 404, message: "Data tidak ditemukan"});
        }
        const foto = result[0].foto; 
        db.query(query1,[kode_barang],(err,result)=>{
            if(err){
                return res.status(500).json({status: 500, message: err});
            }
            fs.unlink(foto,(err)=>{
                if (err) {
                    console.error('Error deleting file:', err);
                    return res.status(500).json({ status: 500, message: "Error deleting file" });
                }
                console.log('File deleted successfully');
            });
            res.json({status:200, message: "file deleted successfully"});
        });
    });
});

module.exports = router;
