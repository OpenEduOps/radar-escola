#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{
    menu::{MenuBuilder, SubmenuBuilder},
    Emitter, Manager,
};

fn main() {
    tauri::Builder::default()
        .setup(|app| {
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
