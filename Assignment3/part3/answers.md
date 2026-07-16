# Part 3: Node Internals

## 1. What is the Node.js Event Loop?
The Event Loop is the mechanism Node.js uses to handle asynchronous operations without blocking the single main thread. Node runs your JS code on one thread, but instead of waiting for slow things (file reads, network calls, timers) to finish, it registers a callback for them and moves on. Once the call stack is empty, the event loop keeps checking different phases (timers, pending callbacks, poll, check, close callbacks) and picks up completed work, pushing the matching callbacks onto the call stack to run. This is what lets Node handle thousands of concurrent operations even though JavaScript itself is single-threaded.

## 2. What is Libuv and What Role Does It Play in Node.js?
Libuv is a C library that Node.js is built on top of. It's the part that actually provides the event loop, and it also manages a thread pool for things that can't be done asynchronously at the OS level (like some file system operations, DNS lookups, and crypto functions). Basically, Node.js itself doesn't implement the event loop or async I/O — libuv does that work under the hood, and Node just exposes it through JS APIs.

## 3. How Does Node.js Handle Asynchronous Operations Under the Hood?
When you call an async function (like `fs.readFile`), Node hands the operation off to libuv. If the OS supports doing it asynchronously (like networking on most platforms), libuv uses the OS's async mechanisms directly. If not (like some file system calls), libuv runs the operation on one of the threads in its thread pool so the main thread stays free. Once the operation finishes, libuv queues the callback, and the event loop eventually picks it up and executes it back on the main thread.

## 4. What is the Difference Between the Call Stack, Event Queue, and Event Loop in Node.js?
- **Call Stack**: Where JS code actually executes, function by function. It's synchronous — if something blocks here, everything blocks.
- **Event Queue (Callback Queue)**: Where callbacks from finished async operations wait until the call stack is empty and they can run.
- **Event Loop**: The loop that keeps checking "is the call stack empty? if so, take the next callback from the queue and push it onto the call stack." It's the thing that connects the queue to the stack.

## 5. What is the Node.js Thread Pool and How to Set the Thread Pool Size?
The thread pool is a set of worker threads (provided by libuv) that Node uses for operations that can't run asynchronously through the OS alone — things like some `fs` operations, DNS lookups (`dns.lookup`), and some `crypto` functions. By default it has 4 threads. You can change the size by setting the `UV_THREADPOOL_SIZE` environment variable before starting Node, e.g.:
```
UV_THREADPOOL_SIZE=8 node server.js
```
(Max is 128 threads, and it has to be set before the pool is created, so it won't work if you try to change it after Node has already started using it.)

## 6. How Does Node.js Handle Blocking and Non-Blocking Code Execution?
Non-blocking code (async functions, callbacks, promises) gets handed off to libuv/the OS, and Node continues executing the rest of the script without waiting — the result comes back later through the event loop. Blocking code (synchronous functions like `fs.readFileSync`, heavy loops, `JSON.parse` on huge data, etc.) runs directly on the main thread and stops everything else from executing until it finishes. That's why in Node you generally avoid sync versions of I/O functions in a server, since a single blocking call can freeze the whole app for every connected client until it's done.
