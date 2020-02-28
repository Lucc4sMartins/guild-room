module.exports = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PW,
  database: 'd4q96vhupqp3t0',
  define: {
    timestamps: true,
    underscored: true
  },
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false
    }
  }
}