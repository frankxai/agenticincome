#!/usr/bin/env python3
"""Create a deterministic private archive from the reviewed product manifest."""
import hashlib
import json
from pathlib import Path, PurePosixPath
import sys
import zipfile

root = Path(__file__).resolve().parents[1]
product = root / "products/hr-agency-launch-kit"
manifest_path = product / "manifest.json"
manifest = json.loads(manifest_path.read_text())
if manifest["productId"] != "hr-agency-launch-kit" or manifest["version"] != "0.2.0":
    raise SystemExit("Unexpected product/version")
if len(sys.argv) != 2:
    raise SystemExit("Usage: python3 scripts/package-hr-agency.py <output.zip>")
entries = []
seen = set()
for record in manifest["files"]:
    relative = PurePosixPath(record["path"])
    if relative.is_absolute() or ".." in relative.parts or str(relative) in seen:
        raise SystemExit("Invalid or repeated archive path")
    seen.add(str(relative))
    file = product / relative
    if file.is_symlink() or not file.resolve().is_relative_to(product.resolve()):
        raise SystemExit("Archive path escapes product directory")
    data = file.read_bytes()
    if hashlib.sha256(data).hexdigest() != record["sha256"]:
        raise SystemExit(f"Source changed after manifest: {relative}")
    entries.append((str(relative), data))
entries.append(("manifest.json", manifest_path.read_bytes()))
output = Path(sys.argv[1])
output.parent.mkdir(parents=True, exist_ok=True)
with zipfile.ZipFile(output, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
    for name, data in sorted(entries):
        info = zipfile.ZipInfo(f"hr-agency-launch-kit-v0.2.0/{name}", (2026, 9, 10, 0, 0, 0))
        info.compress_type = zipfile.ZIP_DEFLATED
        info.external_attr = 0o100644 << 16
        archive.writestr(info, data)
print(json.dumps({"archive": str(output), "fileCount": len(entries),
                  "sha256": hashlib.sha256(output.read_bytes()).hexdigest()}))
