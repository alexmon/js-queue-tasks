'use strict';

/**
 * Basic Models 
 *
 */
var Task = function(argId, argName, argStatus) {

    return {
        id: argId,

        name: argName,

        status: argStatus,

        execute: function() {
            $('#log-txt').val(
                $('#log-txt').val() + '\r\nExecuting task with id = ' + this.id
            );

            var post = $.ajax({
                url: "/index.php",
                data: {
                    execute: true,
                    id: this.id,
                    name: this.name,
                    status: this.status

                },
                type: "POST"
            });

            return post;
        }
    };
}

var TasksList = function() {

    var tasks = [];

    return {
        enqueue: function(task) {
            tasks.push(task);

            return true;
        },

        dequeue: function() {
            if (tasks.length > 0) {

                return tasks.shift();
            }

            return false;
        },

        toArray: function() {

            return tasks;
        },

        reset: function() {
            while (tasks.length > 0) {
                tasks.pop();
            }
        }
    };
}


/**
 * Basic Structures
 */
var scheduledList = new function() {
    var list = new TasksList();

    return {
        add: function(argId, argName, argStatus) {
            var task = new Task(
                argId,
                argName,
                argStatus
            );

            list.enqueue(task);

            $('#schedule-list').append(
                '<li class="list-group-item" data-id="' + task.id + '">' +
                '<span class="badge">' + task.id + '</span>' + task.name +
                '</li>'
            );

            return true;
        },

        clear: function() {

            $('#schedule-list li').remove();

            return list.reset();
        },

        next: function() {
            var task = list.dequeue();

            if (task) {
                runningList.run(task);
            }
        },

        toArray: function() {

            return list.toArray();
        }
    };
}

var runningList = new function() {

    return {
        run: function(task) {
            $('#running-list').append(
                $('li[data-id=' + task.id + ']')
            );

            $('#log-txt').val(
                $('#log-txt').val() + '\r\nStarting task with id = ' + task.id
            );

            task.status = 'executing';

            task.execute().done(
                function(response) {
                    $('#log-txt').val(
                        $('#log-txt').val() + '\r\nFinished task with id = ' + task.id
                    );

                    $('#log-txt').val(
                        $('#log-txt').val() + '\r\n' +
                        'success : ' + response.success + ', responseTime : ' + response.responseTime
                    );

                    $('#log-txt').val(
                        $('#log-txt').val() + '\r\n'
                    );

                    task.status = 'finished';

                    finishedList.add(task);

                    scheduledList.next();
                }
            );
        },

        clear: function() {
            $('#running-list li').remove();
        },
    };
}

var finishedList = new function() {

    return {
        add: function(task) {
            $('#finished-list').append(
                $('li[data-id=' + task.id + ']')
            );
        },

        clear: function() {
            $('#finished-list li').remove();
        },
    };
}

/**
 * General functions
 */
function generate() {
    reset();

    var minimumTasks = Number.parseInt($('#tasks-number-inp').data('min'));
    var tasksNumber = Number.parseInt($('#tasks-number-inp').val());

    for (var i = 1, taskIndex = 1; i <= tasksNumber; ++i, ++taskIndex) {
        scheduledList.add(
            taskIndex,
            'Task',
            'scheduled'
        );
    }
}

function run() {
    scheduledList.next();
}

function reset() {
    scheduledList.clear();
    runningList.clear();
    finishedList.clear();
}

/**
 * Register events
 */
$(
    function() {

        $('#generate-btn').on(
            'click',
            function(event) {
                generate();
                $('#run-btn').prop('disabled', false);
                $('#generate-btn').prop('disabled', true);
                $('#reset-btn').prop('disabled', false);
            }
        );

        $('#run-btn').on(
            'click',
            function(e) {
                $('#run-btn').prop('disabled', true);
                $('#generate-btn').prop('disabled', true);
                $('#reset-btn').prop('disabled', true);

                run();

                $('#reset-btn').prop('disabled', false);
            }
        );

        $('#reset-btn').on(
            'click',
            function(e) {
                reset();
                $('#generate-btn').prop('disabled', false);
                $('#run-btn').prop('disabled', true);
                $('#reset-btn').prop('disabled', true);
                $('#log-txt').val('');
            }
        );

    }
);