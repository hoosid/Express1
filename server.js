
const express = require("express");
const app = express();
const port = 3000;
const mysql = require('mysql');
const path = require('path');
var cookieParser = require('cookie-parser');

// middle well
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser())
// connection database
const pool =mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "pfe",
});


  app.get("/home",(req,res)=>{

  res.render("home")
    });

    // login
    app.get("/login", (req, res) => {
      
      res.render("login/login");
    });
    
    app.post("/login", (req, res) => {
     
      var user1 = req.body.user;
      var pass1 = req.body.password;

      var sql = "SELECT * FROM sign_up WHERE user = ? OR email = ?";
      pool.query(sql, [user1, user1], (error, results) => {
        if (error) {
          console.error("Erreur lors de la récupération des données de connexion : ", error);
          res.status(500).send("Une erreur s'est produite lors de la connexion");
        } else {
          if (results.length > 0) {
            var user = results[0].user;
            var email = results[0].email;
            var pass = results[0].password1;
    
            if (pass1 === pass) {
             
              
              res.redirect("/home2?user=" + user);
            } else {
              res.send("Mot de passe incorrect");
              
            }
          } else {
            res.send("Nom d'utilisateur ou email incorrect");
           
          }
        }
      });
    });

    app.get("/home2", (req, res) => {
      const userCookie = req.cookies.user; // Récupère la valeur du cookie "user"
      const userQuery = req.query.user; // Récupère la valeur du paramètre "user" dans la requête
      const user = userCookie || userQuery; // Utilise la valeur du cookie ou du paramètre
      res.render("home2", { user: user });
    });
    

  // sign-up
  app.get("/sign-up", (req, res) => {
    res.render("sign-up");
  });
  
  app.post("/sign-up", (req, res) => {
    var user = req.body.user;
    var email = req.body.email;
    var date = req.body.dob;
    var pass1 = req.body.password1;
    var pass2 = req.body.password2;
    // var gender = req.body.gender;
    var sec = req.body.sec;
    // var image =req.body.image;
    if (pass1 === pass2) {
      var sql = "INSERT INTO sign_up (user, email, date_ness, password1) VALUES (?, ?, ?, ?)";
  
      pool.query(sql, [user, email, date, pass1], (error, results) => {
        if (error) {
          console.error("Il y a une erreur : ", error);
          res.status(500).send("Erreur lors de l'inscription");
        } else {
          res.redirect("/login");
        }
      });
    } else {
      // res.send("Erreur de mot de passe");
       res.redirect("/sign-up")
    }
  });
  
app.listen(port ,()=>{
console.log("hello sidaxe"+":) "+port);
})
