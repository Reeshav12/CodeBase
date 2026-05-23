from collections import defaultdict

EXT = {".py":"Python",".ts":"TypeScript",".tsx":"TypeScript/React",".js":"JavaScript",
       ".jsx":"JavaScript/React",".go":"Go",".rs":"Rust",".java":"Java",".cpp":"C++",
       ".c":"C",".cs":"C#",".rb":"Ruby",".php":"PHP",".vue":"Vue",".svelte":"Svelte",
       ".html":"HTML",".css":"CSS",".scss":"SCSS",".md":"Markdown",".sql":"SQL",
       ".yaml":"YAML",".yml":"YAML",".json":"JSON",".sh":"Shell",".toml":"TOML"}

CONFIGS = {"package.json":"Node.js","pyproject.toml":"Python","requirements.txt":"Python",
           "Cargo.toml":"Rust","go.mod":"Go","Dockerfile":"Docker","next.config.js":"Next.js",
           "vite.config.ts":"Vite","tailwind.config.ts":"Tailwind","tsconfig.json":"TypeScript",
           "docker-compose.yml":"Docker Compose","pom.xml":"Java/Maven","Gemfile":"Ruby"}

def analyze_file_tree(file_tree: list) -> dict:
    langs, dirs, configs = defaultdict(int), defaultdict(list), []
    total_files, total_size = 0, 0
    for item in file_tree:
        if item["type"] != "blob": continue
        total_files += 1
        total_size += item.get("size") or 0
        fname = item["path"].split("/")[-1]
        ext = "." + fname.rsplit(".", 1)[-1] if "." in fname else ""
        langs[EXT.get(ext.lower(), "Other")] += 1
        if fname in CONFIGS: configs.append({"file": fname, "tech": CONFIGS[fname]})
        parts = item["path"].split("/")
        if len(parts) >= 2: dirs[parts[0]].append(fname)
    return {
        "total_files": total_files,
        "total_size_kb": round(total_size / 1024, 1),
        "language_breakdown": dict(sorted(langs.items(), key=lambda x: -x[1])),
        "top_directories": {d: len(f) for d, f in sorted(dirs.items(), key=lambda x: -len(x[1]))[:12]},
        "detected_configs": configs,
        "detected_frameworks": list({c["tech"] for c in configs}),
    }
