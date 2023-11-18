/** Executes a list of asynchronous tasks in sequence. */
type Task<T> = T;
type ProcessorFn<Task> = (
  task: Task,
  callback: (error?: Error) => void
) => void;
type EndFn = (error?: Error) => void;

const asyncIterator = <T>(
  tasks: Task<T>[],
  processor: ProcessorFn<T>,
  end: EndFn
) => {
  const iterate = async (index: number) => {
    if (index === tasks.length) return end();
    const task = tasks[index];

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
  setTimeout(() => {
    console.log(`Processing task ${task}`);
    callback();
  }, 1200);
};

const endAllTasks = (error?: Error) => {
  if (error) console.error(error.message);
  console.log("Processing finished.");
};

asyncIterator([1, 2, 3], processTasks, endAllTasks);
