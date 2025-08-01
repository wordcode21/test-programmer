function getDate(req, res, next) {
  const date = new Date();

  const pad = (n) => n.toString().padStart(2, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // bulan mulai dari 0
  const day = pad(date.getDate());

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  req.date = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  next();
}

module.exports = getDate;
