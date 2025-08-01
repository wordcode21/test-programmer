# Stock Gudang
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