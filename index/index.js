var app = angular.module('myapp', ['ui.router'])
var url = "https://10.21.99.181:8001/"
app.factory('httpInterceptor', function ($rootScope, $q) {
    var numLoadings = 0
    return {
        request: function (config) {
            numLoadings++
            $rootScope.$broadcast("loader_show")
            return config
        },
        response: function (response) {
            if ((--numLoadings) === 0) {
                $rootScope.$broadcast("loader_hide")
            }
            if (response.config.method !== 'GET' && response.data && response.data.msg) {
                Swal.fire({
                    title: "Success",
                    icon: "success",
                    text: response.data.msg
                })
            }
            return response
        },
        responseError: function (response) {
            if ((--numLoadings) === 0) {
                $rootScope.$broadcast("loader_hide")
            }
            Swal.fire({
                title: "Error",
                icon: "error",
                text: response.data && response.data.error ? response.data.error : "An unexpected error occurred."
            })
            return $q.reject(response)
        }
    }
})
app.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $httpProvider.interceptors.push('httpInterceptor')
    $urlRouterProvider.otherwise('/')
    $stateProvider
        .state('signup', {
            url: '/signup',
            templateUrl: 'pages/signup_doctor.html'
        })
        .state('signup_', {
            url: '/signup_',
            templateUrl: 'pages/signup_patient.html'
        })
        .state('signin', {
            url: '/signin',
            templateUrl: 'pages/signin.html'
        })
        .state('/', {
            url: '/',
            templateUrl: 'pages/home.html'
        })
        .state('medical', {
            url: '/medical',
            templateUrl: 'pages/medical_history.html'
        })
        .state('profile', {
            url: '/profile',
            templateUrl: 'pages/profile.html'
        })
        .state('appointment', {
            url: '/appointment',
            templateUrl: 'pages/reception_appointment.html'
        })
    $httpProvider.interceptors.push(function () {
        return {
            'request': function (config) {
                config.withCredentials = true
                return config;
            }
        };
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
app.controller('signup', function ($scope, $http, $state) {
    $scope.input_type = 'password'
    $scope.toggle = function () {
        if ($scope.input_type == 'password') {
            $scope.input_type = 'text'
        } else {
            $scope.input_type = 'password'
        }
    }
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
            $http.post(url + "auth/register", data, { headers: { 'Content-Type': undefined }, params: { 'role': 'doctor' }, withCredentials: true }).then(function (response) {
                $state.go('/');
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

app.controller('signupctrl', function ($scope, $http, $state) {
    $scope.input_type = 'password'
    $scope.toggle = function () {
        if ($scope.input_type == 'password') {
            $scope.input_type = 'text'
        } else {
            $scope.input_type = 'password'
        }
    }
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
            $http.post(url + "auth/register", data, { headers: { 'Content-Type': undefined }, params: { 'role': 'patient' }, withCredentials: true }).then(function (response) {
                $state.go('/');
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

app.controller('signin', function ($scope, $http, $state) {
    $scope.submit = function () {
        var data = {
            email: $scope.email,
            password: $scope.password
        }
        $http.post(url + "auth/login/", data, { withCredentials: true }).then(function (response) {
            var data = response.data
            if ((data.role == "Receptionist") || (data.role == "Doctor")) {
                $state.go('appointment')
            }
            else if (data.role == "Patient") {
                $state.go('/')
            }
        })
    }
    $scope.input_type = 'password'
    $scope.toggle = function () {
        if ($scope.input_type == 'password') {
            $scope.input_type = 'text'
        } else {
            $scope.input_type = 'password'
        }
    }
})

app.controller('home', function ($scope, $http, $state) {
    $scope.logout = function () {
        Swal.fire({
            title: 'Do you want to logout ?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: 'No',
            customClass: {
                actions: 'my-actions',
                cancelButton: 'order-1 right-gap',
                confirmButton: 'order-2 left-gap',
                denyButton: 'order-3',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                $http.delete(url + "auth/logout/").then(function (response) {
                    $state.go("signin")
                })
            }
        })
    }
    $scope.user = false
    $http.get(url + "auth/profile/").then(function (response) {
        var profile = response.data.role
        if ((profile == "Patient") || (profile == "Doctor")) {
            $scope.user = true
        }
        else {
            $scope.user = false
        }
    })
    $scope.selectedSpecialization = ""
    $scope.dobcheck = function () {
        var dob = $scope.dob
        var today = new Date()
        today.setHours(0, 0, 0, 0)
        if (new Date(dob) < today) {
            Swal.fire({
                title: "Error",
                icon: "error",
                text: "Invalid Date"
            })
            return false
        }
        else {
            return true
        }
    }
    $http.get(url + "auth/dropdowns/").then(function (response) {
        var data = response.data
        $scope.specialization = data.specializations
    })
    $http.get(url + "patient/doctors/").then(function (response) {
        var doc = response.data
        $scope.doctors = doc
    })
    $scope.submit = function () {
        var date = $scope.dob.toLocaleDateString("sv-sv")
        var time = $scope.time.toLocaleTimeString()
        var detail = {
            doctor: $scope.doctor,
            date: date,
            time: time,
            reason_to_visit: $scope.reason_to_visit
        }
        $http.post(url + "patient/book_appointment/", detail, { withCredentials: true }).then(function (response) {
            document.getElementById("Appointment").reset()
        })
    }
    $scope.clear = function () {
        document.getElementById("Appointment").reset()
        $scope.selectedSpecialization = ""
    }
})

app.controller('medical', function ($scope, $http, $state) {
    $http.get(url + "patient/book_appointment/").then(function (response) {
        var data = response.data
        $scope.appointments = data
        console.log(data)
    })
    $scope.logout = function () {
        Swal.fire({
            title: 'Do you want to logout ?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: 'No',
            customClass: {
                actions: 'my-actions',
                cancelButton: 'order-1 right-gap',
                confirmButton: 'order-2 left-gap',
                denyButton: 'order-3',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                $http.delete(url + "auth/logout/").then(function (response) {
                    $state.go("signin")
                })
            }
        })
    }
})

app.controller('appointmen', function ($scope, $http, $state) {
    $scope.valid = false
    $scope.logout = function () {
        Swal.fire({
            title: 'Do you want to logout ?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: 'No',
            customClass: {
                actions: 'my-actions',
                cancelButton: 'order-1 right-gap',
                confirmButton: 'order-2 left-gap',
                denyButton: 'order-3',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                $http.delete(url + "auth/logout/").then(function (response) {
                    $state.go("signin")
                })
            }
        })
    }
    $http.get(url + "auth/profile/").then(function (response) {
        var profile = response.data.role
        $scope.user = profile
        console.log(profile)
    })
    $scope.consult = function (id) {
        var pre = document.getElementById("pre").value
        var consult = {
            id: id,
            prescription: pre
        }
        $http.post(url + "doctor/prescription/", consult).then(function (response) {
            show();
        })
    }
    $scope.appointments = []
    function show() {
        $http.get(url + "reception/appointments_data/").then(function (response) {
            var data = response.data
            var appointment = data.appointment_data
            $scope.appointments = appointment
        })
    }
    $scope.approve = function (id) {
        var value = {
            id: id,
            accepted: true
        }
        $http.put(url + "reception/update_appointment", value).then(function (response) {
            show()
        })
    }
    $scope.reject = function (id) {
        var reason = document.getElementById("reason").value
        var value = {
            accepted: false,
            reason_for_cancel: reason
        }
        $http.put(url + "reception/update_appointment", value, { params: { 'id': id } }).then(function (response) {
            document.getElementById("rejectModal").reset()
            show()
        })
    }
    $scope.clear = function () {
        document.getElementById("rejectModal").reset()
    }
    show()
})

app.controller('profile', function ($scope, $http, $state) {
    $http.get(url + "auth/profile/").then(function (response) {
        var profile = response.data.role
        $scope.user = profile
        console.log(profile)
    })
    $http.get(url + "auth/profile/").then(function (response) {
        var profile = response.data
        $scope.address = profile.address
        $scope.dob = profile.birth_date
        $scope.blood = profile.blood_group
        $scope.email = profile.email
        $scope.fname = profile.first_name
        $scope.lname = profile.last_name
        $scope.gender = profile.gender
        $scope.height = profile.height
        $scope.weight = profile.weight
        $scope.history = profile.medical_history
        $scope.phone = profile.phone_no
        $scope.qua = profile.qualifications
        $scope.spec = profile.specialization
        $scope.exp = profile.experience
    })
    $scope.logout = function () {
        Swal.fire({
            title: 'Do you want to logout ?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: 'No',
            customClass: {
                actions: 'my-actions',
                cancelButton: 'order-1 right-gap',
                confirmButton: 'order-2 left-gap',
                denyButton: 'order-3',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                $http.delete(url + "auth/logout/").then(function (response) {
                    $state.go("signin")
                })
            }
        })
    }
})