# Sequential execution of asynchronous HTTP calls from a web inteface

A basic implementation of sequential execution of asynchronous HTTP calls from a web interface using jQuery AJAX request's deferred mechanism.
   
### How to run
 
```sh
$ git clone git@github.com:alexmon/js-queue-tasks.git
$ cd js-queue-tasks
$ php -S localhost:8000
```

Visit http://localhost:8000/index.html, input number of tasks, click generate, then click execute and for each scheduled item an XHR POST request will be sent to http://localhost:8000/index.php, which responds after waiting for 1 to 10 seconds randomly set.      
 
