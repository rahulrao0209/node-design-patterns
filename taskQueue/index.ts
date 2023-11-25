/**
 * TaskQueue can be used to combine a queue with the algorithm to
 * limit the number of concurrent tasks being handled.
 */
import { EventEmitter } from "events";

type Task<T> = T;
type ProcessorFn<Task> = (
  task: Task,
  callback: (error?: Error) => void
) => void;

export class TaskQueue<T> extends EventEmitter {
  #limit: number;
  #running: number;
  #queue: Task<T>[];
  #processorFn: ProcessorFn<Task<T>>;

  constructor(processor: ProcessorFn<Task<T>>, limit: number = 5) {
    super();
    this.#limit = limit;
    this.#running = 0;
    this.#queue = [];
    this.#processorFn = processor;
  }

  push(task: Task<T>, ...rest: Task<T>[]) {
    this.#queue.push(task);
    if (rest.length) this.#queue.push(...rest);
    process.nextTick(this.next.bind(this));
    return this;
  }

  next() {
    if (this.running === 0 && this.queue.length === 0)
      return this.emit("emptyqueue");
    while (this.running < this.limit && this.queue.length) {
      const task = this.#queue.shift()!;
      this.#processorFn(task, (error: Error | undefined) => {
        if (error) this.emit("error", error);
        this.#running -= 1;
        process.nextTick(this.next.bind(this));
      });
      this.#running += 1;
    }
  }

  get limit(): number {
    return this.#limit;
  }

  get running(): number {
    return this.#running;
  }

  get queue(): Task<T>[] {
    return this.#queue;
  }
}

export default TaskQueue;
