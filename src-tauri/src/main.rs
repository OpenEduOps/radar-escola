#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod playground;

use tauri::{
    menu::{MenuBuilder, SubmenuBuilder},
    Emitter, Manager,
};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            playground::playground_load,
            playground::playground_register_status,
            playground::playground_create_record,
            playground::playground_update_record,
            playground::playground_delete_record,
        ])
        .setup(|app| {
            let playground_database = playground::open_playground_database(app)
                .map_err(|error| std::io::Error::new(std::io::ErrorKind::Other, error))?;
            app.manage(playground_database);

            let playground_menu = SubmenuBuilder::new(app, "Playground")
                .text("playground_start", "Iniciar playground")
                .build()?;

            let menu = MenuBuilder::new(app).items(&[&playground_menu]).build()?;
            app.set_menu(menu)?;

            if let Some(window) = app.get_webview_window("main") {
                window.maximize()?;
            }

            app.on_menu_event(|app_handle, event| {
                if event.id().0.as_str() == "playground_start" {
                    let _ = app_handle.emit("playground-started", ());
                }
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("failed to run Radar Escola scaffold");
}
