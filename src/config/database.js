module.exports = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_NAME,
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