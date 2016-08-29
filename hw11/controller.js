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
        let step_a, step_p = [], progress = 0;
        results.innerHTML = '<div class="progress">' +
                              '<div id="bar" class="progress-bar" role="progressbar" aria-valuenow="0"' +
                                  'aria-valuemin="0" aria-valuemax="100" style="width:0%">' +
                                // '<span class="sr-only">70% Complete</span>' +
                              '</div>' +
                            '</div>';
        return Model.getPhotoAlbums().then(function(albums){
            let albums_dict = {};
            step_a = 100/albums.items.length;
            for (let i = 0; i < albums.items.length; i++) {
                albums_dict[albums.items[i].id] = {id: albums.items[i].id,title: albums.items[i].title, items: []}
            }
            Promise.all(Object.keys(albums_dict).map((current, ind, arr)=>{
                return new Promise(function (res) {
                    Model.getPhotos(arr[ind]).then(function(photos) {
                        progress_p = 0;
                        step_p[ind] = step_a;
                        if (photos.items.length != 0) {
                            step_p[ind] = step_a / photos.items.length;
                        }
                        Promise.all(photos.items.map((current, index, array)=>{
                            return new Promise(function (resolve) {
                                Model.getComments(array[index].id).then(function (comments) {
                                    return new Promise(function (res2) {
                                        let photo = array[index],
                                            user = {};
                                        for (let i = 0; i < comments.profiles.length; i++) {
                                            let profile = comments.profiles[i];
                                            user[profile.id] = {
                                                photo_100: profile.photo_100,
                                                name: [profile.first_name, profile.last_name].join(" ")
                                            }
                                        }
                                        if (!photo.comment ) {
                                            photo.comment = [];
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
                                        res2(photo.comment);
                                    })
                                .then( () => {
                                    progress += step_p[ind];
                                    bar.style.width = progress + "%";
                                    resolve(array[index]);
                                } );
                                });
                            })
                        })).then(resp => {
                            albums_dict[arr[ind]].items = resp;

                            res(albums_dict[arr[ind]]);
                        });
                    });
                });
            })).then(resp=> {
                albums_dict = resp;
                document.getElementById("results").innerHTML = View.render('photos', resp );
            });
        });
    }
};
