// Workaround for Node v26.x on Windows NTFS where concurrent fs.promises.mkdir(parent)
// and fs.promises.mkdir(parent/child, { recursive: true }) in Next.js MultiFileWriter
// can fail with EPERM instead of EEXIST.
if (process.platform === "win32") {
  const fs = require("node:fs");
  const origMkdir = fs.promises.mkdir.bind(fs.promises);
  let queue = Promise.resolve();

  fs.promises.mkdir = function serializedMkdir(targetPath, options) {
    const run = queue.then(() => origMkdir(targetPath, options));
    queue = run.catch(() => {});
    return run;
  };
}
