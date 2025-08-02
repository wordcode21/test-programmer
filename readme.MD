# Stock Gudang
website stock gudang ini menggunakan teknologi docker compose sebagai kointainer untuk database mysql,
express js untuk backend nya dan react js untuk frontend nya. pada bagian backend menggunkan bcrypt untuk mengubah password menjadi hash, dan jwt(json web token) untuk membuat token yang digunakan untuk login. Setelah itu juga terdapat multer yang digunakan untuk file upload. Untuk frontend menambahkan library react-router-dom untuk membuat route dari website.
## structure directory
```
project-root/
├── backend
├── frontend
└── readme.MD
```

# backend

## structure directory
```
backend/
├── middleware
├── routes
├── uploads
├── .env
├── package.json
├── index.js
├── docker-compose.yaml
├── backup.sql
└── (folder dan file lainnya)
```

## Catatan
untuk menjalankan command yang ada di backend masuk terlebih dahulu ke directory backend

## Cara build container untuk database mysql
```bash
#Di dalam directory backend
docker compose up -d 
```
keterangan :
-d = detach (berjalan di latar belakang);

## Cara menjalankan container untuk database mysql
```bash
#Di dalam directory backend
docker compose start
```

## Cara menghentikan container untuk database mysql
```bash
#Di dalam directory backend
docker compose stop
```

## Cara menghancurkan container untuk database mysql
```bash
#Di dalam directory backend
docker compose down
```
tambahkan -v untuk menghapus volume

## cara backup database di docker compose
```bash
#Di dalam directory backend
docker exec -i stockgudang-db mysqldump -u root -p  --no-tablespaces --databases stockgudang > backup.sql
```

## cara menjalankan express js
```bash
#Di dalam directory backend
yarn #jika baru clone
yarn dev
```

# Frontend

## file structure 
```
frontend/
├── src
|   ├── pages
|   ├── styles
|   ├── utils
|   ├── App.jsx
|   ├── main.jsx
|   ├── index.css
|   ├── App.css
|   ├── (folder dan file lain)
└── (folder dan file lainnya)
```

## Cara menjalankan frontend
untuk menjalakan frontend kalian harus masuk ke dirctory frontend dan menjalankan command:
```
yarn dev #jika kalian ingin menjalakan di development
yarn build #untuk build react web app
```

## kridensial
### kridensial ini ada di database(di repo ada di backup.sql)
admin:
```
email: aab@gmail.com
password: test123
````
user:
```
email: aa@gmail.com
password: test123
```