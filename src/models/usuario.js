class Usuario {
  constructor(id, username, email, password, isAdmin = false) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.isAdmin = isAdmin; //agregamos este parametro
  }
}

module.exports = Usuario;
