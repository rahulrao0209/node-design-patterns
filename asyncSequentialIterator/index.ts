/** Executes a list of asynchronous tasks in sequence. */
type Task<T> = T;
type ProcessorFn<Task> = (
  task: Task,
  callback: (error?: Error) => void
) => void;
type EndFn = (error?: Error) => void;

const asyncIterator = <T>(
  tasks: Iterable<Task<T>>,
  processor: ProcessorFn<Task<T>>,
  end: EndFn
) => {
  const iterate = (index: number) => {
    const taskList = Array.from(tasks);
    if (index === taskList.length) return end();
    const task = taskList[index];

    /** Call the processor to process each task. */
    processor(task, (error: Error | undefined) => {
      if (error) return end(error);
      iterate(index + 1);
    });
  };
  iterate(0);
};

/***************************************************************/

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

asyncIterator([1, 2, 3, 4, 5], processTasks, endAllTasks);
