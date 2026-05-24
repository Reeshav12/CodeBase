from collections import defaultdict

def build_architecture_graph(file_tree: list, metadata: dict) -> dict:
    nodes = [{"id": "root", "type": "repoNode",
               "data": {"label": metadata["name"], "lang": metadata.get("language",""), "stars": metadata.get("stars",0), "url": metadata.get("url")},
               "position": {"x": 0, "y": 0}}]
    edges = []
    
    tree_struct = {}
    for item in file_tree:
        parts = item["path"].split("/")
        current = tree_struct
        for part in parts[:-1]:
            if part not in current: current[part] = {}
            current = current[part]
        if item["type"] == "blob":
            if "_files" not in current: current["_files"] = []
            current["_files"].append(parts[-1])

    node_count = 1
    max_nodes = 100
    repo_url = metadata.get("url", "")
    branch = metadata.get("default_branch", "main")
    
    def traverse(struct, parent_id, path_prefix=""):
        nonlocal node_count
        for key, value in struct.items():
            if key == "_files": continue
            if node_count >= max_nodes: break
            
            node_id = f"dir_{path_prefix.replace('/', '_')}{key}"
            file_count = len(value.get("_files", []))
            dir_url = f"{repo_url}/tree/{branch}/{path_prefix}{key}" if repo_url else ""
            
            nodes.append({
                "id": node_id, "type": "dirNode",
                "data": {"label": key, "fileCount": file_count, "url": dir_url},
                "position": {"x": 0, "y": 0}
            })
            
            edges.append({
                "id": f"e-{parent_id}-{node_id}",
                "source": parent_id,
                "target": node_id,
                "type": "smoothstep",
                "style": {"stroke": "#6366f1", "strokeWidth": 1.5}
            })
            
            node_count += 1

            files = value.get("_files", [])
            for f in files[:5]:
                if node_count >= max_nodes: break
                file_id = f"file_{path_prefix.replace('/', '_')}{key}_{f}"
                file_url = f"{repo_url}/blob/{branch}/{path_prefix}{key}/{f}" if repo_url else ""
                
                nodes.append({
                    "id": file_id, "type": "fileNode",
                    "data": {"label": f, "url": file_url},
                    "position": {"x": 0, "y": 0}
                })
                
                edges.append({
                    "id": f"e-{node_id}-{file_id}",
                    "source": node_id,
                    "target": file_id,
                    "type": "smoothstep",
                    "style": {"stroke": "#9ca3af", "strokeWidth": 1.0}
                })
                node_count += 1
            
            traverse(value, node_id, f"{path_prefix}{key}/")

    traverse(tree_struct, "root")
    
    root_files = tree_struct.get("_files", [])
    for f in root_files[:5]:
        if node_count >= max_nodes: break
        file_id = f"file_root_{f}"
        file_url = f"{repo_url}/blob/{branch}/{f}" if repo_url else ""
        nodes.append({
            "id": file_id, "type": "fileNode",
            "data": {"label": f, "url": file_url},
            "position": {"x": 0, "y": 0}
        })
        edges.append({
            "id": f"e-root-{file_id}",
            "source": "root",
            "target": file_id,
            "type": "smoothstep",
            "style": {"stroke": "#9ca3af", "strokeWidth": 1.0}
        })
        node_count += 1

    return {"nodes": nodes, "edges": edges}

