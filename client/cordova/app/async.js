const Async = {
  serial: (tasks, cb) => {
    let i = 0, results = [];
    let running = () => {
      tasks[i]((err, data) => {
        if (err) return cb(err);
        results[i] = data;
        if (i == tasks.length - 1) return cb(null, results);
        i++;
        setTimeout(running, 0);
      });
    };
    setTimeout(running, 0);
  },
};

export default Async;
