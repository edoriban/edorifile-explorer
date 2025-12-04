// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use chrono::{DateTime, Local};
use serde::Serialize;
use std::fs;
use std::path::Path;
use walkdir::WalkDir;

/// Represents a file or directory entry
#[derive(Serialize, Clone)]
pub struct FileEntry {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
    pub size: u64,
    pub modified: String,
    pub extension: String,
}

/// Represents a drive on the system
#[derive(Serialize)]
pub struct DriveInfo {
    pub name: String,
    pub path: String,
    pub total_space: u64,
    pub free_space: u64,
}

/// Read the contents of a directory
#[tauri::command]
fn read_directory(path: String) -> Result<Vec<FileEntry>, String> {
    let dir_path = Path::new(&path);

    if !dir_path.exists() {
        return Err(format!("Path does not exist: {}", path));
    }

    if !dir_path.is_dir() {
        return Err(format!("Path is not a directory: {}", path));
    }

    let mut entries = Vec::new();

    let read_result = fs::read_dir(dir_path).map_err(|e| e.to_string())?;

    for entry in read_result {
        if let Ok(entry) = entry {
            if let Ok(metadata) = entry.metadata() {
                let modified = metadata
                    .modified()
                    .map(|time| {
                        let datetime: DateTime<Local> = time.into();
                        datetime.format("%Y-%m-%d %H:%M").to_string()
                    })
                    .unwrap_or_else(|_| String::from("-"));

                let extension = entry
                    .path()
                    .extension()
                    .map(|e| e.to_string_lossy().to_lowercase())
                    .unwrap_or_default();

                entries.push(FileEntry {
                    name: entry.file_name().to_string_lossy().to_string(),
                    path: entry.path().to_string_lossy().to_string(),
                    is_dir: metadata.is_dir(),
                    size: metadata.len(),
                    modified,
                    extension,
                });
            }
        }
    }

    // Sort: directories first, then by name (case-insensitive)
    entries.sort_by(|a, b| match (a.is_dir, b.is_dir) {
        (true, false) => std::cmp::Ordering::Less,
        (false, true) => std::cmp::Ordering::Greater,
        _ => a.name.to_lowercase().cmp(&b.name.to_lowercase()),
    });

    Ok(entries)
}

/// Get all available drives on Windows
#[tauri::command]
fn get_drives() -> Vec<DriveInfo> {
    let mut drives = Vec::new();

    // Check common drive letters on Windows
    for letter in 'A'..='Z' {
        let path = format!("{}:\\", letter);
        let path_obj = Path::new(&path);

        if path_obj.exists() {
            drives.push(DriveInfo {
                name: format!("Local Disk ({}:)", letter),
                path: path.clone(),
                total_space: 0,
                free_space: 0,
            });
        }
    }

    drives
}

/// Search for files matching a query
#[tauri::command]
fn search_files(
    path: String,
    query: String,
    max_results: Option<usize>,
) -> Result<Vec<FileEntry>, String> {
    let search_path = Path::new(&path);

    if !search_path.exists() {
        return Err(format!("Path does not exist: {}", path));
    }

    let query_lower = query.to_lowercase();
    let max = max_results.unwrap_or(100);
    let mut results = Vec::new();

    for entry in WalkDir::new(search_path)
        .max_depth(5) // Limit depth for performance
        .into_iter()
        .filter_map(|e| e.ok())
    {
        if results.len() >= max {
            break;
        }

        let file_name = entry.file_name().to_string_lossy().to_lowercase();

        if file_name.contains(&query_lower) {
            if let Ok(metadata) = entry.metadata() {
                let modified = metadata
                    .modified()
                    .map(|time| {
                        let datetime: DateTime<Local> = time.into();
                        datetime.format("%Y-%m-%d %H:%M").to_string()
                    })
                    .unwrap_or_else(|_| String::from("-"));

                let extension = entry
                    .path()
                    .extension()
                    .map(|e| e.to_string_lossy().to_lowercase())
                    .unwrap_or_default();

                results.push(FileEntry {
                    name: entry.file_name().to_string_lossy().to_string(),
                    path: entry.path().to_string_lossy().to_string(),
                    is_dir: metadata.is_dir(),
                    size: metadata.len(),
                    modified,
                    extension,
                });
            }
        }
    }

    // Sort: directories first, then by name
    results.sort_by(|a, b| match (a.is_dir, b.is_dir) {
        (true, false) => std::cmp::Ordering::Less,
        (false, true) => std::cmp::Ordering::Greater,
        _ => a.name.to_lowercase().cmp(&b.name.to_lowercase()),
    });

    Ok(results)
}

/// Get the parent directory of a path
#[tauri::command]
fn get_parent_directory(path: String) -> Option<String> {
    Path::new(&path)
        .parent()
        .map(|p| p.to_string_lossy().to_string())
}

/// Get quick access folders
#[tauri::command]
fn get_quick_access() -> Vec<FileEntry> {
    let mut folders = Vec::new();

    if let Some(home) = std::env::var_os("USERPROFILE") {
        let home_path = Path::new(&home);

        let quick_folders = [
            ("Desktop", "Desktop"),
            ("Downloads", "Downloads"),
            ("Documents", "Documents"),
            ("Pictures", "Pictures"),
            ("Music", "Music"),
            ("Videos", "Videos"),
        ];

        for (name, folder) in quick_folders {
            let folder_path = home_path.join(folder);
            if folder_path.exists() {
                folders.push(FileEntry {
                    name: name.to_string(),
                    path: folder_path.to_string_lossy().to_string(),
                    is_dir: true,
                    size: 0,
                    modified: String::new(),
                    extension: String::new(),
                });
            }
        }
    }

    folders
}

/// Create a new folder
#[tauri::command]
fn create_folder(path: String, name: String) -> Result<String, String> {
    let folder_path = Path::new(&path).join(&name);

    if folder_path.exists() {
        return Err(format!("A folder named '{}' already exists", name));
    }

    fs::create_dir(&folder_path).map_err(|e| e.to_string())?;

    Ok(folder_path.to_string_lossy().to_string())
}

/// Rename a file or folder
#[tauri::command]
fn rename_item(old_path: String, new_name: String) -> Result<String, String> {
    let old = Path::new(&old_path);

    if !old.exists() {
        return Err(format!("Item does not exist: {}", old_path));
    }

    let parent = old.parent().ok_or("Cannot get parent directory")?;
    let new_path = parent.join(&new_name);

    if new_path.exists() {
        return Err(format!("An item named '{}' already exists", new_name));
    }

    fs::rename(&old_path, &new_path).map_err(|e| e.to_string())?;

    Ok(new_path.to_string_lossy().to_string())
}

/// Delete a file or folder
#[tauri::command]
fn delete_item(path: String) -> Result<(), String> {
    let item_path = Path::new(&path);

    if !item_path.exists() {
        return Err(format!("Item does not exist: {}", path));
    }

    if item_path.is_dir() {
        fs::remove_dir_all(&path).map_err(|e| e.to_string())?;
    } else {
        fs::remove_file(&path).map_err(|e| e.to_string())?;
    }

    Ok(())
}

/// Copy a file or folder to destination with smart naming
#[tauri::command]
fn copy_item(source: String, destination: String) -> Result<String, String> {
    let src = Path::new(&source);
    let src_name = src.file_name().ok_or("Cannot get file name")?;
    let dest_dir = Path::new(&destination);

    if !src.exists() {
        return Err(format!("Source does not exist: {}", source));
    }

    // Generate unique name if destination exists
    let dest_path = get_unique_path(dest_dir, src_name.to_str().unwrap_or(""), src.is_dir());

    if src.is_dir() {
        copy_dir_recursive(src, &dest_path)?;
    } else {
        fs::copy(&source, &dest_path).map_err(|e| e.to_string())?;
    }

    Ok(dest_path.to_string_lossy().to_string())
}

/// Generate a unique path by adding (1), (2), etc. if file exists
fn get_unique_path(dest_dir: &Path, name: &str, is_dir: bool) -> std::path::PathBuf {
    let mut dest_path = dest_dir.join(name);

    if !dest_path.exists() {
        return dest_path;
    }

    // Separate name and extension
    let (base_name, extension) = if is_dir {
        (name.to_string(), String::new())
    } else {
        let path = Path::new(name);
        let ext = path
            .extension()
            .map(|e| format!(".{}", e.to_string_lossy()))
            .unwrap_or_default();
        let stem = path
            .file_stem()
            .map(|s| s.to_string_lossy().to_string())
            .unwrap_or_else(|| name.to_string());
        (stem, ext)
    };

    // Try adding (1), (2), etc.
    let mut counter = 1;
    loop {
        let new_name = format!("{} ({}){}", base_name, counter, extension);
        dest_path = dest_dir.join(&new_name);
        if !dest_path.exists() {
            return dest_path;
        }
        counter += 1;
        if counter > 1000 {
            // Safety limit
            break;
        }
    }

    dest_path
}

/// Helper function to copy directories recursively
fn copy_dir_recursive(src: &Path, dest: &Path) -> Result<(), String> {
    fs::create_dir_all(dest).map_err(|e| e.to_string())?;

    for entry in fs::read_dir(src).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let src_path = entry.path();
        let dest_path = dest.join(entry.file_name());

        if src_path.is_dir() {
            copy_dir_recursive(&src_path, &dest_path)?;
        } else {
            fs::copy(&src_path, &dest_path).map_err(|e| e.to_string())?;
        }
    }

    Ok(())
}

/// Move a file or folder to destination
#[tauri::command]
fn move_item(source: String, destination: String) -> Result<String, String> {
    let src = Path::new(&source);
    let src_name = src.file_name().ok_or("Cannot get file name")?;
    let dest_path = Path::new(&destination).join(src_name);

    if !src.exists() {
        return Err(format!("Source does not exist: {}", source));
    }

    if dest_path.exists() {
        return Err(format!(
            "Destination already exists: {}",
            dest_path.display()
        ));
    }

    // Try simple rename first (works if same filesystem)
    if fs::rename(&source, &dest_path).is_ok() {
        return Ok(dest_path.to_string_lossy().to_string());
    }

    // If rename fails (cross-filesystem), copy then delete
    if src.is_dir() {
        copy_dir_recursive(src, &dest_path)?;
        fs::remove_dir_all(&source).map_err(|e| e.to_string())?;
    } else {
        fs::copy(&source, &dest_path).map_err(|e| e.to_string())?;
        fs::remove_file(&source).map_err(|e| e.to_string())?;
    }

    Ok(dest_path.to_string_lossy().to_string())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            read_directory,
            get_drives,
            search_files,
            get_parent_directory,
            get_quick_access,
            create_folder,
            rename_item,
            delete_item,
            copy_item,
            move_item
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
