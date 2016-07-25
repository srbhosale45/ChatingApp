var chatApp = angular.module('chatApp', ['ui.bootstrap', 'ngStorage']);

(function(){
chatApp.controller('mainController', function ($scope, $uibModal , $window , $rootScope , messageService) {  
    
    $scope.open = function () {
            var chatBox = $uibModal.open({
				    controller: 'chatController',
                    templateUrl: 'app/views/chatDialog.html',
                    resolve: {
                    userName: function () {
                    return $scope.user;
                    }
                 }
             });
          $scope.user = "";
     }
   
   $rootScope.chats = messageService.getData();
    
   $rootScope.latestData = function() {
         return messageService.getData();
       }
    
    angular.element($window).on('storage', function(event) {
    $rootScope.$apply(function() {
        $rootScope.chats = messageService.getData();
        $rootScope.latestData = function() {
              return messageService.getData();
           }
        });
      });
   });

    
chatApp.factory("messageService", function($window, $rootScope , $localStorage) {
      var chats = new Array();
      return {
        setData: function(val) {
          $localStorage.chat = val;
          return this;
        },
        getData: function() {
           chats = $localStorage.chat;                 
           return chats ? chats : []; 
         }
      };
  });


chatApp.controller("chatController", function(messageService , $uibModalInstance , userName ,$scope , $rootScope) {
    
     $scope.addMessage = function() {
        var messageObj = {
        user: userName,
        message: $scope.message
    }
    $rootScope.chats.push(messageObj);  
    messageService.setData($rootScope.chats);
    $scope.message = "";
  };
    
    $scope.close = function () {
        $uibModalInstance.dismiss('cancel');
        $rootScope.chats.splice(0,$rootScope.chats.length)
      };
   });
})();