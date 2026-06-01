use tauri::{
    menu::{MenuBuilder, SubmenuBuilder},
    Emitter,
};

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let playground_menu = SubmenuBuilder::new(app, "Playground")
                .text("playground_start", "Iniciar playground")
                .build()?;

            let menu = MenuBuilder::new(app).items(&[&playground_menu]).build()?;
            app.set_menu(menu)?;

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
