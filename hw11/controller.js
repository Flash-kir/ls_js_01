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
        return Model.getPhotos().then(function(photos) {
            for (let i = 0; i < photos.items.length; i++) {
                let photo = photos.items[i];
                Model.getComments(photo.id).then(function(comments) {
                        for (let i = 0; i < comments.items.length; i++) {
                            let comment = comments.items[i];
                            if (!photo.comment) {
                                photo.comment = [];
                            }
                            photo.comment[photo.comment.length] = {date: comment.date, user: comment.from_id, text: comment.text};
                        }
                        console.log(photo.comment);
                    }
                );
            }
            results.innerHTML = View.render('photos', {list: photos.items});
        });
    }
};
