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
        let step, progress = 0;
        results.innerHTML = '<div class="progress">' +
                              '<div id="bar" class="progress-bar" role="progressbar" aria-valuenow="0"' +
                                  'aria-valuemin="0" aria-valuemax="100" style="width:0%">' +
                                // '<span class="sr-only">70% Complete</span>' +
                              '</div>' +
                            '</div>';
        function stepUp(step) {
            progress += step;
            document.getElementById("bar").style.width = progress + "%";
        }
  
        let promise_albums = Model.getPhotoAlbums().then(function(albums){
            let albums_dict = {};
            for (let i = 0; i < albums.items.length; i++) {
                albums_dict[albums.items[i].id] = {id: albums.items[i].id,title: albums.items[i].title, items: []}
            }
            stepUp(6);
            return albums_dict;
        });

        let promise_photos = Model.getPhotos(0).then(function(photos) {
            stepUp(20);
            return photos;
        });

        let promise_comments = Model.getComments(0).then(function(comments) {
            return comments.items.map(function (comment) {
                stepUp(14/comments.items.length);
                return comment;
            });
        });

        Promise.all([promise_albums, promise_photos, promise_comments]).then( (resp) => {
            let albums = resp[0],
                photos = resp[1].items,
                comments = resp[2],
                photo_comment = {},
                album_photos = {},
                result_albums = [];
            step = 60/(comments.length + photos.length + Object.keys( albums ).length);


            for (let i = comments.length; i > 0; i--) {
                let comment = comments[i-1];
                if (!photo_comment[comment.pid] ) {
                    photo_comment[comment.pid] = {comment: []};
                }
                photo_comment[comment.pid].comment[photo_comment[comment.pid].comment.length] = comment;
                stepUp(step);
            }

            for (let i = photos.length; i > 0; i--) {
                let photo = photos[i-1];
                if ( photo_comment[photo.id] ) {
                    photo["comment"] = photo_comment[photo.id].comment;
                }
                if (!album_photos[photo.album_id] ) {
                    album_photos[photo.album_id] = {photo: []};
                }
                photo.comments = {count: 0};
                if (photo.comment) {
                    photo.comments.count = photo.comment.length;
                }
                album_photos[photo.album_id].photo[album_photos[photo.album_id].photo.length] = photo;
                stepUp(step);
            }

            for (let i = 0; i < Object.keys( albums ).length; i++) {
                let album = albums[Object.keys( albums )[i]], items = [];
                if (album_photos[album.id]) {
                    items = album_photos[album.id].photo;
                    result_albums.push({title: album.title, items: items, id: album.id });
                }
                stepUp(step);
            }
            // console.log(result_albums);
            document.getElementById("results").innerHTML = View.render('photos', result_albums );
            // догружаем имена и фотки
            for (let i = comments.length; i > 0; i--) {
                let comment = comments[i-1], name, photo_50;
                Model.getUser(comment.from_id, ['photo_50']).then(function (user) {
                    name = [user[0].first_name, user[0].last_name].join(" ");
                    photo_50 = user[0].photo_50;
                    user_comments = results.querySelectorAll("[data-user='"+ comment.from_id +"']");
                    for (let i = 0; i < user_comments.length; i++) {
                        let user_comment = user_comments[i], 
                            user_photo_img = user_comment.querySelector("img"),
                            user_name = user_comment.querySelector(".user-name");
                        user_photo_img.src = photo_50;
                        user_name.innerHTML = name;
                    }
                });
                photo_comment[comment.pid].comment[photo_comment[comment.pid].comment.length] = comment;
            }
        });


        // return Model.getPhotoAlbums().then(function(albums){
        //     let albums_dict = {};
        //     step_a = 100/albums.items.length;
        //     for (let i = 0; i < albums.items.length; i++) {
        //         albums_dict[albums.items[i].id] = {id: albums.items[i].id,title: albums.items[i].title, items: []}
        //     }
        //     Promise.all(Object.keys(albums_dict).map((current, ind, arr)=>{
        //         return new Promise(function (res) {
        //             Model.getPhotos(arr[ind]).then(function(photos) {
        //                 step_p[ind] = step_a;
        //                 if (photos.items.length != 0) {
        //                     step_p[ind] = step_a / photos.items.length;
        //                 }
        //                 Promise.all(photos.items.map((current, index, array)=>{
        //                     return new Promise(function (resolve) {
        //                         Model.getComments(array[index].id).then(function (comments) {
        //                             return new Promise(function (res2) {
        //                                 let photo = array[index],
        //                                     user = {};
        //                                 for (let i = 0; i < comments.profiles.length; i++) {
        //                                     let profile = comments.profiles[i];
        //                                     user[profile.id] = {
        //                                         photo_100: profile.photo_100,
        //                                         name: [profile.first_name, profile.last_name].join(" ")
        //                                     }
        //                                 }
        //                                 if (!photo.comment ) {
        //                                     photo.comment = [];
        //                                 }
        //                                 for (let i = 0; i < comments.items.length; i++) {
        //                                     let comment = comments.items[i];
        //                                     if (!photo.comment) {
        //                                         photo.comment = [];
        //                                     }
        //                                     photo.comment[photo.comment.length] = {
        //                                         date: comment.date,
        //                                         user: user[comment.from_id],
        //                                         text: comment.text
        //                                     };
        //                                 }
        //                                 res2(photo.comment);
        //                             })
        //                         .then( () => {
        //                             progress += step_p[ind];
        //                             bar.style.width = progress + "%";
        //                             resolve(array[index]);
        //                         } );
        //                         });
        //                     })
        //                 })).then(resp => {
        //                     albums_dict[arr[ind]].items = resp;
        //
        //                     res(albums_dict[arr[ind]]);
        //                 });
        //             });
        //         });
        //     })).then(resp=> {
        //         albums_dict = resp;
        //         document.getElementById("results").innerHTML = View.render('photos', resp );
        //     });
        // });
    }
};
