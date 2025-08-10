[12:03:57.034] Running build in Washington, D.C., USA (East) – iad1
[12:03:57.034] Build machine configuration: 2 cores, 8 GB
[12:03:57.083] Cloning github.com/Dexxservice/Portalstatus (Branch: Dexxservice-patch-2, Commit: 9e74314)
[12:03:57.318] Cloning completed: 235.000ms
[12:03:58.058] Restored build cache from previous deployment (3C7NTC4GnZfwGNCzi7fkbYQdxJht)
[12:04:00.919] Running "vercel build"
[12:04:01.358] Vercel CLI 44.7.3
[12:04:01.655] Installing dependencies...
[12:04:02.495] 
[12:04:02.496] up to date in 605ms
[12:04:02.497] 
[12:04:02.497] 15 packages are looking for funding
[12:04:02.497]   run `npm fund` for details
[12:04:02.526] Detected Next.js version: 14.2.5
[12:04:02.529] Running "npm run build"
[12:04:02.641] 
[12:04:02.642] > dexx-visa-portal@0.1.1 build
[12:04:02.642] > next build
[12:04:02.642] 
[12:04:03.369]   ▲ Next.js 14.2.5
[12:04:03.371] 
[12:04:03.371]    Linting and checking validity of types ...
[12:04:06.875] Failed to compile.
[12:04:06.876] 
[12:04:06.876] ./pages/index.tsx:22:5
[12:04:06.876] Type error: Cannot find name 'cons'.
[12:04:06.876] 
[12:04:06.876] [0m [90m 20 |[39m   useEffect(() [33m=>[39m {[0m
[12:04:06.876] [0m [90m 21 |[39m     [36mconst[39m params [33m=[39m [36mnew[39m [33mURLSearchParams[39m(window[33m.[39mlocation[33m.[39msearch)[33m;[39m[0m
[12:04:06.876] [0m[31m[1m>[22m[39m[90m 22 |[39m     cons[0m
[12:04:06.876] [0m [90m    |[39m     [31m[1m^[22m[39m[0m
[12:04:06.876] [0m [90m 23 |[39m[0m
[12:04:06.916] Error: Command "npm run build" exited with 1
