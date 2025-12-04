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

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            read_directory,
            get_drives,
            search_files,
            get_parent_directory,
            get_quick_access
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
