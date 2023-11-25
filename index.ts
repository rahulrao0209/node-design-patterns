import asyncIterator from "./asyncSequentialIterator";
import asyncParallelIterator from "./asyncParallelIterator";
import TaskQueue from "./taskQueue";
import { EventEmitter } from "events";

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

// Sequential async execution.
// asyncIterator([1, 2, 3, 4, 5, 6, 7, 8], processTasks, endAllTasks);

// Parallel async execution.
// asyncParallelIterator([1, 2, 3, 4, 5, 6, 7, 8], processTasks, endAllTasks);

// Limited parallel async execution
// asyncParallelIterator([1, 2, 3, 4, 5, 6, 7, 8], processTasks, endAllTasks, 2);

// Limited parallel async execution using the TaskQueue
const taskQ = new TaskQueue(processTasks, 2);
const emitter = new EventEmitter();
taskQ.push(1, 2, 3, 4, 5, 6, 7, 8);
emitter.on("queueempty", () => "All tasks processed");
emitter.on("error", endAllTasks);
