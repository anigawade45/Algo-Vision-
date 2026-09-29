import React, { useState } from 'react';
import { Terminal, Code, Cpu, FileText, Share2, ShieldCheck, Check } from 'lucide-react';

export default function SystemCallExplorer() {
  const [selectedCat, setSelectedCat] = useState('process');

  const categories = {
    process: {
      name: 'Process Control',
      icon: Cpu,
      description: 'System calls for process creation, execution termination, signal management, and child waiting.',
      calls: [
        { name: 'fork()', desc: 'Clones calling process to create a new child process.' },
        { name: 'execve(path, argv, envp)', desc: 'Replaces current process memory image with a new executable program binary.' },
        { name: 'exit(status)', desc: 'Terminates calling process and releases resources.' },
        { name: 'wait(&status)', desc: 'Blocks parent process until a child process finishes execution.' }
      ],
      codeExample: `// Process Creation C Example
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main() {
    pid_t pid = fork(); // System Call
    if (pid == 0) {
        // Child Process
        printf("Child executing with PID: %d\\n", getpid());
        execlp("/bin/ls", "ls", "-l", NULL); // System Call
    } else {
        // Parent Process
        wait(NULL); // System Call
        printf("Child process completed.\\n");
    }
    return 0;
}`
    },
    file: {
      name: 'File Management',
      icon: FileText,
      description: 'System calls to create, open, read, write, seek, and close persistent storage files.',
      calls: [
        { name: 'open(pathname, flags, mode)', desc: 'Opens a file and returns an integer file descriptor (fd).' },
        { name: 'read(fd, buffer, count)', desc: 'Reads up to count bytes from file descriptor into buffer memory.' },
        { name: 'write(fd, buffer, count)', desc: 'Writes count bytes from buffer to specified file descriptor.' },
        { name: 'close(fd)', desc: 'Closes an open file descriptor and releases kernel file locks.' }
      ],
      codeExample: `// File Read/Write C Example
#include <fcntl.h>
#include <unistd.h>

int main() {
    int fd = open("log.txt", O_WRONLY | O_CREAT, 0644); // Syscall
    if (fd < 0) return 1;

    char msg[] = "AlgoVision OS System Call\\n";
    write(fd, msg, sizeof(msg) - 1); // Syscall
    close(fd); // Syscall
    return 0;
}`
    },
    communication: {
      name: 'Communication & IPC',
      icon: Share2,
      description: 'System calls for Inter-Process Communication (IPC), network sockets, and shared memory.',
      calls: [
        { name: 'pipe(pipefd)', desc: 'Creates a unidirectional data channel (IPC pipe).' },
        { name: 'socket(domain, type, protocol)', desc: 'Creates an endpoint for network communication.' },
        { name: 'shmget(key, size, flags)', desc: 'Allocates a System V shared memory segment.' },
        { name: 'connect(sockfd, addr, addrlen)', desc: 'Initiates a connection on a network socket.' }
      ],
      codeExample: `// Inter-Process Pipe C Example
#include <unistd.h>
#include <stdio.h>

int main() {
    int pipefd[2];
    pipe(pipefd); // System Call: Creates pipe
    
    if (fork() == 0) {
        close(pipefd[0]); // Close read end
        write(pipefd[1], "Hello", 5); // Write to pipe
    } else {
        close(pipefd[1]); // Close write end
        char buf[10];
        read(pipefd[0], buf, 5); // Read from pipe
    }
    return 0;
}`
    },
    protection: {
      name: 'Protection & Security',
      icon: ShieldCheck,
      description: 'System calls for file permissions, process UID/GID ownership, and access control lists.',
      calls: [
        { name: 'chmod(path, mode)', desc: 'Changes file permissions (read, write, execute).' },
        { name: 'chown(path, owner, group)', desc: 'Changes file ownership user ID and group ID.' },
        { name: 'umask(mask)', desc: 'Sets default file creation permission mask.' }
      ],
      codeExample: `// Permission Modification C Example
#include <sys/stat.h>

int main() {
    // Change file mode permissions to -rwxr-xr-x (0755)
    chmod("script.sh", S_IRWXU | S_IRGRP | S_IXGRP | S_IROTH | S_IXOTH);
    return 0;
}`
    }
  };

  const active = categories[selectedCat];

  return (
    <div className="space-y-6">
      {/* Category Selection Tabs */}
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-[#1E2638] pb-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              System Call Categories & API Code Explorer
            </h3>
            <p className="text-slate-550 dark:text-slate-400 text-xs">
              Explore POSIX system call categories and inspect C code implementations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.keys(categories).map((key) => {
            const cat = categories[key];
            const Icon = cat.icon;
            const isSelected = selectedCat === key;

            return (
              <button
                key={key}
                onClick={() => setSelectedCat(key)}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/10 border-cyan-500 text-cyan-600 dark:text-cyan-400 font-bold shadow-sm'
                    : 'bg-slate-50 dark:bg-[#070A12] border-slate-200 dark:border-[#1E2638] text-slate-600 dark:text-slate-400 hover:border-cyan-500/30'
                }`}
              >
                <Icon className="w-4 h-4 text-cyan-500 shrink-0" />
                <span className="text-xs font-mono font-bold">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Explorer Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* System Call List */}
        <div className="lg:col-span-6 bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm font-mono">
              {active.name} API Functions
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
              {active.description}
            </p>
          </div>

          <div className="space-y-3">
            {active.calls.map((sc, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-[#1E2638] space-y-1">
                <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 block">
                  {sc.name}
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-sans">
                  {sc.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Code Snippet Box */}
        <div className="lg:col-span-6 bg-[#070A12] border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>C Code Sample</span>
            </div>
            <span className="text-[10px] text-slate-500">POSIX Standard</span>
          </div>

          <pre className="text-xs text-slate-200 overflow-x-auto p-2 leading-relaxed font-mono">
            <code>{active.codeExample}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
