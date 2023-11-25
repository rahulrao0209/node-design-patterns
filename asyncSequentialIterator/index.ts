/** Executes a list of asynchronous tasks in sequence. */
type Task<T> = T;
type ProcessorFn<Task> = (
  task: Task,
  callback: (error?: Error) => void
) => void;
type EndFn = (error?: Error) => void;

/**
 * Executes a list of asynchronous tasks in sequence.
 * @param tasks
 * @param processor
 * @param end
 */
export const asyncIterator = <T>(
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

export default asyncIterator;
