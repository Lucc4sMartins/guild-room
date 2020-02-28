module.exports = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PW,
  database: 'guild-room',
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