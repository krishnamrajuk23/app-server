
 req.session.userId = user.id;

Behind the scenes
-------------------------------------------
What every we story session to send to redis in this case
{userId: 1} -> send that to redis

Step 1:::::::
------------------
how redis work which is key value store which mean key look ups for value
some thing like ex "->" (mapped to {userId: 1})
    sess:qwefslo32 -> {userId: 1}

if i give this key (sess:qwefslo32) it will give value {userId: 1}

Step 2::::::
------------------
express session will set a cookie in my browser some thing like example qwefwioiew242sdce3sss

this cookie value "qwefwioiew242sdce3sss" is the signed version of ("sess:qwefslo32") key in redis

Step 3::::::
------------------
when user makes a request  "qwefwioiew242sdce3sss" this value -> send to the server

Step 4::::::
------------------
When server receive a signed version ("qwefwioiew242sdce3sss")  -
this will be going to covert as redis key reference ("sess:qwefslo32") by using "secret" key configured in index.ts file

its going to decrypt cookie to redis key as mention above
"qwefwioiew242sdce3sss" -> "sess:qwefslo32"

Step 5:::::::
----------------
It makes a request to redis with this key ("sess:qwefslo32") to get value
"sess:qwefslo32" -> {userId: 1}

this going to store in 
req.session  = {userId: 1}



