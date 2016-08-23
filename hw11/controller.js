var Controller = {
    musicRoute: function() {
        return Model.getMusic().then(function(music) {
            results.innerHTML = View.render('music', {list: music});
        });
    },
    friendsRoute: function() {
        return Model.getFriends().then(function(friends) {
            results.innerHTML = View.render('friends', {list: friends});
        });
    },
    newsRoute: function() {
        return Model.getNews().then(function(news) {
            results.innerHTML = View.render('news', {list: news.items});
        });
    },
    groupsRoute: function() {
        return Model.getGroups().then(function(groups) {
            results.innerHTML = View.render('groups', {list: groups.items});
        });
    },
    photosRoute: function() {
        return Model.getPhotos().then(
            function(photos) {

            Promise.all(photos.items.map((current, index, array)=>{
                return new Promise(function (resolve, reject) {
                    Model.getComments(array[index].id).then(function (comments) {
                        let photo = array[index],
                            user = {};
                        for (let i = 0; i < comments.profiles.length; i++) {
                            let profile = comments.profiles[i];
                            user[profile.id] = {
                                photo_100: profile.photo_100,
                                name: [profile.first_name, profile.last_name].join(" "),
                            }
                        }
                        for (let i = 0; i < comments.items.length; i++) {
                            let comment = comments.items[i];
                            if (!photo.comment) {
                                photo.comment = [];
                            }
                            photo.comment[photo.comment.length] = {
                                date: comment.date,
                                user: user[comment.from_id],
                                text: comment.text
                            };
                        }
                        resolve(photo);
                    })
                })
            })).then(photos=> {
                results.innerHTML = View.render('photos', {list: photos})
            });
        });
    }
};
