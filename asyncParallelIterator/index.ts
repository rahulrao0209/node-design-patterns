/**
 * Executes a list  of asynchronous tasks in parallel.
 * Parallel execution can be used when we have a list of tasks whose order of execution does not matter.
 * When all the tasks are completed the program can proceed to the next step.
 */

type Task<T> = T;
type ProcessorFn<Task> = (
  task: Task,
  callback: (error?: Error) => void
) => void;
type EndFn = (error?: Error) => void;

const asyncParallelIterator = <T>(
  tasks: Iterable<Task<T>>,
  processor: ProcessorFn<Task<T>>,
  end: EndFn
) => {
  const taskList = Array.from(tasks);
  let completed = 0;
  let isError = false;
  taskList.forEach((task: T) => {
    processor(task, (error: Error | undefined) => {
      if (error) {
        isError = true;
        return end(error);
      }

      if (++completed === taskList.length && !isError) {
        return end();
      }
    });
  });
};

/************************************************************************/

/** Usage */
const processTasks = (task: unknown, callback: (error?: Error) => void) => {
  const random = Math.floor(Math.random() * 5 + 1);
  setTimeout(() => {
    console.log(`Processing task ${task}`);
    callback();
  }, random * 1000);
};

const endAllTasks = (error?: Error) => {
  if (error) console.error(error.message);
  console.log("Processing finished.");
};

asyncParallelIterator([1, 2, 3, 4, 5], processTasks, endAllTasks);
