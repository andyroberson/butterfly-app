var app = angular.module('myApp', []);

app.controller('BaseController', ['$http', function($http) {

    this.butterflies = [];

    var _this = this;

    $http.get('js/butterflies.json')

        .success(function(data) {
          _this.butterflies = data;
        })
        .error(function(msg) {
          console.log("this request failed.\n" + msg);
        });

        this.setSort = (function(columnName) {
          if (this.sort === columnName) {
            this.direction = !this.direction; //to toggle
          }
          this.sort = columnName;
        });

      }
    ]);
