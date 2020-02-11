const conn = require("../db/db");

//User Schema
const followsSchema = `CREATE TABLE IF NOT EXISTS follows (
    id serial primary key,
    follower_id integer ,
    followed_id integer
    );`

conn.query(followsSchema, (err, data) => {
    if (err) console.error(err);
    else console.log("follows table is working")
})

/*
select u.id, u.name, u.username, u.photo, p.post, p.link , p.type , p.created_at
  from users As u JOIN posts AS p ON u.id = p.user_id;

*/
//User functionality
function getfollowersInfo() {
    return conn.query(`select users.id, users.name, users.username, users.photo, follows.follower_id from users  JOIN follows on followed_id = users.id;`)
}
//select users.id, users.name, users.username, users.photo, follows.followed_id from users  JOIN follows on follower_id = users.id;
function getfollowers(followed_id) {
    return conn.query(`SELECT * FROM follows WHERE followed_id = $1`, [followed_id])
}

function getfollowingList() {
    return conn.query(`select users.id, users.name, users.username, users.photo, follows.followed_id from users  JOIN follows on follower_id = users.id;;`)
}


function follow(follower_id, followed_id) {
    return conn.query(`INSERT into follows(follower_id, followed_id) VALUES($1, $2)`, [follower_id, followed_id])
}


function unfollow(follower_id, followed_id) {

    return conn.query(`DELETE FROM follows WHERE follower_id =  '${follower_id}' AND followed_id =  '${followed_id}'`)
}


module.exports.getfollowres = getfollowers;
module.exports.follow = follow;
module.exports.unfollow = unfollow;

module.exports.getfollowersInfo = getfollowersInfo;
module.exports.getfollowingList = getfollowingList;
