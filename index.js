var app = angular.module('myapp', ['ui.router']);
var url = "https://10.21.97.46:8001/";
app.factory('httpInterceptor', function ($q, $rootScope, $log) {
    var numLoadings = 0
    return {
        request: function (config) {
            numLoadings++
            $rootScope.$broadcast("loader_show");
            return config
        },
        response: function (response) {
            if ((--numLoadings) === 0) {
                $rootScope.$broadcast("loader_hide");
            }
            return response
        },
        responseError: function (response) {
            if ((--numLoadings) === 0) {
                $rootScope.$broadcast("loader_hide");
            }
            return
        }
    }
})
app.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $httpProvider.interceptors.push('httpInterceptor');
    $urlRouterProvider.otherwise('/signin')
    $stateProvider
        .state('signup', {
            url: '/signup',
            templateUrl: 'pages/signup.html'
        })
        .state('signup_', {
            url: '/signup_',
            templateUrl: 'pages/register.html'
        })
        .state('signin', {
            url: '/signin',
            templateUrl: 'pages/signin.html'
        })
});
app.directive("loader", function ($rootScope) {
    return function ($scope, element, attrs) {
        $scope.$on("loader_show", function () {
            return $scope.person = true
        })
        return $scope.$on("loader_hide", function () {
            return $scope.person = false
        })
    }
})
app.controller('signup', function ($scope, $http) {
    $http.get(url + "auth/dropdowns/").then(function (response) {
        var data = response.data
        $scope.genders = data.genders
        $scope.specialization = data.specializations
        $scope.qualification = data.qualifications
    })
    $scope.dobcheck = function () {
        var dob = $scope.dob;
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        if (dob > today) {
            Swal.fire({
                title: "Error",
                icon: "error",
                text: "Invalid Date"
            });
            return false;
        }
        else {
            return true;
        }
    }
    $scope.submit = function () {
        var password = $scope.password
        var confirm = $scope.confirm_password
        if (password == confirm) {
            var form = document.getElementById("form")
            var data = new FormData(form)
            console.log(data)
            $http.post(url + "auth/register", data, { headers: { 'Content-Type': undefined }, params: { 'role': 'doctor' } }).then(function (response) {
                $state.go('signin');
            }).catch(function (error) {
                Swal.fire({
                    title: "Error",
                    icon: "error",
                    text: error.msg
                })
            });
        }
        else {
            Swal.fire({
                title: "Error",
                icon: "error",
                text: "Password and Confirm Password does not match"
            })
        }
    }
})
app.controller('signupctrl', function ($scope, $http) {
    $http.get(url + "auth/dropdowns/").then(function (response) {
        var data = response.data
        $scope.genders = data.genders
        $scope.bloods = data.blood_groups
    })
    $scope.dobcheck = function () {
        var dob = $scope.dob;
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        if (dob > today) {
            Swal.fire({
                title: "Error",
                icon: "error",
                text: "Invalid Date"
            });
            return false;
        }
        else {
            return true;
        }
    }
    $scope.submit = function () {
        var password = $scope.password
        var confirm = $scope.confirm_password
        if (password == confirm) {
            var form = document.getElementById("form")
            var data = new FormData(form)
            console.log(data)
            $http.post(url + "auth/register", data, { headers: { 'Content-Type': undefined }, params: { 'role': 'patient' } }).then(function (response) {
                $state.go('signin');
            }).catch(function (error) {
                Swal.fire({
                    title: "Error",
                    icon: "error",
                    text: error.msg
                })
            });
        }
        else {
            Swal.fire({
                title: "Error",
                icon: "error",
                text: "Password and Confirm Password does not match"
            })
        }
    }
})
