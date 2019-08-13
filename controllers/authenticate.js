module.exports = {
  login: (req, res) => {
    console.log(`Form received: ${req.body.email}`);
    UserModel.findOne({email:req.body,email},(err,user) =>  {
      if(err) throw err;
      if(!user){
        res.json()
      }
    })
  }
}