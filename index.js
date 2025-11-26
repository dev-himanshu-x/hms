var app = angular.module('myapp', ['ui.router']);
var url="https://10.21.98.177:8000/"
app.config(function($stateProvider, $urlRouterProvider,$httpProvider) {
   $urlRouterProvider.otherwise('/signin')
   $stateProvider
       .state('signup',{
           url: '/signup',
           templateUrl: 'pages/signup.html'
       })
       .state('signup_',{
           url: '/signup_',
           templateUrl: 'pages/register.html'
       })
       .state('signin',{
           url: '/signin',
           templateUrl: 'pages/signin.html'
       })
});