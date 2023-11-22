/**
 * Asynchronous sequential execution can be used when tasks need to be performed
 * one after the other in sequence and the number of tasks and when
 * they need to be executed is clearly defined.
 */

/**
 * setTimeout is used to inject async behavior as an example.
 * However, it can be replaced by any generic asychronous task.
 */
const task1 = function (callback: () => void) {
  setTimeout(() => {
    console.log("Task 1 complete");
    task2(callback);
  }, 1000);
};

const task2 = function (callback: () => void) {
  setTimeout(() => {
    console.log("Task 2 complete");
    task3(callback);
  }, 1000);
};

const task3 = function (callback: () => void) {
  setTimeout(() => {
    console.log("Task 3 complete");
    callback();
  }, 1000);
};

task1(() => console.log("All tasks complete"));
