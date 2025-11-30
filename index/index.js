var app = angular.module('myapp', ['ui.router']);
var url = "https://10.21.99.62:8001/";
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
    $urlRouterProvider.otherwise('/')
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
        .state('/', {
            url: '/',
            templateUrl: 'pages/land.html'
        })
        .state('dummy', {
            url: '/dummy',
            templateUrl: 'dummy.html'
        })
        .state('medical', {
            url: '/medical',
            templateUrl: 'pages/medical_history.html'
        })
        .state('profile', {
            url: '/profile',
            templateUrl: 'pages/patient_profile.html'
        })
        .state('appointment', {
            url: '/appointment',
            templateUrl: 'pages/appointment_approve.html'
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
            $http.post(url + "auth/register", data, { headers: { 'Content-Type': undefined }, params: { 'role': 'doctor' } }).then(function (response) {
                $state.go('/');
                Swal.fire({
                    title: "Success",
                    icon: "success",
                    text: response.data.msg
                });
            }).catch(function (error) {
                Swal.fire({
                    title: "Error",
                    icon: "error",
                    text: error.data.error
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
app.controller('signupctrl', function ($scope, $http, $state) {
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
            $http.post(url + "auth/register", data, { headers: { 'Content-Type': undefined }, params: { 'role': 'patient' } }).then(function (response) {
                $state.go('/');
                Swal.fire({
                    title: "Success",
                    icon: "success",
                    text: response.data.msg
                });
            }).catch(function (error) {
                Swal.fire({
                    title: "Error",
                    icon: "error",
                    text: error.data.error
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
app.controller('signin', function ($scope, $http, $state) {
    $scope.submit = function () {
        var data = {
            email: $scope.email,
            password: $scope.password
        }
        $http.post(url + "auth/login/", data, { withCredentials: true }).then(function (response) {
            $state.go('/');
            Swal.fire({
                title: "Success",
                icon: "success",
                text: response.data.msg
            });
        }).catch(function (error) {
            Swal.fire({
                title: "Error",
                icon: "error",
                text: error.data.error
            })
        });
    }
})
app.controller('land', function ($scope, $http, $state) {
    $scope.dobcheck = function () {
        var dob = $scope.dob;
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        if (dob < today) {
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
    $http.get(url + "auth/dropdowns/").then(function (response) {
        var data = response.data
        $scope.specialization = data.specializations
    })
    $http.get(url + "patient/doctors/").then(function (response) {
        var doc = response.data
        $scope.doctors = doc
    }).catch(function (error) {
        Swal.fire({
            title: "Error",
            icon: "error",
            text: error.data.error
        })
    })
    $scope.submit = function () {
        var doctor = $scope.doctor
        var date = $scope.dob.toLocaleDateString("sv-sv")
        var time = $scope.time.toLocaleTimeString()
        var reason_to_visit = $scope.reason_to_visit
        var detail = {
            doctor: doctor,
            date: date,
            time: time,
            reason_to_visit: reason_to_visit
        }
        $http.post(url + "patient/bookAppointment/", detail, { withCredentials: true }).then(function (response) {
            document.getElementById("Appointment").reset()
            Swal.fire({
                title: "Success",
                icon: "success",
                text: response.data.msg
            })
        }).catch(function (error) {
            Swal.fire({
                title: "Error",
                icon: "error",
                text: error.data.error
            })
        })
    }
    $scope.clear = function () {
        document.getElementById("Appointment").reset()
    }
})
app.controller('medical', function ($scope, $http, $state) {
    $http.get(url + "patient/bookAppointment/").then(function (response) {
        var data = response.data
        $scope.appointments = data
        console.log(data)
    })
})
app.controller('appointmen', function ($scope, $http, $state) {
    $scope.appointments=[]
    $http.get(url + "reception/appointments_data/").then(function (response) {
        var data = response.data
        function find(details, id) {
            return details.find(detail => detail.id === id)
        }
        for (let i = 0; i < data.appointment_data.length; i++) {
            var appointment = data.appointment_data[i]
            var patient_id = appointment.patient_id
            var doctor_id = appointment.doctor_id
            var patient_details = find(data.patient_data, patient_id)
            var doctor_details = find(data.doctor_data, doctor_id)
            var new_appointment = {
                date: appointment.appointment_date,
                time: appointment.appointment_time,
                reason: appointment.reason_to_vist,
                fname: patient_details.first_name,
                lname: patient_details.last_name,
                history: patient_details.medical_history,
                doc_fname: doctor_details.first_name,
                doc_lname: doctor_details.last_name,
                specialization: doctor_details.specialization_name,
                status: appointment.status
            }
            $scope.appointments.push(new_appointment)
        }
    })
})