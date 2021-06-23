const jwt = require('jsonwebtoken');

app.get('/confirmation/:token', async function(req, res){
    const data = jwt.verify(req.params.token, process.env.TOKEN_SECRET, function(err, decode){
        if (err) throw err;
        res.send(decode.username);
    });
})