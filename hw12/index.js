ymaps.ready(function () {
    var myMap,
        currentId = 0,
        MyClusterBalloonLayout = ymaps.templateLayoutFactory.createClass(
            '<div class="carousel-name">' +
                '<b>{{ properties.place | raw}}</b>' +
            '</div>' +
            '<div class="carousel-address" data-id="{{properties.id}}">' +
                '<a href="#" data-id="{{properties.id}}">{{ properties.address | raw}}</a>' +
            '</div>' +
            '<div class="carousel-rewievs">' +
                '<div>{{properties.name | raw }}</div>' +
                '<div>{{properties.rewiev | raw }}</div>' +
                '<div>{{properties.time | raw }}</div>' +
            '</div>',
            {
                build: function () {
                    MyClusterBalloonLayout.superclass.build.call(this);
                    document.querySelector(".carousel-address").addEventListener('click', function (e) {
                        objectManager.objects.balloon.open(e.target.dataset.id);
                        setCentre(objectManager.objects.getById(e.target.dataset.id).properties.coords);
                    });
                }
            }
        ),
        objectManager = new ymaps.ObjectManager({
            clusterize: true,
            geoObjectOpenBalloonOnClick: true,
            clusterOpenBalloonOnClick: true,
            gridSize: 16,
            clusterDisableClickZoom: true,
            clusterBalloonContentLayout: 'cluster#balloonCarousel',
            clusterBalloonItemContentLayout: MyClusterBalloonLayout
        }),
        MyBalloonLayout = ymaps.templateLayoutFactory.createClass(
            '<div class="menu">' +
                '<div class="menu-header">' +
                    '<div class="address">' +
                        '<span class="geo-icon"></span>' +
                        '<span class="geo-address">{{ properties.address | raw}}</span>' +
                        '<span class="close">x</span>' +
                    '</div>' +
                '</div>' +
                '<div class="menu-rewievs">' +
                '</div>' +
                '<div class="menu-form">' +
                    '<input type="text" placeholder="Название места" class="place">' +
                    '<input type="text" placeholder="Ваше имя" class="name">' +
                    '<textarea placeholder="Пишите отзыв сюда" class="rewiev"></textarea>' +
                    '<div class="btn" onclick="">Отправить</div>' +
                '</div>' +
            '</div>',
            {
                build: function () {
                    MyBalloonLayout.superclass.build.call(this);
                    get_rewievs(document.querySelector(".geo-address").innerText);
                    document.querySelector(".close").addEventListener('click', bind(function () { this.onCloseClick() }, this));
                    document.querySelector(".btn").addEventListener('click', bind(function () { addRewiev(this) }, this));
                },

                onCloseClick: function () {
                    document.querySelector(".close").removeEventListener('click', bind() );
                    this.events.fire('userclose');
                }
            });

    function open_obj_baloon(objectId) {
        var objectState = objectManager.getObjectState(objectId);
        if (objectState.isClustered) {
            objectManager.clusters.state.set('activeObject', objectManager.objects.getById(objectId));
            objectManager.clusters.balloon.open(objectState.cluster.id);
            setCentre(objectManager.objects.getById(objectId).properties.coords);
        } else {
            objectManager.objects.balloon.open(objectId);
            setCentre(objectManager.objects.getById(objectId).properties.coords);
        }
    }

    function object_click(e) {
        e.preventDefault();
        var objectId = e.get('objectId');
        open_obj_baloon(objectId);
    }

    objectManager.objects.events.add('click', function (e) { object_click(e) });
    objectManager.clusters.events.add('click', function (e) { object_click(e) });

    function addMark(address, coords, name, place, rewiev) {
        var id = currentId++;
        objectManager.add({
            type: 'Feature',
            id: id,
            geometry: {
                type: 'Point',
                coordinates: coords
            },
            properties: {
                id: id,
                address: address,
                rewiev: rewiev,
                coords: coords,
                name: name,
                place: place,
                time: new Date().toLocaleString().split(",").join('')
            },
            options: {
                balloonLayout: MyBalloonLayout,
                balloonPanelMaxMapArea: 0
            }
        });
        myMap.geoObjects.add(objectManager);
        open_obj_baloon(id);
    }

    function get_rewievs(addr) {
        var objs = objectManager['_objectsCollection']['_objectsById'], res = '';
        for (var i=0; i < Object.keys(objs).length; i++) {
            if (objs[i].properties.address == addr) {
                var obj = objectManager.objects.getById(i).properties;
                res += '<div class="rewiev-blk" data-id="i">' +
                        '<div class="rewiev-head">' +
                            '<span>' +
                                '<b>' + obj.place + '</b> ' +
                                obj.name +
                                ' <em>' + obj.time + '</em>' +
                            '</span>' +
                        '</div>' +
                        '<div class="rewiev-body">' +
                            obj.rewiev +
                        '</div>' +
                    '</div>';
            }
        }
        if (!res) {
            res = 'Пока нет отзывов';
        }
        document.querySelector(".menu-rewievs").innerHTML = res;
    }

    function addRewiev() {
        var menu = arguments[0]['_element'].querySelector(".menu"),
            menu_place = menu.querySelector(".place"),
            menu_name = menu.querySelector(".name"),
            menu_rewiev = menu.querySelector(".rewiev"),
            coords = arguments[0]['_data'].properties.coords,
            address = arguments[0]['_data'].properties.address;
        if (!coords) {
            coords = arguments[0]['_data'].properties['_data'].coords;
        }
        if (!address) {
            address = arguments[0]['_data'].properties['_data'].address;
        }
        if (menu_name.value && menu_place.value && menu_rewiev.value) {
            // debugger;
            addMark(address, coords, menu_name.value, menu_place.value, menu_rewiev.value);
            get_rewievs(address);
        }
        menu_name.value = '';
        menu_place.value = '';
        menu_rewiev.value = '';
    }

    function bind(func, context) {
        return function() {
            return func.apply(context, arguments);
        };
    }

    function setCentre(coords) {
        myMap.setCenter(coords, myMap.getZoom(), {duration: 300});
    }

    function createMap (state) {
        myMap = new ymaps.Map('map', state);

        myMap.events.add('click', function (e) {
            var coords = e.get('coords');
            ymaps.geocode(coords).then(function (res) {
                return res.geoObjects.get(0).properties.get('text');
            }).then(function (res) {
                if (myMap.balloon.isOpen()) {
                    myMap.balloon.close();
                }
                setCentre(coords);
                setTimeout(function () {
                myMap.balloon.open(coords, {
                    properties: {
                        address: res,
                        rewiev: 'Пока нет отзывов',
                        coords: coords
                    }
                }, {
                    panelMaxMapArea: 0,
                    layout: MyBalloonLayout,
                    offset: [-150, -200]
                });}, 500);
            });
        });

    }

    ymaps.geolocation.get().then(
        function (res) {
        var bounds = res.geoObjects.get(0).properties.get('boundedBy');
        createMap({
            center: bounds[1],
            zoom: 16
        });
    },
        function () {
        createMap({
            center: [55.751574, 37.573856],
            zoom: 2
        });
    });
});