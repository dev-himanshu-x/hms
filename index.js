var app = angular.module('myapp', ['ui.router']);
var url = "https://10.21.97.46:8000/"
app.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
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
app.controller('signup', function ($scope, $http) {
    $http.get(url + "auth/dropdowns/").then(function (response) {
        var data = response.data
        $scope.genders = data.genders
        $scope.specialization = data.specializations
        $scope.qualification = data.qualifications
    })
    $scope.dobcheck = function () {
        var dob = $scope.dob.toLocaleDateString()
        var dobcheck = new Date().toLocaleDateString()
        if (dob < dobcheck) {
            return true
        }
        else {
            Swal.fire({
                title: "Error",
                icon: "error",
                text: "Date Invalid"
            })
        }
    }
    $scope.submit = function () {
        var password = $scope.password
        var confirm = $scope.confirm_password
        if (password == confirm) {
            var form = document.getElementById("form")
            var data = new FormData(form)
            $http.get(url + "auth/register").then(function (response) {
                var data = response
                console.log(data)
            })
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
    $scope.submit = function () {
        var form = document.getElementById("form")
        var data = new FormData(form)
        $http.get(url + "auth/register").then(function (response) {
            var data = response
            console.log(data)
        })
    }
})
