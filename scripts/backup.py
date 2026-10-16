#!/usr/bin/env python3
import os
import shutil
import zipfile
import datetime
import subprocess

def create_backup():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    source_dir = os.path.dirname(script_dir)
    parent_dir = os.path.dirname(source_dir)
    backup_dir = os.path.join(parent_dir, "Backups")
    os.makedirs(backup_dir, exist_ok=True)

    timestamp = datetime.datetime.now().strftime("%Y-%m-%d_%H%M%S")
    zip_filename = f"website_backup_{timestamp}.zip"
    zip_path = os.path.join(backup_dir, zip_filename)
    latest_path = os.path.join(backup_dir, "website_backup_latest.zip")

    exclude_dirs = {"node_modules", ".next"}
    
    print(f"📦 Starting website backup to: {zip_path}")
    count = 0
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_dir):
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            for f in files:
                full_path = os.path.join(root, f)
                rel_path = os.path.relpath(full_path, source_dir)
                zipf.write(full_path, arcname=os.path.join("Website", rel_path))
                count += 1

    shutil.copyfile(zip_path, latest_path)
    size_mb = os.path.getsize(zip_path) / (1024 * 1024)
    print(f"✅ Archive complete: {count} files packaged ({size_mb:.2f} MB)")
    print(f"📍 Latest backup pointer updated: {latest_path}")

    # Git snapshot tag
    try:
        tag_name = f"backup-{datetime.datetime.now().strftime('%Y%m%d-%H%M')}"
        subprocess.run(["git", "tag", "-a", tag_name, "-m", f"Automated backup snapshot {tag_name}"], cwd=source_dir, check=False)
        print(f"🔖 Created local git tag: {tag_name}")
    except Exception as e:
        print(f"⚠️ Git tag skipped: {e}")

if __name__ == "__main__":
    create_backup()
