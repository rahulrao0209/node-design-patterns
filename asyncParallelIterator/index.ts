/**
 * Executes a list  of asynchronous tasks in parallel.
 * Parallel execution can be used when we have a list of tasks whose order of execution does not matter.
 * When all the tasks are completed the program can proceed to the next step.
 * We can also limit the number of parallel tasks by passing in a limit argument.
 */

type Task<T> = T;
type ProcessorFn<Task> = (
  task: Task,
  callback: (error?: Error) => void
) => void;
type EndFn = (error?: Error) => void;

/**
 * Execute a list of asynchronous tasks in parallel.
 * @param {Iterable<Task<T>>} tasks
 * @param {ProcessorFn<Task<T>>} processor
 * @param {EndFn} end
 * @param {number} limit
 */
export function asyncParallelIterator<T>(
  tasks: Iterable<Task<T>>,
  processor: ProcessorFn<Task<T>>,
  end: EndFn,
  limit: number
): void;
export function asyncParallelIterator<T>(
  tasks: Iterable<Task<T>>,
  processor: ProcessorFn<Task<T>>,
  end: EndFn
): void;
export function asyncParallelIterator<T>(
  tasks: Iterable<Task<T>>,
  processor: ProcessorFn<Task<T>>,
  end: EndFn,
  limit: number = 5
): void {
  const taskList = Array.from(tasks);
  let completed = 0;
  let isError = false;

  if (limit) {
    /** Limited parallel execution.
     *  If limit is specified only execute the number
     *  of tasks specified by the limit in parallel.
     */
    let running = 0;
    let index = 0;
    const next = () => {
      while (running < limit && index < taskList.length) {
        const task = taskList[index++];
        processor(task, (error: Error | undefined) => {
          if (error) {
            isError = true;
            return end(error);
          }

          if (++completed === taskList.length && !isError) return end();
          running -= 1;
          next();
        });
        running += 1;
      }
    };
    next();
  } else {
    /** Unlimited parallel execution.
     *  If no limit is specified execute all tasks in parallel.
     */
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
  }
}

export default asyncParallelIterator;
