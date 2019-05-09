module.exports = {
  devServer: {
    proxy: "http://localhost:8080",
    public: "192.168.10.34:8080"
  }
}
