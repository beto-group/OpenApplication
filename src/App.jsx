/**
 * App.jsx — Coordinator for OPEN APPLICATION.
 * Loads styles, AppCard, and AppLauncher, then mounts.
 */
function App(props) {
    const { folderPath, dc } = props;
    const { useState, useEffect } = dc;

    const [modules, setModules] = useState(null);
    const [error, setError] = useState(null);

    useEffect(function () {
        async function loadModules() {
            try {
                const [stylesModule, cardModule, launcherModule] = await Promise.all([
                    dc.require(folderPath + "/src/styles/styles.jsx"),
                    dc.require(folderPath + "/src/components/AppCard.jsx"),
                    dc.require(folderPath + "/src/components/AppLauncher.jsx")
                ]);

                setModules({
                    STYLES: stylesModule.STYLES,
                    AppCard: cardModule.AppCard,
                    AppLauncher: launcherModule.AppLauncher
                });
            } catch (e) {
                console.error("Open Application: Module loading failed:", e);
                setError(e);
            }
        }
        loadModules();
    }, [folderPath]);

    if (error) {
        return (
            <div style={{ color: "var(--text-error, #ef4444)", padding: "20px", fontFamily: "monospace", background: "var(--background-primary)", height: "100%" }}>
                <h3>Failed to load Open Application modules:</h3>
                <pre style={{ fontSize: "12px" }}>{error.stack || error.message}</pre>
            </div>
        );
    }

    if (!modules) {
        return (
            <div style={{ padding: "40px", color: "var(--text-muted)", fontFamily: "monospace", background: "var(--background-primary)", height: "100%" }}>
                Initializing Open Application...
            </div>
        );
    }

    const { STYLES, AppCard, AppLauncher } = modules;

    return (
        <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
            <AppLauncher
                dc={dc}
                styles={STYLES}
                AppCard={AppCard}
                folderPath={folderPath}
            />
        </div>
    );
}

return { App };
